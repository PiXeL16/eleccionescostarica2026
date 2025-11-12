// ABOUTME: Accordion component for displaying party positions by category
// ABOUTME: Client-side component with collapsible sections

'use client';

import { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string;
}

export function Accordion({ items, defaultOpen }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen || null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between p-4 text-left transition hover:bg-gray-850"
            >
              <span className="font-semibold text-white">{item.title}</span>
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="border-t border-gray-800 p-4 animate-fade-in">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
