// © Konectr 2026. All rights reserved.
// API route: POST /api/rsvp → creates a web RSVP for an activity

import { NextRequest, NextResponse } from 'next/server';
import { createWebRsvp } from '@/lib/supabase';
import { createHash } from 'crypto';

// Sanitize name: allow letters (including accented), spaces, hyphens, apostrophes
const NAME_REGEX = /^[\p{L}\s'\-]+$/u;

// Phone digits only (after country code is stripped)
const PHONE_DIGITS_REGEX = /^\d{7,15}$/;

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

function hashPhone(phone: string): string {
  return createHash('sha256').update(phone).digest('hex');
}

/** Normalize phone to E.164: +{countryCode}{digits} */
function normalizePhone(countryCode: string, phoneNumber: string): string {
  // Strip spaces, dashes, dots from phone number
  const digits = phoneNumber.replace(/[\s\-().]/g, '');
  // Strip leading zero (common in Malaysian numbers: 012 → 12)
  const stripped = digits.startsWith('0') ? digits.slice(1) : digits;
  // Ensure country code starts with +
  const code = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
  return `${code}${stripped}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { share_code, guest_name, phone_number, country_code } = body;

    // Validate required fields
    if (!share_code || typeof share_code !== 'string') {
      return NextResponse.json(
        { error: 'Share code is required' },
        { status: 400 }
      );
    }

    if (!guest_name || typeof guest_name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate name
    const trimmedName = guest_name.trim();
    if (trimmedName.length < 1 || trimmedName.length > 50) {
      return NextResponse.json(
        { error: 'Name must be between 1 and 50 characters' },
        { status: 400 }
      );
    }

    if (!NAME_REGEX.test(trimmedName)) {
      return NextResponse.json(
        { error: 'Name contains invalid characters' },
        { status: 400 }
      );
    }

    // Validate phone (required)
    if (!phone_number || typeof phone_number !== 'string') {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!country_code || typeof country_code !== 'string') {
      return NextResponse.json(
        { error: 'Country code is required' },
        { status: 400 }
      );
    }

    // Strip non-digit chars from phone for validation
    const cleanPhone = phone_number.replace(/[\s\-().]/g, '');
    const phoneDigits = cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone;

    if (!PHONE_DIGITS_REGEX.test(phoneDigits)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Normalize to E.164 and hash
    const e164Phone = normalizePhone(country_code, phone_number);
    const phoneHash = hashPhone(e164Phone);

    // Get activity ID from share code first
    const { getActivityByShareCode } = await import('@/lib/supabase');
    const activity = await getActivityByShareCode(share_code);

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Hash IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const ipHash = hashIp(ip);

    // Create RSVP via Supabase RPC (now with phone hash)
    const result = await createWebRsvp(activity.id, trimmedName, ipHash, phoneHash);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create RSVP';

    // Map known errors to appropriate status codes
    if (message.includes('Activity is full')) {
      return NextResponse.json({ error: 'This activity is full' }, { status: 409 });
    }
    if (message.includes('Activity has ended')) {
      return NextResponse.json({ error: 'This activity has ended' }, { status: 410 });
    }
    if (message.includes('Too many RSVPs')) {
      return NextResponse.json({ error: 'Too many RSVPs. Please try again later.' }, { status: 429 });
    }
    if (message.includes('not active')) {
      return NextResponse.json({ error: 'This activity is no longer available' }, { status: 410 });
    }

    console.error('RSVP creation error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
