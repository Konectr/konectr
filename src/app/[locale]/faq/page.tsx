// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { FAQContent } from "./FAQContent";
import { faqCategories } from "./faq-data";
import { generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ - Konectr",
  description:
    "Got questions about Konectr? 55+ answers about meeting people, safety, activities, badges, and how the app works in Kuala Lumpur.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

function getFaqJsonLd() {
  const allFaqs = faqCategories.flatMap((cat) => cat.faqs);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "FAQ", url: `/${locale}/faq` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Konectr"
        badge="Got Questions?"
        gradient="primary"
      />
      <FAQContent />
    </>
  );
}
