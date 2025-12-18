"use client";

import { motion } from "framer-motion";

export function JoinMovement() {
  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-gradient-to-b from-foreground to-gray-900 dark:from-gray-900 dark:to-black text-white relative overflow-hidden"
    >
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/20 blur-3xl"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-5xl font-black mb-4"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            Why we&apos;re building Konectr
          </h2>
        </motion.div>

        {/* Quote card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12"
        >
          {/* Quote icon */}
          <span className="text-5xl text-primary/80 block mb-6">&ldquo;</span>

          {/* Quote text */}
          <p className="text-xl md:text-2xl leading-relaxed text-white/90 mb-8">
            We&apos;re tired of likes that don&apos;t lead to real laughs, of followers
            who&apos;ll never follow you on a real adventure.
            <span className="text-primary font-semibold">
              {" "}Konectr isn&apos;t another app to scroll through
            </span>{" "}
            — it&apos;s your ticket out of the digital loop and into real life.
          </p>

          {/* Author */}
          <p className="text-secondary font-semibold">— The Konectr Team</p>
        </motion.div>

        {/* Stats / Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mt-12"
        >
          {[
            { number: "🌟", label: "Early Adopters" },
            { number: "🏢", label: "Partner Venues" },
            { number: "⏱️", label: "Real Moments" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center p-4 rounded-2xl bg-white/5"
            >
              <span className="text-3xl mb-2 block">{stat.number}</span>
              <span className="text-white/60 text-sm">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Community avatars placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex justify-center items-center gap-2 mt-12"
        >
          <div className="flex -space-x-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-foreground flex items-center justify-center text-sm"
              >
                {["😊", "🙌", "💪", "✨", "🎯"][i]}
              </div>
            ))}
          </div>
          <span className="text-white/60 text-sm ml-3">
            Join the founding community
          </span>
        </motion.div>
      </div>
    </section>
  );
}
