// © Konectr 2026. All rights reserved.
// API route: POST /api/chat/history
// Fetches recent Activity Chatter messages for a web RSVP guest.
// Returns safe subset: content, sender_display_name, is_from_web,
// is_self, created_at. No profile metadata (per safety rule).

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // Defense-in-depth: the Activity Chatter panel is a text-only guest chat.
    // The get_web_chat_messages RPC already whitelists message_type='text', but
    // we filter again here so system notices (e.g. "X is no longer attending")
    // and location pins can never surface as guest bubbles on the public share
    // page — even if the RPC is ever changed to return other message types.
    if (data && Array.isArray(data.messages)) {
      data.messages = data.messages.filter(
        (m: { message_type?: string }) => !m.message_type || m.message_type === 'text'
      );
    }

    return NextResponse.json(data ?? { messages: [], messages_sent: 0, messages_remaining: 10 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error('chat/history error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
