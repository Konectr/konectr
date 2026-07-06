// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

import { useState } from 'react';
import type { Vibe } from './vibes';

// Kinetic Brand Design System v3.0 tokens (lib/core/theme/kinetic_colors.dart):
// Sunset Orange #FF774D · Solar Amber #FFC845 · Graphite #1F1F1F · Cloud White #FAFAFA
// tint #FFF4F1 · hover #E6693F. Colour is constant; the vibe changes image + words.

export function KonectrLogo({ variant = 'white', size = 24 }: { variant?: 'white' | 'orange'; size?: number }) {
  const src = variant === 'white' ? '/logos/konectr-white.svg' : '/logos/konectr-orange.svg';
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Konectr"
      width={size}
      height={size}
      style={variant === 'white' ? { filter: 'drop-shadow(0 1px 3px rgba(0,0,0,.35))' } : undefined}
    />
  );
}

export function VibeChip({ vibe, suffix }: { vibe: Vibe; suffix?: string }) {
  return (
    <span className="inline-flex items-center gap-[7px] bg-[#FFC845] text-[#1F1F1F] font-[family-name:var(--font-heading)] font-extrabold text-[12.5px] pl-[10px] pr-[13px] py-[7px] rounded-full">
      <span className="text-[15px] leading-none">{vibe.emoji}</span>
      {vibe.name}{suffix ? ` · ${suffix}` : ''}
    </span>
  );
}

// The two match dimensions Konectr weights most — made prominent, paired.
export function WhenWhereTiles({
  timeLabel, dayLabel, venueShort, areaLabel,
}: { timeLabel: string; dayLabel: string; venueShort: string; areaLabel?: string | null }) {
  return (
    <div className="flex gap-3">
      <Tile icon="🗓️" label="WHEN" value={timeLabel} valueClass="text-[#FF774D]" sub={dayLabel} />
      <Tile icon="📍" label="WHERE" value={venueShort} sub={areaLabel} />
    </div>
  );
}

function Tile({ icon, label, value, valueClass = '', sub }: {
  icon: string; label: string; value: string; valueClass?: string; sub?: string | null;
}) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-[#F0EEEC] rounded-[18px] p-4 shadow-[0_12px_30px_-20px_rgba(31,31,31,0.28)]">
      <div className="w-9 h-9 rounded-[11px] bg-[#FFF4F1] grid place-items-center text-[18px]">{icon}</div>
      <div className="text-[10.5px] text-[#6E6E6E] font-extrabold tracking-[0.08em] mt-3">{label}</div>
      <div className={`font-[family-name:var(--font-heading)] font-black text-[20px] -tracking-[0.02em] mt-1 leading-tight truncate ${valueClass}`}>{value}</div>
      {sub && <div className="text-[12.5px] text-[#616161] font-semibold mt-[3px] truncate">{sub}</div>}
    </div>
  );
}

// The in-app "Here for…" purpose (merged title+details field): 2-line preview + expand.
export function HereFor({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#FFF4F1] rounded-[18px] p-4">
      <div className="flex items-center gap-2 font-[family-name:var(--font-heading)] font-extrabold text-[13px] text-[#E6693F]">
        <span className="text-[15px]">🎯</span> Here for…
      </div>
      <div className="flex items-end gap-3 mt-[9px]">
        <p
          className="flex-1 text-[14.5px] leading-[1.5] text-[#1F1F1F]"
          style={open ? undefined : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {text}
        </p>
        <button
          type="button"
          aria-label={open ? 'Show less' : 'See more'}
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 w-[30px] h-[30px] rounded-full bg-white border border-[#F3E4DD] grid place-items-center shadow-[0_4px_10px_-6px_rgba(31,31,31,0.3)]"
        >
          <svg className={`w-[17px] h-[17px] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="#E6693F" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Web RSVP guests are names only (no photos, by design — phone-verified, never
// public). So the crew is shown as initials in brand-tinted rings, never stock
// avatars. Falls back gracefully when the name list is empty but a count exists.
const AVATAR_TINTS = [
  { bg: '#FFE1D6', fg: '#B4441F' },
  { bg: '#FFEFC9', fg: '#9A6A00' },
  { bg: '#E3F0FF', fg: '#2E6BB8' },
  { bg: '#E6F6EC', fg: '#1F8A55' },
];

function initial(name: string): string {
  const c = name.trim().charAt(0).toUpperCase();
  return /[A-Z0-9]/.test(c) ? c : '🙂';
}

// `total` = participant count (may exceed the named list — web guests aren't all
// named). Shows up to 2 names + "& N more", up to 4 initial avatars, and — when
// there are more names than the preview — taps open to reveal the full list.
export function CrewStack({ names, total, spotsLeft }: { names: string[]; total: number; spotsLeft: number }) {
  const [open, setOpen] = useState(false);
  const preview = names.slice(0, 2);
  const avatars = names.slice(0, 4);
  const moreCount = Math.max(0, total - preview.length);
  const totalVerb = total === 1 ? 'is in' : 'are in';
  const expandable = names.length > preview.length;

  const summary = (
    <>
      {avatars.length > 0 && (
        <div className="flex shrink-0">
          {avatars.map((n, i) => {
            const t = AVATAR_TINTS[i % AVATAR_TINTS.length];
            return (
              <span
                key={`${n}-${i}`}
                className="w-9 h-9 rounded-full grid place-items-center shadow-[0_0_0_2.5px_#FAFAFA] -ml-3 first:ml-0 font-[family-name:var(--font-heading)] font-extrabold text-[13px]"
                style={{ background: t.bg, color: t.fg }}
              >
                {initial(n)}
              </span>
            );
          })}
        </div>
      )}
      <div className="flex-1 text-[13.5px] text-[#616161] min-w-0 text-left">
        {preview.length > 0 ? (
          <>
            <b className="font-[family-name:var(--font-heading)] font-bold text-[#1F1F1F]">{preview.join(', ')}</b>
            {moreCount > 0 ? ` & ${moreCount} more ${totalVerb}` : ` ${totalVerb}`}
          </>
        ) : total > 0 ? (
          <span><b className="font-[family-name:var(--font-heading)] font-bold text-[#1F1F1F]">{total}</b> {totalVerb}</span>
        ) : (
          <span>Be the first to grab a spot</span>
        )}
      </div>
      {expandable && (
        <svg
          className={`shrink-0 w-[18px] h-[18px] text-[#9E9E9E] transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      )}
    </>
  );

  return (
    <div>
      <div className="flex items-center gap-3">
        {expandable ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            {summary}
          </button>
        ) : (
          <div className="flex items-center gap-3 flex-1 min-w-0">{summary}</div>
        )}
        {spotsLeft > 0 && (
          <span className="shrink-0 bg-[#FFF4F1] text-[#B4441F] font-extrabold text-[11.5px] px-[11px] py-[6px] rounded-full whitespace-nowrap">
            {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
          </span>
        )}
      </div>

      {open && (
        <ul className="mt-3 ml-1 space-y-2">
          {names.map((name, i) => (
            <li key={`${name}-${i}`} className="flex items-center gap-2.5 text-[14px] text-[#1F1F1F]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF774D] shrink-0" />
              {name}
            </li>
          ))}
          {total > names.length && (
            <li className="flex items-center gap-2.5 text-[14px] text-[#616161]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E0DCD8] shrink-0" />
              + {total - names.length} more
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export function TrustLine() {
  return (
    <div className="flex items-center gap-[7px] text-[11.5px] text-[#6B6B6B] mt-[11px] font-medium">
      <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="#1FA463" strokeWidth={2.3}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
      Phone-verified — real people only, never public
    </div>
  );
}
