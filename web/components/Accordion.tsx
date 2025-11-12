// ABOUTME: Accordion component for displaying party positions by category
// ABOUTME: Client-side component with collapsible sections

'use client';

import { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string;
  openId?: string | null;
  onOpenChange?: (id: string | null) => void;
}

export function Accordion({
  items,
  defaultOpen,
  openId: controlledOpenId,
  onOpenChange,
}: AccordionProps) {
  const [internalOpenId, setInternalOpenId] = useState<string | null>(defaultOpen || null);

  const isControlled = controlledOpenId !== undefined;
  const openId = isControlled ? controlledOpenId : internalOpenId;
  const setOpenId = isControlled && onOpenChange ? onOpenChange : setInternalOpenId;

  return (
    <div className="space-y-3 w-full max-w-full">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900 w-full"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between p-3 md:p-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
              </span>
              <svg
                className={`h-5 w-5 text-gray-600 transition-transform dark:text-gray-400 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              <div className="border-t border-gray-200 p-3 md:p-4 animate-fade-in dark:border-gray-800 w-full overflow-hidden">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
