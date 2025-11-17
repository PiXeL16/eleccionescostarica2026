// ABOUTME: Interactive 2D scatter plot showing party ideological positioning
// ABOUTME: Maps parties on economic (left-right) and social (conservative-progressive) axes

'use client';

import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import type { IdeologyScore } from '@/lib/ideology-analyzer';
import { getEconomicLabel, getSocialLabel } from '@/lib/ideology-analyzer';
import { getPartyColor } from '@/lib/party-colors';

interface IdeologySpectrumMapProps {
  scores: IdeologyScore[];
  width?: number;
  height?: number;
  onPartyClick?: (partyAbbreviation: string) => void;
}

export default function IdeologySpectrumMap({
  scores,
  height = 600,
  onPartyClick,
}: IdeologySpectrumMapProps) {
  const [selectedParty, setSelectedParty] = useState<string | null>(null);

  // Transform scores for chart data
  const chartData = useMemo(() => {
    return scores.map((score) => ({
      x: score.economicScore,
      y: score.socialScore,
      z: score.confidence * 100, // Size based on confidence
      name: score.partyAbbreviation,
      fullName: score.partyName,
      economicLabel: getEconomicLabel(score.economicScore),
      socialLabel: getSocialLabel(score.socialScore),
      reasoning: score.reasoning,
      confidence: score.confidence,
    }));
  }, [scores]);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: (typeof chartData)[number] }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm">
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{data.fullName}</h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Económico:</span> {data.economicLabel}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Social:</span> {data.socialLabel}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">
              Confianza: {Math.round(data.confidence * 100)}%
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-2 italic">{data.reasoning}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: { cx?: number; cy?: number; payload?: (typeof chartData)[number] }) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;
    const isSelected = selectedParty === payload.name;
    const color = getPartyColor(payload.name);

    return (
      <g>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: SVG circle in chart requires click interaction for party selection */}
        <circle
          cx={cx}
          cy={cy}
          r={isSelected ? 10 : 8}
          fill={color}
          stroke={isSelected ? '#000' : '#fff'}
          strokeWidth={isSelected ? 3 : 2}
          opacity={0.8}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSelectedParty(payload.name);
            onPartyClick?.(payload.name);
          }}
        />
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fill="currentColor"
          className="text-xs font-semibold"
          style={{ pointerEvents: 'none' }}
        >
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 60,
            left: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          {/* X Axis: Economic spectrum */}
          <XAxis type="number" dataKey="x" domain={[-1, 1]} tickCount={5} tick={{ fontSize: 12 }}>
            <Label
              value="Eje Económico"
              position="bottom"
              offset={40}
              style={{ fontSize: 14, fontWeight: 'bold' }}
            />
            <Label
              value="← Izquierda"
              position="insideBottomLeft"
              offset={20}
              style={{ fontSize: 11 }}
            />
            <Label
              value="Derecha →"
              position="insideBottomRight"
              offset={20}
              style={{ fontSize: 11 }}
            />
          </XAxis>

          {/* Y Axis: Social spectrum */}
          <YAxis type="number" dataKey="y" domain={[-1, 1]} tickCount={5} tick={{ fontSize: 12 }}>
            <Label
              value="Eje Social"
              angle={-90}
              position="left"
              offset={40}
              style={{ fontSize: 14, fontWeight: 'bold' }}
            />
            <Label
              value="↑ Progresista"
              angle={-90}
              position="insideTopLeft"
              offset={10}
              style={{ fontSize: 11 }}
            />
            <Label
              value="Conservador ↓"
              angle={-90}
              position="insideBottomLeft"
              offset={10}
              style={{ fontSize: 11 }}
            />
          </YAxis>

          {/* Center lines */}
          <ReferenceLine x={0} stroke="#666" strokeDasharray="3 3" />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />

          {/* Z Axis for confidence (affects dot size) */}
          <ZAxis type="number" dataKey="z" range={[50, 150]} />

          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

          <Scatter name="Partidos" data={chartData} shape={<CustomDot />} />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
          <p className="font-semibold text-blue-700 dark:text-blue-300">Superior Izquierda</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Izquierda económica
            <br />+ Progresista social
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
          <p className="font-semibold text-green-700 dark:text-green-300">Superior Derecha</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Derecha económica
            <br />+ Progresista social
          </p>
        </div>
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded">
          <p className="font-semibold text-red-700 dark:text-red-300">Inferior Izquierda</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Izquierda económica
            <br />+ Conservador social
          </p>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
          <p className="font-semibold text-purple-700 dark:text-purple-300">Inferior Derecha</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Derecha económica
            <br />+ Conservador social
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
          ℹ️ Cómo interpretar este mapa
        </h4>
        <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>
            • El <strong>eje horizontal (X)</strong> muestra la posición económica: izquierda (mayor
            intervención estatal) vs. derecha (libre mercado)
          </li>
          <li>
            • El <strong>eje vertical (Y)</strong> muestra la posición social: conservador (valores
            tradicionales) vs. progresista (cambio social)
          </li>
          <li>
            • El <strong>tamaño del punto</strong> indica la confianza del análisis (más datos =
            mayor precisión)
          </li>
          <li>• Haz clic en un punto para ver detalles del partido</li>
        </ul>
      </div>
    </div>
  );
}
