// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ANDROID_STORE_URL, HAS_ANDROID_STORE, detectPlatform, type Platform } from "@/lib/smartLink";

// TestFlight Public Link — set via Vercel env. Falls back to #waitlist if not configured.
const TESTFLIGHT_URL = process.env.NEXT_PUBLIC_TESTFLIGHT_URL || "#waitlist";
export const HAS_TESTFLIGHT = TESTFLIGHT_URL !== "#waitlist";

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
 * buttons). iOS + desktop → TestFlight once the env var is wired (desktop can
 * AirDrop/scan it); Android → Play once NEXT_PUBLIC_ANDROID_STORE_URL is set;
 * everything else → the waitlist. Before 2026-09-23 only the hero did this and
 * the nav + "Download the app" sent iPhone visitors to the waitlist of a live beta.
 *
 * `source` tags the click event so hero vs nav vs section clicks are separable.
 */
export function usePrimaryCta(source: string): PrimaryCta {
  const t = useTranslations("home.hero");
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    // Platform reads navigator, so it must be detected after hydration; a lazy
    // initial state would diverge from the SSR (null → waitlist) markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(detectPlatform());
  }, []);

  if (HAS_TESTFLIGHT && (platform === "ios" || platform === "desktop")) {
    return {
      href: TESTFLIGHT_URL,
      label: "Open the beta on iPhone",
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
  return { href: "#waitlist", label: t("joinWaitlist") };
}
