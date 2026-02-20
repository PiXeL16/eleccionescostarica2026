// ABOUTME: Build-time script to pre-generate ICS calendar files for all promises
// ABOUTME: Writes .ics files to public/calendar/ so they can be served statically

import { Database } from 'bun:sqlite';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { promiseToCalendarEvent } from '../lib/calendar/calendar-links';
import { generateICS } from '../lib/calendar/ics-generator';
import type { TimeBoundPromiseWithParty } from '../lib/database';

const DB_PATH = join(process.cwd(), '..', 'data', 'database.db');
const OUTPUT_DIR = join(process.cwd(), 'public', 'calendar');

function main() {
  console.log('Generating ICS calendar files...');

  // Open database using Bun's built-in SQLite
  const db = new Database(DB_PATH, { readonly: true });

  // Query all time-bound promises
  const promises = db
    .query(`
    SELECT
      tbp.*,
      p.name as party_name,
      p.abbreviation as party_abbreviation,
      c.name as category_name,
      c.category_key
    FROM time_bound_promises tbp
    JOIN parties p ON tbp.party_id = p.id
    LEFT JOIN categories c ON tbp.category_id = c.id
    ORDER BY tbp.id ASC
  `)
    .all() as TimeBoundPromiseWithParty[];

  console.log(`Found ${promises.length} promises`);

  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Generate ICS file for each promise
  let count = 0;
  for (const promise of promises) {
    const event = promiseToCalendarEvent(promise);
    const icsContent = generateICS(event);
    const filePath = join(OUTPUT_DIR, `${promise.id}.ics`);
    writeFileSync(filePath, icsContent, 'utf-8');
    count++;
  }

  db.close();
  console.log(`Generated ${count} ICS files in ${OUTPUT_DIR}`);
}

main();
