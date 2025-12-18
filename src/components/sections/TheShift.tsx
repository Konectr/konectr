"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function TheShift() {
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
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl md:text-5xl font-black text-foreground mb-4"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            The shift starts here
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From endless scrolling to real moments
          </p>
        </motion.div>

        {/* Before / After comparison */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Before - Scrolling alone */}
          <motion.div
            style={{ opacity: beforeOpacity, scale: beforeScale }}
            className="relative"
          >
            <motion.div
              style={{ filter: `grayscale(${beforeGrayscale})` }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
            >
              {/* Placeholder for image - person alone scrolling */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="text-6xl mb-4 block opacity-50">📱</span>
                  <p className="text-muted-foreground/60 text-sm">
                    [Image: Person alone scrolling]
                  </p>
                </div>
              </div>

              {/* Overlay text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                  Before
                </span>
                <p className="text-white text-xl font-bold mt-1">
                  Scrolling through life
                </p>
              </div>
            </motion.div>

            {/* Sad indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-4 -right-4 w-16 h-16 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center text-3xl shadow-lg"
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
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20"
            >
              {/* Placeholder for image - friends together */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
                <div className="text-center p-8">
                  <span className="text-6xl mb-4 block">🎉</span>
                  <p className="text-primary/60 text-sm">
                    [Image: Friends laughing together]
                  </p>
                </div>
              </div>

              {/* Overlay text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-secondary text-sm font-medium uppercase tracking-wider">
                  After
                </span>
                <p className="text-white text-xl font-bold mt-1">
                  Living in the moment
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
            <span className="text-lg">From this</span>
            <motion.span
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary text-2xl"
            >
              →
            </motion.span>
            <span className="text-lg font-semibold text-foreground">To this</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
