'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'konectr_android_waitlist_email';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Props {
  shareCode: string;
  activityId?: string;
}

export default function AndroidWaitlistCTA({ shareCode, activityId }: Props) {
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
          Konectr launches on Android. In the meantime, the host will keep you posted via WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] border border-[#FFE5C2] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🤖</span>
        <span className="font-bold text-[#1F1F1F] text-sm">Coming soon to Android</span>
      </div>
      <p className="text-xs text-[#666] mb-3 leading-relaxed">
        Konectr is iOS-only for now. Drop your email and we&apos;ll let you know
        the moment the Android app is live.
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
        className="w-full px-4 py-2.5 bg-[#FF774D] text-white rounded-lg text-sm font-bold hover:bg-[#E5693F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
