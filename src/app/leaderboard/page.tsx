// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from 'next';
import { getPublicLeaderboard } from '@/lib/supabase';
import LeaderboardBoard from './LeaderboardBoard';

// ISR: the board is weekly-aggregate data — 5-minute revalidation absorbs
// WhatsApp click bursts while keeping "This week · live" honest enough.
export const revalidate = 300;

// Konectr is Malaysia-only: week labels pinned to Asia/Kuala_Lumpur
// (Vercel renders in UTC — see /a/[code]/page.tsx for the same pattern).
const MYT_TZ = 'Asia/Kuala_Lumpur';

function formatWeekRange(weekStart: string, weekEnd: string): string {
  const fmt = (d: string, withMonth: boolean) =>
    new Date(`${d}T00:00:00+08:00`).toLocaleDateString('en-US', {
      day: 'numeric',
      ...(withMonth ? { month: 'short' } : {}),
      timeZone: MYT_TZ,
    });
  const sameMonth =
    new Date(`${weekStart}T00:00:00+08:00`).getMonth() ===
    new Date(`${weekEnd}T00:00:00+08:00`).getMonth();
  // en-US puts the month first, so the shared month goes on the START date: "Jul 6–12"
  return sameMonth
    ? `${fmt(weekStart, true)}–${fmt(weekEnd, false)}`
    : `${fmt(weekStart, true)} – ${fmt(weekEnd, true)}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const description =
    'Who actually showed up this week? The Konectr KL leaderboard ranks verified meetups — real people, real activities, confirmed in the app.';
  return {
    title: 'KL Weekly Leaderboard - Konectr',
    description,
    openGraph: {
      title: 'Konectr KL Weekly Leaderboard 🏆',
      description,
      type: 'website',
    },
  };
}

export default async function LeaderboardPage() {
  const [thisWeek, lastWeek] = await Promise.all([
    getPublicLeaderboard(0),
    getPublicLeaderboard(-1),
  ]);

  // Week labels come from the RPC when it has rows; fall back to computing the
  // current KL week so the header renders on an empty board too.
  const now = new Date();
  const klNow = new Date(now.toLocaleString('en-US', { timeZone: MYT_TZ }));
  const dow = (klNow.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(klNow);
  monday.setDate(klNow.getDate() - dow);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const thisWeekStart = thisWeek[0]?.week_start ?? iso(monday);
  const thisWeekEnd = thisWeek[0]?.week_end ?? iso(sunday);
  const lastMonday = new Date(monday);
  lastMonday.setDate(monday.getDate() - 7);
  const lastSunday = new Date(monday);
  lastSunday.setDate(monday.getDate() - 1);
  const lastWeekStart = lastWeek[0]?.week_start ?? iso(lastMonday);
  const lastWeekEnd = lastWeek[0]?.week_end ?? iso(lastSunday);

  return (
    <LeaderboardBoard
      thisWeek={thisWeek}
      lastWeek={lastWeek}
      thisWeekLabel={formatWeekRange(thisWeekStart, thisWeekEnd)}
      lastWeekLabel={formatWeekRange(lastWeekStart, lastWeekEnd)}
    />
  );
}
