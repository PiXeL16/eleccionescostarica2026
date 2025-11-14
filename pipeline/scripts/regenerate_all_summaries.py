#!/usr/bin/env python3
"""
Regenerate all party position summaries using semantic search + RAG.
Much more accurate than the original approach that fed entire PDFs to GPT-4o.
"""

import os
import sys
import json
import struct
import sqlite3
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

from openai import OpenAI
from dotenv import load_dotenv
import sqlite_vec

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.storage.database import Database

# Load environment variables
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Database path
DB_PATH = Path(__file__).parent.parent.parent / "data" / "database.db"


# Category-specific search queries for better semantic search
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


def generate_query_embedding(query: str) -> bytes:
    """Generate embedding for a query."""
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=query,
    )
    embedding = response.data[0].embedding
    return struct.pack(f'{len(embedding)}f', *embedding)


def semantic_search(db: Database, query: str, party_id: int, limit: int = 15) -> List[Dict]:
    """Perform semantic search for relevant content."""
    query_embedding = generate_query_embedding(query)

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
    """
    Generate summary using GPT-4o with focused context from semantic search.
    Returns structured summary with proposals, budget info, and ideology.
    """
    # Build context from chunks
    context = f"Información relevante sobre {category_name} de la plataforma de {party_name}:\n\n"
    for i, chunk in enumerate(chunks, 1):
        context += f"[Página {chunk['page_number']}, relevancia: {chunk['similarity']:.2f}]\n"
        context += f"{chunk['chunk_text']}\n\n"

    prompt = f"""Analiza la siguiente información sobre {category_name} de la plataforma electoral de {party_name}.

{context}

Genera un análisis estructurado en formato JSON con los siguientes campos:

1. "summary": Un resumen general (2-3 párrafos) de la posición del partido en este tema. IMPORTANTE: Incluye citas a las páginas específicas usando el formato [Página X] después de cada afirmación o propuesta. Ejemplo: "El partido propone aumentar la inversión en educación [Página 15]". Las citas deben ser parte natural del texto.
2. "key_proposals": Un array de 3-5 propuestas clave específicas (strings). Cada propuesta debe incluir su cita de página al final, ejemplo: "Aumentar presupuesto educativo a 8% del PIB [Página 12]"
3. "ideology_position": La posición ideológica general (progresista/conservadora/centrista/etc.) si es evidente, o null si no está claro
4. "budget_mentioned": Cualquier mención de presupuesto o recursos financieros, o null si no se menciona

IMPORTANTE:
- Sé preciso y cita propuestas específicas con números de página en formato [Página X]
- No inventes información que no esté en el contexto
- Si no hay información suficiente sobre un campo, usa null
- key_proposals debe ser un array de strings, no objetos
- SIEMPRE incluye citas de página en el summary y key_proposals
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

    # Parse JSON response
    result = json.loads(response.choices[0].message.content)

    return {
        'summary': result.get('summary', ''),
        'key_proposals': result.get('key_proposals', []),
        'ideology_position': result.get('ideology_position'),
        'budget_mentioned': result.get('budget_mentioned'),
        'chunks_used': len(chunks),
        'avg_similarity': sum(c['similarity'] for c in chunks) / len(chunks) if chunks else 0
    }


def regenerate_all_summaries(dry_run: bool = False, skip_confirm: bool = False):
    """
    Regenerate all party position summaries using semantic search.

    Args:
        dry_run: If True, only count and estimate cost without making changes
        skip_confirm: If True, skip confirmation prompt
    """
    print("🔄 Regenerating Party Position Summaries")
    print("=" * 80)
    print(f"Mode: {'DRY RUN (no changes)' if dry_run else 'PRODUCTION (will update database)'}")
    print(f"Database: {DB_PATH}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    db = Database(str(DB_PATH))

    # Get all parties and categories
    with db.get_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT id, name, abbreviation FROM parties ORDER BY name")
        parties = cursor.fetchall()

        cursor.execute("SELECT id, name, description FROM categories WHERE active = 1 ORDER BY display_order")
        categories = cursor.fetchall()

    total_summaries = len(parties) * len(categories)
    print(f"📊 Found {len(parties)} parties and {len(categories)} categories")
    print(f"📝 Total summaries to regenerate: {total_summaries}")

    if dry_run:
        # Estimate cost: ~2K tokens per summary × $5/1M tokens
        estimated_tokens = total_summaries * 2000
        estimated_cost = (estimated_tokens / 1_000_000) * 5.0
        print(f"\n💰 Estimated cost: {estimated_tokens:,} tokens ≈ ${estimated_cost:.2f}")
        print("\nRun without --dry-run to proceed with regeneration.")
        return

    if not skip_confirm:
        print(f"\n⚠️  This will cost approximately ${(total_summaries * 2000 / 1_000_000) * 5:.2f}")
        response = input("Continue? [y/N] ")
        if response.lower() != 'y':
            print("Aborted.")
            return

    # Track progress
    processed = 0
    errors = 0
    start_time = datetime.now()

    print("\n" + "=" * 80)
    print("Starting regeneration...")
    print("=" * 80 + "\n")

    for party_id, party_name, party_abbr in parties:
        print(f"\n{'=' * 80}")
        print(f"🏛️  {party_name} ({party_abbr})")
        print("=" * 80)

        for category_id, category_name, category_description in categories:
            processed += 1
            progress = (processed / total_summaries) * 100

            try:
                # Generate search query
                query = CATEGORY_QUERIES.get(category_name, f"{category_name} {category_description}")

                # Perform semantic search
                chunks = semantic_search(db, query, party_id, limit=15)

                if not chunks:
                    print(f"  ⚠️  [{processed}/{total_summaries}] {category_name}: No relevant chunks found, skipping")
                    continue

                # Generate new summary
                result = generate_summary(chunks, category_name, party_name)

                # Update database
                with db.get_connection() as conn:
                    cursor = conn.cursor()
                    cursor.execute("""
                        UPDATE party_positions
                        SET
                            summary = ?,
                            key_proposals = ?,
                            ideology_position = ?,
                            budget_mentioned = ?
                        WHERE party_id = ? AND category_id = ?
                    """, (
                        result['summary'],
                        json.dumps(result['key_proposals'], ensure_ascii=False),
                        result['ideology_position'],
                        result['budget_mentioned'],
                        party_id,
                        category_id
                    ))

                print(f"  ✅ [{processed}/{total_summaries}] {category_name}: "
                      f"{result['chunks_used']} chunks, "
                      f"sim={result['avg_similarity']:.3f}, "
                      f"{len(result['key_proposals'])} proposals "
                      f"({progress:.1f}%)")

            except Exception as e:
                errors += 1
                print(f"  ❌ [{processed}/{total_summaries}] {category_name}: ERROR - {str(e)}")
                continue

    # Final summary
    elapsed = (datetime.now() - start_time).total_seconds()
    print("\n" + "=" * 80)
    print("🏁 Regeneration Complete!")
    print("=" * 80)
    print(f"Processed: {processed}/{total_summaries} summaries")
    print(f"Errors: {errors}")
    print(f"Time elapsed: {elapsed:.1f}s ({elapsed/60:.1f} minutes)")
    print(f"Average: {elapsed/processed:.2f}s per summary")
    print(f"Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Regenerate party position summaries using semantic search")
    parser.add_argument('--dry-run', action='store_true', help='Estimate cost without making changes')
    parser.add_argument('--yes', '-y', action='store_true', help='Skip confirmation prompt')
    args = parser.parse_args()

    regenerate_all_summaries(dry_run=args.dry_run, skip_confirm=args.yes)


if __name__ == "__main__":
    main()
