import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us - Konectr",
  description:
    "Learn about Konectr's mission to bring real human connection back to the digital age.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        title="About Konectr"
        subtitle="We're on a mission to get people off their phones and into real life."
        badge="Our Story"
      />
      <AboutContent />
    </>
  );
}
