// © Konectr 2026. All rights reserved.
// Standalone cancel page: /a/[code]/cancel?token=RSVP-XXXX
// For guests arriving from an email "can't make it?" link (no localStorage / different device).

import { Metadata } from 'next';
import { getActivityByShareCode } from '@/lib/supabase';
import CancelRsvpClient from './CancelRsvpClient';

export const metadata: Metadata = {
  title: 'Cancel your RSVP - Konectr',
  robots: { index: false, follow: false },
};

// Within the 24h cancellation lockout? (helper keeps the impure clock read out of
// the component render body — the cancel_web_rsvp RPC is the authoritative gate.)
function isWithinCancelLock(startTime: string): boolean {
  return new Date(startTime).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;
}

type Props = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function CancelRsvpPage({ params, searchParams }: Props) {
  const { code } = await params;
  const { token } = await searchParams;
  const activity = await getActivityByShareCode(code);

  // 24h-lockout prediction (server-side → render-pure); RPC is the authoritative gate.
  const withinLock = activity ? isWithinCancelLock(activity.start_time) : false;

  return (
    <CancelRsvpClient
      shareCode={code}
      token={token ?? null}
      activityTitle={activity?.title ?? null}
      venueName={activity?.venue_name ?? null}
      withinLock={withinLock}
    />
  );
}
