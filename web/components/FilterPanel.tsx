// ABOUTME: Reusable filter panel container for organizing filters
// ABOUTME: Used on both home page and comparison page with configurable filter sets

'use client';

import type { Category, Party } from '@/lib/database';
import { BudgetTypeFilter } from './BudgetTypeFilter';
import { CategoryFilter } from './CategoryFilter';
import { IdeologyFilter } from './IdeologyFilter';
import { PartySelector } from './PartySelector';

interface FilterPanelProps {
  showPartySelector?: boolean;
  showCategoryFilter?: boolean;
  showIdeologyFilter?: boolean;
  showBudgetTypeFilter?: boolean;
  parties?: Party[];
  categories?: Category[];
}

export function FilterPanel({
  showPartySelector = false,
  showCategoryFilter = false,
  showIdeologyFilter = true,
  showBudgetTypeFilter = true,
  parties,
  categories,
}: FilterPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Filtros</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {showPartySelector && parties && (
          <div className="sm:col-span-2 lg:col-span-4">
            <PartySelector parties={parties} />
          </div>
        )}

        {showIdeologyFilter && <IdeologyFilter />}

        {showBudgetTypeFilter && <BudgetTypeFilter />}

        {showCategoryFilter && categories && <CategoryFilter categories={categories} />}
      </div>
    </div>
  );
}
