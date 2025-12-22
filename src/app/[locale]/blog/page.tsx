import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { BlogContent } from "./BlogContent";

export const metadata: Metadata = {
  title: "Blog - Konectr",
  description:
    "Stories, tips, and insights about building genuine connections in the modern world.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        title="Stories & Insights"
        subtitle="Tips, stories, and thoughts on real-world connection"
        badge="Blog"
        gradient="primary"
      />
      <BlogContent />
    </>
  );
}
