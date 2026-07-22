// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

import type { MouseEvent, ReactNode } from 'react';
import type { Vibe } from './vibes';
import RsvpLayout from './RsvpLayout';
import { WhenWhereTiles, HereFor, CrewStack, TrustLine, StartedByRow } from './KineticUI';

export interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

// Controlled claim form — the page owns all state; this only renders + calls back.
export interface ClaimForm {
  name: string;
  onName: (v: string) => void;
  countryCode: string;
  onCountryCode: (v: string) => void;
  countryCodes: CountryCode[];
  phone: string;
  onPhone: (v: string) => void;
  email: string;
  showEmail: boolean;
  onShowEmail: () => void;
  onEmail: (v: string) => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: () => void;
}

export interface ClaimScreenProps {
  vibe: Vibe;
  photo: string;
  venueName: string;      // heading (auto = venue name)
  purpose: string | null; // the "Here for…" description
  timeLabel: string;
  dayLabel: string;
  venueShort: string;
  areaLabel?: string | null;
  /** Coords for the maps-directions chooser on the WHERE tile (venueName reused as the label). */
  venueLat?: number | null;
  venueLng?: number | null;
  crewNames: string[];
  crewTotal: number;
  spotsLeft: number;
  /** Who created the activity — name + optional avatar; tap opens their app profile. */
  creatorName?: string | null;
  creatorPhotoUrl?: string | null;
  creatorLinkHref?: string;
  onCreatorLinkClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  form: ClaimForm;
  /** When full: replaces the form (e.g. "this one's full" + beta CTA). */
  isFull?: boolean;
  fullSlot?: ReactNode;
  /** Rendered under the form — "or" divider + platform/beta CTAs. */
  belowForm?: ReactNode;
  /** Deep-link for existing app users; hidden when absent. */
  openInAppHref?: string;
}

// State 1 — claim a spot. Poster + responsive split handled by RsvpLayout.
export default function ClaimScreen(p: ClaimScreenProps) {
  const f = p.form;
  const submitOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && f.canSubmit && !f.isSubmitting) f.onSubmit();
  };

  return (
    <RsvpLayout vibe={p.vibe} photo={p.photo} venueName={p.venueName}>
      <WhenWhereTiles
        timeLabel={p.timeLabel}
        dayLabel={p.dayLabel}
        venueShort={p.venueShort}
        areaLabel={p.areaLabel}
        venueName={p.venueName}
        venueLat={p.venueLat}
        venueLng={p.venueLng}
      />

      {p.purpose && (
        <div className="mt-5">
          <HereFor text={p.purpose} />
        </div>
      )}

      {p.creatorName && (
        <div className="mt-4">
          <StartedByRow
            name={p.creatorName}
            photoUrl={p.creatorPhotoUrl}
            href={p.creatorLinkHref}
            onClick={p.onCreatorLinkClick}
          />
        </div>
      )}

      <div className="mt-5">
        <CrewStack names={p.crewNames} total={p.crewTotal} spotsLeft={p.spotsLeft} />
      </div>

      {p.isFull ? (
        <div className="mt-6">{p.fullSlot}</div>
      ) : (
        <>
          <div className="font-[family-name:var(--font-heading)] font-black text-[20px] -tracking-[0.02em] mt-6">
            Grab a spot <span className="text-[#FF774D]">&amp;</span> you&apos;re matched.
          </div>

          <input
            value={f.name}
            onChange={(e) => f.onName(e.target.value)}
            onKeyDown={submitOnEnter}
            maxLength={50}
            autoComplete="given-name"
            aria-label="Your first name"
            className="w-full border-[1.5px] border-[#E0E0E0] bg-white rounded-[13px] px-4 py-[15px] text-[15px] text-[#1F1F1F] mt-[11px] placeholder:text-[#737373] focus:outline-none focus:border-[#FF774D]"
            placeholder="Your first name"
          />

          <div className="flex gap-[9px] mt-[9px]">
            <div className="relative shrink-0">
              <select
                value={f.countryCode}
                onChange={(e) => f.onCountryCode(e.target.value)}
                aria-label="Country code"
                className="h-full appearance-none border-[1.5px] border-[#E0E0E0] bg-white rounded-[13px] pl-[13px] pr-7 text-[14px] font-semibold text-[#1F1F1F] focus:outline-none focus:border-[#FF774D]"
              >
                {f.countryCodes.map((cc) => (
                  <option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-[9px] top-1/2 -translate-y-1/2 text-[#B5B0AB] text-[11px]">▾</span>
            </div>
            <input
              value={f.phone}
              onChange={(e) => f.onPhone(e.target.value)}
              onKeyDown={submitOnEnter}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              required
              aria-required="true"
              aria-label="Phone number"
              className="flex-1 min-w-0 border-[1.5px] border-[#E0E0E0] bg-white rounded-[13px] px-4 py-[15px] text-[15px] text-[#1F1F1F] placeholder:text-[#737373] focus:outline-none focus:border-[#FF774D]"
              placeholder="Phone number"
            />
          </div>

          {/* Optional email disclosure */}
          {!f.showEmail ? (
            <button
              type="button"
              onClick={f.onShowEmail}
              className="mt-[10px] inline-flex items-center gap-1.5 text-[12.5px] text-[#6E6E6E] hover:text-[#FF774D] transition-colors"
            >
              <span className="text-[#8A8580]">+</span> Add email <span className="text-[#8A8580]">(get a reminder before it starts)</span>
            </button>
          ) : (
            <input
              value={f.email}
              onChange={(e) => f.onEmail(e.target.value)}
              onKeyDown={submitOnEnter}
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={254}
              aria-label="Email for a reminder"
              className="w-full border-[1.5px] border-[#E0E0E0] bg-white rounded-[13px] px-4 py-[13px] text-[15px] text-[#1F1F1F] mt-[10px] placeholder:text-[#737373] focus:outline-none focus:border-[#FF774D]"
              placeholder="Email — get a reminder"
            />
          )}

          <TrustLine />

          <button
            onClick={f.onSubmit}
            disabled={!f.canSubmit || f.isSubmitting}
            className="w-full mt-4 rounded-[15px] py-[17px] font-[family-name:var(--font-heading)] font-black text-[17px] text-white bg-[#FF774D] hover:bg-[#E6693F] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all shadow-[0_18px_40px_-12px_rgba(255,119,77,0.38)]"
          >
            {f.isSubmitting ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin align-middle" />
            ) : (
              "I'm in →"
            )}
          </button>

          {f.error && <p className="text-[12.5px] text-red-500 mt-2 text-center">{f.error}</p>}

          {p.belowForm}

          {p.openInAppHref && (
            <div className="text-center mt-[15px] text-[12.5px]">
              <a className="text-[#FF774D] font-bold" href={p.openInAppHref}>Already on Konectr? Open in the app ↗</a>
            </div>
          )}
        </>
      )}
    </RsvpLayout>
  );
}
