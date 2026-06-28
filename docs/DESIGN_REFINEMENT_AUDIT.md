# Konectr Web — Design Refinement Audit

> **Progress:** Batches A + B + C **SHIPPED 2026-06-28** on branch `claude/web-visual-polish`
> — browser-verified (Playwright, light/dark/scroll), tsc + eslint clean, 0 console errors.
> Homepage refinement backlog is now essentially complete. Remaining work = inner pages
> (see "Not Yet Audited"). See "Recommended Rollout" below for per-batch detail.

> **Mode:** Refinement, not redesign. Dials recalibrated for an existing brand:
> `DESIGN_VARIANCE 3` · `MOTION_INTENSITY 6` · `VISUAL_DENSITY 4`.
> **Brand decisions locked:** emojis stay (intentional warm voice for a social app),
> Inter stays for body. We only refine *decorative* glyphs (text arrows, quote marks),
> never the playful activity/vibe emojis.
>
> **Scope of this pass:** homepage sections + global chrome (nav, button, tokens, motion lib).
> Inner pages (about, blog, faq, safety, contact, gamification, footer, theme/lang switchers,
> `/a/[code]`, `/r/[code]`) are **not yet audited** — listed at the end as a follow-up.

Severity: **P0** = correctness bug (ship the fix) · **P1** = visible polish win · **P2** = optional refinement.

---

## What's already good (don't touch)

- **Real design system** — OKLCH tokens, full radius scale, dark mode wired through `next-themes`.
- **Real motion layer** — `src/lib/animations.ts` is exactly the reusable-variant library the design philosophy asks you to build; `MotionProvider` respects `prefers-reduced-motion`.
- **TheShift** scroll-driven before/after (grayscale→color, opacity/scale crossfade) is genuinely premium. Leave the choreography alone.
- **FindYourVibe** and **JoinMovement** are strong: real photography, editorial image cards, tasteful hover rings, real avatars (no "egg" placeholders).
- Brand palette is disciplined — single warm accent (Sunset Orange) + one support (Solar Amber) on neutral base. This already satisfies the "max 1 accent" rule.

This site is past the "generic AI slop" stage. The work below is polish, not rescue.

---

## GLOBAL / CROSS-CUTTING (fix once, benefits everywhere)

### G1 · `min-h-screen` on the Hero — **P0**
`Hero.tsx`: `<section className="relative min-h-screen ...">`. On iOS Safari the URL bar collapse changes `100vh` mid-scroll → catastrophic layout jump. Fix: `min-h-[100dvh]`. One-character class swap, real bug.

### G2 · Inline `fontFamily` style repeated instead of the existing token — **P0 (DRY + correctness)**
`Hero.tsx` (h1), `FindYourVibe.tsx` (h3), `HowItWorks.tsx` (h3) all hardcode
`style={{ fontFamily: "'Satoshi', sans-serif" }}`. You already define `--font-heading: 'Satoshi', var(--font-inter), system-ui, sans-serif` in `globals.css`. The inline version **drops the Inter + system-ui fallback**, so if Satoshi fails to load these headings fall to the browser default instead of Inter. Replace every inline style with the `font-heading` utility class. Centralizes the heading font and restores the fallback chain.

### G3 · Untinted shadows everywhere — **P1**
`shadow-lg` / `shadow-xl` / `shadow-2xl` appear on Hero CTAs, HowItWorks cards, FindYourVibe CTA, CTAFooter card. These are neutral-gray glows. The premium move is to **tint the shadow to the brand hue** so depth feels like *Konectr* depth, not a default Tailwind drop shadow. Add one reusable token, e.g. in `globals.css`:
```css
/* brand-tinted elevation */
--shadow-brand: 0 20px 40px -15px oklch(0.72 0.18 35 / 0.25);
```
…and apply `shadow-[var(--shadow-brand)]` to primary CTAs and elevated cards. Keep neutral shadows only where elevation is purely structural.

### G4 · Button primitive has no tactile `:active` state and omits `transform` from its transition — **P1**
`components/ui/button.tsx` cva base: `transition-[color,background-color,border-color,box-shadow,opacity]` — **no `transform`**. So any `hover:-translate-y-1` added at call sites (Hero does this) is not transitioned by the base and relies on the call-site overriding the whole transition list (Hero does; other call sites won't). Add `transform` to the base transition and a global tactile press: `active:scale-[0.98]`. Every button on the site then gets consistent, physical feedback for free.

### G5 · Decorative text-glyph arrows instead of icons — **P1**
`Hero.tsx` uses `<span className="ml-2">→</span>` inside both CTAs; `TheShift.tsx` uses a `→` text span between "from this / to this". These are **decorative** (not brand emoji), and `lucide-react` is already a dependency. Swap to `<ArrowRight className="ml-2 size-4" />` for crisp, weight-consistent, font-independent rendering. (The button cva already styles `[&_svg]:size-4`, so icons drop in cleanly.)

### G6 · Nav unmounts entirely during SSR — **P1**
`Navigation.tsx`: `if (!mounted) return null;`. The whole header is absent on first paint, then pops in after hydration → layout shift + a flash of no-nav + weaker SEO. Better: render the nav statically and gate only the *scroll-driven* `useTransform` styles behind `mounted` (or seed them with sensible initial values). The nav should exist in the SSR markup.

### G7 · Scrolled-nav background is hardcoded white — **P0 (dark-mode bug)**
`Navigation.tsx`: `backgroundColor` interpolates `rgba(255,255,255,0)` → `rgba(255,255,255,0.95)`. In **dark mode**, scrolling turns the floating nav pill bright white. Drive the background from a theme-aware token (or branch on resolved theme) so the scrolled state is `card`/graphite in dark mode.

### G8 · Heading scale leans on size, not weight+color — **P2**
Hero h1 is `text-4xl sm:text-5xl md:text-7xl font-black`. It reads well over the photo, but the philosophy favors controlling hierarchy with weight/tracking rather than pure scale. Optional: add `tracking-tight` to large headings site-wide for a tighter, more intentional display feel. Token it via a `.display` utility so it's consistent.

---

## SECTION-BY-SECTION

### 1 · Hero (`components/sections/Hero.tsx`) — **strong, a few P0s**
| Sev | Finding | Fix |
|-----|---------|-----|
| P0 | `min-h-screen` (G1) | `min-h-[100dvh]` |
| P0 | Inline Satoshi style on h1 (G2) | `font-heading` class |
| P1 | Untinted `shadow-xl`/`shadow-2xl` on primary CTA (G3) | brand-tinted shadow token |
| P1 | Text-arrow `→` in CTAs (G5) | `ArrowRight` icon |
| P1 | No `active:` press feedback on CTAs (G4) | `active:scale-[0.98]` (via button base) |
| P2 | Two near-identical `<Button>` branches for TestFlight vs waitlist | Compute `{ href, label }` once, render one button. Removes ~25 duplicated lines. |
| — | Emoji badge (sparkle/test-tube) + activity pills | **Keep** per brand decision. Optionally promote the *badge* glyph to a Phosphor/lucide icon later; activity pills stay emoji. |
| — | Animated blurred blobs, scroll indicator | Keep — appropriate at motion 6, GPU-cheap (transform/opacity). |

### 2 · TheShift (`components/sections/TheShift.tsx`) — **best section, minimal**
| Sev | Finding | Fix |
|-----|---------|-----|
| P1 | Text-arrow `→` between "from this / to this" (G5) | `ArrowRight` icon (can still animate `x`) |
| P2 | Scroll animates `filter: grayscale()/saturate()` | `filter` is not as cheap as transform/opacity, but here it's the *point* of the effect and only two elements — acceptable. Leave it; just don't add more filter animation elsewhere. |
| — | 😔 / 🥳 indicator emojis | **Keep** — expressive, on-brand. |

### 3 · HowItWorks (`components/sections/HowItWorks.tsx`) — **good, keep structure**
| Sev | Finding | Fix |
|-----|---------|-----|
| P0 | Inline Satoshi style on h3 (G2) | `font-heading` class |
| P1 | Card `shadow-lg`/`shadow-xl` untinted (G3) | brand-tinted shadow token |
| P2 | Generic 3-equal-column card row (philosophy discourages this) | **Keep at variance 3** — the numbered connectors make it a legitimate process flow, not a generic feature trio. Do *not* restructure. |
| — | Step emojis ✨⚡🎯, SVG dot-pattern bg | Keep. The pattern is a static `absolute inset-0` background (not a repainting scroll layer), so it's fine. |

### 4 · FindYourVibe (`components/sections/FindYourVibe.tsx`) — **strong**
| Sev | Finding | Fix |
|-----|---------|-----|
| P0 | Inline Satoshi style on h3 (G2) | `font-heading` class |
| P1 | "Download app" CTA is a raw styled `<a>`, not the `Button` component | Use `<Button asChild>` for consistency with every other CTA (hover/active/focus states, tinted shadow) |
| P1 | CTA `shadow-xl` untinted (G3) | brand-tinted shadow token |
| — | Image cards, hover ring colors, emoji rotate-on-hover | Keep — this is the most polished grid on the page. |

### 5 · JoinMovement (`components/sections/JoinMovement.tsx`) — **strong**
| Sev | Finding | Fix |
|-----|---------|-----|
| P2 | Avatars use `unoptimized` + `quality={100}` | Fine for 5 tiny 48px images; only revisit if the set grows. Consider `quality={90}` + optimized to cut bytes. |
| P2 | Glass quote card (`bg-white/5 border-white/10`) | Add the refraction detail from the philosophy: a 1px inner highlight `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]` for a truer frosted-glass edge. Small, high-end touch. |
| — | Stats emojis 🌟🏢⏱️, real avatars, floating blobs | Keep. |

### 6 · CTAFooter (`components/sections/CTAFooter.tsx`) — **one likely bug**
| Sev | Finding | Fix |
|-----|---------|-----|
| P0 | `bg-gradient-radial from-white/10 to-transparent` — **not a built-in Tailwind v4 utility**. This class likely resolves to nothing, so the rotating "radial glow" is invisible (you're paying for an infinite 60s rotation animation that renders empty). | Verify in-browser. If empty, use Tailwind v4 radial syntax `bg-[radial-gradient(...)]` or `bg-radial`, or drop the rotating layer entirely. |
| P1 | Card `shadow-2xl` untinted (G3) | brand-tinted shadow token |
| — | Tally iframe (3rd-party, 500px) | Can't restyle internals; the wrapping card treatment is good. |

---

## RECOMMENDED ROLLOUT (lowest risk → highest)

**Batch A — correctness, zero visual risk — ✅ SHIPPED 2026-06-28:**
G1 (dvh), G2 (font token, all 3 sections), G7 (dark-mode nav), CTAFooter P0 (radial → real `bg-[radial-gradient(...)]`). Browser-verified: dark-mode nav pill now graphite not white; headings render in Satoshi; radial glow renders.

**Batch B — materiality + tactility — ✅ SHIPPED 2026-06-28:**
G3 (tinted-shadow tokens `--shadow-brand` / `--shadow-brand-lg`), G4 (button `transform` in transition + global `active:scale-[0.98]`), G5 (`→` glyphs → `lucide` `ArrowRight`). Browser-verified: orange-tinted shadow renders on FindYourVibe CTA + CTAFooter card; 0 legacy arrow glyphs remain.
- **Judgment calls:** Hero CTA shadow left **neutral** (white button on orange hero — an orange shadow would vanish; the brand shadow only went on orange CTAs over light backgrounds). CTAFooter orange card had **no** shadow before — it now lifts off the background. HowItWorks step cards kept **neutral** (structural elevation).

**Batch C — consistency + refinement — ✅ SHIPPED 2026-06-28:**
FindYourVibe raw-`<a>` → `Button`; Hero dual-button dedupe (one computed `primaryCta`, −~20 lines); G6 (nav now renders in SSR markup, `suppressHydrationWarning`, no mount gate — verified present in server HTML + 0 hydration errors); JoinMovement glass refraction (inner `inset 0 1px 0` highlight); G8 (`tracking-tight` on display headings).
- **Bonus:** C8/G8 lives in the shared `Heading` + `SectionHeader`, which were the **last two** places carrying the inline-Satoshi pattern — so this also **completed G2 site-wide** (token + restored fallback chain on every page that uses them, not just the homepage). Removed a pre-existing dead `defaultTransition` import in JoinMovement.

**Then:** review the homepage live, lock taste, and only after that extend the same pass to inner pages (the "Not Yet Audited" list).

---

## NOT YET AUDITED (follow-up pass)
`Footer.tsx`, `ThemeToggle.tsx`, `LanguageSwitcher.tsx`, `shared/*` (PageHeader, SectionWrapper, Typography, OptimizedImage, ImagePlaceholder), `ui/accordion.tsx`, `ui/card.tsx`, `blog/BlogCard.tsx`, and the inner routes: about, blog, faq, safety, contact, gamification, feedback, `/a/[code]`, `/r/[code]`, `/venue-interview`, 404 (Flappy game).
