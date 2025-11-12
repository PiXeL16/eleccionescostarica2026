# Future Improvements

This document tracks features and improvements that have been developed but require additional data or refinement before being added to production.

## Filtering System (Removed - Pending Data)

**Status**: Temporarily removed from home page
**Reason**: Insufficient data coverage across all parties
**Date Removed**: November 2025

### Feature Description

Party filtering system that allows users to filter the party list on the home page by:

- **Ideology Filter**: Filter parties by ideological position (conservador, centrista, progresista)
- **Budget Type Filter**: Filter parties by how they specify budget allocations (PIB %, amounts in colones, amounts in USD, descriptions)

### Components Developed

The following components were built and tested:

- `components/HomeFilteredView.tsx` - Main filtering view for home page
- `components/FilterPanel.tsx` - Reusable filter panel component
- `components/IdeologyFilter.tsx` - Ideology dropdown filter
- `components/BudgetTypeFilter.tsx` - Budget type dropdown filter

### Implementation Status

- ✅ UI components fully implemented
- ✅ Filter logic working correctly
- ✅ URL state management (search params) implemented
- ❌ Insufficient data across all parties
- ❌ Some parties missing ideology classifications
- ❌ Inconsistent budget mention formats

### Requirements for Re-enabling

Before adding these filters back:

1. **Data Completeness**: Ensure at least 80% of parties have:
   - Clear ideology position classification
   - Consistent budget mention format across all categories

2. **Data Quality**:
   - Review and standardize ideology classifications
   - Normalize budget mention formats
   - Fill in missing data where possible

3. **User Testing**:
   - Test filter combinations with complete data
   - Verify no empty states or confusing results
   - Ensure filters provide meaningful segmentation

### Technical Notes

The filter system uses URL search parameters to maintain state:
- `?ideology=conservador|centrista|progresista|all`
- `?budget_type=pib_percentage|amount_colones|amount_usd|description|none|all`

Filters can be combined, and the party count updates dynamically to show "X de Y partidos" when filters are active.

### Related Files

- `/web/components/HomeFilteredView.tsx` (kept for future use)
- `/web/components/FilterPanel.tsx` (kept for future use)
- `/web/components/IdeologyFilter.tsx` (in use on comparison page)
- `/web/components/BudgetTypeFilter.tsx` (in use on comparison page)
- `/web/lib/budget-parser.ts` (parsing logic)

---

## Other Potential Improvements

### Search Functionality
- Full-text search across all party positions
- Search by keyword to find which parties mention specific topics
- "Find my party" quiz based on policy preferences

### Advanced Comparisons
- Similarity analysis between parties
- Consensus indicators showing areas of agreement
- "Biggest differences" view highlighting divergences

### Enhanced Data Display
- Word clouds for each party's key themes
- Interactive charts and visualizations
- Timeline view for implementation schedules

### Social Features
- Share comparison as image for social media
- Export comparison as PDF
- Create shareable comparison URLs

See `IDEAS.md` for comprehensive feature backlog.
