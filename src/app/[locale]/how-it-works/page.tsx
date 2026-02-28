// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { HowItWorksContent } from "./HowItWorksContent";
import { generateBreadcrumbSchema, generateHowToSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How It Works - Konectr",
  description:
    "Make friends in 3 steps: pick your vibe, see who's nearby, and meet at a public venue. Small groups of 2-5 people. Konectr KL.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "How It Works", url: `/${locale}/how-it-works` },
  ]);

  const howToSchema = generateHowToSchema(
    "How to Make Friends with Konectr",
    "Find real people for real activities in 3 simple steps",
    [
      {
        name: "Pick Your Vibe",
        text: "Choose from activities like cafes, fitness, outdoors, creative workshops, and more. Set your preferred time slot and group size.",
      },
      {
        name: "See Who's Free",
        text: "Browse people nearby who want to do the same thing right now. Konectr matches you based on activity, timing, and location within 50km.",
      },
      {
        name: "Meet at the Spot",
        text: "Show up at a vetted public venue and meet your group of 2-5 people. All venues are personally visited and approved for safety and atmosphere.",
      },
    ]
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <PageHeader
        title="How Konectr Works"
        subtitle="Find your people in three simple steps"
        badge="Simple & Spontaneous"
        gradient="secondary"
      />
      <HowItWorksContent />
    </>
  );
}
