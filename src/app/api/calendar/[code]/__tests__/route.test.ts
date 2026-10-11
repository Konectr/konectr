// © Konectr 2026. All rights reserved.
// Tests for GET /api/calendar/[code] (PF-46: women-only .ics needs the guest token)

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetActivityByShareCode, mockGetWebGuestPlan } = vi.hoisted(() => ({
  mockGetActivityByShareCode: vi.fn(),
  mockGetWebGuestPlan: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  getActivityByShareCode: mockGetActivityByShareCode,
  getWebGuestPlan: mockGetWebGuestPlan,
}));

import { NextRequest } from 'next/server';
import { GET } from '../route';
import {
  REDACTED_SHARE_ROW,
  MIXED_SHARE_ROW,
  GUEST_PLAN,
  GUEST_TOKEN,
} from '@/lib/__tests__/fixtures/women-only';

function call(code: string, query = '') {
  const req = new NextRequest(`http://localhost/api/calendar/${code}${query}`);
  return GET(req, { params: Promise.resolve({ code }) });
}

describe('GET /api/calendar/[code]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('mixed plans (unchanged)', () => {
    it('builds the same .ics as before from the share payload', async () => {
      mockGetActivityByShareCode.mockResolvedValue(MIXED_SHARE_ROW);

      const res = await call('ABC123');
      const ics = await res.text();

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('text/calendar; charset=utf-8');
      expect(res.headers.get('Cache-Control')).toBe('public, max-age=300, must-revalidate');
      expect(ics).toContain('DTSTART:20261017T020000Z');
      expect(ics).toContain('DTEND:20261017T040000Z');
      expect(ics).toContain('SUMMARY:Coffee Chat');
      expect(ics).toContain('LOCATION:Kenny Hills Bakers');
      expect(ics).toContain(
        'DESCRIPTION:Started by Alex Tan on Konectr.\\n\\nSlow Saturday coffee\\, bring a book\\n\\nView activity: https://konectr.app/a/ABC123'
      );
      expect(mockGetWebGuestPlan).not.toHaveBeenCalled();
    });

    it('ignores a token on a mixed plan', async () => {
      mockGetActivityByShareCode.mockResolvedValue(MIXED_SHARE_ROW);

      const res = await call('ABC123', `?token=${GUEST_TOKEN}`);

      expect(res.status).toBe(200);
      expect(mockGetWebGuestPlan).not.toHaveBeenCalled();
    });

    it('returns 404, never NaN dates, when the start time is missing', async () => {
      mockGetActivityByShareCode.mockResolvedValue({ ...MIXED_SHARE_ROW, start_time: null });

      const res = await call('ABC123');

      expect(res.status).toBe(404);
      expect(await res.text()).not.toContain('NaN');
    });
  });

  describe('women-only plans (PF-46)', () => {
    beforeEach(() => {
      mockGetActivityByShareCode.mockResolvedValue(REDACTED_SHARE_ROW);
    });

    it('refuses without a token and never reads the guest plan', async () => {
      const res = await call('K7Q2WXYZ');

      expect(res.status).toBe(404);
      expect(mockGetWebGuestPlan).not.toHaveBeenCalled();
    });

    it('refuses a malformed token without calling the RPC', async () => {
      const res = await call('K7Q2WXYZ', '?token=RSVP-9F3A');

      expect(res.status).toBe(404);
      expect(mockGetWebGuestPlan).not.toHaveBeenCalled();
    });

    it('refuses a token whose RSVP is gone', async () => {
      mockGetWebGuestPlan.mockResolvedValue(null);

      const res = await call('K7Q2WXYZ', `?token=${GUEST_TOKEN}`);

      expect(res.status).toBe(404);
    });

    it("refuses another plan's token", async () => {
      mockGetWebGuestPlan.mockResolvedValue({ ...GUEST_PLAN, share_code: 'OTHER123' });

      const res = await call('K7Q2WXYZ', `?token=${GUEST_TOKEN}`);

      expect(res.status).toBe(404);
    });

    it('refuses on an RPC outage', async () => {
      mockGetWebGuestPlan.mockRejectedValue(new Error('timeout'));

      const res = await call('K7Q2WXYZ', `?token=${GUEST_TOKEN}`);

      expect(res.status).toBe(404);
    });

    it("builds the .ics from the guest's own plan, uncached", async () => {
      mockGetWebGuestPlan.mockResolvedValue(GUEST_PLAN);

      const res = await call('K7Q2WXYZ', `?token=${GUEST_TOKEN}`);
      const ics = await res.text();

      expect(mockGetWebGuestPlan).toHaveBeenCalledWith(GUEST_TOKEN);
      expect(res.status).toBe(200);
      expect(res.headers.get('Cache-Control')).toBe('private, no-store');
      expect(ics).toContain('DTSTART:20261017T110000Z');
      expect(ics).toContain('DTEND:20261017T130000Z');
      expect(ics).toContain('SUMMARY:Bukit Kiara Trail');
      expect(ics).toContain('LOCATION:Bukit Kiara Trail');
      expect(ics).toContain('DESCRIPTION:A women-only activity on Konectr.');
      expect(ics).not.toContain('NaN');
      expect(ics).not.toContain('null');
    });
  });
});
