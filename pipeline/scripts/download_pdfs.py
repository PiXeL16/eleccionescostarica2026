#!/usr/bin/env python3
# ABOUTME: Downloads political party government plan PDFs from TSE Costa Rica 2026 elections
# ABOUTME: Creates organized folder structure with metadata for each party

import requests
import json
import hashlib
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

# Base configuration
BASE_URL = "https://www.tse.go.cr/2026/docus/planesgobierno"
BASE_DIR = Path(__file__).parent.parent / "data" / "partidos"
DELAY_BETWEEN_DOWNLOADS = 1.5  # seconds
MAX_RETRIES = 3
TIMEOUT = 30  # seconds

# Complete list of political parties
PARTIES = [
    {"name": "Alianza Costa Rica Primero", "abbr": "CR1", "folder": "CR1-Alianza-Costa-Rica-Primero"},
    {"name": "Aquí Costa Rica Manda", "abbr": "ACRM", "folder": "ACRM-Aqui-Costa-Rica-Manda"},
    {"name": "Avanza", "abbr": "PA", "folder": "PA-Avanza"},
    {"name": "Centro Democrático y Social", "abbr": "CDS", "folder": "CDS-Centro-Democratico-y-Social"},
    {"name": "Coalición Agenda Ciudadana", "abbr": "CAC", "folder": "CAC-Coalicion-Agenda-Ciudadana"},
    {"name": "De la Clase Trabajadora", "abbr": "PDLCT", "folder": "PDLCT-De-la-Clase-Trabajadora"},
    {"name": "Esperanza Nacional", "abbr": "PEN", "folder": "PEN-Esperanza-Nacional"},
    {"name": "Esperanza y Libertad", "abbr": "PEL", "folder": "PEL-Esperanza-y-Libertad"},
    {"name": "Frente Amplio", "abbr": "FA", "folder": "FA-Frente-Amplio"},
    {"name": "Integración Nacional", "abbr": "PIN", "folder": "PIN-Integracion-Nacional"},
    {"name": "Justicia Social Costarricense", "abbr": "PJSC", "folder": "PJSC-Justicia-Social-Costarricense"},
    {"name": "Liberación Nacional", "abbr": "PLN", "folder": "PLN-Liberacion-Nacional"},
    {"name": "Liberal Progresista", "abbr": "PLP", "folder": "PLP-Liberal-Progresista"},
    {"name": "Nueva Generación", "abbr": "PNG", "folder": "PNG-Nueva-Generacion"},
    {"name": "Nueva República", "abbr": "PNR", "folder": "PNR-Nueva-Republica"},
    {"name": "Progreso Social Democrático", "abbr": "PSD", "folder": "PSD-Progreso-Social-Democratico"},
    {"name": "Pueblo Soberano", "abbr": "PPSO", "folder": "PPSO-Pueblo-Soberano"},
    {"name": "Unidad Social Cristiana", "abbr": "PUSC", "folder": "PUSC-Unidad-Social-Cristiana"},
    {"name": "Unidos Podemos", "abbr": "UP", "folder": "UP-Unidos-Podemos"},
    {"name": "Unión Costarricense Democrática", "abbr": "PUCD", "folder": "PUCD-Union-Costarricense-Democratica"},
]


def calculate_sha256(file_path: Path) -> str:
    """Calculate SHA256 checksum of a file."""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def download_pdf(url: str, output_path: Path, party_name: str) -> Optional[Dict]:
    """
    Download a PDF file with retry logic.

    Returns metadata dict if successful, None if failed.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"  Downloading {party_name}... (attempt {attempt}/{MAX_RETRIES})")

            response = requests.get(url, headers=headers, timeout=TIMEOUT, stream=True)
            response.raise_for_status()

            # Write the file
            output_path.write_bytes(response.content)

            # Calculate checksum and size
            file_size = output_path.stat().st_size
            checksum = calculate_sha256(output_path)

            print(f"  ✓ Successfully downloaded {party_name} ({file_size:,} bytes)")

            return {
                "success": True,
                "file_size_bytes": file_size,
                "checksum_sha256": checksum,
                "downloaded_at": datetime.now().isoformat(),
            }

        except requests.exceptions.RequestException as e:
            print(f"  ✗ Attempt {attempt} failed: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(2 * attempt)  # Exponential backoff
            else:
                print(f"  ✗ Failed to download {party_name} after {MAX_RETRIES} attempts")
                return None
        except Exception as e:
            print(f"  ✗ Unexpected error: {e}")
            return None

    return None


def create_metadata(party: Dict, download_info: Optional[Dict]) -> Dict:
    """Create metadata JSON for a party."""
    pdf_url = f"{BASE_URL}/{party['abbr']}.pdf"

    metadata = {
        "source": "https://www.tse.go.cr/2026/planesgobierno.html",
        "election_year": 2026,
        "country": "Costa Rica",
        "party": {
            "name": party["name"],
            "abbreviation": party["abbr"],
            "folder": party["folder"],
        },
        "pdf": {
            "filename": f"{party['abbr']}.pdf",
            "url": pdf_url,
        }
    }

    if download_info:
        metadata["pdf"].update({
            "downloaded": True,
            "file_size_bytes": download_info["file_size_bytes"],
            "checksum_sha256": download_info["checksum_sha256"],
            "downloaded_at": download_info["downloaded_at"],
        })
    else:
        metadata["pdf"]["downloaded"] = False

    return metadata


def main():
    """Main download orchestrator."""
    print("=" * 70)
    print("TSE Costa Rica 2026 - Political Party PDF Downloader")
    print("=" * 70)
    print(f"\nTotal parties to download: {len(PARTIES)}")
    print(f"Base directory: {BASE_DIR}")
    print(f"Delay between downloads: {DELAY_BETWEEN_DOWNLOADS}s")
    print()

    results = {
        "successful": [],
        "failed": [],
        "total": len(PARTIES),
        "start_time": datetime.now().isoformat(),
    }

    for idx, party in enumerate(PARTIES, 1):
        print(f"\n[{idx}/{len(PARTIES)}] Processing: {party['name']} ({party['abbr']})")

        # Prepare paths
        party_dir = BASE_DIR / party["folder"]
        pdf_path = party_dir / f"{party['abbr']}.pdf"
        metadata_path = party_dir / "metadata.json"
        pdf_url = f"{BASE_URL}/{party['abbr']}.pdf"

        # Download PDF
        download_info = download_pdf(pdf_url, pdf_path, party["name"])

        # Create and save metadata
        metadata = create_metadata(party, download_info)
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)

        # Track results
        if download_info:
            results["successful"].append(party["abbr"])
        else:
            results["failed"].append(party["abbr"])

        # Polite delay before next download (except for last one)
        if idx < len(PARTIES):
            time.sleep(DELAY_BETWEEN_DOWNLOADS)

    # Final summary
    results["end_time"] = datetime.now().isoformat()

    print("\n" + "=" * 70)
    print("DOWNLOAD SUMMARY")
    print("=" * 70)
    print(f"Total parties: {results['total']}")
    print(f"Successful: {len(results['successful'])}")
    print(f"Failed: {len(results['failed'])}")

    if results["failed"]:
        print(f"\nFailed downloads: {', '.join(results['failed'])}")
    else:
        print("\n✓ All PDFs downloaded successfully!")

    # Save summary report
    summary_path = BASE_DIR.parent / "download_summary.json"
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\nSummary saved to: {summary_path}")
    print("=" * 70)

    return 0 if not results["failed"] else 1


if __name__ == "__main__":
    exit(main())
