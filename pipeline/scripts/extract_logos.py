#!/usr/bin/env python3
# ABOUTME: Extracts party logos/images from PDF documents
# ABOUTME: Saves them as separate PNG files in each party folder

import pymupdf
from pathlib import Path
import sys

def extract_images_from_pdf(pdf_path: Path, output_dir: Path, max_images: int = 5):
    """
    Extract images from first few pages of PDF.

    Args:
        pdf_path: Path to PDF file
        output_dir: Directory to save extracted images
        max_images: Maximum number of images to extract
    """
    doc = pymupdf.open(pdf_path)

    images_extracted = 0
    party_abbr = pdf_path.stem

    # Check first 3 pages for images (logo usually on first page)
    for page_num in range(min(3, len(doc))):
        page = doc[page_num]
        image_list = page.get_images()

        for img_index, img in enumerate(image_list):
            if images_extracted >= max_images:
                break

            xref = img[0]

            try:
                # Get image data
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]

                # Skip very small images (likely not logos)
                if len(image_bytes) < 5000:  # 5KB minimum
                    continue

                # Save image
                output_filename = f"{party_abbr}_logo_{images_extracted + 1}.{image_ext}"
                output_path = output_dir / output_filename

                with open(output_path, "wb") as img_file:
                    img_file.write(image_bytes)

                print(f"  ✓ Extracted: {output_filename} ({len(image_bytes):,} bytes)")
                images_extracted += 1

            except Exception as e:
                print(f"  ✗ Error extracting image {img_index}: {e}")
                continue

    doc.close()
    return images_extracted


def main():
    """Extract logos from all party PDFs."""
    pipeline_root = Path(__file__).parent.parent
    project_root = pipeline_root.parent
    partidos_dir = project_root / "data" / "partidos"

    if not partidos_dir.exists():
        print(f"Error: Partidos directory not found: {partidos_dir}")
        return 1

    print("=" * 70)
    print("Party Logo Extraction")
    print("=" * 70)
    print(f"Source: {partidos_dir}\n")

    party_folders = sorted([f for f in partidos_dir.iterdir() if f.is_dir()])
    total_images = 0

    for party_folder in party_folders:
        # Get party abbreviation from folder name
        abbr = party_folder.name.split('-')[0]
        pdf_path = party_folder / f"{abbr}.pdf"

        if not pdf_path.exists():
            print(f"⚠️  {party_folder.name}: PDF not found")
            continue

        print(f"\n📁 {party_folder.name}")

        try:
            images = extract_images_from_pdf(pdf_path, party_folder, max_images=5)
            total_images += images

            if images == 0:
                print(f"  ⚠️  No images found (or all too small)")

        except Exception as e:
            print(f"  ✗ Error processing PDF: {e}")
            continue

    print(f"\n{'=' * 70}")
    print(f"✓ Extraction complete!")
    print(f"  Total images extracted: {total_images}")
    print(f"  Parties processed: {len(party_folders)}")
    print(f"{'=' * 70}\n")

    return 0


if __name__ == "__main__":
    exit(main())
