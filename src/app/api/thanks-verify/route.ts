// © Konectr 2026. All rights reserved.
// API route: GET /api/thanks-verify?rid=<tally response id>
// Gate for the /thanks conversion pixels: returns 200 only when the Tally
// webhook has recorded a waitlist_users row with this response id in the last
// hour. Everything else — bad rid, no row, too old, missing env, DB error,
// column not yet migrated — fails CLOSED (404) so /thanks fires nothing.
// Responds only { ok: true|false }; never leaks row contents.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RID_REGEX = /^[A-Za-z0-9_-]{4,64}$/;

const notVerified = () => NextResponse.json({ ok: false }, { status: 404 });

export async function GET(request: NextRequest) {
  try {
    const rid = request.nextUrl.searchParams.get('rid');
    if (!rid || !RID_REGEX.test(rid)) {
      return notVerified();
    }

    // Reading waitlist_users requires the service role (no anon RLS policy);
    // key absent → fail closed until it is set in Vercel env.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return notVerified();
    }
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('waitlist_users')
      .select('created_at')
      .eq('tally_response_id', rid)
      .gte('created_at', oneHourAgo)
      .limit(1);

    if (error || !data || data.length === 0) {
      return notVerified();
    }
    return NextResponse.json({ ok: true });
  } catch {
    return notVerified();
  }
}
