"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { staggerContainer, scaleIn, viewportOnce } from "@/lib/animations";
import { SectionHeader } from "@/components/shared";

// Activity category emojis - synced with mobile app (Dec 2025)
const vibesMeta = [
  {
    key: "cafeCulture",
    emoji: "☕",
    image: "/images/activities/cafe.jpg",
    hoverColor: "group-hover:ring-secondary",
  },
  {
    key: "fitnessWellness",
    emoji: "💪",
    image: "/images/activities/fitness.jpg",
    hoverColor: "group-hover:ring-primary/60",
  },
  {
    key: "socialGames",
    emoji: "🎉",
    image: "/images/activities/games.jpg",
    hoverColor: "group-hover:ring-primary/40",
  },
  {
    key: "natureAdventure",
    emoji: "⛰️",
    image: "/images/activities/nature.jpg",
    hoverColor: "group-hover:ring-secondary/60",
  },
  {
    key: "foodieAdventures",
    emoji: "🍽️",
    image: "/images/activities/food.jpg",
    hoverColor: "group-hover:ring-primary",
  },
  {
    key: "artsCulture",
    emoji: "🎨",
    image: "/images/activities/arts.jpg",
    hoverColor: "group-hover:ring-secondary/40",
  },
];

export function FindYourVibe() {
  const t = useTranslations("home.findYourVibe");

  return (
    <section id="vibes" className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Vibes grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...viewportOnce, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {vibesMeta.map((vibe) => (
            <motion.div
              key={vibe.key}
              variants={scaleIn}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="group cursor-pointer"
            >
              <div
                className={`relative rounded-2xl overflow-hidden ring-2 ring-transparent ${vibe.hoverColor} transition-all duration-300 aspect-[4/5]`}
              >
                {/* Background Image */}
                <Image
                  src={vibe.image}
                  alt={t(`vibes.${vibe.key}.name`)}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  quality={100}
                  unoptimized
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Emoji */}
                  <motion.span
                    className="text-4xl block mb-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {vibe.emoji}
                  </motion.span>

                  <h3
                    className="text-xl font-bold text-white mb-1"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {t(`vibes.${vibe.key}.name`)}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {t(`vibes.${vibe.key}.activities`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Download CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 py-4 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            {t("downloadApp")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
