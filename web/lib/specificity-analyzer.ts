// ABOUTME: Analyzer for measuring proposal specificity vs vagueness
// ABOUTME: Scores proposals based on numbers, timelines, budgets, and concrete language

export interface SpecificityScore {
  partyId: number;
  partyName: string;
  partyAbbr: string;
  totalScore: number;
  budgetScore: number;
  timelineScore: number;
  actionScore: number;
  categoryScores: Map<string, number>;
  mostSpecific: Array<{ category: string; text: string; score: number }>;
  leastSpecific: Array<{ category: string; text: string; score: number }>;
}

interface ProposalAnalysis {
  text: string;
  category: string;
  score: number;
  budgetScore: number;
  timelineScore: number;
  actionScore: number;
}

/**
 * Patterns for detecting specific elements in Spanish text
 */
const PATTERNS = {
  // Numbers and percentages
  numbers: /\d+([.,]\d+)?%?/g,
  currency: /\$\s*\d+([.,]\d+)?|\d+([.,]\d+)?\s*(colones|millones|mil millones)/gi,

  // Time references
  timelines: /(años?|meses?|semanas?|días?|primer\s+año|segundo\s+año|\d+\s+años?)/gi,
  specificTime: /(2026|2027|2028|2029|2030|primer\s+año|segundo\s+año|tercer\s+año|cuarto\s+año)/gi,

  // Action verbs (concrete)
  concreteActions:
    /\b(implementaremos|crearemos|estableceremos|construiremos|desarrollaremos|aumentaremos|reduciremos|eliminaremos|modificaremos|garantizaremos)\b/gi,

  // Vague language
  vagueLanguage:
    /\b(buscaremos|intentaremos|trataremos|procuraremos|aspiramos|esperamos|queremos|deseamos|promoveremos|fomentaremos|impulsaremos)\b/gi,

  // Implementation details
  mechanisms:
    /\b(mediante|a través de|por medio de|utilizando|con\s+la\s+implementación|estableciendo)\b/gi,
};

/**
 * Analyze a single proposal text for specificity
 */
function analyzeProposal(text: string, category: string): ProposalAnalysis {
  const _normalizedText = text.toLowerCase();

  // Budget score: presence of numbers, currency, percentages
  const numberCount = (text.match(PATTERNS.numbers) || []).length;
  const currencyCount = (text.match(PATTERNS.currency) || []).length;
  const budgetScore = Math.min(
    100,
    ((numberCount * 10 + currencyCount * 20) / text.split(' ').length) * 100
  );

  // Timeline score: specific dates and time references
  const timelineCount = (text.match(PATTERNS.timelines) || []).length;
  const specificTimeCount = (text.match(PATTERNS.specificTime) || []).length;
  const timelineScore = Math.min(
    100,
    ((timelineCount * 10 + specificTimeCount * 20) / text.split(' ').length) * 100
  );

  // Action score: concrete vs vague language
  const concreteCount = (text.match(PATTERNS.concreteActions) || []).length;
  const vagueCount = (text.match(PATTERNS.vagueLanguage) || []).length;
  const mechanismCount = (text.match(PATTERNS.mechanisms) || []).length;

  // Penalize vague language, reward concrete actions and mechanisms
  const actionScore = Math.min(
    100,
    Math.max(
      0,
      ((concreteCount * 15 + mechanismCount * 10 - vagueCount * 5) / text.split(' ').length) * 100
    )
  );

  // Overall score: weighted average
  const score = budgetScore * 0.3 + timelineScore * 0.3 + actionScore * 0.4;

  return {
    text,
    category,
    score,
    budgetScore,
    timelineScore,
    actionScore,
  };
}

/**
 * Calculate specificity score for a party
 */
export function calculateSpecificityScore(
  partyId: number,
  partyName: string,
  partyAbbr: string,
  positions: Array<{
    summary: string;
    key_proposals: string | null;
    category: { category_key: string; name: string };
  }>
): SpecificityScore {
  const analyses: ProposalAnalysis[] = [];
  const categoryScores = new Map<string, number[]>();

  // Analyze each position
  positions.forEach((pos) => {
    // Analyze summary
    const summaryAnalysis = analyzeProposal(pos.summary, pos.category.name);
    analyses.push(summaryAnalysis);

    // Analyze each key proposal
    if (pos.key_proposals) {
      const proposals = JSON.parse(pos.key_proposals) as string[];
      proposals.forEach((proposal) => {
        const proposalAnalysis = analyzeProposal(proposal, pos.category.name);
        analyses.push(proposalAnalysis);
      });
    }

    // Track category scores
    if (!categoryScores.has(pos.category.name)) {
      categoryScores.set(pos.category.name, []);
    }
    categoryScores.get(pos.category.name)?.push(summaryAnalysis.score);
  });

  // Calculate averages
  const totalScore = analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length;
  const budgetScore = analyses.reduce((sum, a) => sum + a.budgetScore, 0) / analyses.length;
  const timelineScore = analyses.reduce((sum, a) => sum + a.timelineScore, 0) / analyses.length;
  const actionScore = analyses.reduce((sum, a) => sum + a.actionScore, 0) / analyses.length;

  // Calculate category averages
  const avgCategoryScores = new Map<string, number>();
  categoryScores.forEach((scores, category) => {
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    avgCategoryScores.set(category, avg);
  });

  // Find most and least specific proposals
  const sortedAnalyses = [...analyses].sort((a, b) => b.score - a.score);
  const mostSpecific = sortedAnalyses.slice(0, 3).map((a) => ({
    category: a.category,
    text: a.text.substring(0, 150) + (a.text.length > 150 ? '...' : ''),
    score: a.score,
  }));
  const leastSpecific = sortedAnalyses
    .slice(-3)
    .reverse()
    .map((a) => ({
      category: a.category,
      text: a.text.substring(0, 150) + (a.text.length > 150 ? '...' : ''),
      score: a.score,
    }));

  return {
    partyId,
    partyName,
    partyAbbr,
    totalScore,
    budgetScore,
    timelineScore,
    actionScore,
    categoryScores: avgCategoryScores,
    mostSpecific,
    leastSpecific,
  };
}

/**
 * Calculate specificity scores for all parties
 */
export function calculateAllSpecificityScores(
  parties: Array<{
    id: number;
    name: string;
    abbreviation: string;
    positions: Array<{
      summary: string;
      key_proposals: string | null;
      category: { category_key: string; name: string };
    }>;
  }>
): SpecificityScore[] {
  return parties.map((party) =>
    calculateSpecificityScore(party.id, party.name, party.abbreviation, party.positions)
  );
}
