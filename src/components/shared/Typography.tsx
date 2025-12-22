"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/animations";

// Satoshi font style (used consistently across headings)
const satoshiStyle = { fontFamily: "'Satoshi', sans-serif" };

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
        "font-black leading-tight",
        gradient
          ? "bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
          : "text-foreground",
        className
      )}
      style={satoshiStyle}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
}

interface TextProps extends HTMLMotionProps<"p"> {
  size?: "sm" | "md" | "lg" | "xl";
  muted?: boolean;
  animated?: boolean;
}

const textSizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl md:text-2xl",
};

/**
 * Text component with consistent styling options.
 */
export function Text({
  size = "md",
  muted = false,
  animated = false,
  className,
  children,
  ...props
}: TextProps) {
  const animationProps = animated
    ? {
        initial: "hidden",
        whileInView: "visible",
        viewport: viewportOnce,
        variants: fadeInUp,
      }
    : {};

  return (
    <motion.p
      className={cn(
        textSizes[size],
        muted ? "text-muted-foreground" : "text-foreground",
        "leading-relaxed",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </motion.p>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const badgeVariants = {
  default: "bg-primary/10 text-primary",
  outline: "border border-primary/30 text-primary",
  glass: "bg-white/15 backdrop-blur-sm text-white",
};

const badgeSizes = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

/**
 * Badge component for labels and status indicators.
 */
export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  animated = false,
}: BadgeProps) {
  const baseClass = cn(
    "inline-flex items-center gap-2 rounded-full font-semibold",
    badgeVariants[variant],
    badgeSizes[size],
    className
  );

  if (animated) {
    return (
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={baseClass}
      >
        {children}
      </motion.span>
    );
  }

  return <span className={baseClass}>{children}</span>;
}
