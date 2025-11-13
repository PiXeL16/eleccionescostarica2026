#!/usr/bin/env python3
# ABOUTME: Automated script to discover new party PDFs and run full analysis pipeline
# ABOUTME: Extracts metadata from PDF, adds to database, runs extraction + embeddings + analysis

import os
import sys
import json
import hashlib
import struct
import re
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from datetime import datetime
from slugify import slugify

import fitz  # PyMuPDF
from openai import OpenAI
from dotenv import load_dotenv
import sqlite_vec

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.storage.database import Database
from src.extraction.pdf_extractor import PDFExtractor
from src.analysis.llm_analyzer import LLMAnalyzer

# Load environment variables
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Paths
PARTIDOS_DIR = Path(__file__).parent.parent.parent / "data" / "partidos"
DB_PATH = Path(__file__).parent.parent.parent / "data" / "database.db"


def calculate_file_hash(file_path: Path) -> str:
    """Calculate SHA256 hash of a file."""
    sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256.update(chunk)
    return sha256.hexdigest()


def extract_metadata_from_pdf(pdf_path: Path) -> Dict:
    """
    Use GPT-4o-mini to extract party metadata from PDF first pages.

    Returns:
        {
            'name': 'Partido Liberación Nacional',
            'abbreviation': 'PLN',
            'ideology': 'Socialdemócrata' (optional),
            'website': 'https://pln.or.cr' (optional)
        }
    """
    print(f"  📄 Reading PDF: {pdf_path.name}")

    # Read first 2 pages of PDF
    doc = fitz.open(pdf_path)
    num_pages = min(2, len(doc))

    text = ""
    for page_num in range(num_pages):
        page = doc[page_num]
        text += page.get_text()

    doc.close()

    # Truncate to first 3000 characters to save tokens
    text = text[:3000]

    print(f"  🤖 Extracting metadata with GPT-4o-mini...")

    prompt = f"""Analiza las primeras páginas de este plan de gobierno de un partido político de Costa Rica.

{text}

Extrae la siguiente información y responde SOLO con JSON válido (sin markdown ni texto adicional):

{{
  "name": "Nombre completo oficial del partido (sin siglas)",
  "abbreviation": "Siglas del partido (2-6 letras mayúsculas)",
  "ideology": "Ideología política si se menciona explícitamente, o null",
  "website": "Sitio web oficial si se menciona, o null"
}}

IMPORTANTE:
- name debe ser el nombre completo SIN las siglas (ej: "Liberación Nacional" NO "PLN" ni "Partido Liberación Nacional")
- abbreviation debe ser solo las letras mayúsculas (ej: "PLN")
- Si no encuentras algún campo, usa null
- Responde SOLO con el JSON, sin markdown ni explicaciones"""

    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Eres un experto en análisis de documentos políticos de Costa Rica. Respondes únicamente con JSON válido."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        response_format={"type": "json_object"}
    )

    metadata = json.loads(response.choices[0].message.content)

    print(f"  ✅ Extracted: {metadata['name']} ({metadata['abbreviation']})")

    return metadata


def generate_folder_name(abbreviation: str, name: str) -> str:
    """Generate standardized folder name: {ABBR}-{Name-Slugified}"""
    # Slugify name (removes accents, spaces -> hyphens, lowercase)
    slug = slugify(name, separator='-')
    # Capitalize first letter of each word
    slug = '-'.join(word.capitalize() for word in slug.split('-'))
    return f"{abbreviation}-{slug}"


def discover_new_parties(db: Database) -> List[Tuple[Path, Path]]:
    """
    Scan partidos directory for folders not yet in database.

    Returns:
        List of (folder_path, pdf_file_path) tuples
    """
    # Get existing parties from database
    with db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT folder_name, abbreviation FROM parties")
        existing = {row[0] for row in cursor.fetchall()}
        existing_abbr = {row[1] for row in cursor.fetchall()}

    # Scan directories
    new_parties = []

    if not PARTIDOS_DIR.exists():
        print(f"⚠️  Directory not found: {PARTIDOS_DIR}")
        return new_parties

    for folder in PARTIDOS_DIR.iterdir():
        if not folder.is_dir():
            continue

        folder_name = folder.name

        # Skip if already in database (by folder name)
        if folder_name in existing:
            continue

        # Find PDF file in folder
        pdf_files = list(folder.glob("*.pdf"))

        if len(pdf_files) == 0:
            print(f"⚠️  No PDF found in {folder_name}, skipping")
            continue

        if len(pdf_files) > 1:
            print(f"⚠️  Multiple PDFs in {folder_name}, using first: {pdf_files[0].name}")

        pdf_path = pdf_files[0]

        new_parties.append((folder, pdf_path))

    return new_parties


def add_party_to_database(db: Database, metadata: Dict, pdf_path: Path, folder_path: Path) -> int:
    """
    Add party and document to database.

    Returns:
        party_id
    """
    # Calculate file stats
    file_hash = calculate_file_hash(pdf_path)
    file_size = pdf_path.stat().st_size

    with db.get_connection() as conn:
        cursor = conn.cursor()

        # Insert party
        cursor.execute("""
            INSERT INTO parties (name, abbreviation, folder_name, ideology, website, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            metadata['name'],
            metadata['abbreviation'],
            folder_path.name,
            metadata.get('ideology'),
            metadata.get('website'),
            datetime.now().isoformat()
        ))

        party_id = cursor.lastrowid

        # Count pages
        doc = fitz.open(pdf_path)
        page_count = len(doc)
        doc.close()

        # Insert document
        cursor.execute("""
            INSERT INTO documents (
                party_id,
                title,
                document_type,
                file_path,
                file_hash,
                page_count,
                upload_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            party_id,
            f"Plan de Gobierno {metadata['name']} 2026",
            'plan_gobierno',
            str(pdf_path.absolute()),
            file_hash,
            page_count,
            datetime.now().isoformat()
        ))

        conn.commit()

    return party_id


def generate_embeddings_for_party(db: Database, party_id: int):
    """Generate embeddings for a specific party's document pages."""
    print(f"  📊 Generating embeddings...")

    # Get document
    with db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM documents WHERE party_id = ?", (party_id,))
        doc_row = cursor.fetchone()

        if not doc_row:
            print(f"  ❌ No document found for party_id {party_id}")
            return

        document_id = doc_row[0]

        # Get all pages without embeddings
        cursor.execute("""
            SELECT id, page_number, raw_text
            FROM document_text
            WHERE document_id = ?
            AND id NOT IN (SELECT DISTINCT document_text_id FROM document_embeddings)
            ORDER BY page_number
        """, (document_id,))

        pages = cursor.fetchall()

    if not pages:
        print(f"  ℹ️  All pages already have embeddings")
        return

    print(f"  📄 Processing {len(pages)} pages...")

    total_tokens = 0
    total_chunks = 0

    for page_id, page_num, raw_text in pages:
        # Adaptive chunking strategy
        text_length = len(raw_text)

        if text_length < 1500:
            # Small page - single chunk
            chunks = [raw_text]
        elif text_length < 3500:
            # Medium page - split in half with overlap
            mid = text_length // 2
            overlap = 200
            chunks = [
                raw_text[:mid + overlap],
                raw_text[mid - overlap:]
            ]
        else:
            # Large page - multiple chunks
            chunk_size = 1500
            overlap = 200
            chunks = []
            start = 0
            while start < text_length:
                end = start + chunk_size
                chunks.append(raw_text[start:end])
                start = end - overlap

        # Generate embeddings for each chunk
        for chunk_index, chunk_text in enumerate(chunks):
            if len(chunk_text.strip()) < 50:
                continue

            # Call OpenAI embeddings API
            response = openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=chunk_text
            )

            embedding = response.data[0].embedding
            token_count = response.usage.total_tokens

            # Serialize embedding as binary
            embedding_blob = struct.pack(f'{len(embedding)}f', *embedding)

            # Store in database
            with db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO document_embeddings (
                        document_text_id,
                        chunk_index,
                        chunk_text,
                        embedding,
                        embedding_model,
                        token_count,
                        created_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    page_id,
                    chunk_index,
                    chunk_text,
                    embedding_blob,
                    'text-embedding-3-small',
                    token_count,
                    datetime.now().isoformat()
                ))
                conn.commit()

            total_tokens += token_count
            total_chunks += 1

    cost = (total_tokens / 1_000_000) * 0.020
    print(f"  ✅ Generated {total_chunks} embeddings ({total_tokens:,} tokens, ${cost:.4f})")


def run_category_analysis(db: Database, party_id: int):
    """Run LLM analysis for all categories using semantic search."""
    print(f"  🔍 Running category analysis with semantic search...")

    # Category-specific search queries
    CATEGORY_QUERIES = {
        'Educación': 'propuestas sobre educación, escuelas, colegios, universidades, maestros, profesores, estudiantes, sistema educativo, primera infancia, MEP',
        'Salud': 'propuestas sobre salud, hospitales, clínicas, médicos, CCSS, seguro social, medicina, atención médica, sistema de salud',
        'Economía': 'propuestas económicas, finanzas públicas, presupuesto, PIB, crecimiento económico, desarrollo económico, política económica',
        'Seguridad': 'propuestas sobre seguridad, policía, crimen, delincuencia, OIJ, cárceles, justicia penal, seguridad ciudadana',
        'Empleo': 'propuestas sobre empleo, trabajo, desempleo, trabajadores, salario, derechos laborales, mercado laboral',
        'Medio Ambiente': 'propuestas ambientales, cambio climático, conservación, recursos naturales, energía renovable, sostenibilidad',
        'Vivienda': 'propuestas sobre vivienda, acceso a vivienda, bono de vivienda, construcción, urbanismo',
        'Infraestructura': 'propuestas de infraestructura, carreteras, puentes, transporte público, obras públicas',
        'Tecnología': 'propuestas tecnológicas, digitalización, conectividad, internet, innovación tecnológica',
        'Corrupción': 'propuestas anticorrupción, transparencia, rendición de cuentas, ética pública, control interno',
        'Derechos Humanos': 'derechos humanos, igualdad, no discriminación, grupos vulnerables, inclusión social',
        'Cultura': 'propuestas culturales, arte, patrimonio cultural, identidad nacional, promoción cultural',
        'Agricultura': 'propuestas agrícolas, producción agrícola, campesinos, agro, sector agropecuario',
    }

    # Get party info
    with db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name, abbreviation FROM parties WHERE id = ?", (party_id,))
        party_row = cursor.fetchone()
        party_name = party_row[0]

        cursor.execute("SELECT id FROM documents WHERE party_id = ?", (party_id,))
        doc_row = cursor.fetchone()
        document_id = doc_row[0]

        cursor.execute("SELECT id, name, description FROM categories WHERE active = 1 ORDER BY display_order")
        categories = cursor.fetchall()

    total_categories = len(categories)

    for idx, (category_id, category_name, category_description) in enumerate(categories, 1):
        print(f"  [{idx}/{total_categories}] {category_name}...", end=" ")

        try:
            # Generate search query
            query = CATEGORY_QUERIES.get(category_name, f"{category_name} {category_description}")

            # Perform semantic search
            chunks = semantic_search(db, query, party_id, limit=15)

            if not chunks:
                print("⚠️  No relevant chunks found")
                continue

            # Generate summary
            result = generate_summary(chunks, category_name, party_name)

            # Update database
            with db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO party_positions (
                        party_id,
                        document_id,
                        category_id,
                        summary,
                        key_proposals,
                        ideology_position,
                        budget_mentioned
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    party_id,
                    document_id,
                    category_id,
                    result['summary'],
                    json.dumps(result['key_proposals'], ensure_ascii=False),
                    result['ideology_position'],
                    result['budget_mentioned']
                ))
                conn.commit()

            print(f"✅ {len(result['key_proposals'])} proposals")

        except Exception as e:
            print(f"❌ Error: {str(e)}")
            continue


def semantic_search(db: Database, query: str, party_id: int, limit: int = 15) -> List[Dict]:
    """Perform semantic search for relevant content."""
    # Generate query embedding
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=query,
    )
    embedding = response.data[0].embedding
    query_embedding = struct.pack(f'{len(embedding)}f', *embedding)

    sql = """
        SELECT
            dt.page_number,
            de.chunk_text,
            vec_distance_cosine(de.embedding, ?) as distance
        FROM document_embeddings de
        JOIN document_text dt ON de.document_text_id = dt.id
        JOIN documents d ON dt.document_id = d.id
        WHERE d.party_id = ?
        ORDER BY distance ASC
        LIMIT ?
    """

    with db.get_connection() as conn:
        # Load sqlite-vec extension
        conn.enable_load_extension(True)
        sqlite_vec.load(conn)
        conn.enable_load_extension(False)

        cursor = conn.cursor()
        cursor.execute(sql, (query_embedding, party_id, limit))

        results = []
        for row in cursor.fetchall():
            results.append({
                'page_number': row[0],
                'chunk_text': row[1],
                'distance': row[2],
                'similarity': 1 - row[2]
            })

    return results


def generate_summary(chunks: List[Dict], category_name: str, party_name: str) -> Dict:
    """Generate summary using GPT-4o with focused context from semantic search."""
    # Build context from chunks
    context = f"Información relevante sobre {category_name} de la plataforma de {party_name}:\n\n"
    for i, chunk in enumerate(chunks, 1):
        context += f"[Página {chunk['page_number']}, relevancia: {chunk['similarity']:.2f}]\n"
        context += f"{chunk['chunk_text']}\n\n"

    prompt = f"""Analiza la siguiente información sobre {category_name} de la plataforma electoral de {party_name}.

{context}

Genera un análisis estructurado en formato JSON con los siguientes campos:

1. "summary": Un resumen general (2-3 párrafos) de la posición del partido en este tema
2. "key_proposals": Un array de 3-5 propuestas clave específicas (strings)
3. "ideology_position": La posición ideológica general (progresista/conservadora/centrista/etc.) si es evidente, o null si no está claro
4. "budget_mentioned": Cualquier mención de presupuesto o recursos financieros, o null si no se menciona

IMPORTANTE:
- Sé preciso y cita propuestas específicas
- No inventes información que no esté en el contexto
- Si no hay información suficiente sobre un campo, usa null
- key_proposals debe ser un array de strings, no objetos
- Responde SOLO con el JSON, sin markdown ni texto adicional"""

    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Eres un analista político experto en Costa Rica. Respondes únicamente con JSON válido."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        response_format={"type": "json_object"}
    )

    result = json.loads(response.choices[0].message.content)

    return {
        'summary': result.get('summary', ''),
        'key_proposals': result.get('key_proposals', []),
        'ideology_position': result.get('ideology_position'),
        'budget_mentioned': result.get('budget_mentioned'),
    }


def process_new_party(db: Database, folder_path: Path, pdf_path: Path):
    """
    Process a new party through the complete pipeline.

    Steps:
    1. Extract metadata from PDF
    2. Rename folder/PDF to standard convention
    3. Create metadata.json
    4. Add to database
    5. Extract text from PDF
    6. Generate embeddings
    7. Run category analysis
    """
    print(f"\n{'=' * 80}")
    print(f"📦 Processing: {folder_path.name}")
    print(f"{'=' * 80}")

    # Step 1: Extract metadata
    metadata = extract_metadata_from_pdf(pdf_path)

    # Step 2: Generate standard folder name
    standard_folder_name = generate_folder_name(metadata['abbreviation'], metadata['name'])
    standard_pdf_name = f"{metadata['abbreviation']}.pdf"

    # Rename folder if needed
    new_folder_path = PARTIDOS_DIR / standard_folder_name
    if folder_path != new_folder_path:
        print(f"  📁 Renaming folder: {folder_path.name} → {standard_folder_name}")
        folder_path.rename(new_folder_path)
        folder_path = new_folder_path

    # Rename PDF if needed
    new_pdf_path = folder_path / standard_pdf_name
    if pdf_path != new_pdf_path:
        print(f"  📄 Renaming PDF: {pdf_path.name} → {standard_pdf_name}")
        pdf_path.rename(new_pdf_path)
        pdf_path = new_pdf_path

    # Step 3: Create metadata.json
    metadata_file = folder_path / "metadata.json"
    metadata_content = {
        "party": {
            "name": metadata['name'],
            "abbreviation": metadata['abbreviation'],
            "folder_name": standard_folder_name,
            "ideology": metadata.get('ideology'),
            "website": metadata.get('website')
        },
        "pdf": {
            "filename": standard_pdf_name,
            "file_hash": calculate_file_hash(pdf_path),
            "file_size": pdf_path.stat().st_size
        },
        "metadata": {
            "added_date": datetime.now().isoformat(),
            "extraction_method": "automated",
            "election_year": 2026,
            "country": "Costa Rica"
        }
    }

    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata_content, f, ensure_ascii=False, indent=2)

    print(f"  ✅ Created metadata.json")

    # Step 4: Add to database
    print(f"  💾 Adding to database...")
    party_id = add_party_to_database(db, metadata, pdf_path, folder_path)
    print(f"  ✅ Party added (ID: {party_id})")

    # Step 5: Extract text from PDF
    print(f"  📖 Extracting text from PDF...")
    extractor = PDFExtractor(db)

    with db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM documents WHERE party_id = ?", (party_id,))
        document_id = cursor.fetchone()[0]

    extractor.extract_document(document_id)
    print(f"  ✅ Text extraction complete")

    # Step 6: Generate embeddings
    generate_embeddings_for_party(db, party_id)

    # Step 7: Run category analysis
    run_category_analysis(db, party_id)

    print(f"\n✅ Complete! Party '{metadata['name']}' ({metadata['abbreviation']}) added and analyzed")


def main():
    print("🔍 Discovering New Parties")
    print("=" * 80)
    print(f"Scanning: {PARTIDOS_DIR}")
    print(f"Database: {DB_PATH}\n")

    # Initialize database
    db = Database(str(DB_PATH))

    # Discover new parties
    new_parties = discover_new_parties(db)

    if not new_parties:
        print("✅ No new parties found. All parties are up to date!")
        return

    print(f"📋 Found {len(new_parties)} new part{'y' if len(new_parties) == 1 else 'ies'}:\n")

    for folder, pdf in new_parties:
        print(f"  • {folder.name}")
        print(f"    PDF: {pdf.name}")

    # Estimate costs
    cost_per_party = 5.0  # Rough estimate
    total_cost = cost_per_party * len(new_parties)

    print(f"\n💰 Estimated cost: ${total_cost:.2f}")
    print(f"   (${cost_per_party:.2f} per party: metadata extraction + embeddings + analysis)")

    response = input("\n Continue with full analysis? [y/N] ")
    if response.lower() != 'y':
        print("Aborted.")
        return

    # Process each new party
    start_time = datetime.now()

    for idx, (folder, pdf) in enumerate(new_parties, 1):
        print(f"\n\n{'#' * 80}")
        print(f"# Party {idx}/{len(new_parties)}")
        print(f"{'#' * 80}")

        try:
            process_new_party(db, folder, pdf)
        except Exception as e:
            print(f"\n❌ ERROR processing {folder.name}: {str(e)}")
            import traceback
            traceback.print_exc()
            continue

    # Summary
    elapsed = (datetime.now() - start_time).total_seconds()
    print(f"\n\n{'=' * 80}")
    print(f"🏁 All Done!")
    print(f"{'=' * 80}")
    print(f"Processed: {len(new_parties)} part{'y' if len(new_parties) == 1 else 'ies'}")
    print(f"Time: {elapsed:.1f}s ({elapsed/60:.1f} minutes)")
    print(f"Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    main()
