// ABOUTME: API endpoint to generate ICS calendar file for a promise
// ABOUTME: Returns downloadable .ics file for calendar integration

import { NextRequest, NextResponse } from 'next/server';
import { getPromiseById } from '@/lib/database';
import { promiseToCalendarEvent } from '@/lib/calendar/calendar-links';
import { generateICS } from '@/lib/calendar/ics-generator';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ promiseId: string }> }
) {
  try {
    const { promiseId } = await params;
    const id = parseInt(promiseId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid promise ID' }, { status: 400 });
    }

    const promise = getPromiseById(id);

    if (!promise) {
      return NextResponse.json({ error: 'Promise not found' }, { status: 404 });
    }

    // Convert to calendar event and generate ICS
    const event = promiseToCalendarEvent(promise);
    const icsContent = generateICS(event);

    // Create filename from party and summary
    const safeSummary = (promise.promise_summary || 'promesa')
      .slice(0, 30)
      .replace(/[^a-zA-Z0-9áéíóúñü\s]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    const filename = `${promise.party_abbreviation.toLowerCase()}-${safeSummary}.ics`;

    // Return ICS file
    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating calendar file:', error);
    return NextResponse.json({ error: 'Failed to generate calendar file' }, { status: 500 });
  }
}
