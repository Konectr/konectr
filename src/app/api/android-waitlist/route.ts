// © Konectr 2026. All rights reserved.
// API route: POST /api/android-waitlist
// Captures Android waitlist signups from the web share-link RSVP page.
// Anon Supabase client → register_android_waitlist RPC (SECURITY DEFINER).

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, share_code, activity_id } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();
    if (normalized.length === 0 || normalized.length > 254 || !EMAIL_REGEX.test(normalized)) {
      return NextResponse.json(
        { error: 'Please enter a valid email' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('register_android_waitlist', {
      p_email: normalized,
      p_share_code: typeof share_code === 'string' ? share_code : null,
      p_activity_id: typeof activity_id === 'string' ? activity_id : null,
    });

    if (error) {
      console.error('Android waitlist RPC error:', error.message);
      return NextResponse.json(
        { error: error.message || 'Failed to register' },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? { ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to register';
    console.error('Android waitlist error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
