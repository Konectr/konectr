// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// Public HYROX campaign hub (konectr.app/hyrox). Landing target for all
// Threads/IG marketing. Server-rendered directory of HYROX gyms + live upcoming
// HYROX training sessions on Konectr + app CTAs. City/dates/labels come from the
// active `campaigns` row (get_active_campaign) — no hardcoded instance literals.
//
// Kinetic Brand Design System v3.0 tokens (same palette as /leaderboard +
// /a/[code]/redesign): Sunset Orange #FF774D · Solar Amber #FFC845 ·
// Graphite #1F1F1F · Cloud White #FAFAFA · tint #FFF4F1 · hover #E6693F.

import type { Campaign, CampaignActivity, CampaignVenue } from '@/lib/supabase';
import { formatTime, formatWeekdayDate } from '@/lib/datetime';
import TestFlightRequestCTA from '../a/[code]/TestFlightRequestCTA';
import AndroidWaitlistCTA from '../a/[code]/AndroidWaitlistCTA';

function truncate(text: string, max = 120): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trimEnd() + '…';
}

function firstName(name: string | null): string {
  if (!name) return 'A member';
  return name.trim().split(/\s+/)[0] || 'A member';
}

// Group venues by city, ordered by the campaign's city_order then alphabetical;
// venues within a city sorted by name (the RPC already orders by city, name —
// this makes the grouping explicit and stable regardless of RPC ordering).
function groupByCity(
  venues: CampaignVenue[],
  cityOrder: string[],
): { city: string; venues: CampaignVenue[] }[] {
  const rank = (city: string): number => {
    const i = cityOrder.indexOf(city);
    return i === -1 ? cityOrder.length : i;
  };
  const map = new Map<string, CampaignVenue[]>();
  for (const v of venues) {
    const city = (v.city && v.city.trim()) || 'Other';
    if (!map.has(city)) map.set(city, []);
    map.get(city)!.push(v);
  }
  return Array.from(map.entries())
    .map(([city, list]) => ({
      city,
      venues: list.slice().sort((a, b) => a.venue_name.localeCompare(b.venue_name)),
    }))
    .sort((a, b) => {
      const ra = rank(a.city);
      const rb = rank(b.city);
      if (ra !== rb) return ra - rb;
      return a.city.localeCompare(b.city);
    });
}

function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

// ---------------------------------------------------------------------------
// Session card
// ---------------------------------------------------------------------------
function SessionCard({ session }: { session: CampaignActivity }) {
  const spots = session.spots_available;
  const spotsLabel =
    spots <= 0 ? 'Full' : `${spots} ${spots === 1 ? 'spot' : 'spots'} left`;

  return (
    <a
      href={`/a/${session.share_code}`}
      className="block bg-white border border-[#F0EEEC] rounded-[18px] p-5 shadow-[0_14px_38px_-26px_rgba(31,31,31,0.35)] hover:border-[#FF774D] transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-[family-name:var(--font-heading)] font-extrabold text-[16.5px] leading-tight -tracking-[0.01em] text-[#1F1F1F]">
          {session.title}
        </h3>
        <span
          className={`shrink-0 text-[11px] font-extrabold uppercase tracking-[0.05em] px-2.5 py-1 rounded-full ${
            spots <= 0
              ? 'bg-[#F5F3F1] text-[#9E9E9E]'
              : 'bg-[#FFF4F1] text-[#E6693F]'
          }`}
        >
          {spotsLabel}
        </span>
      </div>

      {session.details && (
        <p className="mt-2 text-[13.5px] leading-[1.5] text-[#616161]">
          {truncate(session.details)}
        </p>
      )}

      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[#444] font-medium">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>📅</span>
          {formatWeekdayDate(session.start_time)} · {formatTime(session.start_time)}
        </span>
        {session.venue_name && (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden>📍</span>
            {session.venue_name}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[12.5px] text-[#6B6B6B] font-medium">
          Started by {firstName(session.creator_display_name)}
        </span>
        <span className="text-[13px] font-[family-name:var(--font-heading)] font-extrabold text-[#FF774D]">
          Join →
        </span>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Gym tier group
// ---------------------------------------------------------------------------
function GymTier({
  title,
  subtitle,
  venues,
  cityOrder,
}: {
  title: string;
  subtitle: string;
  venues: CampaignVenue[];
  cityOrder: string[];
}) {
  if (venues.length === 0) return null;
  const groups = groupByCity(venues, cityOrder);

  return (
    <div className="mt-8 first:mt-0">
      <h3 className="font-[family-name:var(--font-heading)] font-black text-[18px] -tracking-[0.02em] text-[#1F1F1F]">
        {title}
      </h3>
      <p className="mt-0.5 text-[13px] text-[#6B6B6B] font-medium">{subtitle}</p>

      {groups.map((group) => (
        <div key={group.city} className="mt-5">
          <div className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#9E9E9E]">
            {group.city}
          </div>
          <ul className="mt-2 space-y-2">
            {group.venues.map((v) => (
              <li
                key={v.venue_id}
                className="bg-white border border-[#F0EEEC] rounded-[14px] px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-[family-name:var(--font-heading)] font-extrabold text-[15px] text-[#1F1F1F]">
                      {v.venue_name}
                    </div>
                    {v.address && (
                      <div className="mt-0.5 text-[12.5px] leading-[1.45] text-[#6B6B6B]">
                        {v.address}
                      </div>
                    )}
                  </div>
                  {v.website && (
                    <a
                      href={normalizeUrl(v.website)}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="shrink-0 text-[12.5px] font-bold text-[#FF774D] hover:text-[#E6693F] transition-colors"
                    >
                      {prettyUrl(v.website).length > 22 ? 'Website ↗' : `${prettyUrl(v.website)} ↗`}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function HyroxContent({
  campaign,
  countdownDays,
  sessions,
  certifiedGyms,
  styleGyms,
}: {
  campaign: Campaign;
  countdownDays: number;
  sessions: CampaignActivity[];
  certifiedGyms: CampaignVenue[];
  styleGyms: CampaignVenue[];
}) {
  const hasSessions = sessions.length > 0;
  const hasAnyGym = certifiedGyms.length > 0 || styleGyms.length > 0;
  const country = campaign.country ?? 'Malaysia';

  return (
    <main className="min-h-[100dvh] bg-[#FAFAFA]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="bg-[#FF774D] px-5 pt-6 pb-16">
        <div className="max-w-[560px] mx-auto">
          <a href="https://konectr.app" className="inline-flex items-center gap-2">
            <span className="bg-white rounded-full px-3 py-1.5 inline-flex items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/konectr-icon-orange.svg" alt="" width={16} height={16} />
              <span className="font-[family-name:var(--font-heading)] font-extrabold text-[13px] text-[#1F1F1F]">
                Konectr
              </span>
            </span>
          </a>

          <h1 className="mt-5 font-[family-name:var(--font-heading)] font-black text-[30px] sm:text-[34px] leading-[1.08] -tracking-[0.02em] text-white">
            Training for {campaign.race_name}?
          </h1>
          <p className="mt-2.5 text-[14px] sm:text-[15px] text-white/90 font-semibold">
            {campaign.date_label} · {campaign.venue_label}
          </p>

          {countdownDays > 0 && (
            <div className="mt-5 inline-flex items-baseline gap-2 bg-white/15 backdrop-blur-sm rounded-full pl-3 pr-4 py-2">
              <span className="font-[family-name:var(--font-heading)] font-black text-[22px] text-white leading-none">
                {countdownDays}
              </span>
              <span className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-white/85">
                {countdownDays === 1 ? 'day' : 'days'} to race day
              </span>
            </div>
          )}

          <p className="mt-6 font-[family-name:var(--font-heading)] font-extrabold text-[17px] leading-snug text-white">
            Don&apos;t train alone — find your training partner on Konectr.
          </p>
        </div>
      </header>

      <div className="max-w-[560px] mx-auto px-5 -mt-9 pb-16">
        {/* ── Upcoming training sessions (hidden entirely when empty) ─────── */}
        {hasSessions && (
          <section className="bg-white border border-[#F0EEEC] rounded-[22px] shadow-[0_18px_44px_-24px_rgba(31,31,31,0.3)] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-[20px]">🏋️</span>
              <h2 className="font-[family-name:var(--font-heading)] font-black text-[20px] -tracking-[0.02em] text-[#1F1F1F]">
                Upcoming training sessions
              </h2>
            </div>
            <p className="mt-1 text-[13.5px] text-[#616161] font-medium">
              Live HYROX training on Konectr — tap to join.
            </p>
            <div className="mt-5 space-y-3">
              {sessions.map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          </section>
        )}

        {/* ── Find a HYROX gym in Malaysia ────────────────────────────────── */}
        <section className={`${hasSessions ? 'mt-6' : ''} bg-white border border-[#F0EEEC] rounded-[22px] shadow-[0_18px_44px_-24px_rgba(31,31,31,0.3)] p-5 sm:p-6`}>
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-[20px]">📍</span>
            <h2 className="font-[family-name:var(--font-heading)] font-black text-[20px] -tracking-[0.02em] text-[#1F1F1F]">
              Find a HYROX gym in {country}
            </h2>
          </div>

          {hasAnyGym ? (
            <div className="mt-5">
              <GymTier
                title="HYROX Certified"
                subtitle="Official partner gyms with certified equipment and stations."
                venues={certifiedGyms}
                cityOrder={campaign.city_order}
              />
              <GymTier
                title="HYROX-style training"
                subtitle="Gyms running functional-fitness training built for HYROX."
                venues={styleGyms}
                cityOrder={campaign.city_order}
              />
            </div>
          ) : (
            <div className="mt-4 bg-[#FFF4F1] rounded-[16px] p-5 text-center">
              <div className="text-[30px]">🏗️</div>
              <p className="mt-2 font-[family-name:var(--font-heading)] font-extrabold text-[15px] text-[#1F1F1F]">
                Directory coming online
              </p>
              <p className="mt-1.5 text-[13.5px] leading-[1.5] text-[#616161]">
                We&apos;re mapping HYROX certified and HYROX-style gyms across {country}
                {' '}right now. Check back soon — or get the app and start a training
                session at your own gym.
              </p>
            </div>
          )}
        </section>

        {/* ── App CTA ─────────────────────────────────────────────────────── */}
        <section className="mt-6 bg-[#1F1F1F] rounded-[22px] p-6 sm:p-7 text-center">
          <h2 className="font-[family-name:var(--font-heading)] font-black text-[21px] -tracking-[0.02em] text-white">
            Find your HYROX training partner
          </h2>
          <p className="mt-2 text-[14px] leading-[1.55] text-white/75">
            Konectr matches you with people near you who are training for the same
            race. Real people, real sessions, phone-verified.
          </p>

          <div className="mt-5 max-w-[340px] mx-auto">
            <TestFlightRequestCTA shareCode={campaign.tag_name} variant="full" />
          </div>

          <div className="mt-4 max-w-[340px] mx-auto text-left">
            <AndroidWaitlistCTA shareCode={campaign.tag_name} />
          </div>
        </section>

        {/* ── Footer disclaimer (from campaign row, verbatim) ─────────────── */}
        <footer className="mt-8 text-center">
          <p className="text-[11.5px] leading-[1.55] text-[#9E9E9E] font-medium">
            {campaign.disclaimer}
          </p>
          <p className="mt-4 text-[12px] text-[#9E9E9E] font-medium">
            <a href="https://konectr.app" className="hover:text-[#FF774D] transition-colors">
              konectr.app
            </a>{' '}
            · The Offline First App
          </p>
        </footer>
      </div>
    </main>
  );
}
