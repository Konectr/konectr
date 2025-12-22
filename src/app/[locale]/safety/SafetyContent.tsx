"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const safetyFeatures = [
  {
    icon: "✅",
    title: "Phone Verified",
    description:
      "Every member verifies their phone number before joining. Real people only.",
  },
  {
    icon: "📍",
    title: "Public Venues Only",
    description:
      "All meetups happen at cafés, gyms, and public spaces—never private locations.",
  },
  {
    icon: "🚨",
    title: "Quick Reporting",
    description:
      "Flag concerning behavior in two taps. Reports trigger automatic review.",
  },
  {
    icon: "⚖️",
    title: "Three-Strike System",
    description:
      "3 reports = warning. 6 = suspension. 9 = six-month ban. No exceptions.",
  },
  {
    icon: "🔒",
    title: "Private Messaging",
    description:
      "Chat in-app only. Your phone number is never shared.",
  },
  {
    icon: "📸",
    title: "Photo Verification",
    description:
      "AI-powered selfie matching to prevent catfishing.",
    comingSoon: true,
  },
];

const guidelines = [
  {
    title: "Be Respectful",
    points: [
      "Treat everyone with kindness and respect",
      "No harassment, bullying, or hate speech",
      "Respect boundaries and consent",
    ],
  },
  {
    title: "Be Honest",
    points: [
      "Use accurate photos and information",
      "Be upfront about your intentions",
      "Don't mislead others about who you are",
    ],
  },
  {
    title: "Be Safe",
    points: [
      "Meet only at public venues",
      "Trust your instincts",
      "Report anything that feels wrong",
    ],
  },
];

const tips = [
  {
    title: "Before Meeting",
    items: [
      "Review the profiles of people you'll meet",
      "Choose meetups at familiar venues",
      "Tell a friend your plans",
      "Have your own transportation",
    ],
  },
  {
    title: "During the Meetup",
    items: [
      "Meet at the venue, not before",
      "Stay in public areas",
      "Keep your belongings with you",
      "Trust your instincts – leave if uncomfortable",
    ],
  },
  {
    title: "After the Meetup",
    items: [
      "Share feedback to help the community",
      "Report any concerning behavior",
      "Block users you don't want to see again",
      "Celebrate the good connections!",
    ],
  },
];

export function SafetyContent() {
  return (
    <main className="bg-background">
      {/* Safety Features */}
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
              How We Keep You Safe
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Multiple layers of protection so you can focus on making real
              connections
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <span className="text-4xl block mb-4">{feature.icon}</span>
                <h3
                  className="text-lg font-bold text-foreground mb-2"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {feature.title}
                  {feature.comingSoon && (
                    <span className="ml-2 inline-block bg-[#FFC845] text-[#1F1F1F] text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                      Coming Soon
                    </span>
                  )}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
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
              Community Guidelines
            </h2>
            <p className="text-muted-foreground text-lg">
              The standards that keep our community great
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={guideline.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border/50"
              >
                <h3
                  className="text-xl font-bold text-foreground mb-4"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {guideline.title}
                </h3>
                <ul className="space-y-3">
                  {guideline.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="text-muted-foreground text-sm">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
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
              Safety Tips
            </h2>
            <p className="text-muted-foreground text-lg">
              Best practices for safe and enjoyable meetups
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {tips.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 font-bold text-white ${
                    index === 0
                      ? "bg-primary"
                      : index === 1
                      ? "bg-secondary text-foreground"
                      : "bg-green-500"
                  }`}
                >
                  {index + 1}
                </div>
                <h3
                  className="text-xl font-bold text-foreground mb-4"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary">✓</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-foreground dark:bg-gray-900 text-white">
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
              Need Help?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              If you ever feel unsafe or need to report something, we&apos;re here
              for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
                asChild
              >
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white text-white hover:bg-white/10 font-semibold px-8"
                asChild
              >
                <Link href="mailto:safety@konectr.app">
                  safety@konectr.app
                </Link>
              </Button>
            </div>
            <p className="text-white/60 text-sm mt-8">
              In case of emergency, always contact local authorities first.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
