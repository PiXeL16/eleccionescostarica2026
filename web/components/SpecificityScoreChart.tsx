// ABOUTME: Bar chart comparing party proposal specificity scores
// ABOUTME: Shows budget transparency, timeline, and action language scores

'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getPartyColor } from '@/lib/party-colors';
import { getPartyFlagPath } from '@/lib/party-images';
import type { SpecificityScore } from '@/lib/specificity-analyzer';
import SpecificityScoreDialog from './SpecificityScoreDialog';

interface SpecificityScoreChartProps {
  scores: SpecificityScore[];
  mode?: 'total' | 'breakdown';
}

// Custom Y-axis tick component with party flag (or colored square as fallback)
const CustomYAxisTick = ({
  x,
  y,
  payload,
  chartData,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  chartData?: Array<{ party: string; color: string }>;
}) => {
  if (!x || !y || !payload) return null;
  const partyAbbr = payload.value;
  const flagPath = getPartyFlagPath(partyAbbr);
  const partyColor =
    chartData?.find((d) => d.party === partyAbbr)?.color || getPartyColor(partyAbbr);

  return (
    <g transform={`translate(${x},${y})`}>
      <image
        x={-60}
        y={-12}
        width={24}
        height={24}
        href={flagPath}
        style={{ borderRadius: '4px' }}
        onError={(e) => {
          // Fallback to colored square if flag fails to load
          const target = e.currentTarget;
          target.style.display = 'none';
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', '-60');
          rect.setAttribute('y', '-12');
          rect.setAttribute('width', '24');
          rect.setAttribute('height', '24');
          rect.setAttribute('rx', '4');
          rect.setAttribute('fill', partyColor);
          target.parentNode?.insertBefore(rect, target);
        }}
      />
      <text
        x={-30}
        y={0}
        dy={4}
        textAnchor="start"
        fill="currentColor"
        className="text-sm text-gray-600 dark:text-gray-400"
      >
        {partyAbbr}
      </text>
    </g>
  );
};

export default function SpecificityScoreChart({
  scores,
  mode = 'total',
}: SpecificityScoreChartProps) {
  const [selectedScore, setSelectedScore] = useState<SpecificityScore | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const chartData = useMemo(() => {
    return scores
      .map((score) => ({
        party: score.partyAbbr,
        total: Math.round(score.totalScore),
        presupuesto: Math.round(score.budgetScore),
        cronograma: Math.round(score.timelineScore),
        accion: Math.round(score.actionScore),
        color: getPartyColor(score.partyAbbr),
      }))
      .sort((a, b) => b.total - a.total);
  }, [scores]);

  const handleBarClick = (data: unknown) => {
    // Recharts Bar click handler provides data with different structure
    const barData = data as { party?: string };
    if (!barData?.party) return;
    const score = scores.find((s) => s.partyAbbr === barData.party);
    if (score) {
      setSelectedScore(score);
      setIsDialogOpen(true);
    }
  };

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          No hay datos de especificidad disponibles
        </p>
      </div>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; fill: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry) => (
            <p key={entry.name} className="text-sm text-gray-600 dark:text-gray-400">
              {entry.name === 'total' && '📊 Puntuación Total: '}
              {entry.name === 'presupuesto' && '💰 Transparencia Presupuestaria: '}
              {entry.name === 'cronograma' && '📅 Especificidad de Cronograma: '}
              {entry.name === 'accion' && '⚡ Lenguaje de Acción: '}
              {entry.value}/100
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (mode === 'total') {
    return (
      <>
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Puntuación de Especificidad Total
          </h3>
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
              👆 Haz clic en cualquier barra para entender este score
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Verás el desglose completo, la metodología de cálculo y referencias a las propuestas
              originales
            </p>
          </div>
          <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 40)}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                className="text-sm text-gray-600 dark:text-gray-400"
              />
              <YAxis
                dataKey="party"
                type="category"
                width={100}
                tick={<CustomYAxisTick chartData={chartData} />}
                className="text-sm text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total"
                name="Puntuación Total"
                radius={[0, 8, 8, 0]}
                onClick={handleBarClick}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <SpecificityScoreDialog
          score={selectedScore}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </>
    );
  }

  // Breakdown mode
  return (
    <>
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Desglose de Especificidad por Dimensión
        </h3>
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
            👆 Haz clic en cualquier barra para entender este score
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Verás el desglose completo, la metodología de cálculo y referencias a las propuestas
            originales
          </p>
        </div>
        <div className="mb-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded"
              style={{ backgroundColor: '#10b981' }}
            ></span>
            <span className="font-semibold">Presupuesto:</span> Presencia de números, porcentajes,
            montos
          </p>
          <p className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded"
              style={{ backgroundColor: '#3b82f6' }}
            ></span>
            <span className="font-semibold">Cronograma:</span> Menciones de plazos y fechas
            específicas
          </p>
          <p className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded"
              style={{ backgroundColor: '#f59e0b' }}
            ></span>
            <span className="font-semibold">Acción:</span> Verbos concretos vs. lenguaje vago
          </p>
        </div>
        <ResponsiveContainer width="100%" height={Math.max(400, chartData.length * 50)}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              type="number"
              domain={[0, 100]}
              className="text-sm text-gray-600 dark:text-gray-400"
            />
            <YAxis
              dataKey="party"
              type="category"
              width={100}
              tick={<CustomYAxisTick chartData={chartData} />}
              className="text-sm text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="square" />
            <Bar
              dataKey="presupuesto"
              name="💰 Presupuesto"
              fill="#10b981"
              radius={[0, 4, 4, 0]}
              onClick={handleBarClick}
              cursor="pointer"
            />
            <Bar
              dataKey="cronograma"
              name="📅 Cronograma"
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              onClick={handleBarClick}
              cursor="pointer"
            />
            <Bar
              dataKey="accion"
              name="⚡ Acción"
              fill="#f59e0b"
              radius={[0, 4, 4, 0]}
              onClick={handleBarClick}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Explanation */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-300">
            ℹ️ Cómo interpretar estas puntuaciones
          </h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>
              • <strong>Mayor puntuación</strong> indica propuestas más concretas con detalles
              específicos
            </li>
            <li>
              • <strong>Menor puntuación</strong> sugiere lenguaje más aspiracional o vago
            </li>
            <li>
              • Los partidos con altas puntuaciones tienden a incluir presupuestos, plazos y planes
              de implementación
            </li>
          </ul>
        </div>
      </div>

      <SpecificityScoreDialog
        score={selectedScore}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
