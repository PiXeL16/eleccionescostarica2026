// ABOUTME: Statistics panel for party comparison with visualizations
// ABOUTME: Shows ideology distribution, budget analysis, and position agreement metrics

'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { parseBudget } from '@/lib/budget-parser';
import type { Category, Party, PartyPosition } from '@/lib/database';

interface ComparisonStatsProps {
  parties: Party[];
  categories: Category[];
  positions: Map<string, Map<string, PartyPosition>>;
}

// Chart colors for parties and categories
const CHART_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
];

const IDEOLOGY_COLORS: Record<string, string> = {
  conservador: '#EF4444',
  centrista: '#F59E0B',
  progresista: '#10B981',
  'No especificado': '#9CA3AF',
};

export function ComparisonStats({ parties, categories, positions }: ComparisonStatsProps) {
  // Calculate ideology distribution
  const ideologyData = useMemo(() => {
    const counts: Record<string, number> = {};

    parties.forEach((party) => {
      const partyPositions = positions.get(party.abbreviation);
      if (!partyPositions) return;

      partyPositions.forEach((position) => {
        const ideology = position.ideology_position || 'No especificado';
        counts[ideology] = (counts[ideology] || 0) + 1;
      });
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: IDEOLOGY_COLORS[name] || '#9CA3AF',
    }));
  }, [parties, positions]);

  // Calculate budget type distribution
  const budgetTypeData = useMemo(() => {
    const counts: Record<string, number> = {
      'PIB %': 0,
      Colones: 0,
      USD: 0,
      Descripción: 0,
      'No especificado': 0,
    };

    parties.forEach((party) => {
      const partyPositions = positions.get(party.abbreviation);
      if (!partyPositions) return;

      partyPositions.forEach((position) => {
        const parsed = parseBudget(position.budget_mentioned);

        switch (parsed.type) {
          case 'pib_percentage':
            counts['PIB %']++;
            break;
          case 'amount_colones':
            counts.Colones++;
            break;
          case 'amount_usd':
            counts.USD++;
            break;
          case 'description':
            counts.Descripción++;
            break;
          case 'none':
            counts['No especificado']++;
            break;
        }
      });
    });

    return Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [parties, positions]);

  // Calculate category coverage (how many parties have positions in each category)
  const categoryCoverageData = useMemo(() => {
    return categories.map((category) => {
      const data: Record<string, string | number> = { category: category.name };

      parties.forEach((party) => {
        const position = positions.get(party.abbreviation)?.get(category.category_key);
        data[party.abbreviation] = position ? 1 : 0;
      });

      return data;
    });
  }, [parties, categories, positions]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    let totalPositions = 0;
    let withIdeology = 0;
    let withBudget = 0;

    parties.forEach((party) => {
      const partyPositions = positions.get(party.abbreviation);
      if (!partyPositions) return;

      partyPositions.forEach((position) => {
        totalPositions++;
        if (position.ideology_position && position.ideology_position !== 'No especificado') {
          withIdeology++;
        }
        if (position.budget_mentioned && position.budget_mentioned !== 'No especificado') {
          withBudget++;
        }
      });
    });

    return {
      totalPositions,
      withIdeology,
      withBudget,
      ideologyPercentage:
        totalPositions > 0 ? Math.round((withIdeology / totalPositions) * 100) : 0,
      budgetPercentage: totalPositions > 0 ? Math.round((withBudget / totalPositions) * 100) : 0,
    };
  }, [parties, positions]);

  if (parties.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
        Estadísticas de Comparación
      </h2>

      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-600 dark:text-blue-400">Total de Posiciones</p>
            <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalPositions}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-green-600 dark:text-green-400">Con Ideología</p>
            <p className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">
              {stats.ideologyPercentage}%
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <p className="text-sm text-amber-600 dark:text-amber-400">Con Presupuesto</p>
            <p className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-100">
              {stats.budgetPercentage}%
            </p>
          </div>

          <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
            <p className="text-sm text-purple-600 dark:text-purple-400">Categorías</p>
            <p className="mt-1 text-2xl font-bold text-purple-900 dark:text-purple-100">
              {categories.length}
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Ideology Distribution */}
          {ideologyData.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Distribución Ideológica
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={ideologyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ideologyData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Budget Type Distribution */}
          {budgetTypeData.length > 0 && (
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Menciones de Presupuesto
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={budgetTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category Coverage Heatmap */}
        {categoryCoverageData.length > 0 && parties.length > 1 && (
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Cobertura por Categoría
            </h3>
            <ResponsiveContainer width="100%" height={Math.max(300, categories.length * 30)}>
              <BarChart data={categoryCoverageData} layout="horizontal" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, parties.length]} />
                <YAxis type="category" dataKey="category" width={90} />
                <Tooltip />
                <Legend />
                {parties.map((party, index) => (
                  <Bar
                    key={party.id}
                    dataKey={party.abbreviation}
                    stackId="a"
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
