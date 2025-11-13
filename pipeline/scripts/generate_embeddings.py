# ABOUTME: Generate vector embeddings for all document text pages for semantic search
# ABOUTME: Uses OpenAI text-embedding-3-small with adaptive chunking strategy

import os
import sys
import struct
import tiktoken
from pathlib import Path
from typing import List, Tuple
from openai import OpenAI

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.storage.database import Database


class EmbeddingGenerator:
    """Generate and store embeddings for document text."""

    def __init__(self, db_path: str, api_key: str):
        self.db = Database(db_path)
        self.client = OpenAI(api_key=api_key)
        self.model = "text-embedding-3-small"
        self.encoding = tiktoken.get_encoding("cl100k_base")

        # Chunking parameters
        self.small_page_threshold = 1500  # Keep as-is if below this
        self.medium_page_threshold = 3500  # Split into 2 if below this
        self.target_chunk_size = 1500  # Target size for split chunks
        self.chunk_overlap = 100  # Overlap between chunks

    def count_tokens(self, text: str) -> int:
        """Count tokens in text."""
        return len(self.encoding.encode(text))

    def chunk_text(self, text: str, document_text_id: int, page_number: int) -> List[Tuple[int, str]]:
        """
        Apply adaptive chunking strategy based on page size.

        Returns list of (chunk_index, chunk_text) tuples.
        """
        char_count = len(text)

        # Small pages: keep as-is
        if char_count < self.small_page_threshold:
            return [(0, text)]

        # Medium pages: split into 2 chunks with overlap
        if char_count < self.medium_page_threshold:
            midpoint = char_count // 2
            # Find a good split point (sentence boundary)
            split_point = self._find_split_point(text, midpoint)

            chunk1 = text[:split_point + self.chunk_overlap]
            chunk2 = text[split_point - self.chunk_overlap:]

            return [(0, chunk1), (1, chunk2)]

        # Large pages: split into multiple chunks
        chunks = []
        start = 0
        chunk_index = 0

        while start < char_count:
            end = min(start + self.target_chunk_size, char_count)

            # Find sentence boundary if not at end
            if end < char_count:
                end = self._find_split_point(text, end)

            # Extract chunk with overlap from previous
            chunk_start = max(0, start - self.chunk_overlap)
            chunk_text = text[chunk_start:end + self.chunk_overlap]

            chunks.append((chunk_index, chunk_text))

            start = end
            chunk_index += 1

        return chunks

    def _find_split_point(self, text: str, target: int) -> int:
        """Find nearest sentence boundary to target position."""
        # Look for sentence endings within 200 chars of target
        search_start = max(0, target - 100)
        search_end = min(len(text), target + 100)
        search_region = text[search_start:search_end]

        # Find last period, exclamation, or question mark
        for delimiter in ['. ', '! ', '? ', '.\n', '!\n', '?\n']:
            pos = search_region.rfind(delimiter)
            if pos != -1:
                return search_start + pos + len(delimiter)

        # Fallback to target if no sentence boundary found
        return target

    def generate_embedding(self, text: str) -> Tuple[List[float], int]:
        """Generate embedding for text using OpenAI API."""
        response = self.client.embeddings.create(
            input=text,
            model=self.model
        )

        embedding = response.data[0].embedding
        tokens_used = response.usage.total_tokens

        return embedding, tokens_used

    def serialize_embedding(self, embedding: List[float]) -> bytes:
        """Serialize embedding as binary blob (float32 array)."""
        return struct.pack(f'{len(embedding)}f', *embedding)

    def process_document_text(self, document_text_id: int) -> int:
        """
        Process a single document_text page:
        1. Chunk the text
        2. Generate embeddings
        3. Store in database

        Returns number of embeddings created.
        """
        # Get document text
        doc_text = self.db.get_document_text_by_id(document_text_id)
        if not doc_text:
            print(f"❌ Document text {document_text_id} not found")
            return 0

        # Skip if already has embeddings
        if self.db.has_embeddings(document_text_id):
            print(f"⏭️  Skipping page {doc_text['page_number']} (already has embeddings)")
            return 0

        raw_text = doc_text['raw_text']

        # Skip empty pages
        if not raw_text or len(raw_text.strip()) < 50:
            print(f"⏭️  Skipping empty page {doc_text['page_number']}")
            return 0

        # Chunk the text
        chunks = self.chunk_text(raw_text, document_text_id, doc_text['page_number'])

        print(f"📄 Processing page {doc_text['page_number']} ({doc_text['party_name']})")
        print(f"   {len(raw_text)} chars → {len(chunks)} chunks")

        # Generate embeddings for each chunk
        embeddings_created = 0
        for chunk_index, chunk_text in chunks:
            try:
                # Generate embedding
                embedding, token_count = self.generate_embedding(chunk_text)

                # Serialize embedding
                embedding_bytes = self.serialize_embedding(embedding)

                # Save to database
                self.db.save_embedding(
                    document_text_id=document_text_id,
                    chunk_index=chunk_index,
                    chunk_text=chunk_text,
                    embedding=embedding_bytes,
                    token_count=token_count,
                    embedding_model=self.model
                )

                embeddings_created += 1
                print(f"   ✓ Chunk {chunk_index}: {len(chunk_text)} chars, {token_count} tokens")

            except Exception as e:
                print(f"   ❌ Error generating embedding for chunk {chunk_index}: {e}")

        return embeddings_created

    def process_all(self, skip_existing: bool = True):
        """Process all document_text pages."""
        print("=" * 70)
        print("Embedding Generation")
        print("=" * 70)
        print(f"Model: {self.model}")
        print(f"Skip existing: {skip_existing}")
        print()

        # Get all document_text IDs
        doc_text_ids = self.db.get_all_document_text_ids()
        print(f"Found {len(doc_text_ids)} pages to process\n")

        total_embeddings = 0
        total_tokens = 0
        processed_pages = 0

        for idx, doc_text_id in enumerate(doc_text_ids, 1):
            print(f"[{idx}/{len(doc_text_ids)}] ", end="")

            embeddings_created = self.process_document_text(doc_text_id)
            total_embeddings += embeddings_created

            if embeddings_created > 0:
                processed_pages += 1

            # Print progress every 50 pages
            if idx % 50 == 0:
                stats = self.db.get_embedding_stats()
                print(f"\n📊 Progress: {stats['total_embeddings']} embeddings, "
                      f"{stats['total_tokens']} tokens\n")

        # Final stats
        print("\n" + "=" * 70)
        print("✅ Embedding Generation Complete!")
        print("=" * 70)

        stats = self.db.get_embedding_stats()
        print(f"Total embeddings: {stats['total_embeddings']}")
        print(f"Pages with embeddings: {stats['documents_with_embeddings']}")
        print(f"Total tokens: {stats['total_tokens']:,}")
        print(f"Average tokens per chunk: {stats['avg_tokens_per_chunk']:.1f}")

        # Cost estimate (text-embedding-3-small: $0.020 per 1M tokens)
        cost = (stats['total_tokens'] / 1_000_000) * 0.020
        print(f"Estimated cost: ${cost:.4f}")
        print("=" * 70)


def main():
    # Get API key from environment
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("❌ Error: OPENAI_API_KEY environment variable not set")
        sys.exit(1)

    # Database path
    script_dir = Path(__file__).parent
    db_path = script_dir.parent.parent / "data" / "database.db"

    if not db_path.exists():
        print(f"❌ Error: Database not found at {db_path}")
        sys.exit(1)

    print(f"Database: {db_path}\n")

    # Generate embeddings
    generator = EmbeddingGenerator(str(db_path), api_key)
    generator.process_all(skip_existing=True)


if __name__ == "__main__":
    main()
