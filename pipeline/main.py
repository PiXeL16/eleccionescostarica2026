#!/usr/bin/env python3
# ABOUTME: Main CLI interface for political party analysis pipeline
# ABOUTME: Provides commands for initialization, document processing, and category management

import click
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from storage.database import Database
from storage.init_db import initialize_database
from pipeline.orchestrator import DocumentPipeline


# Default paths
PROJECT_ROOT = Path(__file__).parent
DB_PATH = PROJECT_ROOT.parent / "data" / "database.db"  # data is at root level
CONFIG_PATH = PROJECT_ROOT / "config" / "categories.json"


@click.group()
def cli():
    """Political Party Analysis Pipeline for Costa Rica 2026 Elections.

    A comprehensive system to extract, analyze, and compare political party platforms.
    """
    pass


@cli.command()
def init():
    """Initialize database and load categories from config."""
    click.echo("Initializing database...")
    initialize_database()
    click.echo("\n✓ Database initialized successfully!")


@cli.command()
@click.option('--party', '-p', help='Specific party abbreviation to process')
@click.option('--limit', '-l', type=int, help='Limit number of documents to process')
@click.option('--category', '-c', help='Specific category to process')
def process(party, limit, category):
    """Process political party documents through the analysis pipeline.

    Examples:
      python main.py process                    # Process all documents
      python main.py process --limit 3          # Process first 3 documents (POC)
      python main.py process --party PLN        # Process specific party
      python main.py process --category economia # Process specific category
    """
    if not DB_PATH.exists():
        click.echo("❌ Database not found. Run 'python main.py init' first.")
        return

    db = Database(str(DB_PATH))
    pipeline = DocumentPipeline(db_path=str(DB_PATH))

    # Get documents to process
    with db.get_connection() as conn:
        cursor = conn.cursor()

        if party:
            cursor.execute("""
                SELECT d.* FROM documents d
                JOIN parties p ON d.party_id = p.id
                WHERE p.abbreviation = ?
            """, (party,))
        else:
            cursor.execute("SELECT * FROM documents")

        documents = [dict(row) for row in cursor.fetchall()]

    if not documents:
        click.echo("❌ No documents found.")
        return

    if limit:
        documents = documents[:limit]

    # Get categories if specified
    categories = None
    if category:
        cat = db.get_category_by_key(category)
        if not cat:
            click.echo(f"❌ Category not found: {category}")
            return
        categories = [cat]

    click.echo(f"\n📄 Processing {len(documents)} document(s)...")

    if categories:
        click.echo(f"📁 Category filter: {categories[0]['name']}")

    click.echo()

    # Process documents
    doc_ids = [doc['id'] for doc in documents]
    results = pipeline.process_multiple_documents(doc_ids, categories=categories)

    # Summary
    successful = len([r for r in results if not r.get('failed')])
    total_cost = sum(r.get('total_cost', 0) for r in results if not r.get('failed'))

    click.echo(f"\n{'=' * 70}")
    click.echo(f"📊 SUMMARY")
    click.echo(f"{'=' * 70}")
    click.echo(f"Documents processed: {successful}/{len(documents)}")
    click.echo(f"Total cost: ${total_cost:.2f}")
    click.echo(f"{'=' * 70}\n")


@cli.command()
@click.argument('category_key')
def backfill(category_key):
    """Backfill all documents for a newly added category.

    This is useful when you add a new category and want to process
    all existing documents for that category.

    Example:
      python main.py backfill impuestos
    """
    if not DB_PATH.exists():
        click.echo("❌ Database not found. Run 'python main.py init' first.")
        return

    pipeline = DocumentPipeline(db_path=str(DB_PATH))

    try:
        result = pipeline.backfill_category(category_key)
        click.echo(f"\n✓ Backfill complete!")
        click.echo(f"  Category: {result['category']}")
        click.echo(f"  Documents: {result['documents_processed']}/{result['total_documents']}")
        click.echo(f"  Cost: ${result['total_cost']:.2f}\n")

    except ValueError as e:
        click.echo(f"❌ Error: {e}")
    except Exception as e:
        click.echo(f"❌ Unexpected error: {e}")


@cli.command()
def status():
    """Show processing status for all documents and categories."""
    if not DB_PATH.exists():
        click.echo("❌ Database not found. Run 'python main.py init' first.")
        return

    db = Database(str(DB_PATH))

    with db.get_connection() as conn:
        cursor = conn.cursor()

        # Get totals
        cursor.execute("SELECT COUNT(*) as count FROM parties")
        party_count = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM documents")
        doc_count = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM categories WHERE active = TRUE")
        cat_count = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM party_positions")
        positions_count = cursor.fetchone()['count']

        # Get processing stats
        cursor.execute("""
            SELECT
                c.name as category,
                COUNT(DISTINCT cps.document_id) as processed,
                (SELECT COUNT(*) FROM documents) as total
            FROM categories c
            LEFT JOIN category_processing_status cps
                ON c.id = cps.category_id AND cps.status = 'completed'
            WHERE c.active = TRUE
            GROUP BY c.id
            ORDER BY c.display_order
        """)
        category_stats = cursor.fetchall()

        # Get cost stats
        cursor.execute("""
            SELECT
                SUM(cost_usd) as total_cost,
                SUM(tokens_used) as total_tokens
            FROM party_positions
        """)
        cost_stats = cursor.fetchone()

    click.echo(f"\n{'=' * 70}")
    click.echo(f"📊 PIPELINE STATUS")
    click.echo(f"{'=' * 70}\n")

    click.echo(f"📦 Database Overview:")
    click.echo(f"  Parties: {party_count}")
    click.echo(f"  Documents: {doc_count}")
    click.echo(f"  Categories: {cat_count}")
    click.echo(f"  Positions analyzed: {positions_count}")

    if cost_stats['total_cost']:
        click.echo(f"\n💰 Cost Summary:")
        click.echo(f"  Total cost: ${cost_stats['total_cost']:.2f}")
        click.echo(f"  Total tokens: {cost_stats['total_tokens']:,}")

    click.echo(f"\n📁 Category Processing Status:")
    for cat in category_stats:
        percentage = (cat['processed'] / cat['total'] * 100) if cat['total'] > 0 else 0
        bar = "█" * int(percentage / 5) + "░" * (20 - int(percentage / 5))
        click.echo(f"  {cat['category']:30s} [{bar}] {cat['processed']:2d}/{cat['total']} ({percentage:5.1f}%)")

    click.echo(f"\n{'=' * 70}\n")


@cli.command()
def list_categories():
    """List all available categories."""
    if not DB_PATH.exists():
        click.echo("❌ Database not found. Run 'python main.py init' first.")
        return

    db = Database(str(DB_PATH))
    categories = db.get_all_categories()

    click.echo(f"\n📁 Available Categories ({len(categories)} total):\n")

    for cat in categories:
        click.echo(f"  {cat['category_key']:20s} - {cat['name']}")
        click.echo(f"  {'':22s} {cat['description']}")
        click.echo()


@cli.command()
@click.argument('party_abbr')
@click.option('--category', '-c', help='Specific category to show')
def show(party_abbr, category):
    """Show analysis results for a specific party.

    Example:
      python main.py show PLN
      python main.py show PLN --category economia
    """
    if not DB_PATH.exists():
        click.echo("❌ Database not found. Run 'python main.py init' first.")
        return

    db = Database(str(DB_PATH))

    with db.get_connection() as conn:
        cursor = conn.cursor()

        # Get party
        cursor.execute("SELECT * FROM parties WHERE abbreviation = ?", (party_abbr,))
        party = cursor.fetchone()

        if not party:
            click.echo(f"❌ Party not found: {party_abbr}")
            return

        # Get positions
        if category:
            cursor.execute("""
                SELECT pp.*, c.name as category_name, c.category_key
                FROM party_positions pp
                JOIN categories c ON pp.category_id = c.id
                WHERE pp.party_id = ? AND c.category_key = ?
            """, (party['id'], category))
        else:
            cursor.execute("""
                SELECT pp.*, c.name as category_name, c.category_key
                FROM party_positions pp
                JOIN categories c ON pp.category_id = c.id
                WHERE pp.party_id = ?
                ORDER BY c.display_order
            """, (party['id'],))

        positions = cursor.fetchall()

    click.echo(f"\n{'=' * 70}")
    click.echo(f"📋 {party['name']} ({party['abbreviation']})")
    click.echo(f"{'=' * 70}\n")

    if not positions:
        click.echo("No analysis data available yet.")
        return

    for pos in positions:
        click.echo(f"📁 {pos['category_name']}")
        click.echo(f"{'─' * 70}")
        click.echo(f"\n{pos['summary']}\n")

        if pos['key_proposals']:
            import json
            proposals = json.loads(pos['key_proposals'])
            if proposals:
                click.echo("Propuestas clave:")
                for i, prop in enumerate(proposals, 1):
                    click.echo(f"  {i}. {prop}")
                click.echo()

        if pos['ideology_position']:
            click.echo(f"Posición ideológica: {pos['ideology_position']}")

        if pos['budget_mentioned']:
            click.echo(f"Presupuesto: {pos['budget_mentioned']}")

        click.echo()


if __name__ == "__main__":
    # Check for API key
    if not os.getenv("OPENAI_API_KEY"):
        click.echo("⚠️  Warning: OPENAI_API_KEY environment variable not set.")
        click.echo("   Set it in a .env file or export it before processing documents.\n")

    cli()
