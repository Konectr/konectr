// © Konectr 2026. All rights reserved.
// BUG-008 — store URLs must never fall back to the beta-era waitlist or TestFlight.
// Shared links are the main acquisition funnel; an unset env var used to send
// every Android visitor (and every Preview deploy) to /#waitlist.

import { describe, it, expect, vi, afterEach } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('store URLs', () => {
  it('fall back to the live listings when the env vars are unset', async () => {
    vi.stubEnv('NEXT_PUBLIC_IOS_STORE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_ANDROID_STORE_URL', '');
    const { getStoreUrl } = await import('../smartLink');
    expect(getStoreUrl('ios')).toBe('https://apps.apple.com/my/app/konectr/id6758149668');
    expect(getStoreUrl('android')).toBe(
      'https://play.google.com/store/apps/details?id=com.konectr.konectrMobile'
    );
    expect(getStoreUrl('desktop')).toBe('https://konectr.app/');
  });

  it('prefer the env vars when set', async () => {
    vi.stubEnv('NEXT_PUBLIC_IOS_STORE_URL', 'https://apps.apple.com/app/id1');
    vi.stubEnv('NEXT_PUBLIC_ANDROID_STORE_URL', 'https://play.google.com/x');
    const { getStoreUrl } = await import('../smartLink');
    expect(getStoreUrl('ios')).toBe('https://apps.apple.com/app/id1');
    expect(getStoreUrl('android')).toBe('https://play.google.com/x');
  });

  it('never route to the waitlist or TestFlight', async () => {
    vi.stubEnv('NEXT_PUBLIC_TESTFLIGHT_URL', 'https://testflight.apple.com/join/abc');
    const { getStoreUrl } = await import('../smartLink');
    for (const p of ['ios', 'android', 'desktop'] as const) {
      expect(getStoreUrl(p)).not.toMatch(/waitlist|testflight/);
    }
  });
});
