// © Konectr 2026. All rights reserved.
// GET /api/calendar/{shareCode} — returns an .ics file for the activity.
// Universal calendar import (Apple Calendar, Google Calendar, Outlook all read .ics).
// Anonymous (no auth) — same as the share page itself.

import { NextRequest, NextResponse } from 'next/server';
import { getActivityByShareCode } from '@/lib/supabase';

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

export async function GET(
  _request: NextRequest,
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

  const dtStart = toIcsDate(activity.start_time);
  const dtEnd = toIcsDate(activity.end_time);
  const dtStamp = toIcsDate(new Date().toISOString());

  const url = `https://konectr.app/a/${activity.share_code}`;
  const summary = escapeIcsText(activity.title);
  const location = escapeIcsText(activity.venue_name || 'Konectr activity');
  const description = escapeIcsText(
    `Hosted by ${activity.creator_name} on Konectr.\n\n${activity.description || ''}\n\nView activity: ${url}`
  );

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
      'Cache-Control': 'public, max-age=300, must-revalidate',
    },
  });
}
