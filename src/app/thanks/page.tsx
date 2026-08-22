// © Konectr 2026. All rights reserved.
// Thank-you page — the Tally waitlist form redirects here on completion,
// which turns a cross-origin iframe submit into a first-party, pixel-trackable
// conversion URL. Outside [locale] on purpose: Tally accepts exactly one
// redirect URL. Excluded from locale routing in src/middleware.ts.

import type { Metadata } from 'next';
import ThanksContent from './ThanksContent';

export const metadata: Metadata = {
  title: 'You’re on the list — Konectr',
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return <ThanksContent />;
}
