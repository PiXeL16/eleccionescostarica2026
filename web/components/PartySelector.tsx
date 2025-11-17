// ABOUTME: Party selector component for comparison page
// ABOUTME: Client-side component allowing selection of up to 2 parties on mobile, 3 on desktop

'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Party } from '@/lib/database';
import { getPartyFlagPath } from '@/lib/party-images';

interface PartySelectorProps {
  parties: Party[];
}

export function PartySelector({ parties }: PartySelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [maxParties, setMaxParties] = useState(3); // Default to desktop

  const selectedSlugs =
    searchParams
      .get('parties')
      ?.split(',')
      .filter((s) => s.trim().length > 0) || [];

  // Detect screen size and set max parties (2 on mobile, 3 on desktop)
  useEffect(() => {
    const updateMaxParties = () => {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      setMaxParties(isDesktop ? 3 : 2);
    };

    // Set initial value
    updateMaxParties();

    // Listen for window resize
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handler = () => updateMaxParties();
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleToggleParty = (slug: string) => {
    let newSlugs: string[];

    if (selectedSlugs.includes(slug)) {
      // Remove party
      newSlugs = selectedSlugs.filter((s) => s !== slug);
    } else {
      // Add party (max based on screen size)
      if (selectedSlugs.length >= maxParties) {
        return; // Don't allow more than max
      }
      newSlugs = [...selectedSlugs, slug];
    }

    // Update URL without scrolling to top
    const params = new URLSearchParams();
    if (newSlugs.length > 0) {
      params.set('parties', newSlugs.join(','));
    }

    router.push(`/comparar?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Selecciona hasta {maxParties} partidos ({selectedSlugs.length}/{maxParties})
        </h3>
        {selectedSlugs.length > 0 && (
          <button
            type="button"
            onClick={() => router.push('/comparar', { scroll: false })}
            className="text-sm text-red-600 hover:text-red-700 transition dark:text-red-400 dark:hover:text-red-300"
          >
            Limpiar selección
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {parties.map((party) => {
          const slug = party.abbreviation.toLowerCase();
          const isSelected = selectedSlugs.includes(slug);

          return (
            <button
              type="button"
              key={party.id}
              onClick={() => handleToggleParty(slug)}
              disabled={!isSelected && selectedSlugs.length >= maxParties}
              className={`rounded-lg border p-4 text-left transition ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-blue-950/50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'
              } ${!isSelected && selectedSlugs.length >= maxParties ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 sm:w-20 aspect-[5/2] shrink-0 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={getPartyFlagPath(party.abbreviation)}
                    alt={`Bandera de ${party.name}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                    {party.name}
                  </p>
                  <p className="text-xs text-gray-500">{party.abbreviation}</p>
                </div>
                {isSelected && (
                  <svg
                    className="h-5 w-5 text-primary-600 dark:text-primary-400 shrink-0"
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
