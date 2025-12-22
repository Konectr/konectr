"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  gradient?: "primary" | "secondary" | "dark";
}

export function PageHeader({
  title,
  subtitle,
  badge,
  gradient = "primary",
}: PageHeaderProps) {
  const gradients = {
    primary: "from-primary via-primary to-orange-600",
    secondary: "from-secondary via-amber-400 to-orange-400",
    dark: "from-foreground via-gray-800 to-gray-900",
  };

  return (
    <section
      className={`relative py-32 md:py-40 bg-gradient-to-br ${gradients[gradient]} overflow-hidden`}
    >
      {/* Background animation */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
          >
            <span className="text-white font-medium text-sm">{badge}</span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white leading-tight mb-4"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
