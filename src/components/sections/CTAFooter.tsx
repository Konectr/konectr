// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import { Heading } from "@/components/shared";
import StoreCTAs from "@/components/StoreCTAs";

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
            className="relative bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl p-10 md:p-16 text-center overflow-hidden shadow-[var(--shadow-brand-lg)]"
          >
            {/* Background animation */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_70%)]" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10">
              <Heading level={2} size="xl" animated={false} className="text-white mb-4">
                {tCta("title")}
              </Heading>
              <p className="text-white/90 text-lg mb-8 max-w-md mx-auto">
                {tCta("subtitle")}
              </p>

              {/* Store buttons replaced the Tally waitlist once both stores went live.
                  The section keeps id="waitlist" so old /#waitlist links land here. */}
              <div className="max-w-xs mx-auto">
                <StoreCTAs platform={null} source="home_footer" />
              </div>

            </div>
          </motion.div>
        </div>
      </section>
  );
}
