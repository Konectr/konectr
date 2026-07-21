// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import Image from 'next/image';
import Link from 'next/link';
import type { Platform } from '@/lib/smartLink';
import AndroidWaitlistCTA from '../AndroidWaitlistCTA';
import TestFlightRequestCTA from '../TestFlightRequestCTA';
import Footer from './Footer';

const LOGO_ICON_ORANGE = '/logos/konectr-icon-orange.svg';

// Shared full-screen layout for the terminal RSVP states (Not Found / Ended):
// centered logo + emoji + copy + a platform-aware download / beta CTA.
export default function SimpleStateLayout({
  emoji,
  title,
  subtitle,
  platform,
  shareCode,
  activityId,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  platform: Platform | null;
  shareCode: string;
  activityId?: string;
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
