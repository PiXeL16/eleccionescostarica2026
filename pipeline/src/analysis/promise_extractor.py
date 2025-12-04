# ABOUTME: Extract time-bound promises from political documents using GPT-4o
# ABOUTME: Identifies promises with delivery dates for the accountability calendar

import os
import json
from typing import Dict, List, Optional
from datetime import date, timedelta
from openai import OpenAI
import tiktoken
from tenacity import retry, stop_after_attempt, wait_exponential


# Costa Rica 2026 administration dates
INAUGURATION_DATE = date(2026, 5, 8)
ADMIN_END_DATE = date(2030, 5, 8)


class PromiseExtractor:
    """Extract time-bound promises from political documents."""

    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4o"):
        """
        Initialize promise extractor.

        Args:
            api_key: OpenAI API key (defaults to OPENAI_API_KEY env var)
            model: Model to use (default: gpt-4o)
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key not provided")

        self.client = OpenAI(api_key=self.api_key)
        self.model = model
        self.encoding = tiktoken.encoding_for_model(model)

    def count_tokens(self, text: str) -> int:
        """Count tokens in text."""
        return len(self.encoding.encode(text))

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10)
    )
    def extract_promises(
        self,
        document_text: str,
        party_name: str,
        max_tokens: int = 8000
    ) -> Dict:
        """
        Extract time-bound promises from a political document.

        Args:
            document_text: Full text of the document
            party_name: Name of the political party
            max_tokens: Maximum tokens for response

        Returns:
            Dict with extracted promises
        """
        system_prompt = """Eres un analista político experto especializado en extraer compromisos con plazos de planes de gobierno en Costa Rica.

Tu tarea es identificar TODOS los compromisos o promesas que tengan un plazo temporal explícito o implícito.

Debes buscar:
- Fechas específicas (2027, enero 2028, etc.)
- Plazos relativos (primeros 100 días, primer año, primer semestre, etc.)
- Hitos temporales (al final de la administración, durante el mandato, etc.)
- Rangos de tiempo (entre 2026 y 2028, en los primeros dos años, etc.)

IMPORTANTE: Solo extrae compromisos que tengan ALGÚN tipo de referencia temporal. No incluyas propuestas generales sin plazo.

El documento incluye marcadores de página en formato [PÁGINA X]. Para cada promesa que extraigas, identifica el número de página donde aparece y regístralo en el campo source_page.

Responde siempre en español y en formato JSON válido."""

        user_prompt = f"""Analiza el siguiente plan de gobierno del partido **{party_name}** y extrae TODOS los compromisos con plazos temporales.

**Documento:**
```
{document_text[:25000]}
```

**Formato de respuesta (JSON):**
```json
{{
  "promises": [
    {{
      "promise_text": "Descripción completa del compromiso tal como aparece en el documento",
      "promise_summary": "Resumen descriptivo (50-80 caracteres) que explique QUÉ se promete hacer, no solo el tema. Ej: 'Reducir listas de espera en hospitales a menos de 30 días' en vez de 'Salud en 100 días'",
      "promised_date_text": "Texto original del plazo (ej: 'primer año', '2027', 'primeros 100 días')",
      "date_type": "specific|relative|range|milestone",
      "specific_date": "YYYY-MM-DD o null si no aplica",
      "relative_days": "número de días o null (ej: 100 para 'primeros 100 días')",
      "administration_year": "1-4 o null (1=primer año, 2=segundo año, etc.)",
      "date_start": "YYYY-MM-DD o null (para rangos)",
      "date_end": "YYYY-MM-DD o null (para rangos)",
      "category": "economia|salud|educacion|seguridad|ambiente|infraestructura|politica_social|tecnologia|cultura|politica_exterior|reforma_institucional|impuestos|otro",
      "source_page": "número de la página donde aparece (busca el marcador [PÁGINA X] más cercano anterior)",
      "confidence": 0.0-1.0
    }}
  ],
  "total_promises_found": 5,
  "extraction_notes": "Notas sobre la extracción, si hay ambigüedades"
}}
```

**Reglas de date_type:**
- "specific": Fecha exacta mencionada (ej: "para enero 2027")
- "relative": Plazo en días desde inicio de gobierno (ej: "primeros 100 días")
- "milestone": Referencia a año de administración (ej: "primer año", "fin del mandato")
- "range": Rango de fechas (ej: "entre 2026 y 2028")

**Mapeo de administration_year:**
- "primer año" o "año 1" → 1
- "segundo año" o "año 2" → 2
- "tercer año" o "año 3" → 3
- "cuarto año" o "fin del mandato" → 4

**IMPORTANTE:**
- Solo incluye promesas con plazo temporal EXPLÍCITO
- confidence debe reflejar qué tan claro es el compromiso y su plazo (1.0 = muy claro)
- Si no encuentras compromisos con plazos, devuelve un array vacío

Responde ÚNICAMENTE con el JSON, sin texto adicional."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=max_tokens,
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
            result = json.loads(content)

            result['tokens_used'] = response.usage.total_tokens
            result['cost_usd'] = self._calculate_cost(response.usage)
            result['model'] = self.model

            return result

        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse LLM JSON response: {e}")
        except Exception as e:
            raise RuntimeError(f"Promise extraction failed: {e}")

    def _calculate_cost(self, usage) -> float:
        """Calculate cost in USD based on token usage."""
        input_cost = (usage.prompt_tokens / 1_000_000) * 5.0
        output_cost = (usage.completion_tokens / 1_000_000) * 15.0
        return input_cost + output_cost

    def resolve_promise_date(self, promise: Dict) -> Dict:
        """
        Resolve ambiguous dates to concrete dates for calendar display.
        Returns the END of the period (per user requirement) with ambiguity note.

        Args:
            promise: Promise dict with date fields

        Returns:
            Dict with resolved 'calendar_date' and 'date_note'
        """
        date_type = promise.get('date_type')
        result = {
            'calendar_date': None,
            'date_note': None
        }

        if date_type == 'specific':
            specific = promise.get('specific_date')
            if specific:
                result['calendar_date'] = specific
                result['date_note'] = None
            return result

        if date_type == 'relative':
            days = promise.get('relative_days')
            if days:
                end_date = INAUGURATION_DATE + timedelta(days=int(days))
                result['calendar_date'] = end_date.isoformat()
                result['date_note'] = f"Fecha aproximada: primeros {days} días de gobierno"
            return result

        if date_type == 'milestone':
            year = promise.get('administration_year')
            if year:
                year = int(year)
                if year == 1:
                    end_date = date(2027, 5, 8)
                elif year == 2:
                    end_date = date(2028, 5, 8)
                elif year == 3:
                    end_date = date(2029, 5, 8)
                elif year == 4:
                    end_date = ADMIN_END_DATE
                else:
                    end_date = ADMIN_END_DATE

                year_names = {1: "primer", 2: "segundo", 3: "tercer", 4: "cuarto"}
                result['calendar_date'] = end_date.isoformat()
                result['date_note'] = f"Fecha aproximada: {year_names.get(year, str(year))} año de gobierno"
            return result

        if date_type == 'range':
            end = promise.get('date_end')
            start = promise.get('date_start')
            if end:
                result['calendar_date'] = end
                if start:
                    result['date_note'] = f"Fecha aproximada: período {start} a {end}"
                else:
                    result['date_note'] = f"Fecha aproximada: hasta {end}"
            elif start:
                result['calendar_date'] = start
                result['date_note'] = f"Fecha aproximada: desde {start}"
            return result

        return result


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python promise_extractor.py <text_file>")
        sys.exit(1)

    text_file = sys.argv[1]

    with open(text_file, 'r', encoding='utf-8') as f:
        text = f.read()

    extractor = PromiseExtractor()

    print(f"Extracting promises from text ({len(text)} chars)...")
    print(f"Tokens: {extractor.count_tokens(text):,}\n")

    result = extractor.extract_promises(
        document_text=text,
        party_name="Partido de Prueba"
    )

    print("\nResults:")
    print("=" * 70)
    print(json.dumps(result, indent=2, ensure_ascii=False))
