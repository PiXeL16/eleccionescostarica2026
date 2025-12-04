// ABOUTME: Timeline view for displaying promises chronologically
// ABOUTME: Groups promises by year and month with visual timeline

'use client';

import { resolvePromiseDate } from '@/lib/calendar/calendar-links';
import type { TimeBoundPromiseWithParty } from '@/lib/database';
import { PromiseCard } from './PromiseCard';

interface TimelineViewProps {
  promises: TimeBoundPromiseWithParty[];
}

interface GroupedPromises {
  [year: string]: {
    [month: string]: TimeBoundPromiseWithParty[];
  };
}

const MONTH_NAMES: Record<number, string> = {
  0: 'Enero',
  1: 'Febrero',
  2: 'Marzo',
  3: 'Abril',
  4: 'Mayo',
  5: 'Junio',
  6: 'Julio',
  7: 'Agosto',
  8: 'Septiembre',
  9: 'Octubre',
  10: 'Noviembre',
  11: 'Diciembre',
};

function groupPromisesByYearMonth(promises: TimeBoundPromiseWithParty[]): GroupedPromises {
  const grouped: GroupedPromises = {};

  for (const promise of promises) {
    const date = resolvePromiseDate(promise);
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();

    if (!grouped[year]) {
      grouped[year] = {};
    }
    if (!grouped[year][month]) {
      grouped[year][month] = [];
    }
    grouped[year][month].push(promise);
  }

  return grouped;
}

export function TimelineView({ promises }: TimelineViewProps) {
  if (promises.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
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
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          No hay promesas con fechas
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          No se encontraron promesas con plazos específicos para mostrar.
        </p>
      </div>
    );
  }

  const grouped = groupPromisesByYearMonth(promises);
  // Only show years from 2026 onwards (when the administration starts)
  const years = Object.keys(grouped)
    .filter((year) => parseInt(year, 10) >= 2026)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  return (
    <div className="space-y-8">
      {years.map((year) => {
        const months = Object.keys(grouped[year]).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

        return (
          <div key={year}>
            {/* Year header */}
            <h2
              className="
                text-2xl font-bold sticky top-[57px] py-2 z-10
                bg-gray-50/95 backdrop-blur-sm border-b border-gray-200
                text-gray-900
                dark:bg-gray-950/95 dark:border-gray-800 dark:text-white
              "
            >
              {year}
            </h2>

            {/* Months */}
            <div className="mt-4 space-y-6">
              {months.map((month) => {
                const monthPromises = grouped[year][month];
                const monthName = MONTH_NAMES[parseInt(month, 10)];

                return (
                  <div key={`${year}-${month}`} className="relative">
                    {/* Timeline line */}
                    <div
                      className="
                        absolute left-4 top-8 bottom-0 w-0.5
                        bg-gradient-to-b from-primary-300 to-gray-200
                        dark:from-primary-700 dark:to-gray-700
                      "
                    />

                    {/* Month header with timeline dot */}
                    <div className="relative flex items-center gap-3 mb-4">
                      {/* Timeline dot */}
                      <div
                        className="
                          relative z-10 w-8 h-8 rounded-full
                          bg-primary-500 flex items-center justify-center
                          shadow-lg shadow-primary-500/30
                        "
                      >
                        <span className="text-white text-xs font-bold">{parseInt(month, 10) + 1}</span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {monthName}
                      </h3>

                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({monthPromises.length}{' '}
                        {monthPromises.length === 1 ? 'promesa' : 'promesas'})
                      </span>
                    </div>

                    {/* Promise cards */}
                    <div className="ml-12 space-y-3">
                      {monthPromises.map((promise) => (
                        <PromiseCard
                          key={promise.id}
                          promise={promise}
                          showParty={true}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
