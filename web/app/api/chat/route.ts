// ABOUTME: Streaming chat API endpoint for party-specific Q&A
// ABOUTME: Uses semantic search with RAG pattern to answer questions based on party documents

import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { semanticSearch } from '@/lib/chat-data';
import { trackChatQuestion } from '@/lib/posthog-server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Mark as runtime-only to avoid build-time evaluation
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages, partyIds } = await req.json();

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array required', { status: 400 });
    }

    // Build system prompt with strict instructions
    const isAllParties = !partyIds || partyIds.length === 0;
    let systemPrompt = `Eres un asistente experto en política costarricense para las elecciones 2026.

${isAllParties ? 'Estás consultando información de TODOS los partidos políticos registrados.' : `Estás consultando información de ${partyIds.length} partido(s) específico(s).`}

REGLAS CRÍTICAS:
1. Solo usa información de los documentos oficiales de las plataformas políticas proporcionados
2. NUNCA inventes, supongas o extrapoles información que no esté explícitamente en los documentos
3. Si no tienes información sobre un tema, di claramente "No tengo información sobre este tema en la plataforma del/los partido(s)"
4. Sé preciso y cita las propuestas específicas cuando sea posible
5. Responde en español de forma clara y concisa
6. Si te preguntan por comparaciones entre partidos, organiza la respuesta claramente por partido
7. SIEMPRE incluye citas a las páginas específicas usando el formato [Página X] después de cada afirmación o propuesta

FORMATO DE RESPUESTA:
- SIEMPRE usa Markdown para formatear tus respuestas
- Usa encabezados (##) para títulos de sección y nombres de partidos
- Usa listas con viñetas (-) o numeradas (1.) para enumerar propuestas
- Usa **negritas** para destacar conceptos clave o nombres de programas
- Usa párrafos separados para mejor legibilidad
- Organiza la información de forma estructurada y visual

FORMATO DE CITAS (MUY IMPORTANTE):
- Después de cada propuesta, dato o afirmación, incluye [Página X] donde X es el número de página
- Ejemplo: "El partido propone aumentar la inversión en educación [Página 15]"
- Si una propuesta abarca múltiples páginas, usa [Páginas 15-17]
- Las citas deben ser parte natural del texto, no en una sección separada`;

    // Get the last user message to perform semantic search
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();

    // Use semantic search to find relevant content
    if (lastUserMessage?.content) {
      // Perform semantic search
      // If partyIds is provided, search only those parties
      // If not provided (undefined), search across all parties
      const searchResults = await semanticSearch(
        lastUserMessage.content,
        partyIds, // Can be undefined (all parties) or array of party IDs
        10 // Get top 10 most relevant chunks
      );

      // Track question in PostHog (non-blocking, fire-and-forget)
      trackChatQuestion({
        question: lastUserMessage.content,
        partyIds: partyIds || [],
        searchResultsCount: searchResults.length,
        partiesInResults: [...new Set(searchResults.map((r) => r.party_name))],
        conversationLength: messages.filter((m: { role: string }) => m.role === 'user').length,
      }).catch((error) => {
        // Log but don't fail the request
        console.error('Failed to track chat question:', error);
      });

      if (searchResults.length > 0) {
        // Group results by party for better organization
        const resultsByParty = searchResults.reduce(
          (acc, result) => {
            if (!acc[result.party_name]) {
              acc[result.party_name] = [];
            }
            acc[result.party_name].push(result);
            return acc;
          },
          {} as Record<string, typeof searchResults>
        );

        systemPrompt += `\n\n---\n\n### Información relevante de plataformas electorales:\n`;

        for (const [partyName, partyResults] of Object.entries(resultsByParty)) {
          systemPrompt += `\n#### ${partyName}\n`;

          for (const result of partyResults) {
            // Include page number for traceability
            systemPrompt += `\n**Página ${result.page_number}:**\n${result.chunk_text}\n`;
          }
        }

        systemPrompt += `\n\n---\n`;
      } else {
        systemPrompt += `\n\nNota: No se encontró información relevante en las plataformas electorales para esta consulta.`;
      }
    }

    // Stream response from OpenAI
    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages,
      temperature: 0.3, // Lower temperature for more factual responses
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
