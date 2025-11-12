// ABOUTME: Home page displaying grid of all political parties
// ABOUTME: Shows party cards with logo placeholders and links to details/comparison

import Link from 'next/link';
import Image from 'next/image';
import { getAllParties } from '@/lib/database';
import { getPartyColors } from '@/lib/party-colors';
import { getPartyFlagPath } from '@/lib/party-images';

export default function HomePage() {
  const parties = getAllParties();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Partidos Políticos</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Selecciona un partido para ver su plataforma completa o compara hasta 3 partidos
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Información extraída de los{' '}
            <a
              href="https://www.tse.go.cr/2026/planesgobierno.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              planes de gobierno publicados por el TSE
            </a>
            . Solo se muestran partidos que han publicado su plan de gobierno.
          </p>
        </div>
        <Link
          href="/comparar"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Comparar Partidos
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {parties.map((party) => {
          const colors = getPartyColors(party.abbreviation);

          return (
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
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
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
          );
        })}
      </div>

      {parties.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-400">No hay partidos políticos disponibles.</p>
        </div>
      )}
    </div>
  );
}
