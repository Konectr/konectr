// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { ChildSafetyContent } from "./ChildSafetyContent";
import { generateBreadcrumbSchema } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

// Required by Google Play: every app in the Social or Dating category must link a
// PUBLISHED child safety standards page from Play Console → App content → Child
// safety standards. Play's constraints on that URL: active, publicly reachable
// from anywhere in the world, not editable by visitors, and not a PDF.
// Do not remove, gate, geo-restrict or noindex this route — the Play declaration
// points at it, and a dead link there puts the listing at risk.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/child-safety",
    title: "Child Safety Standards | Konectr",
    description:
      "Konectr's standards against child sexual abuse and exploitation (CSAE): 18+ only, what is prohibited, how to report in-app or by email, and how we respond and report to authorities.",
  });
}

export default async function ChildSafetyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Child Safety Standards", url: `/${locale}/child-safety` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        title="Child Safety Standards"
        subtitle="Konectr is an adults-only app. We have zero tolerance for child sexual abuse and exploitation."
        badge="Safety"
        gradient="dark"
      />
      <ChildSafetyContent />
    </>
  );
}
