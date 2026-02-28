// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { SafetyContent } from "./SafetyContent";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Safety - Konectr",
  description:
    "Your safety matters. Phone-verified profiles, public venues only, 3-strike policy. How Konectr protects you when meeting new people in KL.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

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
