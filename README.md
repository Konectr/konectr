# Konectr Web

Official website for Konectr - Real adventures with real people, right now.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component library
- **GSAP** - Scroll animations (planned)

## Project Structure

```
konectr-web/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles + brand colors
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   ├── config/
│   │   └── brand.ts      # Brand constants (colors, social, etc.)
│   └── lib/
│       └── utils.ts      # Utility functions
├── public/               # Static assets
├── _reference/           # Original HTML landing page (reference only)
└── package.json
```

## Brand Colors

| Color | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Sunset Orange | `#FF774D` | `--primary` | Primary CTA, accents |
| Solar Amber | `#FFC845` | `--secondary` | Secondary highlights |
| Graphite Grey | `#1F1F1F` | `--foreground` | Text, dark sections |
| Cloud White | `#FAFAFA` | `--background` | Backgrounds |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Sections

1. **Hero** - Main value proposition with venue showcase
2. **The Shift** - Before/after comparison (scrolling vs living)
3. **How It Works** - 3-step process explanation
4. **Find Your Vibe** - 6 activity categories with "Join the Waitlist" CTA
5. **Join Movement** - Team mission statement + stats
6. **CTA** - Waitlist form (Tally.so embed)
7. **Footer** - Social links and company info

## Pre-Launch Status

The mobile app is not yet on the App Store. CTAs currently say "Join the Waitlist" and link to the Tally waitlist form. See `CLAUDE.md` for the post-launch checklist.

## Related Projects

- [konectr-mobile](../konectr-mvp/konectr_mobile/) - Flutter mobile app
- [konectr-analytics](../konectr-analytics/) - Admin dashboard (Next.js)

## Deployment

Deployed on **Vercel** with automatic builds from git.

### Production URLs

| Domain | Purpose | Status |
|--------|---------|--------|
| **https://konectr.app** | Primary domain | ✅ Live |
| **https://www.konectr.app** | WWW redirect | ✅ Live |
| **https://konectrapp.com** | Redirect to konectr.app | ✅ Live |
| **https://www.konectrapp.com** | Redirect to konectr.app | ✅ Live |

### Vercel Project

- **Project**: `konectr-web`
- **Team**: `konectr`
- **Framework**: Next.js (auto-detected)
- **Build Command**: `next build`

### DNS Configuration

#### konectr.app (Namecheap)
| Type | Host | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

#### konectrapp.com (Namecheap)
| Type | Host | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

### Deployment Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# Check domain status
vercel domains ls
vercel domains inspect konectr.app
```

### SSL Certificates

Automatically provisioned by Vercel (Let's Encrypt). Auto-renews every 90 days.

## Internationalization

Supports 8 locales via `next-intl`:
- English (en) - Default
- Malay (ms)
- Chinese Traditional (zh-HK)
- Chinese Simplified (zh-CN)
- Japanese (ja)
- Korean (ko)
- Thai (th)
- Vietnamese (vi)

## License

Copyright 2025 Konectr. All rights reserved.
