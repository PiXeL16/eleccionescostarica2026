// ABOUTME: Party detail page showing complete platform with TOC and PDF link
// ABOUTME: Displays all positions organized by category with quick navigation

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllParties, getPartyWithPositions, getPartyDocument, getDocumentText } from '@/lib/database';
import { getPartyColors } from '@/lib/party-colors';
import { getCategoryDisplayName } from '@/lib/category-display';
import { getPartyFlagPath } from '@/lib/party-images';
import { Accordion } from '@/components/Accordion';

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

  const colors = getPartyColors(party.abbreviation);
  const document = getPartyDocument(party.id) as any;
  const extractedText = document ? getDocumentText(document.id) : null;

  // Prepare accordion items
  const accordionItems = party.positions.map((pos) => {
    const proposals = pos.key_proposals ? JSON.parse(pos.key_proposals) : [];

    return {
      id: pos.category.category_key,
      title: getCategoryDisplayName(pos.category.name),
      content: (
        <div className="space-y-4">
          {/* Summary */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">Resumen</h4>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">{pos.summary}</p>
          </div>

          {/* Key Proposals */}
          {proposals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">Propuestas Clave</h4>
              <ul className="space-y-2">
                {proposals.map((proposal: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-blue-600 font-bold dark:text-blue-400">•</span>
                    <span>{proposal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ideology Position */}
          {pos.ideology_position && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">Posición Ideológica</h4>
              <p className="text-gray-700 dark:text-gray-300">{pos.ideology_position}</p>
            </div>
          )}

          {/* Budget Mentioned */}
          {pos.budget_mentioned && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2 dark:text-gray-400">Presupuesto Mencionado</h4>
              <p className="text-gray-700 dark:text-gray-300">{pos.budget_mentioned}</p>
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
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a todos los partidos
      </Link>

      {/* Party Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-6">
          {/* Party Flag */}
          <div className="w-64 aspect-[5/2] relative rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{party.name}</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{party.abbreviation}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/comparar?parties=${party.abbreviation.toLowerCase()}`}
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Comparar con otros
              </Link>
              {document && (
                <a
                  href={`/../data/partidos/${party.folder_name}/${party.abbreviation}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-200 bg-white px-6 py-2 font-medium text-gray-900 transition hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  📄 Ver PDF Original
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* Table of Contents - Sticky */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">Navegación Rápida</h3>
            <nav className="space-y-1">
              {party.positions.map((pos) => (
                <a
                  key={pos.category.category_key}
                  href={`#${pos.category.category_key}`}
                  className="block rounded px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  {getCategoryDisplayName(pos.category.name)}
                </a>
              ))}
              {extractedText && (
                <a
                  href="#texto-completo"
                  className="block rounded px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  Texto Completo
                </a>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Positions by Category */}
          <div id="plataforma">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">Plataforma Política</h2>
            {party.positions.length > 0 ? (
              <div className="space-y-4">
                {party.positions.map((pos) => (
                  <div
                    key={pos.category.category_key}
                    id={pos.category.category_key}
                    className="scroll-mt-8"
                  >
                    <Accordion items={[accordionItems.find(item => item.id === pos.category.category_key)!]} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400">
                  No hay información de plataforma disponible para este partido.
                </p>
              </div>
            )}
          </div>

          {/* Full Extracted Text */}
          {extractedText && (
            <div id="texto-completo" className="scroll-mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">Texto Completo Extraído</h2>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">
                  Este es el texto completo extraído del documento PDF oficial del partido.
                </p>
                <div className="prose max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed dark:text-gray-300">
                    {extractedText}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
