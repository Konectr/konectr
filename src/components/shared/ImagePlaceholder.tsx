"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ImagePlaceholderProps {
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  label?: string;
  icon?: string;
  gradient?: "orange" | "amber" | "gray" | "blue" | "green";
  className?: string;
  src?: string;
  alt?: string;
}

export function ImagePlaceholder({
  aspectRatio = "video",
  label,
  icon = "📷",
  gradient = "orange",
  className = "",
  src,
  alt,
}: ImagePlaceholderProps) {
  const aspects = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
  };

  const gradients = {
    orange: "from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30",
    amber: "from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30",
    gray: "from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800",
    blue: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
    green: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
  };

  // If src is provided, render a real image
  if (src) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative ${aspects[aspectRatio]} rounded-2xl overflow-hidden ${className}`}
      >
        <Image
          src={src}
          alt={alt || label || "Image"}
          fill
          className="object-cover"
        />
      </motion.div>
    );
  }

  // Otherwise render a gradient placeholder
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative ${aspects[aspectRatio]} rounded-2xl overflow-hidden bg-gradient-to-br ${gradients[gradient]} ${className}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span className="text-4xl opacity-50">{icon}</span>
        {label && (
          <span className="text-sm text-muted-foreground/60 font-medium">
            {label}
          </span>
        )}
      </div>
    </motion.div>
  );
}
