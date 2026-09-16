// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// English only (founder call 2026-09-16): every other locale shipped byte-identical
// English copy, so the sitemap advertised 8 duplicates of every page. Add a locale
// back here only together with real translations in src/messages/<locale>/.
export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  'en': 'English',
};

// For SEO and metadata
export const localeMetadata: Record<Locale, { name: string; region: string }> = {
  'en': { name: 'English', region: 'US' },
};
