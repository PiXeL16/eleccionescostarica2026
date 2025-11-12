# ABOUTME: LLM integration for political document analysis using GPT-4o
# ABOUTME: Handles categorization, summarization, and extraction of party positions in Spanish

import os
import json
from typing import Dict, List, Optional
from openai import OpenAI
import tiktoken
from tenacity import retry, stop_after_attempt, wait_exponential


class LLMAnalyzer:
    """Analyzes political documents using GPT-4o."""

    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4o"):
        """
        Initialize LLM analyzer.

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
    def analyze_document_for_category(
        self,
        document_text: str,
        category: Dict,
        party_name: str,
        max_tokens: int = 4000
    ) -> Dict:
        """
        Analyze a document for a specific political category.

        Args:
            document_text: Full text of the document
            category: Category dict with name, description, key_topics
            party_name: Name of the political party
            max_tokens: Maximum tokens for response

        Returns:
            Dict with analysis results
        """
        system_prompt = """Eres un analista político experto especializado en análisis de programas de gobierno en Costa Rica.

Tu tarea es analizar planes de gobierno de partidos políticos y extraer información estructurada sobre categorías específicas.

Debes ser:
- Objetivo y preciso en tu análisis
- Exhaustivo en la identificación de propuestas
- Claro en resumir posiciones complejas
- Capaz de identificar la ideología subyacente (progresista, conservadora, centrista)
- Atento a menciones de presupuesto o costos

Responde siempre en español y en formato JSON válido."""

        user_prompt = f"""Analiza el siguiente plan de gobierno del partido **{party_name}** y extrae información sobre la categoría: **{category['name']}**

**Descripción de la categoría:** {category['description']}

**Temas clave a buscar:**
{', '.join(category.get('key_topics', []))}

**Documento:**
```
{document_text[:20000]}  # Limit to ~20K chars to avoid token limits
```

**Instrucciones:**
1. Lee cuidadosamente el documento buscando referencias a {category['prompt_context']}.
2. Extrae y resume las propuestas del partido en esta categoría.
3. Identifica la posición ideológica del partido en este tema.
4. Nota cualquier mención de presupuesto, costos o financiamiento.

**Formato de respuesta (JSON):**
```json
{{
  "summary": "Resumen detallado de 1-2 párrafos sobre la posición del partido en {category['name']}. Incluye las principales propuestas y el enfoque general.",
  "key_proposals": [
    "Propuesta específica 1",
    "Propuesta específica 2",
    "Propuesta específica 3"
  ],
  "ideology_position": "progresista|conservador|centrista",
  "budget_mentioned": "Monto mencionado o 'No especificado'",
  "confidence_score": 0.95,
  "has_content": true
}}
```

**Notas importantes:**
- Si el documento NO menciona esta categoría, establece "has_content": false y proporciona un resumen breve indicando la ausencia de información.
- El "summary" debe ser detallado (1-2 párrafos) si hay información disponible.
- Las "key_proposals" deben ser específicas y accionables.
- "confidence_score" debe reflejar qué tan explícita es la información en el documento (0.0 a 1.0).

Responde ÚNICAMENTE con el JSON, sin texto adicional."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,  # Lower temperature for more consistent results
                max_tokens=max_tokens,
                response_format={"type": "json_object"}
            )

            # Extract and parse JSON
            content = response.choices[0].message.content
            result = json.loads(content)

            # Add metadata
            result['tokens_used'] = response.usage.total_tokens
            result['cost_usd'] = self._calculate_cost(response.usage)
            result['model'] = self.model
            result['raw_response'] = content

            return result

        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse LLM JSON response: {e}")
        except Exception as e:
            raise RuntimeError(f"LLM analysis failed: {e}")

    def _calculate_cost(self, usage) -> float:
        """
        Calculate cost in USD based on token usage.

        GPT-4o pricing (as of 2025):
        - Input: $5 per million tokens
        - Output: $15 per million tokens
        """
        input_cost = (usage.prompt_tokens / 1_000_000) * 5.0
        output_cost = (usage.completion_tokens / 1_000_000) * 15.0
        return input_cost + output_cost

    def analyze_multiple_categories(
        self,
        document_text: str,
        categories: List[Dict],
        party_name: str
    ) -> List[Dict]:
        """
        Analyze a document for multiple categories.

        Args:
            document_text: Full document text
            categories: List of category dicts
            party_name: Party name

        Returns:
            List of analysis results for each category
        """
        results = []

        for category in categories:
            print(f"  Analyzing category: {category['name']}...", end=' ')

            try:
                result = self.analyze_document_for_category(
                    document_text=document_text,
                    category=category,
                    party_name=party_name
                )
                results.append({
                    'category': category,
                    'analysis': result,
                    'success': True
                })
                print(f"✓ (${result['cost_usd']:.4f})")

            except Exception as e:
                print(f"✗ Error: {e}")
                results.append({
                    'category': category,
                    'error': str(e),
                    'success': False
                })

        return results


if __name__ == "__main__":
    # Test analyzer
    import sys

    if len(sys.argv) < 2:
        print("Usage: python llm_analyzer.py <text_file>")
        sys.exit(1)

    text_file = sys.argv[1]

    with open(text_file, 'r', encoding='utf-8') as f:
        text = f.read()

    # Test category
    test_category = {
        'name': 'Economía',
        'description': 'Política fiscal, empleo, comercio e inversión',
        'key_topics': ['empleo', 'comercio', 'inversión'],
        'prompt_context': 'políticas económicas y desarrollo'
    }

    analyzer = LLMAnalyzer()

    print(f"Analyzing text ({len(text)} chars)...")
    print(f"Tokens: {analyzer.count_tokens(text):,}\n")

    result = analyzer.analyze_document_for_category(
        document_text=text,
        category=test_category,
        party_name="Partido de Prueba"
    )

    print("\nResults:")
    print("=" * 70)
    print(json.dumps(result, indent=2, ensure_ascii=False))
