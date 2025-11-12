// ABOUTME: Budget string parser for political platform budget mentions
// ABOUTME: Extracts structured data from free-form budget text

export type BudgetType =
  | 'none'
  | 'pib_percentage'
  | 'amount_colones'
  | 'amount_usd'
  | 'description'
  | 'all';

export interface ParsedBudget {
  type: BudgetType;
  raw: string;
  numericValue?: number;
  description?: string;
}

/**
 * Parse a budget mention string into structured data
 */
export function parseBudget(budgetText: string | null): ParsedBudget {
  if (!budgetText || budgetText.trim() === '' || budgetText === 'No especificado') {
    return {
      type: 'none',
      raw: budgetText || 'No especificado',
    };
  }

  const text = budgetText.trim();

  // Check for PIB percentage
  const pibMatch = text.match(/(\d+(?:[.,]\d+)?)\s*%\s*(?:del\s+)?PIB/i);
  if (pibMatch) {
    const value = Number.parseFloat(pibMatch[1].replace(',', '.'));
    return {
      type: 'pib_percentage',
      raw: text,
      numericValue: value,
      description: text,
    };
  }

  // Check for colones amounts (billones, trillones, etc.)
  const colonesMatch = text.match(
    /(?:₡|colones?)?\s*(\d+(?:[.,]\d+)?)\s*(bill[oó]n|trill[oó]n|mill[oó]n)(?:es)?\s*(?:de\s+)?(?:colones?)?/i
  );
  if (colonesMatch) {
    let value = Number.parseFloat(colonesMatch[1].replace(',', '.'));
    const unit = colonesMatch[2].toLowerCase();

    if (unit.includes('trill')) {
      value *= 1_000_000_000_000;
    } else if (unit.includes('bill')) {
      value *= 1_000_000_000;
    } else if (unit.includes('mill')) {
      value *= 1_000_000;
    }

    return {
      type: 'amount_colones',
      raw: text,
      numericValue: value,
      description: text,
    };
  }

  // Check for USD amounts
  const usdMatch = text.match(
    /(?:USD?\s*)?(?:\$|dólares?)\s*(\d+(?:[.,]\d+)?)\s*(mill[oó]n|bill[oó]n)(?:es)?/i
  );
  if (usdMatch) {
    let value = Number.parseFloat(usdMatch[1].replace(',', '.'));
    const unit = usdMatch[2].toLowerCase();

    if (unit.includes('bill')) {
      value *= 1_000_000_000;
    } else if (unit.includes('mill')) {
      value *= 1_000_000;
    }

    return {
      type: 'amount_usd',
      raw: text,
      numericValue: value,
      description: text,
    };
  }

  // If it contains financial keywords but didn't match patterns, it's a description
  const financialKeywords = [
    'deuda',
    'déficit',
    'superávit',
    'presupuesto',
    'inversión',
    'gasto',
    'ingreso',
    'recaudación',
  ];

  const hasFinancialKeyword = financialKeywords.some((keyword) =>
    text.toLowerCase().includes(keyword)
  );

  if (hasFinancialKeyword) {
    return {
      type: 'description',
      raw: text,
      description: text,
    };
  }

  // Default to description if we can't categorize
  return {
    type: 'description',
    raw: text,
    description: text,
  };
}

/**
 * Get display label for budget type
 */
export function getBudgetTypeLabel(type: BudgetType): string {
  switch (type) {
    case 'none':
      return 'No especificado';
    case 'pib_percentage':
      return '% del PIB';
    case 'amount_colones':
      return 'Montos en Colones';
    case 'amount_usd':
      return 'Montos en USD';
    case 'description':
      return 'Descripciones';
    case 'all':
      return 'Todos';
    default:
      return 'Desconocido';
  }
}

/**
 * Format numeric value for display
 */
export function formatBudgetValue(parsed: ParsedBudget): string {
  if (!parsed.numericValue) {
    return parsed.raw;
  }

  switch (parsed.type) {
    case 'pib_percentage':
      return `${parsed.numericValue}% del PIB`;
    case 'amount_colones':
      if (parsed.numericValue >= 1_000_000_000_000) {
        return `₡${(parsed.numericValue / 1_000_000_000_000).toFixed(1)} billones`;
      }
      if (parsed.numericValue >= 1_000_000_000) {
        return `₡${(parsed.numericValue / 1_000_000_000).toFixed(1)} mil millones`;
      }
      if (parsed.numericValue >= 1_000_000) {
        return `₡${(parsed.numericValue / 1_000_000).toFixed(1)} millones`;
      }
      return `₡${parsed.numericValue.toLocaleString('es-CR')}`;
    case 'amount_usd':
      if (parsed.numericValue >= 1_000_000_000) {
        return `$${(parsed.numericValue / 1_000_000_000).toFixed(1)}B USD`;
      }
      if (parsed.numericValue >= 1_000_000) {
        return `$${(parsed.numericValue / 1_000_000).toFixed(1)}M USD`;
      }
      return `$${parsed.numericValue.toLocaleString('en-US')} USD`;
    default:
      return parsed.raw;
  }
}
