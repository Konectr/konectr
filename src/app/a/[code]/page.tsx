// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from 'next';
import { headers } from 'next/headers';
import { after } from 'next/server';
import { getActivityByShareCode } from '@/lib/supabase';
import { recordShareLinkView } from '@/lib/shareLinkTelemetry';
import { formatWeekdayDate, formatTime, isLateWithdrawal } from '@/lib/datetime';
import ActivityRsvpPage from './ActivityRsvpPage';

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const activity = await getActivityByShareCode(code);

  if (!activity) {
    return {
      title: 'Activity Not Found - Konectr',
      description: 'This activity could not be found.',
    };
  }

  const venueName = activity.venue_name || 'TBD';
  // Spots framing matches the landing page + share message ("X spots left"), not
  // "joined/cap" — "0/10 spots" read as if the activity were empty/unavailable.
  const spotsLeft = Math.max(0, activity.max_participants - Number(activity.current_participants));
  const spotsText = activity.max_participants > 0
    ? (spotsLeft === 0 ? 'Full' : `${spotsLeft} ${spotsLeft === 1 ? 'spot' : 'spots'} left`)
    : `${activity.current_participants} joined`;
  const richDescription = `${formatWeekdayDate(activity.start_time)}, ${formatTime(activity.start_time)} at ${venueName} · ${spotsText} · Join ${activity.creator_name} on Konectr`;

  return {
    title: `${activity.title} - Join on Konectr`,
    description: richDescription,
    alternates: {
      canonical: `https://konectr.app/a/${code}`,
    },
    openGraph: {
      title: `${activity.title} - Konectr`,
      description: richDescription,
      url: `https://konectr.app/a/${code}`,
      type: 'website',
    },
  };
}

export default async function ActivityPreviewPage({ params }: Props) {
  const { code } = await params;
  const activity = await getActivityByShareCode(code);

  // FI-41 platform telemetry. Deliberately in the page component, NOT in
  // generateMetadata — Next calls that separately and we would double-count every
  // visit. `after()` runs this once the response has been sent, so it costs the
  // visitor nothing; recordShareLinkView swallows its own errors so telemetry can
  // never break the conversion path.
  const headerList = await headers();
  const userAgent = headerList.get('user-agent');
  const referrer = headerList.get('referer');
  after(() => recordShareLinkView({ shareCode: code, userAgent, referrer }));

  // Late-withdrawal prediction for the withdraw copy (computed server-side to keep
  // the client render pure; the cancel_web_rsvp RPC is the authoritative gate).
  const isLate = activity ? isLateWithdrawal(activity.start_time) : false;

  return <ActivityRsvpPage activity={activity} shareCode={code} isLate={isLate} />;
}
