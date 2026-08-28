// © Konectr 2026. All rights reserved.
// Tests for the /thanks conversion-pixel gating decision

import { describe, it, expect } from 'vitest';
import { mayFireConversion } from '../mayFireConversion';

describe('mayFireConversion', () => {
  it('fires only when rid is present and verify returned 200', () => {
    expect(mayFireConversion('resp_abc123', 200)).toBe(true);
  });

  it('never fires without a rid, even if verify somehow returned 200', () => {
    expect(mayFireConversion(undefined, 200)).toBe(false);
    expect(mayFireConversion(null, 200)).toBe(false);
    expect(mayFireConversion('', 200)).toBe(false);
  });

  it('never fires when verify did not return 200', () => {
    expect(mayFireConversion('resp_abc123', 404)).toBe(false);
    expect(mayFireConversion('resp_abc123', 403)).toBe(false);
    expect(mayFireConversion('resp_abc123', 500)).toBe(false);
    expect(mayFireConversion('resp_abc123', null)).toBe(false);
  });
});
