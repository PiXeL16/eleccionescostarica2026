# ABOUTME: SQLite database schema and operations for political party analysis
# ABOUTME: Supports flexible category system with retroactive analysis capability

import sqlite3
import json
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List, Any
from contextlib import contextmanager


class Database:
    """Main database interface for political party analysis."""

    def __init__(self, db_path: str):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize_schema()

    @contextmanager
    def get_connection(self):
        """Context manager for database connections."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Return rows as dicts
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    def _initialize_schema(self):
        """Create all database tables if they don't exist."""
        with self.get_connection() as conn:
            cursor = conn.cursor()

            # Parties table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS parties (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE,
                    abbreviation TEXT UNIQUE,
                    folder_name TEXT,
                    ideology TEXT,
                    website TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Documents table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    party_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    document_type TEXT DEFAULT 'plan_gobierno',
                    file_path TEXT NOT NULL UNIQUE,
                    file_hash TEXT UNIQUE,
                    page_count INTEGER,
                    word_count INTEGER,
                    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE
                )
            """)

            # Extracted text cache (run once, reused for all categories)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS document_text (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    document_id INTEGER NOT NULL,
                    page_number INTEGER,
                    raw_text TEXT NOT NULL,
                    markdown_text TEXT,
                    extraction_method TEXT DEFAULT 'pymupdf',
                    extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
                )
            """)

            # Categories (dynamic, can be added anytime)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    category_key TEXT NOT NULL UNIQUE,
                    name TEXT NOT NULL,
                    description TEXT,
                    prompt_context TEXT,
                    display_order INTEGER,
                    active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Party positions (main analysis results)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS party_positions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    party_id INTEGER NOT NULL,
                    document_id INTEGER NOT NULL,
                    category_id INTEGER NOT NULL,
                    summary TEXT NOT NULL,
                    key_proposals TEXT,
                    ideology_position TEXT,
                    budget_mentioned TEXT,
                    confidence_score REAL,
                    raw_llm_response TEXT,
                    tokens_used INTEGER,
                    cost_usd REAL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (party_id) REFERENCES parties(id),
                    FOREIGN KEY (document_id) REFERENCES documents(id),
                    FOREIGN KEY (category_id) REFERENCES categories(id),
                    UNIQUE(party_id, document_id, category_id)
                )
            """)

            # Category processing status (tracks which categories are completed per document)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS category_processing_status (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    document_id INTEGER NOT NULL,
                    category_id INTEGER NOT NULL,
                    status TEXT NOT NULL DEFAULT 'pending',
                    started_at TIMESTAMP,
                    completed_at TIMESTAMP,
                    error_message TEXT,
                    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
                    FOREIGN KEY (category_id) REFERENCES categories(id),
                    UNIQUE(document_id, category_id)
                )
            """)

            # Processing log
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS processing_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    document_id INTEGER,
                    category_id INTEGER,
                    stage TEXT NOT NULL,
                    status TEXT NOT NULL,
                    error_message TEXT,
                    tokens_used INTEGER,
                    cost_usd REAL,
                    duration_seconds REAL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (document_id) REFERENCES documents(id),
                    FOREIGN KEY (category_id) REFERENCES categories(id)
                )
            """)

            # Create indexes
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_documents_party ON documents(party_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_document_text_doc ON document_text(document_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_positions_party ON party_positions(party_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_positions_category ON party_positions(category_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_positions_party_cat ON party_positions(party_id, category_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_processing_status ON category_processing_status(document_id, category_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_processing_log_doc ON processing_log(document_id)")

            # Full-text search on summaries and proposals
            cursor.execute("""
                CREATE VIRTUAL TABLE IF NOT EXISTS party_positions_fts USING fts5(
                    summary,
                    key_proposals,
                    content=party_positions,
                    content_rowid=id
                )
            """)

    def add_party(self, name: str, abbreviation: str, folder_name: str, **kwargs) -> int:
        """Add a new political party."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO parties (name, abbreviation, folder_name, ideology, website)
                VALUES (?, ?, ?, ?, ?)
            """, (name, abbreviation, folder_name, kwargs.get('ideology'), kwargs.get('website')))
            return cursor.lastrowid

    def add_document(self, party_id: int, title: str, file_path: str, file_hash: str, **kwargs) -> int:
        """Add a new document."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO documents (party_id, title, file_path, file_hash, page_count, word_count)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (party_id, title, str(file_path), file_hash,
                  kwargs.get('page_count'), kwargs.get('word_count')))
            return cursor.lastrowid

    def add_category(self, category_key: str, name: str, description: str,
                    prompt_context: str, display_order: int) -> int:
        """Add a new category."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO categories (category_key, name, description, prompt_context, display_order)
                VALUES (?, ?, ?, ?, ?)
            """, (category_key, name, description, prompt_context, display_order))
            return cursor.lastrowid

    def get_unprocessed_documents_for_category(self, category_id: int) -> List[Dict]:
        """Get all documents that haven't been processed for a specific category."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT d.*
                FROM documents d
                LEFT JOIN category_processing_status cps
                    ON d.id = cps.document_id AND cps.category_id = ?
                WHERE cps.id IS NULL OR cps.status != 'completed'
            """, (category_id,))
            return [dict(row) for row in cursor.fetchall()]

    def save_extracted_text(self, document_id: int, page_number: int,
                          raw_text: str, markdown_text: str = None,
                          extraction_method: str = 'pymupdf'):
        """Save extracted text to cache."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO document_text (document_id, page_number, raw_text, markdown_text, extraction_method)
                VALUES (?, ?, ?, ?, ?)
            """, (document_id, page_number, raw_text, markdown_text, extraction_method))

    def get_extracted_text(self, document_id: int) -> str:
        """Get cached extracted text for a document."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT raw_text FROM document_text
                WHERE document_id = ?
                ORDER BY page_number
            """, (document_id,))
            texts = [row['raw_text'] for row in cursor.fetchall()]
            return "\n\n".join(texts)

    def is_text_extracted(self, document_id: int) -> bool:
        """Check if text has already been extracted for a document."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT COUNT(*) as count FROM document_text WHERE document_id = ?
            """, (document_id,))
            return cursor.fetchone()['count'] > 0

    def save_party_position(self, party_id: int, document_id: int, category_id: int,
                           summary: str, key_proposals: List[str], **kwargs):
        """Save analyzed party position for a category."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO party_positions
                (party_id, document_id, category_id, summary, key_proposals,
                 ideology_position, budget_mentioned, confidence_score,
                 raw_llm_response, tokens_used, cost_usd)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (party_id, document_id, category_id, summary,
                  json.dumps(key_proposals, ensure_ascii=False),
                  kwargs.get('ideology_position'), kwargs.get('budget_mentioned'),
                  kwargs.get('confidence_score'), kwargs.get('raw_llm_response'),
                  kwargs.get('tokens_used'), kwargs.get('cost_usd')))

    def update_processing_status(self, document_id: int, category_id: int,
                                status: str, error_message: str = None):
        """Update category processing status for a document."""
        with self.get_connection() as conn:
            cursor = conn.cursor()

            if status == 'started':
                cursor.execute("""
                    INSERT OR REPLACE INTO category_processing_status
                    (document_id, category_id, status, started_at)
                    VALUES (?, ?, ?, ?)
                """, (document_id, category_id, status, datetime.now()))
            elif status == 'completed':
                cursor.execute("""
                    UPDATE category_processing_status
                    SET status = ?, completed_at = ?
                    WHERE document_id = ? AND category_id = ?
                """, (status, datetime.now(), document_id, category_id))
            elif status == 'failed':
                cursor.execute("""
                    UPDATE category_processing_status
                    SET status = ?, error_message = ?
                    WHERE document_id = ? AND category_id = ?
                """, (status, error_message, document_id, category_id))

    def log_processing(self, stage: str, status: str, **kwargs):
        """Log processing event."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO processing_log
                (document_id, category_id, stage, status, error_message,
                 tokens_used, cost_usd, duration_seconds)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (kwargs.get('document_id'), kwargs.get('category_id'),
                  stage, status, kwargs.get('error_message'),
                  kwargs.get('tokens_used'), kwargs.get('cost_usd'),
                  kwargs.get('duration_seconds')))

    def get_all_categories(self) -> List[Dict]:
        """Get all active categories."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM categories WHERE active = TRUE ORDER BY display_order
            """)
            return [dict(row) for row in cursor.fetchall()]

    def get_category_by_key(self, category_key: str) -> Optional[Dict]:
        """Get category by key."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM categories WHERE category_key = ?", (category_key,))
            row = cursor.fetchone()
            return dict(row) if row else None
