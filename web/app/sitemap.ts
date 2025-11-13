// ABOUTME: Dynamic sitemap generation for SEO
// ABOUTME: Generates sitemap.xml with all static and dynamic routes

import type { MetadataRoute } from 'next';
import { getAllParties } from '@/lib/database';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eleccionescostarica.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all parties from database for dynamic routes
  const parties = getAllParties();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/comparar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/preguntas-frecuentes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/visualizaciones`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/acerca-de`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic party pages
  const partyPages: MetadataRoute.Sitemap = parties.map((party) => ({
    url: `${SITE_URL}/partido/${party.abbreviation.toLowerCase()}`,
    lastModified: new Date(party.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...partyPages];
}
