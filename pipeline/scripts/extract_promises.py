# ABOUTME: Extract time-bound promises from all party documents for accountability calendar
# ABOUTME: Runs LLM extraction and stores results in time_bound_promises table

import os
import sys
import argparse
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.storage.database import Database
from src.analysis.promise_extractor import PromiseExtractor

# Load environment variables
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)


# Category key mapping (matches categories.json)
CATEGORY_MAPPING = {
    'economia': 'economia',
    'salud': 'salud',
    'educacion': 'educacion',
    'seguridad': 'seguridad',
    'ambiente': 'medio_ambiente',
    'medio_ambiente': 'medio_ambiente',
    'infraestructura': 'infraestructura',
    'politica_social': 'politica_social',
    'tecnologia': 'tecnologia',
    'cultura': 'cultura_deporte',
    'cultura_deporte': 'cultura_deporte',
    'politica_exterior': 'politica_exterior',
    'reforma_institucional': 'reforma_institucional',
    'impuestos': 'impuestos',
    'otro': None
}


def extract_promises_for_document(
    db: Database,
    extractor: PromiseExtractor,
    document: dict,
    force: bool = False
) -> int:
    """
    Extract promises from a single document.

    Returns number of promises extracted.
    """
    doc_id = document['id']
    party_id = document['party_id']
    party_name = document.get('party_name', 'Unknown')
    party_abbr = document.get('party_abbreviation', '???')

    print(f"\n{'='*70}")
    print(f"Processing: {party_name} ({party_abbr})")
    print(f"Document ID: {doc_id}")
    print(f"{'='*70}")

    # Clear existing if force
    if force:
        print("  Clearing existing promises...")
        db.clear_promises_for_document(doc_id)

    # Mark as started
    db.update_promise_extraction_status(doc_id, 'started')

    # Get document text with page markers for source tracking
    text = db.get_extracted_text_with_pages(doc_id)
    if not text:
        print("  ❌ No extracted text found for document")
        db.update_promise_extraction_status(doc_id, 'failed', error_message="No text extracted")
        return 0

    print(f"  Document text: {len(text):,} characters (with page markers)")

    # Extract promises
    try:
        result = extractor.extract_promises(
            document_text=text,
            party_name=party_name
        )
    except Exception as e:
        print(f"  ❌ Extraction failed: {e}")
        db.update_promise_extraction_status(doc_id, 'failed', error_message=str(e))
        return 0

    promises = result.get('promises', [])
    cost = result.get('cost_usd', 0)

    print(f"  Found {len(promises)} promises (cost: ${cost:.4f})")

    # Get category mapping
    categories = {c['category_key']: c['id'] for c in db.get_all_categories()}

    # Save each promise
    saved_count = 0
    for promise in promises:
        try:
            # Resolve dates
            resolved = extractor.resolve_promise_date(promise)

            # Map category to ID
            category_key = promise.get('category', 'otro')
            mapped_key = CATEGORY_MAPPING.get(category_key)
            category_id = categories.get(mapped_key) if mapped_key else None

            # Save to database
            db.save_time_bound_promise(
                party_id=party_id,
                document_id=doc_id,
                promise_text=promise.get('promise_text', ''),
                promised_date_text=promise.get('promised_date_text', ''),
                promised_date_type=promise.get('date_type', 'milestone'),
                category_id=category_id,
                promise_summary=promise.get('promise_summary'),
                promised_date=resolved.get('calendar_date'),
                date_start=promise.get('date_start'),
                date_end=promise.get('date_end'),
                relative_days=promise.get('relative_days'),
                administration_year=promise.get('administration_year'),
                source_page=promise.get('source_page'),
                source_text=promise.get('promise_text', '')[:500],
                confidence_score=promise.get('confidence', 0.5)
            )
            saved_count += 1

            # Print summary
            summary = promise.get('promise_summary', promise.get('promise_text', ''))[:60]
            date_text = promise.get('promised_date_text', 'N/A')
            print(f"    ✓ [{date_text}] {summary}...")

        except Exception as e:
            print(f"    ❌ Failed to save promise: {e}")

    # Mark as completed
    db.update_promise_extraction_status(doc_id, 'completed', promises_found=saved_count)

    print(f"  ✅ Saved {saved_count} promises")
    return saved_count


def main():
    parser = argparse.ArgumentParser(description='Extract time-bound promises from party documents')
    parser.add_argument('--party', '-p', help='Only process specific party (by abbreviation)')
    parser.add_argument('--force', '-f', action='store_true', help='Re-extract even if already processed')
    parser.add_argument('--dry-run', '-n', action='store_true', help='Show what would be processed without extracting')

    args = parser.parse_args()

    # Check API key
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

    print("=" * 70)
    print("Promise Extraction for Accountability Calendar")
    print("=" * 70)
    print(f"Database: {db_path}")
    print(f"Force re-extraction: {args.force}")
    print(f"Party filter: {args.party or 'All'}")
    print()

    # Initialize
    db = Database(str(db_path))
    extractor = PromiseExtractor(api_key=api_key)

    # Get documents to process
    if args.force:
        # Get all documents
        with db.get_connection() as conn:
            cursor = conn.cursor()
            if args.party:
                cursor.execute("""
                    SELECT d.*, p.name as party_name, p.abbreviation as party_abbreviation
                    FROM documents d
                    JOIN parties p ON d.party_id = p.id
                    WHERE UPPER(p.abbreviation) = UPPER(?)
                """, (args.party,))
            else:
                cursor.execute("""
                    SELECT d.*, p.name as party_name, p.abbreviation as party_abbreviation
                    FROM documents d
                    JOIN parties p ON d.party_id = p.id
                """)
            documents = [dict(row) for row in cursor.fetchall()]
    else:
        documents = db.get_documents_without_promise_extraction()
        if args.party:
            documents = [d for d in documents
                        if d.get('party_abbreviation', '').upper() == args.party.upper()]

    print(f"Found {len(documents)} documents to process\n")

    if not documents:
        print("No documents to process.")
        return

    if args.dry_run:
        print("DRY RUN - Would process:")
        for doc in documents:
            print(f"  - {doc.get('party_name', 'Unknown')} ({doc.get('party_abbreviation', '???')})")
        return

    # Process each document
    total_promises = 0
    total_cost = 0.0

    for idx, doc in enumerate(documents, 1):
        print(f"\n[{idx}/{len(documents)}]", end="")
        promises = extract_promises_for_document(db, extractor, doc, args.force)
        total_promises += promises

    # Final stats
    print("\n" + "=" * 70)
    print("✅ Promise Extraction Complete!")
    print("=" * 70)

    stats = db.get_promise_stats()
    print(f"Total promises extracted: {stats['total_promises']}")
    print(f"Parties with promises: {stats['parties_with_promises']}")
    print(f"Documents processed: {stats['documents_processed']}")
    print()
    print("Date types breakdown:")
    print(f"  Specific dates: {stats['specific_dates']}")
    print(f"  Relative dates: {stats['relative_dates']}")
    print(f"  Milestone dates: {stats['milestone_dates']}")
    print(f"  Range dates: {stats['range_dates']}")
    print(f"Average confidence: {stats['avg_confidence']:.2f}" if stats['avg_confidence'] else "")
    print("=" * 70)


if __name__ == "__main__":
    main()
