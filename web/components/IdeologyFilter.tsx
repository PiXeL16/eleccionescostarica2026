// ABOUTME: Ideology filter dropdown component for filtering parties and positions
// ABOUTME: Updates URL search params to maintain filter state

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const IDEOLOGY_OPTIONS = [
  { value: 'all', label: 'Todas las ideologías' },
  { value: 'conservador', label: 'Conservador' },
  { value: 'centrista', label: 'Centrista' },
  { value: 'progresista', label: 'Progresista' },
  { value: 'No especificado', label: 'No especificado' },
] as const;

export function IdeologyFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentIdeology = searchParams.get('ideology') || 'all';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all') {
      params.delete('ideology');
    } else {
      params.set('ideology', value);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="ideology-filter"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Filtrar por ideología
      </label>
      <select
        id="ideology-filter"
        value={currentIdeology}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 transition hover:border-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600"
      >
        {IDEOLOGY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
