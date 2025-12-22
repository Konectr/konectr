"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/shared";

export function TheShift() {
  const t = useTranslations("home.theShift");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform values for the scroll-driven animation
  const beforeOpacity = useTransform(scrollYProgress, [0.2, 0.5], [1, 0.3]);
  const afterOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0.3, 1]);
  const beforeScale = useTransform(scrollYProgress, [0.2, 0.5], [1, 0.95]);
  const afterScale = useTransform(scrollYProgress, [0.3, 0.6], [0.95, 1]);
  const beforeGrayscale = useTransform(scrollYProgress, [0.2, 0.5], [1, 0.8]);
  const afterSaturation = useTransform(scrollYProgress, [0.3, 0.6], [0.5, 1.1]);

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-32 bg-background overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Before / After comparison */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Before - Scrolling alone */}
          <motion.div
            style={{ opacity: beforeOpacity, scale: beforeScale }}
            className="relative"
          >
            <motion.div
              style={{ filter: `grayscale(${beforeGrayscale})` }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden"
            >
              {/* Real image - person alone */}
              <Image
                src="/images/homepage/before.jpg"
                alt="Person alone on phone"
                fill
                className="object-cover"
                quality={100}
                unoptimized
              />

              {/* Overlay text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                  {t("before")}
                </span>
                <p className="text-white text-xl font-bold mt-1">
                  {t("beforeText")}
                </p>
              </div>
            </motion.div>

            {/* Sad indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-4 -right-4 w-16 h-16 bg-muted dark:bg-muted rounded-full flex items-center justify-center text-3xl shadow-lg"
            >
              😔
            </motion.div>
          </motion.div>

          {/* After - Living with friends */}
          <motion.div
            style={{ opacity: afterOpacity, scale: afterScale }}
            className="relative"
          >
            <motion.div
              style={{ filter: `saturate(${afterSaturation})` }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden"
            >
              {/* Real image - friends together */}
              <Image
                src="/images/homepage/after.jpg"
                alt="Friends laughing together"
                fill
                className="object-cover"
                quality={100}
                unoptimized
              />

              {/* Overlay text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <span className="text-secondary text-sm font-medium uppercase tracking-wider">
                  {t("after")}
                </span>
                <p className="text-white text-xl font-bold mt-1">
                  {t("afterText")}
                </p>
              </div>
            </motion.div>

            {/* Happy indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-3xl shadow-lg"
            >
              🥳
            </motion.div>
          </motion.div>
        </div>

        {/* Arrow indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="hidden md:flex justify-center mt-12"
        >
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="text-lg">{t("fromThis")}</span>
            <motion.span
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary text-2xl"
            >
              →
            </motion.span>
            <span className="text-lg font-semibold text-foreground">{t("toThis")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
