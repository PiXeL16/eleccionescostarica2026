'use client';

// ABOUTME: PDF viewer page for displaying party platform documents
// ABOUTME: Accepts party slug and optional page query parameter for deep linking

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Dynamically import PDFViewer to prevent SSR issues with PDF.js
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-600">Cargando visor de PDF...</div>
    </div>
  ),
});

interface Party {
  id: number;
  name: string;
  abbreviation: string;
  folder_name: string;
  created_at: string;
}

export default function PDFPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [party, setParty] = useState<Party | null>(null);
  const [loading, setLoading] = useState(true);

  const partySlug = params.party as string;
  const pageParam = searchParams.get('page');
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;

  useEffect(() => {
    // Fetch party data on client side
    async function fetchParty() {
      try {
        const response = await fetch(`/api/party/${partySlug}`);
        if (!response.ok) {
          setParty(null);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setParty(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching party:', error);
        setParty(null);
        setLoading(false);
      }
    }

    fetchParty();
  }, [partySlug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

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
            ← Volver al inicio
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {party.name} ({party.abbreviation})
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Plataforma Electoral</p>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 overflow-hidden">
        <PDFViewer partySlug={partySlug} initialPage={initialPage} />
      </main>
    </div>
  );
}
