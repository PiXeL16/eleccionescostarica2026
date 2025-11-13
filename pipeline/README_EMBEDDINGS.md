# Vector Embeddings for Semantic Search

This document explains how to generate and use vector embeddings for semantic search across party documents.

## What Was Added

### Database Changes
- **New table**: `document_embeddings` - stores vector embeddings for each text chunk
- **New methods** in `Database` class:
  - `save_embedding()` - Store embedding
  - `get_all_document_text_ids()` - Get pages to process
  - `get_document_text_by_id()` - Get page with party metadata
  - `has_embeddings()` - Check if already processed
  - `get_embedding_stats()` - Get embedding statistics

### New Script
- **`scripts/generate_embeddings.py`** - Generates embeddings for all 2,212 pages

## How It Works

### Adaptive Chunking Strategy
The script applies intelligent chunking based on page size:

1. **Small pages** (<1,500 chars): Keep as single chunk
2. **Medium pages** (1,500-3,500 chars): Split into 2 chunks with 100-char overlap
3. **Large pages** (>3,500 chars): Split into multiple 1,500-char chunks with overlap

This ensures:
- Optimal embedding quality (not too long, not too short)
- Semantic context preservation (overlap between chunks)
- Efficient token usage

### Embedding Model
- **Model**: OpenAI `text-embedding-3-small`
- **Dimensions**: 1,536
- **Cost**: $0.020 per 1M tokens
- **Expected cost**: ~$0.026-$0.03 for all 2,212 pages

## Running Embedding Generation

### Prerequisites
1. Make sure the database is up to date
2. Set your OpenAI API key:
   ```bash
   export OPENAI_API_KEY="your-key-here"
   ```

### Run the Script

```bash
cd pipeline
python scripts/generate_embeddings.py
```

### What It Does

The script will:
1. Load all 2,212 pages from `document_text` table
2. Skip empty pages (<50 chars)
3. Skip pages that already have embeddings
4. Apply adaptive chunking
5. Generate embeddings using OpenAI API
6. Store embeddings in `document_embeddings` table
7. Show progress every 50 pages
8. Display final statistics and cost

### Expected Output

```
======================================================================
Embedding Generation
======================================================================
Model: text-embedding-3-small
Skip existing: True

Found 2212 pages to process

[1/2212] 📄 Processing page 1 (Liberación Nacional)
   2450 chars → 2 chunks
   ✓ Chunk 0: 1300 chars, 325 tokens
   ✓ Chunk 1: 1250 chars, 312 tokens
[2/2212] ⏭️  Skipping empty page 2
...
[50/2212]
📊 Progress: 89 embeddings, 125,432 tokens

...

======================================================================
✅ Embedding Generation Complete!
======================================================================
Total embeddings: 2,847
Pages with embeddings: 2,167
Total tokens: 1,287,543
Average tokens per chunk: 452.3
Estimated cost: $0.0258
======================================================================
```

## After Generation

Once embeddings are generated, you can:

1. **View statistics**:
   ```python
   from src.storage.database import Database
   db = Database("../data/database.db")
   stats = db.get_embedding_stats()
   print(stats)
   ```

2. **Verify embeddings exist**:
   ```sql
   SELECT COUNT(*) FROM document_embeddings;
   SELECT COUNT(DISTINCT document_text_id) FROM document_embeddings;
   ```

## Next Steps

After running this script, the next phase is to:
1. Install `sqlite-vec` extension for vector search in the web app
2. Implement semantic search function in TypeScript
3. Update chat API to use semantic search
4. Update UI to support multi-party queries

## Troubleshooting

### Error: "OPENAI_API_KEY not set"
Make sure to export your API key before running:
```bash
export OPENAI_API_KEY="sk-..."
```

### Error: "Database not found"
The script expects the database at `../data/database.db` relative to the pipeline folder. Make sure you're running from the correct directory.

### Want to regenerate embeddings?
The script skips pages that already have embeddings. To regenerate:
```sql
-- Delete all embeddings
DELETE FROM document_embeddings;
```
Then run the script again.

### Out of API quota?
The script processes pages sequentially. If it stops, it will resume from where it left off (thanks to `skip_existing=True`).

## Cost Control

- **Estimated total cost**: $0.026-$0.03 (one-time)
- **Per-query cost**: ~$0.0001 for embedding the query
- **No ongoing costs**: Embeddings are generated once and stored

## Performance Notes

- **Generation time**: ~3-5 minutes for all 2,212 pages (depends on API latency)
- **Storage**: ~10 MB for all embeddings (1,536 dimensions × 4 bytes × 2,847 chunks)
- **Database size increase**: Minimal (<2% of current size)
