// ABOUTME: Script to copy all party logos to public folder
// ABOUTME: Handles finding first available logo for each party

import { copyFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const dataDir = '/Users/christopher.jimenez/Src/Personal/Elecciones2026/data/partidos';
const publicDir = '/Users/christopher.jimenez/Src/Personal/Elecciones2026/web/public/partidos';

const dirs = readdirSync(dataDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

for (const dir of dirs) {
  const abbr = dir.split('-')[0];
  const partyDir = join(dataDir, dir);

  // Try to find first available logo (1, 2, or 3)
  for (let i = 1; i <= 5; i++) {
    const logoPath = join(partyDir, `${abbr}_logo_${i}.png`);
    if (existsSync(logoPath)) {
      const destPath = join(publicDir, `${abbr}.png`);
      copyFileSync(logoPath, destPath);
      console.log(`Copied ${abbr} (logo ${i})`);
      break;
    }
  }
}
