// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { useEffect, useState } from "react";
import { ANDROID_STORE_URL, HAS_ANDROID_STORE, detectPlatform, type Platform } from "@/lib/smartLink";

// iOS App Store link, set via Vercel env. NEXT_PUBLIC_TESTFLIGHT_URL is the legacy
// fallback; with neither set, every CTA falls back to #waitlist.
const IOS_STORE_URL =
  process.env.NEXT_PUBLIC_IOS_STORE_URL || process.env.NEXT_PUBLIC_TESTFLIGHT_URL || "#waitlist";
export const HAS_IOS_STORE = IOS_STORE_URL !== "#waitlist";

type PosthogLike = { capture: (event: string, props?: Record<string, unknown>) => void };
function capture(event: string, props: Record<string, unknown>) {
  (window as unknown as { posthog?: PosthogLike }).posthog?.capture(event, props);
}

export type PrimaryCta = {
  href: string;
  label: string;
  id?: string;
  onClick?: () => void;
};

/**
 * The one "get Konectr" destination for every marketing CTA (hero, nav, section
 * buttons). iOS, desktop and the server render (platform not yet known) → the
 * App Store once the env var is wired; Android → Play once
 * NEXT_PUBLIC_ANDROID_STORE_URL is set; everything else → the Android notify list. Before 2026-09-23 only the hero did this and
 * the nav + "Download the app" sent iPhone visitors to the waitlist of a live beta.
 *
 * No next-intl dependency, so pages outside [locale] (e.g. /leaderboard) can use it.
 * `source` tags the click event so hero vs nav vs section clicks are separable.
 */
export function usePrimaryCta(source: string): PrimaryCta {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    // Platform reads navigator, so it must be detected after hydration; a lazy
    // initial state would diverge from the SSR (null → App Store) markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(detectPlatform());
  }, []);

  if (HAS_IOS_STORE && (platform === null || platform === "ios" || platform === "desktop")) {
    return {
      href: IOS_STORE_URL,
      label: "Download on the App Store",
      id: source === "home_hero" ? "cta-testflight" : undefined,
      onClick: () => capture("clicked_testflight_cta", { platform, source }),
    };
  }
  if (HAS_ANDROID_STORE && platform === "android") {
    return {
      href: ANDROID_STORE_URL,
      label: "Get it on Google Play",
      id: source === "home_hero" ? "cta-play" : undefined,
      onClick: () => capture("clicked_beta_cta", { mode: "open", platform: "android", source }),
    };
  }
  return { href: "#waitlist", label: "Get the app" };
}
