// ABOUTME: Client-side comparison view component
// ABOUTME: Handles URL search params and displays party comparison

'use client';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [currentPartyIndex, setCurrentPartyIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (comparison && comparison.parties.length > 0) {
      if (isLeftSwipe && currentPartyIndex < comparison.parties.length - 1) {
        setCurrentPartyIndex(currentPartyIndex + 1);
      }
      if (isRightSwipe && currentPartyIndex > 0) {
        setCurrentPartyIndex(currentPartyIndex - 1);
      }
    }
  };

  // Scroll detection to hide indicator - only hide after scrolling past party selector
  useEffect(() => {
    const handleScroll = () => {
      // Keep indicator visible until user scrolls significantly (past party selector area)
      const threshold = window.innerHeight * 0.5; // Hide after scrolling 50% of viewport height
      if (window.scrollY > threshold) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset party index when selected parties change
  // biome-ignore lint/correctness/useExhaustiveDependencies: We intentionally want to reset index when URL params change
  useEffect(() => {
    setCurrentPartyIndex(0);
  }, [partiesParam]);

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

      {/* Scroll Indicator - Fixed at bottom center of viewport */}
      {comparison && comparison.parties.length > 0 && showScrollIndicator && (
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 rounded-full bg-white/95 dark:bg-[#2A2A2A]/95 px-4 py-3 shadow-lg border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] backdrop-blur-sm pointer-events-auto max-w-[90vw] animate-bounce">
            <ChevronDown className="h-5 w-5 text-[#0D0D0D] dark:text-white" />
            <p className="text-sm text-[#0D0D0D] dark:text-white font-medium text-center">
              Desplázate para ver la comparación
            </p>
            <ChevronDown className="h-5 w-5 text-[#0D0D0D] dark:text-white" />
          </div>
        </div>
      )}

      {/* Comparison View */}
      {comparison && comparison.parties.length > 0 ? (
        <div className="space-y-6">
          {/* Desktop: Sticky Header with Party Info */}
          <div className="hidden lg:block sticky top-[57px] z-10 bg-white/80 backdrop-blur-md border-b border-[rgba(0,0,0,0.1)] pb-4 dark:bg-[#212121]/80 dark:border-[rgba(255,255,255,0.1)]">
            <h2 className="text-2xl font-semibold text-[#0D0D0D] mb-4 dark:text-white">
              Comparación
            </h2>

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
                      <p className="text-sm font-semibold text-[#0D0D0D] dark:text-white">
                        {party.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: Swipeable Party Navigation */}
          <div className="lg:hidden sticky top-[57px] z-10 bg-white/80 backdrop-blur-md border-b border-[rgba(0,0,0,0.1)] pb-4 dark:bg-[#212121]/80 dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#0D0D0D] dark:text-white">Comparación</h2>

              {/* Navigation dots */}
              <div className="flex items-center gap-2">
                {comparison.parties.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPartyIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentPartyIndex
                        ? 'w-6 bg-primary-600'
                        : 'w-2 bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={`Ver partido ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Current party header */}
            <div className="flex items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-3 dark:border-[rgba(255,255,255,0.1)] dark:bg-[#2A2A2A]">
              <div className="w-12 aspect-[5/2] shrink-0 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={getPartyFlagPath(comparison.parties[currentPartyIndex].abbreviation)}
                  alt={`Bandera de ${comparison.parties[currentPartyIndex].name}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#0D0D0D] dark:text-white">
                  {comparison.parties[currentPartyIndex].name}
                </p>
              </div>

              {/* Swipe hint */}
              {comparison.parties.length > 1 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
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
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  Desliza
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Category View with all parties side-by-side */}
          <div className="hidden lg:block space-y-6">
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

          {/* Mobile: Swipeable single-party view */}
          <div
            className="lg:hidden space-y-6"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {displayCategories.map((category) => {
              const party = comparison.parties[currentPartyIndex];
              const position = comparison.positions
                .get(party.abbreviation)
                ?.get(category.category_key);
              const proposals = position?.key_proposals ? JSON.parse(position.key_proposals) : [];

              return (
                <div
                  key={category.id}
                  className="rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white p-6 dark:border-[rgba(255,255,255,0.1)] dark:bg-[#2A2A2A]"
                >
                  <h3 className="text-xl font-semibold text-[#0D0D0D] mb-4 dark:text-white">
                    {getCategoryDisplayName(category.name)}
                  </h3>

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
                                <span>{formatTextWithCitations(proposal, party.abbreviation)}</span>
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
