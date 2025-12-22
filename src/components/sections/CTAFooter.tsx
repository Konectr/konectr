"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import { Heading } from "@/components/shared";

export function CTAFooter() {
  const tCta = useTranslations("home.cta");

  return (
    <section className="py-24 md:py-32 bg-background">
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

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 shadow-xl"
                >
                  {tCta("notifyMe")}
                  <span className="ml-2">🔔</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 bg-transparent"
                >
                  {tCta("learnMore")}
                </Button>
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
