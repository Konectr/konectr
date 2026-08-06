// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { AboutContent } from "./AboutContent";
import { generateBreadcrumbSchema } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/about",
    title: "Our Story — Why We Built Konectr in Kuala Lumpur",
    description:
      "Konectr started with real meetups in KL, not code. Read why we're building the activity-first way to make friends in Kuala Lumpur.",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "About", url: `/${locale}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        title="About Konectr"
        subtitle="We're on a mission to get people off their phones and into real life."
        badge="Our Story"
      />
      <AboutContent />
    </>
  );
}
