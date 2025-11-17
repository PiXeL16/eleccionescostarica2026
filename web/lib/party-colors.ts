// ABOUTME: Party color configuration for visual branding
// ABOUTME: Provides color palettes and badge colors for all 20 parties

export interface PartyColors {
  bg: string;
  text: string;
  border: string;
  hover: string;
}

// Color palette for each party (generated based on common Costa Rican party colors)
export const PARTY_COLORS: Record<string, PartyColors> = {
  PLN: {
    bg: 'bg-green-600',
    text: 'text-white',
    border: 'border-green-700',
    hover: 'hover:bg-green-700',
  },
  PUSC: {
    bg: 'bg-blue-600',
    text: 'text-white',
    border: 'border-blue-700',
    hover: 'hover:bg-blue-700',
  },
  FA: {
    bg: 'bg-red-600',
    text: 'text-white',
    border: 'border-red-700',
    hover: 'hover:bg-red-700',
  },
  PAC: {
    bg: 'bg-yellow-500',
    text: 'text-black',
    border: 'border-yellow-600',
    hover: 'hover:bg-yellow-600',
  },
  ACRM: {
    bg: 'bg-purple-600',
    text: 'text-white',
    border: 'border-purple-700',
    hover: 'hover:bg-purple-700',
  },
  CAC: {
    bg: 'bg-indigo-600',
    text: 'text-white',
    border: 'border-indigo-700',
    hover: 'hover:bg-indigo-700',
  },
  CDS: {
    bg: 'bg-teal-600',
    text: 'text-white',
    border: 'border-teal-700',
    hover: 'hover:bg-teal-700',
  },
  CR1: {
    bg: 'bg-orange-600',
    text: 'text-white',
    border: 'border-orange-700',
    hover: 'hover:bg-orange-700',
  },
  PA: {
    bg: 'bg-pink-600',
    text: 'text-white',
    border: 'border-pink-700',
    hover: 'hover:bg-pink-700',
  },
  PDLCT: {
    bg: 'bg-rose-600',
    text: 'text-white',
    border: 'border-rose-700',
    hover: 'hover:bg-rose-700',
  },
  PEL: {
    bg: 'bg-cyan-600',
    text: 'text-white',
    border: 'border-cyan-700',
    hover: 'hover:bg-cyan-700',
  },
  PEN: {
    bg: 'bg-amber-600',
    text: 'text-white',
    border: 'border-amber-700',
    hover: 'hover:bg-amber-700',
  },
  PIN: {
    bg: 'bg-lime-600',
    text: 'text-black',
    border: 'border-lime-700',
    hover: 'hover:bg-lime-700',
  },
  PJSC: {
    bg: 'bg-emerald-600',
    text: 'text-white',
    border: 'border-emerald-700',
    hover: 'hover:bg-emerald-700',
  },
  PLP: {
    bg: 'bg-sky-600',
    text: 'text-white',
    border: 'border-sky-700',
    hover: 'hover:bg-sky-700',
  },
  PNG: {
    bg: 'bg-violet-600',
    text: 'text-white',
    border: 'border-violet-700',
    hover: 'hover:bg-violet-700',
  },
  PNR: {
    bg: 'bg-fuchsia-600',
    text: 'text-white',
    border: 'border-fuchsia-700',
    hover: 'hover:bg-fuchsia-700',
  },
  PPSO: {
    bg: 'bg-slate-600',
    text: 'text-white',
    border: 'border-slate-700',
    hover: 'hover:bg-slate-700',
  },
  PSD: {
    bg: 'bg-zinc-600',
    text: 'text-white',
    border: 'border-zinc-700',
    hover: 'hover:bg-zinc-700',
  },
  PUCD: {
    bg: 'bg-neutral-600',
    text: 'text-white',
    border: 'border-neutral-700',
    hover: 'hover:bg-neutral-700',
  },
  UP: {
    bg: 'bg-stone-600',
    text: 'text-white',
    border: 'border-stone-700',
    hover: 'hover:bg-stone-700',
  },
};

/**
 * Get color classes for a party
 */
export function getPartyColors(abbreviation: string): PartyColors {
  return (
    PARTY_COLORS[abbreviation] || {
      bg: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-700',
    }
  );
}

// Hex color mappings for charts/visualizations
const PARTY_HEX_COLORS: Record<string, string> = {
  PLN: '#059669', // green-600
  PUSC: '#2563eb', // blue-600
  FA: '#dc2626', // red-600
  PAC: '#eab308', // yellow-500
  ACRM: '#9333ea', // purple-600
  CAC: '#4f46e5', // indigo-600
  CDS: '#0d9488', // teal-600
  CR1: '#ea580c', // orange-600
  PA: '#db2777', // pink-600
  PDLCT: '#e11d48', // rose-600
  PEL: '#0891b2', // cyan-600
  PEN: '#d97706', // amber-600
  PIN: '#65a30d', // lime-600
  PJSC: '#059669', // emerald-600
  PLP: '#0284c7', // sky-600
  PNG: '#7c3aed', // violet-600
  PNR: '#c026d3', // fuchsia-600
  PPSO: '#475569', // slate-600
  PSD: '#52525b', // zinc-600
  PUCD: '#525252', // neutral-600
  UP: '#57534e', // stone-600
};

/**
 * Get hex color for a party (for charts and visualizations)
 */
export function getPartyColor(abbreviation: string): string {
  return PARTY_HEX_COLORS[abbreviation] || '#6b7280'; // gray-600 as fallback
}
