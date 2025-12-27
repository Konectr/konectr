# CLAUDE.md - Konectr Website

**Last Updated**: 2025-12-27 | **Status**: Production Live | **FAQ**: v1 (46 questions)

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
│   │   │   ├── faq/         # FAQ page (46 questions)
│   │   │   ├── feedback/    # Feedback board
│   │   │   ├── how-it-works/# How it works
│   │   │   └── safety/      # Safety page
│   │   ├── a/[code]/        # Activity share links (no locale)
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── sitemap.ts       # Dynamic sitemap
│   ├── components/
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

## FAQ Page (v2)

**Live URL**: https://konectr.app/faq

### Content Summary

| Category | Icon | Questions |
|----------|------|-----------|
| Getting Started | 🚀 | 6 |
| How Konectr Works | 💡 | 10 |
| Safety & Trust | 🛡️ | 7 |
| Activities & Meetups | 🎯 | 8 |
| Badges & Gamification | 🏆 | 3 |
| Account & Settings | ⚙️ | 5 |
| Premium & Future Features | ✨ | 3 |
| Troubleshooting & Support | 🔧 | 4 |
| **Total** | | **46** |

### Key Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/faq/page.tsx` | FAQ page component |
| `src/app/[locale]/faq/FAQContent.tsx` | FAQ content with 46 questions |

### Emoji Reference (Synced with Mobile)

Emojis in FAQ content match `konectr_mobile/lib/constants/category_reference.dart`:

**Venue Categories:**
| Emoji | Category |
|-------|----------|
| ☕ | Cafe |
| 🍽️ | Restaurant |
| 🍻 | Bar |
| 💪 | Fitness |
| 🌳 | Outdoors |
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
- `src/app/[locale]/faq/FAQContent.tsx` - FAQ page (46 questions, 8 categories)
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
| 🌳 | Outdoors | outdoors |
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

## Analytics (Contentsquare/Hotjar)

**Dashboard**: https://app.contentsquare.com

### Integration

Script added to `src/app/layout.tsx`:
```tsx
<Script
  src="https://t.contentsquare.net/uxa/10ec7463f1940.js"
  strategy="afterInteractive"
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
| `src/lib/supabase.ts` | Supabase client + `getActivityByShareCode()` helper |
| `public/logos/konectr-icon-orange.svg` | Orange Konectr icon for header |
| `public/.well-known/apple-app-site-association` | iOS Universal Links |
| `public/.well-known/assetlinks.json` | Android App Links |

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

## Version History

| Date | Version | Changes |
|------|---------|---------|
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

**Last Deployed**: 2025-12-27
**Deployment Method**: Vercel CLI (`vercel --prod`)

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

**Last Updated**: 2025-12-27 by Claude Code
