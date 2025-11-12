# ABOUTME: Main pipeline orchestrator coordinating PDF extraction, OCR, and LLM analysis
# ABOUTME: Supports flexible category processing and retroactive analysis for new categories

import sys
import time
from pathlib import Path
from typing import List, Optional, Dict
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from extraction.pdf_extractor import PDFExtractor
from extraction.ocr_processor import OCRProcessor
from analysis.llm_analyzer import LLMAnalyzer
from storage.database import Database


class DocumentPipeline:
    """Orchestrates the complete document processing pipeline."""

    def __init__(self, db_path: str, openai_api_key: Optional[str] = None):
        """
        Initialize pipeline.

        Args:
            db_path: Path to SQLite database
            openai_api_key: OpenAI API key (optional, can use env var)
        """
        self.db = Database(db_path)
        self.pdf_extractor = PDFExtractor()
        self.ocr_processor = None  # Lazy load (heavy)
        self.llm_analyzer = LLMAnalyzer(api_key=openai_api_key)

    def process_document(
        self,
        document_id: int,
        party_id: int,
        pdf_path: Path,
        categories: Optional[List[Dict]] = None,
        force_reextract: bool = False
    ) -> Dict:
        """
        Process a single document through the complete pipeline.

        Args:
            document_id: Database document ID
            party_id: Database party ID
            pdf_path: Path to PDF file
            categories: List of categories to process (None = all categories)
            force_reextract: Force re-extraction even if cached

        Returns:
            Dict with processing results
        """
        party_name = self._get_party_name(party_id)

        print(f"\n{'=' * 70}")
        print(f"Processing: {party_name}")
        print(f"PDF: {pdf_path.name}")
        print(f"{'=' * 70}")

        start_time = time.time()
        total_cost = 0.0

        # Stage 1: Text Extraction (cached if already done)
        if not force_reextract and self.db.is_text_extracted(document_id):
            print("\n[Stage 1] Text Extraction: Using cached text")
            document_text = self.db.get_extracted_text(document_id)
        else:
            print("\n[Stage 1] Text Extraction: Extracting from PDF...")
            document_text = self._extract_text(document_id, pdf_path)

        print(f"  ✓ Extracted {len(document_text):,} characters")

        # Stage 2: Category Analysis
        if categories is None:
            categories = self.db.get_all_categories()

        print(f"\n[Stage 2] LLM Analysis: Processing {len(categories)} categories")

        for category in categories:
            # Check if already processed
            unprocessed = self.db.get_unprocessed_documents_for_category(category['id'])
            doc_ids = [d['id'] for d in unprocessed]

            if document_id not in doc_ids:
                print(f"  - {category['name']}: Already processed (skipping)")
                continue

            # Mark as started
            self.db.update_processing_status(
                document_id=document_id,
                category_id=category['id'],
                status='started'
            )

            try:
                # Analyze with LLM
                analysis = self.llm_analyzer.analyze_document_for_category(
                    document_text=document_text,
                    category=category,
                    party_name=party_name
                )

                # Save to database
                self.db.save_party_position(
                    party_id=party_id,
                    document_id=document_id,
                    category_id=category['id'],
                    summary=analysis['summary'],
                    key_proposals=analysis.get('key_proposals', []),
                    ideology_position=analysis.get('ideology_position'),
                    budget_mentioned=analysis.get('budget_mentioned'),
                    confidence_score=analysis.get('confidence_score'),
                    raw_llm_response=analysis.get('raw_response'),
                    tokens_used=analysis.get('tokens_used'),
                    cost_usd=analysis.get('cost_usd')
                )

                # Mark as completed
                self.db.update_processing_status(
                    document_id=document_id,
                    category_id=category['id'],
                    status='completed'
                )

                # Log processing
                self.db.log_processing(
                    stage='category_analysis',
                    status='completed',
                    document_id=document_id,
                    category_id=category['id'],
                    tokens_used=analysis.get('tokens_used'),
                    cost_usd=analysis.get('cost_usd')
                )

                cost = analysis.get('cost_usd', 0.0)
                total_cost += cost

                print(f"  ✓ {category['name']}: ${cost:.4f}")

            except Exception as e:
                print(f"  ✗ {category['name']}: Error - {e}")

                # Mark as failed
                self.db.update_processing_status(
                    document_id=document_id,
                    category_id=category['id'],
                    status='failed',
                    error_message=str(e)
                )

                # Log error
                self.db.log_processing(
                    stage='category_analysis',
                    status='failed',
                    document_id=document_id,
                    category_id=category['id'],
                    error_message=str(e)
                )

        duration = time.time() - start_time

        print(f"\n{'=' * 70}")
        print(f"✓ Processing complete!")
        print(f"  Duration: {duration:.2f} seconds")
        print(f"  Total cost: ${total_cost:.4f}")
        print(f"{'=' * 70}\n")

        return {
            'document_id': document_id,
            'party_name': party_name,
            'categories_processed': len(categories),
            'total_cost': total_cost,
            'duration_seconds': duration
        }

    def process_multiple_documents(
        self,
        document_ids: List[int],
        categories: Optional[List[Dict]] = None
    ) -> List[Dict]:
        """
        Process multiple documents.

        Args:
            document_ids: List of document IDs to process
            categories: Categories to process (None = all)

        Returns:
            List of processing results
        """
        results = []

        for doc_id in document_ids:
            doc_info = self._get_document_info(doc_id)

            try:
                result = self.process_document(
                    document_id=doc_id,
                    party_id=doc_info['party_id'],
                    pdf_path=Path(doc_info['file_path']),
                    categories=categories
                )
                results.append(result)

            except Exception as e:
                print(f"\n✗ Failed to process document {doc_id}: {e}\n")
                results.append({
                    'document_id': doc_id,
                    'error': str(e),
                    'failed': True
                })

        return results

    def backfill_category(self, category_key: str) -> Dict:
        """
        Process all documents for a newly added category.

        Args:
            category_key: Category key (e.g., 'economia', 'impuestos')

        Returns:
            Dict with backfill results
        """
        category = self.db.get_category_by_key(category_key)

        if not category:
            raise ValueError(f"Category not found: {category_key}")

        print(f"\n{'=' * 70}")
        print(f"Backfilling category: {category['name']}")
        print(f"{'=' * 70}\n")

        # Get all documents that need processing for this category
        unprocessed = self.db.get_unprocessed_documents_for_category(category['id'])

        print(f"Found {len(unprocessed)} documents to process\n")

        results = self.process_multiple_documents(
            document_ids=[doc['id'] for doc in unprocessed],
            categories=[category]
        )

        total_cost = sum(r.get('total_cost', 0) for r in results if not r.get('failed'))
        successful = len([r for r in results if not r.get('failed')])

        print(f"\n{'=' * 70}")
        print(f"✓ Backfill complete!")
        print(f"  Documents processed: {successful}/{len(unprocessed)}")
        print(f"  Total cost: ${total_cost:.2f}")
        print(f"{'=' * 70}\n")

        return {
            'category': category['name'],
            'documents_processed': successful,
            'total_documents': len(unprocessed),
            'total_cost': total_cost,
            'results': results
        }

    def _extract_text(self, document_id: int, pdf_path: Path) -> str:
        """Extract text from PDF and cache it."""
        # Try regular extraction first
        extraction_result = self.pdf_extractor.extract_text(pdf_path)

        if extraction_result['needs_ocr']:
            print("  Document appears to be scanned, using OCR...")

            # Lazy load OCR processor
            if self.ocr_processor is None:
                self.ocr_processor = OCRProcessor(languages=['es', 'en'])

            ocr_result = self.ocr_processor.process_pdf(pdf_path)

            # Cache OCR text
            for page in ocr_result['pages']:
                self.db.save_extracted_text(
                    document_id=document_id,
                    page_number=page['page_number'],
                    raw_text=page['text'],
                    extraction_method='easyocr'
                )

            return ocr_result['text']

        else:
            # Cache extracted text
            for page in extraction_result['pages']:
                self.db.save_extracted_text(
                    document_id=document_id,
                    page_number=page['page_number'],
                    raw_text=page['text'],
                    extraction_method='pymupdf'
                )

            return extraction_result['text']

    def _get_party_name(self, party_id: int) -> str:
        """Get party name from database."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM parties WHERE id = ?", (party_id,))
            row = cursor.fetchone()
            return row['name'] if row else "Unknown"

    def _get_document_info(self, document_id: int) -> Dict:
        """Get document info from database."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM documents WHERE id = ?", (document_id,))
            row = cursor.fetchone()
            return dict(row) if row else None


if __name__ == "__main__":
    # Test pipeline
    print("Pipeline orchestrator module - use via main.py CLI")
