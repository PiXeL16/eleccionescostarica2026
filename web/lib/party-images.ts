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
 * Get the path to a candidate's photo
 * @param abbreviation - Party abbreviation (e.g., "PLN", "CAC")
 * @returns Path to the candidate photo image with correct extension
 */
export function getCandidatePhotoPath(abbreviation: string): string {
  // These candidates have PNG files, others have JPG
  const pngCandidates = ['FA', 'PLP', 'PNR', 'PSD'];
  const extension = pngCandidates.includes(abbreviation) ? 'png' : 'jpg';
  return `/party_flags/${abbreviation}-candidate.${extension}`;
}

/**
 * Check if a party has a candidate photo available
 * @param abbreviation - Party abbreviation
 * @returns true if the party has a candidate photo
 */
export function hasCandidatePhoto(abbreviation: string): boolean {
  // Parties with candidate photos available
  const partiesWithCandidatePhotos = ['CAC', 'FA', 'PIN', 'PLN', 'PLP', 'PNR', 'PPSO', 'PSD', 'UP'];
  return partiesWithCandidatePhotos.includes(abbreviation);
}

/**
 * Check if a party has a flag image available
 * @param abbreviation - Party abbreviation
 * @returns true if the party has a flag image
 */
export function hasPartyFlag(abbreviation: string): boolean {
  // All 20 parties in our database have flags
  const partiesWithFlags = [
    'ACRM',
    'CAC',
    'CDS',
    'CR1',
    'FA',
    'PA',
    'PDLCT',
    'PEL',
    'PEN',
    'PIN',
    'PJSC',
    'PLN',
    'PLP',
    'PNG',
    'PNR',
    'PPSO',
    'PSD',
    'PUCD',
    'PUSC',
    'UP',
  ];
  return partiesWithFlags.includes(abbreviation);
}
