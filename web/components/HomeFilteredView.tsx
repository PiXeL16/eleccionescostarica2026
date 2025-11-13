// ABOUTME: Client component wrapper for home page with party filtering
// ABOUTME: Filters parties by ideology and budget type based on URL search params

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type BudgetType, parseBudget } from '@/lib/budget-parser';
import type { Party } from '@/lib/database';
import { getPartyFlagPath } from '@/lib/party-images';
import { FilterPanel } from './FilterPanel';

interface PartyPosition {
  party_id: number;
  ideology_position: string | null;
  budget_mentioned: string | null;
}

interface HomeFilteredViewProps {
  parties: Party[];
  positions: PartyPosition[];
}

export function HomeFilteredView({ parties, positions }: HomeFilteredViewProps) {
  const searchParams = useSearchParams();
  const ideologyFilter = searchParams.get('ideology') || 'all';
  const budgetTypeFilter = (searchParams.get('budget_type') as BudgetType) || 'all';

  // Filter parties based on their positions
  const filteredParties = parties.filter((party) => {
    const partyPositions = positions.filter((p) => p.party_id === party.id);

    // If no positions exist for this party, exclude it when filters are active
    if (partyPositions.length === 0 && (ideologyFilter !== 'all' || budgetTypeFilter !== 'all')) {
      return false;
    }

    // Check ideology filter
    if (ideologyFilter !== 'all') {
      const hasMatchingIdeology = partyPositions.some(
        (pos) => pos.ideology_position === ideologyFilter
      );
      if (!hasMatchingIdeology) {
        return false;
      }
    }

    // Check budget type filter
    if (budgetTypeFilter !== 'all') {
      const hasMatchingBudgetType = partyPositions.some((pos) => {
        const parsed = parseBudget(pos.budget_mentioned);
        return parsed.type === budgetTypeFilter;
      });
      if (!hasMatchingBudgetType) {
        return false;
      }
    }

    return true;
  });

  return (
    <>
      <div className="mb-8">
        <FilterPanel showIdeologyFilter={true} showBudgetTypeFilter={true} />
      </div>

      {(ideologyFilter !== 'all' || budgetTypeFilter !== 'all') && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Mostrando {filteredParties.length} de {parties.length} partidos
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredParties.map((party) => (
          <Link
            key={party.id}
            href={`/partido/${party.abbreviation.toLowerCase()}`}
            className="group"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
              {/* Party Flag */}
              <div className="mx-auto w-full aspect-[5/2] relative rounded-lg overflow-hidden max-w-[240px] bg-gray-100 dark:bg-gray-800">
                <Image
                  src={getPartyFlagPath(party.abbreviation)}
                  alt={`Bandera de ${party.name}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              {/* Party Info */}
              <div className="mt-4 text-center">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                  {party.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{party.abbreviation}</p>
              </div>

              {/* View Button */}
              <div className="mt-4">
                <div className="w-full rounded-lg bg-gray-100 py-2 text-center text-sm font-medium text-gray-900 transition group-hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:group-hover:bg-gray-700">
                  Ver Plataforma
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredParties.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-400">
            No se encontraron partidos que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}
    </>
  );
}
