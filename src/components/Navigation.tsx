"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { brand } from "@/config/brand";

export function Navigation() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Transform values based on scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
  );
  const backdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(20px)"]);
  const padding = useTransform(scrollY, [0, 100], ["16px 32px", "12px 24px"]);
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0,0,0,0)", "0 8px 32px rgba(0,0,0,0.08)"]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.nav
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
        {/* Logo */}
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

        {/* Nav Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="#how">How it Works</NavLink>
          <NavLink href="#vibes">Find Your Vibe</NavLink>
          <NavLink href="#about">About</NavLink>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            size="sm"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hidden sm:inline-flex"
          >
            Get the App
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
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    </Link>
  );
}
