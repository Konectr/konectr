// © Konectr 2026. All rights reserved.
// Client half of /cookies — needs 'use client' only for the "change your
// choice" button, which clears the stored consent and reloads so the banner
// reappears.

'use client';

import Link from 'next/link';

const SECTIONS = [
  {
    title: 'Strictly necessary',
    body: 'Small first-party values in your browser storage that make the site work: your language preference, a submitted-form marker so we don’t re-ask you, and your cookie choice itself. No consent needed — nothing here identifies or tracks you.',
  },
  {
    title: 'Analytics',
    body: 'PostHog (product analytics) runs in cookieless mode — it sets no cookies and stores nothing on your device. Contentsquare (session analytics) helps us see how visitors use the site — where pages confuse people, what gets tapped — and may use cookies or browser storage for that.',
  },
  {
    title: 'Advertising — only with your OK',
    body: 'If you tap “OK” on the cookie banner, we load the Meta Pixel and the Google tag. They exist for exactly one purpose: telling us whether an ad we paid for actually brought you here, so a tiny startup doesn’t waste its ad budget. If you decline (or just ignore the banner), neither loads — no advertising cookies, no cross-site tracking.',
  },
  {
    title: 'What we never do',
    body: 'We never sell your personal data, build advertising profiles of you, or track you across other apps. The Konectr mobile app itself contains no advertising SDKs at all.',
  },
];

export default function CookiesContent() {
  const resetChoice = () => {
    try {
      localStorage.removeItem('konectr_consent');
    } catch {
      // storage unavailable — nothing to clear
    }
    window.location.reload();
  };

  return (
    <main className="min-h-[100dvh] bg-background px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground mb-10">
          What konectr.app stores in your browser, why, and how to change your
          mind. Last updated 21 August 2026.
        </p>
        {SECTIONS.map((s) => (
          <section key={s.title} className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">{s.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{s.body}</p>
          </section>
        ))}
        <div className="border border-border rounded-2xl p-6 mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Change your choice
          </h2>
          <p className="text-muted-foreground mb-4">
            Clears your saved cookie choice — the banner will ask again on the
            next page. Cookies that Meta or Google already set are not deleted
            by this (no new ones will be set after you decline); remove
            existing ones via your browser&apos;s site-data settings.
          </p>
          <button
            onClick={resetChoice}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90"
          >
            Reset cookie choice
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-10">
          Questions? <a href="mailto:privacy@konectr.app" className="underline">privacy@konectr.app</a>
          {' '}· Full details in our <Link href="/en/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}
