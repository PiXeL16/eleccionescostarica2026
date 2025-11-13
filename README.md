# Political Platforms Costa Rica 2026

A comprehensive platform for analyzing and comparing political party platforms for Costa Rica's 2026 elections.

## Project Intent

This project aims to make political information more accessible to Costa Rican voters by:

1. **Automated Analysis**: Using AI to extract and structure information from lengthy government plan PDFs (100+ pages each)
2. **Easy Comparison**: Providing a clean, side-by-side comparison of up to 3 parties across 13 key policy categories
3. **Transparency**: Making all data and methodologies open source
4. **Accessibility**: Delivering a fast, mobile-friendly website with dark mode support
5. **Non-partisan**: Presenting factual information without editorial bias

The system processes official TSE documents through an LLM pipeline to generate structured summaries, making it easier for voters to understand where parties stand on issues that matter to them.

## Project Structure

```text
Elecciones2026/
├── data/              # Shared data (SQLite DB and PDFs)
│   ├── database.db    # Database with complete analyses
│   └── partidos/      # Government plan PDFs
├── pipeline/          # Python analysis pipeline
│   ├── src/           # Pipeline source code
│   ├── scripts/       # Download and processing scripts
│   ├── config/        # Category configuration
│   └── main.py        # Main CLI
└── web/               # Next.js application
    ├── app/           # Application pages
    ├── components/    # Reusable components
    ├── lib/           # Utilities and DB connection
    └── package.json   # Website dependencies
```

## Analysis Pipeline (Python)

### Installation

```bash
cd pipeline
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Configuration

Create a `.env` file with your OpenAI API key:

```bash
OPENAI_API_KEY=your-api-key-here
```

### Usage

```bash
# Initialize database
python main.py init

# Process all parties
python main.py process

# View processing status
python main.py status

# Show specific party platform
python main.py show PLN

# Add new category (backfill)
python main.py backfill category_name

# Generate embeddings for semantic search (run after processing)
python scripts/generate_embeddings.py
```

### Current Status

- 20 political parties downloaded
- 13 categories defined
- 260 complete analyses (20 parties × 13 categories)
- ~2,000 document pages extracted and embedded
- Vector embeddings generated for semantic search
- AI chat with RAG-based question answering

## Website (Next.js)

### Installation

```bash
cd web
bun install
```

### Configuration

Create a `.env` file in the `web/` directory with the following variables:

```bash
# Required for AI chat feature
OPENAI_API_KEY=your-openai-api-key

# Optional: PostHog analytics and feature flags
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Optional: Feature flag to enable/disable chat (default: enabled in dev)
NEXT_PUBLIC_CHAT_ENABLED=true
```

**Note**: Without `OPENAI_API_KEY`, the chat feature will not work, but all other features (party listings, comparisons, etc.) will function normally.

### Development

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Run production build
bun run start
```

The application will be available at `http://localhost:3000` (or next available port).

### Features

#### Home Page

- Grid of cards for all political parties
- Logo placeholders with party initials and colors
- Links to full platform and comparison
- Dark mode support with theme toggle

#### Party Detail Page

- Complete party platform view
- Accordion with 13 categories
- Summary, key proposals, ideology position, and budget
- Button to compare with other parties

#### Comparison Page

- Select up to 3 parties
- Side-by-side comparison of all categories
- Filter by specific category
- URL-based persistent state

#### AI-Powered Chat (New!)

- **Semantic Search with RAG**: Ask natural language questions about party platforms
- **Multi-Party Support**: Query specific parties or compare across all parties
- **Vector Search**: Powered by OpenAI embeddings and sqlite-vec for accurate context retrieval
- **Streaming Responses**: Real-time AI answers using GPT-4
- **Source Attribution**: Responses include page numbers from official documents
- **Party Selector**: Choose one or more parties to focus your questions
- **Example Questions**: Quick-start prompts for common queries
- **Responsive UI**: Full-screen mobile support with sliding sidebar

### Technologies

#### Frontend & Build
- **Next.js 14** - React framework with App Router
- **Bun** - Package manager and runtime
- **Tailwind CSS** - Utility-first CSS
- **TypeScript** - Static typing
- **Biome** - Linter and formatter

#### Data & AI
- **better-sqlite3** - SQLite database access
- **sqlite-vec** - Vector similarity search extension
- **OpenAI API** - GPT-4 for chat, text-embedding-3-small for semantic search
- **Vercel AI SDK** - Streaming chat responses
- **PostHog** - Feature flags and analytics

#### UI Components
- **next-themes** - Dark mode support
- **lucide-react** - Icon library
- **react-markdown** - Markdown rendering in chat

### Architecture & Design Decisions

#### Three-Stage Pipeline

The project uses a multi-stage approach to process and serve political data:

1. **Analysis Pipeline (Python)**:
   - Downloads PDFs from TSE
   - Extracts text from PDFs (PyMuPDF + OCR fallback)
   - Processes documents through OpenAI's GPT-4
   - Extracts structured data (summaries, proposals, ideology, budget)
   - Stores results in SQLite database
   - Run once, can backfill new categories

2. **Embedding Generation (Python)**:
   - Chunks document text using adaptive strategy (1500-3500 chars)
   - Generates vector embeddings using OpenAI text-embedding-3-small
   - Stores embeddings in SQLite with sqlite-vec extension
   - Enables semantic search across all party documents
   - Run once per document set

3. **Web Application (Next.js)**:
   - **Static Pages**: Reads from SQLite at build time, generates static HTML
   - **Dynamic Chat**: Server-side API routes for real-time AI interactions
   - **Hybrid Rendering**: Fast static pages + dynamic AI features
   - **Vector Search**: Retrieval-Augmented Generation (RAG) for accurate answers

This separation allows expensive AI processing to happen once offline, while the website combines instant static pages with dynamic AI-powered features.

#### Hybrid Architecture: Static + Dynamic

The website combines static generation with dynamic features:

**Static Pages** (Party listings, comparisons, detail views):
- Pre-rendered HTML loads instantly
- All party data embedded at build time
- Client-side interactivity (filtering, theme switching)
- Can be deployed to static CDN

**Dynamic Features** (AI Chat):
- Server-side API routes for real-time interactions
- Streaming responses from OpenAI
- Vector similarity search across documents
- Requires Node.js runtime (Vercel, Railway, etc.)

**Benefits**:
- **Performance**: Static pages load instantly, chat responds in real-time
- **Cost-Effective**: Most traffic hits static pages, only chat uses compute
- **Reliability**: Static pages always available, even if chat is down
- **Scalability**: CDN handles static traffic, serverless handles chat bursts
- **User Experience**: Best of both worlds - speed + intelligent features

#### Docker Deployment

The project includes production-ready Docker infrastructure:

- **Multi-stage build**: Bun for dependencies → Node.js for build → nginx for serving
- **Security**: Non-root user, minimal attack surface
- **Performance**: Optimized caching, gzip compression, aggressive asset caching
- **Health checks**: Built-in monitoring
- **CI/CD**: GitHub Actions workflow for automated builds and deployment to GHCR

```bash
# Build and run locally
docker build -t elecciones2026 .
docker run -d -p 8080:8080 elecciones2026

# Or use GitHub Actions to deploy automatically on push to main
```

### Configuration

#### Theme & Dark Mode

The site supports both light and dark themes with automatic system preference detection:

- **Default**: Light theme (with system preference detection enabled)
- **Theme Toggle**: Click the sun/moon icon in the header to switch themes
- **Powered by**: `next-themes` for seamless theme switching
- **Persistence**: Theme preference is saved in localStorage
- **Configuration**:
  - Tailwind config: `tailwind.config.ts` (`darkMode: 'class'`)
  - Base styles: `app/globals.css`
  - Theme provider: `components/ThemeProvider.tsx`
  - Toggle button: `components/ThemeToggle.tsx`

All components support dark mode with Tailwind's `dark:` variant classes.

#### AI Chat Feature

The chat feature uses Retrieval-Augmented Generation (RAG) for accurate answers:

**How it works:**
1. **User asks a question** - e.g., "What does PLN propose for education?"
2. **Query embedding** - Question is converted to vector using OpenAI embeddings
3. **Semantic search** - sqlite-vec finds most relevant chunks from party documents
4. **Context injection** - Top 10 relevant chunks are added to GPT-4 prompt with page numbers
5. **Streaming response** - AI generates answer based only on retrieved context
6. **Source attribution** - Response includes page numbers for verification

**Key Features:**
- **Accurate**: Only answers based on actual document content
- **Transparent**: Includes page numbers from source PDFs
- **Fast**: Vector search typically returns results in <100ms
- **Multi-party**: Can search across specific parties or all parties
- **Context-aware**: Maintains conversation history for follow-up questions

**Configuration:**
- Controlled by PostHog feature flag `chat-sidebar`
- Can be enabled/disabled per environment
- Gracefully degrades if OpenAI API key is missing
- All chat data is ephemeral (not stored in database)

#### Party Colors

Party colors are configured in `lib/party-colors.ts`. Currently uses placeholders with different Tailwind colors.

#### Static Site Generation (SSG)

- Pages are statically generated at build time
- To update site after running pipeline: `bun run build`
- Static output is in the `out/` folder

## Useful Commands

### Linting and Formatting

```bash
cd web
bun run lint      # Check for errors
bun run format    # Format code
bun run check     # Lint and auto-format
```

### Database

```bash
# View parties in DB
sqlite3 data/database.db "SELECT * FROM parties;"

# View statistics
sqlite3 data/database.db "SELECT COUNT(*) FROM party_positions;"

# Export data
sqlite3 data/database.db ".mode csv" ".output export.csv" "SELECT * FROM party_positions;"
```

## Future Ideas & Enhancements

### Completed ✅

- Dark mode support with theme persistence
- Party flag images
- Docker deployment infrastructure
- CI/CD pipeline with GitHub Actions
- Responsive mobile design
- **AI-powered chat with semantic search (RAG)**
- **Vector embeddings for document search**
- **Multi-party comparison in chat**
- **Real-time streaming responses**
- **PostHog analytics and feature flags**

### In Progress 🚧

- Performance monitoring and optimization
- Error tracking and logging
- Chat conversation analytics

### Potential Enhancements

**Content & Features:**
1. **Advanced Filters**: Filter parties by ideology on home page
2. **Social Sharing**: Generate shareable comparison images
3. **PDF Export**: Download comparison as PDF
4. **Historical Data**: Compare with 2022 platforms
5. **Candidate Profiles**: Add presidential candidate information
6. **Chat Improvements**: Save conversations, share chat links, export Q&A

**Technical:**
1. **SEO**: Enhanced metadata, Open Graph tags, structured data
2. **PWA**: Progressive Web App with offline support (cache static pages)
3. **Internationalization**: English translation
4. **Testing**: E2E tests with Playwright
5. **Rate Limiting**: Protect chat API from abuse
6. **Caching**: Redis cache for frequently asked questions

**Analysis Pipeline:**
1. **More Categories**: Environmental policy, foreign policy, etc.
2. **Improved Embeddings**: Fine-tune chunking strategy based on chat usage
3. **Fact Checking**: Cross-reference proposals with budget data
4. **Timeline Extraction**: Extract implementation timelines
5. **Cost Analysis**: Detailed budget breakdown per proposal
6. **Multi-language Support**: Generate embeddings for English translations

## Data Source

Data comes from the **Tribunal Supremo de Elecciones (TSE)** of Costa Rica:

- URL: <https://www.tse.go.cr/2026/planesgobierno.html>
- Last updated: November 2025

## Data Access & Structure

All data is **publicly available** for exploration, analysis, and building upon:

### Database Structure

The SQLite database (`data/database.db`) contains:

**Core Tables:**
- `parties` - Basic party information (name, abbreviation, colors)
- `categories` - Policy categories (economy, health, education, etc.)
- `party_positions` - Analysis results linking parties to categories with:
  - `summary` - Brief overview of party's position
  - `key_proposals` - JSON array of specific proposals
  - `ideology_position` - Ideological classification
  - `budget_priority` - Budget allocation level

**Document & Embedding Tables:**
- `documents` - PDF metadata for each party
- `document_text` - Extracted text from each PDF page
- `document_embeddings` - Vector embeddings for semantic search
  - Uses sqlite-vec virtual table for vector similarity
  - 1536-dimensional embeddings from text-embedding-3-small
  - Adaptive chunking strategy (1500-3500 chars per chunk)
  - Cosine distance for similarity scoring

**Search Indexes:**
- `party_positions_fts` - Full-text search index (FTS5) for party positions
- `vec_document_embeddings` - Vector index for semantic similarity

**Raw PDFs:**
- Original government plans: `data/partidos/*.pdf`
- Direct downloads from TSE website

### Accessing the Data

```bash
# Query all party positions
sqlite3 data/database.db "SELECT * FROM party_positions;"

# Export to CSV
sqlite3 data/database.db <<EOF
.mode csv
.headers on
.output party_data.csv
SELECT
  p.name as party_name,
  c.name as category,
  pp.summary,
  pp.ideology_position,
  pp.budget_priority
FROM party_positions pp
JOIN parties p ON pp.party_id = p.id
JOIN categories c ON pp.category_id = c.id;
EOF
```

### Use Cases

The structured data enables:
- Academic research on political platforms
- Data journalism and visualization
- Comparative policy analysis
- Machine learning on political text
- Alternative interfaces and tools

All data processing code is open source in the `pipeline/` directory.

## Contributing

Contributions are welcome! Here's how you can help:

### Adding New Categories

```bash
# 1. Add category to config
vim pipeline/config/categories.yaml

# 2. Backfill analysis for all parties
cd pipeline
python main.py backfill new_category_name

# 3. Rebuild website
cd ../web
bun run build
```

### Improving Analysis

- Enhance prompts in `pipeline/src/analyzer.py`
- Add validation rules
- Improve data extraction

### Website Enhancements

- Fix bugs or add features
- Improve mobile experience
- Add visualizations
- Enhance accessibility

### Reporting Issues

Found incorrect data or analysis? Please open an issue with:
- Party name and category
- What's incorrect
- Link to source in PDF (page number)

Pull requests are appreciated but please open an issue first to discuss major changes.

## License

Public data from TSE Costa Rica. Project code is open source.
