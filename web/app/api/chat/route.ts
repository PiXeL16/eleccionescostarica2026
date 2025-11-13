// ABOUTME: Streaming chat API endpoint for party-specific Q&A
// ABOUTME: Uses OpenAI with RAG pattern to answer questions based only on party documents

import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import {
  formatPartyContextForPrompt,
  getPartyContext,
  searchPartyPositions,
} from '@/lib/chat-data';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, partyId } = await req.json();

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array required', { status: 400 });
    }

    // Build system prompt with strict instructions
    let systemPrompt = `Eres un asistente experto en política costarricense para las elecciones 2026.

REGLAS CRÍTICAS:
1. Solo usa información de los documentos oficiales de las plataformas políticas proporcionados
2. NUNCA inventes, supongas o extrapoles información que no esté explícitamente en los documentos
3. Si no tienes información sobre un tema, di claramente "No tengo información sobre este tema en la plataforma de este partido"
4. Sé preciso y cita las propuestas específicas cuando sea posible
5. Responde en español de forma clara y concisa
6. No hagas comparaciones entre partidos a menos que se te pida explícitamente`;

    // If a party is selected, inject its context
    if (partyId) {
      const context = getPartyContext(partyId, false); // Don't include full text by default

      if (!context) {
        return new Response('Party not found', { status: 404 });
      }

      const partyInfo = formatPartyContextForPrompt(context);

      systemPrompt += `\n\n---\n\n${partyInfo}`;
      systemPrompt += `\n\nEstás respondiendo preguntas específicamente sobre ${context.party.name} (${context.party.abbreviation}).`;
    } else {
      systemPrompt += `\n\nNota: El usuario no ha seleccionado un partido específico. Si te preguntan sobre un partido, pide que seleccionen uno primero.`;
    }

    // Optional: Use FTS search to find relevant content based on last user message
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
    if (lastUserMessage && partyId) {
      const searchResults = searchPartyPositions(lastUserMessage.content, partyId, 3);

      if (searchResults.length > 0) {
        systemPrompt += `\n\n### Información relevante encontrada:\n`;

        for (const result of searchResults) {
          systemPrompt += `\n**Resumen:** ${result.summary}\n`;

          const proposals = JSON.parse(result.key_proposals) as string[];
          if (proposals.length > 0) {
            systemPrompt += `**Propuestas:**\n`;
            for (const proposal of proposals) {
              systemPrompt += `- ${proposal}\n`;
            }
          }
        }
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
