// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPostBySlug, getAllSlugs, getAllPosts } from "@/lib/notion";
import { allPosts as staticPosts, getPostBySlug as getStaticPostBySlug } from "@/content/blog";
import { locales } from "@/i18n/config";
import { BlogPostContent } from "./BlogPostContent";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug) ?? getStaticPostBySlug(slug) ?? null;

  if (!post) {
    return {
      title: "Post Not Found - Konectr Blog",
    };
  }

  return {
    title: `${post.title} - Konectr Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  let slugs = await getAllSlugs();
  if (slugs.length === 0) {
    slugs = staticPosts.map((p) => p.slug);
  }
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
  ]);

  // Fall back to static content if Notion returns empty
  if (!post) {
    const staticPost = getStaticPostBySlug(slug);
    if (staticPost) {
      post = staticPost;
    }
  }
  if (allPosts.length === 0) {
    allPosts = staticPosts;
  }

  if (!post) {
    notFound();
  }

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Organization",
      name: "Konectr",
    },
    publisher: {
      "@type": "Organization",
      name: "Konectr",
      logo: {
        "@type": "ImageObject",
        url: "https://konectr.app/logos/konectr-icon-orange.svg",
      },
    },
    datePublished: post.date,
    ...(post.image && { image: post.image }),
    url: `https://konectr.app/${locale}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogPostContent post={post} allPosts={allPosts} />
    </>
  );
}
