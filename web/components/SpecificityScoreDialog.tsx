// ABOUTME: Dialog component explaining specificity score details for a party
// ABOUTME: Shows breakdown of budget, timeline, and action scores with examples

'use client';

import type { SpecificityScore } from '@/lib/specificity-analyzer';

interface SpecificityScoreDialogProps {
  score: SpecificityScore | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SpecificityScoreDialog({
  score,
  isOpen,
  onClose,
}: SpecificityScoreDialogProps) {
  if (!isOpen || !score) return null;

  return (
    // biome-ignore lint/a11y/useSemanticElements: Modal backdrop overlay requires div with role=button for proper interaction
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
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
                {score.partyName} ({score.partyAbbr})
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Análisis de Especificidad de Propuestas
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
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
        <div className="p-6 space-y-6">
          {/* Total Score */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                Puntuación Total
              </span>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(score.totalScore)}/100
              </span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Desglose por Dimensión
            </h3>

            {/* Budget Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    💰 Transparencia Presupuestaria
                  </span>
                </div>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(score.budgetScore)}/100
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                Mide la presencia de números concretos, porcentajes, y montos específicos en las
                propuestas. Una puntuación alta indica que el partido proporciona detalles
                financieros claros.
              </p>
              {score.budgetScore > 50 ? (
                <p className="text-sm text-green-700 dark:text-green-300 ml-6 font-medium">
                  ✓ Las propuestas incluyen datos presupuestarios específicos
                </p>
              ) : (
                <p className="text-sm text-orange-700 dark:text-orange-300 ml-6 font-medium">
                  ⚠ Las propuestas carecen de detalles presupuestarios concretos
                </p>
              )}
            </div>

            {/* Timeline Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    📅 Especificidad de Cronograma
                  </span>
                </div>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(score.timelineScore)}/100
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                Evalúa la presencia de plazos, fechas específicas, y referencias temporales. Una
                puntuación alta indica compromiso con cronogramas claros de implementación.
              </p>
              {score.timelineScore > 50 ? (
                <p className="text-sm text-blue-700 dark:text-blue-300 ml-6 font-medium">
                  ✓ Las propuestas incluyen plazos y cronogramas definidos
                </p>
              ) : (
                <p className="text-sm text-orange-700 dark:text-orange-300 ml-6 font-medium">
                  ⚠ Las propuestas carecen de cronogramas específicos
                </p>
              )}
            </div>

            {/* Action Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ⚡ Lenguaje de Acción
                  </span>
                </div>
                <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(score.actionScore)}/100
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                Analiza el uso de verbos concretos de acción (implementaremos, crearemos) versus
                lenguaje aspiracional (buscaremos, intentaremos). Una puntuación alta indica
                compromisos firmes.
              </p>
              {score.actionScore > 50 ? (
                <p className="text-sm text-orange-700 dark:text-orange-300 ml-6 font-medium">
                  ✓ Las propuestas usan lenguaje de acción concreto y compromisos firmes
                </p>
              ) : (
                <p className="text-sm text-orange-700 dark:text-orange-300 ml-6 font-medium">
                  ⚠ Las propuestas usan lenguaje aspiracional o vago
                </p>
              )}
            </div>
          </div>

          {/* Examples Section */}
          {score.mostSpecific && score.mostSpecific.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📌 Propuestas Más Específicas
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Estos ejemplos provienen del análisis automático del plan de gobierno oficial.{' '}
                <a
                  href={`/partido/${score.partyAbbr.toLowerCase()}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Ver propuestas con referencias a páginas →
                </a>
              </p>
              {score.mostSpecific.slice(0, 3).map((example, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border-l-4 border-green-500"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                      Categoría: {example.category}
                    </p>
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                      {Math.round(example.score)}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
                    "
                    {example.text.length > 200
                      ? `${example.text.substring(0, 200)}...`
                      : example.text}
                    "
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    📄 Fuente: Sección "{example.category}" del plan de gobierno
                  </p>
                </div>
              ))}
            </div>
          )}

          {score.leastSpecific && score.leastSpecific.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📝 Propuestas Menos Específicas
              </h3>
              {score.leastSpecific.slice(0, 2).map((example, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 border-l-4 border-orange-500"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                      Categoría: {example.category}
                    </p>
                    <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded">
                      {Math.round(example.score)}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
                    "
                    {example.text.length > 200
                      ? `${example.text.substring(0, 200)}...`
                      : example.text}
                    "
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                    ⚠️ Esta propuesta podría beneficiarse de mayor detalle sobre cronogramas,
                    presupuestos o mecanismos de implementación.
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    📄 Fuente: Sección "{example.category}" del plan de gobierno
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Overall Assessment */}
          <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Evaluación General</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {score.totalScore >= 70
                ? `${score.partyName} presenta propuestas altamente específicas con detalles concretos sobre presupuestos, cronogramas y planes de implementación. Esto sugiere un alto nivel de preparación y compromiso con la transparencia.`
                : score.totalScore >= 40
                  ? `${score.partyName} presenta propuestas con un nivel moderado de especificidad. Algunas áreas incluyen detalles concretos, mientras que otras son más aspiracionales o generales.`
                  : `${score.partyName} presenta propuestas con bajo nivel de especificidad. La mayoría de las propuestas carecen de detalles concretos sobre presupuestos, cronogramas o planes de implementación específicos.`}
            </p>
          </div>

          {/* Detailed Methodology */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              📊 Cómo se Calcula la Puntuación
            </h3>

            <div className="space-y-4 text-sm">
              {/* Budget Methodology */}
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                  💰 Transparencia Presupuestaria ({Math.round(score.budgetScore)}/100)
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Se buscan indicadores de transparencia financiera:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>
                    • <strong>Números y porcentajes</strong> (ej: "50%", "1,000", "25.5")
                  </li>
                  <li>
                    • <strong>Referencias monetarias</strong> (ej: "$100 millones", "2,000 colones")
                  </li>
                  <li>
                    • <strong>Fórmula:</strong> (números × 10 + montos × 20) / palabras totales ×
                    100
                  </li>
                </ul>
              </div>

              {/* Timeline Methodology */}
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  📅 Especificidad de Cronograma ({Math.round(score.timelineScore)}/100)
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Se detectan referencias temporales específicas:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>
                    • <strong>Plazos generales</strong> (ej: "3 años", "6 meses", "primer año")
                  </li>
                  <li>
                    • <strong>Fechas específicas</strong> (ej: "2026", "2027", "segundo año") -
                    valen el doble
                  </li>
                  <li>
                    • <strong>Fórmula:</strong> (plazos × 10 + fechas × 20) / palabras totales × 100
                  </li>
                </ul>
              </div>

              {/* Action Methodology */}
              <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
                  ⚡ Lenguaje de Acción ({Math.round(score.actionScore)}/100)
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Se evalúa el compromiso versus aspiración:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>
                    • <strong>✓ Verbos concretos</strong> (ej: "implementaremos", "crearemos",
                    "estableceremos") +15 pts c/u
                  </li>
                  <li>
                    • <strong>✗ Lenguaje vago</strong> (ej: "buscaremos", "intentaremos",
                    "promoveremos") -5 pts c/u
                  </li>
                  <li>
                    • <strong>+ Mecanismos</strong> (ej: "mediante", "a través de") +10 pts c/u
                  </li>
                  <li>
                    • <strong>Fórmula:</strong> (concretos × 15 + mecanismos × 10 - vagos × 5) /
                    palabras × 100
                  </li>
                </ul>
              </div>

              {/* Total Score Formula */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  🧮 Puntuación Total
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  La puntuación final es un promedio ponderado que refleja la importancia relativa
                  de cada dimensión:
                </p>
                <div className="bg-white dark:bg-gray-900 p-3 rounded font-mono text-sm text-gray-700 dark:text-gray-300">
                  Total = (Presupuesto × 30%) + (Cronograma × 30%) + (Acción × 40%)
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  = ({Math.round(score.budgetScore)} × 0.30) + ({Math.round(score.timelineScore)} ×
                  0.30) + ({Math.round(score.actionScore)} × 0.40) ={' '}
                  <strong>{Math.round(score.totalScore)}/100</strong>
                </p>
              </div>

              {/* Analysis Coverage */}
              <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  📄 Alcance del Análisis
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Esta puntuación se calculó analizando <strong>todas las categorías</strong> del
                  plan de gobierno de {score.partyName}, incluyendo los resúmenes y propuestas
                  específicas de cada sección. El análisis es completamente automático y objetivo,
                  basado en patrones lingüísticos detectables en el texto.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
