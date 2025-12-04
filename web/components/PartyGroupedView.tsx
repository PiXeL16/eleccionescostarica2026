// ABOUTME: Party-grouped view for displaying promises by political party
// ABOUTME: Uses accordion to organize promises under each party

'use client';

import Image from 'next/image';
import type { Party, TimeBoundPromiseWithParty } from '@/lib/database';
import { getPartyFlagPath } from '@/lib/party-images';
import { Accordion } from './Accordion';
import { PromiseCard } from './PromiseCard';

interface PartyGroupedViewProps {
  promises: TimeBoundPromiseWithParty[];
  parties: Party[];
}

interface GroupedByParty {
  [partyAbbr: string]: TimeBoundPromiseWithParty[];
}

function groupPromisesByParty(promises: TimeBoundPromiseWithParty[]): GroupedByParty {
  const grouped: GroupedByParty = {};

  for (const promise of promises) {
    const abbr = promise.party_abbreviation;
    if (!grouped[abbr]) {
      grouped[abbr] = [];
    }
    grouped[abbr].push(promise);
  }

  return grouped;
}

export function PartyGroupedView({ promises, parties }: PartyGroupedViewProps) {
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          No hay promesas disponibles
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          No se encontraron promesas con plazos específicos para mostrar.
        </p>
      </div>
    );
  }

  const grouped = groupPromisesByParty(promises);

  // Create accordion items for parties with promises
  const accordionItems = parties
    .filter((party) => grouped[party.abbreviation]?.length > 0)
    .map((party) => {
      const partyPromises = grouped[party.abbreviation] || [];

      return {
        id: party.abbreviation.toLowerCase(),
        title: party.name,
        icon: (
          <div className="relative w-8 h-4 flex-shrink-0">
            <Image
              src={getPartyFlagPath(party.abbreviation)}
              alt={party.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ),
        content: (
          <div className="space-y-3">
            {/* Promise count summary */}
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {partyPromises.length} {partyPromises.length === 1 ? 'promesa' : 'promesas'} con plazo
            </div>

            {/* Promise cards */}
            {partyPromises.map((promise) => (
              <PromiseCard
                key={promise.id}
                promise={promise}
                showParty={false} // Hide party since we're already in party context
                variant="default"
              />
            ))}
          </div>
        ),
      };
    });

  return (
    <div>
      {/* Summary stats */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {promises.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Promesas totales</div>
        </div>
        <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {accordionItems.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Partidos</div>
        </div>
        <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {new Set(promises.map((p) => p.category_key).filter(Boolean)).size}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Categorías</div>
        </div>
        <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {Math.round(promises.length / (accordionItems.length || 1))}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Promedio por partido</div>
        </div>
      </div>

      {/* Accordion - all items open by default */}
      <Accordion items={accordionItems} defaultOpenAll />
    </div>
  );
}
