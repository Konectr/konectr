"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import { Heading } from "@/components/shared";

export function CTAFooter() {
  const tCta = useTranslations("home.cta");

  return (
    <section id="waitlist" className="py-24 md:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUp}
            className="relative bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl p-10 md:p-16 text-center overflow-hidden"
          >
            {/* Background animation */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-white/10 to-transparent" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10">
              <Heading level={2} size="xl" animated={false} className="text-white mb-4">
                {tCta("title")}
              </Heading>
              <p className="text-white/90 text-lg mb-8 max-w-md mx-auto">
                {tCta("subtitle")}
              </p>

              {/* Tally Waitlist Form - Using direct src for reliable loading */}
              <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white">
                <iframe
                  src="https://tally.so/embed/mY1xRq?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  title="Konectr Waitlist"
                  className="bg-white rounded-2xl"
                  style={{ minHeight: '500px' }}
                />
              </div>

              <p className="text-white/60 text-sm mt-6">
                {tCta("noSpam")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
  );
}
