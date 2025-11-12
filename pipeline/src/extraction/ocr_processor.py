# ABOUTME: OCR processing module for scanned PDF documents
# ABOUTME: Uses EasyOCR with Spanish language support for text extraction

import pymupdf  # For converting PDF pages to images
from pathlib import Path
from typing import Dict, List, Optional
import tempfile
from PIL import Image
import io


class OCRProcessor:
    """Processes scanned PDFs using OCR (Optical Character Recognition)."""

    def __init__(self, languages: List[str] = ['es', 'en']):
        """
        Initialize OCR processor.

        Args:
            languages: List of language codes to support (default: Spanish and English)
        """
        self.languages = languages
        self._reader = None  # Lazy loading

    @property
    def reader(self):
        """Lazy load EasyOCR reader (heavy initialization)."""
        if self._reader is None:
            try:
                import easyocr
                print(f"Initializing EasyOCR with languages: {self.languages}")
                self._reader = easyocr.Reader(self.languages, gpu=True)
                print("✓ EasyOCR initialized")
            except ImportError:
                raise ImportError(
                    "EasyOCR not installed. Install with: pip install easyocr"
                )
            except Exception as e:
                # Try without GPU
                print(f"GPU initialization failed, falling back to CPU: {e}")
                import easyocr
                self._reader = easyocr.Reader(self.languages, gpu=False)

        return self._reader

    def process_pdf(self, pdf_path: Path, dpi: int = 300) -> Dict:
        """
        Process a scanned PDF using OCR.

        Args:
            pdf_path: Path to PDF file
            dpi: DPI for image rendering (higher = better quality but slower)

        Returns:
            Dict containing extracted text and metadata
        """
        doc = pymupdf.open(pdf_path)

        pages_text = []
        total_text = []

        print(f"Processing {len(doc)} pages with OCR...")

        for page_num in range(len(doc)):
            page = doc[page_num]

            print(f"  OCR processing page {page_num + 1}/{len(doc)}...", end=' ')

            # Convert page to image
            pix = page.get_pixmap(dpi=dpi)
            img_data = pix.pil_tobytes(format="PNG")
            img = Image.open(io.BytesIO(img_data))

            # Perform OCR
            result = self.reader.readtext(img, paragraph=True)

            # Extract text from OCR result
            page_text = "\n\n".join([text for (bbox, text, prob) in result])

            pages_text.append({
                'page_number': page_num + 1,
                'text': page_text,
                'char_count': len(page_text)
            })
            total_text.append(page_text)

            print(f"✓ ({len(page_text)} chars)")

        doc.close()

        # Join all text
        full_text = "\n\n".join(total_text)
        word_count = len(full_text.split())

        return {
            'text': full_text,
            'pages': pages_text,
            'page_count': len(pages_text),
            'word_count': word_count,
            'extraction_method': 'easyocr'
        }

    def process_single_page(self, pdf_path: Path, page_num: int, dpi: int = 300) -> str:
        """Process a single page from a PDF."""
        doc = pymupdf.open(pdf_path)

        if page_num >= len(doc):
            raise ValueError(f"Page {page_num} does not exist (total pages: {len(doc)})")

        page = doc[page_num]

        # Convert to image
        pix = page.get_pixmap(dpi=dpi)
        img_data = pix.pil_tobytes(format="PNG")
        img = Image.open(io.BytesIO(img_data))

        # Perform OCR
        result = self.reader.readtext(img, paragraph=True)

        # Extract text
        text = "\n\n".join([text for (bbox, text, prob) in result])

        doc.close()

        return text


def extract_with_ocr(pdf_path: Path, languages: List[str] = ['es', 'en']) -> Dict:
    """
    Convenience function to extract text from a scanned PDF.

    Args:
        pdf_path: Path to PDF file
        languages: List of language codes

    Returns:
        Dict with extracted text and metadata
    """
    processor = OCRProcessor(languages=languages)
    return processor.process_pdf(pdf_path)


if __name__ == "__main__":
    # Test OCR
    import sys

    if len(sys.argv) < 2:
        print("Usage: python ocr_processor.py <pdf_path>")
        sys.exit(1)

    pdf_path = Path(sys.argv[1])

    if not pdf_path.exists():
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)

    print(f"Processing scanned PDF: {pdf_path}")
    print("This may take several minutes...\n")

    processor = OCRProcessor(languages=['es', 'en'])
    result = processor.process_pdf(pdf_path)

    print(f"\n{'=' * 70}")
    print("OCR Results:")
    print(f"{'=' * 70}")
    print(f"  Pages: {result['page_count']}")
    print(f"  Words: {result['word_count']:,}")
    print(f"  Characters: {len(result['text']):,}")
    print(f"\nFirst 500 characters:")
    print("-" * 50)
    print(result['text'][:500])
