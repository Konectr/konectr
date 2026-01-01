"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getFeedbackTickets } from "@/lib/feedback-api";
import { categoryMeta, type FeedbackTicket, type FeedbackCategory } from "@/types/feedback";
import FeedbackTicketCard from "./components/FeedbackTicketCard";
import CategoryFilter from "./components/CategoryFilter";

const sortOptions = [
  { value: "created_at", label: "Newest" },
  { value: "upvotes", label: "Most Voted" },
  { value: "trending", label: "Trending" },
] as const;

type SortOption = typeof sortOptions[number]["value"];

export default function FeedbackBoardContent() {
  const [tickets, setTickets] = useState<FeedbackTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("created_at");

  useEffect(() => {
    loadTickets();
  }, [category, sortBy]);

  async function loadTickets() {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeedbackTickets({
        category: category || undefined,
        sortBy,
      });
      setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setError("Failed to load feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black text-foreground mb-4"
          >
            Feedback Board
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground mb-4"
          >
            See what features the community wants
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-muted-foreground/70"
          >
            Join the waitlist to be first to submit feedback and vote
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b bg-background sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CategoryFilter
              selected={category}
              onChange={setCategory}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Ticket List */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-muted rounded-xl h-36"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">⚠️</span>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Something went wrong
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadTickets} variant="outline">
                Try Again
              </Button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">📭</span>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No feedback yet
              </h3>
              <p className="text-muted-foreground mb-4">
                {category
                  ? `No ${categoryMeta[category].label.toLowerCase()} submissions yet.`
                  : "Be the first to share your ideas!"}
              </p>
              {category && (
                <Button
                  variant="outline"
                  onClick={() => setCategory(null)}
                >
                  View all feedback
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <FeedbackTicketCard ticket={ticket} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit Feedback CTA */}
      <section className="py-12 border-t">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Have feedback to share?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join the waitlist to be first to submit feedback and vote when the app launches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90"
            >
              <a href="/#waitlist">
                Join the Waitlist
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:feedback@konectr.app">
                Email feedback@konectr.app
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
