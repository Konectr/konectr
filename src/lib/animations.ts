/**
 * Shared animation utilities for consistent, performant animations across the site.
 * Using these shared variants reduces bundle size and ensures consistency.
 */

import { Variants, Transition } from "framer-motion";

// Performance-optimized transition defaults
export const defaultTransition: Transition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
};

export const fastTransition: Transition = {
  duration: 0.3,
  ease: "easeOut",
};

export const slowTransition: Transition = {
  duration: 0.8,
  ease: "easeOut",
};

// Reusable animation variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const fadeInUpLarge: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: slowTransition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Container variants for staggered children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

// Child variants for staggered animations
export const staggerChild: Variants = {
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

// Hover animations (reusable transforms)
export const hoverLift = {
  y: -8,
  transition: { duration: 0.3 },
};

export const hoverScale = {
  scale: 1.03,
  transition: { duration: 0.2 },
};

export const hoverScaleSmall = {
  scale: 1.05,
  y: -4,
};

// Viewport configuration for whileInView
export const viewportOnce = { once: true };
export const viewportWithMargin = { once: true, margin: "-100px" };
export const viewportSmallMargin = { once: true, margin: "-50px" };

// Common animation props for motion components
export const animateOnView = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: viewportOnce,
};

export const animateOnViewWithMargin = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: viewportWithMargin,
};

// Delay utilities
export const withDelay = (delay: number): Transition => ({
  ...defaultTransition,
  delay,
});

// Generate sequential delays for list items
export const getStaggerDelay = (index: number, baseDelay = 0, step = 0.1) => ({
  delay: baseDelay + index * step,
});
