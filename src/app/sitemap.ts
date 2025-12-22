import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getAllSlugs } from "@/content/blog";

const baseUrl = "https://konectr.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();
  const now = new Date();

  // Static pages
  const staticPages = ["", "/about", "/how-it-works", "/safety", "/contact", "/blog"];

  // Generate entries for all locales and static pages
  const staticEntries = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}${page}`])
        ),
      },
    }))
  );

  // Generate entries for all blog posts across all locales
  const blogEntries = slugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}/blog/${slug}`])
        ),
      },
    }))
  );

  return [...staticEntries, ...blogEntries];
}
