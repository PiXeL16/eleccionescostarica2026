// ABOUTME: Client-side comparison view component
// ABOUTME: Handles URL search params and displays party comparison

'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Party, Category, PartyPosition } from '@/lib/database';
import { getPartyColors } from '@/lib/party-colors';
import { getCategoryDisplayName } from '@/lib/category-display';
import { getPartyFlagPath } from '@/lib/party-images';
import { PartySelector } from './PartySelector';
import { CategoryFilter } from './CategoryFilter';

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
  const categoryParam = searchParams.get('category');

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
          parties: comparisonData.parties.filter((p) =>
            selectedSlugs.includes(p.abbreviation)
          ),
        }
      : null;

  // Filter categories if specific category selected
  const displayCategories = categoryParam
    ? allCategories.filter((c) => c.category_key === categoryParam)
    : allCategories;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4 dark:text-gray-400 dark:hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <PartySelector parties={allParties} />
      </div>

      {/* Comparison View */}
      {comparison && comparison.parties.length > 0 ? (
        <div className="space-y-6">
          {/* Sticky Header with Party Info */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 pb-4 dark:bg-gray-950/95 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comparación</h2>
              <CategoryFilter categories={allCategories} />
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
                  <div key={party.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
                      <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">{party.name}</p>
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
                <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">{getCategoryDisplayName(category.name)}</h3>

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
                                  {proposals.slice(0, 3).map((proposal: string, idx: number) => (
                                    <li key={idx} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
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
