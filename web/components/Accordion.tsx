// ABOUTME: Accordion component for displaying party positions by category
// ABOUTME: Client-side component with collapsible sections, supports multiple open items

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
  defaultOpenAll?: boolean;
  openId?: string | null;
  onOpenChange?: (id: string | null) => void;
}

export function Accordion({
  items,
  defaultOpen,
  defaultOpenAll = false,
  openId: controlledOpenId,
  onOpenChange,
}: AccordionProps) {
  // Support multiple open items when defaultOpenAll is true
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    if (defaultOpenAll) {
      return new Set(items.map(item => item.id));
    }
    return defaultOpen ? new Set([defaultOpen]) : new Set();
  });

  const isControlled = controlledOpenId !== undefined;

  const toggleItem = (id: string) => {
    if (isControlled && onOpenChange) {
      onOpenChange(controlledOpenId === id ? null : id);
    } else {
      setOpenIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }
  };

  const isItemOpen = (id: string) => {
    if (isControlled) {
      return controlledOpenId === id;
    }
    return openIds.has(id);
  };

  return (
    <div className="space-y-3 w-full max-w-full">
      {items.map((item) => {
        const isOpen = isItemOpen(item.id);

        return (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900 w-full"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between p-3 md:p-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="font-semibold text-gray-900 dark:text-white dark:hover:text-gray-300 flex items-center gap-2">
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
