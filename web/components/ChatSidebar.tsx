// ABOUTME: Chat sidebar component with party selector and AI conversation interface
// ABOUTME: Uses Vercel AI SDK's useChat for streaming chat and allows party-scoped questions

'use client';

import { Send, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Party {
  id: number;
  name: string;
  abbreviation: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  parties: Party[];
  selectedPartyId?: number;
  onPartyChange: (partyId: number | undefined) => void;
}

export function ChatSidebar({
  isOpen,
  onClose,
  parties,
  selectedPartyId,
  onPartyChange,
}: ChatSidebarProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Reset messages when party changes
  useEffect(() => {
    setMessages([]);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !selectedPartyId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          partyId: selectedPartyId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let assistantMessage = '';
      const assistantMessageId = (Date.now() + 1).toString();

      // Add empty assistant message that we'll update
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const data = JSON.parse(line.slice(2));
              if (typeof data === 'string') {
                assistantMessage += data;
                // Update the assistant message
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId ? { ...msg, content: assistantMessage } : msg
                  )
                );
              }
            } catch (_e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content:
            'Lo siento, ocurrió un error al procesar tu pregunta. Por favor intenta de nuevo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-gray-900 sm:w-[500px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Consulta sobre Partidos
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pregunta sobre las plataformas políticas
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Party Selector */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <label
              htmlFor="party-select"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Selecciona un partido:
            </label>
            <select
              id="party-select"
              value={selectedPartyId ?? ''}
              onChange={(e) => onPartyChange(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Pregunta general</option>
              {parties.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.name} ({party.abbreviation})
                </option>
              ))}
            </select>
            {selectedPartyId && (
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                ℹ️ Las respuestas se basarán solo en la plataforma oficial de este partido
              </p>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {messages.length === 0 ? (
              /* Empty state */
              <div className="flex h-full items-center justify-center px-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedPartyId
                      ? 'Haz una pregunta sobre la plataforma política del partido seleccionado.'
                      : 'Selecciona un partido arriba para comenzar a preguntar sobre su plataforma.'}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    Ejemplos: "¿Qué proponen en educación?", "¿Cuál es su posición sobre impuestos?"
                  </p>
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white dark:bg-blue-500'
                          : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg bg-gray-100 px-4 py-2 text-gray-900 dark:bg-gray-800 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedPartyId
                    ? 'Escribe tu pregunta...'
                    : 'Selecciona un partido para preguntar...'
                }
                disabled={!selectedPartyId || isLoading}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={!selectedPartyId || isLoading || !input.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Enviar
              </button>
            </form>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-gray-200 bg-yellow-50 p-3 dark:border-gray-800 dark:bg-yellow-900/20">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              ⚠️ Las respuestas se basan únicamente en las plataformas oficiales. La IA no inventa
              información.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
