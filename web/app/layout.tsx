// ABOUTME: Root layout for the Plataformas Políticas CR 2026 website
// ABOUTME: Configures dark theme, metadata, and global styling

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plataformas Políticas Costa Rica 2026',
  description:
    'Compara y analiza las propuestas de los partidos políticos de Costa Rica para las elecciones de 2026',
  keywords: [
    'costa rica',
    'elecciones 2026',
    'partidos políticos',
    'plataformas políticas',
    'TSE',
    'comparación',
  ],
  authors: [{ name: 'Plataformas CR 2026' }],
  openGraph: {
    title: 'Plataformas Políticas Costa Rica 2026',
    description:
      'Compara y analiza las propuestas de los partidos políticos para las elecciones 2026',
    type: 'website',
    locale: 'es_CR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-gray-800 bg-gray-900">
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold text-white">
                Plataformas Políticas Costa Rica 2026
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Compara y analiza las propuestas de los partidos políticos
              </p>
            </div>
          </header>

          <main className="flex-1">
            <div className="container mx-auto px-4 py-8">{children}</div>
          </main>

          <footer className="border-t border-gray-800 bg-gray-900 py-6">
            <div className="container mx-auto px-4 text-center text-sm text-gray-400">
              <p>
                Información extraída de los{' '}
                <a
                  href="https://www.tse.go.cr/2026/planesgobierno.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  planes de gobierno publicados por el TSE
                </a>
              </p>
              <p className="mt-2">
                Elecciones 2026 • Última actualización: {new Date().toLocaleDateString('es-CR')}
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
