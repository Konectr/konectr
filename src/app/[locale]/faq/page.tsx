import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { FAQContent } from "./FAQContent";

export const metadata: Metadata = {
  title: "FAQ - Konectr",
  description:
    "Frequently asked questions about Konectr. Learn how our app works, safety features, pricing, and more.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
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
