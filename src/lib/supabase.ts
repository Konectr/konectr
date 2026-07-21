// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for activity from get_activity_by_share_code RPC
export interface SharedActivity {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  details: string | null; // "Here for…" purpose text (description is legacy, empty since build 38)
  category: string;
  venue_type: string | null;
  venue_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  status: string;
  share_code: string;
  creator_name: string;
  creator_photo_url: string | null;
}

// Fetch activity by share code
export async function getActivityByShareCode(shareCode: string): Promise<SharedActivity | null> {
  try {
    const { data, error } = await supabase.rpc('get_activity_by_share_code', {
      p_share_code: shareCode.toUpperCase(),
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return null;
    }

    // RPC returns an array, get the first result
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log('No activity found for share code:', shareCode);
      return null;
    }

    // Return first result if array, otherwise return as-is
    const activity = Array.isArray(data) ? data[0] : data;
    return activity as SharedActivity;
  } catch (err) {
    console.error('Error fetching activity:', err);
    return null;
  }
}

// ============================================================================
// Web RSVP Types & Helpers
// ============================================================================

export interface WebRsvpResponse {
  claim_token: string;
  guest_name: string;
  activity_title: string;
  participant_count: number;
  participant_names: string[];
  spots_remaining: number;
  message_count: number;
}

export interface RsvpTeaserResponse {
  participant_count: number;
  participant_names: string[];
  creator_name: string;
  spots_remaining: number;
  max_participants: number;
  message_count: number;
}

export async function createWebRsvp(
  activityId: string,
  guestName: string,
  ipHash: string | null,
  phoneHash: string | null = null,
  email: string | null = null
): Promise<WebRsvpResponse> {
  const { data, error } = await supabase.rpc('create_web_rsvp', {
    p_activity_id: activityId,
    p_guest_name: guestName,
    p_ip_hash: ipHash,
    p_phone_hash: phoneHash,
    p_email: email,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as WebRsvpResponse;
}

// Result of cancel_web_rsvp RPC. The spot is ALWAYS released; `late` (inside the
// 3h cutoff, enforced server-side) only means the group was notified immediately.
export interface CancelWebRsvpResult {
  outcome:
    | 'withdrawn'        // spot freed (always)
    | 'already_withdrawn'
    | 'activity_unavailable'
    | 'not_found'
    | 'rate_limited';
  late?: boolean;
}

export async function cancelWebRsvp(
  claimToken: string,
  ipHash: string | null
): Promise<CancelWebRsvpResult> {
  const { data, error } = await supabase.rpc('cancel_web_rsvp', {
    p_claim_token: claimToken,
    p_ip_hash: ipHash,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as CancelWebRsvpResult;
}

// ============================================================================
// Public Weekly Leaderboard (KL)
// ============================================================================

// Row from get_public_leaderboard RPC (anon-callable, opt-in users only).
// Weekly aggregates ONLY — no venues, dates, or lifetime counts by privacy design.
export interface LeaderboardEntry {
  rank: number;
  first_name: string;
  photo_url: string | null;
  score: number;
  verified_meetups: number;
  is_champion: boolean;
  week_start: string; // KL-local Monday (date)
  week_end: string;   // KL-local Sunday (date)
}

// weekOffset: 0 = current week (live), -1 = last week (final). Clamped server-side.
export async function getPublicLeaderboard(weekOffset: 0 | -1): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase.rpc('get_public_leaderboard', {
      p_week_offset: weekOffset,
    });

    if (error) {
      console.error('Leaderboard RPC error:', error);
      return [];
    }

    return (data as LeaderboardEntry[]) ?? [];
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return [];
  }
}

// ============================================================================
// Campaign by-tag reads (HYROX KL Dec 2026 — konectr.app/hyrox)
// ============================================================================

// Row from get_venues_by_tag RPC (anon-callable). Non-sensitive venue business
// data only — no owner contact fields (see migration 20260716000100).
export interface CampaignVenue {
  venue_id: string;
  venue_name: string;
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  photo_url: string | null;
  website: string | null;
  google_place_id: string | null;
  tags: string[];
}

// Row from get_public_activities_by_tag RPC (anon-callable). Same field surface
// as the share-code teaser RPCs, bounded to public + active + upcoming.
export interface CampaignActivity {
  id: string;
  share_code: string;
  title: string;
  details: string | null; // "Here for…" purpose text
  venue_id: string | null;
  venue_name: string | null;
  venue_type: string | null;
  location_lat: number | null;
  location_lng: number | null;
  start_time: string;
  end_time: string;
  max_participants: number;
  spots_available: number;
  creator_display_name: string | null;
  tags: string[];
}

export async function getVenuesByTag(tag: string): Promise<CampaignVenue[]> {
  try {
    const { data, error } = await supabase.rpc('get_venues_by_tag', {
      p_tag: tag,
    });

    if (error) {
      console.error('get_venues_by_tag RPC error:', error);
      return [];
    }

    return (data as CampaignVenue[]) ?? [];
  } catch (err) {
    console.error('Error fetching venues by tag:', err);
    return [];
  }
}

export async function getPublicActivitiesByTag(tag: string): Promise<CampaignActivity[]> {
  try {
    const { data, error } = await supabase.rpc('get_public_activities_by_tag', {
      p_tag: tag,
    });

    if (error) {
      console.error('get_public_activities_by_tag RPC error:', error);
      return [];
    }

    return (data as CampaignActivity[]) ?? [];
  } catch (err) {
    console.error('Error fetching public activities by tag:', err);
    return [];
  }
}

export async function getActivityRsvpTeaser(
  activityId: string
): Promise<RsvpTeaserResponse | null> {
  try {
    const { data, error } = await supabase.rpc('get_activity_rsvp_teaser', {
      p_activity_id: activityId,
    });

    if (error) {
      console.error('RSVP teaser error:', error);
      return null;
    }

    return data as RsvpTeaserResponse;
  } catch (err) {
    console.error('Error fetching RSVP teaser:', err);
    return null;
  }
}
