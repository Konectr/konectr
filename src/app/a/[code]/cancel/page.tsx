// © Konectr 2026. All rights reserved.
// Standalone cancel page: /a/[code]/cancel?token=<guest token> (audit C2: never the RSVP-XXXX code)
// For guests arriving from an email "can't make it?" link (no localStorage / different device).

import { Metadata } from 'next';
import { getActivityByShareCode, getWebGuestPlan, type WebGuestPlan } from '@/lib/supabase';
import { isLateWithdrawal } from '@/lib/datetime';
import CancelRsvpClient from './CancelRsvpClient';

export const metadata: Metadata = {
  title: 'Cancel your RSVP - Konectr',
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function CancelRsvpPage({ params, searchParams }: Props) {
  const { code } = await params;
  const { token } = await searchParams;
  const activity = await getActivityByShareCode(code);

  // PF-46: a women-only plan's share payload has no venue or time. The guest
  // token in this link is hers, so read them from her own plan instead.
  let guestPlan: WebGuestPlan | null = null;
  if (activity?.redacted && token) {
    try {
      const plan = await getWebGuestPlan(token);
      if (plan?.activity_id === activity.id) guestPlan = plan;
    } catch {
      // Copy falls back to "Your RSVP"; the cancel RPC doesn't need any of this.
    }
  }
  const startTime = activity?.start_time ?? guestPlan?.start_time ?? null;

  // Late-withdrawal prediction (server-side → render-pure); RPC is the authoritative gate.
  const isLate = startTime ? isLateWithdrawal(startTime) : false;

  return (
    <CancelRsvpClient
      shareCode={code}
      token={token ?? null}
      activityTitle={activity?.title ?? guestPlan?.title ?? null}
      venueName={activity?.venue_name ?? guestPlan?.venue_name ?? null}
      isLate={isLate}
    />
  );
}
