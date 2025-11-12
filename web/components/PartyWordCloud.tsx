// ABOUTME: Word cloud visualization component for party key themes
// ABOUTME: Extracts keywords from party positions and displays them as an interactive cloud

'use client';

import { useMemo } from 'react';
import ReactWordcloud from 'react-wordcloud';
import type { PartyPosition } from '@/lib/database';

interface PartyWordCloudProps {
  positions: (PartyPosition & { category: { category_key: string; name: string } })[];
  maxWords?: number;
  width?: number;
  height?: number;
}

/**
 * Spanish stop words to filter out from word cloud
 */
const SPANISH_STOP_WORDS = new Set([
  'el',
  'la',
  'de',
  'que',
  'y',
  'a',
  'en',
  'un',
  'ser',
  'se',
  'no',
  'haber',
  'por',
  'con',
  'su',
  'para',
  'como',
  'estar',
  'tener',
  'le',
  'lo',
  'todo',
  'pero',
  'más',
  'hacer',
  'o',
  'poder',
  'decir',
  'este',
  'ir',
  'otro',
  'ese',
  'la',
  'si',
  'me',
  'ya',
  'ver',
  'porque',
  'dar',
  'cuando',
  'él',
  'muy',
  'sin',
  'vez',
  'mucho',
  'saber',
  'qué',
  'sobre',
  'mi',
  'alguno',
  'mismo',
  'yo',
  'también',
  'hasta',
  'año',
  'dos',
  'querer',
  'entre',
  'así',
  'primero',
  'desde',
  'grande',
  'eso',
  'ni',
  'nos',
  'llegar',
  'pasar',
  'tiempo',
  'ella',
  'sí',
  'día',
  'uno',
  'bien',
  'poco',
  'deber',
  'entonces',
  'poner',
  'cosa',
  'tanto',
  'hombre',
  'parecer',
  'nuestro',
  'tan',
  'donde',
  'ahora',
  'parte',
  'después',
  'vida',
  'quedar',
  'siempre',
  'creer',
  'hablar',
  'llevar',
  'dejar',
  'nada',
  'cada',
  'seguir',
  'menos',
  'nuevo',
  'encontrar',
  'algo',
  'solo',
  'decir',
  'estos',
  'trabajar',
  'sea',
  'las',
  'los',
  'del',
  'una',
  'al',
  'son',
  'esta',
  'sus',
  'puede',
  'han',
]);

/**
 * Extract keywords from text with frequency counting
 */
function extractKeywords(text: string): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^\wáéíóúñü\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !SPANISH_STOP_WORDS.has(word));

  const frequency = new Map<string, number>();

  for (const word of words) {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  }

  return frequency;
}

export default function PartyWordCloud({
  positions,
  maxWords = 50,
  width = 600,
  height = 400,
}: PartyWordCloudProps) {
  const words = useMemo(() => {
    // Combine all summaries and proposals
    const allText = positions
      .map((pos) => {
        const proposals = JSON.parse(pos.key_proposals || '[]') as string[];
        return `${pos.summary} ${proposals.join(' ')}`;
      })
      .join(' ');

    // Extract keywords with frequency
    const keywords = extractKeywords(allText);

    // Convert to word cloud format and sort by frequency
    const cloudWords = Array.from(keywords.entries())
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, maxWords);

    return cloudWords;
  }, [positions, maxWords]);

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0] as [number, number],
    fontSizes: [16, 60] as [number, number],
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: 2,
    deterministic: true,
    enableTooltip: true,
    tooltipOptions: {
      allowHTML: true,
      theme: 'light',
    },
  };

  if (words.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
        style={{ width, height }}
      >
        <p className="text-gray-500 dark:text-gray-400">
          No hay datos suficientes para generar la nube de palabras
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800" style={{ width, height }}>
      <ReactWordcloud words={words} options={options} />
    </div>
  );
}
