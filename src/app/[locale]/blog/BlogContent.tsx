"use client";

import { motion } from "framer-motion";
import { BlogCard, BlogPost } from "@/components/blog/BlogCard";

interface BlogContentProps {
  posts: BlogPost[];
}

export function BlogContent({ posts }: BlogContentProps) {
  // Handle empty state
  if (posts.length === 0) {
    return (
      <main className="bg-background">
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        </section>
      </main>
    );
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  // Get unique categories from posts
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <main className="bg-background">
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2
              className="text-sm font-semibold text-primary uppercase tracking-wider mb-6"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Featured Post
            </h2>
            <BlogCard post={featuredPost} featured />
          </motion.div>

          {/* All Posts Grid */}
          {otherPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2
                className="text-sm font-semibold text-primary uppercase tracking-wider mb-6"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                All Posts
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 text-center"
            >
              <h3
                className="text-xl font-bold text-foreground mb-6"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Browse by Topic
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
