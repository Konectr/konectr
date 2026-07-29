// © Konectr 2026. All rights reserved.
//
// Pure User-Agent classification. Deliberately dependency-free — no Supabase, no
// Next — so it can be unit-tested without env vars or mocks. This function's
// output is the evidence base for the Android build decision (FI-41), so it is
// worth keeping trivially testable.

export type Platform = 'android' | 'ios' | 'desktop' | 'bot' | 'other';

const BOT_PATTERN =
  /bot|crawler|spider|crawling|preview|facebookexternalhit|whatsapp|slackbot|telegrambot|twitterbot|linkedinbot|discordbot|embedly|quora link preview|pinterest|redditbot|applebot|googlebot|bingbot|yandex|duckduckbot|baiduspider|semrush|ahrefs|headlesschrome|lighthouse|vercel|monitor|curl|wget|python-requests|axios|node-fetch|go-http-client/;

/**
 * Classify a raw User-Agent into a small closed set.
 *
 * Order matters:
 *  1. Bots FIRST — Konectr's distribution loop is WhatsApp shares, so every share
 *     triggers a link-preview fetch against /a/[code], and several of those
 *     fetchers embed "iPhone" in their UA. Classifying them before the OS checks
 *     stops them silently inflating the iOS count, which would bias the exact
 *     decision this data exists to inform.
 *  2. Android BEFORE iOS — some Android UA strings contain "like Mac OS X".
 *  3. iPadOS reports as "Macintosh" and is indistinguishable server-side, so some
 *     iPads land in `desktop`. Acceptable: it understates iOS, and understating
 *     iOS is the conservative direction for an Android-vs-iOS decision.
 */
export function classifyPlatform(ua: string | null | undefined): Platform {
  if (!ua) return 'other';
  const s = ua.toLowerCase();

  if (BOT_PATTERN.test(s)) return 'bot';
  if (/android/.test(s)) return 'android';
  if (/iphone|ipad|ipod|ios/.test(s)) return 'ios';
  if (/windows|macintosh|mac os x|linux|cros|x11/.test(s)) return 'desktop';

  return 'other';
}
