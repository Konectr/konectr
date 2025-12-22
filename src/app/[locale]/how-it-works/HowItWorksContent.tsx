"use client";

import { motion } from "framer-motion";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    number: "01",
    title: "Pick Your Vibe",
    description:
      "Choose what you're in the mood for. Coffee chat? Trail run? Board game night? Browse activities happening near you or create your own.",
    details: [
      "Browse by category: Fitness, Food, Games, Outdoors, Arts & more",
      "See what's happening right now or later today",
      "Filter by location, time, and group size",
    ],
    icon: "✨",
    gradient: "from-primary to-orange-500",
    image: "/images/homepage/step-1.jpg",
  },
  {
    number: "02",
    title: "See Who's Free",
    description:
      "No more back-and-forth scheduling. See real people who are available at the same time as you, matched by shared interests and vibe.",
    details: [
      "Real-time availability – see who's free NOW",
      "Vibe-based matching for better connections",
      "Small groups (2-5 people) for quality conversations",
    ],
    icon: "⚡",
    gradient: "from-secondary to-amber-400",
    image: "/images/homepage/step-2.jpg",
  },
  {
    number: "03",
    title: "Meet at the Spot",
    description:
      "Show up at a vetted venue, connect with like-minded people, and make it happen. No pressure, no awkwardness – just real moments.",
    details: [
      "All meetups at safe, public venues",
      "Arrive, connect, and enjoy",
      "Rate your experience to help the community",
    ],
    icon: "🎯",
    gradient: "from-green-400 to-emerald-500",
    image: "/images/homepage/step-3.jpg",
  },
];

const faqs = [
  {
    question: "Is Konectr free to use?",
    answer:
      "Yes! Konectr is free to join and use. We may offer premium features in the future, but the core experience of connecting with people will always be free.",
  },
  {
    question: "How do I know the people I meet are safe?",
    answer:
      "All users go through identity verification. All meetups happen at vetted public venues. We have a dedicated safety team and zero-tolerance policy for inappropriate behavior.",
  },
  {
    question: "What if I'm shy or introverted?",
    answer:
      "Konectr is perfect for introverts! Since you're connecting over shared activities, there's always something to focus on besides small talk. Plus, small group sizes (2-4 people) keep things comfortable.",
  },
  {
    question: "Can I create my own meetups?",
    answer:
      "Absolutely! You can either join existing activities or create your own. Pick a venue, set a time, and let others join you.",
  },
  {
    question: "What cities is Konectr available in?",
    answer:
      "We're launching in select cities first and expanding quickly. Join the waitlist to be notified when we launch in your area!",
  },
  {
    question: "How is this different from Meetup or Bumble BFF?",
    answer:
      "Konectr focuses on real-time, spontaneous connections. No scheduling weeks ahead or swiping through profiles. See who's free now and meet up today.",
  },
];

export function HowItWorksContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="bg-background">
      {/* Detailed Steps */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`grid md:grid-cols-2 gap-12 items-center mb-24 last:mb-0 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} text-white font-bold text-xl mb-6`}
                >
                  {step.number}
                </div>
                <h2
                  className="text-3xl md:text-4xl font-black text-foreground mb-4"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {step.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {step.description}
                </p>
                <ul className="space-y-3">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <ImagePlaceholder
                  aspectRatio="square"
                  src={step.image}
                  alt={step.title}
                  className="rounded-3xl"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
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
              Why People Love Konectr
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "⏰",
                title: "Real-Time",
                desc: "See who's free right now, not next week",
              },
              {
                icon: "🎯",
                title: "Activity-First",
                desc: "Connect over shared interests, not profiles",
              },
              {
                icon: "👥",
                title: "Small Groups",
                desc: "2-4 people for genuine conversations",
              },
              {
                icon: "📍",
                title: "Vetted Venues",
                desc: "All meetups at safe, public locations",
              },
              {
                icon: "✅",
                title: "Verified Users",
                desc: "Every member is identity verified",
              },
              {
                icon: "🚀",
                title: "No Pressure",
                desc: "Casual meetups, no commitment required",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <span className="text-3xl block mb-3">{feature.icon}</span>
                <h3 className="font-bold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`text-primary transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>
                {openFaq === index && (
                  <div className="p-5 pt-0 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-orange-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Ready to find your people?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of others who are ditching the scroll for real
              adventures.
            </p>
            <Button
              size="lg"
              className="rounded-full bg-white text-primary hover:bg-white/90 font-bold px-8"
              asChild
            >
              <Link href="/#cta">Get Early Access</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
