// © Konectr 2026. All rights reserved.
// Tests for POST /api/rsvp route

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted so mock fns are available inside vi.mock factory (which is hoisted)
const { mockCreateWebRsvp, mockGetActivityByShareCode } = vi.hoisted(() => ({
  mockCreateWebRsvp: vi.fn(),
  mockGetActivityByShareCode: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  createWebRsvp: mockCreateWebRsvp,
  getActivityByShareCode: mockGetActivityByShareCode,
}));

// Import after mocks are set up
import { POST } from '../route';

function makeRequest(body: Record<string, unknown>, headers?: Record<string, string>) {
  return new Request('http://localhost/api/rsvp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0];
}

const MOCK_ACTIVITY = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  user_id: '660e8400-e29b-41d4-a716-446655440001',
  title: 'Coffee Chat',
  description: null,
  category: 'chill',
  venue_type: 'cafe',
  venue_name: 'Kenny Hills Bakers',
  location_lat: 3.16,
  location_lng: 101.72,
  start_time: '2026-03-10T10:00:00Z',
  end_time: '2026-03-10T12:00:00Z',
  max_participants: 5,
  current_participants: 2,
  status: 'active',
  share_code: 'ABC123',
  creator_name: 'Alex',
  creator_photo_url: null,
};

const MOCK_RSVP_RESPONSE = {
  claim_token: 'RSVP-A1B2',
  guest_name: 'Jordan',
  activity_title: 'Coffee Chat',
  participant_count: 3,
  participant_names: ['Alex', 'Sam'],
  spots_remaining: 2,
};

describe('POST /api/rsvp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetActivityByShareCode.mockResolvedValue(MOCK_ACTIVITY);
    mockCreateWebRsvp.mockResolvedValue(MOCK_RSVP_RESPONSE);
  });

  // =========================================================================
  // Input Validation
  // =========================================================================

  describe('input validation', () => {
    it('returns 400 when share_code is missing', async () => {
      const req = makeRequest({ guest_name: 'Jordan' });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toContain('Share code is required');
    });

    it('returns 400 when guest_name is missing', async () => {
      const req = makeRequest({ share_code: 'ABC123' });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toContain('Name is required');
    });

    it('returns 400 when guest_name is whitespace only', async () => {
      const req = makeRequest({ share_code: 'ABC123', guest_name: '   ' });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toContain('between 1 and 50');
    });

    it('returns 400 when guest_name exceeds 50 characters', async () => {
      const longName = 'A'.repeat(51);
      const req = makeRequest({ share_code: 'ABC123', guest_name: longName });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toContain('between 1 and 50');
    });

    it('returns 400 when guest_name contains invalid characters', async () => {
      const req = makeRequest({ share_code: 'ABC123', guest_name: 'Jordan123' });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.error).toContain('invalid characters');
    });

    it('accepts valid Unicode names (accented, CJK, Arabic)', async () => {
      // Test with accented characters
      const req1 = makeRequest(
        { share_code: 'ABC123', guest_name: 'José María' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res1 = await POST(req1);
      expect(res1.status).toBe(200);

      // Test with CJK characters
      const req2 = makeRequest(
        { share_code: 'ABC123', guest_name: '田中太郎' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res2 = await POST(req2);
      expect(res2.status).toBe(200);

      // Test with Arabic characters
      const req3 = makeRequest(
        { share_code: 'ABC123', guest_name: 'أحمد' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res3 = await POST(req3);
      expect(res3.status).toBe(200);
    });
  });

  // =========================================================================
  // Activity Lookup
  // =========================================================================

  describe('activity lookup', () => {
    it('returns 404 when share_code finds no activity', async () => {
      mockGetActivityByShareCode.mockResolvedValue(null);

      const req = makeRequest(
        { share_code: 'INVALID', guest_name: 'Jordan' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body.error).toContain('Activity not found');
    });

    it('returns 200 when share_code finds valid activity', async () => {
      const req = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(mockCreateWebRsvp).toHaveBeenCalledWith(
        MOCK_ACTIVITY.id,
        'Jordan',
        expect.any(String)
      );
    });

    it('returns 500 when createWebRsvp throws generic error', async () => {
      mockCreateWebRsvp.mockRejectedValue(new Error('Connection refused'));

      const req = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.error).toBe('Connection refused');
    });
  });

  // =========================================================================
  // RPC Integration
  // =========================================================================

  describe('RPC integration', () => {
    it('returns 200 with claim_token on successful RSVP', async () => {
      const req = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.claim_token).toBe('RSVP-A1B2');
      expect(body.participant_count).toBe(3);
      expect(body.participant_names).toEqual(['Alex', 'Sam']);
    });

    it('returns 409 when activity is full', async () => {
      mockCreateWebRsvp.mockRejectedValue(new Error('Activity is full'));

      const req = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(409);
      expect(body.error).toContain('full');
    });

    it('returns 410 when activity has ended', async () => {
      mockCreateWebRsvp.mockRejectedValue(new Error('Activity has ended'));

      const req = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(410);
      expect(body.error).toContain('ended');
    });

    it('returns 429 when rate limited', async () => {
      mockCreateWebRsvp.mockRejectedValue(new Error('Too many RSVPs'));

      const req = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(429);
      expect(body.error).toContain('Too many RSVPs');
    });

    it('returns 410 when activity is not active', async () => {
      mockCreateWebRsvp.mockRejectedValue(new Error('Activity is not active'));

      const req = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' },
        { 'x-forwarded-for': '1.2.3.4' }
      );
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(410);
      expect(body.error).toContain('no longer available');
    });
  });

  // =========================================================================
  // IP Hashing
  // =========================================================================

  describe('IP hashing', () => {
    it('hashes x-forwarded-for header and passes to RPC', async () => {
      const req = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' },
        { 'x-forwarded-for': '203.0.113.42' }
      );
      await POST(req);

      expect(mockCreateWebRsvp).toHaveBeenCalledWith(
        MOCK_ACTIVITY.id,
        'Jordan',
        expect.stringMatching(/^[a-f0-9]{64}$/) // SHA-256 hex
      );
    });

    it('uses "unknown" hash when x-forwarded-for is missing', async () => {
      const req = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' }
        // No x-forwarded-for header
      );
      await POST(req);

      // Should still call with a hash (of "unknown")
      expect(mockCreateWebRsvp).toHaveBeenCalledWith(
        MOCK_ACTIVITY.id,
        'Jordan',
        expect.stringMatching(/^[a-f0-9]{64}$/)
      );
    });

    it('uses first IP when x-forwarded-for contains multiple IPs', async () => {
      const req1 = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' },
        { 'x-forwarded-for': '203.0.113.42, 10.0.0.1, 172.16.0.1' }
      );
      await POST(req1);
      const hash1 = mockCreateWebRsvp.mock.calls[0][2];

      mockCreateWebRsvp.mockClear();
      mockGetActivityByShareCode.mockResolvedValue(MOCK_ACTIVITY);
      mockCreateWebRsvp.mockResolvedValue(MOCK_RSVP_RESPONSE);

      // Same first IP should produce same hash
      const req2 = makeRequest(
        { share_code: 'ABC123', guest_name: 'Jordan' },
        { 'x-forwarded-for': '203.0.113.42' }
      );
      await POST(req2);
      const hash2 = mockCreateWebRsvp.mock.calls[0][2];

      expect(hash1).toBe(hash2);
    });
  });
});
