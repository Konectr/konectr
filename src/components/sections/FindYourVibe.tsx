"use client";

import { motion } from "framer-motion";

const vibes = [
  {
    emoji: "☕",
    name: "Cafe Culture",
    activities: "Coffee chats • Co-working • Book clubs",
    gradient: "from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30",
    hoverColor: "group-hover:border-amber-400",
  },
  {
    emoji: "🏃‍♀️",
    name: "Fitness & Wellness",
    activities: "Yoga • Running • Gym sessions",
    gradient: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
    hoverColor: "group-hover:border-green-400",
  },
  {
    emoji: "🎮",
    name: "Social Games",
    activities: "Board games • Trivia • Video games",
    gradient: "from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
    hoverColor: "group-hover:border-purple-400",
  },
  {
    emoji: "🌳",
    name: "Nature & Adventure",
    activities: "Hiking • Parks • Outdoor sports",
    gradient: "from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30",
    hoverColor: "group-hover:border-teal-400",
  },
  {
    emoji: "🍜",
    name: "Foodie Adventures",
    activities: "Restaurant hopping • Food tours • Cooking",
    gradient: "from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30",
    hoverColor: "group-hover:border-red-400",
  },
  {
    emoji: "🎨",
    name: "Arts & Culture",
    activities: "Museums • Galleries • Workshops",
    gradient: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
    hoverColor: "group-hover:border-blue-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function FindYourVibe() {
  return (
    <section id="vibes" className="py-24 md:py-32 bg-background">
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
            Find your tribe by vibe
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Whatever moves you, we&apos;ll match you with people who get it
          </p>
        </motion.div>

        {/* Vibes grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {vibes.map((vibe) => (
            <motion.div
              key={vibe.name}
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="group cursor-pointer"
            >
              <div
                className={`relative rounded-2xl p-6 border-2 border-transparent ${vibe.hoverColor} transition-all duration-300 bg-gradient-to-br ${vibe.gradient}`}
              >
                {/* Emoji */}
                <motion.span
                  className="text-5xl block mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {vibe.emoji}
                </motion.span>

                {/* Content */}
                <h3
                  className="text-lg font-bold text-foreground mb-2"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {vibe.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {vibe.activities}
                </p>

                {/* CTA tag */}
                <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                  Find people
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* More vibes hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground mt-10"
        >
          And many more vibes to discover...
        </motion.p>
      </div>
    </section>
  );
}
