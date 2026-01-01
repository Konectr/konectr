"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import { Heading } from "@/components/shared";

// Declare Tally on window for TypeScript
declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

export function CTAFooter() {
  const tCta = useTranslations("home.cta");

  // Load Tally embeds when component mounts with retry and fallback
  useEffect(() => {
    const loadTallyForm = () => {
      if (typeof window === "undefined") return;

      if (window.Tally) {
        window.Tally.loadEmbeds();
      } else {
        // Fallback: manually set src on iframes with data-tally-src
        document.querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])").forEach((iframe) => {
          if (iframe.dataset.tallySrc) {
            iframe.src = iframe.dataset.tallySrc;
          }
        });
      }
    };

    // Try immediately
    loadTallyForm();

    // Retry after delays in case script hasn't loaded yet
    const timer1 = setTimeout(loadTallyForm, 500);
    const timer2 = setTimeout(loadTallyForm, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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

              {/* Tally Waitlist Form */}
              <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  data-tally-src="https://tally.so/embed/mY1xRq?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                  loading="lazy"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Konectr Waitlist"
                  className="bg-white rounded-2xl"
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
