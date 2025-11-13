// ABOUTME: Category filter dropdown for comparison page
// ABOUTME: Client-side component for filtering comparison by category

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { getCategoryDisplayName } from '@/lib/category-display';
import type { Category } from '@/lib/database';

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';

  const handleChange = (categoryKey: string) => {
    const params = new URLSearchParams(searchParams);

    if (categoryKey === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryKey);
    }

    router.push(`/comparar?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="category-filter"
        className="text-sm font-medium text-gray-700 dark:text-gray-400"
      >
        Categoría:
      </label>
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
      >
        <option value="all">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.category_key}>
            {getCategoryDisplayName(cat.name)}
          </option>
        ))}
      </select>
    </div>
  );
}
