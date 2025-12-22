"use client";

import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "sizes"> {
  /**
   * Responsive sizes for optimal loading.
   * Default handles common breakpoints for full-width images.
   */
  sizes?: string;
  /**
   * Preset size configurations for common use cases
   */
  sizePreset?: "hero" | "card" | "thumbnail" | "avatar" | "full";
}

// Preset sizes configurations for common image layouts
const sizePresets: Record<string, string> = {
  // Hero images - typically full viewport width
  hero: "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px",
  // Card images - typically 1/2 to 1/3 viewport on larger screens
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  // Thumbnail images - small sizes
  thumbnail: "(max-width: 640px) 50vw, 200px",
  // Avatar images - fixed small sizes
  avatar: "100px",
  // Full width container images
  full: "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px",
};

/**
 * Optimized Image component with automatic responsive sizing.
 *
 * Uses Next.js Image optimization with proper sizes attribute
 * to ensure optimal image loading at all breakpoints.
 *
 * @example
 * // Using preset
 * <OptimizedImage src="/hero.jpg" alt="Hero" fill sizePreset="hero" />
 *
 * @example
 * // Using custom sizes
 * <OptimizedImage src="/card.jpg" alt="Card" fill sizes="(max-width: 768px) 100vw, 50vw" />
 */
export function OptimizedImage({
  sizes,
  sizePreset = "card",
  className,
  ...props
}: OptimizedImageProps) {
  // Use provided sizes, or fall back to preset
  const responsiveSizes = sizes || sizePresets[sizePreset];

  return (
    <Image
      sizes={responsiveSizes}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}

/**
 * Background image component for sections with overlay support.
 */
interface BackgroundImageProps {
  src: string;
  alt: string;
  overlay?: "none" | "light" | "dark" | "gradient" | "primary";
  overlayClassName?: string;
  children?: React.ReactNode;
  className?: string;
  priority?: boolean;
}

const overlayStyles = {
  none: "",
  light: "bg-white/50",
  dark: "bg-black/50",
  gradient: "bg-gradient-to-br from-primary/85 via-primary/70 to-orange-600/80",
  primary: "bg-primary/80",
};

export function BackgroundImage({
  src,
  alt,
  overlay = "none",
  overlayClassName,
  children,
  className,
  priority = false,
}: BackgroundImageProps) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        priority={priority}
      />
      {overlay !== "none" && (
        <div className={cn("absolute inset-0", overlayStyles[overlay], overlayClassName)} />
      )}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
