// ABOUTME: Multi-party comparison chart showing proposal counts per category
// ABOUTME: Grouped bar chart comparing how many proposals each party has in each category

'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getCategoryDisplayName } from '@/lib/category-display';
import type { Category, Party, PartyPosition } from '@/lib/database';
import { getPartyColor } from '@/lib/party-colors';

interface ProposalCountComparisonProps {
  parties: Party[];
  positions: Map<string, Map<string, PartyPosition>>;
  categories: Category[];
}

export default function ProposalCountComparison({
  parties,
  positions,
  categories,
}: ProposalCountComparisonProps) {
  const chartData = useMemo(() => {
    // Create a map of category -> party -> count
    const categoryMap = new Map<
      string,
      { categoryName: string; categoryKey: string; [partyAbbr: string]: string | number }
    >();

    // Initialize all categories
    categories.forEach((cat: Category) => {
      categoryMap.set(cat.category_key, {
        categoryName: getCategoryDisplayName(cat.name),
        categoryKey: cat.category_key,
      });
    });

    // Count proposals for each party in each category
    // positions is a Map<partyAbbr, Map<categoryKey, position>>
    positions.forEach((partyPositions: Map<string, PartyPosition>, partyAbbr: string) => {
      partyPositions.forEach((pos: PartyPosition, categoryKey: string) => {
        let proposals = [];
        if (pos.key_proposals) {
          try {
            proposals = JSON.parse(pos.key_proposals);
          } catch (error) {
            console.error(
              `Failed to parse key_proposals for ${partyAbbr} in ${categoryKey}:`,
              error
            );
            proposals = [];
          }
        }
        const count = proposals.length;

        if (count > 0) {
          const categoryData = categoryMap.get(categoryKey);
          if (categoryData) {
            categoryData[partyAbbr] = count;
          }
        }
      });
    });

    // Convert to array and sort by total proposals across all parties
    return Array.from(categoryMap.values())
      .map((cat) => {
        // Calculate total for sorting
        const total = parties.reduce((sum: number, party: Party) => {
          return sum + (Number(cat[party.abbreviation]) || 0);
        }, 0);
        return { ...cat, total };
      })
      .filter((cat) => cat.total > 0)
      .sort((a, b) => b.total - a.total)
      .map(({ total, ...cat }) => cat); // Remove total from final data
  }, [parties, positions, categories]);

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
              <span style={{ color: entry.fill }}>●</span> {entry.name}: {entry.value} propuestas
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Comparación de Propuestas por Categoría
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(400, chartData.length * 50)}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis type="number" className="text-sm text-gray-600 dark:text-gray-400" />
          <YAxis
            dataKey="categoryName"
            type="category"
            width={150}
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {parties.map((party: Party) => (
            <Bar
              key={party.abbreviation}
              dataKey={party.abbreviation}
              name={party.abbreviation}
              fill={getPartyColor(party.abbreviation)}
              radius={[0, 4, 4, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
