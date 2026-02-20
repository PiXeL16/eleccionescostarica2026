// ABOUTME: Generate calendar links for Google, Outlook, and Apple Calendar
// ABOUTME: Creates URLs that open calendar apps with pre-filled event data

import type { TimeBoundPromiseWithParty } from '../database';

export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  url?: string;
}

/**
 * Format date for Google Calendar URL (YYYYMMDDTHHmmssZ)
 */
function formatGoogleDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Format date for all-day events (YYYYMMDD)
 */
function formatAllDayDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const startDate = formatAllDayDate(event.startDate);
  const endDate = event.endDate
    ? formatAllDayDate(event.endDate)
    : formatAllDayDate(new Date(event.startDate.getTime() + 86400000)); // +1 day for all-day

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description,
  });

  if (event.location) {
    params.set('location', event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook.com Calendar URL
 */
export function generateOutlookUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    subject: event.title,
    body: event.description,
    startdt: event.startDate.toISOString().split('T')[0],
    enddt: event.endDate
      ? event.endDate.toISOString().split('T')[0]
      : event.startDate.toISOString().split('T')[0],
    allday: 'true',
    path: '/calendar/action/compose',
  });

  if (event.location) {
    params.set('location', event.location);
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate Yahoo Calendar URL
 */
export function generateYahooCalendarUrl(event: CalendarEvent): string {
  const startDate = formatAllDayDate(event.startDate);
  const endDate = event.endDate
    ? formatAllDayDate(event.endDate)
    : formatAllDayDate(new Date(event.startDate.getTime() + 86400000));

  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    st: startDate,
    et: endDate,
    desc: event.description,
    in_loc: event.location || 'Costa Rica',
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

/**
 * Resolve promise date to a concrete Date object
 * Uses END of period per user requirement
 */
export function resolvePromiseDate(promise: TimeBoundPromiseWithParty): Date {
  // Costa Rica 2026 administration
  const INAUGURATION = new Date('2026-05-08');

  // Specific date takes priority
  if (promise.promised_date) {
    return new Date(promise.promised_date);
  }

  // Range: use end date
  if (promise.date_end) {
    return new Date(promise.date_end);
  }

  // Relative days from inauguration
  if (promise.relative_days) {
    const endDate = new Date(INAUGURATION);
    endDate.setDate(endDate.getDate() + promise.relative_days);
    return endDate;
  }

  // Administration year milestone
  if (promise.administration_year) {
    const yearEnds: Record<number, string> = {
      1: '2027-05-08',
      2: '2028-05-08',
      3: '2029-05-08',
      4: '2030-05-08',
    };
    return new Date(yearEnds[promise.administration_year] || '2030-05-08');
  }

  // Fallback to end of administration
  return new Date('2030-05-08');
}

/**
 * Get date ambiguity note for display
 */
export function getDateNote(promise: TimeBoundPromiseWithParty): string | null {
  if (promise.promised_date_type === 'specific') {
    return null;
  }

  if (promise.promised_date_type === 'relative' && promise.relative_days) {
    return `Fecha aproximada: primeros ${promise.relative_days} días de gobierno`;
  }

  if (promise.promised_date_type === 'milestone' && promise.administration_year) {
    const yearNames: Record<number, string> = {
      1: 'primer',
      2: 'segundo',
      3: 'tercer',
      4: 'cuarto',
    };
    return `Fecha aproximada: ${yearNames[promise.administration_year] || ''} año de gobierno`;
  }

  if (promise.promised_date_type === 'range') {
    if (promise.date_start && promise.date_end) {
      return `Período: ${promise.date_start} a ${promise.date_end}`;
    }
    return `Fecha aproximada basada en rango`;
  }

  return `Fecha aproximada: ${promise.promised_date_text}`;
}

/**
 * Convert a promise to a CalendarEvent
 */
export function promiseToCalendarEvent(promise: TimeBoundPromiseWithParty): CalendarEvent {
  const resolvedDate = resolvePromiseDate(promise);
  const dateNote = getDateNote(promise);

  // Build description
  const descriptionParts = [
    `PROMESA ELECTORAL - ${promise.party_name} (${promise.party_abbreviation})`,
    '',
    promise.category_name ? `Categoría: ${promise.category_name}` : '',
    `Fecha prometida: ${promise.promised_date_text}`,
    '',
    `Promesa: ${promise.promise_text}`,
  ];

  if (dateNote) {
    descriptionParts.push('', `⚠️ Nota: ${dateNote}`);
  }

  if (promise.source_page) {
    descriptionParts.push('', `Fuente: Plan de Gobierno, Página ${promise.source_page}`);
  }

  return {
    id: promise.id,
    title: `[${promise.party_abbreviation}] ${promise.category_name || 'Promesa'}: ${
      promise.promise_summary || promise.promise_text.slice(0, 50)
    }`,
    description: descriptionParts.filter(Boolean).join('\n'),
    startDate: resolvedDate,
    location: 'Costa Rica',
    url: `https://eleccionescostarica.org/partido/${promise.party_abbreviation.toLowerCase()}`,
  };
}

/**
 * Generate all calendar links for a promise
 */
export function generateAllCalendarLinks(promise: TimeBoundPromiseWithParty): {
  google: string;
  outlook: string;
  yahoo: string;
  icsUrl: string;
} {
  const event = promiseToCalendarEvent(promise);

  return {
    google: generateGoogleCalendarUrl(event),
    outlook: generateOutlookUrl(event),
    yahoo: generateYahooCalendarUrl(event),
    icsUrl: `/calendar/${promise.id}.ics`,
  };
}
