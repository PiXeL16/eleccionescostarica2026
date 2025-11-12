// ABOUTME: Client-side comparison view component
// ABOUTME: Handles URL search params and displays party comparison

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getBudgetTypeLabel, parseBudget } from '@/lib/budget-parser';
import { getCategoryDisplayName } from '@/lib/category-display';
import type { Category, Party, PartyPosition } from '@/lib/database';
import { getPartyFlagPath } from '@/lib/party-images';
import { PartySelector } from './PartySelector';

interface ComparisonViewProps {
  allParties: Party[];
  allCategories: Category[];
  comparisonData: {
    parties: Party[];
    categories: Category[];
    positions: Map<string, Map<string, PartyPosition>>;
  } | null;
}

export function ComparisonView({ allParties, allCategories, comparisonData }: ComparisonViewProps) {
  const searchParams = useSearchParams();
  const partiesParam = searchParams.get('parties');

  // Parse selected parties from URL
  const selectedSlugs =
    partiesParam
      ?.split(',')
      .filter((s) => s.trim().length > 0)
      .map((s) => s.toUpperCase()) || [];

  // Filter comparison data to only show selected parties
  const comparison =
    comparisonData && selectedSlugs.length > 0
      ? {
          ...comparisonData,
          parties: comparisonData.parties.filter((p) => selectedSlugs.includes(p.abbreviation)),
        }
      : null;

  // Show all categories
  const displayCategories = allCategories;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4 dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a inicio
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Comparar Partidos</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Selecciona hasta 3 partidos para comparar sus plataformas lado a lado
        </p>
      </div>

      {/* Party Selector */}
      <PartySelector parties={allParties} />

      {/* Comparison View */}
      {comparison && comparison.parties.length > 0 ? (
        <div className="space-y-6">
          {/* Sticky Header with Party Info */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 pb-4 dark:bg-gray-950/95 dark:border-gray-800">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comparación</h2>
            </div>

            {/* Compact Party Headers */}
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${comparison.parties.length}, minmax(0, 1fr))`,
              }}
            >
              {comparison.parties.map((party) => {
                return (
                  <div
                    key={party.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="w-20 aspect-[5/2] shrink-0 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={getPartyFlagPath(party.abbreviation)}
                        alt={`Bandera de ${party.name}`}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                        {party.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Comparisons */}
          <div className="space-y-6">
            {displayCategories.map((category) => (
              <div
                key={category.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">
                  {getCategoryDisplayName(category.name)}
                </h3>

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${comparison.parties.length}, minmax(0, 1fr))`,
                  }}
                >
                  {comparison.parties.map((party) => {
                    const position = comparison.positions
                      .get(party.abbreviation)
                      ?.get(category.category_key);
                    const proposals = position?.key_proposals
                      ? JSON.parse(position.key_proposals)
                      : [];

                    return (
                      <div key={party.id} className="space-y-4">
                        {position ? (
                          <>
                            {/* Ideology & Budget Info */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {position.ideology_position && (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {position.ideology_position}
                                </span>
                              )}
                              {position.budget_mentioned &&
                                position.budget_mentioned !== 'No especificado' && (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                    {getBudgetTypeLabel(parseBudget(position.budget_mentioned).type)}
                                  </span>
                                )}
                            </div>

                            {/* Summary */}
                            <div>
                              <p className="text-sm text-gray-700 leading-relaxed dark:text-gray-300">
                                {position.summary}
                              </p>
                            </div>

                            {/* Key Proposals */}
                            {proposals.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase">
                                  Propuestas Clave
                                </h4>
                                <ul className="space-y-1">
                                  {proposals.slice(0, 3).map((proposal: string) => (
                                    <li
                                      key={proposal}
                                      className="flex gap-2 text-sm text-gray-600 dark:text-gray-400"
                                    >
                                      <span className="text-blue-600 dark:text-blue-400">•</span>
                                      <span>{proposal}</span>
                                    </li>
                                  ))}
                                  {proposals.length > 3 && (
                                    <li className="text-xs text-gray-500 pl-4">
                                      +{proposals.length - 3} más...
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No hay información disponible para esta categoría
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-400">
            Selecciona al menos un partido para comenzar la comparación
          </p>
        </div>
      )}
    </div>
  );
}
