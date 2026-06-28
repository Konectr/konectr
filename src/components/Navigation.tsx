// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { brand } from "@/config/brand";

export function Navigation() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const { scrollY } = useScroll();

  // Check if on homepage (pathname is "/" after locale is stripped by next-intl)
  const isHomepage = pathname === "/";

  // Theme-aware nav surface: white in light mode, graphite (matches --card oklch(0.18 0 0))
  // in dark mode. Hardcoding white turned the floating pill bright white on scroll in dark mode.
  const navRgb = resolvedTheme === "dark" ? "24, 24, 24" : "255, 255, 255";

  // Transform values based on scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    [`rgba(${navRgb}, 0)`, `rgba(${navRgb}, 0.95)`]
  );
  const backdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(20px)"]);
  const padding = useTransform(scrollY, [0, 100], ["16px 32px", "12px 24px"]);
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0,0,0,0)", "0 8px 32px rgba(0,0,0,0.08)"]
  );

  // Nav renders in SSR markup (no mount gate) so it's present on first paint / for
  // crawlers. Pre-scroll background is transparent regardless of theme, so there's no
  // visible hydration delta; suppressHydrationWarning guards the scrolled-refresh edge.
  return (
    <motion.nav
      suppressHydrationWarning
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-border/50 dark:border-border"
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
        padding,
        boxShadow,
      }}
    >
      <div className="flex items-center gap-6">
        {/* Logo - Only show when not on homepage */}
        {!isHomepage && (
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src={brand.assets.logoOrange}
              alt="Konectr"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        )}

        {/* Nav Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/how-it-works">{t("howItWorks")}</NavLink>
          <NavLink href="/about">{t("about")}</NavLink>
          <NavLink href="/safety">{t("safety")}</NavLink>
          <NavLink href="/blog">{t("blog")}</NavLink>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            size="sm"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hidden sm:inline-flex"
            asChild
          >
            <Link href="/#waitlist">
              {t("joinWaitlist")}
            </Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-[width] group-hover:w-full" />
    </Link>
  );
}
