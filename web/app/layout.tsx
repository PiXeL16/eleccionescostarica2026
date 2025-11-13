// ABOUTME: Root layout for the Plataformas Políticas CR 2026 website
// ABOUTME: Configures theme switching with dark mode support, metadata, and global styling

import './globals.css';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChatProvider } from '@/components/ChatProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getAllPartiesForChat } from '@/lib/chat-data';
import { generateWebSiteSchema } from '@/lib/structured-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eleccionescostarica.org';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Plataformas Políticas de Costa Rica 2026',
    template: '%s | Plataformas Políticas CR 2026',
  },
  description:
    'Compara y analiza las propuestas de los 20 partidos políticos de Costa Rica para las elecciones presidenciales de 2026. Información oficial del TSE con análisis de IA.',
  keywords: [
    'costa rica',
    'elecciones 2026',
    'elecciones presidenciales',
    'partidos políticos',
    'plataformas políticas',
    'planes de gobierno',
    'TSE',
    'comparación partidos',
    'candidatos 2026',
    'votación costa rica',
  ],
  authors: [{ name: 'Plataformas Políticas de Costa Rica 2026', url: SITE_URL }],
  creator: 'Plataformas Políticas CR 2026',
  publisher: 'Plataformas Políticas CR 2026',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: SITE_URL,
    siteName: 'Plataformas Políticas Costa Rica 2026',
    title: 'Plataformas Políticas de Costa Rica 2026',
    description:
      'Compara y analiza las propuestas de los 20 partidos políticos para las elecciones presidenciales 2026. Datos oficiales del TSE.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Plataformas Políticas Costa Rica 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plataformas Políticas de Costa Rica 2026',
    description:
      'Compara las propuestas de los 20 partidos políticos para las elecciones 2026. Datos del TSE.',
    images: ['/og-image.png'],
    creator: '@eleccionesCR', // Update with actual Twitter handle if exists
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Add Google Search Console verification code when available
    // google: 'your-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#212121' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch parties for chat dropdown (runs at build time for static pages)
  const parties = getAllPartiesForChat();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ChatProvider parties={parties}>
            <div className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-30 border-b border-[rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-md dark:border-[rgba(255,255,255,0.1)] dark:bg-[#212121]/80">
                <div className="container mx-auto px-6 py-3">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                      <Image
                        src="/header-icon.png"
                        alt="Costa Rica Icon"
                        width={40}
                        height={40}
                        className="h-10 w-10"
                      />
                      <div className="text-lg font-semibold text-[#0D0D0D] dark:text-white">
                        Plataformas Políticas de Costa Rica 2026
                      </div>
                    </Link>
                    <div className="flex items-center gap-4">
                      <Link
                        href="/acerca-de"
                        className="text-sm font-medium text-[#5D5D5D] hover:text-[#0D0D0D] transition-colors dark:text-gray-400 dark:hover:text-white"
                      >
                        Acerca de
                      </Link>
                      <Link
                        href="/preguntas-frecuentes"
                        className="text-sm font-medium text-[#5D5D5D] hover:text-[#0D0D0D] transition-colors dark:text-gray-400 dark:hover:text-white"
                      >
                        Preguntas Frecuentes
                      </Link>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </header>

              <main className="flex-1 bg-white dark:bg-[#212121]">
                <div className="container mx-auto px-6 py-8">{children}</div>
              </main>

              <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Información extraída de los{' '}
                    <a
                      href="https://www.tse.go.cr/2026/planesgobierno.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline dark:text-primary-400"
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
                  <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                    Made with ❤️ by Chris, Esteban & Leo • v1.1.0
                  </p>
                </div>
              </footer>
            </div>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
