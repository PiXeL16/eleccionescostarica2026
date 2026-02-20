// ABOUTME: PDF viewer page for displaying party platform documents
// ABOUTME: Server component with static generation that reads party data at build time

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PDFPageClient from '@/components/PDFPageClient';
import { getAllParties, getPartyBySlug } from '@/lib/database';

interface PageProps {
  params: Promise<{ party: string }>;
}

export async function generateStaticParams() {
  const parties = getAllParties();
  return parties.map((party) => ({
    party: party.abbreviation.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { party: partySlug } = await params;
  const party = getPartyBySlug(partySlug);

  if (!party) {
    return { title: 'Partido no encontrado' };
  }

  return {
    title: `PDF - ${party.name} (${party.abbreviation})`,
    description: `Plataforma electoral del ${party.name} en formato PDF`,
  };
}

export default async function PDFPage({ params }: PageProps) {
  const { party: partySlug } = await params;
  const party = getPartyBySlug(partySlug);

  if (!party) {
    notFound();
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm mb-1 block"
          >
            &larr; Volver al inicio
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {party.name} ({party.abbreviation})
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Plataforma Electoral</p>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 overflow-hidden">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-600">Cargando visor de PDF...</div>
            </div>
          }
        >
          <PDFPageClient abbreviation={party.abbreviation} />
        </Suspense>
      </main>
    </div>
  );
}
