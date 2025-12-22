"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { staggerContainer, fadeInUp, hoverLift, viewportOnce } from "@/lib/animations";
import { SectionHeader } from "@/components/shared";

const stepsMeta = [
  {
    key: "step1",
    emoji: "✨",
    color: "from-primary to-primary/80",
    image: "/images/homepage/step-1.jpg",
  },
  {
    key: "step2",
    emoji: "⚡",
    color: "from-secondary to-secondary/80",
    image: "/images/homepage/step-2.jpg",
  },
  {
    key: "step3",
    emoji: "🎯",
    color: "from-primary/60 to-primary/40",
    image: "/images/homepage/step-3.jpg",
  },
];

export function HowItWorks() {
  const t = useTranslations("home.howItWorks");

  return (
    <section id="how" className="py-24 md:py-32 bg-secondary/30 dark:bg-secondary/10 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff774d' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Steps grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...viewportOnce, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {stepsMeta.map((step, index) => (
            <motion.div
              key={step.key}
              variants={fadeInUp}
              whileHover={hoverLift}
              className="relative group"
            >
              {/* Card */}
              <div className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full border border-border/50">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={step.image}
                    alt={t(`steps.${step.key}.title`)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    quality={100}
                    unoptimized
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${step.color} opacity-40`} />
                  {/* Number badge */}
                  <div
                    className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                  >
                    {t(`steps.${step.key}.number`)}
                  </div>
                </div>

                <div className="p-6">
                  {/* Emoji */}
                  <span className="text-3xl block mb-3">{step.emoji}</span>

                  {/* Content */}
                  <h3
                    className="text-xl font-bold text-foreground mb-2"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {t(`steps.${step.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {t(`steps.${step.key}.description`)}
                  </p>
                </div>
              </div>

              {/* Connector line (hidden on last item and mobile) */}
              {index < stepsMeta.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-primary/30" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
