// ABOUTME: Party selector component for comparison page
// ABOUTME: Client-side component allowing selection of up to 3 parties

'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Party } from '@/lib/database';
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
          Selecciona hasta 3 partidos ({selectedSlugs.length}/3)
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {parties.map((party) => {
          const slug = party.abbreviation.toLowerCase();
          const isSelected = selectedSlugs.includes(slug);

          return (
            <button
              type="button"
              key={party.id}
              onClick={() => handleToggleParty(slug)}
              disabled={!isSelected && selectedSlugs.length >= 3}
              className={`group flex h-full flex-col rounded-lg border p-4 transition ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-blue-950/50 ring-2 ring-primary-500'
                  : 'border-[rgba(0,0,0,0.1)] bg-gray-100 hover:border-[rgba(0,0,0,0.2)] hover:shadow-md dark:border-[rgba(255,255,255,0.1)] dark:bg-gray-800/30 dark:hover:border-[rgba(255,255,255,0.2)]'
              } ${!isSelected && selectedSlugs.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Party Name */}
              <div className="mb-3 h-12 text-center flex items-center justify-center relative">
                <h3 className="text-sm font-semibold uppercase text-[#0D0D0D] group-hover:text-[#5D5D5D] dark:text-white dark:group-hover:text-gray-300 line-clamp-3">
                  {party.name}
                </h3>
                {isSelected && (
                  <svg
                    className="absolute top-0 right-0 h-5 w-5 text-primary-600 dark:text-primary-400"
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

              {/* Party Flag */}
              <div className="flex-1 mx-auto w-full aspect-[5/2] relative rounded overflow-hidden bg-white dark:bg-gray-700">
                <Image
                  src={getPartyFlagPath(party.abbreviation)}
                  alt={`Bandera de ${party.name}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
