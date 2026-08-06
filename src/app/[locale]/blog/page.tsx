// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { BlogContent } from "./BlogContent";
import { getAllPosts } from "@/lib/notion";
import { allPosts as staticPosts } from "@/content/blog";
import { generateBreadcrumbSchema } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/metadata";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/blog",
    title: "Konectr Blog — Making Friends & Social Life in KL",
    description:
      "Tips and stories on making friends as an adult in Kuala Lumpur: activities, expat life, and beating the friendship recession.",
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch posts from Notion, fall back to static content
  let posts = await getAllPosts();
  if (posts.length === 0) {
    posts = staticPosts;
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Blog", url: `/${locale}/blog` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        title="Stories & Insights"
        subtitle="Tips, stories, and thoughts on real-world connection"
        badge="Blog"
        gradient="primary"
      />
      <BlogContent posts={posts} />
    </>
  );
}
