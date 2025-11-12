// ABOUTME: Database connection layer for SQLite using better-sqlite3
// ABOUTME: Provides read-only access to political party data

import Database from 'better-sqlite3';
import { join } from 'path';

// Database path (shared with pipeline)
const DB_PATH = join(process.cwd(), '..', 'data', 'database.db');

// Types
export interface Party {
  id: number;
  name: string;
  abbreviation: string;
  folder_name: string;
  created_at: string;
}

export interface Category {
  id: number;
  category_key: string;
  name: string;
  description: string;
  prompt_context: string | null;
  display_order: number;
  active: number;
  created_at: string;
}

export interface PartyPosition {
  id: number;
  party_id: number;
  category_id: number;
  document_id: number;
  summary: string;
  key_proposals: string; // JSON array
  ideology_position: string | null;
  budget_mentioned: string | null;
  confidence_score: number | null;
  tokens_used: number | null;
  cost_usd: number | null;
  created_at: string;
}

export interface PartyWithPositions extends Party {
  positions: (PartyPosition & { category: Category })[];
}

// Database singleton
let db: Database.Database | null = null;

function getDatabase() {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  }
  return db;
}

/**
 * Get all political parties
 */
export function getAllParties(): Party[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM parties ORDER BY name');
  return stmt.all() as Party[];
}

/**
 * Get a specific party by slug (abbreviation)
 */
export function getPartyBySlug(slug: string): Party | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM parties WHERE abbreviation = ?');
  return (stmt.get(slug.toUpperCase()) as Party) || null;
}

/**
 * Get all categories
 */
export function getAllCategories(): Category[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM categories WHERE active = 1 ORDER BY display_order');
  return stmt.all() as Category[];
}

/**
 * Get a category by key
 */
export function getCategoryByKey(key: string): Category | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM categories WHERE category_key = ? AND active = 1');
  return (stmt.get(key) as Category) || null;
}

/**
 * Get party positions for a specific party
 */
export function getPartyPositions(partyId: number): (PartyPosition & { category: Category })[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT
      pp.*,
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

  const rows = stmt.all(partyId) as any[];

  return rows.map((row) => ({
    id: row.id,
    party_id: row.party_id,
    category_id: row.category_id,
    document_id: row.document_id,
    summary: row.summary,
    key_proposals: row.key_proposals,
    ideology_position: row.ideology_position,
    budget_mentioned: row.budget_mentioned,
    confidence_score: row.confidence_score,
    tokens_used: row.tokens_used,
    cost_usd: row.cost_usd,
    created_at: row.created_at,
    category: {
      id: row.category_id,
      category_key: row.category_key,
      name: row.category_name,
      description: row.category_description,
      prompt_context: null,
      display_order: row.display_order,
      active: 1,
      created_at: '',
    },
  }));
}

/**
 * Get document for a party
 */
export function getPartyDocument(partyId: number) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM documents WHERE party_id = ?');
  return stmt.get(partyId);
}

/**
 * Get extracted text for a document (concatenates all pages)
 */
export function getDocumentText(documentId: number): string | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT raw_text FROM document_text WHERE document_id = ? ORDER BY page_number');
  const results = stmt.all(documentId) as { raw_text: string }[];

  if (results.length === 0) return null;

  return results.map(r => r.raw_text).join('\n\n');
}

/**
 * Get a specific party with all its positions
 */
export function getPartyWithPositions(slug: string): PartyWithPositions | null {
  const party = getPartyBySlug(slug);
  if (!party) return null;

  const positions = getPartyPositions(party.id);

  return {
    ...party,
    positions,
  };
}

/**
 * Compare multiple parties (for comparison page)
 */
export function compareParties(
  slugs: string[]
): { parties: Party[]; categories: Category[]; positions: Map<string, Map<string, PartyPosition>> } {
  const parties = slugs.map((slug) => getPartyBySlug(slug)).filter((p): p is Party => p !== null);
  const categories = getAllCategories();

  // Build a map of party slug -> category key -> position
  const positions = new Map<string, Map<string, PartyPosition>>();

  for (const party of parties) {
    const partyPositions = getPartyPositions(party.id);
    const positionMap = new Map<string, PartyPosition>();

    for (const pos of partyPositions) {
      positionMap.set(pos.category.category_key, pos);
    }

    positions.set(party.abbreviation, positionMap);
  }

  return { parties, categories, positions };
}
