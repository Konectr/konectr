"use client";

import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  background?: "default" | "muted" | "dark" | "gradient" | "none";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
  padding?: "sm" | "md" | "lg" | "xl" | "none";
}

const backgroundStyles = {
  default: "bg-background",
  muted: "bg-muted/50",
  dark: "bg-foreground dark:bg-background text-white",
  gradient: "bg-gradient-to-b from-foreground to-gray-900 dark:from-foreground dark:to-background text-white",
  none: "",
};

const maxWidthStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
  full: "max-w-full",
};

const paddingStyles = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
  xl: "py-24 md:py-32",
  none: "",
};

export function SectionWrapper({
  children,
  id,
  className,
  containerClassName,
  background = "default",
  maxWidth = "6xl",
  padding = "xl",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(backgroundStyles[background], paddingStyles[padding], className)}
    >
      <div className={cn(maxWidthStyles[maxWidth], "mx-auto px-6", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeInUp}
      className={cn(centered && "text-center", "mb-16", className)}
    >
      {badge && (
        <span className="text-primary font-semibold text-sm uppercase tracking-wider block mb-2">
          {badge}
        </span>
      )}
      <h2
        className="text-3xl md:text-5xl font-black text-foreground mb-4"
        style={{ fontFamily: "'Satoshi', sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-muted-foreground text-lg", centered && "max-w-xl mx-auto")}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
