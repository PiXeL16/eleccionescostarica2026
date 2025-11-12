// ABOUTME: Color scheme definitions for political proposal categories
// ABOUTME: Provides consistent Tailwind color classes for visual coding across the UI

export interface CategoryColorScheme {
  bg: string;
  text: string;
  border: string;
  hover: string;
  light: string;
  ring: string;
  hex: string; // Hex color for charts
}

/**
 * Color scheme for each category, using semantically meaningful colors
 */
export const categoryColors: Record<string, CategoryColorScheme> = {
  economia: {
    bg: 'bg-emerald-600',
    text: 'text-white',
    border: 'border-emerald-700',
    hover: 'hover:bg-emerald-700',
    light: 'bg-emerald-100 dark:bg-emerald-900/20',
    ring: 'ring-emerald-500',
    hex: '#059669',
  },
  impuestos: {
    bg: 'bg-amber-600',
    text: 'text-white',
    border: 'border-amber-700',
    hover: 'hover:bg-amber-700',
    light: 'bg-amber-100 dark:bg-amber-900/20',
    ring: 'ring-amber-500',
    hex: '#d97706',
  },
  salud: {
    bg: 'bg-rose-600',
    text: 'text-white',
    border: 'border-rose-700',
    hover: 'hover:bg-rose-700',
    light: 'bg-rose-100 dark:bg-rose-900/20',
    ring: 'ring-rose-500',
    hex: '#e11d48',
  },
  educacion: {
    bg: 'bg-sky-600',
    text: 'text-white',
    border: 'border-sky-700',
    hover: 'hover:bg-sky-700',
    light: 'bg-sky-100 dark:bg-sky-900/20',
    ring: 'ring-sky-500',
    hex: '#0284c7',
  },
  seguridad: {
    bg: 'bg-slate-700',
    text: 'text-white',
    border: 'border-slate-800',
    hover: 'hover:bg-slate-800',
    light: 'bg-slate-100 dark:bg-slate-900/20',
    ring: 'ring-slate-500',
    hex: '#334155',
  },
  medio_ambiente: {
    bg: 'bg-lime-600',
    text: 'text-white',
    border: 'border-lime-700',
    hover: 'hover:bg-lime-700',
    light: 'bg-lime-100 dark:bg-lime-900/20',
    ring: 'ring-lime-500',
    hex: '#65a30d',
  },
  politica_social: {
    bg: 'bg-violet-600',
    text: 'text-white',
    border: 'border-violet-700',
    hover: 'hover:bg-violet-700',
    light: 'bg-violet-100 dark:bg-violet-900/20',
    ring: 'ring-violet-500',
    hex: '#7c3aed',
  },
  infraestructura: {
    bg: 'bg-orange-600',
    text: 'text-white',
    border: 'border-orange-700',
    hover: 'hover:bg-orange-700',
    light: 'bg-orange-100 dark:bg-orange-900/20',
    ring: 'ring-orange-500',
    hex: '#ea580c',
  },
  politica_exterior: {
    bg: 'bg-indigo-600',
    text: 'text-white',
    border: 'border-indigo-700',
    hover: 'hover:bg-indigo-700',
    light: 'bg-indigo-100 dark:bg-indigo-900/20',
    ring: 'ring-indigo-500',
    hex: '#4f46e5',
  },
  reforma_institucional: {
    bg: 'bg-teal-600',
    text: 'text-white',
    border: 'border-teal-700',
    hover: 'hover:bg-teal-700',
    light: 'bg-teal-100 dark:bg-teal-900/20',
    ring: 'ring-teal-500',
    hex: '#0d9488',
  },
  cultura_deporte: {
    bg: 'bg-fuchsia-600',
    text: 'text-white',
    border: 'border-fuchsia-700',
    hover: 'hover:bg-fuchsia-700',
    light: 'bg-fuchsia-100 dark:bg-fuchsia-900/20',
    ring: 'ring-fuchsia-500',
    hex: '#c026d3',
  },
  tecnologia: {
    bg: 'bg-cyan-600',
    text: 'text-white',
    border: 'border-cyan-700',
    hover: 'hover:bg-cyan-700',
    light: 'bg-cyan-100 dark:bg-cyan-900/20',
    ring: 'ring-cyan-500',
    hex: '#0891b2',
  },
  ambiente: {
    bg: 'bg-green-600',
    text: 'text-white',
    border: 'border-green-700',
    hover: 'hover:bg-green-700',
    light: 'bg-green-100 dark:bg-green-900/20',
    ring: 'ring-green-500',
    hex: '#16a34a',
  },
};

/**
 * Get color scheme for a category, with fallback to neutral colors
 */
export function getCategoryColors(categoryKey: string): CategoryColorScheme {
  return (
    categoryColors[categoryKey] || {
      bg: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-700',
      light: 'bg-gray-100 dark:bg-gray-900/20',
      ring: 'ring-gray-500',
      hex: '#4b5563',
    }
  );
}

/**
 * Get just the background color class for a category
 */
export function getCategoryBgColor(categoryKey: string): string {
  return getCategoryColors(categoryKey).bg;
}

/**
 * Get the light background color for subtle highlighting
 */
export function getCategoryLightBg(categoryKey: string): string {
  return getCategoryColors(categoryKey).light;
}
