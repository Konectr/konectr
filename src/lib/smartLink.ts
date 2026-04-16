// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import type { MouseEvent } from 'react';

type Platform = 'ios' | 'android' | 'desktop';

const WAITLIST_FALLBACK = 'https://konectr.app/#waitlist';
const DEEP_LINK_FALLBACK_MS = 2000;

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

function getStoreUrl(platform: Platform): string {
  const ios = process.env.NEXT_PUBLIC_IOS_STORE_URL || WAITLIST_FALLBACK;
  const android = process.env.NEXT_PUBLIC_ANDROID_STORE_URL || WAITLIST_FALLBACK;
  switch (platform) {
    case 'ios': return ios;
    case 'android': return android;
    case 'desktop': return WAITLIST_FALLBACK;
  }
}

export interface SmartDownloadProps {
  href: string;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Build props for a Download CTA that tries the Konectr deep link first
 * (so users who already have the app open it directly on the activity),
 * then falls back to the platform store (or waitlist if stores unset).
 *
 * SSR-safe: `href` uses the desktop fallback for initial render; the real
 * per-platform decision happens in `onClick` where `navigator` is available.
 *
 * Fallback URLs are read from:
 * - `NEXT_PUBLIC_IOS_STORE_URL`
 * - `NEXT_PUBLIC_ANDROID_STORE_URL`
 * Either unset → waitlist page.
 */
export function getSmartDownloadProps(shareCode: string): SmartDownloadProps {
  return {
    href: WAITLIST_FALLBACK,
    onClick: (e) => {
      e.preventDefault();
      if (typeof window === 'undefined') return;

      const platform = detectPlatform();
      const storeUrl = getStoreUrl(platform);

      if (platform === 'desktop') {
        window.location.href = storeUrl;
        return;
      }

      const deepLink = `konectr://activity/${shareCode}`;

      // If the deep link succeeds, the page loses visibility; cancel fallback.
      const fallback = window.setTimeout(() => {
        window.location.href = storeUrl;
      }, DEEP_LINK_FALLBACK_MS);

      const onVisibilityChange = () => {
        if (document.hidden) {
          window.clearTimeout(fallback);
          document.removeEventListener('visibilitychange', onVisibilityChange);
        }
      };
      document.addEventListener('visibilitychange', onVisibilityChange);

      window.location.href = deepLink;
    },
  };
}

/**
 * Variant for the referral page — same logic but deep-links to
 * `konectr://referral/{code}` instead of `konectr://activity/{code}`.
 */
export function getSmartReferralDownloadProps(code: string): SmartDownloadProps {
  const base = getSmartDownloadProps(code);
  return {
    ...base,
    onClick: (e) => {
      e.preventDefault();
      if (typeof window === 'undefined') return;

      const platform = detectPlatform();
      const storeUrl = getStoreUrl(platform);

      if (platform === 'desktop') {
        window.location.href = storeUrl;
        return;
      }

      const deepLink = `konectr://referral/${code}`;
      const fallback = window.setTimeout(() => {
        window.location.href = storeUrl;
      }, DEEP_LINK_FALLBACK_MS);

      const onVisibilityChange = () => {
        if (document.hidden) {
          window.clearTimeout(fallback);
          document.removeEventListener('visibilitychange', onVisibilityChange);
        }
      };
      document.addEventListener('visibilitychange', onVisibilityChange);

      window.location.href = deepLink;
    },
  };
}
