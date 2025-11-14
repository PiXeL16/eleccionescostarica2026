// ABOUTME: Client-side comparison view component
// ABOUTME: Handles URL search params and displays party comparison

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getCategoryDisplayName } from '@/lib/category-display';
import type { Category, Party, PartyPosition } from '@/lib/database';
import { getPartyFlagPath } from '@/lib/party-images';
import { PartySelector } from './PartySelector';

// Helper function to extract page number from citation
function extractPageNumber(citation: string): number | null {
  const match = citation.match(/\[Página (\d+)\]/);
  return match ? parseInt(match[1], 10) : null;
}

// Helper function to render text with clickable page citations
function formatTextWithCitations(text: string, partyAbbr: string) {
  // Split by [Página X] or [Páginas X-Y] pattern
  const parts = text.split(/(\[Páginas? \d+(?:-\d+)?\])/g);

  return parts.map((part, idx) => {
    // biome-ignore lint/suspicious/noArrayIndexKey: Stable split order
    // Check if this part is a citation
    if (part.match(/\[Páginas? \d+(?:-\d+)?\]/)) {
      const pageNum = extractPageNumber(part);

      if (pageNum) {
        return (
          <a
            key={`citation-${idx}`}
            href={`/pdf/${partyAbbr.toLowerCase()}?page=${pageNum}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 italic ml-0.5 hover:underline cursor-pointer"
            title={`Ver página ${pageNum} del PDF de ${partyAbbr}`}
          >
            {part}
          </a>
        );
      }

      return (
        <span
          key={`citation-${idx}`}
          className="text-xs font-semibold text-primary-600 dark:text-primary-400 italic ml-0.5"
        >
          {part}
        </span>
      );
    }
    return <span key={`text-${idx}`}>{part}</span>;
  });
}

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
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#5D5D5D] hover:text-[#0D0D0D] transition-colors mb-4 dark:text-gray-400 dark:hover:text-white"
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

        <h1 className="text-3xl font-semibold text-[#0D0D0D] dark:text-white">Comparar Partidos</h1>
        <p className="mt-2 text-base text-[#5D5D5D] dark:text-gray-400">
          Selecciona hasta 3 partidos para comparar sus plataformas lado a lado
        </p>
      </div>

      {/* Information Notice */}
      <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-gray-50/50 p-4 dark:border-[rgba(255,255,255,0.1)] dark:bg-gray-800/30">
        <p className="text-sm text-[#5D5D5D] dark:text-gray-400">
          Información extraída de los{' '}
          <a
            href="https://www.tse.go.cr/2026/planesgobierno.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D0D0D] underline hover:text-[#5D5D5D] dark:text-white dark:hover:text-gray-300"
          >
            planes de gobierno publicados por el TSE
          </a>
          . Solo se muestran partidos que han publicado su plan de gobierno.
        </p>
      </div>

      {/* Party Selector */}
      <PartySelector parties={allParties} />

      {/* Comparison View */}
      {comparison && comparison.parties.length > 0 ? (
        <div className="space-y-6">
          {/* Sticky Header with Party Info */}
          <div className="sticky top-[57px] z-10 bg-white/80 backdrop-blur-md border-b border-[rgba(0,0,0,0.1)] pb-4 dark:bg-[#212121]/80 dark:border-[rgba(255,255,255,0.1)]">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-[#0D0D0D] dark:text-white">Comparación</h2>
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
                    className="flex items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-3 dark:border-[rgba(255,255,255,0.1)] dark:bg-[#2A2A2A]"
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
                      <p className="text-sm font-semibold text-[#0D0D0D] truncate dark:text-white">
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
                className="rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white p-6 dark:border-[rgba(255,255,255,0.1)] dark:bg-[#2A2A2A]"
              >
                <h3 className="text-xl font-semibold text-[#0D0D0D] mb-4 dark:text-white">
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
                            {/* Ideology Info */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {position.ideology_position && (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-primary-900 dark:text-blue-200">
                                  {position.ideology_position}
                                </span>
                              )}
                            </div>

                            {/* Summary */}
                            <div>
                              <p className="text-sm text-[#0D0D0D] leading-relaxed dark:text-gray-300">
                                {formatTextWithCitations(position.summary, party.abbreviation)}
                              </p>
                            </div>

                            {/* Key Proposals */}
                            {proposals.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium text-[#8F8F8F] mb-2 uppercase dark:text-gray-500">
                                  Propuestas Clave
                                </h4>
                                <ul className="space-y-1">
                                  {proposals.map((proposal: string) => (
                                    <li
                                      key={proposal}
                                      className="flex gap-2 text-sm text-[#5D5D5D] dark:text-gray-400"
                                    >
                                      <span className="text-[#0D0D0D] dark:text-white">•</span>
                                      <span>
                                        {formatTextWithCitations(proposal, party.abbreviation)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-[#8F8F8F] italic dark:text-gray-500">
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
        <div className="rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white p-12 text-center dark:border-[rgba(255,255,255,0.1)] dark:bg-[#2A2A2A]">
          <p className="text-[#5D5D5D] dark:text-gray-400">
            Selecciona al menos un partido para comenzar la comparación
          </p>
        </div>
      )}
    </div>
  );
}
