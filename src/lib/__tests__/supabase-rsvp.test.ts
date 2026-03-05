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
import { createWebRsvp, getActivityRsvpTeaser } from '../supabase';
import type { WebRsvpResponse, RsvpTeaserResponse } from '../supabase';

describe('createWebRsvp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns WebRsvpResponse on success', async () => {
    const mockData: WebRsvpResponse = {
      claim_token: 'RSVP-X1Y2',
      guest_name: 'Alex',
      activity_title: 'Coffee Chat',
      participant_count: 3,
      participant_names: ['Sam', 'Jordan'],
      spots_remaining: 2,
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
