// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// Ad-pixel consent + loader, mounted once in the root layout.
// - Renders NOTHING unless at least one pixel is configured via env
//   (NEXT_PUBLIC_META_PIXEL_ID / NEXT_PUBLIC_GOOGLE_ADS_ID), so the site is
//   byte-identical until the ad accounts exist.
// - Pixels load ONLY after explicit opt-in (localStorage 'konectr_consent'),
//   per docs/PRE_LAUNCH_MARKETING_COMPLIANCE.md (web-only pixels, post-opt-in).
//   PostHog (cookieless) and Contentsquare are NOT gated here — see /cookies.
// - Page views fire from the pathname effect (init snippets have auto
//   page-view disabled) so SPA navigations are counted exactly once.

'use client';

import { useCallback, useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const CONSENT_KEY = 'konectr_consent';

type Consent = 'granted' | 'denied' | null;

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function AdsConsent() {
  const configured = Boolean(META_PIXEL_ID || GOOGLE_ADS_ID);
  // 'pending' = not read yet (SSR + first client render — banner hidden, no
  // hydration mismatch). null = read, no stored choice → show the banner.
  const [consent, setConsent] = useState<Consent | 'pending'>('pending');
  const pathname = usePathname();

  useEffect(() => {
    if (!configured) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable post-hydration; runs once
    setConsent(readConsent());
  }, [configured]);

  const choose = useCallback((value: Exclude<Consent, null>) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // storage unavailable — treat as session-only choice
    }
    setConsent(value);
  }, []);

  const pixelsOn = configured && consent === 'granted';

  // One page-view per navigation (init snippets have auto page-view off).
  useEffect(() => {
    if (!pixelsOn) return;
    window.fbq?.('track', 'PageView');
    window.gtag?.('event', 'page_view');
  }, [pixelsOn, pathname]);

  if (!configured) return null;

  return (
    <>
      {pixelsOn && META_PIXEL_ID && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', ${JSON.stringify(META_PIXEL_ID)});`,
          }}
        />
      )}
      {pixelsOn && GOOGLE_ADS_ID && (
        <>
          <Script
            id="gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config', ${JSON.stringify(GOOGLE_ADS_ID)}, {send_page_view:false});`,
            }}
          />
        </>
      )}
      {consent === null && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 inset-x-0 z-[100] bg-[#1F1F1F] text-white px-6 py-4"
        >
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm text-white/90 flex-1">
              Can we set cookies to measure whether our ads work? Analytics
              details in our{' '}
              <Link href="/cookies" className="underline text-[#FFC845]">
                Cookie policy
              </Link>
              .
            </p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => choose('denied')}
                className="px-4 py-2 text-sm rounded-lg border border-white/30 text-white/90 hover:bg-white/10"
              >
                No thanks
              </button>
              <button
                onClick={() => choose('granted')}
                className="px-4 py-2 text-sm rounded-lg bg-[#FF774D] text-white font-semibold hover:bg-[#FF774D]/90"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
