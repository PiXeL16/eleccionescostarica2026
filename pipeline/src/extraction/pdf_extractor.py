# ABOUTME: PDF text extraction module using PyMuPDF
# ABOUTME: Handles text-based PDFs and detects if OCR is needed for scanned documents

import pymupdf  # PyMuPDF
from pathlib import Path
from typing import Dict, List, Tuple
import re


class PDFExtractor:
    """Extracts text from PDF documents using PyMuPDF."""

    def __init__(self):
        self.min_text_threshold = 100  # Minimum characters to consider PDF as text-based

    def extract_text(self, pdf_path: Path) -> Dict:
        """
        Extract text from a PDF file.

        Returns:
            Dict containing:
                - text: Full extracted text
                - pages: List of page texts
                - page_count: Number of pages
                - word_count: Approximate word count
                - needs_ocr: Boolean indicating if OCR is needed
                - extraction_method: 'pymupdf' or 'needs_ocr'
        """
        doc = pymupdf.open(pdf_path)

        pages_text = []
        total_text = []

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()

            # Clean up text
            text = self._clean_text(text)

            pages_text.append({
                'page_number': page_num + 1,
                'text': text,
                'char_count': len(text)
            })
            total_text.append(text)

        doc.close()

        # Join all text
        full_text = "\n\n".join(total_text)
        word_count = len(full_text.split())

        # Detect if OCR is needed
        needs_ocr = len(full_text.strip()) < self.min_text_threshold

        return {
            'text': full_text,
            'pages': pages_text,
            'page_count': len(pages_text),
            'word_count': word_count,
            'needs_ocr': needs_ocr,
            'extraction_method': 'needs_ocr' if needs_ocr else 'pymupdf'
        }

    def extract_markdown(self, pdf_path: Path) -> str:
        """
        Extract text as markdown format (preserves structure better for LLM).

        This is useful for documents with headings, lists, etc.
        """
        try:
            import pymupdf4llm
            md_text = pymupdf4llm.to_markdown(str(pdf_path))
            return md_text
        except ImportError:
            # Fallback to regular extraction
            result = self.extract_text(pdf_path)
            return result['text']

    def _clean_text(self, text: str) -> str:
        """Clean extracted text."""
        # Remove excessive whitespace
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)

        # Remove page numbers (common pattern: just a number on a line)
        text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)

        # Remove excessive spaces
        text = re.sub(r' +', ' ', text)

        return text.strip()

    def get_pdf_info(self, pdf_path: Path) -> Dict:
        """Get basic PDF metadata."""
        doc = pymupdf.open(pdf_path)

        metadata = {
            'page_count': len(doc),
            'title': doc.metadata.get('title', ''),
            'author': doc.metadata.get('author', ''),
            'subject': doc.metadata.get('subject', ''),
            'creator': doc.metadata.get('creator', ''),
        }

        doc.close()
        return metadata


def detect_scanned_pdf(pdf_path: Path, threshold: int = 100) -> bool:
    """
    Quick detection if a PDF is scanned (needs OCR).

    Args:
        pdf_path: Path to PDF file
        threshold: Minimum character count to consider as text-based

    Returns:
        True if PDF appears to be scanned (needs OCR), False otherwise
    """
    extractor = PDFExtractor()
    extractor.min_text_threshold = threshold
    result = extractor.extract_text(pdf_path)
    return result['needs_ocr']


if __name__ == "__main__":
    # Test extraction
    import sys

    if len(sys.argv) < 2:
        print("Usage: python pdf_extractor.py <pdf_path>")
        sys.exit(1)

    pdf_path = Path(sys.argv[1])

    if not pdf_path.exists():
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)

    print(f"Extracting text from: {pdf_path}")

    extractor = PDFExtractor()
    result = extractor.extract_text(pdf_path)

    print(f"\nResults:")
    print(f"  Pages: {result['page_count']}")
    print(f"  Words: {result['word_count']:,}")
    print(f"  Characters: {len(result['text']):,}")
    print(f"  Needs OCR: {result['needs_ocr']}")
    print(f"\nFirst 500 characters:")
    print("-" * 50)
    print(result['text'][:500])
