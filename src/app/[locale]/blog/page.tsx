// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { BlogContent } from "./BlogContent";
import { getAllPosts } from "@/lib/notion";
import { allPosts as staticPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog - Konectr",
  description:
    "Stories, tips, and insights about building genuine connections in the modern world.",
};

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch posts from Notion, fall back to static content
  let posts = await getAllPosts();
  if (posts.length === 0) {
    posts = staticPosts;
  }

  return (
    <>
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
