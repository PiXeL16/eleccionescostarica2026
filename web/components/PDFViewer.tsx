'use client';

// ABOUTME: PDF viewer component using native browser PDF rendering
// ABOUTME: Simple iframe-based approach for maximum compatibility

interface PDFViewerProps {
  partySlug: string;
  initialPage?: number;
}

export default function PDFViewer({ partySlug, initialPage = 1 }: PDFViewerProps) {
  // Build PDF URL with page fragment for browser's native PDF viewer
  const pdfUrl = `/api/pdf/${partySlug}#page=${initialPage}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header with download button */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-300">Página {initialPage}</div>
        <a
          href={pdfUrl}
          download
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          Descargar PDF
        </a>
      </div>

      {/* PDF iframe - uses browser's native PDF viewer */}
      <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <iframe src={pdfUrl} className="w-full h-full border-0" title="PDF Viewer" />
      </div>
    </div>
  );
}
