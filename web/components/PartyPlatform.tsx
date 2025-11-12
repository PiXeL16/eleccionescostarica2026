// ABOUTME: Client component for party platform with synchronized navigation and accordions
// ABOUTME: Manages accordion state and connects it to quick navigation links

'use client';

import { useState } from 'react';
import { Accordion } from './Accordion';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface PartyPlatformProps {
  accordionItems: AccordionItem[];
  extractedText?: string | null;
}

export function PartyPlatform({ accordionItems, extractedText }: PartyPlatformProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleNavClick = (id: string) => {
    // Open the accordion
    setOpenId(id);

    // Scroll to the element
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Small delay to allow accordion to open first
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
      {/* Table of Contents - Sticky (hidden on mobile) */}
      <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">Navegación Rápida</h3>
          <nav className="space-y-1">
            {accordionItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left rounded px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white break-words"
              >
                {item.title}
              </button>
            ))}
            {extractedText && (
              <a
                href="#texto-completo"
                className="block rounded px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white break-words"
              >
                Texto Completo
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Positions by Category */}
        <div id="plataforma">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 dark:text-white">
            Plataforma Política
          </h2>
          {accordionItems.length > 0 ? (
            <div className="space-y-4">
              {accordionItems.map((item) => (
                <div key={item.id} id={item.id} className="scroll-mt-8">
                  <Accordion items={[item]} openId={openId} onOpenChange={setOpenId} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <p className="text-gray-600 dark:text-gray-400">
                No hay información de plataforma disponible para este partido.
              </p>
            </div>
          )}
        </div>

        {/* Full Extracted Text */}
        {extractedText && (
          <div id="texto-completo" className="scroll-mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 dark:text-white">
              Texto Completo Extraído
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">
                Este es el texto completo extraído del documento PDF oficial del partido.
              </p>
              <div className="prose max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed dark:text-gray-300">
                  {extractedText}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
