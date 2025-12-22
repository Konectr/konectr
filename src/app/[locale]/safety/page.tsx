import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { SafetyContent } from "./SafetyContent";

export const metadata: Metadata = {
  title: "Safety - Konectr",
  description:
    "Learn about how Konectr keeps our community safe with verification, vetted venues, and community standards.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SafetyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
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
