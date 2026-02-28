// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { TermsContent } from "./TermsContent";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service - Konectr",
  description:
    "Konectr Terms of Service. Read our rules for using the app, account policies, safety guidelines, and community standards for meeting new people in Kuala Lumpur.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Terms of Service", url: `/${locale}/terms` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        title="Terms of Service"
        subtitle="The rules that keep our community safe and fair"
        badge="Legal"
        gradient="dark"
      />
      <TermsContent />
    </>
  );
}
