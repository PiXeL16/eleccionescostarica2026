// ABOUTME: Chat sidebar component with party selector and AI conversation interface
// ABOUTME: Handles streaming responses from the chat API with semantic search

'use client';

import { ChevronDown, Send, X } from 'lucide-react';
import Image from 'next/image';
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
  selectedPartyIds: number[];
  onPartyIdsChange: (partyIds: number[]) => void;
}

export function ChatSidebar({
  isOpen,
  onClose,
  parties,
  selectedPartyIds,
  onPartyIdsChange,
}: ChatSidebarProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset messages when party changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to reset when selected parties change
  useEffect(() => {
    setMessages([]);
  }, [selectedPartyIds]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim() || selectedPartyIds.length === 0 || isLoading) return;

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
          partyIds: selectedPartyIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
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

      // Read the stream - toTextStreamResponse sends plain text chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        assistantMessage += text;

        // Update the assistant message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: assistantMessage } : msg
          )
        );
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
    <div
      className={`fixed right-0 top-0 z-40 h-full w-full border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 sm:w-[500px] ${
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

        {/* AI Notice */}
        <div className="border-b border-gray-200 bg-yellow-50 p-3 dark:border-gray-800 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ℹ️ La información puede contener errores. La IA puede cometer errores y las respuestas
            deben verificarse con las fuentes oficiales.
          </p>
        </div>

        {/* Party Selector */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Selecciona partidos (uno o más):
          </div>
          <div className="relative" ref={dropdownRef}>
            {/* Selected Parties Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600"
            >
              <div className="flex items-center gap-2 min-w-0">
                {selectedPartyIds.length > 0 ? (
                  <span className="truncate">
                    {selectedPartyIds.length === 1
                      ? `${parties.find((p) => p.id === selectedPartyIds[0])?.abbreviation}`
                      : `${selectedPartyIds.length} partidos seleccionados`}
                  </span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">Selecciona partidos...</span>
                )}
              </div>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 text-gray-500 transition-transform dark:text-gray-400 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu with Checkboxes */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {/* Party Options with Checkboxes */}
                {parties.map((party) => {
                  const isSelected = selectedPartyIds.includes(party.id);
                  return (
                    <label
                      key={party.id}
                      className={`flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            // Remove party from selection
                            onPartyIdsChange(selectedPartyIds.filter((id) => id !== party.id));
                          } else {
                            // Add party to selection
                            onPartyIdsChange([...selectedPartyIds, party.id]);
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <div className="relative h-6 w-8 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src={`/party_flags/${party.abbreviation}.jpg`}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="truncate text-gray-900 dark:text-white">
                        {party.name} ({party.abbreviation})
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          {selectedPartyIds.length > 0 && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              ℹ️ Las respuestas se basarán en las plataformas oficiales de{' '}
              {selectedPartyIds.length === 1
                ? 'este partido'
                : `los ${selectedPartyIds.length} partidos seleccionados`}
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
                  {selectedPartyIds.length > 0
                    ? `Haz una pregunta sobre ${selectedPartyIds.length === 1 ? 'la plataforma del partido seleccionado' : `las plataformas de los ${selectedPartyIds.length} partidos seleccionados`}.`
                    : 'Selecciona uno o más partidos arriba para comenzar a preguntar sobre sus plataformas.'}
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  Ejemplos: "¿Qué proponen en educación?", "¿Cuál es su posición sobre impuestos?"
                  {selectedPartyIds.length > 1 && ', "Compara sus propuestas en salud"'}
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
                selectedPartyIds.length > 0
                  ? 'Escribe tu pregunta...'
                  : 'Selecciona partidos para preguntar...'
              }
              disabled={selectedPartyIds.length === 0 || isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={selectedPartyIds.length === 0 || isLoading || !input.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
