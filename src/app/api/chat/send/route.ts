// © Konectr 2026. All rights reserved.
// API route: POST /api/chat/send
// Guest web chat message → Activity Chatter group.
// Auth model: possession of claim_token = auth (same as RSVP flow).
// 5-message cap enforced server-side in post_web_chat_message RPC.

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claim_token, content } = body;

    if (!claim_token || typeof claim_token !== 'string') {
      return NextResponse.json(
        { error: 'claim_token is required' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    const trimmed = content.trim();
    if (trimmed.length === 0 || trimmed.length > 1000) {
      return NextResponse.json(
        { error: 'Message must be 1-1000 characters' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('post_web_chat_message', {
      p_claim_token: claim_token,
      p_content: trimmed,
    });

    if (error) {
      const msg = error.message || 'Failed to send message';
      // Map known RPC errors to appropriate status codes
      if (msg.includes('Invalid claim token')) return NextResponse.json({ error: msg }, { status: 401 });
      if (msg.includes('not active') || msg.includes('no longer active')) return NextResponse.json({ error: msg }, { status: 410 });
      if (msg.includes('Message limit reached')) return NextResponse.json({ error: msg }, { status: 429 });
      if (msg.includes('not yet available')) return NextResponse.json({ error: msg }, { status: 503 });
      if (msg.includes('Group chat not available')) return NextResponse.json({ error: msg }, { status: 404 });
      if (msg.includes('1-1000')) return NextResponse.json({ error: msg }, { status: 400 });
      console.error('post_web_chat_message error:', msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json(data ?? { ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error('chat/send error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
