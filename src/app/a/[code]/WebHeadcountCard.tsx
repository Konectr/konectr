'use client';

// © Konectr 2026. All rights reserved.
// PF-42 "still in?" card for web guests — same card the app pins above its
// composer. Polls /api/headcount every 15s while open; hidden when there is no
// headcount or it has closed (the chat's grey lines carry the close).
// "I'm out" hands off to the page's existing withdraw sheet.

import { useCallback, useEffect, useState } from 'react';

interface Person { name: string; web: boolean }

export interface WebHeadcount {
  id: string;
  state: 'posted' | 'armed' | 'closed';
  result: 'on' | 'ended' | null;
  floor: number;
  arms_at: string;
  closes_at: string;
  start_time: string | null;
  venue_name: string | null;
  confirmed: Person[];
  pending: Person[];
  confirmed_count: number;
  pending_count: number;
  me_in: boolean;
}

interface Props {
  claimToken: string;
  onOut: () => void;
}

const POLL_MS = 15_000;
const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function clock(d: Date): string {
  const h12 = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
  const suffix = d.getHours() < 12 ? 'AM' : 'PM';
  return d.getMinutes() === 0 ? `${h12} ${suffix}` : `${h12}:${String(d.getMinutes()).padStart(2, '0')} ${suffix}`;
}

export function headcountQuestion(h: WebHeadcount, now = new Date()): string {
  if (!h.start_time) return 'Still in?';
  const start = new Date(h.start_time);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const diff = Math.round((day.getTime() - today.getTime()) / 86_400_000);
  const word = diff === 0 ? 'today' : diff === 1 ? 'tomorrow' : WEEKDAY[start.getDay()];
  return `Still in ${word}?`;
}

export function headcountClock(h: WebHeadcount, now = new Date()): string {
  const closes = new Date(h.closes_at);
  if (h.state !== 'armed') return `Locks ${WEEKDAY_SHORT[closes.getDay()]} ${clock(closes)}`;
  const mins = Math.floor((closes.getTime() - now.getTime()) / 60_000);
  if (mins <= 0) return 'Closing';
  if (mins < 60) return `Closes in ${mins}m`;
  return `Closes in ${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function WebHeadcountCard({ claimToken, onOut }: Props) {
  const [hc, setHc] = useState<WebHeadcount | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/headcount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_token: claimToken }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setHc(data.headcount ?? null);
    } catch {
      /* keep the last card; a poll miss is not an error worth showing */
    }
  }, [claimToken]);

  useEffect(() => {
    load();
    const poll = setInterval(load, POLL_MS);
    const tick = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => { clearInterval(poll); clearInterval(tick); };
  }, [load]);

  const answer = useCallback(async (isIn: boolean) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/headcount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_token: claimToken, in: isIn }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Could not record your answer'); load(); return; }
      setHc(data.headcount ?? null);
    } catch {
      setError('Network error — please try again');
    } finally {
      setBusy(false);
    }
  }, [busy, claimToken, load]);

  if (!hc || hc.state === 'closed') return null;

  const armed = hc.state === 'armed';
  const start = hc.start_time ? new Date(hc.start_time) : null;
  const subtitle = [hc.venue_name, start ? clock(start) : null, 'unchanged'].filter(Boolean).join(' · ');
  const total = hc.confirmed_count + hc.pending_count;
  const faces = [
    ...hc.confirmed.slice(0, 4).map((p) => ({ ...p, in: true })),
    ...hc.pending.slice(0, Math.max(0, 4 - Math.min(4, hc.confirmed.length))).map((p) => ({ ...p, in: false })),
  ];

  return (
    <div
      className="bg-white rounded-2xl border border-[#FF774D] shadow-[0_4px_14px_rgba(0,0,0,0.08)] px-3.5 pt-3 pb-2.5 mb-3"
      role="group"
      aria-label={`Headcount: ${headcountQuestion(hc)} ${hc.confirmed_count} in, ${hc.pending_count} pending`}
    >
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF774D]" />
        <span className="text-[10px] font-semibold tracking-[0.12em] text-[#FF774D]">HEADCOUNT</span>
        <span className={`ml-auto text-[11px] font-semibold ${armed ? 'text-[#FF774D]' : 'text-[#616161]'}`}>
          {armed ? '⏱ ' : '🕒 '}{headcountClock(hc)}
        </span>
      </div>
      <h4 className="mt-2 text-[15px] font-semibold text-[#1F1F1F] leading-snug">{headcountQuestion(hc)}</h4>
      <p className="mt-0.5 text-[12px] text-[#616161]">{subtitle}</p>

      {hc.me_in ? (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-[#FFF4F1] px-3 py-2">
          <span className="text-[12.5px] font-semibold text-[#1F1F1F]">You&apos;re in · {hc.confirmed_count} of {total}</span>
          <button onClick={() => answer(false)} disabled={busy} className="text-[12px] font-semibold text-[#FF774D] disabled:opacity-50">Change</button>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => answer(true)}
            disabled={busy}
            className="flex-1 h-[38px] rounded-xl bg-[#FF774D] text-[#1F1F1F] text-[13px] font-semibold disabled:opacity-50"
          >
            I&apos;m in
          </button>
          <button
            onClick={onOut}
            disabled={busy}
            className="flex-1 h-[38px] rounded-xl border border-[#E0E0E0] text-[#1F1F1F] text-[13px] font-semibold disabled:opacity-50"
          >
            I&apos;m out
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-[11px] text-[#C44536]">{error}</p>}

      <div className="mt-2.5 pt-2 border-t border-[#F0F0F0] flex items-center gap-2">
        {faces.length > 0 && (
          <div className="flex">
            {faces.map((p, i) => (
              <span
                key={`${p.name}-${i}`}
                className={`w-[22px] h-[22px] -mr-1.5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold ${
                  p.in ? 'bg-[#10B981] text-[#1F1F1F]' : 'bg-[#F5F5F5] text-[#9E9E9E]'
                }`}
                title={p.name}
              >
                {((p.name ?? '').trim().charAt(0) || '?').toUpperCase()}
              </span>
            ))}
          </div>
        )}
        <span className="text-[12px] text-[#616161] ml-1.5">
          {hc.confirmed_count} in · {hc.pending_count === 0 ? 'everyone answered' : `${hc.pending_count} pending`}
        </span>
      </div>
    </div>
  );
}
