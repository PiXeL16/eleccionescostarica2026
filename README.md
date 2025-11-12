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
```

### Current Status

- ✅ 20 political parties downloaded
- ✅ 13 categories defined
- ✅ 260 complete analyses (20 parties × 13 categories)
- ✅ Total cost: $7.79 USD
- ✅ 1.4M tokens processed

## Website (Next.js)

### Installation

```bash
cd web
bun install
```

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

### Technologies

- **Next.js 14** - React framework with static export
- **Bun** - Package manager and runtime
- **Tailwind CSS** - Utility-first CSS
- **next-themes** - Dark mode support
- **Biome** - Linter and formatter
- **better-sqlite3** - SQLite access
- **TypeScript** - Static typing

### Architecture & Design Decisions

#### Two-Stage Pipeline

The project is split into two independent stages:

1. **Analysis Pipeline (Python)**:
   - Downloads PDFs from TSE
   - Processes documents through OpenAI's GPT-4
   - Extracts structured data (summaries, proposals, ideology, budget)
   - Stores results in SQLite database
   - Run once, can backfill new categories

2. **Static Website (Next.js)**:
   - Reads from SQLite at build time
   - Generates fully static HTML/CSS/JS
   - No runtime server needed
   - Fast, cacheable, CDN-friendly

This separation allows the expensive AI processing to happen once, while the website can be rebuilt instantly as many times as needed.

#### Static Export Strategy

The website uses Next.js static export (`output: 'export'`) for several advantages:

- **Performance**: Pre-rendered HTML loads instantly
- **Cost**: No server needed, can host on static CDN
- **Reliability**: No database queries at runtime
- **Scalability**: Can handle unlimited traffic
- **Security**: No API endpoints to secure

All data is embedded in the static pages at build time, with client-side React handling interactivity (filtering, comparison, theme switching).

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

- ✅ Dark mode support with theme persistence
- ✅ Party flag images
- ✅ Docker deployment infrastructure
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Static export optimization
- ✅ Responsive mobile design
- ✅ Suspense boundaries for optimal SSG

### Potential Enhancements

**Content & Features:**
1. **Search**: Full-text search across all party positions
2. **Filters**: Filter parties by ideology on home page
3. **Social Sharing**: Generate shareable comparison images
4. **PDF Export**: Download comparison as PDF
5. **Historical Data**: Compare with 2022 platforms
6. **Candidate Profiles**: Add presidential candidate information

**Technical:**
1. **SEO**: Enhanced metadata, Open Graph tags, structured data
2. **Analytics**: Privacy-friendly analytics (Plausible, Umami)
3. **PWA**: Progressive Web App with offline support
4. **Internationalization**: English translation
5. **Performance**: Image optimization, lazy loading
6. **Testing**: E2E tests with Playwright

**Analysis Pipeline:**
1. **More Categories**: Environmental policy, foreign policy, etc.
2. **Party Comparison**: Automatic similarity scoring
3. **Fact Checking**: Cross-reference proposals with budget data
4. **Timeline Extraction**: Extract implementation timelines
5. **Cost Analysis**: Detailed budget breakdown per proposal

**Deployment:**
1. **CDN**: Deploy to Cloudflare Pages or Vercel
2. **Custom Domain**: elecciones2026.cr or similar
3. **Monitoring**: Uptime monitoring and error tracking
4. **Staging Environment**: Preview deployments for testing

## Data Source

Data comes from the **Tribunal Supremo de Elecciones (TSE)** of Costa Rica:

- URL: <https://www.tse.go.cr/2026/planesgobierno.html>
- Last updated: November 2025

## License

Public data from TSE Costa Rica. Project code is open source.
