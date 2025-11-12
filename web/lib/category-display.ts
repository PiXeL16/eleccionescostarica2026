// ABOUTME: Category display name overrides for visual presentation
// ABOUTME: Maps database category names to user-facing display names

/**
 * Override certain category names for display purposes
 * without modifying the database
 */
export function getCategoryDisplayName(categoryName: string): string {
  const overrides: Record<string, string> = {
    'Ambiente y Liderazgo Verde': 'Ambiente',
  };

  return overrides[categoryName] || categoryName;
}
