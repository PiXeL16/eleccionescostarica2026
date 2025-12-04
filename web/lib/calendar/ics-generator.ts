// ABOUTME: Generate ICS (iCalendar) file content for calendar events
// ABOUTME: Creates RFC 5545 compliant calendar files for download

import type { CalendarEvent } from './calendar-links';

/**
 * Escape special characters for ICS format
 */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Format date for ICS (YYYYMMDD for all-day events)
 */
function formatICSDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

/**
 * Format timestamp for ICS (YYYYMMDDTHHMMSSZ)
 */
function formatICSTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generate a unique ID for the event
 */
function generateUID(eventId: number): string {
  return `promise-${eventId}-${Date.now()}@eleccionescostarica.org`;
}

/**
 * Fold long lines according to RFC 5545 (max 75 chars)
 */
function foldLine(line: string): string {
  const maxLength = 75;
  if (line.length <= maxLength) return line;

  const parts: string[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    if (parts.length === 0) {
      parts.push(remaining.slice(0, maxLength));
      remaining = remaining.slice(maxLength);
    } else {
      // Continuation lines start with a space
      parts.push(' ' + remaining.slice(0, maxLength - 1));
      remaining = remaining.slice(maxLength - 1);
    }
  }

  return parts.join('\r\n');
}

/**
 * Generate ICS content for a single event
 */
export function generateICS(event: CalendarEvent): string {
  const now = new Date();
  const uid = generateUID(event.id);
  const startDate = formatICSDate(event.startDate);
  const endDate = event.endDate
    ? formatICSDate(event.endDate)
    : formatICSDate(new Date(event.startDate.getTime() + 86400000)); // +1 day

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Elecciones Costa Rica 2026//Calendario de Rendición//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSTimestamp(now)}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    foldLine(`SUMMARY:${escapeICS(event.title)}`),
    foldLine(`DESCRIPTION:${escapeICS(event.description)}`),
  ];

  if (event.location) {
    lines.push(foldLine(`LOCATION:${escapeICS(event.location)}`));
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  lines.push(
    'TRANSP:TRANSPARENT', // All-day event, doesn't block time
    'END:VEVENT',
    'END:VCALENDAR'
  );

  return lines.join('\r\n');
}

/**
 * Generate ICS content for multiple events
 */
export function generateBulkICS(events: CalendarEvent[]): string {
  const now = new Date();

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Elecciones Costa Rica 2026//Calendario de Rendición//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Promesas Electorales Costa Rica 2026',
  ];

  for (const event of events) {
    const uid = generateUID(event.id);
    const startDate = formatICSDate(event.startDate);
    const endDate = event.endDate
      ? formatICSDate(event.endDate)
      : formatICSDate(new Date(event.startDate.getTime() + 86400000));

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatICSTimestamp(now)}`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      foldLine(`SUMMARY:${escapeICS(event.title)}`),
      foldLine(`DESCRIPTION:${escapeICS(event.description)}`)
    );

    if (event.location) {
      lines.push(foldLine(`LOCATION:${escapeICS(event.location)}`));
    }

    if (event.url) {
      lines.push(`URL:${event.url}`);
    }

    lines.push('TRANSP:TRANSPARENT', 'END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}
