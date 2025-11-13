// ABOUTME: Comparison page for side-by-side party platform comparison
// ABOUTME: Server component that loads all data and passes to client component

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ComparisonView } from '@/components/ComparisonView';
import { compareParties, getAllCategories, getAllParties } from '@/lib/database';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eleccionescostarica.org';

export const metadata: Metadata = {
  title: 'Comparar Partidos Políticos',
  description:
    'Compara las propuestas de hasta 3 partidos políticos de Costa Rica lado a lado. Analiza diferencias y similitudes en sus plataformas para las elecciones 2026.',
  openGraph: {
    title: 'Comparar Partidos Políticos - Costa Rica 2026',
    description:
      'Compara las propuestas de los partidos políticos para las elecciones 2026 de Costa Rica.',
    url: `${SITE_URL}/comparar`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comparar Partidos Políticos - Costa Rica 2026',
    description: 'Compara las propuestas de los partidos políticos lado a lado.',
  },
  alternates: {
    canonical: `${SITE_URL}/comparar`,
  },
};

export default function ComparePage() {
  const allParties = getAllParties();
  const allCategories = getAllCategories();

  // Pre-fetch comparison data for all parties (will be filtered client-side)
  const allSlugs = allParties.map((p) => p.abbreviation);
  const comparisonData = allSlugs.length > 0 ? compareParties(allSlugs) : null;

  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}
    >
      <ComparisonView
        allParties={allParties}
        allCategories={allCategories}
        comparisonData={comparisonData}
      />
    </Suspense>
  );
}
