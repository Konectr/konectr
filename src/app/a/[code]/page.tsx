// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from 'next';
import { headers } from 'next/headers';
import { after } from 'next/server';
import { getActivityByShareCode, getIndexablePlans, getUpcomingPublicPlans, type SharedActivity } from '@/lib/supabase';
import { recordShareLinkView } from '@/lib/shareLinkTelemetry';
import { isLateWithdrawal } from '@/lib/datetime';
import ActivityRsvpPage from './ActivityRsvpPage';
import { buildShareMetadata } from './shareMetadata';
import { isPlanOver } from './planStatus';

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
  return buildShareMetadata(activity, code);
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
  // A redacted women-only plan has no start_time here; the client works it out
  // once the guest's plan is unlocked.
  const isLate = activity?.start_time ? isLateWithdrawal(activity.start_time) : false;

  // Dead-end states (23% of human views landed on an ended plan, 30d to
  // 2026-09-23) get the next few joinable plans. Same "over" rule as the client.
  const isOver = !activity || isPlanOver(activity.status, activity.end_time);
  const upcomingPlans = isOver ? await getUpcomingPublicPlans(code) : [];
  // No Event JSON-LD for a women-only plan, whatever the indexable list says.
  const indexable =
    !isOver &&
    !activity?.women_only &&
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
