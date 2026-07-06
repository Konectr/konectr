// © Konectr 2026. All rights reserved.
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Props {
  shareCode: string;
  token: string | null;
  activityTitle: string | null;
  venueName: string | null;
  // Within the 24h lockout? Computed server-side (render-pure); RPC stays authoritative.
  withinLock: boolean;
}

type Phase = 'idle' | 'working' | 'withdrawn' | 'flagged' | 'error';

export default function CancelRsvpClient({
  shareCode,
  token,
  activityTitle,
  venueName,
  withinLock,
}: Props) {
  const [code, setCode] = useState(token ?? '');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const t = code.trim();
    if (!t) {
      setError('Enter your claim code (looks like RSVP-XXXX).');
      setPhase('error');
      return;
    }
    setPhase('working');
    setError(null);
    try {
      const res = await fetch('/api/rsvp/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_token: t }),
      });
      const data = await res.json();
      if (data?.outcome === 'withdrawn' || data?.outcome === 'already_withdrawn') {
        setPhase('withdrawn');
      } else if (data?.outcome === 'flagged_locked') {
        setPhase('flagged');
      } else {
        setError((data && data.error) || 'Something went wrong. Please try again.');
        setPhase('error');
      }
    } catch {
      setError('Network error. Please try again.');
      setPhase('error');
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#EEE] shadow-sm p-6">
        <p className="text-[11px] uppercase tracking-wider font-semibold text-[#999] mb-1">
          Cancel RSVP
        </p>
        <h1 className="text-lg font-bold text-[#1F1F1F] leading-tight mb-1">
          {activityTitle ?? 'Your RSVP'}
        </h1>
        {venueName && <p className="text-xs text-[#777] mb-4">{venueName}</p>}

        {phase === 'withdrawn' ? (
          <div className="text-center py-2">
            <p className="text-2xl mb-2">👋</p>
            <p className="font-bold text-[#1F1F1F] mb-1">Your RSVP is cancelled</p>
            <p className="text-xs text-[#777] mb-4">
              Your spot&apos;s been freed up. Thanks for letting us know.
            </p>
            <Link
              href={`/a/${shareCode}`}
              className="text-[#FF774D] text-xs font-semibold underline underline-offset-2"
            >
              Back to the activity
            </Link>
          </div>
        ) : phase === 'flagged' ? (
          <div className="text-center py-2">
            <p className="text-2xl mb-2">🕒</p>
            <p className="font-bold text-[#1F1F1F] mb-1">We&apos;ve let the host know</p>
            <p className="text-xs text-[#777] mb-4">
              Since it&apos;s within 24 hours, your spot stays reserved — but the host and the group
              now know you can&apos;t make it.
            </p>
            <Link
              href={`/a/${shareCode}`}
              className="text-[#FF774D] text-xs font-semibold underline underline-offset-2"
            >
              Back to the activity
            </Link>
          </div>
        ) : (
          <>
            {withinLock ? (
              <p className="text-xs text-[#5A4438] leading-relaxed mb-4 bg-[#FFFBF9] border border-[#F0E0D8] rounded-lg p-3">
                This activity is within <strong>24 hours</strong>. Your spot stays reserved, but
                we&apos;ll let the host and the group know you can&apos;t make it.
              </p>
            ) : (
              <p className="text-xs text-[#777] leading-relaxed mb-4">
                Cancelling frees up your spot. You can RSVP again later if there&apos;s still room.
              </p>
            )}

            {!token && (
              <div className="mb-3">
                <label
                  htmlFor="claim"
                  className="block text-[11px] uppercase tracking-wider font-semibold text-[#999] mb-1.5"
                >
                  Your claim code
                </label>
                <input
                  id="claim"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="RSVP-XXXX"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E5E5] text-[15px] font-mono text-[#1F1F1F] placeholder:text-[#BBB] focus:outline-none focus:border-[#FF774D] focus:ring-4 focus:ring-[#FF774D]/10 transition-all"
                />
              </div>
            )}

            {phase === 'error' && <p className="text-[11px] text-[#C0392B] mb-2">{error}</p>}

            <button
              onClick={submit}
              disabled={phase === 'working'}
              className="w-full py-3 rounded-xl bg-[#FF774D] text-white text-sm font-semibold hover:bg-[#F0663C] disabled:opacity-60 transition-colors"
            >
              {phase === 'working'
                ? 'Cancelling…'
                : withinLock
                  ? 'Let the host know'
                  : 'Cancel my RSVP'}
            </button>
            <div className="text-center mt-3">
              <Link
                href={`/a/${shareCode}`}
                className="text-[11px] text-[#999] hover:text-[#FF774D] underline underline-offset-2"
              >
                Never mind, keep my RSVP
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
