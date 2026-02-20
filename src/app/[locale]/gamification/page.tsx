// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { GamificationContent } from "./GamificationContent";

export const metadata: Metadata = {
  title: "Gamification - Konectr",
  description:
    "Discover how Konectr rewards real-world connections with tiers, badges, streaks, and daily rewards. Level up your social life.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GamificationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        title="Level Up Your Social Life"
        subtitle="Every real connection earns rewards. Climb tiers, collect badges, and unlock perks."
        badge="Gamification"
        gradient="primary"
      />
      <GamificationContent />
    </>
  );
}
