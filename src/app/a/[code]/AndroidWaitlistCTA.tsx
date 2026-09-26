'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { useState, useEffect, useCallback } from 'react';
import { getUtmFields } from '@/lib/attribution';
import { ANDROID_STORE_URL, HAS_ANDROID_STORE } from '@/lib/smartLink';

const STORAGE_KEY = 'konectr_android_waitlist_email';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Props {
  shareCode: string;
  activityId?: string;
}

function trackPlayClick() {
  if (typeof window === 'undefined') return;
  const ph = (window as unknown as { posthog?: { capture?: (e: string, p?: Record<string, unknown>) => void } }).posthog;
  ph?.capture?.('clicked_beta_cta', { mode: 'open', platform: 'android', source: 'rsvp_page' });
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

// Live mode (NEXT_PUBLIC_ANDROID_STORE_URL set): the app is on Google Play, so
// every Android branch on the RSVP page turns into a store button. Same switch
// as TestFlightRequestCTA — the waitlist form below stays the fallback.
function PlayStoreCTA() {
  return (
    <a
      href={ANDROID_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackPlayClick}
      className="flex items-center justify-center gap-2 w-full bg-[#1F1F1F] text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-sm"
    >
      <PlayIcon />
      Get it on Google Play
    </a>
  );
}

export default function AndroidWaitlistCTA({ shareCode, activityId }: Props) {
  if (HAS_ANDROID_STORE) return <PlayStoreCTA />;
  return <AndroidWaitlistForm shareCode={shareCode} activityId={activityId} />;
}

function AndroidWaitlistForm({ shareCode, activityId }: Props) {
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
      const res = await fetch('/api/android-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          share_code: shareCode,
          activity_id: activityId,
          ...getUtmFields(),
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

  if (submitted) {
    return (
      <div className="bg-[#FFF8F0] border border-[#FFC845] rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-lg">🤖</span>
          <span className="font-bold text-[#1F1F1F] text-sm">You&apos;re on the list!</span>
        </div>
        <p className="text-xs text-[#666] leading-relaxed">
          We&apos;ll email <strong className="text-[#1F1F1F]">{email}</strong> the moment
          Konectr launches on Android. In the meantime, the crew will keep you posted via WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] border border-[#FFE5C2] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🤖</span>
        <span className="font-bold text-[#1F1F1F] text-sm">Android: closed testing</span>
      </div>
      <p className="text-xs text-[#666] mb-3 leading-relaxed">
        Konectr for Android is in closed testing on Google Play. Drop your email
        and we&apos;ll add you, and tell you when the public listing is live.
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
        onClick={handleSubmit}
        disabled={submitting || !email.trim()}
        className="w-full px-4 py-2.5 bg-[#FF774D] text-[#1F1F1F] rounded-lg text-sm font-bold hover:bg-[#E5693F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? (
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          'Notify me when Android launches'
        )}
      </button>
      {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}
