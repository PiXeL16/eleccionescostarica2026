// ABOUTME: Root layout for the Plataformas Políticas CR 2026 website
// ABOUTME: Configures theme switching with dark mode support, metadata, and global styling

import './globals.css';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen flex-col">
            <header className="relative border-b border-gray-200 shadow-sm dark:border-gray-800">
              {/* Background image */}
              <div className="absolute inset-0 overflow-hidden bg-black">
                <Image
                  src="/header-pattern.jpg"
                  alt="Patrón decorativo costarricense"
                  fill
                  className="object-cover object-center opacity-75 dark:opacity-50"
                  priority
                  unoptimized
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
              </div>

              {/* Content overlay */}
              <div className="relative container mx-auto px-4 py-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                      Plataformas Políticas Costa Rica 2026
                    </h1>
                    <p className="mt-2 text-sm text-white/90 drop-shadow">
                      Compara y analiza las propuestas de los partidos políticos
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href="/acerca-de"
                      className="text-sm font-medium text-white/90 hover:text-white transition drop-shadow"
                    >
                      Acerca de
                    </Link>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 bg-gray-50 dark:bg-gray-950">
              <div className="container mx-auto px-4 py-8">{children}</div>
            </main>

            <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Información extraída de los{' '}
                  <a
                    href="https://www.tse.go.cr/2026/planesgobierno.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    planes de gobierno publicados por el TSE
                  </a>
                </p>
                <p className="mt-2">
                  Elecciones 2026 • Última actualización: {new Date().toLocaleDateString('es-CR')}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <a
                    href="https://github.com/PiXeL16/eleccionescostarica2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                    aria-label="Ver código en GitHub"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Código y datos open source</span>
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
