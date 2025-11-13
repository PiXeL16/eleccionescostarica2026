// ABOUTME: Budget type filter dropdown for filtering by budget mention types
// ABOUTME: Updates URL search params to maintain filter state

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { BudgetType } from '@/lib/budget-parser';

const BUDGET_TYPE_OPTIONS: Array<{ value: BudgetType; label: string }> = [
  { value: 'all', label: 'Todos los tipos de presupuesto' },
  { value: 'pib_percentage', label: '% del PIB' },
  { value: 'amount_colones', label: 'Montos en Colones' },
  { value: 'amount_usd', label: 'Montos en USD' },
  { value: 'description', label: 'Descripciones' },
  { value: 'none', label: 'No especificado' },
];

export function BudgetTypeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBudgetType = (searchParams.get('budget_type') as BudgetType) || 'all';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all') {
      params.delete('budget_type');
    } else {
      params.set('budget_type', value);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="budget-type-filter"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Filtrar por tipo de presupuesto
      </label>
      <select
        id="budget-type-filter"
        value={currentBudgetType}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition hover:border-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600"
      >
        {BUDGET_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
