// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import type { Metadata } from "next";
import FlappyKonectr from "@/components/games/FlappyKonectr";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Konectr",
  description:
    "This page doesn't exist, but you can play Flappy Konectr while you're here!",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <FlappyKonectr />;
}
