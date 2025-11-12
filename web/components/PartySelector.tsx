// ABOUTME: Party selector component for comparison page
// ABOUTME: Client-side component allowing selection of up to 3 parties

'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Party } from '@/lib/database';
import { getPartyColors } from '@/lib/party-colors';
import { getPartyFlagPath } from '@/lib/party-images';

interface PartySelectorProps {
  parties: Party[];
}

export function PartySelector({ parties }: PartySelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedSlugs =
    searchParams
      .get('parties')
      ?.split(',')
      .filter((s) => s.trim().length > 0) || [];

  const handleToggleParty = (slug: string) => {
    let newSlugs: string[];

    if (selectedSlugs.includes(slug)) {
      // Remove party
      newSlugs = selectedSlugs.filter((s) => s !== slug);
    } else {
      // Add party (max 3)
      if (selectedSlugs.length >= 3) {
        return; // Don't allow more than 3
      }
      newSlugs = [...selectedSlugs, slug];
    }

    // Update URL
    const params = new URLSearchParams();
    if (newSlugs.length > 0) {
      params.set('parties', newSlugs.join(','));
    }

    router.push(`/comparar?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selecciona hasta 3 partidos ({selectedSlugs.length}/3)
        </h3>
        {selectedSlugs.length > 0 && (
          <button
            type="button"
            onClick={() => router.push('/comparar')}
            className="text-sm text-red-600 hover:text-red-700 transition dark:text-red-400 dark:hover:text-red-300"
          >
            Limpiar selección
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {parties.map((party) => {
          const slug = party.abbreviation.toLowerCase();
          const isSelected = selectedSlugs.includes(slug);
          const _colors = getPartyColors(party.abbreviation);

          return (
            <button
              type="button"
              key={party.id}
              onClick={() => handleToggleParty(slug)}
              disabled={!isSelected && selectedSlugs.length >= 3}
              className={`rounded-lg border p-4 text-left transition ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
              } ${!isSelected && selectedSlugs.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-20 aspect-[5/2] shrink-0 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={getPartyFlagPath(party.abbreviation)}
                    alt={`Bandera de ${party.name}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate dark:text-white">{party.name}</p>
                  <p className="text-xs text-gray-500">{party.abbreviation}</p>
                </div>
                {isSelected && (
                  <svg
                    className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
