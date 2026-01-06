"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/homepage/hero.jpg"
          alt="Friends laughing together"
          fill
          className="object-cover"
          priority
          quality={100}
          unoptimized
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/60" />
        {/* Animated background elements */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-secondary/20 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <Image
            src={brand.assets.logoWhite}
            alt="Konectr"
            width={300}
            height={80}
            className="mx-auto h-16 md:h-20 w-auto drop-shadow-lg"
            priority
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8"
        >
          <span className="text-lg">✨</span>
          <span className="text-white font-semibold text-sm">
            {t("launching", { date: brand.launchDate })}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-heading text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6 whitespace-pre-line"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
        >
          {t("headline")}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/90 font-medium mb-10 max-w-2xl mx-auto"
        >
          {t("subtext")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="rounded-full bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
            asChild
          >
            <a href="#waitlist">
              {t("joinWaitlist")}
              <span className="ml-2">→</span>
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-2 border-white/80 text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 bg-transparent"
            asChild
          >
            <a href="#how">
              {t("seeHowItWorks")}
            </a>
          </Button>
        </motion.div>

        {/* Venue showcase - Activity pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { emoji: "☕", labelKey: "cafe" },
            { emoji: "🍽️", labelKey: "restaurant" },
            { emoji: "🍻", labelKey: "bar" },
            { emoji: "💪", labelKey: "fitness" },
            { emoji: "⛰️", labelKey: "outdoors" },
            { emoji: "🎭", labelKey: "entertainment" },
          ].map((item, index) => (
            <motion.div
              key={item.labelKey}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-2xl cursor-pointer hover:bg-white/25 transition-colors"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-white font-semibold">{t(`activities.${item.labelKey}`)}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-3 rounded-full bg-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
