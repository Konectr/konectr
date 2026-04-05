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
  phoneHash: string | null = null
): Promise<WebRsvpResponse> {
  const { data, error } = await supabase.rpc('create_web_rsvp', {
    p_activity_id: activityId,
    p_guest_name: guestName,
    p_ip_hash: ipHash,
    p_phone_hash: phoneHash,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as WebRsvpResponse;
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
