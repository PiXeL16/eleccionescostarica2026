// ABOUTME: Party detail page showing complete platform with TOC and PDF link
// ABOUTME: Displays all positions organized by category with quick navigation

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PartyPlatform } from '@/components/PartyPlatform';
import { getCategoryDisplayName } from '@/lib/category-display';
import { getCategoryIcon } from '@/lib/category-icons';
import {
  getAllParties,
  getDocumentText,
  getPartyDocument,
  getPartyWithPositions,
  getCandidateWithRunningMates,
} from '@/lib/database';
import { getPartyColors } from '@/lib/party-colors';
import { getPartyFlagPath } from '@/lib/party-images';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const parties = getAllParties();
  return parties.map((party) => ({
    slug: party.abbreviation.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const party = getPartyWithPositions(slug);

  if (!party) {
    return { title: 'Partido no encontrado' };
  }

  return {
    title: `${party.name} (${party.abbreviation}) - Plataforma 2026`,
    description: `Plataforma política completa del ${party.name} para las elecciones de Costa Rica 2026`,
  };
}

export default async function PartyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const party = getPartyWithPositions(slug);

  if (!party) {
    notFound();
  }

  const _colors = getPartyColors(party.abbreviation);
  const document = getPartyDocument(party.id);
  const extractedText = document ? getDocumentText(document.id) : null;
  const candidate = getCandidateWithRunningMates(party.abbreviation);

  // Prepare accordion items (filter out Ambiente y Liderazgo Verde as it duplicates Medio Ambiente)
  const accordionItems = party.positions
    .filter((pos) => pos.category.name !== 'Ambiente y Liderazgo Verde')
    .map((pos) => {
      const proposals = pos.key_proposals ? JSON.parse(pos.key_proposals) : [];

      return {
        id: pos.category.category_key,
        title: getCategoryDisplayName(pos.category.name),
        icon: getCategoryIcon(pos.category.name),
        content: (
          <div className="space-y-4">
            {/* Summary */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">Resumen</h4>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300 break-words">
                {pos.summary}
              </p>
            </div>

            {/* Key Proposals */}
            {proposals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">
                  Propuestas Clave
                </h4>
                <ul className="space-y-2">
                  {proposals.map((proposal: string) => (
                    <li key={proposal} className="flex gap-3 text-gray-700 dark:text-gray-300">
                      <span className="text-primary-600 font-bold dark:text-primary-400 shrink-0">
                        •
                      </span>
                      <span className="flex-1 min-w-0 break-words">{proposal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ideology Position */}
            {pos.ideology_position && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">
                  Posición Ideológica
                </h4>
                <p className="text-gray-700 dark:text-gray-300 break-words">
                  {pos.ideology_position}
                </p>
              </div>
            )}

            {/* Budget Mentioned */}
            {pos.budget_mentioned && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">
                  Presupuesto Mencionado
                </h4>
                <p className="text-gray-700 dark:text-gray-300 break-words">
                  {pos.budget_mentioned}
                </p>
              </div>
            )}
          </div>
        ),
      };
    });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition dark:text-gray-400 dark:hover:text-white"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a todos los partidos
      </Link>

      {/* Party Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Party Flag */}
          <div className="w-full md:w-64 aspect-[5/2] relative rounded-xl overflow-hidden md:shrink-0 bg-gray-100 dark:bg-gray-800">
            <Image
              src={getPartyFlagPath(party.abbreviation)}
              alt={`Bandera de ${party.name}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Party Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {party.name}
            </h1>
            <p className="mt-2 text-base md:text-lg text-gray-600 dark:text-gray-400">
              {party.abbreviation}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                href={`/comparar?parties=${party.abbreviation.toLowerCase()}`}
                className="rounded-lg bg-primary-600 px-6 py-2 font-medium text-white transition hover:bg-primary-700 text-center"
              >
                Comparar con otros
              </Link>
              {document?.source_url && (
                <a
                  href={document.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-200 bg-white px-6 py-2 font-medium text-gray-900 transition hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 text-center"
                >
                  📄 Ver PDF Original en TSE
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <PartyPlatform accordionItems={accordionItems} extractedText={extractedText} candidate={candidate} />

      {/* Running Mates Section */}
      {candidate && candidate.running_mates && candidate.running_mates.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 dark:text-white">
            Fórmula Presidencial
          </h2>
          <div className="space-y-4">
            {candidate.running_mates.map((mate) => (
              <div
                key={mate.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <div className="shrink-0">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-primary-600 bg-primary-100 dark:text-primary-400 dark:bg-primary-900/30">
                      {mate.position === 'primer_vicepresidente' ? '1er Vicepresidente' : '2do Vicepresidente'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {mate.full_name}
                    </h3>
                    {mate.profile_description && mate.profile_description.trim() && (
                      <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {mate.profile_description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
