// ABOUTME: TF-IDF keyword extraction for party proposal analysis
// ABOUTME: Extracts distinctive keywords from party positions using term frequency and inverse document frequency

interface TermFrequency {
  [term: string]: number;
}

interface DocumentFrequency {
  [term: string]: number;
}

/**
 * Spanish stopwords to filter out common words
 */
const SPANISH_STOPWORDS = new Set([
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
  'puede',
  'mediante',
  'través',
  'del',
  'las',
  'los',
  'una',
  'al',
  'les',
  'sus',
  'cual',
  'sea',
  'fue',
  'son',
  'será',
  'han',
  'sido',
  'está',
  'están',
  'tiene',
  'tendrá',
  'todos',
  'otras',
  'otros',
]);

/**
 * Additional domain-specific stopwords for political documents
 */
const POLITICAL_STOPWORDS = new Set([
  'partido',
  'política',
  'político',
  'políticos',
  'políticas',
  'costa',
  'rica',
  'costarricense',
  'nacional',
  'gobierno',
  'propuesta',
  'propuestas',
  'plan',
  'programa',
  'debe',
  'deben',
  'debe',
  'será',
  'serán',
  'promover',
  'impulsar',
  'fortalecer',
  'garantizar',
  'asegurar',
  'implementar',
]);

const ALL_STOPWORDS = new Set([...SPANISH_STOPWORDS, ...POLITICAL_STOPWORDS]);

/**
 * Tokenize text into individual words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter((word) => word.length > 3 && !ALL_STOPWORDS.has(word));
}

/**
 * Calculate term frequency for a document
 */
function calculateTermFrequency(tokens: string[]): TermFrequency {
  const tf: TermFrequency = {};
  const totalTokens = tokens.length;

  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }

  // Normalize by total tokens
  for (const term in tf) {
    tf[term] = tf[term] / totalTokens;
  }

  return tf;
}

/**
 * Calculate inverse document frequency across all documents
 */
function calculateDocumentFrequency(allTokens: string[][]): DocumentFrequency {
  const df: DocumentFrequency = {};
  const numDocuments = allTokens.length;

  for (const tokens of allTokens) {
    const uniqueTokens = new Set(tokens);
    for (const token of uniqueTokens) {
      df[token] = (df[token] || 0) + 1;
    }
  }

  // Convert to IDF: log(total_docs / docs_containing_term)
  for (const term in df) {
    df[term] = Math.log(numDocuments / df[term]);
  }

  return df;
}

export interface KeywordScore {
  word: string;
  score: number;
  frequency: number;
}

/**
 * Extract top keywords from a document using TF-IDF
 */
export function extractKeywords(
  text: string,
  allDocuments: string[],
  maxKeywords: number = 20
): KeywordScore[] {
  // Tokenize all documents
  const allTokens = allDocuments.map(tokenize);
  const currentTokens = tokenize(text);

  // Calculate TF for current document
  const tf = calculateTermFrequency(currentTokens);

  // Calculate IDF across all documents
  const idf = calculateDocumentFrequency(allTokens);

  // Calculate TF-IDF scores
  const tfidfScores: KeywordScore[] = [];

  for (const term in tf) {
    const tfidfScore = tf[term] * (idf[term] || 0);
    const frequency = currentTokens.filter((t) => t === term).length;

    tfidfScores.push({
      word: term,
      score: tfidfScore,
      frequency,
    });
  }

  // Sort by TF-IDF score and return top N
  return tfidfScores.sort((a, b) => b.score - a.score).slice(0, maxKeywords);
}

/**
 * Extract keywords for multiple parties
 */
export function extractPartyKeywords(
  parties: Array<{ id: string; name: string; text: string }>,
  maxKeywordsPerParty: number = 15
): Map<string, KeywordScore[]> {
  const allTexts = parties.map((p) => p.text);
  const partyKeywords = new Map<string, KeywordScore[]>();

  for (const party of parties) {
    const keywords = extractKeywords(party.text, allTexts, maxKeywordsPerParty);
    partyKeywords.set(party.id, keywords);
  }

  return partyKeywords;
}
