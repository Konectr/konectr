// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { DeleteAccountContent } from "./DeleteAccountContent";
import { generateBreadcrumbSchema } from "@/lib/seo";

// Required by Google Play: apps that allow account creation must provide a
// publicly reachable account-deletion URL that works WITHOUT installing the app.
// Declared in the Play Data Safety form. Do not remove or gate this route.
export const metadata: Metadata = {
  title: "Delete Your Account - Konectr",
  description:
    "How to delete your Konectr account and what happens to your data. Delete in the app or request deletion by email. 30-day grace period, PDPA 2010 compliant.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DeleteAccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Delete Your Account", url: `/${locale}/delete-account` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        title="Delete Your Account"
        subtitle="How to delete your account, and exactly what happens to your data"
        badge="Privacy"
        gradient="dark"
      />
      <DeleteAccountContent />
    </>
  );
}
