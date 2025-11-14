// ABOUTME: API endpoint to serve PDF files for party platforms
// ABOUTME: Enables streaming PDFs to the frontend viewer component

import { readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { getPartyBySlug } from '@/lib/database';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ party: string }> }
) {
  try {
    const { party: partySlug } = await params;

    // Get party from database
    const party = getPartyBySlug(partySlug);

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    // Construct PDF path from public folder
    const pdfPath = join(process.cwd(), 'public', 'party_pdfs', `${party.abbreviation}.pdf`);

    // Read the PDF file
    const pdfBuffer = await readFile(pdfPath);

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${party.abbreviation}.pdf"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json({ error: 'Failed to load PDF' }, { status: 500 });
  }
}
