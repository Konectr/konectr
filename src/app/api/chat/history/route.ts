// © Konectr 2026. All rights reserved.
// API route: POST /api/chat/history
// Fetches recent Activity Chatter messages for a web RSVP guest.
// Returns safe subset: content, sender_display_name, is_from_web,
// is_self, created_at. No profile metadata (per safety rule).

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 500s never echo Postgres/Notion error text to the browser; the detail is logged server-side.
const GENERIC_500 = "Something went wrong. Please try again.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claim_token, limit } = body;

    if (!claim_token || typeof claim_token !== 'string') {
      return NextResponse.json(
        { error: 'claim_token is required' },
        { status: 400 }
      );
    }

    const fetchLimit = typeof limit === 'number' && limit > 0 && limit <= 200 ? limit : 50;

    const { data, error } = await supabase.rpc('get_web_chat_messages', {
      p_claim_token: claim_token,
      p_limit: fetchLimit,
    });

    if (error) {
      const msg = error.message || 'Failed to load messages';
      if (msg.includes('Invalid claim token')) return NextResponse.json({ error: msg }, { status: 401 });
      console.error('get_web_chat_messages error:', msg);
      console.error("RPC error:", msg);
      return NextResponse.json({ error: GENERIC_500 }, { status: 500 });
    }

    return NextResponse.json(data ?? { messages: [], messages_sent: 0, messages_remaining: 10 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error('chat/history error:', message);
    return NextResponse.json({ error: GENERIC_500 }, { status: 500 });
  }
}
