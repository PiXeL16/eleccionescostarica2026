// ABOUTME: Dropdown button for adding promise events to various calendar providers
// ABOUTME: Supports Google Calendar, Outlook, Yahoo, and ICS download

'use client';

import { useState, useRef, useEffect } from 'react';
import type { TimeBoundPromiseWithParty } from '@/lib/database';
import { generateAllCalendarLinks } from '@/lib/calendar/calendar-links';

interface AddToCalendarButtonProps {
  promise: TimeBoundPromiseWithParty;
  compact?: boolean;
}

export function AddToCalendarButton({ promise, compact = false }: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const links = generateAllCalendarLinks(promise);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-1.5 rounded-lg font-medium transition-all
          bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow
          dark:bg-primary-500 dark:hover:bg-primary-600
          ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'}
        `}
        title="Agregar al calendario"
        aria-label="Agregar al calendario"
        aria-expanded={isOpen}
      >
        {/* Calendar plus icon */}
        <svg
          className={compact ? 'h-4 w-4' : 'h-5 w-5'}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 11v6m-3-3h6"
          />
        </svg>
        <span className={compact ? 'hidden sm:inline' : ''}>
          {compact ? 'Agregar' : 'Agregar a Calendario'}
        </span>
        {/* Chevron */}
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
          role="menu"
        >
          <div className="py-1">
            {/* Google Calendar */}
            <a
              href={links.google}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              role="menuitem"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google Calendar
            </a>

            {/* Outlook */}
            <a
              href={links.outlook}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              role="menuitem"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#0078D4"
                  d="M24 7.387v10.478c0 .23-.08.424-.238.576a.806.806 0 01-.576.238h-8.534v-5.67l.903.677c.095.082.2.123.314.123a.468.468 0 00.314-.123l6.86-5.35a.416.416 0 00-.168-.087.633.633 0 00-.216-.04H14.65v-.73h8.536c.23 0 .423.08.576.232A.772.772 0 0124 7.387zM14.652 18.679v-4.79l-2.035 1.582-2.035-1.582v4.79H.814a.806.806 0 01-.576-.238.772.772 0 01-.238-.576V6.386c0-.23.08-.423.238-.576a.772.772 0 01.576-.238h9.768c.229 0 .423.08.575.238a.772.772 0 01.238.576v12.479h.037v-.186zm-8.01-9.01c-.678 0-1.26.244-1.744.732-.485.488-.727 1.077-.727 1.768s.242 1.279.727 1.768c.485.488 1.066.732 1.744.732.678 0 1.26-.244 1.744-.732.485-.489.727-1.078.727-1.768s-.242-1.28-.727-1.768c-.485-.488-1.066-.732-1.744-.732z"
                />
              </svg>
              Outlook
            </a>

            {/* Yahoo Calendar */}
            <a
              href={links.yahoo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              role="menuitem"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#6001D2"
                  d="M12.997 20.839h-2.149l-.003-4.92-5.225-10.27h2.426l3.89 8.18 3.862-8.18h2.382l-5.18 10.27-.003 4.92z"
                />
              </svg>
              Yahoo Calendar
            </a>

            <hr className="my-1 border-gray-200 dark:border-gray-600" />

            {/* ICS Download */}
            <a
              href={links.icsUrl}
              download
              onClick={handleLinkClick}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              role="menuitem"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Descargar .ics
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
