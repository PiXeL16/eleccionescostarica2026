// ABOUTME: Comparison page for side-by-side party platform comparison
// ABOUTME: Server component that loads all data and passes to client component

import { getAllParties, getAllCategories, compareParties } from '@/lib/database';
import { ComparisonView } from '@/components/ComparisonView';

export default function ComparePage() {
  const allParties = getAllParties();
  const allCategories = getAllCategories();

  // Pre-fetch comparison data for all parties (will be filtered client-side)
  const allSlugs = allParties.map((p) => p.abbreviation);
  const comparisonData = allSlugs.length > 0 ? compareParties(allSlugs) : null;

  return <ComparisonView allParties={allParties} allCategories={allCategories} comparisonData={comparisonData} />;
}
