// ABOUTME: Analyzes party positions to calculate ideological spectrum positioning
// ABOUTME: Calculates economic (left-right) and social (progressive-conservative) scores

export interface IdeologyScore {
  partyId: number;
  partyName: string;
  partyAbbreviation: string;
  economicScore: number; // -1 (left) to 1 (right)
  socialScore: number; // -1 (conservative) to 1 (progressive)
  confidence: number; // 0 to 1, how confident we are in the scoring
  reasoning: string;
}

// Keywords that indicate economic left positions (state intervention, redistribution)
const ECONOMIC_LEFT_KEYWORDS = [
  'estatal',
  'público',
  'social',
  'redistribución',
  'impuesto progresivo',
  'regulación',
  'nacionalizar',
  'gratuito',
  'universal',
  'subsidio',
  'estado benefactor',
  'igualdad económica',
  'salario mínimo',
  'protección laboral',
  'sindicato',
  'sector público',
];

// Keywords that indicate economic right positions (free market, privatization)
const ECONOMIC_RIGHT_KEYWORDS = [
  'mercado libre',
  'privatización',
  'desregulación',
  'emprendimiento',
  'competencia',
  'inversión privada',
  'reducción impuestos',
  'eficiencia',
  'sector privado',
  'liberalización',
  'apertura comercial',
  'competitividad',
  'libre comercio',
  'iniciativa privada',
];

// Keywords that indicate social progressive positions
const SOCIAL_PROGRESSIVE_KEYWORDS = [
  'derechos humanos',
  'igualdad',
  'diversidad',
  'inclusión',
  'lgbtq',
  'feminismo',
  'género',
  'laicidad',
  'separación iglesia',
  'medio ambiente',
  'sostenibilidad',
  'cambio climático',
  'matrimonio igualitario',
  'aborto',
  'derechos reproductivos',
  'secular',
  'progresista',
];

// Keywords that indicate social conservative positions
const SOCIAL_CONSERVATIVE_KEYWORDS = [
  'familia tradicional',
  'valores cristianos',
  'vida desde concepción',
  'orden',
  'autoridad',
  'tradición',
  'patrimonio',
  'seguridad ciudadana',
  'mano dura',
  'disciplina',
  'moral',
  'fe',
  'religión',
  'conservar',
];

/**
 * Calculate ideology scores for a party based on their positions
 */
export function calculateIdeologyScore(
  partyId: number,
  partyName: string,
  partyAbbreviation: string,
  positions: Array<{
    summary: string;
    key_proposals: string | null;
    category: { category_key: string; name: string };
  }>
): IdeologyScore {
  // Combine all text for analysis
  const allText = positions
    .map((p) => `${p.summary} ${p.key_proposals || ''}`)
    .join(' ')
    .toLowerCase();

  // Count keyword matches
  const economicLeftCount = countKeywords(allText, ECONOMIC_LEFT_KEYWORDS);
  const economicRightCount = countKeywords(allText, ECONOMIC_RIGHT_KEYWORDS);
  const socialProgressiveCount = countKeywords(allText, SOCIAL_PROGRESSIVE_KEYWORDS);
  const socialConservativeCount = countKeywords(allText, SOCIAL_CONSERVATIVE_KEYWORDS);

  // Calculate scores (-1 to 1)
  const economicTotal = economicLeftCount + economicRightCount;
  const economicScore =
    economicTotal > 0 ? (economicRightCount - economicLeftCount) / economicTotal : 0;

  const socialTotal = socialProgressiveCount + socialConservativeCount;
  const socialScore =
    socialTotal > 0 ? (socialProgressiveCount - socialConservativeCount) / socialTotal : 0;

  // Calculate confidence (how many keywords did we find?)
  const totalKeywords = economicTotal + socialTotal;
  const confidence = Math.min(1, totalKeywords / 50); // Max out at 50 keyword matches

  // Generate reasoning
  const reasoning = generateReasoning(
    economicLeftCount,
    economicRightCount,
    socialProgressiveCount,
    socialConservativeCount
  );

  return {
    partyId,
    partyName,
    partyAbbreviation,
    economicScore,
    socialScore,
    confidence,
    reasoning,
  };
}

/**
 * Count how many times keywords appear in text
 */
function countKeywords(text: string, keywords: string[]): number {
  let count = 0;
  for (const keyword of keywords) {
    const regex = new RegExp(keyword, 'gi');
    const matches = text.match(regex);
    if (matches) {
      count += matches.length;
    }
  }
  return count;
}

/**
 * Generate human-readable reasoning for the scores
 */
function generateReasoning(
  economicLeft: number,
  economicRight: number,
  socialProgressive: number,
  socialConservative: number
): string {
  const parts: string[] = [];

  // Economic reasoning
  if (economicLeft > economicRight) {
    parts.push(
      `Énfasis en intervención estatal y políticas redistributivas (${economicLeft} menciones vs ${economicRight})`
    );
  } else if (economicRight > economicLeft) {
    parts.push(
      `Énfasis en libre mercado y sector privado (${economicRight} menciones vs ${economicLeft})`
    );
  } else {
    parts.push('Posición económica centrista o mixta');
  }

  // Social reasoning
  if (socialProgressive > socialConservative) {
    parts.push(
      `Posiciones sociales progresistas (${socialProgressive} menciones vs ${socialConservative})`
    );
  } else if (socialConservative > socialProgressive) {
    parts.push(
      `Posiciones sociales conservadoras (${socialConservative} menciones vs ${socialProgressive})`
    );
  } else {
    parts.push('Posición social centrista o no especificada');
  }

  return parts.join('. ');
}

/**
 * Get label for economic position
 */
export function getEconomicLabel(score: number): string {
  if (score < -0.5) return 'Izquierda';
  if (score < -0.2) return 'Centro-Izquierda';
  if (score < 0.2) return 'Centro';
  if (score < 0.5) return 'Centro-Derecha';
  return 'Derecha';
}

/**
 * Get label for social position
 */
export function getSocialLabel(score: number): string {
  if (score < -0.5) return 'Conservador';
  if (score < -0.2) return 'Moderadamente Conservador';
  if (score < 0.2) return 'Moderado';
  if (score < 0.5) return 'Moderadamente Progresista';
  return 'Progresista';
}
