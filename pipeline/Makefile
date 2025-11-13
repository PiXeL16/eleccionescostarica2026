# ABOUTME: Makefile for pipeline operations - database init, analysis, embeddings
# ABOUTME: Run 'make help' to see all available commands

.PHONY: help setup init-db analyze embeddings stats clean add-party

# Default target
help:
	@echo "Pipeline Commands:"
	@echo ""
	@echo "  make setup          - Install Python dependencies"
	@echo "  make init-db        - Initialize database with categories and parties"
	@echo "  make analyze        - Run full analysis pipeline (extract + analyze)"
	@echo "  make embeddings         - Generate vector embeddings for semantic search"
	@echo "  make regenerate-summaries - Regenerate all summaries using semantic search"
	@echo "  make add-party          - Discover and add new parties (auto-extract metadata from PDF)"
	@echo "  make stats              - Show database statistics"
	@echo "  make clean              - Clean cache and temporary files"
	@echo ""
	@echo "Database Operations:"
	@echo "  make db-backup      - Backup database to timestamped file"
	@echo "  make db-stats       - Show detailed database statistics"
	@echo "  make db-embeddings  - Show embedding statistics"
	@echo ""
	@echo "Development:"
	@echo "  make test           - Run tests (if available)"
	@echo "  make format         - Format code with black"
	@echo ""

# Setup virtual environment and install dependencies
setup:
	@echo "Setting up Python environment..."
	python3 -m venv venv
	./venv/bin/pip install --upgrade pip
	./venv/bin/pip install -r requirements.txt
	@echo "✓ Setup complete! Activate with: source venv/bin/activate"

# Initialize database
init-db:
	@echo "Initializing database..."
	python3 src/storage/init_db.py
	@echo "✓ Database initialized"

# Run full analysis pipeline
analyze:
	@echo "Running analysis pipeline..."
	python3 main.py
	@echo "✓ Analysis complete"

# Generate embeddings for semantic search
embeddings:
	@echo "Generating vector embeddings..."
	@echo "Model: text-embedding-3-small"
	@echo "Expected cost: ~$0.03"
	@echo ""
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	./venv/bin/python3 scripts/generate_embeddings.py
	@echo "✓ Embeddings generated"

# Regenerate all summaries using semantic search
regenerate-summaries:
	@echo "Regenerating all party position summaries..."
	@echo "This will use semantic search for better accuracy"
	@echo ""
	./venv/bin/python3 scripts/regenerate_all_summaries.py

# Add new parties by discovering PDFs in data/partidos/
# Automatically extracts metadata from PDF and runs full analysis
add-party:
	@echo "Discovering new parties in data/partidos/..."
	@echo "Will extract metadata from PDF and run full analysis pipeline"
	@echo ""
	./venv/bin/python3 scripts/add_party.py

# Show database statistics
stats:
	@echo "Database Statistics"
	@echo "==================="
	@python3 -c "from src.storage.database import Database; \
		from pathlib import Path; \
		db = Database(str(Path('../data/database.db'))); \
		conn = db.get_connection(); \
		c = conn.__enter__().cursor(); \
		print(f\"Parties: {c.execute('SELECT COUNT(*) FROM parties').fetchone()[0]}\"); \
		print(f\"Documents: {c.execute('SELECT COUNT(*) FROM documents').fetchone()[0]}\"); \
		print(f\"Text pages: {c.execute('SELECT COUNT(*) FROM document_text').fetchone()[0]}\"); \
		print(f\"Categories: {c.execute('SELECT COUNT(*) FROM categories').fetchone()[0]}\"); \
		print(f\"Positions analyzed: {c.execute('SELECT COUNT(*) FROM party_positions').fetchone()[0]}\"); \
		conn.__exit__(None, None, None)"

# Show embedding statistics
db-embeddings:
	@echo "Embedding Statistics"
	@echo "===================="
	@python3 -c "from src.storage.database import Database; \
		from pathlib import Path; \
		db = Database(str(Path('../data/database.db'))); \
		stats = db.get_embedding_stats(); \
		if stats['total_embeddings']: \
			print(f\"Total embeddings: {stats['total_embeddings']:,}\"); \
			print(f\"Pages with embeddings: {stats['documents_with_embeddings']:,}\"); \
			print(f\"Total tokens: {stats['total_tokens']:,}\"); \
			print(f\"Avg tokens/chunk: {stats['avg_tokens_per_chunk']:.1f}\"); \
			cost = (stats['total_tokens'] / 1_000_000) * 0.020; \
			print(f\"Total cost: $${cost:.4f}\"); \
		else: \
			print('No embeddings found. Run: make embeddings')"

# Backup database
db-backup:
	@echo "Backing up database..."
	@mkdir -p ../backups
	@cp ../data/database.db "../backups/database_$(shell date +%Y%m%d_%H%M%S).db"
	@echo "✓ Backup created in ../backups/"

# Show detailed database statistics
db-stats:
	@echo "Detailed Database Statistics"
	@echo "============================="
	@python3 -c "import sqlite3; \
		conn = sqlite3.connect('../data/database.db'); \
		c = conn.cursor(); \
		print('\nParties:'); \
		for row in c.execute('SELECT abbreviation, name FROM parties ORDER BY name'): \
			print(f'  {row[0]:6} - {row[1]}'); \
		print(f'\nTotal pages: {c.execute(\"SELECT COUNT(*) FROM document_text\").fetchone()[0]:,}'); \
		print(f'Empty pages: {c.execute(\"SELECT COUNT(*) FROM document_text WHERE LENGTH(TRIM(raw_text)) < 50\").fetchone()[0]:,}'); \
		print(f'\nPositions by category:'); \
		for row in c.execute('SELECT c.name, COUNT(*) as cnt FROM party_positions pp JOIN categories c ON pp.category_id = c.id GROUP BY c.name ORDER BY cnt DESC'): \
			print(f'  {row[1]:3} - {row[0]}'); \
		conn.close()"

# Clean cache and temporary files
clean:
	@echo "Cleaning cache and temporary files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name "*.pyo" -delete 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	@echo "✓ Cleaned"

# Format code
format:
	@echo "Formatting code with black..."
	black src/ scripts/ --line-length 100
	@echo "✓ Code formatted"

# Run tests
test:
	@echo "Running tests..."
	pytest tests/ -v
	@echo "✓ Tests complete"

# Quick check - verify everything is set up correctly
check:
	@echo "Checking pipeline setup..."
	@echo ""
	@echo "1. Python version:"
	@python3 --version
	@echo ""
	@echo "2. Virtual environment:"
	@if [ -d "venv" ]; then echo "  ✓ venv exists"; else echo "  ✗ venv missing (run: make setup)"; fi
	@echo ""
	@echo "3. Database:"
	@if [ -f "../data/database.db" ]; then echo "  ✓ database.db exists"; else echo "  ✗ database.db missing (run: make init-db)"; fi
	@echo ""
	@echo "4. Environment variables:"
	@if [ -f ".env" ]; then echo "  ✓ .env exists"; else echo "  ✗ .env missing"; fi
	@if grep -q "OPENAI_API_KEY" .env 2>/dev/null; then echo "  ✓ OPENAI_API_KEY configured"; else echo "  ✗ OPENAI_API_KEY not set"; fi
	@echo ""
	@echo "5. Dependencies:"
	@./venv/bin/python3 -c "import openai; import tiktoken; from dotenv import load_dotenv; print('  ✓ Core libraries installed')" 2>/dev/null || echo "  ✗ Dependencies missing (run: make setup)"
