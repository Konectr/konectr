"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
  image?: string;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/blog/${post.slug}`} className="block group">
        <div
          className={`bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-colors ${
            featured ? "md:grid md:grid-cols-2 md:gap-8" : ""
          }`}
        >
          {/* Image */}
          <div className={featured ? "md:h-full" : ""}>
            <ImagePlaceholder
              aspectRatio={featured ? "square" : "video"}
              src={post.image}
              alt={post.title}
              label={!post.image ? post.category : undefined}
              icon={!post.image ? "📝" : undefined}
              gradient="orange"
              className={`${featured ? "md:h-full md:rounded-none" : ""} group-hover:scale-105 transition-transform duration-500 overflow-hidden`}
            />
          </div>

          {/* Content */}
          <div className={`p-6 ${featured ? "md:py-8 md:pr-8 md:pl-0" : ""}`}>
            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                {post.category}
              </span>
              <span>{post.readTime}</span>
            </div>

            {/* Title */}
            <h3
              className={`font-bold text-foreground group-hover:text-primary transition-colors mb-2 ${
                featured ? "text-2xl md:text-3xl" : "text-lg"
              }`}
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {post.title}
            </h3>

            {/* Excerpt */}
            <p
              className={`text-muted-foreground leading-relaxed ${
                featured ? "text-base mb-4" : "text-sm mb-3 line-clamp-2"
              }`}
            >
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{post.date}</span>
              <span className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Read more <span>→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
