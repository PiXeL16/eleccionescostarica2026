// ABOUTME: Radar chart showing how comprehensively each party covers different categories
// ABOUTME: Helps visualize which parties have more detailed positions across topics

'use client';

import { useMemo } from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { Category, Party, PartyPosition } from '@/lib/database';

interface CategoryCoverageChartProps {
  parties: Party[];
  categories: Category[];
  positions: Map<string, Map<string, PartyPosition>>;
}

/**
 * Calculate coverage score based on summary length and number of proposals
 */
function calculateCoverageScore(position: PartyPosition | undefined): number {
  if (!position) return 0;

  const summaryLength = position.summary?.length || 0;
  const proposals = JSON.parse(position.key_proposals || '[]') as string[];
  const proposalCount = proposals.length;

  // Normalize: 200 chars = 50 points, each proposal = 10 points
  const summaryScore = Math.min(50, (summaryLength / 200) * 50);
  const proposalScore = Math.min(50, proposalCount * 10);

  return Math.round(summaryScore + proposalScore);
}

export default function CategoryCoverageChart({
  parties,
  categories,
  positions,
}: CategoryCoverageChartProps) {
  const chartData = useMemo(() => {
    return categories.slice(0, 8).map((category) => {
      const dataPoint: Record<string, string | number> = {
        category: category.name.split(' ')[0], // Use first word for compactness
        fullName: category.name,
      };

      for (const party of parties) {
        const position = positions.get(party.abbreviation)?.get(category.category_key);
        dataPoint[party.abbreviation] = calculateCoverageScore(position);
      }

      return dataPoint;
    });
  }, [parties, categories, positions]);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Cobertura de Propuestas por Categoría
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid className="stroke-gray-200 dark:stroke-gray-700" />
          <PolarAngleAxis dataKey="category" className="text-sm text-gray-600 dark:text-gray-400" />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            className="text-xs text-gray-500 dark:text-gray-500"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          />
          {parties.map((party, index) => (
            <Radar
              key={party.abbreviation}
              name={party.abbreviation}
              dataKey={party.abbreviation}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.3}
            />
          ))}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
