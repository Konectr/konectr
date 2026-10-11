// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { isActivityEnded } from '@/lib/datetime';

// One "is this plan over?" rule for the server page (which fetches the next
// joinable plans for a dead end) and the client (which renders the ended state).

// Expired or cancelled before it started: the DB rejects RSVPs on it
// ("Activity is not active"), so the page must not offer one (E1D8A507).
export function isPlanNotHappening(status: string): boolean {
  return status === 'expired' || status === 'cancelled';
}

// PF-46: a redacted women-only plan carries no end_time, so the server reports
// one that has ended as status 'ended' (20261011140000_women_only_founder_answers).
// Plain plans keep status 'active' after they end; their end_time decides.
export function isPlanOver(status: string, endTime: string | null): boolean {
  return (
    isPlanNotHappening(status) ||
    status === 'ended' ||
    (endTime !== null && isActivityEnded(endTime))
  );
}
