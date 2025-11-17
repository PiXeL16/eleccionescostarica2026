// ABOUTME: Demonstration page for all visual enhancements
// ABOUTME: Showcases word clouds, charts, animations, and color-coded categories

import AgreementHeatmap from '@/components/AgreementHeatmap';
import AnimatedSection from '@/components/AnimatedSection';
import IdeologySpectrumMap from '@/components/IdeologySpectrumMap';
import SpecificityScoreChart from '@/components/SpecificityScoreChart';
import { analyzeAgreement } from '@/lib/agreement-analyzer';
import { getAllPartiesWithPositions } from '@/lib/database';
import { calculateIdeologyScore } from '@/lib/ideology-analyzer';
import { calculateAllSpecificityScores } from '@/lib/specificity-analyzer';

export const metadata = {
  title: 'Visualizaciones | Elecciones 2026',
  description: 'Visualizaciones interactivas de las propuestas de los partidos políticos',
};

export default async function VisualizacionesPage() {
  // Calculate ideology scores for all parties
  const partiesWithPositions = getAllPartiesWithPositions();
  const ideologyScores = partiesWithPositions.map(({ party, positions }) =>
    calculateIdeologyScore(party.id, party.name, party.abbreviation, positions)
  );

  // Calculate specificity scores for all parties
  const specificityScores = calculateAllSpecificityScores(
    partiesWithPositions.map(({ party, positions }) => ({
      id: party.id,
      name: party.name,
      abbreviation: party.abbreviation,
      positions,
    }))
  );

  // Calculate agreement analysis for cross-party heatmap
  const agreementMatrix = analyzeAgreement(partiesWithPositions);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection>
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Visualizaciones Interactivas
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explora las propuestas de los partidos a través de gráficos y análisis visuales
            </p>
          </div>
        </AnimatedSection>

        {/* Ideology Spectrum Map */}
        <AnimatedSection delay={0.1}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Espectro Ideológico de los Partidos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Posicionamiento de los partidos en el eje económico (izquierda-derecha) y social
              (conservador-progresista) basado en análisis de sus propuestas
            </p>
            <IdeologySpectrumMap scores={ideologyScores} />
          </section>
        </AnimatedSection>

        {/* Cross-Party Agreement Heatmap */}
        <AnimatedSection delay={0.2}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Mapa de Acuerdo Entre Partidos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Identifica temas de consenso nacional vs. temas polarizantes. Basado en similitud de
              texto entre propuestas de los partidos.
            </p>
            <AgreementHeatmap
              categories={agreementMatrix.categories}
              overallConsensusScore={agreementMatrix.overallConsensusScore}
            />
          </section>
        </AnimatedSection>

        {/* Word Cloud - Temporarily disabled due to react-wordcloud library issue */}
        {/* <AnimatedSection delay={0.2}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Nube de Palabras - {firstParty.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Los términos más frecuentes en las propuestas del partido
            </p>
            <div className="flex justify-center">
              <PartyWordCloud
                positions={firstPartyPositions}
                maxWords={60}
                width={800}
                height={500}
              />
            </div>
          </section>
        </AnimatedSection> */}

        {/* Specificity Score - Total */}
        <AnimatedSection delay={0.3}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Puntuación de Especificidad
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Mide qué tan concretas son las propuestas: presupuestos, cronogramas y planes de
              implementación
            </p>
            <SpecificityScoreChart scores={specificityScores} mode="total" />

            {/* Calculation Explanation */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-lg">🧮</span>
                Cómo se Calcula la Puntuación
              </h4>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  El análisis automático examina <strong>todas las propuestas</strong> del plan de
                  gobierno de cada partido y asigna puntos basándose en:
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-gray-900 p-3 rounded border border-green-200 dark:border-green-800">
                    <div className="font-semibold text-green-700 dark:text-green-400 mb-1">
                      💰 Presupuesto (30%)
                    </div>
                    <div className="text-xs">Números, porcentajes, referencias monetarias</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded border border-blue-200 dark:border-blue-800">
                    <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                      📅 Cronograma (30%)
                    </div>
                    <div className="text-xs">Fechas específicas, plazos temporales</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded border border-orange-200 dark:border-orange-800">
                    <div className="font-semibold text-orange-700 dark:text-orange-400 mb-1">
                      ⚡ Acción (40%)
                    </div>
                    <div className="text-xs">Verbos concretos vs. lenguaje aspiracional</div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border-l-4 border-blue-500">
                  <p className="text-xs font-mono">
                    <strong>Fórmula:</strong> Total = (Presupuesto × 0.30) + (Cronograma × 0.30) +
                    (Acción × 0.40)
                  </p>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Specificity Score - Breakdown */}
        <AnimatedSection delay={0.4}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Desglose de Especificidad
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comparación detallada: transparencia presupuestaria, especificidad de cronograma y
              lenguaje de acción
            </p>
            <SpecificityScoreChart scores={specificityScores} mode="breakdown" />

            {/* Detailed Calculation Explanation */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-lg">📐</span>
                Metodología de Cálculo por Dimensión
              </h4>
              <div className="space-y-4 text-sm">
                <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded border-l-4 border-green-500">
                  <div className="font-semibold text-green-900 dark:text-green-300 mb-2">
                    💰 Transparencia Presupuestaria
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                    Se buscan indicadores cuantitativos en el texto de las propuestas:
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-3">
                    <li>• Números y porcentajes → +10 puntos cada uno</li>
                    <li>• Referencias monetarias → +20 puntos cada una</li>
                    <li>
                      • <strong>Fórmula:</strong> (números × 10 + montos × 20) / palabras totales ×
                      100
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded border-l-4 border-blue-500">
                  <div className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    📅 Especificidad de Cronograma
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                    Se detectan referencias temporales concretas:
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-3">
                    <li>• Plazos generales (años, meses) → +10 puntos cada uno</li>
                    <li>• Fechas específicas (2026, 2027) → +20 puntos cada una</li>
                    <li>
                      • <strong>Fórmula:</strong> (plazos × 10 + fechas × 20) / palabras totales ×
                      100
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded border-l-4 border-orange-500">
                  <div className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
                    ⚡ Lenguaje de Acción
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                    Se evalúa el nivel de compromiso en el lenguaje:
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-3">
                    <li>• Verbos concretos (implementaremos, crearemos) → +15 puntos</li>
                    <li>• Lenguaje vago (buscaremos, intentaremos) → -5 puntos</li>
                    <li>• Mecanismos (mediante, a través de) → +10 puntos</li>
                    <li>
                      • <strong>Fórmula:</strong> (concretos × 15 + mecanismos × 10 - vagos × 5) /
                      palabras × 100
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
}
