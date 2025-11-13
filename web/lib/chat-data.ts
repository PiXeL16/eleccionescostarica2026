// ABOUTME: Data access layer for chat AI to query party information
// ABOUTME: Provides semantic search and context retrieval for RAG-based chat

import Database from 'better-sqlite3';
import { OpenAI } from 'openai';
import { join } from 'path';
import * as sqliteVec from 'sqlite-vec';
import type { Category, Party } from './database';

// Database path (shared with pipeline)
const DB_PATH = join(process.cwd(), '..', 'data', 'database.db');

// OpenAI client for embedding generation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Database singleton
let db: Database.Database | null = null;

function getDatabase() {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true, fileMustExist: true });

    // Load sqlite-vec extension (may fail during build in Docker)
    try {
      sqliteVec.load(db);
    } catch (error) {
      // sqlite-vec not available - semantic search will not work but basic queries will
      console.warn('sqlite-vec extension could not be loaded:', error);
    }
  }
  return db;
}

/**
 * Search result from FTS5 index
 */
export interface SearchResult {
  party_id: number;
  category_id: number;
  summary: string;
  key_proposals: string;
  ideology_position: string | null;
  budget_mentioned: string | null;
  rank: number;
}

/**
 * Full context for a party including all positions and metadata
 */
export interface PartyContext {
  party: Party;
  categories: (Category & {
    summary: string;
    key_proposals: string[];
    ideology_position: string | null;
    budget_mentioned: string | null;
  })[];
  fullText: string | null;
}

/**
 * Semantic search result from vector similarity
 */
export interface SemanticSearchResult {
  party_id: number;
  party_name: string;
  party_abbreviation: string;
  document_id: number;
  page_number: number;
  chunk_text: string;
  similarity: number;
}

/**
 * Search party positions using FTS5 full-text search
 * Only searches within a specific party if partyId is provided
 *
 * @param query - Search query string
 * @param partyId - Optional party ID to restrict search to single party
 * @param limit - Maximum number of results (default: 5)
 * @returns Array of search results ranked by relevance
 */
export function searchPartyPositions(
  query: string,
  partyId?: number,
  limit: number = 5
): SearchResult[] {
  const db = getDatabase();

  // FTS5 query with optional party filter
  let sql = `
    SELECT
      pp.party_id,
      pp.category_id,
      pp.summary,
      pp.key_proposals,
      pp.ideology_position,
      pp.budget_mentioned,
      fts.rank
    FROM party_positions_fts fts
    JOIN party_positions pp ON fts.rowid = pp.id
    WHERE party_positions_fts MATCH ?
  `;

  const params: (string | number)[] = [query];

  if (partyId !== undefined) {
    sql += ' AND pp.party_id = ?';
    params.push(partyId);
  }

  sql += ' ORDER BY fts.rank LIMIT ?';
  params.push(limit);

  const stmt = db.prepare(sql);
  return stmt.all(...params) as SearchResult[];
}

/**
 * Get complete context for a party to inject into LLM prompt
 * Includes all categories, positions, proposals, and optionally full document text
 *
 * @param partyId - ID of the party
 * @param includeFullText - Whether to include full PDF text (default: false, as it can be very large)
 * @returns Complete party context for RAG
 */
export function getPartyContext(
  partyId: number,
  includeFullText: boolean = false
): PartyContext | null {
  const db = getDatabase();

  // Get party info
  const partyStmt = db.prepare('SELECT * FROM parties WHERE id = ?');
  const party = partyStmt.get(partyId) as Party | undefined;

  if (!party) return null;

  // Get all positions with categories
  const positionsStmt = db.prepare(`
    SELECT
      pp.summary,
      pp.key_proposals,
      pp.ideology_position,
      pp.budget_mentioned,
      c.id as category_id,
      c.category_key,
      c.name as category_name,
      c.description as category_description,
      c.display_order
    FROM party_positions pp
    JOIN categories c ON pp.category_id = c.id
    WHERE pp.party_id = ? AND c.active = 1
    ORDER BY c.display_order
  `);

  interface PositionRow {
    summary: string;
    key_proposals: string;
    ideology_position: string | null;
    budget_mentioned: string | null;
    category_id: number;
    category_key: string;
    category_name: string;
    category_description: string;
    display_order: number;
  }

  const positions = positionsStmt.all(partyId) as PositionRow[];

  // Transform to category-centric view
  const categories = positions.map((pos) => ({
    id: pos.category_id,
    category_key: pos.category_key,
    name: pos.category_name,
    description: pos.category_description,
    prompt_context: null,
    display_order: pos.display_order,
    active: 1,
    created_at: '',
    summary: pos.summary,
    key_proposals: JSON.parse(pos.key_proposals) as string[],
    ideology_position: pos.ideology_position,
    budget_mentioned: pos.budget_mentioned,
  }));

  // Optionally get full document text
  let fullText: string | null = null;
  if (includeFullText) {
    const docStmt = db.prepare('SELECT id FROM documents WHERE party_id = ?');
    const doc = docStmt.get(partyId) as { id: number } | undefined;

    if (doc) {
      const textStmt = db.prepare(
        'SELECT raw_text FROM document_text WHERE document_id = ? ORDER BY page_number'
      );
      const results = textStmt.all(doc.id) as { raw_text: string }[];

      if (results.length > 0) {
        fullText = results.map((r) => r.raw_text).join('\n\n');
      }
    }
  }

  return {
    party,
    categories,
    fullText,
  };
}

/**
 * Get list of all parties for chat UI selector
 */
export function getAllPartiesForChat(): Pick<Party, 'id' | 'name' | 'abbreviation'>[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT id, name, abbreviation FROM parties ORDER BY name');
  return stmt.all() as Pick<Party, 'id' | 'name' | 'abbreviation'>[];
}

/**
 * Generate embedding for a query using OpenAI API
 * @param query - The query text to embed
 * @returns Float32Array of embedding values
 */
async function generateQueryEmbedding(query: string): Promise<Float32Array> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  return new Float32Array(response.data[0].embedding);
}

/**
 * Semantic search across party documents using vector similarity
 * Searches through embedded PDF text chunks for relevant content
 *
 * @param query - Natural language query
 * @param partyIds - Optional array of party IDs to restrict search (undefined = all parties)
 * @param limit - Maximum number of results (default: 10)
 * @returns Array of search results ranked by similarity
 */
export async function semanticSearch(
  query: string,
  partyIds?: number[],
  limit: number = 10
): Promise<SemanticSearchResult[]> {
  const db = getDatabase();

  // Generate embedding for the query
  const queryEmbedding = await generateQueryEmbedding(query);

  // Convert Float32Array to Buffer for SQLite
  const embeddingBuffer = Buffer.from(queryEmbedding.buffer);

  // Build SQL query with optional party filter
  let sql = `
    SELECT
      p.id as party_id,
      p.name as party_name,
      p.abbreviation as party_abbreviation,
      dt.document_id,
      dt.page_number,
      de.chunk_text,
      vec_distance_cosine(de.embedding, ?) as distance
    FROM document_embeddings de
    JOIN document_text dt ON de.document_text_id = dt.id
    JOIN documents d ON dt.document_id = d.id
    JOIN parties p ON d.party_id = p.id
  `;

  const params: (Buffer | number)[] = [embeddingBuffer];

  // Add party filter if provided
  if (partyIds && partyIds.length > 0) {
    const placeholders = partyIds.map(() => '?').join(',');
    sql += ` WHERE p.id IN (${placeholders})`;
    params.push(...partyIds);
  }

  sql += `
    ORDER BY distance ASC
    LIMIT ?
  `;
  params.push(limit);

  const stmt = db.prepare(sql);
  const results = stmt.all(...params) as Array<{
    party_id: number;
    party_name: string;
    party_abbreviation: string;
    document_id: number;
    page_number: number;
    chunk_text: string;
    distance: number;
  }>;

  // Convert distance to similarity (1 - distance for cosine)
  return results.map((row) => ({
    party_id: row.party_id,
    party_name: row.party_name,
    party_abbreviation: row.party_abbreviation,
    document_id: row.document_id,
    page_number: row.page_number,
    chunk_text: row.chunk_text,
    similarity: 1 - row.distance,
  }));
}

/**
 * Format party context as a text block for LLM injection
 * Creates a structured prompt with all party information
 */
export function formatPartyContextForPrompt(context: PartyContext): string {
  const { party, categories } = context;

  let prompt = `# ${party.name} (${party.abbreviation})\n\n`;

  prompt += `A continuación se presenta la información completa sobre las posiciones políticas de ${party.name}, extraída directamente de su plataforma electoral oficial.\n\n`;

  for (const category of categories) {
    prompt += `## ${category.name}\n\n`;

    if (category.summary) {
      prompt += `**Resumen:** ${category.summary}\n\n`;
    }

    if (category.key_proposals.length > 0) {
      prompt += `**Propuestas clave:**\n`;
      for (const proposal of category.key_proposals) {
        prompt += `- ${proposal}\n`;
      }
      prompt += '\n';
    }

    if (category.ideology_position) {
      prompt += `**Posición ideológica:** ${category.ideology_position}\n\n`;
    }

    if (category.budget_mentioned) {
      prompt += `**Presupuesto mencionado:** ${category.budget_mentioned}\n\n`;
    }
  }

  prompt += `\n---\n\n`;
  prompt += `IMPORTANTE: Toda la información anterior proviene directamente de la plataforma electoral oficial de ${party.name}. `;
  prompt += `Solo utiliza esta información para responder preguntas. No inventes ni supongas información que no esté explícitamente mencionada arriba.`;

  return prompt;
}
