// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from 'next';
import { getActivityByShareCode } from '@/lib/supabase';
import ActivityRsvpPage from './ActivityRsvpPage';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
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
  const spotsText = activity.max_participants > 0
    ? `${activity.current_participants}/${activity.max_participants} spots`
    : `${activity.current_participants} joined`;
  const richDescription = `${formatDate(activity.start_time)} at ${venueName} · ${spotsText} · Join ${activity.creator_name} on Konectr`;

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
