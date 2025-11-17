// ABOUTME: Analyzer for measuring agreement/disagreement across parties on different topics
// ABOUTME: Uses text similarity to identify consensus issues vs divisive topics

export interface CategoryAgreement {
  categoryName: string;
  categoryKey: string;
  averageSimilarity: number; // 0-100 score
  participatingParties: number;
  highConsensus: boolean; // > 70% similarity
  highDivision: boolean; // < 40% similarity
  partySimilarities: Map<string, Map<string, number>>; // party1 -> party2 -> similarity
  commonWords: string[]; // Words/concepts that appear across multiple parties
  topUniqueWordsByParty: Map<string, string[]>; // Party-specific terminology
}

export interface AgreementMatrix {
  categories: CategoryAgreement[];
  overallConsensusScore: number;
  mostConsensusCategory: CategoryAgreement | null;
  mostDivisiveCategory: CategoryAgreement | null;
}

// Common political stop words in Spanish (beyond typical stop words)
const POLITICAL_STOP_WORDS = new Set([
  'gobierno',
  'política',
  'políticas',
  'programa',
  'programas',
  'propuesta',
  'propuestas',
  'nacional',
  'costa',
  'rica',
  'país',
  'estado',
  'público',
  'pública',
  'públicos',
  'públicas',
  'ciudadanos',
  'ciudadanas',
  'población',
  'mediante',
  'través',
  'implementar',
  'desarrollar',
  'promover',
  'garantizar',
  'fortalecer',
]);

/**
 * Simple word stemming for Spanish - removes common suffixes
 */
function stemWord(word: string): string {
  // Remove common Spanish suffixes to get word roots
  const suffixes = [
    'ción',
    'sión',
    'miento',
    'amiento',
    'imiento',
    'anza',
    'encia',
    'ancia',
    'dad',
    'tad',
    'eza',
    'ura',
    'ismo',
    'ista',
    'able',
    'ible',
    'ante',
    'ente',
    'mente',
    'ador',
    'edor',
    'idor',
    'dor',
    'ción',
  ];

  let stem = word;
  for (const suffix of suffixes) {
    if (stem.endsWith(suffix) && stem.length > suffix.length + 3) {
      stem = stem.slice(0, -suffix.length);
      break;
    }
  }
  return stem;
}

/**
 * Calculate text similarity using enhanced word overlap with stemming
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  // Normalize and tokenize texts
  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\wáéíóúñü\s]/g, '') // Keep Spanish characters
      .split(/\s+/)
      .filter((word) => word.length > 3) // Filter very short words
      .filter((word) => !POLITICAL_STOP_WORDS.has(word)) // Remove political boilerplate
      .map(stemWord); // Apply stemming
  };

  const words1 = normalize(text1);
  const words2 = normalize(text2);

  if (words1.length === 0 || words2.length === 0) return 0;

  // Use multisets (keep duplicates) for better similarity measurement
  const set1 = new Set(words1);
  const set2 = new Set(words2);

  // Calculate Jaccard similarity on unique stems
  const intersection = new Set([...set1].filter((word) => set2.has(word)));
  const union = new Set([...set1, ...set2]);

  // Base Jaccard similarity
  const jaccardSimilarity = (intersection.size / union.size) * 100;

  // Also calculate word frequency overlap for more nuanced similarity
  const freq1 = new Map<string, number>();
  const freq2 = new Map<string, number>();

  for (const word of words1) {
    freq1.set(word, (freq1.get(word) || 0) + 1);
  }
  for (const word of words2) {
    freq2.set(word, (freq2.get(word) || 0) + 1);
  }

  // Cosine similarity based on word frequencies
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  const allWords = new Set([...freq1.keys(), ...freq2.keys()]);
  allWords.forEach((word) => {
    const f1 = freq1.get(word) || 0;
    const f2 = freq2.get(word) || 0;
    dotProduct += f1 * f2;
    mag1 += f1 * f1;
    mag2 += f2 * f2;
  });

  const cosineSimilarity =
    mag1 > 0 && mag2 > 0 ? (dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2))) * 100 : 0;

  // Combine both measures (weighted average)
  // Jaccard is stricter, cosine is more forgiving - balance them
  return jaccardSimilarity * 0.4 + cosineSimilarity * 0.6;
}

/**
 * Analyze agreement levels across all parties for each category
 */
export function analyzeAgreement(
  partiesWithPositions: Array<{
    party: { id: number; name: string; abbreviation: string };
    positions: Array<{
      summary: string;
      key_proposals: string | null;
      category: { category_key: string; name: string };
    }>;
  }>
): AgreementMatrix {
  // Group positions by category
  const positionsByCategory = new Map<
    string,
    Array<{ partyAbbr: string; partyName: string; text: string }>
  >();

  partiesWithPositions.forEach(({ party, positions }) => {
    positions.forEach((pos) => {
      const categoryKey = pos.category.category_key;
      if (!positionsByCategory.has(categoryKey)) {
        positionsByCategory.set(categoryKey, []);
      }

      // Combine summary and key proposals for comparison
      let fullText = pos.summary;
      if (pos.key_proposals) {
        try {
          const proposals = JSON.parse(pos.key_proposals) as string[];
          fullText += ` ${proposals.join(' ')}`;
        } catch (_e) {
          // Ignore parsing errors
        }
      }

      positionsByCategory.get(categoryKey)?.push({
        partyAbbr: party.abbreviation,
        partyName: party.name,
        text: fullText,
      });
    });
  });

  // Calculate agreement for each category
  const categories: CategoryAgreement[] = [];

  positionsByCategory.forEach((partyPositions, categoryKey) => {
    if (partyPositions.length < 2) {
      // Need at least 2 parties to measure agreement
      return;
    }

    // Get category name from first position
    const categoryName =
      partiesWithPositions
        .flatMap((p) => p.positions)
        .find((pos) => pos.category.category_key === categoryKey)?.category.name || categoryKey;

    // Calculate pairwise similarities
    const similarities: number[] = [];
    const partySimilarities = new Map<string, Map<string, number>>();

    for (let i = 0; i < partyPositions.length; i++) {
      const party1Similarities = new Map<string, number>();

      for (let j = i + 1; j < partyPositions.length; j++) {
        const similarity = calculateTextSimilarity(partyPositions[i].text, partyPositions[j].text);
        similarities.push(similarity);

        party1Similarities.set(partyPositions[j].partyAbbr, similarity);
      }

      if (party1Similarities.size > 0) {
        partySimilarities.set(partyPositions[i].partyAbbr, party1Similarities);
      }
    }

    const averageSimilarity =
      similarities.length > 0
        ? similarities.reduce((sum, s) => sum + s, 0) / similarities.length
        : 0;

    // Extract common and unique words for this category
    const normalize = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^\wáéíóúñü\s]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .filter((word) => !POLITICAL_STOP_WORDS.has(word))
        .map(stemWord);
    };

    // Count word frequencies across all parties in this category
    const wordCounts = new Map<string, number>();
    const partyWords = new Map<string, Set<string>>();

    partyPositions.forEach(({ partyAbbr, text }) => {
      const words = normalize(text);
      const uniqueWords = new Set(words);
      partyWords.set(partyAbbr, uniqueWords);

      uniqueWords.forEach((word) => {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      });
    });

    // Common words: appear in at least 50% of parties
    const minPartyThreshold = Math.ceil(partyPositions.length * 0.5);
    const commonWords = [...wordCounts.entries()]
      .filter(([_, count]) => count >= minPartyThreshold)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word);

    // Unique words by party: words that appear in this party but in few others
    const topUniqueWordsByParty = new Map<string, string[]>();
    for (const { partyAbbr, text } of partyPositions) {
      const words = normalize(text);
      const wordFreq = new Map<string, number>();
      for (const word of words) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }

      // Find words unique to this party (appear in ≤ 25% of other parties)
      const maxOtherParties = Math.ceil(partyPositions.length * 0.25);
      const uniqueWords = [...wordFreq.entries()]
        .filter(([word]) => {
          const appearanceCount = wordCounts.get(word) || 0;
          return appearanceCount <= maxOtherParties;
        })
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);

      topUniqueWordsByParty.set(partyAbbr, uniqueWords);
    }

    categories.push({
      categoryName,
      categoryKey,
      averageSimilarity,
      participatingParties: partyPositions.length,
      highConsensus: averageSimilarity > 70,
      highDivision: averageSimilarity < 40,
      partySimilarities,
      commonWords,
      topUniqueWordsByParty,
    });
  });

  // Sort by similarity (most consensus first)
  categories.sort((a, b) => b.averageSimilarity - a.averageSimilarity);

  // Calculate overall consensus score
  const overallConsensusScore =
    categories.length > 0
      ? categories.reduce((sum, cat) => sum + cat.averageSimilarity, 0) / categories.length
      : 0;

  return {
    categories,
    overallConsensusScore,
    mostConsensusCategory: categories[0] || null,
    mostDivisiveCategory: categories[categories.length - 1] || null,
  };
}
