// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import FeedbackBoardContent from "./FeedbackBoardContent";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Feedback Board | Konectr",
  description:
    "See what Konectr users are requesting. Feature requests, bug reports, and community feedback — all public and transparent.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FeedbackPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Feedback", url: `/${locale}/feedback` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FeedbackBoardContent />
    </>
  );
}
