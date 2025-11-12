#!/usr/bin/env python3
# ABOUTME: Downloads official party logos from online sources
# ABOUTME: Searches for each party's official logo and saves it

import requests
from pathlib import Path
import time

# Official party information
PARTIES = [
    {"abbr": "ACRM", "name": "Aquí Costa Rica Manda", "folder": "ACRM-Aqui-Costa-Rica-Manda"},
    {"abbr": "CAC", "name": "Coalición Agenda Ciudadana", "folder": "CAC-Coalicion-Agenda-Ciudadana"},
    {"abbr": "CDS", "name": "Centro Democrático y Social", "folder": "CDS-Centro-Democratico-y-Social"},
    {"abbr": "CR1", "name": "Alianza Costa Rica Primero", "folder": "CR1-Alianza-Costa-Rica-Primero"},
    {"abbr": "FA", "name": "Frente Amplio", "folder": "FA-Frente-Amplio"},
    {"abbr": "PA", "name": "Avanza", "folder": "PA-Avanza"},
    {"abbr": "PDLCT", "name": "De la Clase Trabajadora", "folder": "PDLCT-De-la-Clase-Trabajadora"},
    {"abbr": "PEL", "name": "Esperanza y Libertad", "folder": "PEL-Esperanza-y-Libertad"},
    {"abbr": "PEN", "name": "Esperanza Nacional", "folder": "PEN-Esperanza-Nacional"},
    {"abbr": "PIN", "name": "Integración Nacional", "folder": "PIN-Integracion-Nacional"},
    {"abbr": "PJSC", "name": "Justicia Social Costarricense", "folder": "PJSC-Justicia-Social-Costarricense"},
    {"abbr": "PLN", "name": "Liberación Nacional", "folder": "PLN-Liberacion-Nacional"},
    {"abbr": "PLP", "name": "Liberal Progresista", "folder": "PLP-Liberal-Progresista"},
    {"abbr": "PNG", "name": "Nueva Generación", "folder": "PNG-Nueva-Generacion"},
    {"abbr": "PNR", "name": "Nueva República", "folder": "PNR-Nueva-Republica"},
    {"abbr": "PPSO", "name": "Pueblo Soberano", "folder": "PPSO-Pueblo-Soberano"},
    {"abbr": "PSD", "name": "Progreso Social Democrático", "folder": "PSD-Progreso-Social-Democratico"},
    {"abbr": "PUCD", "name": "Unión Costarricense Democrática", "folder": "PUCD-Union-Costarricense-Democratica"},
    {"abbr": "PUSC", "name": "Unidad Social Cristiana", "folder": "PUSC-Unidad-Social-Cristiana"},
    {"abbr": "UP", "name": "Unidos Podemos", "folder": "UP-Unidos-Podemos"},
]


def download_image(url: str, output_path: Path) -> bool:
    """Download image from URL."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        with open(output_path, 'wb') as f:
            f.write(response.content)

        return True
    except Exception as e:
        print(f"    Error downloading: {e}")
        return False


def main():
    """Download official party logos."""
    pipeline_root = Path(__file__).parent.parent
    project_root = pipeline_root.parent
    partidos_dir = project_root / "data" / "partidos"

    print("=" * 70)
    print("Official Party Logo Download")
    print("=" * 70)
    print("\nNOTE: This script requires manual URL input for each party.")
    print("Please search online for official logos and provide URLs.\n")

    # For now, just create a template file with the party list
    # Chris will need to manually find and add the logo URLs
    template_path = project_root / "data" / "party_logo_urls.txt"

    with open(template_path, 'w', encoding='utf-8') as f:
        f.write("# Party Logo URLs\n")
        f.write("# Format: ABBR|URL\n")
        f.write("# Add the official logo URL for each party\n\n")

        for party in PARTIES:
            f.write(f"{party['abbr']}|\n")

    print(f"✓ Created template file: {template_path}")
    print("\nNext steps:")
    print("1. Search online for each party's official logo")
    print("2. Add the image URLs to party_logo_urls.txt")
    print("3. Run this script again to download\n")

    # Check if URLs file exists and has content
    if template_path.exists():
        with open(template_path, 'r', encoding='utf-8') as f:
            lines = [l.strip() for l in f if l.strip() and not l.startswith('#')]

        if lines and any('|http' in l for l in lines):
            print("Found URLs in template file. Downloading...\n")

            for line in lines:
                if '|' not in line or not line.split('|')[1]:
                    continue

                abbr, url = line.split('|', 1)
                abbr = abbr.strip()
                url = url.strip()

                # Find party info
                party = next((p for p in PARTIES if p['abbr'] == abbr), None)
                if not party:
                    continue

                party_dir = partidos_dir / party['folder']
                output_path = party_dir / f"{abbr}_official_logo.png"

                print(f"📥 {party['name']} ({abbr})")
                print(f"   URL: {url}")

                if download_image(url, output_path):
                    print(f"   ✓ Saved to: {output_path.name}\n")
                else:
                    print(f"   ✗ Failed to download\n")

                time.sleep(0.5)  # Be polite

    return 0


if __name__ == "__main__":
    exit(main())
