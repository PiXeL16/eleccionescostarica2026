// ABOUTME: FAQ page with common questions about Costa Rica 2026 elections
// ABOUTME: Includes FAQPage schema for SEO rich snippets

import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/structured-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eleccionescostarica.org';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes',
  description:
    'Preguntas frecuentes sobre las elecciones presidenciales de Costa Rica 2026 y cómo usar nuestra plataforma de comparación de partidos políticos.',
  openGraph: {
    title: 'Preguntas Frecuentes - Elecciones Costa Rica 2026',
    description:
      'Encuentra respuestas a preguntas comunes sobre las elecciones 2026 y cómo comparar partidos políticos.',
    url: `${SITE_URL}/preguntas-frecuentes`,
  },
  alternates: {
    canonical: `${SITE_URL}/preguntas-frecuentes`,
  },
};

const faqs = [
  {
    question: '¿Cuándo son las elecciones presidenciales de Costa Rica 2026?',
    answer:
      'Las elecciones presidenciales y legislativas de Costa Rica se llevarán a cabo el domingo 1 de febrero de 2026. Si ningún candidato presidencial obtiene más del 40% de los votos válidos, habrá una segunda ronda el domingo 5 de abril de 2026.',
  },
  {
    question: '¿De dónde proviene la información de las plataformas políticas?',
    answer:
      'Toda la información proviene de los planes de gobierno oficiales presentados por cada partido político ante el Tribunal Supremo de Elecciones (TSE) de Costa Rica. Estos documentos son públicos y están disponibles en la página web del TSE. Nosotros procesamos y analizamos estos planes usando inteligencia artificial para hacerlos más accesibles.',
  },
  {
    question: '¿Cómo funciona el análisis de las plataformas?',
    answer:
      'Utilizamos tecnología de inteligencia artificial (GPT-4 de OpenAI) para analizar los planes de gobierno de cada partido. El sistema extrae las propuestas clave, identifica la posición ideológica, y categoriza la información en 13 áreas temáticas como economía, salud, educación, seguridad, entre otras. Esto permite comparar fácilmente las propuestas de diferentes partidos en cada tema.',
  },
  {
    question: '¿Cuántos partidos políticos están inscritos para las elecciones 2026?',
    answer:
      'Nuestra plataforma incluye análisis de los 20 partidos políticos que han presentado sus planes de gobierno ante el TSE. Es importante aclarar que pueden existir más partidos inscritos ante el TSE, pero solo mostramos aquellos que han publicado su plan de gobierno oficial.',
  },
  {
    question: '¿Cómo uso la función de comparación de partidos?',
    answer:
      'En la página de comparación, puedes seleccionar hasta 3 partidos políticos usando los menús desplegables. Una vez seleccionados, verás las propuestas de cada partido organizadas por categoría, lo que facilita identificar similitudes y diferencias en sus plataformas. También puedes usar filtros para enfocarte en temas específicos de tu interés.',
  },
  {
    question: '¿La información está actualizada?',
    answer:
      'La información se basa en los planes de gobierno presentados por los partidos ante el TSE. Los datos se actualizan periódicamente de forma manual, por lo que puede haber un desfase entre la publicación de un plan actualizado y su disponibilidad en nuestra plataforma. Recomendamos verificar directamente en el sitio del TSE para la información más reciente.',
  },
  {
    question: '¿Esta plataforma está afiliada a algún partido político?',
    answer:
      'No. Esta es una plataforma independiente y sin fines de lucro creada para ayudar a los ciudadanos costarricenses a tomar decisiones informadas. No estamos afiliados a ningún partido político ni organización política. El código fuente es de acceso público (open source) en GitHub: https://github.com/PiXeL16/eleccionescostarica2026. Para máxima transparencia, también publicamos el prompt del sistema usado en el chat: https://github.com/PiXeL16/eleccionescostarica2026/blob/main/SYSTEM_PROMPT.md',
  },
  {
    question: '¿Puedo confiar en el análisis de IA?',
    answer:
      'El análisis de IA es una herramienta para facilitar el acceso a la información, pero siempre recomendamos leer los planes de gobierno completos disponibles en el sitio del TSE. La IA puede cometer errores o tener interpretaciones sesgadas. Usa esta plataforma como punto de partida, no como única fuente de información.',
  },
  {
    question: '¿Cómo puedo verificar la información?',
    answer:
      'Cada partido tiene un enlace directo al PDF oficial de su plan de gobierno publicado por el TSE. Puedes descargar y leer el documento completo para verificar cualquier información. También incluimos referencias a las páginas específicas donde encontramos cada propuesta.',
  },
  {
    question: '¿Puedo sugerir mejoras o reportar errores?',
    answer:
      'Sí, por favor. Esta plataforma es de código abierto y apreciamos tu retroalimentación. Puedes reportar errores o sugerir mejoras a través de nuestro repositorio de GitHub. También puedes contactarnos por correo electrónico.',
  },
];

export default function FAQPage() {
  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: 'Preguntas Frecuentes', url: '/preguntas-frecuentes' },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(
    breadcrumbItems.map((item) => ({ name: item.name, url: `${SITE_URL}${item.url}` }))
  );
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Preguntas Frecuentes</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Encuentra respuestas a las preguntas más comunes sobre las elecciones 2026 y cómo usar
            nuestra plataforma.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-3 dark:text-white">
                {faq.question}
              </h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-6 dark:border-primary-900 dark:bg-primary-950">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-white">
            ¿No encontraste tu respuesta?
          </h3>
          <p className="text-gray-700 mb-4 dark:text-gray-300">
            Puedes revisar los planes de gobierno completos en el sitio oficial del TSE o
            contactarnos a través de nuestro repositorio de GitHub.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="https://www.tse.go.cr/2026/planesgobierno.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition"
            >
              Ver planes en TSE
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
            <Link
              href="https://github.com/PiXeL16/eleccionescostarica2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Repositorio GitHub
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
