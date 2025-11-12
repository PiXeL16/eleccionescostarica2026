# ABOUTME: Database initialization script - loads categories and existing parties
# ABOUTME: Run this to set up the database with initial data from config

import json
import hashlib
from pathlib import Path
from .database import Database


def calculate_file_hash(file_path: Path) -> str:
    """Calculate SHA256 hash of a file."""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def load_categories(db: Database, config_path: Path):
    """Load categories from config file into database."""
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)

    print(f"\nLoading {len(config['categories'])} categories...")

    for idx, cat in enumerate(config['categories'], 1):
        try:
            db.add_category(
                category_key=cat['id'],
                name=cat['name'],
                description=cat['description'],
                prompt_context=cat.get('prompt_context', ''),
                display_order=idx
            )
            print(f"  ✓ Added category: {cat['name']}")
        except Exception as e:
            # Category might already exist
            if "UNIQUE constraint failed" in str(e):
                print(f"  - Category already exists: {cat['name']}")
            else:
                print(f"  ✗ Error adding category {cat['name']}: {e}")


def load_existing_parties(db: Database, partidos_dir: Path):
    """Load existing parties from the partidos folder."""
    if not partidos_dir.exists():
        print(f"\nPartidos directory not found: {partidos_dir}")
        return

    party_folders = [f for f in partidos_dir.iterdir() if f.is_dir()]
    print(f"\nLoading {len(party_folders)} existing parties...")

    for folder in sorted(party_folders):
        # Parse folder name (format: ABBR-Full-Name)
        parts = folder.name.split('-', 1)
        if len(parts) != 2:
            print(f"  ✗ Skipping invalid folder name: {folder.name}")
            continue

        abbr = parts[0]
        full_name = parts[1].replace('-', ' ')

        # Look for PDF and metadata
        pdf_path = folder / f"{abbr}.pdf"
        metadata_path = folder / "metadata.json"

        if not pdf_path.exists():
            print(f"  ✗ PDF not found for {abbr}")
            continue

        # Load metadata if available
        metadata = {}
        if metadata_path.exists():
            with open(metadata_path, 'r', encoding='utf-8') as f:
                metadata = json.load(f)
                full_name = metadata['party']['name']

        try:
            # Add party
            party_id = db.add_party(
                name=full_name,
                abbreviation=abbr,
                folder_name=folder.name
            )

            # Add document
            file_hash = calculate_file_hash(pdf_path)
            doc_id = db.add_document(
                party_id=party_id,
                title=f"Plan de Gobierno {full_name} 2026",
                file_path=str(pdf_path),
                file_hash=file_hash
            )

            print(f"  ✓ Added party: {full_name} ({abbr})")

        except Exception as e:
            if "UNIQUE constraint failed" in str(e):
                print(f"  - Party already exists: {full_name}")
            else:
                print(f"  ✗ Error adding party {full_name}: {e}")


def initialize_database():
    """Main initialization function."""
    # Paths
    pipeline_root = Path(__file__).parent.parent.parent  # pipeline folder
    project_root = pipeline_root.parent  # project root
    db_path = project_root / "data" / "database.db"
    config_path = pipeline_root / "config" / "categories.json"
    partidos_dir = project_root / "data" / "partidos"

    print("=" * 70)
    print("Database Initialization")
    print("=" * 70)
    print(f"Database: {db_path}")
    print(f"Config: {config_path}")
    print(f"Partidos: {partidos_dir}")

    # Initialize database
    db = Database(str(db_path))
    print("\n✓ Database schema created")

    # Load categories
    load_categories(db, config_path)

    # Load existing parties
    load_existing_parties(db, partidos_dir)

    print("\n" + "=" * 70)
    print("✓ Database initialization complete!")
    print("=" * 70)


if __name__ == "__main__":
    initialize_database()
