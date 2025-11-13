// ABOUTME: JSON-LD structured data helpers for SEO rich snippets
// ABOUTME: Generates Schema.org markup for parties, candidates, and site metadata

import type { Party, Person } from '@/lib/database';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eleccionescostarica.org';

/**
 * Generate WebSite schema for the root page
 * Includes site-level information and search functionality
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Plataformas Políticas de Costa Rica 2026',
    alternateName: 'Plataformas Políticas CR 2026',
    url: SITE_URL,
    description:
      'Compara y analiza las propuestas de los 20 partidos políticos de Costa Rica para las elecciones presidenciales de 2026.',
    inLanguage: 'es-CR',
    publisher: {
      '@type': 'Organization',
      name: 'Plataformas Políticas CR 2026',
      url: SITE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/comparar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Organization schema for a political party
 */
export function generatePartyOrganizationSchema(party: Party) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/partido/${party.abbreviation.toLowerCase()}#organization`,
    name: party.name,
    alternateName: party.abbreviation,
    url: `${SITE_URL}/partido/${party.abbreviation.toLowerCase()}`,
    location: {
      '@type': 'Country',
      name: 'Costa Rica',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Costa Rica',
    },
    knowsAbout: [
      'Política',
      'Gobierno',
      'Elecciones',
      'Plataforma Política',
      'Propuestas Electorales',
    ],
  };
}

/**
 * Generate Person schema for a presidential candidate
 */
export function generateCandidatePersonSchema(candidate: Person, party: Party) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/partido/${party.abbreviation.toLowerCase()}#candidate`,
    name: candidate.full_name,
    jobTitle: 'Candidato Presidencial',
    affiliation: {
      '@type': 'Organization',
      name: party.name,
      alternateName: party.abbreviation,
    },
    nationality: {
      '@type': 'Country',
      name: 'Costa Rica',
    },
    ...(candidate.profession && { hasOccupation: candidate.profession }),
    ...(candidate.date_of_birth && {
      birthDate: candidate.date_of_birth,
    }),
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQPage schema for frequently asked questions
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
