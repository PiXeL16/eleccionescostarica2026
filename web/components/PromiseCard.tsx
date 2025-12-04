// ABOUTME: Card component displaying a single time-bound promise
// ABOUTME: Shows promise details, date info, and calendar integration

'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getDateNote, resolvePromiseDate } from '@/lib/calendar/calendar-links';
import { getCategoryIcon } from '@/lib/category-icons';
import type { TimeBoundPromiseWithParty } from '@/lib/database';
import { getPartyFlagPath } from '@/lib/party-images';
import { AddToCalendarButton } from './AddToCalendarButton';

interface PromiseCardProps {
  promise: TimeBoundPromiseWithParty;
  showParty?: boolean;
  variant?: 'default' | 'compact';
}

export function PromiseCard({ promise, showParty = true, variant = 'default' }: PromiseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const resolvedDate = resolvePromiseDate(promise);
  const dateNote = getDateNote(promise);

  // Format date for display
  const formattedDate = resolvedDate.toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isCompact = variant === 'compact';

  return (
    <div
      className={`
        rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md
        dark:bg-gray-900 dark:border-gray-800
        ${isCompact ? 'p-3' : 'p-4'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Party info */}
          {showParty && (
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-8 h-4 flex-shrink-0">
                <Image
                  src={getPartyFlagPath(promise.party_abbreviation)}
                  alt={promise.party_name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {promise.party_name}
              </span>
            </div>
          )}

          {/* Category badge */}
          {promise.category_name && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-primary-500">
                {getCategoryIcon(promise.category_key || '')}
              </span>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                {promise.category_name}
              </span>
            </div>
          )}

          {/* Promise text */}
          <p
            className={`
              text-gray-800 dark:text-gray-200
              ${isCompact ? 'text-sm line-clamp-2' : 'text-base'}
              ${!isExpanded && !isCompact ? 'line-clamp-3' : ''}
            `}
          >
            {promise.promise_summary || promise.promise_text}
          </p>
        </div>

        {/* Calendar button */}
        <AddToCalendarButton promise={promise} compact={isCompact} />
      </div>

      {/* Date info */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium">{promise.promised_date_text}</span>
        </span>

        {dateNote && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
            ~{formattedDate}
          </span>
        )}

        {/* Source page reference - clickable link to PDF */}
        {promise.source_page && (
          <a
            href={`/pdf/${promise.party_abbreviation.toLowerCase()}?page=${promise.source_page}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
            title={`Ver página ${promise.source_page} del plan de gobierno`}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Pág. {promise.source_page}</span>
          </a>
        )}
      </div>

      {/* Expandable details */}
      {!isCompact && promise.promise_text !== promise.promise_summary && (
        <>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1"
          >
            <span>{isExpanded ? 'Ver menos' : 'Ver más detalles'}</span>
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3 animate-fade-in">
              {/* Full promise text */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Compromiso completo
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{promise.promise_text}</p>
              </div>

              {/* Date note */}
              {dateNote && (
                <div className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                  <svg
                    className="h-4 w-4 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{dateNote}</span>
                </div>
              )}

              {/* Confidence score */}
              {promise.confidence_score && promise.confidence_score > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Confianza:</span>
                  <div className="flex-1 max-w-[100px] h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        promise.confidence_score >= 0.8
                          ? 'bg-green-500'
                          : promise.confidence_score >= 0.5
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${promise.confidence_score * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {Math.round(promise.confidence_score * 100)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
