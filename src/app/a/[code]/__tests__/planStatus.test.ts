// © Konectr 2026. All rights reserved.
// Tests for the shared "is this plan over?" rule on /a/[code].

import { describe, it, expect } from 'vitest';
import { isPlanOver, isPlanNotHappening } from '../planStatus';

const PAST = '2020-01-01T00:00:00+00:00';
const FUTURE = '2099-01-01T00:00:00+00:00';

describe('isPlanOver', () => {
  it('is over for a redacted women-only plan the server reports as ended (no end_time)', () => {
    expect(isPlanOver('ended', null)).toBe(true);
  });

  it('is live for a redacted plan still active (no end_time to compare)', () => {
    expect(isPlanOver('active', null)).toBe(false);
  });

  it('keeps the existing rules for plain plans', () => {
    expect(isPlanOver('active', PAST)).toBe(true);
    expect(isPlanOver('active', FUTURE)).toBe(false);
    expect(isPlanOver('expired', FUTURE)).toBe(true);
    expect(isPlanOver('cancelled', FUTURE)).toBe(true);
  });
});

describe('isPlanNotHappening', () => {
  it('is only expired or cancelled; an ended plan is over, not cancelled', () => {
    expect(isPlanNotHappening('expired')).toBe(true);
    expect(isPlanNotHappening('cancelled')).toBe(true);
    expect(isPlanNotHappening('ended')).toBe(false);
    expect(isPlanNotHappening('active')).toBe(false);
  });
});
