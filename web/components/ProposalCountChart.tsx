// ABOUTME: Horizontal bar chart showing number of proposals per category for a party
// ABOUTME: Helps visualize where each party focuses their policy attention

'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getCategoryColors } from '@/lib/category-colors';
import type { PartyPosition } from '@/lib/database';

interface ProposalCountChartProps {
  positions: (PartyPosition & { category: { category_key: string; name: string } })[];
}

export default function ProposalCountChart({ positions }: ProposalCountChartProps) {
  const chartData = useMemo(() => {
    return positions
      .map((pos) => {
        const proposals = JSON.parse(pos.key_proposals || '[]') as string[];
        return {
          category: pos.category.name.split(' ').slice(0, 2).join(' '), // Shorten name
          fullCategory: pos.category.name,
          categoryKey: pos.category.category_key,
          count: proposals.length,
        };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [positions]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">No hay datos de propuestas disponibles</p>
      </div>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: (typeof chartData)[0] }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <p className="font-semibold text-gray-900 dark:text-white">{data.fullCategory}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{data.count} propuestas</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Propuestas por Categoría
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 40)}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis type="number" className="text-sm text-gray-600 dark:text-gray-400" />
          <YAxis
            dataKey="category"
            type="category"
            width={120}
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {chartData.map((entry) => {
              const colors = getCategoryColors(entry.categoryKey);
              return <Cell key={`cell-${entry.categoryKey}`} fill={colors.hex} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
