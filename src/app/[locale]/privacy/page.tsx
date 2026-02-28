// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { PrivacyContent } from "./PrivacyContent";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy - Konectr",
  description:
    "Konectr Privacy Policy. How we collect, use, and protect your data. PDPA 2010 compliant. Your location, messages, and personal information are always protected.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Privacy Policy", url: `/${locale}/privacy` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        title="Privacy Policy"
        subtitle="How we protect your data and respect your privacy"
        badge="Legal"
        gradient="dark"
      />
      <PrivacyContent />
    </>
  );
}
