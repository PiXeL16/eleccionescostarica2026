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
  ballot_position: number;
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

export interface Document {
  id: number;
  party_id: number;
  file_path: string;
  title: string | null;
  upload_date: string;
  status: string;
  word_count: number | null;
  extracted_at: string | null;
  created_at: string;
  source_url: string | null;
}

export interface Person {
  id: number;
  full_name: string;
  party_id: number;
  role: string;
  profession: string | null;
  age: number | null;
  date_of_birth: string | null;
  profile_description: string | null;
  photo_filename: string | null;
  education: string | null; // JSON string
  family_notes: string | null;
  ideology: string | null;
  nickname: string | null;
  created_at: string;
}

export interface RunningMate {
  id: number;
  candidate_id: number;
  full_name: string;
  position: string;
  profile_description: string | null;
  created_at: string;
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
  const stmt = db.prepare('SELECT * FROM parties ORDER BY ballot_position');
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

  interface PositionWithCategory {
    id: number;
    party_id: number;
    category_id: number;
    document_id: number;
    summary: string;
    key_proposals: string;
    ideology_position: string | null;
    budget_mentioned: string | null;
    confidence_score: number | null;
    tokens_used: number | null;
    cost_usd: number | null;
    created_at: string;
    category_key: string;
    category_name: string;
    category_description: string;
    display_order: number;
  }

  const rows = stmt.all(partyId) as PositionWithCategory[];

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
 * Get all party positions (for filtering)
 * Returns minimal data needed for filtering logic
 */
export function getAllPositions(): Pick<
  PartyPosition,
  'party_id' | 'ideology_position' | 'budget_mentioned'
>[] {
  const db = getDatabase();
  const stmt = db.prepare(
    'SELECT party_id, ideology_position, budget_mentioned FROM party_positions'
  );
  return stmt.all() as Pick<PartyPosition, 'party_id' | 'ideology_position' | 'budget_mentioned'>[];
}

/**
 * Get document for a party
 */
export function getPartyDocument(partyId: number): Document | undefined {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM documents WHERE party_id = ?');
  return stmt.get(partyId) as Document | undefined;
}

/**
 * Get extracted text for a document (concatenates all pages)
 */
export function getDocumentText(documentId: number): string | null {
  const db = getDatabase();
  const stmt = db.prepare(
    'SELECT raw_text FROM document_text WHERE document_id = ? ORDER BY page_number'
  );
  const results = stmt.all(documentId) as { raw_text: string }[];

  if (results.length === 0) return null;

  return results.map((r) => r.raw_text).join('\n\n');
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
export function compareParties(slugs: string[]): {
  parties: Party[];
  categories: Category[];
  positions: Map<string, Map<string, PartyPosition>>;
} {
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

/**
 * Get all presidential candidates
 */
export function getAllCandidates(): Person[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM people WHERE role = ? ORDER BY full_name');
  return stmt.all('candidato presidencial') as Person[];
}

/**
 * Get candidate by party abbreviation
 */
export function getCandidateByParty(partyAbbreviation: string): Person | null {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT p.* FROM people p
    JOIN parties pt ON p.party_id = pt.id
    WHERE pt.abbreviation = ? AND p.role = ?
  `);
  return (stmt.get(partyAbbreviation.toUpperCase(), 'candidato presidencial') as Person) || null;
}

/**
 * Get running mates for a candidate
 */
export function getRunningMates(candidateId: number): RunningMate[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM running_mates WHERE candidate_id = ? ORDER BY position');
  return stmt.all(candidateId) as RunningMate[];
}

/**
 * Get candidate with running mates by party abbreviation
 */
export function getCandidateWithRunningMates(
  partyAbbreviation: string
): (Person & { running_mates: RunningMate[] }) | null {
  const candidate = getCandidateByParty(partyAbbreviation);
  if (!candidate) return null;

  const runningMates = getRunningMates(candidate.id);

  return {
    ...candidate,
    running_mates: runningMates,
  };
}

/**
 * Get all parties with their positions for ideology analysis
 */
export function getAllPartiesWithPositions(): Array<{
  party: Party;
  positions: Array<{
    summary: string;
    key_proposals: string | null;
    category: { category_key: string; name: string };
  }>;
}> {
  const parties = getAllParties();

  return parties.map((party) => {
    const positions = getPartyPositions(party.id).map((p) => ({
      summary: p.summary,
      key_proposals: p.key_proposals,
      category: {
        category_key: p.category.category_key,
        name: p.category.name,
      },
    }));

    return {
      party,
      positions,
    };
  });
}
