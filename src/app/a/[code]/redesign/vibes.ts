// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// The 6 canonical Kinetic vibes (docs/CANONICAL_TRUTH.md §12.2). The RSVP page
// leads with Vibe · Venue · Time — the dimensions Konectr matches on — so the
// vibe drives the emoji + hero imagery (brand colour stays constant: Sunset Orange).

export type VibeKey = 'chill' | 'active' | 'focus' | 'creative' | 'adventure' | 'social';

export interface Vibe {
  key: VibeKey;
  name: string;
  emoji: string;
  mood: string;
}

export const VIBES: Record<VibeKey, Vibe> = {
  chill:     { key: 'chill',     name: 'Chill',     emoji: '☕', mood: 'Ease into it' },
  active:    { key: 'active',    name: 'Active',    emoji: '💪', mood: 'Bring the energy' },
  focus:     { key: 'focus',     name: 'Focus',     emoji: '🎯', mood: 'Heads down, together' },
  creative:  { key: 'creative',  name: 'Creative',  emoji: '🎨', mood: 'Make something' },
  adventure: { key: 'adventure', name: 'Adventure', emoji: '⛰️', mood: 'Get outside' },
  social:    { key: 'social',    name: 'Social',    emoji: '🎉', mood: 'Bring everyone' },
};

// Activity `category` may arrive as a vibe key or a legacy venue category. Map both
// to a canonical vibe. (Venue taxonomy is being collapsed into vibe — FI-31.)
const CATEGORY_TO_VIBE: Record<string, VibeKey> = {
  chill: 'chill', active: 'active', focus: 'focus', creative: 'creative',
  adventure: 'adventure', social: 'social',
  cafe: 'chill', coffee: 'chill',
  fitness: 'active', workout: 'active', sport: 'active',
  restaurant: 'social', bar: 'social', food: 'social', entertainment: 'social',
  outdoors: 'adventure',
};

export function resolveVibe(category: string | null | undefined): Vibe {
  const key = CATEGORY_TO_VIBE[(category ?? '').toLowerCase()] ?? 'social';
  return VIBES[key];
}

// Hero photo per vibe. Uses the marketing-grade email hero assets already in
// public/images/email so nothing ships as a broken/remote image. Swap for curated
// per-vibe venue photography in public/images/vibes/ when available (content task).
const VIBE_PHOTO: Record<VibeKey, string> = {
  chill:     '/images/email/cafe-friends.jpg',
  focus:     '/images/email/cafe-friends.jpg',
  active:    '/images/email/fitness-class.jpg',
  adventure: '/images/email/asian-friends-park.jpg',
  creative:  '/images/email/friends-group.jpg',
  social:    '/images/email/friends-group.jpg',
};

export function vibePhoto(vibe: VibeKey): string {
  return VIBE_PHOTO[vibe];
}
