// ABOUTME: Heatmap showing cross-party agreement levels across categories
// ABOUTME: Reveals consensus issues vs divisive topics using color intensity

'use client';

import { useState } from 'react';
import type { CategoryAgreement } from '@/lib/agreement-analyzer';

interface AgreementHeatmapProps {
  categories: CategoryAgreement[];
  overallConsensusScore: number;
}

export default function AgreementHeatmap({
  categories,
  overallConsensusScore,
}: AgreementHeatmapProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryAgreement | null>(null);

  // Color scale based on agreement level
  const getAgreementColor = (similarity: number) => {
    if (similarity >= 70) return 'bg-green-500'; // High consensus
    if (similarity >= 55) return 'bg-green-400';
    if (similarity >= 40) return 'bg-yellow-400'; // Moderate
    if (similarity >= 25) return 'bg-orange-400';
    return 'bg-red-500'; // High division
  };

  const getAgreementLabel = (similarity: number) => {
    if (similarity >= 70) return 'Alto Consenso';
    if (similarity >= 55) return 'Consenso Moderado';
    if (similarity >= 40) return 'Neutral';
    if (similarity >= 25) return 'División Moderada';
    return 'Alta División';
  };

  if (categories.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">No hay datos de acuerdo disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 border-l-4 border-blue-500">
          <div className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
            Consenso General
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(overallConsensusScore)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Promedio de similitud entre partidos
          </div>
        </div>

        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border-l-4 border-green-500">
          <div className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">
            Mayor Consenso
          </div>
          <div className="text-sm font-bold text-green-600 dark:text-green-400">
            {categories[0]?.categoryName || 'N/A'}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {Math.round(categories[0]?.averageSimilarity || 0)}% de acuerdo
          </div>
        </div>

        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border-l-4 border-red-500">
          <div className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
            Mayor División
          </div>
          <div className="text-sm font-bold text-red-600 dark:text-red-400">
            {categories[categories.length - 1]?.categoryName || 'N/A'}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {Math.round(categories[categories.length - 1]?.averageSimilarity || 0)}% de acuerdo
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Escala de Acuerdo
        </h4>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">≥70% Alto Consenso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-400 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">55-69% Consenso Moderado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">40-54% Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-400 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">25-39% División Moderada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">&lt;25% Alta División</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nivel de Acuerdo por Categoría
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Haz clic en una categoría para ver más detalles
        </p>

        <div className="grid grid-cols-1 gap-2">
          {categories.map((category) => (
            <button
              key={category.categoryKey}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition cursor-pointer text-left"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {category.categoryName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {category.participatingParties} partidos
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {Math.round(category.averageSimilarity)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getAgreementLabel(category.averageSimilarity)}
                  </div>
                </div>

                <div
                  className={`w-16 h-8 rounded ${getAgreementColor(category.averageSimilarity)}`}
                  title={`${Math.round(category.averageSimilarity)}% de acuerdo`}
                ></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal/Panel */}
      {selectedCategory && (
        // biome-ignore lint/a11y/useSemanticElements: Modal backdrop overlay requires div with role=button for proper interaction
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedCategory(null)}
          onKeyDown={(e) => e.key === 'Escape' && setSelectedCategory(null)}
          role="button"
          tabIndex={0}
          aria-label="Cerrar diálogo"
        >
          <div
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedCategory.categoryName}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Análisis de Acuerdo Entre Partidos
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  aria-label="Cerrar"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>Cerrar</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Agreement Score */}
              <div
                className={`rounded-lg p-4 ${
                  selectedCategory.averageSimilarity >= 70
                    ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                    : selectedCategory.averageSimilarity < 40
                      ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Nivel de Acuerdo
                  </span>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {Math.round(selectedCategory.averageSimilarity)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {selectedCategory.participatingParties} partidos tienen propuestas en esta
                  categoría
                </p>
              </div>

              {/* Interpretation */}
              <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Interpretación</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedCategory.highConsensus
                    ? `Existe un alto consenso en ${selectedCategory.categoryName}. Los partidos comparten enfoques similares y utilizan lenguaje parecido en sus propuestas, lo que sugiere un acuerdo generalizado sobre las prioridades y soluciones en esta área.`
                    : selectedCategory.highDivision
                      ? `Hay una división significativa en ${selectedCategory.categoryName}. Los partidos presentan enfoques muy diferentes, lo que refleja visiones ideológicas o estratégicas distintas sobre cómo abordar estos temas.`
                      : `El nivel de acuerdo en ${selectedCategory.categoryName} es moderado. Aunque hay algunas similitudes en las propuestas, también existen diferencias notables en los enfoques y prioridades de los partidos.`}
                </p>
              </div>

              {/* Common Words - Shared Concepts */}
              {selectedCategory.commonWords.length > 0 && (
                <div className="rounded-lg bg-green-50 dark:bg-green-900/10 p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                    <span>✓</span>
                    Conceptos Compartidos
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Estas palabras/conceptos aparecen en las propuestas de múltiples partidos,
                    indicando áreas de convergencia:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory.commonWords.map((word) => (
                      <span
                        key={word}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full border border-green-200 dark:border-green-700"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Unique Words by Party - Distinctive Approaches */}
              {selectedCategory.topUniqueWordsByParty.size > 0 && (
                <div className="rounded-lg bg-orange-50 dark:bg-orange-900/10 p-4 border-l-4 border-orange-500">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2 flex items-center gap-2">
                    <span>⚡</span>
                    Enfoques Distintivos por Partido
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Conceptos únicos o poco comunes que diferencian la propuesta de cada partido:
                  </p>
                  <div className="space-y-3">
                    {Array.from(selectedCategory.topUniqueWordsByParty.entries())
                      .filter(([_, words]) => words.length > 0)
                      .slice(0, 6)
                      .map(([partyAbbr, words]) => (
                        <div key={partyAbbr} className="text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">
                            {partyAbbr}:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {words.map((word) => (
                              <span
                                key={word}
                                className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs rounded border border-orange-200 dark:border-orange-700"
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Methodology Note */}
              <div className="text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="font-semibold mb-1">Nota metodológica:</p>
                <p>
                  El porcentaje de acuerdo se calcula comparando la similitud del texto de las
                  propuestas entre todos los pares de partidos. Un porcentaje más alto indica que
                  los partidos usan vocabulario y conceptos similares al describir sus posiciones.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explanation Box */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-300">
          ℹ️ Cómo Interpretar Este Análisis
        </h4>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <li>
            • <strong>Alto Consenso (verde):</strong> Los partidos coinciden en enfoques y
            soluciones para esta área
          </li>
          <li>
            • <strong>Alta División (rojo):</strong> Los partidos tienen visiones muy diferentes
            sobre estos temas
          </li>
          <li>
            • El análisis se basa en similitud de texto entre propuestas, no en posiciones políticas
            declaradas
          </li>
          <li>
            • Útil para identificar áreas donde hay consenso nacional vs. temas más polarizantes
          </li>
        </ul>
      </div>
    </div>
  );
}
