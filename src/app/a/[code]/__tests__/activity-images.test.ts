// © Konectr 2026. All rights reserved.
// Tests for the /a/[code] hero image resolver (PF-46: no men on a women-only hero).

import { describe, it, expect } from 'vitest';
import { activityImage, WOMEN_ONLY_PATTERN } from '../redesign/activity-images';
import type { VibeKey } from '../redesign/vibes';

const VIBES: VibeKey[] = ['chill', 'active', 'focus', 'creative', 'adventure', 'social'];
// One title per keyword rule, plus nothing-matches.
const TITLES = [
  'Padel night', 'Batting cage', 'Badminton doubles', 'Tennis rally', 'Coffee & brunch',
  'Gym session', 'Bukit Kiara hike', 'Rooftop sunset', 'Cocktail bar', 'Lunch at TRX',
  'Makan dinner', 'Morning run', 'Yoga flow', 'Hoops', 'Futsal', 'Bouldering',
  'Pottery wheel throw', 'Paint and sip', 'Cowork Friday', 'Hang out',
];
const SAFE = ['art', 'basketball', 'cowork', 'pottery', 'trx', 'yoga'].map((k) => `/images/activities/${k}.jpg`);

describe('activityImage — women-only (PF-46)', () => {
  it('only ever returns a vetted photo or the pattern', () => {
    for (const vibe of VIBES) {
      for (const title of TITLES) {
        const img = activityImage({ vibe, title, womenOnly: true });
        expect([...SAFE, WOMEN_ONLY_PATTERN]).toContain(img);
      }
    }
  });

  it('swaps a matched photo that shows men for the pattern', () => {
    expect(activityImage({ vibe: 'active', title: 'Morning run', womenOnly: true })).toBe(WOMEN_ONLY_PATTERN);
    expect(activityImage({ vibe: 'adventure', title: 'Bukit Kiara hike', womenOnly: true })).toBe(WOMEN_ONLY_PATTERN);
  });

  it('keeps a matched photo that is safe', () => {
    expect(activityImage({ vibe: 'active', title: 'Yoga flow', womenOnly: true })).toBe('/images/activities/yoga.jpg');
    expect(activityImage({ vibe: 'creative', title: 'Pottery wheel throw', womenOnly: true })).toBe('/images/activities/pottery.jpg');
  });

  it('falls back by vibe to a safe photo, or the pattern', () => {
    expect(activityImage({ vibe: 'focus', womenOnly: true })).toBe('/images/activities/cowork.jpg');
    expect(activityImage({ vibe: 'active', womenOnly: true })).toBe('/images/activities/yoga.jpg');
    expect(activityImage({ vibe: 'social', womenOnly: true })).toBe(WOMEN_ONLY_PATTERN);
    expect(activityImage({ vibe: 'chill', womenOnly: true })).toBe(WOMEN_ONLY_PATTERN);
  });
});

describe('activityImage — mixed plans unchanged', () => {
  it.each([
    [{ vibe: 'active' as VibeKey, title: 'Morning run' }, '/images/activities/run.jpg'],
    [{ vibe: 'active' as VibeKey, title: 'Padel night' }, '/images/activities/tennis.jpg'],
    [{ vibe: 'social' as VibeKey, title: 'Lunch', venueName: 'The Exchange TRX' }, '/images/activities/trx.jpg'],
    [{ vibe: 'chill' as VibeKey, title: 'Hang out' }, '/images/email/cafe-friends.jpg'],
    [{ vibe: 'social' as VibeKey, title: 'Hang out', womenOnly: false }, '/images/email/friends-group.jpg'],
  ])('%o', (opts, expected) => {
    expect(activityImage(opts)).toBe(expected);
  });
});
