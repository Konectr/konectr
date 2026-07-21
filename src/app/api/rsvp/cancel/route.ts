// © Konectr 2026. All rights reserved.
// API route: POST /api/rsvp/cancel → withdraws a web RSVP.
// The spot is ALWAYS released. The 3-hour cutoff is enforced SERVER-SIDE inside
// the cancel_web_rsvp RPC and only sets `late`:
//   > 3h before start → { outcome: 'withdrawn', late: false }
//   < 3h before start → { outcome: 'withdrawn', late: true }  (group notified now)

import { NextRequest, NextResponse } from 'next/server';
import { cancelWebRsvp } from '@/lib/supabase';
import { createHash } from 'crypto';

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claim_token } = body;

    if (!claim_token || typeof claim_token !== 'string' || !claim_token.trim()) {
      return NextResponse.json({ error: 'Claim code is required' }, { status: 400 });
    }

    // Hash IP for the RPC's per-IP rate limit (weak 4-char token → abuse guard).
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const ipHash = hashIp(ip);

    const result = await cancelWebRsvp(claim_token.trim(), ipHash);

    switch (result.outcome) {
      case 'rate_limited':
        return NextResponse.json(
          { error: 'Too many attempts. Please try again in a little while.' },
          { status: 429 }
        );
      case 'not_found':
        return NextResponse.json(
          { error: "We couldn't find that RSVP." },
          { status: 404 }
        );
      case 'activity_unavailable':
        return NextResponse.json(
          { ...result, error: 'This activity is no longer available.' },
          { status: 410 }
        );
      default:
        // 'withdrawn' (with `late`) | 'already_withdrawn'
        return NextResponse.json(result);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to cancel RSVP';
    console.error('RSVP cancel error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
