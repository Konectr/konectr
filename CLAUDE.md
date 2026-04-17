# CLAUDE.md - Konectr Website

**Last Updated**: 2026-03-01 | **Status**: Production Live | **FAQ**: v3 (58 questions)

---

## Project Overview

Konectr's official marketing website and landing page. Built with Next.js 16 and deployed on Vercel.

**Live URL**: https://konectr.app

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | React framework with App Router |
| React | 19.2.1 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| next-intl | 4.6.1 | Internationalization (8 locales) |
| Framer Motion | 12.x | Animations |

---

## Project Structure

```
konectr-web/
├── src/
│   ├── app/
│   │   ├── [locale]/        # Locale-specific pages
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── about/       # About page
│   │   │   ├── blog/        # Blog pages
│   │   │   ├── contact/     # Contact page
│   │   │   ├── faq/         # FAQ page (58 questions)
│   │   │   ├── feedback/    # Feedback board
│   │   │   ├── gamification/ # Gamification showcase
│   │   │   ├── how-it-works/# How it works
│   │   │   └── safety/      # Safety page
│   │   ├── a/[code]/        # Activity share links (no locale)
│   │   ├── api/venue-interview/ # Venue interview → Notion API
│   │   ├── venue-interview/ # Venue discovery interview form
│   │   ├── not-found.tsx    # 404 page (Flappy Konectr game)
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── sitemap.ts       # Dynamic sitemap
│   ├── components/
│   │   ├── games/           # Interactive game components
│   │   │   ├── flappy-constants.ts  # Physics, colors, types
│   │   │   ├── useFlappyGame.ts     # Game engine hook
│   │   │   └── FlappyKonectr.tsx    # Canvas game component
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Navigation.tsx   # Global navigation
│   │   └── Footer.tsx       # Global footer
│   ├── i18n/                # Internationalization config
│   └── lib/
│       ├── utils.ts         # Utility functions
│       └── supabase.ts      # Supabase client + helpers
├── public/
│   ├── logos/               # Brand logos (SVG)
│   └── .well-known/         # Universal Links config
├── messages/                # Translation files (JSON)
├── vercel.json              # Vercel config + redirects
└── next.config.ts           # Next.js config
```

---

## Deployment

### Production Domains

| Domain | Purpose | Platform |
|--------|---------|----------|
| **konectr.app** | Primary website | Vercel |
| **www.konectr.app** | WWW variant | Vercel (redirects to apex) |
| **konectrapp.com** | Legacy/alternate | Vercel (301 → konectr.app) |
| **www.konectrapp.com** | Legacy WWW | Vercel (301 → konectr.app) |

### Vercel Configuration

- **Project**: `konectr-web`
- **Team**: `konectr`
- **Region**: Auto (Edge)
- **Build**: `next build`
- **Install**: `npm install`

### DNS Records (Namecheap)

Both domains use identical DNS configuration:

```
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

### Domain Redirects (vercel.json)

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{"type": "host", "value": "konectrapp.com"}],
      "destination": "https://konectr.app/:path*",
      "permanent": true
    },
    {
      "source": "/:path*",
      "has": [{"type": "host", "value": "www.konectrapp.com"}],
      "destination": "https://konectr.app/:path*",
      "permanent": true
    }
  ]
}
```

---

## Internationalization

### Supported Locales

| Code | Language | Status |
|------|----------|--------|
| en | English | Default |
| ms | Malay (Bahasa Malaysia) | Active |
| zh-HK | Chinese Traditional (Hong Kong) | Active |
| zh-CN | Chinese Simplified | Active |
| ja | Japanese | Active |
| ko | Korean | Active |
| th | Thai | Active |
| vi | Vietnamese | Active |

### Adding Translations

1. Add translation file: `messages/{locale}.json`
2. Update `src/i18n/request.ts` if needed
3. Translations auto-generate static pages at build time

---

## Brand Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Sunset Orange | `#FF774D` | `--primary` | Primary CTA, accents |
| Solar Amber | `#FFC845` | `--secondary` | Secondary highlights |
| Graphite Grey | `#1F1F1F` | `--foreground` | Text, dark sections |
| Cloud White | `#FAFAFA` | `--background` | Backgrounds |

---

## Favicon

Branded favicon set using the Konectr "K" symbol in Sunset Orange (#FF774D).

### Files (`public/`)

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 32x32 | Legacy browsers |
| `favicon-16x16.png` | 16x16 | Small browser tabs |
| `favicon-32x32.png` | 32x32 | Standard browser tabs |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
| `android-chrome-192x192.png` | 192x192 | Android home screen |
| `android-chrome-512x512.png` | 512x512 | Android splash/PWA |

### Source

Generated from `/public/logos/konectr-icon-orange.svg`

### Head Tags (`src/app/layout.tsx`)

```tsx
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

---

## Development

```bash
# Install dependencies
npm install

# Run dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Deployment Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview (generates unique URL)
vercel

# List all domains
vercel domains ls

# Inspect domain status
vercel domains inspect konectr.app

# Check SSL certificates
vercel certs ls
```

---

## FAQ Page (v3)

**Live URL**: https://konectr.app/faq

### Content Summary

| Category | Icon | Questions |
|----------|------|-----------|
| About Konectr | 📱 | 7 |
| Getting Started | 🚀 | 5 |
| How Konectr Works | 💡 | 10 |
| Safety & Trust | 🛡️ | 8 |
| Activities & Meetups | 🎯 | 9 |
| Badges & Gamification | 🏆 | 5 |
| Account & Settings | ⚙️ | 6 |
| Premium & Future Features | ✨ | 3 |
| Troubleshooting & Support | 🔧 | 5 |
| **Total** | | **58** |

### Key Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/faq/page.tsx` | FAQ page component |
| `src/app/[locale]/faq/FAQContent.tsx` | FAQ content with 58 questions |
| `src/app/[locale]/faq/faq-data.ts` | FAQ data (shared between client + server JSON-LD) |

### Emoji Reference (Synced with Mobile)

Emojis in FAQ content match `konectr_mobile/lib/constants/category_reference.dart`:

**Venue Categories:**
| Emoji | Category |
|-------|----------|
| ☕ | Cafe |
| 🍽️ | Restaurant |
| 🍻 | Bar |
| 💪 | Fitness |
| ⛰️ | Outdoors |
| 🎭 | Entertainment |

**Activity Categories:**
| Emoji | Category |
|-------|----------|
| ☕ | Chill |
| 💪 | Active |
| 🎯 | Focus |
| 🎨 | Creative |
| ⛰️ | Adventure |
| 🎉 | Social |
| 📌 | Default |

### Components Used

- `shadcn/ui Accordion` - Collapsible FAQ items
- `Framer Motion` - Fade-in animations
- `Next.js Link` - Internal navigation

---

## Related Projects

| Project | Path | Description |
|---------|------|-------------|
| konectr-mobile | `../konectr-mvp/konectr_mobile/` | Flutter mobile app |
| konectr-analytics | `../konectr-analytics/` | Admin dashboard |

---

## Quick Reference

### Key Files

- `src/app/[locale]/page.tsx` - Homepage
- `src/app/[locale]/faq/FAQContent.tsx` - FAQ page (58 questions, 9 categories)
- `src/app/[locale]/layout.tsx` - Locale layout (includes Navigation + Footer)
- `src/components/Navigation.tsx` - Global navigation header
- `src/components/Footer.tsx` - Global footer
- `src/app/globals.css` - Global styles + brand colors
- `vercel.json` - Domain redirects
- `next.config.ts` - Next.js + next-intl config
- `messages/*.json` - Translation files

### Common Tasks

| Task | Command/Location |
|------|------------------|
| Add new page | Create folder in `src/app/[locale]/` |
| Update FAQ content | Edit `src/app/[locale]/faq/FAQContent.tsx` |
| Update translations | Edit `messages/{locale}.json` |
| Change redirects | Edit `vercel.json` |
| Add component | Use `npx shadcn@latest add {component}` |

---

## How It Works Page

**Live URL**: https://konectr.app/how-it-works

### Steps with Local Images

| Step | Title | Image |
|------|-------|-------|
| 01 | Pick Your Vibe | `/images/homepage/step-1.jpg` |
| 02 | See Who's Free | `/images/homepage/step-2.jpg` |
| 03 | Meet at the Spot | `/images/homepage/step-3.jpg` |

### Key Details
- Small groups: 2-5 people for quality conversations
- All images stored locally in `public/images/homepage/`

---

## Safety Page

**Live URL**: https://konectr.app/safety

### Safety Features (6 cards)

| Icon | Title | Description | Badge |
|------|-------|-------------|-------|
| ✅ | Phone Verified | Every member verifies their phone number before joining. Real people only. | - |
| 📍 | Public Venues Only | All meetups happen at cafés, gyms, and public spaces—never private locations. | - |
| 🚨 | Quick Reporting | Flag concerning behavior in two taps. Reports trigger automatic review. | - |
| ⚖️ | Three-Strike System | 3 reports = warning. 6 = suspension. 9 = six-month ban. No exceptions. | - |
| 🔒 | Private Messaging | Chat in-app only. Your phone number is never shared. | - |
| 📸 | Photo Verification | AI-powered selfie matching to prevent catfishing. | COMING SOON |

### Coming Soon Badge Styling

```tsx
<span className="ml-2 inline-block bg-[#FFC845] text-[#1F1F1F] text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
  Coming Soon
</span>
```

### Key File

| File | Purpose |
|------|---------|
| `src/app/[locale]/safety/SafetyContent.tsx` | Safety page with 6 feature cards |

### Page Sections

1. **How We Keep You Safe** - 6 feature cards (grid layout)
2. **Community Guidelines** - Be Respectful, Be Honest, Be Safe
3. **Safety Tips** - Before, During, After meetup tips
4. **Need Help?** - Contact support CTA + safety@konectr.app

---

## Gamification Page

**Live URL**: https://konectr.app/gamification

### Purpose

Marketing showcase page for the mobile app's gamification system (tiers, badges, streaks, daily rewards, XP). Drives curiosity and app downloads. Follows SafetyContent pattern — thin server `page.tsx` wrapper + `"use client"` content component with Framer Motion scroll animations.

### Key Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/gamification/page.tsx` | Server wrapper with PageHeader + SEO metadata |
| `src/app/[locale]/gamification/GamificationContent.tsx` | 7-section content component (~350 lines) |
| `src/app/[locale]/gamification/gamification-data.ts` | Static data arrays (tiers, badges, streaks, rewards, XP) |
| `src/messages/en/gamification.json` | English i18n translation file |

### Page Sections (7)

| # | Section | Background | Key Visual |
|---|---------|-----------|------------|
| 1 | Tier Progression | default | 6 tier cards with colored left border, emoji, perks |
| 2 | Badge Collection | `bg-muted/50` | 3x3 category grid + 5-level rarity pills |
| 3 | Streak System | default | Vertical timeline + flame progression + shield callout |
| 4 | Daily Rewards | `bg-muted/50` | 6 reward nodes, special days highlighted |
| 5 | XP System | default | 2x3 source grid + streak multiplier callout |
| 6 | Summary Stats | dark (`bg-foreground`) | 4 key metrics with emojis |
| 7 | CTA | `bg-primary` gradient | "Get Early Access" + "How It Works" buttons |

### Navigation

- **Footer only** (Resources column) — not in top nav
- Link label: "Rewards & Progression" (key: `gamification`)
- Added to all 8 locale `common.json` files

### Data Source

Static data arrays in `gamification-data.ts` derived from mobile app constants:
- 6 tiers (Basic -> Legendary)
- 9 badge categories with example badges
- 5 badge rarity levels (Common -> Legendary)
- 6 streak milestones (1 week -> 3 months)
- 4 flame color phases
- 6 daily reward highlights from 30-day cycle
- 6 XP sources with ranges

---

## 404 Page — Flappy Konectr Mini-Game (2026-02-20)

**Live URL**: https://konectr.app/nonexistent (any invalid route)

### Purpose

Custom 404 page featuring a "Flappy Bird"-style mini-game. Player controls a Konectr stick-figure mascot flying through branded obstacle pillars while collecting activity emoji collectibles. Turns a dead-end into a memorable, on-brand experience.

### Architecture

**Placement**: `src/app/not-found.tsx` (root-level, outside `[locale]` layout)

| Design Decision | Rationale |
|----------------|-----------|
| Root-level not-found | Catches ALL 404s (invalid locales, invalid pages, everything) |
| No Navigation/Footer | Full-screen immersive game canvas |
| No ThemeProvider | Detects dark mode via `matchMedia` + `MutationObserver` on `<html>` class |
| No next-intl | English-only text (acceptable for whimsical game page) |
| Locale-aware "Go Home" | Detects `navigator.language` → maps to supported locale |

### Key Files

| File | Purpose |
|------|---------|
| `src/app/not-found.tsx` | Server component wrapper (metadata + renders FlappyKonectr) |
| `src/components/games/flappy-constants.ts` | Physics values, colors (light/dark), types, brand config |
| `src/components/games/useFlappyGame.ts` | Game engine hook: requestAnimationFrame loop, delta-time physics, collision detection, rendering pipeline, state machine |
| `src/components/games/FlappyKonectr.tsx` | Client component: full-viewport canvas, input handling, idle/playing/gameover overlays |

### Game Mechanics

| Feature | Details |
|---------|---------|
| Player | Konectr stick-figure mascot (sunset orange, ring head, K-shaped flying pose) |
| Controls | Tap / Click / Spacebar / Enter |
| Gravity | 0.45 px/frame², flap force -7.5, terminal velocity 10 |
| Obstacles | Top/bottom pillar pairs (Sunset Orange top, Solar Amber bottom) with rounded caps |
| Scoring | +1 per pillar pair passed, +3 for collecting floating activity emojis |
| Difficulty | Speed increases + gap narrows over time, caps at score 50 |
| Collectibles | Activity emojis from category_reference.dart, 40% of pillar pairs |
| High score | `localStorage` key: `"flappy-konectr-high-score"` |

### Visual Layers (per frame, back to front)

1. Sky gradient (warm peach light / deep navy dark)
2. Clouds (parallax, 30% scroll speed)
3. City skyline silhouette (parallax, 60% scroll speed)
4. Greenery (grass strip, procedural bushes + trees, scrolls with ground)
5. Pillars with rounded caps
6. Emoji collectibles (bobbing)
7. Ground strip with movement dashes
8. Player (stick figure with velocity-based tilt rotation)
9. Score (top-center, Satoshi font)
10. Hit flash

### Game States

| State | Display |
|-------|---------|
| Idle | "404 Page Not Found" + bobbing mascot + "Tap to Fly" button + high score + "Go back home" link |
| Playing | Full-screen canvas game + score overlay |
| Game Over | Blurred overlay card with score, high score, "New High Score!" indicator, "Play Again" + "Go Home" buttons |

### Technical Details

- **Rendering**: HTML5 Canvas with `requestAnimationFrame`, delta-time normalized for 60Hz/120Hz
- **Full-viewport**: Dynamic design width computed from canvas aspect ratio (height=700 reference, width stretches)
- **Responsive**: `ResizeObserver` + `devicePixelRatio` capped at 2x
- **Dark mode**: `matchMedia` + `MutationObserver` on `<html>` class (no ThemeProvider)
- **Keyboard**: Window-level `keydown` listener (Safari-compatible, not relying on canvas focus)
- **Accessibility**: `aria-label` on canvas, `aria-live` score, `prefers-reduced-motion` support
- **Performance**: Off-screen culling, array filtering, capped DPR, no memory leaks

### Stick-Figure Mascot

The player character is a branded stick figure drawn with canvas paths (no external assets):
- Ring/donut head (thick sunset orange outline, cream center)
- Thick rounded strokes (~4px, round lineCap) — marker/brush style
- Organic curves (`quadraticCurveTo`) for all limbs
- Joyful flying pose: arms spread upward in V, legs trailing below
- Matches the Konectr brand mascot style

---

## Static Images

### Homepage (`public/images/homepage/`)

| File | Usage |
|------|-------|
| `hero.jpg` | Homepage hero section |
| `before.jpg` | The Shift section (before) |
| `after.jpg` | The Shift section (after) |
| `step-1.jpg` | How It Works - Step 1 |
| `step-2.jpg` | How It Works - Step 2 |
| `step-3.jpg` | How It Works - Step 3 |

### About Page (`public/images/about/`)

| File | Usage |
|------|-------|
| `our-story.jpg` | Our Story section (landscape) |

---

## Category Emojis (Synced with Mobile)

All emojis match `konectr_mobile/lib/constants/category_reference.dart`:

### Hero Section - Venue Categories (6 pills)

| Emoji | Label | Key |
|-------|-------|-----|
| ☕ | Cafe | cafe |
| 🍽️ | Restaurant | restaurant |
| 🍻 | Bar | bar |
| 💪 | Fitness | fitness |
| ⛰️ | Outdoors | outdoors |
| 🎭 | Entertainment | entertainment |

### Find Your Vibe - Activity Categories (6 cards)

| Emoji | Card Title | Category |
|-------|------------|----------|
| ☕ | Cafe Culture | Chill |
| 💪 | Fitness & Wellness | Active |
| 🎉 | Social Games | Social |
| ⛰️ | Nature & Adventure | Adventure |
| 🍽️ | Foodie Adventures | Restaurant |
| 🎨 | Arts & Culture | Creative |

---

## Waitlist (Tally Form)

**Live URL**: https://konectr.app/#waitlist
**Tally Form ID**: `mY1xRq`
**Dashboard**: https://tally.so (manage form, view submissions)

### Implementation

The waitlist form is embedded via iframe in `CTAFooter.tsx`:

```tsx
<iframe
  src="https://tally.so/embed/mY1xRq?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
  width="100%"
  height="500"
  frameBorder="0"
  title="Konectr Waitlist"
  style={{ minHeight: '500px' }}
/>
```

### Form Fields (Collected by Tally)

| Field | Type | Required |
|-------|------|----------|
| Email | Input | Yes |
| First Name | Input | Yes |
| Phone | Input (+60 Malaysia) | Yes |
| Gender | Dropdown | Yes |
| Areas | Multi-select (10 KL locations) | Yes |
| Age Range | Dropdown (18-25, 26-35, 36-45, 45+) | Yes |
| Activities/Sports | Text | No |
| Consent Checkboxes | 3 checkboxes | Yes |
| CAPTCHA | Verification | Yes |

### Key Files

| File | Purpose |
|------|---------|
| `src/components/sections/CTAFooter.tsx` | Waitlist form embed |
| `src/config/brand.ts` | Tally form ID + embed URL config |

### Webhook Integration (ACTIVE - Fixed Feb 9, 2026)

Tally form submissions are synced to Supabase for conversion tracking:

| Component | Details |
|-----------|---------|
| **Webhook URL** | `https://rsrplvdtbycqcxjlyeju.supabase.co/functions/v1/tally-webhook` |
| **Edge Function** | `supabase/functions/tally-webhook/index.ts` (v2) |
| **Target Table** | `waitlist_users` |
| **Status** | Active - syncing to Supabase (fixed Feb 9, 2026) |
| **Security** | HMAC-SHA256 signature verification via `tally-signature` header |
| **Secret** | `TALLY_WEBHOOK_SECRET` (set in Supabase edge function secrets) |
| **Backfill** | 24 historical signups imported (Sep 2025 - Feb 2026) |

**Data Flow**:
```
Tally Form → Webhook → waitlist_users table → Auto-link on app signup
```

**Conversion Tracking**: When a waitlist user signs up for the app with the same email, triggers automatically:
1. Link `profiles.waitlist_user_id` to waitlist record
2. Set `waitlist_users.converted_at` timestamp
3. Track `onboarding_completed_at` and `first_activity_at`

**Analytics Queries** (run in Supabase):
```sql
SELECT * FROM get_waitlist_funnel_stats(90);
SELECT * FROM v_waitlist_conversion_status;
```

---

## Analytics (Contentsquare/Hotjar)

**Dashboard**: https://app.contentsquare.com

### Integration

Script added to `src/app/layout.tsx`:
```tsx
<Script
  src="https://t.contentsquare.net/uxa/10ec7463f1940.js"
  strategy="lazyOnload"
/>
```

### Features Available

- Heatmaps (click, scroll, attention)
- Session Replay
- AI Frustration Score
- User behavior analytics

---

## Feedback Board (2025-12-27)

**Live URL**: https://konectr.app/feedback

### Purpose

Public feedback board for viewing feature requests, bug reports, and suggestions submitted through the mobile app. **View-only on web** - voting is only available in the Konectr mobile app.

### Key Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/feedback/page.tsx` | Feedback board page wrapper |
| `src/app/[locale]/feedback/FeedbackBoardContent.tsx` | Main board with filters, sorting, ticket list |
| `src/app/[locale]/feedback/[id]/page.tsx` | Ticket detail page wrapper |
| `src/app/[locale]/feedback/[id]/FeedbackTicketDetailContent.tsx` | Full ticket detail view |
| `src/app/[locale]/feedback/components/FeedbackTicketCard.tsx` | View-only ticket card |
| `src/app/[locale]/feedback/components/CategoryFilter.tsx` | Category filter chips |
| `src/lib/feedback-api.ts` | API functions for fetching tickets |
| `src/types/feedback.ts` | TypeScript types, category/status metadata |

### Navigation

- **NOT in top navigation** - kept minimal
- **In footer** - Resources section (after FAQs)
- Footer translations in all 8 locales (`footer.links.feedback`)

### Features

| Feature | Description |
|---------|-------------|
| Category Filter | Filter by: Feature Request, Bug Report, Improvement, General |
| Sort Options | Newest, Most Voted, Trending |
| Ticket Cards | Show vote count, title, category, status, submitter |
| Detail View | Full description, attachments, admin response |
| Lightbox | Click attachments to view full-size |

### Category Metadata

| Category | Emoji | Color |
|----------|-------|-------|
| feature_request | 💡 | Blue |
| bug_report | 🐛 | Red |
| improvement | ✨ | Purple |
| general | 💬 | Gray |

### Status Metadata

| Status | Label | Color |
|--------|-------|-------|
| open | Open | Yellow |
| in_progress | In Progress | Blue |
| planned | Planned | Purple |
| completed | Completed | Green |
| declined | Declined | Red |

### Web vs Mobile

| Feature | Web | Mobile |
|---------|-----|--------|
| View tickets | ✅ | ✅ |
| Submit feedback | ❌ | ✅ |
| Vote on tickets | ❌ | ✅ |
| View attachments | ✅ | ✅ |

### Design Notes

- Cards show vote count as read-only badge (no up/down buttons)
- "Download Konectr App" CTA for voting
- Framer Motion animations on ticket cards
- Responsive grid for attachments
- Lightbox modal for image viewing

---

## Activity Share Links (2025-12-27)

**Live URL**: https://konectr.app/a/{shareCode}

### Purpose

Web fallback page for activity share links. When users share activities, recipients without the app see a preview page with download CTAs.

### Key Files

| File | Purpose |
|------|---------|
| `src/app/a/[code]/page.tsx` | Activity preview page (server-rendered) |
| `src/app/r/[code]/page.tsx` | Referral landing page (server-rendered) |
| `src/lib/supabase.ts` | Supabase client + `getActivityByShareCode()` helper |
| `src/lib/smartLink.ts` | Smart Download CTA helper (deep-link + store fallback) |
| `src/components/SmartDownloadLink.tsx` | Client-only `<a>` wrapper for use in server components |
| `public/logos/konectr-icon-orange.svg` | Orange Konectr icon for header |
| `public/.well-known/apple-app-site-association` | iOS Universal Links |
| `public/.well-known/assetlinks.json` | Android App Links |

### Smart Download CTAs (2026-04-16)

Download buttons on `/a/[code]` and `/r/[code]` attempt the Konectr deep link first
(`konectr://activity/{code}` / `konectr://referral/{code}`), falling back to the
platform store after 2s if the app isn't installed. Visibility-change listener
cancels the fallback once the app takes focus.

Env vars (optional — set once app is live on stores):

| Variable | Fallback | Platform |
|----------|----------|----------|
| `NEXT_PUBLIC_IOS_STORE_URL` | `https://konectr.app/#waitlist` | iOS |
| `NEXT_PUBLIC_ANDROID_STORE_URL` | `https://konectr.app/#waitlist` | Android |

Desktop visitors always route to the waitlist page — there's no app to download on desktop.

### Page States

| State | Trigger | Content |
|-------|---------|---------|
| Active | Valid code, future activity | Activity card + "Download on App Store" + "Open in Konectr" deep link |
| Ended | Valid code, past activity | "This activity has ended" + download CTA |
| Not Found | Invalid code | "Activity not found" + download CTA |

### Activity Card Content (Minimal)

- 🏷️ Activity name with category emoji
- 👤 Hosted by {creator_name}
- 📅 Date & time of day
- 📍 Venue name

### Design

| Element | Light Mode |
|---------|------------|
| Header BG | Solid Sunset Orange (#FF774D) |
| Logo | White pill with orange Konectr icon |
| Card | White with activity details |
| Footer | "konectr.app · The Offline First App" |

### Tagline (Short Form)

**"The Offline First App"** - Use when character-limited.

---

## Venue Discovery Interview (2026-02-28)

**Live URL**: https://konectr.app/venue-interview
**Hidden**: `noindex, nofollow` — not in sitemap or navigation
**Purpose**: Mobile-optimized form for face-to-face venue partner interviews across KL. Target: 100 venues (~2/week). Submissions save directly to Notion database.

### Architecture

| Component | Details |
|-----------|---------|
| **Form** | 6-step wizard, 33 fields, localStorage auto-save |
| **API** | `POST /api/venue-interview` → Notion `pages.create()` |
| **Database** | Notion "Venue Discovery Interviews" (`1018decf-0484-4a9f-8a82-717ce756ec8b`) |
| **Middleware** | Excluded from next-intl locale routing |
| **Env Vars** | `NOTION_API_KEY`, `NOTION_INTERVIEW_DATABASE_ID` (Vercel production) |

### Key Files

| File | Purpose |
|------|---------|
| `src/app/venue-interview/page.tsx` | Server wrapper with noindex metadata |
| `src/app/venue-interview/VenueInterviewForm.tsx` | Client component — multi-step form wizard |
| `src/app/venue-interview/interview-data.ts` | Field definitions, steps, options (33 fields, 6 steps) |
| `src/app/api/venue-interview/route.ts` | POST handler — maps form → Notion properties |

### Form Flow (6 Steps — designed for 15-min conversations)

| Step | Title | Fields | When | Type |
|------|-------|--------|------|------|
| 1 | Before You Walk In | 7 | Pre-research | Prep |
| 2 | Who You're Meeting | 4 | First minute | Taps |
| 3 | How's Business? | 6 | 4–5 min | Taps |
| 4 | Community & Konectr | 5 | 4–5 min (pitch) | Taps |
| 5 | Wrapping Up | 3 | 1–2 min (close) | Taps |
| 6 | After You Leave | 8 | Debrief (solo) | 5 taps + 3 text |

### Design Principles

- **During conversation**: All taps (selects/multi-selects) — no typing while talking
- **After leaving**: Text boxes for qualitative capture (key quote, slow periods, notes)
- **Labels as conversation guides**: Each label tells the interviewer what to ask
- **Hints as scripts**: Quoted text the interviewer can say verbatim
- **Auto-save**: localStorage preserves draft if connection drops mid-interview

### Notion Property Mapping

| Form Type | Notion Type | Fields |
|-----------|-------------|--------|
| title | title | Venue Name |
| select | select | Venue Type, Neighborhood, Role, Google Rating, Years Operating, Daily Foot Traffic, Demographic, Monthly Marketing Spend, Hosted Events Before, Open to Meetups, Dashboard Interest, WiFi + Group Seating, Perk Willingness, Partner Interest, Vibe Check, Partner Tier, Enthusiasm |
| multi_select | multi_select | Top Challenges, Marketing Channels, Top Value Props |
| number | number | Seating Capacity, Repeat % (÷100), Ambiance Score |
| rich_text | rich_text | Person Interviewed, Key Quote, Slow Periods, Notes |
| phone_number | phone_number | Contact, Follow-Up Phone |
| email | email | Follow-Up Email |
| url | url | Instagram |
| date | date | Interview Date |

### Environment Variables (Vercel)

| Variable | Scope | Notes |
|----------|-------|-------|
| `NOTION_API_KEY` | Production + Preview | Internal Notion integration token |
| `NOTION_INTERVIEW_DATABASE_ID` | Production + Preview | UUID without hyphens |

**Important**: Use `printf` (not `echo`) when piping values to `vercel env add` — `echo` appends `\n` which corrupts HTTP headers and UUID validation.

---

## SEO

### Structured Data (JSON-LD)

| Schema | Location | Purpose |
|--------|----------|---------|
| Organization | `src/app/[locale]/layout.tsx` | Company info + social links |
| WebSite | `src/app/[locale]/layout.tsx` | Site name + URL |
| SoftwareApplication | `src/app/[locale]/layout.tsx` | App metadata for rich results |
| FAQPage | `src/app/[locale]/faq/page.tsx` | 54 Q&As for Google Rich Results |
| BlogPosting | `src/app/[locale]/blog/[slug]/page.tsx` | Per-post metadata (Person author) |
| BreadcrumbList | All sub-pages (`about`, `how-it-works`, etc.) | Navigation breadcrumb rich results |
| HowTo | `src/app/[locale]/how-it-works/page.tsx` | 3-step process rich results |

### SEO Utilities

| File | Contents |
|------|----------|
| `src/lib/seo.ts` | `generateBreadcrumbSchema()`, `generateHowToSchema()`, `APP_STRUCTURED_DATA` |

### Meta Descriptions

Each page has a unique keyword-targeted meta description (not shared from layout):

| Page | Primary Keywords |
|------|-----------------|
| Homepage | meet new people, Kuala Lumpur, real activities |
| About | social app, real friends in KL, founded by expat |
| How It Works | make friends in 3 steps, small groups, public venue |
| Safety | phone-verified, public venues only, 3-strike policy |
| FAQ | 55+ answers, meeting people, Kuala Lumpur |
| Blog | making friends as adult, expat guides, friendship recession |
| Gamification | earn badges, build streaks, 6 tiers |
| Contact | partnerships, press, Konectr team |
| Feedback | feature requests, community feedback, transparent |

### Social Sharing

| Feature | File | Details |
|---------|------|---------|
| OG Image | `public/og-image.jpg` | 1200x630, derived from hero.jpg |
| Twitter Card | `src/app/[locale]/layout.tsx` | summary_large_image, @konectrapp |
| theme-color | `src/app/layout.tsx` | Light: #FAFAFA, Dark: #1F1F1F |

### Crawling

| Feature | File | Details |
|---------|------|---------|
| robots.txt | `src/app/robots.ts` | Allow all + sitemap reference |
| Sitemap | `src/app/sitemap.ts` | All pages + blog posts, 8 locales |

---

## Performance

### Image Optimization

All homepage images compressed with `sips` (82% JPEG quality, max 1920px wide):

| Image | Before | After | Savings |
|-------|--------|-------|---------|
| step-3.jpg | 6.8MB | 678KB | 90% |
| step-1.jpg | 4.6MB | 525KB | 89% |
| before.jpg | 3.2MB | 298KB | 91% |
| our-story.jpg | 3.2MB | 696KB | 78% |
| step-2.jpg | 1.3MB | 390KB | 70% |

Next.js image optimization enabled (AVIF/WebP formats, responsive sizes).

### Font Self-Hosting

Satoshi font self-hosted from `public/fonts/` (replaces Fontshare CDN). Eliminates render-blocking external request. `@font-face` declarations in `globals.css`.

### Analytics Deferral

Contentsquare script changed from `afterInteractive` to `lazyOnload` for faster TTI.

---

## Lessons Learned

### Third-Party Embeds in Dynamic Components (CRITICAL)

**Problem**: Third-party embeds (Tally, Typeform, etc.) that use `data-*-src` attributes require JavaScript initialization. When the embed is inside a dynamically imported component (`dynamic()` in Next.js), there's a **race condition**:

1. The third-party script loads and scans the DOM
2. The dynamic component hasn't mounted yet (iframe not in DOM)
3. Script finishes → iframe never activates
4. OR component mounts, calls `loadEmbeds()` → script already ran

**Solution**: Use direct `src` attribute instead of `data-*-src`:

```tsx
// ❌ WRONG - Requires JavaScript initialization (race condition risk)
<iframe data-tally-src="https://tally.so/embed/xyz" />

// ✅ CORRECT - Loads immediately, no JavaScript dependency
<iframe src="https://tally.so/embed/xyz" />
```

**Applies to**: Tally, Typeform, Calendly, HubSpot forms, any embed using progressive enhancement.

### iframe Height for Forms

Forms with many fields need adequate height. A form with 9+ fields needs at least 500px:

```tsx
<iframe
  src="..."
  height="500"
  style={{ minHeight: '500px' }}
/>
```

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-04-17 | Android Web RSVP Bridge — Phase 1 | Android users on `/a/[code]` share links now see "Coming soon to Android — get notified" CTA with email capture instead of a broken App Store button. 5 CTA render sites branch on platform (post-RSVP, pre-RSVP, Not Found, Ended, Activity Full). New `AndroidWaitlistCTA.tsx` component (email input + success state + localStorage persistence). New `/api/android-waitlist` POST route → `register_android_waitlist` RPC (SECURITY DEFINER, idempotent on email, writes to `waitlist_users` with `referral_source='android_rsvp_bridge'`, `utm_campaign=share_code` for viral attribution). `smartLink.ts` now exports `detectPlatform` + `Platform` type for component use. SSR renders iOS fallback (hydration-safe); client-side `useEffect` swaps to Android CTA on mount. iOS flow unchanged, no regression. Phases 2 (Brevo email sequence for all web RSVPs) + 3 (web chat write into Activity Chatter with 5-msg cap + digest) deferred to follow-up sprints. 1 new migration, 2 new + 2 modified files, 0 new TS errors. |
| 2026-04-16 | Smart Download CTAs (WA Funnel Branch 1) | Fixed 3 dead `href="#"` placeholders on `/a/[code]` and `/r/[code]` Download buttons. New `src/lib/smartLink.ts` helper attempts `konectr://activity\|referral/{code}` deep link first, falls back to platform store after 2s with a visibility-change cancel so users with the app don't get bumped to the store. New `src/components/SmartDownloadLink.tsx` client-only wrapper for use in server components. Env vars `NEXT_PUBLIC_IOS_STORE_URL` / `NEXT_PUBLIC_ANDROID_STORE_URL` configurable (default: waitlist). 2 new + 2 modified + CLAUDE.md, 0 errors. |
| 2026-03-01 | FAQ v3 Content Review | Comprehensive content audit: removed 4 duplicates, fixed 6 accuracy issues (E2E encryption claim, photo verification qualifier, strike thresholds, hosting gate, matching flow, Circle description), added 9 new questions (Pulse, referrals, profile completeness, Terms/Privacy, in-progress activities, XP, tiers, sharing referral link, feedback board), rewrote 5 answers. Added Terms of Service + Privacy Policy to helpful resources. 54 → 58 questions. Archived v2 state. 1 new file, 2 modified, 0 build errors. |
| 2026-02-28 | Venue Discovery Interview | Mobile-optimized 6-step form for face-to-face venue interviews. 33 fields (selects during conversation, text boxes in debrief). Submissions → Notion database via API route. localStorage auto-save. Conversational labels with script hints. Hidden from search/navigation. New "Slow Periods" field for scheduling intelligence. 4 new files, 1 modified (middleware). |
| 2026-02-27 | SEO, AEO & Marketing Optimization | 3 new structured data types (SoftwareApplication, BreadcrumbList, HowTo). 9 keyword-targeted meta descriptions. Blog author → Person (E-E-A-T). 8 new AEO FAQ questions (46→54). SEO utility file (`src/lib/seo.ts`). 6 marketing strategy docs in `Marketing/seo/`. 12 files modified, 1 new, 0 build errors. |
| 2026-02-20 | 404 Page — Flappy Konectr | Flappy Bird-style mini-game as custom 404 page. HTML5 Canvas, branded stick-figure mascot, pillar obstacles, emoji collectibles, parallax layers, greenery, high score persistence, dark mode, full-viewport responsive, Safari keyboard fix. 4 new files, 0 modified. |
| 2026-02-17 | Micro Font Bugfix | Replaced `transition-all` with explicit property lists across 9 files to prevent `tw-animate-css` scale properties from being animated during hover/scroll reflow. Added `hover:text-white` overrides on outline buttons over coral backgrounds. Root cause: `transition-all` + `tw-animate-css` custom properties (`--tw-enter-scale`, `--tw-exit-scale`) + Framer Motion nav padding animation. |
| 2026-02-15 | SEO & Performance | JSON-LD structured data (Organization, WebSite, FAQPage, BlogPosting), OG image for social sharing, robots.txt, sitemap fix (+/faq, /feedback), theme-color meta. Image compression (~18MB savings), self-hosted Satoshi font, AVIF/WebP formats, deferred analytics. FAQ data extracted to shared file. |
| 2026-02-14 | Gamification Page | Marketing showcase for mobile gamification system — 7 sections (tiers, badges, streaks, daily rewards, XP, stats, CTA). Footer navigation, all 8 locales, emoji/color/text design |
| 2026-01-06 | Waitlist Fix | Fixed Tally form race condition - changed data-tally-src to direct src, increased height to 500px |
| 2026-01-03 | Universal Links v2 | Added `/activity/*`, `/join/*` paths to AASA, updated assetlinks.json placeholder |
| 2025-12-28 | Favicon v1 | Branded favicon set (6 files), Vercel badge removal script |
| 2025-12-27 | Feedback Board v1 | Public view-only feedback board, category filters, vote display, footer navigation |
| 2025-12-27 | Share Links v1 | Activity share page with minimal card, iOS-only download, deep linking |
| 2025-12-23 | Safety v2 | Updated safety features to match deployed MVP (6 cards), added Coming Soon badge for Photo Verification |
| 2025-12-23 | Analytics | Added Contentsquare (Hotjar) tracking for heatmaps and session replay |
| 2025-12-23 | Emoji Sync | Homepage pills (6 venue categories), Vibes cards (6 activity emojis), "Download the app" CTA |
| 2025-12-23 | About v1 | New "Our Story" image (landscape), local image storage |
| 2025-12-22 | Images v1 | Local images for How It Works (step-1, step-2, step-3), updated before.jpg |
| 2025-12-22 | FAQ v1 | 46 questions, 8 categories, concise answers, emoji sync with mobile |
| 2025-12-22 | Launch | Website deployed to konectr.app |

---

**Last Deployed**: 2026-02-28
**Deployment Method**: `git push origin main:nextjs-website` (Vercel auto-deploys)

---

## Konectr Ecosystem

Full checkpoint documentation available at:
**`/Users/devsmac/Konectr/Development/KONECTR_CHECKPOINT_2025-12-26.md`**

| Project | Status |
|---------|--------|
| Mobile App | Phase 11/13 |
| **Website** | Production Live |
| Analytics | Live |
| Venue Portal | Phase 1 |

---

**Last Updated**: 2026-03-01 by Claude Code
