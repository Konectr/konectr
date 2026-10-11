// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Activity-type image library. The vibe is locked (colour/emoji/name), but the HERO
// IMAGE keys to the *specific* activity/venue — padel → padel, cafe → cafe, hike →
// trail — so the photo actually complements what people are matching into. Falls back
// to the vibe-level photo when no specific type is detected.
//
// Assets live in public/images/activities/. To add a type: drop <key>.jpg in that
// folder and add a keyword row below. Curate/replace with licensed or venue-supplied
// photography over time (see PADEL note).

import type { VibeKey } from './vibes';

// Keyword → image key, checked in order (most specific first). Matched against the
// venue name + title + purpose + category, lowercased.
const KEYWORD_RULES: Array<[RegExp, string]> = [
  // ⚠️ PADEL: no true padel stock asset yet (glass-court sport). Using the tennis
  // court as the closest racquet-sport proxy — swap in a real ASCARO/venue padel
  // photo at public/images/activities/padel.jpg and change 'tennis' → 'padel' here.
  [/\bpadel\b/, 'tennis'],
  // Indoor batting cages (e.g. "SWING FOR IT — BASEBALL CAGE!" @ Swing! Batting
  // Centre, Melawati Mall). baseball.jpg = founder-supplied indoor cage photo (1200²).
  [/baseball|softball|batting/, 'baseball'],
  [/badminton|shuttle/, 'badminton'],
  [/tennis|squash/, 'tennis'],
  [/\bcaf[eé]\b|coffee|kopi|matcha|brunch|latte/, 'cafe'],
  [/\bgym\b|fitness|crossfit|hiit|workout|strength|lift/, 'gym'],
  [/hike|hiking|trail|bukit|mountain|waterfall|kayak/, 'hike'],
  [/rooftop|sky ?bar/, 'rooftop'],
  [/\bbar\b|\bpub\b|cocktail|drinks|beer|wine|mixolog/, 'bar'],
  // TRX / The Exchange TRX (Tun Razak Exchange) — landmark photo of the Exchange 106
  // tower beats the generic restaurant shot for anything hosted at the mall.
  [/\btrx\b|tun razak exchange/, 'trx'],
  [/restaurant|dinner|lunch|makan|dining|foodie|feast/, 'restaurant'],
  [/\brun\b|running|\bjog\b|marathon|5k|10k|park run/, 'run'],
  [/yoga|pilates|stretch|breathwork/, 'yoga'],
  [/basketball|hoops/, 'basketball'],
  [/football|futsal|soccer|frisbee/, 'football'],
  [/climb|boulder|belay/, 'climb'],
  [/pottery|ceramic|\bclay\b|wheel throw/, 'pottery'],
  [/\bart\b|paint|draw|sketch|craft|creative studio/, 'art'],
  [/cowork|co-work|study|library|deep work|focus session/, 'cowork'],
];

// Vibe fallback — the marketing-grade email heroes already in public/images/email.
const VIBE_FALLBACK: Record<VibeKey, string> = {
  chill:     '/images/email/cafe-friends.jpg',
  focus:     '/images/email/cafe-friends.jpg',
  active:    '/images/email/fitness-class.jpg',
  adventure: '/images/email/asian-friends-park.jpg',
  creative:  '/images/email/friends-group.jpg',
  social:    '/images/email/friends-group.jpg',
};

// PF-46: a women-only plan's hero never shows men. These are the only images
// checked (2026-10-11) to show no people, or women only: art, basketball, cowork,
// pottery and trx have nobody in them; yoga is one woman. Every other photo in
// the set shows men or people who can't be told apart (hands, distant figures).
// Re-check an image before adding it here.
const WOMEN_ONLY_SAFE = new Set(['art', 'basketball', 'cowork', 'pottery', 'trx', 'yoga']);
// Vibe fallback for a women-only plan no keyword matched; vibes without a safe
// photo get the pattern.
const WOMEN_ONLY_VIBE: Partial<Record<VibeKey, string>> = {
  focus: 'cowork',
  creative: 'art',
  active: 'yoga',
};
// Brand gradient + dot grid, no people (women-only.jpg, 1200²).
export const WOMEN_ONLY_PATTERN = '/images/activities/women-only.jpg';

export function activityImage(opts: {
  vibe: VibeKey;
  venueName?: string | null;
  title?: string | null;
  purpose?: string | null;
  category?: string | null;
  womenOnly?: boolean;
}): string {
  const hay = [opts.venueName, opts.title, opts.purpose, opts.category]
    .filter(Boolean).join(' ').toLowerCase();
  for (const [re, key] of KEYWORD_RULES) {
    if (re.test(hay)) {
      if (opts.womenOnly && !WOMEN_ONLY_SAFE.has(key)) return WOMEN_ONLY_PATTERN;
      return `/images/activities/${key}.jpg`;
    }
  }
  if (opts.womenOnly) {
    const key = WOMEN_ONLY_VIBE[opts.vibe];
    return key ? `/images/activities/${key}.jpg` : WOMEN_ONLY_PATTERN;
  }
  return VIBE_FALLBACK[opts.vibe];
}
