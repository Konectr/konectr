// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from 'next';
import { getActivityByShareCode } from '@/lib/supabase';
import ActivityRsvpPage from './ActivityRsvpPage';

// Konectr is Malaysia-only: activity times are always shown in Asia/Kuala_Lumpur
// (fixed GMT+8). This metadata renders on the server (Vercel = UTC), so the timeZone
// must be pinned explicitly or the OG card would show UTC. Stored times are true UTC.
const MYT_TZ = 'Asia/Kuala_Lumpur';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: MYT_TZ,
  });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: MYT_TZ,
  });
}

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
  const richDescription = `${formatDate(activity.start_time)}, ${formatTime(activity.start_time)} at ${venueName} · ${spotsText} · Join ${activity.creator_name} on Konectr`;

  return {
    title: `${activity.title} - Join on Konectr`,
    description: richDescription,
    openGraph: {
      title: `${activity.title} - Konectr`,
      description: richDescription,
      type: 'website',
    },
  };
}

export default async function ActivityPreviewPage({ params }: Props) {
  const { code } = await params;
  const activity = await getActivityByShareCode(code);

  return <ActivityRsvpPage activity={activity} shareCode={code} />;
}
