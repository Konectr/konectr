'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// iOS beta CTA for the /a/[code] share page.
//
// Two modes, auto-switched by NEXT_PUBLIC_TESTFLIGHT_URL:
//  - Pre-launch (env UNSET, until TestFlight public link goes live ~Jun 24):
//    "Konectr App (beta)" expands an inline panel to REQUEST a beta invite
//    (email capture → /api/testflight-request → waitlist_users).
//  - Live (env SET): the same button opens the TestFlight public link directly.

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'konectr_testflight_request_email';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Set via Vercel env when the TestFlight public link is generated (App Store
// Connect → TestFlight → External Testing → "Enable Public Link"). Until then
// the button captures requests instead of opening a (non-existent) link.
const TESTFLIGHT_URL = process.env.NEXT_PUBLIC_TESTFLIGHT_URL || '';
const HAS_TESTFLIGHT = TESTFLIGHT_URL.length > 0;

function trackBetaClick(mode: 'request' | 'open') {
  if (typeof window === 'undefined') return;
  const ph = (window as unknown as { posthog?: { capture?: (e: string, p?: Record<string, unknown>) => void } }).posthog;
  ph?.capture?.('clicked_beta_cta', { mode, source: 'rsvp_page' });
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

interface Props {
  shareCode: string;
  activityId?: string;
  variant?: 'full' | 'compact';
}

export default function TestFlightRequestCTA({ shareCode, activityId, variant = 'full' }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEmail(stored);
        setSubmitted(true);
        setOpen(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmed) || trimmed.length > 254) {
      setError('Please enter a valid email');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/testflight-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          share_code: shareCode,
          activity_id: activityId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      try {
        localStorage.setItem(STORAGE_KEY, trimmed);
      } catch {
        // ignore
      }
      setSubmitted(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [email, shareCode, activityId]);

  const buttonClasses =
    variant === 'full'
      ? 'flex items-center justify-center gap-2 w-full bg-[#1F1F1F] text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-sm'
      : 'inline-flex items-center gap-2 bg-[#1F1F1F] text-white py-2.5 px-5 rounded-xl text-sm font-semibold hover:bg-black transition-colors';

  // --- Live mode: button opens the TestFlight public link directly. ---
  if (HAS_TESTFLIGHT) {
    return (
      <a
        href={TESTFLIGHT_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackBetaClick('open')}
        className={buttonClasses}
      >
        <AppleIcon />
        Konectr App (beta)
      </a>
    );
  }

  // --- Pre-launch mode: request an invite (email capture). ---
  return (
    <div className={variant === 'full' ? 'w-full' : ''}>
      <button
        type="button"
        onClick={() => {
          if (!open) trackBetaClick('request');
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        className={buttonClasses}
      >
        <AppleIcon />
        Konectr App (beta)
      </button>

      {open && (
        submitted ? (
          <div className="mt-3 bg-[#FFF8F0] border border-[#FFC845] rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg">🧪</span>
              <span className="font-bold text-[#1F1F1F] text-sm">Request received!</span>
            </div>
            <p className="text-xs text-[#666] leading-relaxed">
              We&apos;ll send your TestFlight invite to{' '}
              <strong className="text-[#1F1F1F]">{email}</strong> as soon as the beta opens.
              In the meantime, the host will keep you posted.
            </p>
          </div>
        ) : (
          <div className="mt-3 bg-[#FFF8F0] border border-[#FFE5C2] rounded-xl p-4 text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🧪</span>
              <span className="font-bold text-[#1F1F1F] text-sm">Request beta access</span>
            </div>
            <p className="text-xs text-[#666] mb-3 leading-relaxed">
              The Konectr iPhone app is in private TestFlight beta. Drop your email and
              we&apos;ll send your invite the moment a spot opens.
            </p>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !submitting && handleSubmit()}
              maxLength={254}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-sm text-[#1F1F1F] placeholder:text-[#BBB] focus:outline-none focus:border-[#FF774D] focus:ring-1 focus:ring-[#FF774D] transition-colors mb-2"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !email.trim()}
              className="w-full px-4 py-2.5 bg-[#FF774D] text-white rounded-lg text-sm font-bold hover:bg-[#E5693F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Request my invite'
              )}
            </button>
            {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
          </div>
        )
      )}
    </div>
  );
}
