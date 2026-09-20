// © Konectr 2026. All rights reserved.
// API route: POST /api/headcount
// The PF-42 "still in?" card for a web guest. Auth model: possession of the
// claim_token = auth (same as chat history / send).
//   { claim_token }              → the card, or null when no headcount exists
//   { claim_token, in: true }    → "I'm in"
//   { claim_token, in: false }   → clear my answer ("Change")
// "I'm out" is the existing cancel-RSVP flow, never this route.

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claim_token, in: isIn } = body as { claim_token?: unknown; in?: unknown };

    if (!claim_token || typeof claim_token !== 'string' || !claim_token.trim()) {
      return NextResponse.json({ error: 'claim_token is required' }, { status: 400 });
    }

    if (typeof isIn === 'boolean') {
      const { data, error } = await supabase.rpc('answer_headcount_web', {
        p_claim_token: claim_token.trim(),
        p_in: isIn,
      });
      if (error) {
        console.error('answer_headcount_web error:', error.message);
        return NextResponse.json({ error: 'Could not record your answer' }, { status: 500 });
      }
      const outcome = (data as { outcome?: string } | null)?.outcome;
      if (outcome === 'invalid_token') return NextResponse.json({ error: 'Invalid claim token' }, { status: 401 });
      if (outcome === 'not_found') return NextResponse.json({ error: 'This headcount has closed' }, { status: 410 });
      return NextResponse.json({ headcount: (data as { headcount?: unknown }).headcount ?? null });
    }

    const { data, error } = await supabase.rpc('get_web_headcount', {
      p_claim_token: claim_token.trim(),
    });
    if (error) {
      console.error('get_web_headcount error:', error.message);
      return NextResponse.json({ error: 'Failed to load headcount' }, { status: 500 });
    }
    return NextResponse.json({ headcount: data ?? null });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error('headcount route error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
