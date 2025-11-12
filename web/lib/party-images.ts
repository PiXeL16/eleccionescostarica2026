// ABOUTME: Party image utilities for accessing flag images
// ABOUTME: Provides path to party flag images stored in public folder

/**
 * Get the path to a party's flag image
 * @param abbreviation - Party abbreviation (e.g., "PLN", "PUSC")
 * @returns Path to the flag image
 */
export function getPartyFlagPath(abbreviation: string): string {
  // All flags are .jpg
  return `/party_flags/${abbreviation}.jpg`;
}

/**
 * Check if a party has a flag image available
 * @param abbreviation - Party abbreviation
 * @returns true if the party has a flag image
 */
export function hasPartyFlag(abbreviation: string): boolean {
  // All 20 parties in our database have flags
  const partiesWithFlags = [
    'ACRM', 'CAC', 'CDS', 'CR1', 'FA', 'PA', 'PDLCT', 'PEL', 'PEN', 'PIN',
    'PJSC', 'PLN', 'PLP', 'PNG', 'PNR', 'PPSO', 'PSD', 'PUCD', 'PUSC', 'UP'
  ];
  return partiesWithFlags.includes(abbreviation);
}
