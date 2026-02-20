// ABOUTME: Client wrapper for PDF page that handles search params for deep linking
// ABOUTME: Reads ?page=N from URL and passes initial page to PDFViewer

'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import PDFViewer to prevent SSR issues with PDF.js
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-600">Cargando visor de PDF...</div>
    </div>
  ),
});

interface PDFPageClientProps {
  abbreviation: string;
}

export default function PDFPageClient({ abbreviation }: PDFPageClientProps) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1;

  return <PDFViewer abbreviation={abbreviation} initialPage={initialPage} />;
}
