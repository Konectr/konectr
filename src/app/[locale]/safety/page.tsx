// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { SafetyContent } from "./SafetyContent";
import { generateBreadcrumbSchema } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/safety",
    title: "Safety & Community Guidelines | Konectr",
    description:
      "How Konectr keeps real-world meetups in KL safe: verified profiles, public venues, reporting with a 24-hour response commitment, and clear community rules.",
  });
}

export default async function SafetyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Safety", url: `/${locale}/safety` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        title="Your Safety Matters"
        subtitle="Building trust so you can focus on connection"
        badge="Safety First"
        gradient="dark"
      />
      <SafetyContent />
    </>
  );
}
