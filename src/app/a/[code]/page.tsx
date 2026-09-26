// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from 'next';
import { headers } from 'next/headers';
import { after } from 'next/server';
import { getActivityByShareCode, getIndexablePlans, getUpcomingPublicPlans, type SharedActivity } from '@/lib/supabase';
import { SHARE_OG_IMAGE } from '@/lib/metadata';
import { recordShareLinkView } from '@/lib/shareLinkTelemetry';
import { formatWeekdayDate, formatTime, isActivityEnded, isLateWithdrawal } from '@/lib/datetime';
import ActivityRsvpPage from './ActivityRsvpPage';

type Props = {
  params: Promise<{ code: string }>;
};

// schema.org Event so search and AI answer engines can cite the plan. Plan
// facts only: no starter name, photo or coordinates (plans, never people).
function eventJsonLd(activity: SharedActivity, code: string) {
  const url = `https://konectr.app/a/${code}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: activity.title,
    ...(activity.details ? { description: activity.details } : {}),
    startDate: activity.start_time,
    endDate: activity.end_time,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: activity.venue_name,
      address: { '@type': 'PostalAddress', addressCountry: 'MY' },
    },
    offers: {
      '@type': 'Offer',
      url,
      price: 0,
      priceCurrency: 'MYR',
      availability: 'https://schema.org/InStock',
    },
    organizer: { '@type': 'Organization', name: 'Konectr', url: 'https://konectr.app' },
    url,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const activity = await getActivityByShareCode(code);

  // A dead or mistyped share code still gets pasted into WhatsApp, so this
  // branch needs the preview card too.
  if (!activity) {
    return {
      title: 'Activity Not Found - Konectr',
      description: 'This activity could not be found.',
      openGraph: {
        title: 'Konectr',
        description: 'This activity could not be found.',
        url: `https://konectr.app/a/${code}`,
        type: 'website',
        images: [SHARE_OG_IMAGE],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Konectr',
        description: 'This activity could not be found.',
        images: [SHARE_OG_IMAGE.url],
        site: '@konectrapp',
      },
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
      images: [SHARE_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${activity.title} - Konectr`,
      description: richDescription,
      images: [SHARE_OG_IMAGE.url],
      site: '@konectrapp',
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

  // Dead-end states (23% of human views landed on an ended plan, 30d to
  // 2026-09-23) get the next few joinable plans. Same "over" rule as the client.
  const isOver =
    !activity ||
    activity.status === 'expired' ||
    activity.status === 'cancelled' ||
    isActivityEnded(activity.end_time);
  const upcomingPlans = isOver ? await getUpcomingPublicPlans(code) : [];
  const indexable =
    !isOver &&
    (await getIndexablePlans()).some((p) => p.share_code.toUpperCase() === code.toUpperCase());

  return (
    <>
      {indexable && activity && (
        <script
          type="application/ld+json"
          // Title/details are user-written: escape `<` so they can't close the tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventJsonLd(activity, code)).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <ActivityRsvpPage
        activity={activity}
        shareCode={code}
        isLate={isLate}
        upcomingPlans={upcomingPlans}
      />
    </>
  );
}
