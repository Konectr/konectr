import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { HowItWorksContent } from "./HowItWorksContent";

export const metadata: Metadata = {
  title: "How It Works - Konectr",
  description:
    "Learn how Konectr helps you find real people to do real activities with, right now.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        title="How Konectr Works"
        subtitle="Find your people in three simple steps"
        badge="Simple & Spontaneous"
        gradient="secondary"
      />
      <HowItWorksContent />
    </>
  );
}
