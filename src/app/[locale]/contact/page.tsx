import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us - Konectr",
  description:
    "Get in touch with the Konectr team. We'd love to hear from you.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        title="Get in Touch"
        subtitle="We'd love to hear from you"
        badge="Contact Us"
      />
      <ContactContent />
    </>
  );
}
