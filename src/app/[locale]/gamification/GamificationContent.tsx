// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  tiers,
  badgeCategories,
  badgeRarities,
  streakMilestones,
  flamePhases,
  dailyRewardsHighlights,
  xpSources,
} from "./gamification-data";

export function GamificationContent() {
  return (
    <main className="bg-background">
      {/* Section 1: Tier Progression */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Your Journey, Six Tiers
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From your first activity to legendary status — every meetup moves
              you forward
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier, index) => {
              const isElite =
                tier.name === "Platinum" || tier.name === "Legendary";
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl p-6 border border-border/50 ${
                    isElite ? "bg-card/80" : "bg-card"
                  }`}
                  style={{
                    borderLeftWidth: "4px",
                    borderLeftColor: tier.color,
                    ...(isElite
                      ? {
                          background: `linear-gradient(135deg, ${tier.color}08, ${tier.color}03)`,
                        }
                      : {}),
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{tier.emoji}</span>
                    <div>
                      <h3
                        className="text-lg font-bold text-foreground"
                        style={{ fontFamily: "'Satoshi', sans-serif" }}
                      >
                        {tier.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {tier.activitiesRequired === 0
                          ? "Starting tier"
                          : `${tier.activitiesRequired} activities`}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {tier.description}
                  </p>
                  <ul className="space-y-1.5">
                    {tier.perks.map((perk) => (
                      <li
                        key={perk}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <span style={{ color: tier.color }}>+</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Badge Collection */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Collect Badges
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              9 categories of achievements that celebrate how you connect
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {badgeCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <span className="text-3xl block mb-3">{category.emoji}</span>
                <h3
                  className="text-lg font-bold text-foreground mb-1"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                  {category.description}
                </p>
                <span className="inline-block text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                  e.g. {category.example}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Rarity Scale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-center text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Badge Rarity
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {badgeRarities.map((rarity) => (
                <div
                  key={rarity.name}
                  className="flex items-center gap-2 bg-card border border-border/50 rounded-full px-4 py-2"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: rarity.color }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {rarity.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {rarity.distribution}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Streak System */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Keep the Flame Alive
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Stay active week after week and watch your streak grow
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto mb-12">
            {/* Vertical Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-8">
                {streakMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.days}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-center gap-6 pl-14"
                  >
                    {/* Dot */}
                    <div
                      className="absolute left-4 w-5 h-5 rounded-full border-2 border-background"
                      style={{ backgroundColor: milestone.color }}
                    />
                    <div className="flex-1 bg-card rounded-xl p-4 border border-border/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <span
                            className="font-bold text-foreground"
                            style={{ fontFamily: "'Satoshi', sans-serif" }}
                          >
                            {milestone.label}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                        </div>
                        <span className="text-2xl">
                          {index < 2 ? "🔥" : index < 4 ? "🔥🔥" : "🔥🔥🔥"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Flame Progression */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {flamePhases.map((phase) => (
              <div
                key={phase.label}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
                <span className="font-medium text-foreground">
                  {phase.label}
                </span>
                <span className="text-muted-foreground">{phase.range}</span>
              </div>
            ))}
          </motion.div>

          {/* Shield Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto bg-card rounded-2xl p-6 border border-border/50 text-center"
          >
            <span className="text-3xl block mb-2">🛡️</span>
            <h4
              className="font-bold text-foreground mb-2"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Streak Shield
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Life happens. Streak Shields protect your streak if you miss a
              week — earned through consistent activity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Daily Rewards */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Daily Rewards
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Check in daily for 30 days to unlock escalating XP bonuses
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
            {dailyRewardsHighlights.map((reward, index) => (
              <motion.div
                key={reward.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col items-center gap-2 rounded-2xl p-5 border ${
                  reward.special
                    ? "border-primary bg-primary/5"
                    : "border-border/50 bg-card"
                } min-w-[120px]`}
              >
                <span className="text-3xl">{reward.emoji}</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Day {reward.day}
                </span>
                <span
                  className="text-lg font-bold text-foreground"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {reward.xp} XP
                </span>
                <span className="text-xs text-muted-foreground">
                  {reward.label}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground"
          >
            The cycle resets after Day 30 — start again with boosted base
            rewards
          </motion.p>
        </div>
      </section>

      {/* Section 5: XP System */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Earn XP Everywhere
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Six ways to earn experience points — from creating activities to
              maintaining streaks
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {xpSources.map((source, index) => (
              <motion.div
                key={source.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50 text-center"
              >
                <span className="text-3xl block mb-3">{source.icon}</span>
                <h3
                  className="font-bold text-foreground mb-1"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {source.label}
                </h3>
                <p className="text-sm text-primary font-semibold">
                  {source.range}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Multiplier Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto rounded-2xl p-6 border-2 text-center"
            style={{
              borderImage: "linear-gradient(135deg, #FF774D, #FFC845) 1",
            }}
          >
            <span className="text-3xl block mb-2">⚡</span>
            <h4
              className="font-bold text-foreground mb-2"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Streak Multiplier
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your streak boosts all XP earned. Start at 1.0x and climb to 2.0x
              at 30+ days. The longer your streak, the faster you level up.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 6: Summary Stats */}
      <section className="py-16 bg-foreground dark:bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { emoji: "🏔️", value: "6 Tiers" },
              { emoji: "🏅", value: "45+ Badges" },
              { emoji: "🔥", value: "6 Streak Milestones" },
              { emoji: "🎁", value: "30-Day Rewards" },
            ].map((stat) => (
              <div key={stat.value}>
                <span className="text-3xl block mb-2">{stat.emoji}</span>
                <span
                  className="text-xl md:text-2xl font-bold"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 7: CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl md:text-4xl font-black mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Join Konectr and turn every real-world connection into progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full bg-white text-primary hover:bg-white/90 font-bold px-8"
                asChild
              >
                <Link href="/#waitlist">Get Early Access</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white text-white hover:text-white hover:border-white hover:bg-white/10 bg-transparent font-semibold px-8"
                asChild
              >
                <Link href="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
