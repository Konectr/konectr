import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getActivityByShareCode } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

// Brand assets
const LOGO_ORANGE = 'https://cdn.prod.website-files.com/6857df346d4e4bd260786fbd/686328457e3945d8a146fbaf_Konectr_Orange_SSVG_2.avif';
const LOGO_WHITE = 'https://cdn.prod.website-files.com/6857df346d4e4bd260786fbd/68632845dc59b4147eb517f6_Konectr_NoBG_Logo.svg';
const LOGO_ICON_ORANGE = '/logos/konectr-icon-orange.svg';

// Category emoji mapping (synced with mobile app)
const categoryEmojis: Record<string, string> = {
  cafe: '☕',
  restaurant: '🍽️',
  bar: '🍻',
  fitness: '💪',
  outdoors: '🌳',
  entertainment: '🎭',
  chill: '☕',
  active: '💪',
  focus: '🎯',
  creative: '🎨',
  adventure: '⛰️',
  social: '🎉',
};

function getCategoryEmoji(category: string): string {
  return categoryEmojis[category.toLowerCase()] || '📌';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function getTimeOfDay(dateString: string): string {
  const date = new Date(dateString);
  const hour = date.getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

function isActivityEnded(startTime: string): boolean {
  const activityDate = new Date(startTime);
  const now = new Date();
  return activityDate < now;
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

  return {
    title: `${activity.title} - Join on Konectr`,
    description: `Join ${activity.creator_name} for ${activity.title} on ${formatDate(activity.start_time)}. Download Konectr to connect!`,
    openGraph: {
      title: `${activity.title} - Konectr`,
      description: `${activity.creator_name} is hosting ${activity.title}. Join them on Konectr!`,
      type: 'website',
    },
  };
}

export default async function ActivityPreviewPage({ params }: Props) {
  const { code } = await params;
  const activity = await getActivityByShareCode(code);

  if (!activity) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          {/* Logo */}
          <Link href="/">
            <Image
              src={LOGO_ORANGE}
              alt="Konectr"
              width={120}
              height={32}
              className="mx-auto mb-6"
              unoptimized
            />
          </Link>

          {/* Not Found State */}
          <div className="mb-6">
            <div className="text-5xl mb-3">🔍</div>
            <h1 className="text-xl font-bold text-[#1F1F1F] mb-2">
              Activity not found
            </h1>
            <p className="text-[#666] text-sm">
              This link may have expired or the activity was removed.
            </p>
          </div>

          {/* Download CTA */}
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#1F1F1F] text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download Konectr
          </a>
        </div>

        {/* Footer */}
        <p className="mt-6 text-[#999] text-xs">
          <Link href="/" className="hover:text-[#FF774D]">konectr.app</Link> · The Offline First App
        </p>
      </div>
    );
  }

  const ended = isActivityEnded(activity.start_time);
  const emoji = getCategoryEmoji(activity.category);
  const deepLink = `konectr://activity/${code}`;

  if (ended) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          {/* Logo */}
          <Link href="/">
            <Image
              src={LOGO_ORANGE}
              alt="Konectr"
              width={120}
              height={32}
              className="mx-auto mb-6"
              unoptimized
            />
          </Link>

          {/* Ended State */}
          <div className="mb-6">
            <div className="text-5xl mb-3">⏰</div>
            <h1 className="text-xl font-bold text-[#1F1F1F] mb-2">
              This activity has ended
            </h1>
            <p className="text-[#666] text-sm">
              Download the app to discover more activities.
            </p>
          </div>

          {/* Download CTA - iOS only */}
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#1F1F1F] text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download on App Store
          </a>
        </div>

        {/* Footer */}
        <p className="mt-6 text-[#999] text-xs">
          <Link href="/" className="hover:text-[#FF774D]">konectr.app</Link> · The Offline First App
        </p>
      </div>
    );
  }

  // Active Activity - Minimal Card
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Logo Header - Solid Sunset Orange with white pill */}
        <div className="bg-[#FF774D] py-6 px-4">
          <Link href="/">
            <div className="w-14 h-14 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Image
                src={LOGO_ICON_ORANGE}
                alt="Konectr"
                width={36}
                height={36}
                unoptimized
              />
            </div>
          </Link>
        </div>

        {/* Activity Card - Minimal */}
        <div className="p-5">
          {/* Activity Name with Emoji */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#FFF5F2] rounded-xl flex items-center justify-center text-2xl shrink-0">
              {emoji}
            </div>
            <h1 className="text-lg font-bold text-[#1F1F1F] leading-tight">
              {activity.title}
            </h1>
          </div>

          {/* Details - Compact */}
          <div className="space-y-2.5 text-sm text-[#1F1F1F]">
            {/* Hosted by */}
            <div className="flex items-center gap-2.5">
              <span className="text-[#999] w-5 text-center">👤</span>
              <span>Hosted by <strong>{activity.creator_name}</strong></span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2.5">
              <span className="text-[#999] w-5 text-center">📅</span>
              <span>{formatDate(activity.start_time)} · {getTimeOfDay(activity.start_time)}</span>
            </div>

            {/* Location */}
            {activity.venue_name && (
              <div className="flex items-center gap-2.5">
                <span className="text-[#FF774D] w-5 text-center">📍</span>
                <span>{activity.venue_name}</span>
              </div>
            )}
          </div>

          {/* Download CTA - iOS only, smaller */}
          <div className="mt-5 pt-4 border-t border-[#F0F0F0]">
            <a
              href="#"
              className="flex items-center justify-center gap-2 w-full bg-[#1F1F1F] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on App Store
            </a>
          </div>

          {/* Open in App */}
          <div className="mt-4 text-center">
            <p className="text-[#999] text-xs mb-1">Already have the app?</p>
            <a
              href={deepLink}
              className="inline-flex items-center gap-1.5 text-[#FF774D] font-medium text-sm hover:underline"
            >
              Open in Konectr
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-[#999] text-xs">
        <Link href="/" className="hover:text-[#FF774D]">konectr.app</Link> · The Offline First App
      </p>
    </div>
  );
}
