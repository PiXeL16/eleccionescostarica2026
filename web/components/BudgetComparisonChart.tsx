// ABOUTME: Interactive bar chart comparing budget allocations across parties
// ABOUTME: Visualizes budget data with tooltips and responsive design

'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { parseBudget } from '@/lib/budget-parser';
import type { Party, PartyPosition } from '@/lib/database';

interface BudgetComparisonChartProps {
  parties: Party[];
  positions: Map<string, Map<string, PartyPosition>>;
  categoryKey: string;
}

export default function BudgetComparisonChart({
  parties,
  positions,
  categoryKey,
}: BudgetComparisonChartProps) {
  const chartData = useMemo(() => {
    return parties
      .map((party) => {
        const position = positions.get(party.abbreviation)?.get(categoryKey);
        if (!position?.budget_mentioned) {
          return null;
        }

        const budget = parseBudget(position.budget_mentioned);
        if (budget.type === 'none') {
          return null;
        }

        return {
          party: party.abbreviation,
          budget: budget.numericValue || 0,
          budgetType: budget.type,
          raw: budget.raw,
          description: budget.description,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [parties, positions, categoryKey]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          No hay datos de presupuesto disponibles para esta categoría
        </p>
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
          <p className="font-semibold">{data.party}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{data.raw}</p>
          {data.description && <p className="mt-1 text-xs text-gray-500">{data.description}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Comparación de Presupuestos
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="party" className="text-sm text-gray-600 dark:text-gray-400" />
          <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="budget" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
