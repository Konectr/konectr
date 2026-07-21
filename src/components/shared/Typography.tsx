// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";

interface HeadingProps extends HTMLMotionProps<"h1"> {
  level?: 1 | 2 | 3 | 4;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  animated?: boolean;
  gradient?: boolean;
}

const headingSizes = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
  xl: "text-3xl md:text-5xl",
  "2xl": "text-4xl sm:text-5xl md:text-7xl",
};

/**
 * Heading component with consistent Satoshi font styling.
 * Supports animation and gradient variants.
 */
export function Heading({
  level = 2,
  size = "xl",
  animated = true,
  gradient = false,
  className,
  children,
  ...props
}: HeadingProps) {
  const Component = motion[`h${level}` as keyof typeof motion] as typeof motion.h2;

  const animationProps = animated
    ? {
        initial: "hidden",
        whileInView: "visible",
        viewport: viewportOnce,
        variants: fadeInUp,
      }
    : {};

  return (
    <Component
      className={cn(
        headingSizes[size],
        "font-heading font-black leading-tight tracking-tight",
        gradient
          ? "bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
          : "text-foreground",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
}

