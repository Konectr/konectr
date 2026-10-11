// © Konectr 2026. All rights reserved.
// GET /api/calendar/{shareCode} — returns an .ics file for the activity.
// Universal calendar import (Apple Calendar, Google Calendar, Outlook all read .ics).
// Anonymous (no auth) — same as the share page itself.
//
// PF-46: a women-only plan's share payload has no venue or time, so its .ics
// needs ?token=<guest token> and is built from get_web_guest_plan, i.e. only
// for a guest who RSVP'd to that plan.

import { NextRequest, NextResponse } from 'next/server';
import { getActivityByShareCode, getWebGuestPlan, type WebGuestPlan } from '@/lib/supabase';

function toIcsDate(iso: string): string {
  // Convert "2026-05-01T11:00:00+00:00" -> "20260501T110000Z"
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function escapeIcsText(value: string): string {
  // RFC 5545: backslash, comma, semicolon need escaping; newlines become \n
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\r?\n/g, '\\n');
}

// The guest's own plan for a women-only share code, or null when the token is
// missing, unknown, withdrawn/removed, or belongs to a different plan.
async function guestPlanFor(token: string | null, shareCode: string): Promise<WebGuestPlan | null> {
  // web_rsvp_guest_tokens.token = encode(gen_random_bytes(32), 'hex')
  if (!token || !/^[A-Fa-f0-9]{64}$/.test(token)) return null;
  try {
    const plan = await getWebGuestPlan(token);
    return plan && plan.share_code.toUpperCase() === shareCode.toUpperCase() ? plan : null;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  if (!code || !/^[A-Z0-9]{4,12}$/i.test(code)) {
    return NextResponse.json({ error: 'Invalid share code' }, { status: 400 });
  }

  const activity = await getActivityByShareCode(code);
  if (!activity) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  }

  let event: {
    title: string | null;
    venueName: string | null;
    startTime: string | null;
    endTime: string | null;
    about: string;
  };
  if (activity.women_only || activity.redacted) {
    const plan = await guestPlanFor(request.nextUrl.searchParams.get('token'), activity.share_code);
    // Same answer for "no token" and "wrong token": nothing about the plan.
    if (!plan) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    event = {
      title: plan.title,
      venueName: plan.venue_name,
      startTime: plan.start_time,
      endTime: plan.end_time,
      about: `A women-only activity on Konectr.\n\n${plan.details || ''}`,
    };
  } else {
    event = {
      title: activity.title,
      venueName: activity.venue_name,
      startTime: activity.start_time,
      endTime: activity.end_time,
      about: `Started by ${activity.creator_name} on Konectr.\n\n${activity.details || activity.description || ''}`,
    };
  }

  // Never emit NaN dates: a calendar app rejects (or misfiles) the whole file.
  if (!event.startTime || !event.endTime) {
    return NextResponse.json({ error: 'Activity time not available' }, { status: 404 });
  }

  const dtStart = toIcsDate(event.startTime);
  const dtEnd = toIcsDate(event.endTime);
  const dtStamp = toIcsDate(new Date().toISOString());

  const url = `https://konectr.app/a/${activity.share_code}`;
  const summary = escapeIcsText(event.title ?? event.venueName ?? 'Konectr activity');
  const location = escapeIcsText(event.venueName || 'Konectr activity');
  const description = escapeIcsText(`${event.about}\n\nView activity: ${url}`);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Konectr//Activity//EN',
    'METHOD:PUBLISH',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:konectr-${activity.share_code}@konectr.app`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    `URL:${url}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return new NextResponse(lines, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="konectr-${activity.share_code}.ics"`,
      // A women-only .ics is per-guest: never let a shared cache serve it.
      'Cache-Control': activity.women_only || activity.redacted
        ? 'private, no-store'
        : 'public, max-age=300, must-revalidate',
    },
  });
}
