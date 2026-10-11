// © Konectr 2026. All rights reserved.
// PF-46 fixtures, in the exact shapes the live RPCs return (checked against
// prod `rsrplvdtbycqcxjlyeju` on 2026-10-11 with pg_get_function_result and the
// function bodies). No women-only plan exists in prod yet, so these stand in.

import type { SharedActivity, WebRsvpResponse, WebGuestPlan } from '../../supabase';

const ACTIVITY_ID = '7a1c2e3f-4b5d-4c6e-8f70-81a2b3c4d5e6';
export const GUEST_TOKEN = 'ab12'.repeat(16); // 64 hex, like encode(gen_random_bytes(32), 'hex')

// get_activity_by_share_code for a women-only plan, as anon sees it
// (women_only_hidden_from_me = true). Title is null because she didn't name it
// (it equalled the venue name). Coords come back rounded to 2 decimals.
export const REDACTED_SHARE_ROW: SharedActivity = {
  id: ACTIVITY_ID,
  user_id: null,
  title: null,
  description: null,
  details: null,
  category: 'active',
  venue_type: 'fitness',
  venue_name: null,
  location_lat: 3.15,
  location_lng: 101.63,
  start_time: null,
  end_time: null,
  max_participants: 6,
  current_participants: null,
  status: 'active',
  share_code: 'K7Q2WXYZ',
  creator_name: null,
  creator_photo_url: null,
  women_only: true,
  redacted: true,
  day_part: 'Saturday evening',
  area: null,
};

// The same RPC for an ordinary (mixed) plan: every column filled, plus the four
// PF-46 columns appended with women_only/redacted false.
export const MIXED_SHARE_ROW: SharedActivity = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '660e8400-e29b-41d4-a716-446655440001',
  title: 'Coffee Chat',
  description: null,
  details: 'Slow Saturday coffee, bring a book',
  category: 'chill',
  venue_type: 'cafe',
  venue_name: 'Kenny Hills Bakers',
  location_lat: 3.161234,
  location_lng: 101.717654,
  start_time: '2026-10-17T02:00:00+00:00',
  end_time: '2026-10-17T04:00:00+00:00',
  max_participants: 5,
  current_participants: 2,
  status: 'active',
  share_code: 'ABC123',
  creator_name: 'Alex Tan',
  creator_photo_url: null,
  women_only: false,
  redacted: false,
  day_part: 'Saturday morning',
  area: 'Kuala Lumpur',
};

// create_web_rsvp(…, p_attest_woman => true) on that women-only plan: the usual
// RSVP fields, then `women_only: true` and the D5 unlock in `activity`.
export const ATTESTED_RSVP_RESPONSE: WebRsvpResponse = {
  claim_token: 'RSVP-9F3A',
  guest_token: GUEST_TOKEN,
  guest_name: 'Aisha',
  activity_title: 'Bukit Kiara Trail',
  participant_count: 4,
  participant_names: ['Mei', 'Priya', 'Sara'],
  spots_remaining: 2,
  message_count: 3,
  women_only: true,
  activity: {
    venue_name: 'Bukit Kiara Trail',
    start_time: '2026-10-17T11:00:00+00:00',
    end_time: '2026-10-17T13:00:00+00:00',
    location_lat: 3.148721,
    location_lng: 101.627411,
    details: 'Easy 5k, all paces',
  },
};

// get_web_guest_plan(p_guest_token) for that guest.
export const GUEST_PLAN: WebGuestPlan = {
  activity_id: ACTIVITY_ID,
  share_code: 'K7Q2WXYZ',
  title: 'Bukit Kiara Trail',
  details: 'Easy 5k, all paces',
  venue_name: 'Bukit Kiara Trail',
  location_lat: 3.148721,
  location_lng: 101.627411,
  start_time: '2026-10-17T11:00:00+00:00',
  end_time: '2026-10-17T13:00:00+00:00',
  women_only: true,
};
