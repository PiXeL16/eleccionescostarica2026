// ABOUTME: Main client component for accountability calendar page
// ABOUTME: Handles view switching, filtering, and URL state management

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { Category, Party, TimeBoundPromiseWithParty } from '@/lib/database';
import { getPartyFlagPath } from '@/lib/party-images';
import { PartyGroupedView } from './PartyGroupedView';
import { TimelineView } from './TimelineView';

interface AccountabilityCalendarProps {
  promises: TimeBoundPromiseWithParty[];
  parties: Party[];
  categories: Category[];
}

type ViewMode = 'timeline' | 'party';

export function AccountabilityCalendar({
  promises,
  parties,
  categories,
}: AccountabilityCalendarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get view mode from URL
  const viewMode = (searchParams.get('view') as ViewMode) || 'timeline';

  // Get filter values from URL
  const selectedParties = searchParams.get('parties')?.split(',').filter(Boolean) || [];
  const selectedCategory = searchParams.get('category') || '';

  // Update URL params helper
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      router.push(`/calendario-rendicion?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Filter promises based on selections
  const filteredPromises = useMemo(() => {
    let result = promises;

    // Filter by parties
    if (selectedParties.length > 0) {
      const partySet = new Set(selectedParties.map((p) => p.toUpperCase()));
      result = result.filter((p) => partySet.has(p.party_abbreviation.toUpperCase()));
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category_key === selectedCategory);
    }

    return result;
  }, [promises, selectedParties, selectedCategory]);

  // Handle view change
  const handleViewChange = (newView: ViewMode) => {
    updateParams({ view: newView });
  };

  // Handle party filter toggle
  const handlePartyToggle = (partyAbbr: string) => {
    const current = new Set(selectedParties.map((p) => p.toUpperCase()));
    const normalized = partyAbbr.toUpperCase();

    if (current.has(normalized)) {
      current.delete(normalized);
    } else {
      current.add(normalized);
    }

    updateParams({
      parties: current.size > 0 ? Array.from(current).join(',') : null,
    });
  };

  // Handle category filter change
  const handleCategoryChange = (categoryKey: string) => {
    updateParams({ category: categoryKey || null });
  };

  // Clear all filters
  const clearFilters = () => {
    updateParams({ parties: null, category: null });
  };

  const hasActiveFilters = selectedParties.length > 0 || selectedCategory;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Calendario de Promesas
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl">
            Los partidos políticos hacen promesas con plazos específicos en sus planes de gobierno.
            Aquí encontrará todas las promesas con fechas concretas extraídas de los documentos
            oficiales del TSE. Agregue estas promesas a su calendario personal para recordar cuándo
            deben cumplirse y exigir rendición de cuentas a los políticos electos.
          </p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="sticky top-[57px] z-30 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Row 1: View toggle and category filter */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vista:</span>
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleViewChange('timeline')}
                  className={`
                    px-4 py-2 text-sm font-medium transition-colors
                    ${
                      viewMode === 'timeline'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span className="hidden sm:inline">Cronológico</span>
                  <span className="sm:hidden">Tiempo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleViewChange('party')}
                  className={`
                    px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600
                    ${
                      viewMode === 'party'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span className="hidden sm:inline">Por Partido</span>
                  <span className="sm:hidden">Partido</span>
                </button>
              </div>
            </div>

            {/* Category Filter + Clear */}
            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="
                  rounded-lg border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800
                  text-sm text-gray-700 dark:text-gray-300
                  px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                "
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.category_key} value={cat.category_key}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Party filters */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Partidos:</span>
            {parties.map((party) => {
              const isSelected = selectedParties
                .map((p) => p.toUpperCase())
                .includes(party.abbreviation.toUpperCase());

              return (
                <button
                  key={party.abbreviation}
                  type="button"
                  onClick={() => handlePartyToggle(party.abbreviation)}
                  className={`
                    p-1 rounded border transition-all
                    ${
                      isSelected
                        ? 'border-primary-500 dark:border-primary-400 ring-2 ring-primary-500/30 dark:ring-primary-400/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 opacity-70 hover:opacity-100'
                    }
                  `}
                  title={party.name}
                >
                  <div className="relative w-8 h-5">
                    <Image
                      src={getPartyFlagPath(party.abbreviation)}
                      alt={party.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Mostrando {filteredPromises.length} de {promises.length} promesas
            {hasActiveFilters && ' (filtrado)'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === 'timeline' ? (
          <TimelineView promises={filteredPromises} />
        ) : (
          <PartyGroupedView promises={filteredPromises} parties={parties} />
        )}
      </div>

      {/* Empty state when no promises exist at all */}
      {promises.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Próximamente</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Aún no hemos extraído las promesas con fechas de los planes de gobierno. Esta
            funcionalidad estará disponible pronto.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al inicio
          </Link>
        </div>
      )}
    </div>
  );
}
