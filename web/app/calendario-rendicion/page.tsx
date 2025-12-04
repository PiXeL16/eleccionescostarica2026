// ABOUTME: Accountability calendar page for tracking party promises with delivery dates
// ABOUTME: Server component with client-side filtering and view switching

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AccountabilityCalendar } from '@/components/AccountabilityCalendar';
import { getAllPromises, getAllParties, getAllCategories } from '@/lib/database';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eleccionescostarica.org';

export const metadata: Metadata = {
  title: 'Calendario de Promesas',
  description:
    'Promesas electorales con fechas específicas extraídas de los planes de gobierno oficiales. Agregue las promesas a su calendario para exigir rendición de cuentas.',
  openGraph: {
    title: 'Calendario de Promesas - Elecciones Costa Rica 2026',
    description:
      'Promesas con plazos concretos de los partidos políticos. Agregue a su calendario y exija rendición de cuentas.',
    url: `${SITE_URL}/calendario-rendicion`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calendario de Promesas - Elecciones Costa Rica 2026',
    description: 'Promesas electorales con fechas específicas. Exija rendición de cuentas.',
  },
  alternates: {
    canonical: `${SITE_URL}/calendario-rendicion`,
  },
};

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando promesas...</p>
      </div>
    </div>
  );
}

export default function CalendarioRendicionPage() {
  const promises = getAllPromises();
  const parties = getAllParties();
  const categories = getAllCategories();

  return (
    <Suspense fallback={<LoadingState />}>
      <AccountabilityCalendar
        promises={promises}
        parties={parties}
        categories={categories}
      />
    </Suspense>
  );
}
