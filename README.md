# Political Platforms Costa Rica 2026

Website to compare political party platforms for Costa Rica's 2026 elections.

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

- **Next.js 16** - React framework with SSR
- **Bun** - Package manager and runtime
- **Tailwind CSS** - Utility-first CSS
- **Biome** - Linter and formatter
- **better-sqlite3** - SQLite access
- **TypeScript** - Static typing

### Configuration

#### Theme

The site uses light theme by default. Styles are in `app/globals.css` and can be customized in `tailwind.config.ts`. Dark mode support is configured via the `darkMode: 'class'` setting in Tailwind.

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

## Next Steps

1. **Official Logos**: Replace placeholders with real party logos
2. **Search**: Add search functionality on home page
3. **Filters**: Filter by ideology on main page
4. **SEO**: Improve metadata and Open Graph tags
5. **Analytics**: Integrate Google Analytics or similar
6. **Deploy**: Deploy to Vercel or similar platform

## Data Source

Data comes from the **Tribunal Supremo de Elecciones (TSE)** of Costa Rica:

- URL: <https://www.tse.go.cr/2026/planesgobierno.html>
- Last updated: November 2025

## License

Public data from TSE Costa Rica. Project code is open source.
