// © Konectr 2026. All rights reserved.
// Tests for Supabase RSVP helpers (createWebRsvp, getActivityRsvpTeaser)

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted so mockRpc is available inside vi.mock factory (which is hoisted)
const { mockRpc } = vi.hoisted(() => ({
  mockRpc: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    rpc: mockRpc,
  }),
}));

// Import after mocks
import {
  createWebRsvp,
  getActivityRsvpTeaser,
  cleanParticipantNames,
  getActivityByShareCode,
  getWebGuestPlan,
} from '../supabase';
import type { WebRsvpResponse, RsvpTeaserResponse } from '../supabase';
import {
  REDACTED_SHARE_ROW,
  MIXED_SHARE_ROW,
  ATTESTED_RSVP_RESPONSE,
  GUEST_PLAN,
  GUEST_TOKEN,
} from './fixtures/women-only';

describe('createWebRsvp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns WebRsvpResponse on success', async () => {
    const mockData: WebRsvpResponse = {
      claim_token: 'RSVP-X1Y2',
      guest_token: 'a'.repeat(64),
      guest_name: 'Alex',
      activity_title: 'Coffee Chat',
      participant_count: 3,
      participant_names: ['Sam', 'Jordan'],
      spots_remaining: 2,
      message_count: 0,
    };
    mockRpc.mockResolvedValue({ data: mockData, error: null });

    const result = await createWebRsvp('activity-123', 'Alex', 'hash-abc');

    expect(result).toEqual(mockData);
    expect(result.claim_token).toBe('RSVP-X1Y2');
    expect(result.spots_remaining).toBe(2);
  });

  it('throws on RPC error', async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: 'Activity is full' },
    });

    await expect(
      createWebRsvp('activity-123', 'Alex', 'hash-abc')
    ).rejects.toThrow('Activity is full');
  });

  it('passes correct params to RPC', async () => {
    mockRpc.mockResolvedValue({
      data: { claim_token: 'RSVP-0000' },
      error: null,
    });

    await createWebRsvp('my-activity-id', 'Jordan', 'my-ip-hash');

    expect(mockRpc).toHaveBeenCalledWith('create_web_rsvp', {
      p_activity_id: 'my-activity-id',
      p_guest_name: 'Jordan',
      p_ip_hash: 'my-ip-hash',
      p_phone_hash: null,
      p_email: null,
      p_utm_source: null,
      p_utm_medium: null,
      p_utm_campaign: null,
    });
  });

  it('passes null ipHash when not provided', async () => {
    mockRpc.mockResolvedValue({
      data: { claim_token: 'RSVP-0000' },
      error: null,
    });

    await createWebRsvp('my-activity-id', 'Jordan', null);

    expect(mockRpc).toHaveBeenCalledWith('create_web_rsvp', {
      p_activity_id: 'my-activity-id',
      p_guest_name: 'Jordan',
      p_ip_hash: null,
      p_phone_hash: null,
      p_email: null,
      p_utm_source: null,
      p_utm_medium: null,
      p_utm_campaign: null,
    });
  });

  it('returns response matching WebRsvpResponse type shape', async () => {
    const mockData = {
      claim_token: 'RSVP-ABCD',
      guest_name: 'Test',
      activity_title: 'Test Activity',
      participant_count: 1,
      participant_names: [],
      spots_remaining: 4,
    };
    mockRpc.mockResolvedValue({ data: mockData, error: null });

    const result = await createWebRsvp('id', 'Test', null);

    // Verify all WebRsvpResponse fields are present
    expect(result).toHaveProperty('claim_token');
    expect(result).toHaveProperty('guest_name');
    expect(result).toHaveProperty('activity_title');
    expect(result).toHaveProperty('participant_count');
    expect(result).toHaveProperty('participant_names');
    expect(result).toHaveProperty('spots_remaining');
  });
});

describe('getActivityRsvpTeaser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns RsvpTeaserResponse on success', async () => {
    const mockData: RsvpTeaserResponse = {
      participant_count: 4,
      participant_names: ['Alex', 'Sam', 'Jordan'],
      creator_name: 'Alex',
      spots_remaining: 1,
      max_participants: 5,
      message_count: 0,
    };
    mockRpc.mockResolvedValue({ data: mockData, error: null });

    const result = await getActivityRsvpTeaser('activity-456');

    expect(result).toEqual(mockData);
    expect(result?.participant_count).toBe(4);
    expect(result?.creator_name).toBe('Alex');
  });

  it('returns null when no data', async () => {
    mockRpc.mockResolvedValue({ data: null, error: null });

    const result = await getActivityRsvpTeaser('activity-456');

    expect(result).toBeNull();
  });

  it('returns null on RPC error', async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: 'Activity not found' },
    });

    const result = await getActivityRsvpTeaser('activity-456');

    expect(result).toBeNull();
  });

  it('passes correct activityId param', async () => {
    mockRpc.mockResolvedValue({ data: {}, error: null });

    await getActivityRsvpTeaser('my-specific-activity-id');

    expect(mockRpc).toHaveBeenCalledWith('get_activity_rsvp_teaser', {
      p_activity_id: 'my-specific-activity-id',
    });
  });

  it('returns response matching RsvpTeaserResponse type shape', async () => {
    const mockData = {
      participant_count: 2,
      participant_names: ['Alex'],
      creator_name: 'Host',
      spots_remaining: 3,
      max_participants: 5,
    };
    mockRpc.mockResolvedValue({ data: mockData, error: null });

    const result = await getActivityRsvpTeaser('id');

    // Verify all RsvpTeaserResponse fields
    expect(result).toHaveProperty('participant_count');
    expect(result).toHaveProperty('participant_names');
    expect(result).toHaveProperty('creator_name');
    expect(result).toHaveProperty('spots_remaining');
    expect(result).toHaveProperty('max_participants');
  });
});

describe('cleanParticipantNames', () => {
  it('drops the null the teaser RPC emits for a member with no display_name', () => {
    // Exact payload from get_activity_rsvp_teaser on share code E34220B0
    // (2026-09-21), which took the whole /a/[code] page down with
    // "TypeError: Cannot read properties of null (reading 'trim')".
    expect(cleanParticipantNames([null, 'Mai', 'Tania'])).toEqual(['Mai', 'Tania']);
  });

  it('drops blank and whitespace-only names', () => {
    expect(cleanParticipantNames(['', '   ', 'Sam'])).toEqual(['Sam']);
  });

  it('returns [] for null, undefined, and non-arrays', () => {
    expect(cleanParticipantNames(null)).toEqual([]);
    expect(cleanParticipantNames(undefined)).toEqual([]);
    expect(cleanParticipantNames('Mai' as unknown as string[])).toEqual([]);
  });

  it('passes a clean list through untouched', () => {
    expect(cleanParticipantNames(['Alex', 'Sam', 'Jordan'])).toEqual(['Alex', 'Sam', 'Jordan']);
  });
});

// ============================================================================
// PF-46 women-only
// ============================================================================

describe('getActivityByShareCode (PF-46)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a redacted women-only row instead of treating it as not found', async () => {
    mockRpc.mockResolvedValue({ data: [REDACTED_SHARE_ROW], error: null });

    const result = await getActivityByShareCode('k7q2wxyz');

    expect(mockRpc).toHaveBeenCalledWith('get_activity_by_share_code', { p_share_code: 'K7Q2WXYZ' });
    expect(result).toEqual(REDACTED_SHARE_ROW);
    expect(result?.redacted).toBe(true);
    expect(result?.start_time).toBeNull();
  });

  it('returns a mixed plan row unchanged', async () => {
    mockRpc.mockResolvedValue({ data: [MIXED_SHARE_ROW], error: null });

    expect(await getActivityByShareCode('ABC123')).toEqual(MIXED_SHARE_ROW);
  });
});

describe('createWebRsvp attestation (PF-46)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds p_attest_woman only when ticked and returns the unlock', async () => {
    mockRpc.mockResolvedValue({ data: ATTESTED_RSVP_RESPONSE, error: null });

    const result = await createWebRsvp(
      REDACTED_SHARE_ROW.id, 'Aisha', 'ip', null, 'aisha@example.com', {}, true
    );

    expect(mockRpc).toHaveBeenCalledWith('create_web_rsvp', {
      p_activity_id: REDACTED_SHARE_ROW.id,
      p_guest_name: 'Aisha',
      p_ip_hash: 'ip',
      p_phone_hash: null,
      p_email: 'aisha@example.com',
      p_utm_source: null,
      p_utm_medium: null,
      p_utm_campaign: null,
      p_attest_woman: true,
    });
    expect(result.activity?.venue_name).toBe('Bukit Kiara Trail');
  });

  it('sends the pre-PF-46 8-key payload when not ticked', async () => {
    mockRpc.mockResolvedValue({ data: { claim_token: 'RSVP-0000' }, error: null });

    await createWebRsvp('id', 'Jordan', null, null, null, {}, false);

    const payload = mockRpc.mock.calls[0][1];
    expect(Object.keys(payload)).toHaveLength(8);
    expect(payload).not.toHaveProperty('p_attest_woman');
  });

  it('surfaces the trigger error text so the route can map it', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'women_only_attestation_required' } });

    await expect(createWebRsvp(REDACTED_SHARE_ROW.id, 'Aisha', null)).rejects.toThrow(
      'women_only_attestation_required'
    );
  });
});

describe('getWebGuestPlan (PF-46)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the guest plan for her token', async () => {
    mockRpc.mockResolvedValue({ data: GUEST_PLAN, error: null });

    expect(await getWebGuestPlan(GUEST_TOKEN)).toEqual(GUEST_PLAN);
    expect(mockRpc).toHaveBeenCalledWith('get_web_guest_plan', { p_guest_token: GUEST_TOKEN });
  });

  it('returns null when the RSVP is gone (withdrawn or removed)', async () => {
    mockRpc.mockResolvedValue({ data: null, error: null });

    expect(await getWebGuestPlan(GUEST_TOKEN)).toBeNull();
  });

  it('throws on an RPC error so an outage is not read as "removed"', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'timeout' } });

    await expect(getWebGuestPlan(GUEST_TOKEN)).rejects.toThrow('timeout');
  });
});
