// ABOUTME: Home page displaying grid of all political parties with filtering
// ABOUTME: Shows party cards with logo placeholders and links to details/comparison

import Link from 'next/link';
import { Suspense } from 'react';
import { HomeFilteredView } from '@/components/HomeFilteredView';
import { getAllParties, getAllPositions } from '@/lib/database';

export default function HomePage() {
  const parties = getAllParties();
  const positions = getAllPositions();

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

      <Suspense
        fallback={
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            Cargando partidos...
          </div>
        }
      >
        <HomeFilteredView parties={parties} positions={positions} />
      </Suspense>
    </div>
  );
}
