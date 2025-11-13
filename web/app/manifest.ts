// ABOUTME: PWA manifest configuration for installable web app
// ABOUTME: Enables "Add to Home Screen" on mobile devices

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Plataformas Políticas Costa Rica 2026',
    short_name: 'Elecciones CR 2026',
    description:
      'Compara y analiza las propuestas de los 20 partidos políticos de Costa Rica para las elecciones presidenciales 2026',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#667eea',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['politics', 'education', 'news'],
    lang: 'es-CR',
    dir: 'ltr',
  };
}
