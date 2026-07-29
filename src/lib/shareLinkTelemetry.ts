// © Konectr 2026. All rights reserved.
//
// FI-41 — first-party platform telemetry for /a/[code].
//
// WHY THIS EXISTS: Konectr has no first-party platform data anywhere.
// `waitlist_users.user_agent` stores the Tally webhook's own UA ("Tally Webhooks"),
// never the visitor's; `web_rsvps` has no UA column; `analytics_events` is in-app
// only and therefore all-iOS by construction. So the product roadmap's Android
// trigger ("iOS plateau OR waitlist threshold") is currently unmeasurable, and the
// iOS-first premise is still flagged HYPOTHESIS in CANONICAL_TRUTH.md.
//
// /a/[code] is the highest-traffic surface non-users touch, so it is the fastest
// honest read on the real Android:iOS split of people who encounter Konectr.
//
// Writes to `share_link_views` (INSERT-only for anon; no read path back).
// The pure classifier lives in ./platform so it stays testable without env/mocks.

import { supabase } from './supabase';
import { classifyPlatform } from './platform';

export type { Platform } from './platform';
export { classifyPlatform } from './platform';

/**
 * Record one page view. Fire-and-forget by design.
 *
 * Telemetry must NEVER break or slow the RSVP page — that page is the conversion
 * surface. Every failure path is swallowed; the caller runs this inside Next's
 * `after()` so it executes post-response and adds nothing to TTFB.
 */
export async function recordShareLinkView(params: {
  shareCode: string;
  userAgent: string | null;
  referrer: string | null;
}): Promise<void> {
  try {
    const { shareCode, userAgent, referrer } = params;
    await supabase.from('share_link_views').insert({
      share_code: shareCode,
      platform: classifyPlatform(userAgent),
      // Truncated: UA and referrer are attacker-controlled free text, and we only
      // ever read them back for coarse classification.
      user_agent: userAgent ? userAgent.slice(0, 500) : null,
      referrer: referrer ? referrer.slice(0, 500) : null,
    });
  } catch {
    // Intentionally silent — a telemetry failure must not surface to the visitor
    // or appear as an error on the conversion path.
  }
}
