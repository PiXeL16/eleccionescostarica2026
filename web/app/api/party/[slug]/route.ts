// ABOUTME: API endpoint to fetch party information by slug
// ABOUTME: Returns party data for client-side components

import { NextRequest, NextResponse } from 'next/server';
import { getPartyBySlug } from '@/lib/database';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const party = getPartyBySlug(slug);

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    return NextResponse.json(party);
  } catch (error) {
    console.error('Error fetching party:', error);
    return NextResponse.json({ error: 'Failed to fetch party' }, { status: 500 });
  }
}
