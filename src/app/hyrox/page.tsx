// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getActiveCampaign,
  getVenuesByTag,
  getPublicActivitiesByTag,
} from '@/lib/supabase';
import { klWallClock } from '@/lib/datetime';
import HyroxContent from './HyroxContent';

// ISR: gym directory + upcoming sessions are slow-moving. 5-minute revalidation
// absorbs Threads/IG click bursts and keeps the countdown honest to the day.
export const revalidate = 300;

// Dedup the campaign fetch across generateMetadata + the page (one round-trip
// per request under ISR). The active instance (city/dates/tags/copy) lives in
// the `campaigns` DB row — no hardcoded "KL Dec 2026" literals here.
const getCampaign = cache(getActiveCampaign);

// Whole days from "now" (KL date) to event day. Server-computed under ISR 300,
// so day granularity is stable between revalidations.
function daysUntilEvent(eventStartIso: string): number {
  const klNow = klWallClock();
  const todayKL = new Date(klNow.getFullYear(), klNow.getMonth(), klNow.getDate());
  const race = new Date(eventStartIso);
  const raceKL = new Date(race.getFullYear(), race.getMonth(), race.getDate());
  const ms = raceKL.getTime() - todayKL.getTime();
  return Math.max(0, Math.round(ms / (24 * 60 * 60 * 1000)));
}

export async function generateMetadata(): Promise<Metadata> {
  const campaign = await getCampaign();
  if (!campaign) return {};

  const title = `${campaign.short_label} Training Partners & Gyms in ${campaign.country ?? 'Malaysia'} | Konectr`;
  const description =
    `Training for ${campaign.sponsor ? `${campaign.sponsor} ` : ''}${campaign.race_name} (${campaign.date_label})? ` +
    `Find HYROX certified and HYROX-style gyms across ${campaign.country ?? 'Malaysia'}, and join live training ` +
    `sessions near you on Konectr. Don't train alone.`;
  const ogTitle = `${campaign.short_label} — Find Your Training Partner | Konectr`;

  return {
    title,
    description,
    alternates: {
      canonical: 'https://konectr.app/hyrox',
    },
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      url: 'https://konectr.app/hyrox',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
    },
  };
}

export default async function HyroxPage() {
  const campaign = await getCampaign();
  if (!campaign) notFound();

  const [sessions, certifiedGyms, styleGyms] = await Promise.all([
    getPublicActivitiesByTag(campaign.tag_name),
    getVenuesByTag(campaign.certified_tag ?? 'hyrox-certified'),
    getVenuesByTag(campaign.style_tag ?? 'hyrox-style'),
  ]);

  return (
    <HyroxContent
      campaign={campaign}
      countdownDays={daysUntilEvent(campaign.event_start)}
      sessions={sessions}
      certifiedGyms={certifiedGyms}
      styleGyms={styleGyms}
    />
  );
}
