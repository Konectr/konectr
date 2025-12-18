"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    emoji: "✨",
    title: "Pick your vibe",
    description: "Coffee chat? Gym session? Trail hike? Choose what you're feeling.",
    color: "from-primary to-orange-500",
  },
  {
    number: "02",
    emoji: "⚡",
    title: "See who's free",
    description: "Find people available right now. No awkward scheduling.",
    color: "from-secondary to-amber-400",
  },
  {
    number: "03",
    emoji: "🎯",
    title: "Meet at the spot",
    description: "Show up, connect, make it happen. Simple as that.",
    color: "from-green-400 to-emerald-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
};

export function HowItWorks() {
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
            Connection made simple
          </h2>
          <p className="text-muted-foreground text-lg">
            Three steps to your next adventure
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative group"
            >
              {/* Card */}
              <div className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full border border-border/50">
                {/* Top accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r ${step.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
                />

                {/* Number badge */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg mb-6 shadow-lg`}
                >
                  {step.number}
                </div>

                {/* Emoji */}
                <span className="text-4xl block mb-4">{step.emoji}</span>

                {/* Content */}
                <h3
                  className="text-xl font-bold text-foreground mb-3"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-primary/30" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
