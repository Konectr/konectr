// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import Image from 'next/image';
import Link from 'next/link';
import type { Platform } from '@/lib/smartLink';
import type { UpcomingPlan } from '@/lib/supabase';
import { formatTime, getRelativeDayPhrase } from '@/lib/datetime';
import AndroidWaitlistCTA from '../AndroidWaitlistCTA';
import TestFlightRequestCTA from '../TestFlightRequestCTA';
import Footer from './Footer';

const LOGO_ICON_ORANGE = '/logos/konectr-icon-orange.svg';

// Venue-type emojis, synced with the app's category_reference.dart.
const VENUE_EMOJI: Record<string, string> = {
  cafe: '☕',
  restaurant: '🍽️',
  bar: '🍻',
  fitness: '💪',
  outdoors: '⛰️',
  entertainment: '🎭',
};

// Shared full-screen layout for the terminal RSVP states (Not Found / Ended):
// centered logo + emoji + copy + a platform-aware download / beta CTA. When
// `plans` is non-empty (ended / not-found), the next joinable plans sit above
// the CTA so a dead link still leads somewhere.
export default function SimpleStateLayout({
  emoji,
  title,
  subtitle,
  platform,
  shareCode,
  activityId,
  plans = [],
}: {
  emoji: string;
  title: string;
  subtitle: string;
  platform: Platform | null;
  shareCode: string;
  activityId?: string;
  plans?: UpcomingPlan[];
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#FFF5F2] flex items-center justify-center">
            <Image src={LOGO_ICON_ORANGE} alt="Konectr" width={20} height={20} unoptimized />
          </div>
          <span className="text-base font-bold text-[#1F1F1F]">Konectr</span>
        </Link>
        <div className="mb-6">
          <div className="text-5xl mb-3">{emoji}</div>
          <h1 className="text-xl font-bold text-[#1F1F1F] mb-2">{title}</h1>
          <p className="text-[#666] text-sm leading-relaxed">{subtitle}</p>
        </div>
        {plans.length > 0 && (
          <ul className="mb-6 space-y-2.5 text-left">
            {plans.map((plan) => (
              <li key={plan.share_code}>
                <Link
                  href={`/a/${plan.share_code}`}
                  className="flex items-center gap-3 min-h-14 rounded-xl border border-[#EFEFEF] px-3 py-2.5 hover:border-[#FF774D] transition-colors"
                >
                  <span className="w-10 h-10 shrink-0 rounded-lg bg-[#FFF5F2] grid place-items-center text-xl" aria-hidden>
                    {VENUE_EMOJI[(plan.venue_type ?? '').toLowerCase()] ?? '📌'}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold text-[#1F1F1F] truncate">{plan.title}</span>
                    <span className="block text-[13px] text-[#616161] truncate">
                      {getRelativeDayPhrase(plan.start_time)} · {formatTime(plan.start_time)}
                      {plan.venue_name ? ` · ${plan.venue_name}` : ''}
                    </span>
                  </span>
                  <span className="shrink-0 text-[12px] font-bold text-[#C2410C]">
                    {plan.spots_available} {plan.spots_available === 1 ? 'spot' : 'spots'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {platform === 'android' ? (
          <AndroidWaitlistCTA shareCode={shareCode} activityId={activityId} />
        ) : (
          <TestFlightRequestCTA shareCode={shareCode} activityId={activityId} variant="compact" />
        )}
      </div>
      <Footer />
    </div>
  );
}
