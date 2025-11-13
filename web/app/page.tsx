// ABOUTME: Home page displaying grid of all political parties
// ABOUTME: Shows party cards with logo placeholders and links to details/comparison

import Image from 'next/image';
import Link from 'next/link';
import { getAllParties } from '@/lib/database';
import { getPartyFlagPath } from '@/lib/party-images';

export default function HomePage() {
  const parties = getAllParties();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      {/* Hero Section with SEO Content */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0D0D0D] dark:text-white">
          Elecciones Costa Rica 2026
        </h1>
        <p className="text-lg md:text-xl text-[#5D5D5D] dark:text-gray-300 max-w-3xl mx-auto">
          Compara las plataformas políticas de los <strong>partidos políticos</strong> inscritos
          para las{' '}
          <strong>elecciones presidenciales y legislativas del 1 de febrero de 2026</strong>.
          Información oficial del TSE analizada con inteligencia artificial.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/comparar"
            className="rounded-full bg-primary-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-primary-700 shadow-lg hover:shadow-xl"
          >
            Comparar Partidos
          </Link>
        </div>
      </div>

      {/* Information Notice */}
      <div className="mx-auto max-w-2xl rounded-xl border border-[rgba(0,0,0,0.1)] bg-gray-50/50 p-4 dark:border-[rgba(255,255,255,0.1)] dark:bg-gray-800/30">
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

      {/* Party Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parties.map((party) => (
          <Link
            key={party.id}
            href={`/partido/${party.abbreviation.toLowerCase()}`}
            className="group"
          >
            <div className="rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white p-5 transition-all hover:border-[rgba(0,0,0,0.2)] hover:shadow-lg dark:border-[rgba(255,255,255,0.1)] dark:bg-[#2A2A2A] dark:hover:border-[rgba(255,255,255,0.2)]">
              {/* Party Flag */}
              <div className="mx-auto w-full aspect-[5/2] relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
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
                <h3 className="text-base font-semibold text-[#0D0D0D] group-hover:text-[#5D5D5D] dark:text-white dark:group-hover:text-gray-300">
                  {party.name}
                </h3>
                <p className="mt-1 text-sm text-[#8F8F8F] dark:text-gray-500">
                  {party.abbreviation}
                </p>
              </div>

              {/* View Button */}
              <div className="mt-4">
                <div className="w-full rounded-full bg-gray-100 py-2 text-center text-sm font-medium text-[#0D0D0D] transition-all group-hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:group-hover:bg-gray-700">
                  Ver Plataforma
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
