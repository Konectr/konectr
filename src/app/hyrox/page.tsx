// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from 'next';
import { getVenuesByTag, getPublicActivitiesByTag } from '@/lib/supabase';
import HyroxContent from './HyroxContent';

// ISR: gym directory + upcoming sessions are slow-moving. 5-minute revalidation
// absorbs Threads/IG click bursts and keeps the countdown honest to the day.
export const revalidate = 300;

// Konectr is Malaysia-only: countdown + session times pinned to Asia/Kuala_Lumpur.
const MYT_TZ = 'Asia/Kuala_Lumpur';

// AirAsia HYROX Kuala Lumpur — race day 1 (MITEC). Fixed GMT+8 midnight.
const RACE_DATE_ISO = '2026-12-12T00:00:00+08:00';

// Whole days from "now" (KL date) to race day. Server-computed under ISR 300,
// so day granularity is stable between revalidations.
function daysUntilRace(): number {
  const now = new Date();
  const klNow = new Date(now.toLocaleString('en-US', { timeZone: MYT_TZ }));
  const todayKL = new Date(klNow.getFullYear(), klNow.getMonth(), klNow.getDate());
  const race = new Date(RACE_DATE_ISO);
  const raceKL = new Date(race.getFullYear(), race.getMonth(), race.getDate());
  const ms = raceKL.getTime() - todayKL.getTime();
  return Math.max(0, Math.round(ms / (24 * 60 * 60 * 1000)));
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'HYROX KL Training Partners & Gyms in Malaysia | Konectr';
  const description =
    "Training for AirAsia HYROX Kuala Lumpur (Dec 12–13, 2026)? Find HYROX certified and HYROX-style gyms across Malaysia, and join live training sessions near you on Konectr. Don't train alone.";
  return {
    title,
    description,
    alternates: {
      canonical: 'https://konectr.app/hyrox',
    },
    openGraph: {
      title: 'HYROX KL — Find Your Training Partner | Konectr',
      description,
      type: 'website',
      url: 'https://konectr.app/hyrox',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'HYROX KL — Find Your Training Partner | Konectr',
      description,
    },
  };
}

export default async function HyroxPage() {
  const [sessions, certifiedGyms, styleGyms] = await Promise.all([
    getPublicActivitiesByTag('hyrox'),
    getVenuesByTag('hyrox-certified'),
    getVenuesByTag('hyrox-style'),
  ]);

  return (
    <HyroxContent
      countdownDays={daysUntilRace()}
      sessions={sessions}
      certifiedGyms={certifiedGyms}
      styleGyms={styleGyms}
    />
  );
}
