// © Konectr 2026. All rights reserved.
// Standalone cookie policy — required the moment any ad pixel deploys
// (docs/PRE_LAUNCH_MARKETING_COMPLIANCE.md line 38). Outside [locale] so the
// consent banner (which renders on no-locale routes too) can link one stable
// URL. Excluded from locale routing in src/middleware.ts.

import type { Metadata } from 'next';
import CookiesContent from './CookiesContent';

export const metadata: Metadata = {
  title: 'Cookie Policy — Konectr',
  description: 'What konectr.app stores in your browser, why, and how to change your choice.',
};

export default function CookiesPage() {
  return <CookiesContent />;
}
