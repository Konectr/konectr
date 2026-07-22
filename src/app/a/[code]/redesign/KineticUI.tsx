// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

import { useState, useEffect, type MouseEvent, type ReactNode } from 'react';
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
// The WHERE tile is tappable when we know the venue/coords: it opens a small
// chooser to navigate in Apple Maps / Google Maps / Waze.
export function WhenWhereTiles({
  timeLabel, dayLabel, venueShort, areaLabel, venueName, venueLat, venueLng,
}: {
  timeLabel: string; dayLabel: string; venueShort: string; areaLabel?: string | null;
  venueName?: string | null; venueLat?: number | null; venueLng?: number | null;
}) {
  const [mapsOpen, setMapsOpen] = useState(false);
  const hasCoords = venueLat != null && venueLng != null;
  const canOpenMaps = hasCoords || !!(venueName && venueName.trim());
  return (
    <>
      <div className="flex gap-3">
        <Tile icon="🗓️" label="WHEN" value={timeLabel} valueClass="text-[#FF774D]" sub={dayLabel} />
        <Tile
          icon="📍"
          label="WHERE"
          value={venueShort}
          sub={areaLabel}
          onClick={canOpenMaps ? () => setMapsOpen(true) : undefined}
          actionHint="Directions"
        />
      </div>
      {mapsOpen && (
        <MapsSheet
          venueName={(venueName && venueName.trim()) || venueShort}
          lat={venueLat ?? null}
          lng={venueLng ?? null}
          onClose={() => setMapsOpen(false)}
        />
      )}
    </>
  );
}

function Tile({ icon, label, value, valueClass = '', sub, onClick, actionHint }: {
  icon: string; label: string; value: string; valueClass?: string; sub?: string | null;
  onClick?: () => void; actionHint?: string;
}) {
  const cls = 'flex-1 min-w-0 bg-white border border-[#F0EEEC] rounded-[18px] p-4 shadow-[0_12px_30px_-20px_rgba(31,31,31,0.28)]';
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-[11px] bg-[#FFF4F1] grid place-items-center text-[18px]">{icon}</div>
        {onClick && (
          <span className="inline-flex items-center gap-[3px] text-[10.5px] font-extrabold text-[#E6693F] mt-1">
            {actionHint}
            <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H9M17 7v8" />
            </svg>
          </span>
        )}
      </div>
      <div className="text-[10.5px] text-[#6E6E6E] font-extrabold tracking-[0.08em] mt-3">{label}</div>
      <div className={`font-[family-name:var(--font-heading)] font-black text-[20px] -tracking-[0.02em] mt-1 leading-tight truncate ${valueClass}`}>{value}</div>
      {sub && <div className="text-[12.5px] text-[#616161] font-semibold mt-[3px] truncate">{sub}</div>}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${label}: ${value} — get directions`}
        className={`${cls} text-left active:scale-[0.98] transition-transform hover:border-[#F3C6B6]`}
      >
        {inner}
      </button>
    );
  }
  return <div className={cls}>{inner}</div>;
}

// Bottom-sheet chooser for opening the venue in a maps app. The web can't fire
// the native OS app-picker, so we present the three common targets explicitly.
// Uses coords when we have them (exact pin), else a venue-name search.
export function MapsSheet({ venueName, lat, lng, onClose }: {
  venueName: string; lat: number | null; lng: number | null; onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const hasCoords = lat != null && lng != null;
  const coordQ = hasCoords ? `${lat},${lng}` : '';
  const nameQ = encodeURIComponent(venueName);
  const apple = hasCoords ? `https://maps.apple.com/?ll=${coordQ}&q=${nameQ}` : `https://maps.apple.com/?q=${nameQ}`;
  const google = `https://www.google.com/maps/search/?api=1&query=${hasCoords ? coordQ : nameQ}`;
  const waze = hasCoords ? `https://waze.com/ul?ll=${coordQ}&navigate=yes` : `https://waze.com/ul?q=${nameQ}&navigate=yes`;

  const options = [
    { name: 'Apple Maps', href: apple, emoji: '🗺️' },
    { name: 'Google Maps', href: google, emoji: '📍' },
    { name: 'Waze', href: waze, emoji: '🚗' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="Open in maps"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-[360px] bg-white rounded-t-[22px] sm:rounded-[22px] p-4 pb-6 shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-10 h-1 rounded-full bg-[#E5E1DD] mb-3 sm:hidden" />
        <div className="font-[family-name:var(--font-heading)] font-black text-[16px] text-[#1F1F1F] px-1">Get directions</div>
        <div className="text-[13px] text-[#6E6E6E] px-1 mt-0.5 mb-3 truncate">{venueName}</div>
        <div className="space-y-2">
          {options.map((o) => (
            <a
              key={o.name}
              href={o.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 w-full bg-[#FAFAFA] hover:bg-[#FFF4F1] border border-[#F0EEEC] rounded-[14px] px-4 py-[14px] transition-colors"
            >
              <span className="text-[20px]">{o.emoji}</span>
              <span className="flex-1 font-bold text-[14.5px] text-[#1F1F1F]">{o.name}</span>
              <svg className="w-[16px] h-[16px] text-[#B5B0AB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 py-[13px] rounded-[14px] text-[14px] font-bold text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Turn a raw URL into a short, human label: host (no www) + first path segment,
// no query/hash. e.g. https://www.instagram.com/luckycoffeebar?igsh=… → instagram.com/luckycoffeebar
function linkLabel(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    const seg = u.pathname.split('/').filter(Boolean)[0];
    const label = seg ? `${host}/${seg}` : host;
    return label.length > 30 ? `${label.slice(0, 29)}…` : label;
  } catch {
    return url;
  }
}

// The stored "Here for…" text is often a raw pasted blob with inline URLs and
// emoji. Linkify URLs into short, tappable labels (stripping ugly query strings)
// while keeping the surrounding text and line breaks intact.
function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(https?:\/\/[^\s]+)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    let url = m[0];
    let trail = '';
    const tm = url.match(/[).,;!?'"]+$/); // don't swallow trailing punctuation into the link
    if (tm) { trail = tm[0]; url = url.slice(0, url.length - trail.length); }
    out.push(
      <a
        key={key++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#E6693F] font-semibold underline decoration-[#F3C6B6] underline-offset-2 break-words"
      >
        {linkLabel(url)} ↗
      </a>,
    );
    if (trail) out.push(trail);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
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
          className="flex-1 min-w-0 text-[14.5px] leading-[1.5] text-[#1F1F1F] whitespace-pre-line break-words"
          style={open ? undefined : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {linkify(text)}
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

// Who started this — attribution only (Konectr has no host role). The creator
// has a real account (unlike web guests), so a real photo may exist; falls back
// to an initial ring in the brand tint. Tapping tries the app (public profile)
// and falls back to the beta/waitlist path.
export function StartedByRow({
  name,
  photoUrl,
  href,
  onClick,
}: {
  name: string;
  photoUrl?: string | null;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const t = AVATAR_TINTS[0];

  const body = (
    <>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatar comes from the Supabase public CDN; next/image remote-pattern config not worth it for a 28px thumb
        <img
          src={photoUrl}
          alt=""
          className="w-7 h-7 rounded-full object-cover shadow-[0_0_0_2px_#FAFAFA] shrink-0"
        />
      ) : (
        <span
          className="w-7 h-7 rounded-full grid place-items-center font-[family-name:var(--font-heading)] font-extrabold text-[11px] shadow-[0_0_0_2px_#FAFAFA] shrink-0"
          style={{ background: t.bg, color: t.fg }}
        >
          {initial(firstName)}
        </span>
      )}
      <span className="text-[13px] text-[#616161]">
        Started by{' '}
        <b className="font-[family-name:var(--font-heading)] font-bold text-[#1F1F1F]">{firstName}</b>
      </span>
      {href && (
        <svg
          className="w-[14px] h-[14px] text-[#B5B0AB] shrink-0"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </>
  );

  if (!href) {
    return <div className="flex items-center gap-[9px]">{body}</div>;
  }
  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={`View ${firstName}'s profile in the Konectr app`}
      className="flex items-center gap-[9px] group hover:opacity-80 transition-opacity"
    >
      {body}
    </a>
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
