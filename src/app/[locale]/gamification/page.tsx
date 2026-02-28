// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { GamificationContent } from "./GamificationContent";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gamification - Konectr",
  description:
    "Earn badges, build streaks, and level up your social life with Konectr's gamification system. 6 tiers from Basic to Legendary.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GamificationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Gamification", url: `/${locale}/gamification` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
