'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// App Store / Google Play buttons (share pages /a, /h, /hyrox and the home footer).
// iOS → App Store, Android → Google Play, desktop or not-yet-detected → both.
// Replaced the TestFlight request + Android waitlist CTAs once both stores went
// live (2026-10-01, BUGLOG BUG-008).

import { ANDROID_STORE_URL, IOS_STORE_URL, type Platform } from '@/lib/smartLink';

type Store = 'ios' | 'android';

// Event name kept from the beta era so existing PostHog funnels stay continuous.
function trackStoreClick(store: Store, source: string) {
  if (typeof window === 'undefined') return;
  const ph = (window as unknown as { posthog?: { capture?: (e: string, p?: Record<string, unknown>) => void } }).posthog;
  ph?.capture?.('clicked_beta_cta', { mode: 'open', platform: store, source });
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2L3.7 2.2l-.1.1z" />
      <path d="M16.1 15.6 13 12.5v-.2l3.1-3.1.1.1 3.7 2.1c1 .6 1 1.6 0 2.2l-3.7 2.1-.1-.1z" />
      <path d="M16.2 15.5 13 12.3 3.6 21.7c.3.4.9.4 1.5.1l11.1-6.3" />
      <path d="M16.2 8.5 5.1 2.2c-.6-.4-1.2-.3-1.5.1L13 11.7l3.2-3.2z" />
    </svg>
  );
}

const BUTTON_CLASSES = {
  full: 'flex items-center justify-center gap-2 w-full bg-[#1F1F1F] text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-sm',
  compact: 'inline-flex items-center gap-2 bg-[#1F1F1F] text-white py-2.5 px-5 rounded-xl text-sm font-semibold hover:bg-black transition-colors',
};

function StoreButton({ store, variant, source }: { store: Store; variant: 'full' | 'compact'; source: string }) {
  return (
    <a
      href={store === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackStoreClick(store, source)}
      className={BUTTON_CLASSES[variant]}
    >
      {store === 'ios' ? <AppleIcon /> : <PlayIcon />}
      {store === 'ios' ? 'Download on the App Store' : 'Get it on Google Play'}
    </a>
  );
}

export default function StoreCTAs({
  platform,
  variant = 'full',
  source = 'rsvp_page',
}: {
  platform: Platform | null;
  variant?: 'full' | 'compact';
  source?: string;
}) {
  if (platform === 'ios' || platform === 'android') {
    return <StoreButton store={platform} variant={variant} source={source} />;
  }
  return (
    <div className={variant === 'full' ? 'grid gap-2' : 'flex flex-wrap justify-center gap-2'}>
      <StoreButton store="ios" variant={variant} source={source} />
      <StoreButton store="android" variant={variant} source={source} />
    </div>
  );
}
