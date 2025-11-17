// ABOUTME: Display party's most distinctive keywords with frequency indicators
// ABOUTME: Shows TF-IDF analyzed keywords in an interactive tag cloud format

'use client';

import { useMemo } from 'react';
import type { PartyPosition } from '@/lib/database';
import { extractKeywords } from '@/lib/keyword-extractor';

interface PartyKeywordsProps {
  positions: (PartyPosition & { category: { category_key: string; name: string } })[];
  partyColor: string;
  maxKeywords?: number;
}

export default function PartyKeywords({
  positions,
  partyColor,
  maxKeywords = 20,
}: PartyKeywordsProps) {
  const keywords = useMemo(() => {
    // Combine all party position text
    const allText = positions
      .map((pos) => {
        const proposals = JSON.parse(pos.key_proposals || '[]') as string[];
        return `${pos.summary} ${proposals.join(' ')}`;
      })
      .join(' ');

    // Get text from all positions for IDF calculation
    const allDocuments = positions.map((pos) => {
      const proposals = JSON.parse(pos.key_proposals || '[]') as string[];
      return `${pos.summary} ${proposals.join(' ')}`;
    });

    return extractKeywords(allText, allDocuments, maxKeywords);
  }, [positions, maxKeywords]);

  if (keywords.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        No hay suficientes datos para generar palabras clave
      </div>
    );
  }

  // Find max frequency for scaling
  const maxFrequency = Math.max(...keywords.map((k) => k.frequency));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        🏷️ Palabras Clave Más Distintivas
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Los términos más característicos de este partido, identificados mediante análisis TF-IDF
      </p>

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => {
          // Calculate size based on frequency (12px to 24px)
          const sizeScale = (keyword.frequency / maxFrequency) * 12 + 12;
          const fontSize = `${Math.round(sizeScale)}px`;

          // Calculate opacity based on rank (more important = more opaque)
          const opacity = 1 - (index / keywords.length) * 0.4;

          return (
            <span
              key={keyword.word}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-transform hover:scale-110"
              style={{
                backgroundColor: `${partyColor}${Math.round(opacity * 30)
                  .toString(16)
                  .padStart(2, '0')}`,
                borderColor: partyColor,
                borderWidth: '1px',
                fontSize,
                opacity,
              }}
              title={`Aparece ${keyword.frequency} veces`}
            >
              <span className="font-medium" style={{ color: partyColor }}>
                {keyword.word}
              </span>
              <span
                className="text-xs font-mono opacity-70"
                style={{ color: partyColor, fontSize: '10px' }}
              >
                {keyword.frequency}
              </span>
            </span>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>ℹ️ Cómo leer:</strong> El tamaño de cada palabra indica su frecuencia en las
          propuestas. El número muestra cuántas veces aparece. Estas palabras son las más
          características de este partido comparado con otros.
        </p>
      </div>
    </div>
  );
}
