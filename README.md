# Konectr Landing Page

Public marketing website for Konectr - Real adventures with real people, right now.

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styles with CSS variables
- **JavaScript** - Vanilla JS for interactions
- **GSAP** - Scroll-triggered animations
- **Tally.so** - Embedded waitlist form

## Project Structure

```
konectr-landing/
├── index.html              # Main landing page
├── package.json            # NPM configuration
├── netlify/                # Netlify deployment config
└── README.md
```

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Sunset Orange | `#FF774D` | Primary CTA, accents |
| Solar Amber | `#FFC845` | Secondary highlights |
| Graphite Grey | `#1F1F1F` | Text, dark sections |
| Cloud White | `#FAFAFA` | Backgrounds |

## Sections

1. **Announcement Bar** - Clickable banner for early access
2. **Navigation** - Floating pill-style navbar
3. **Hero** - Main value proposition with venue showcase
4. **Trust Indicators** - Early adopters, venues, real moments
5. **How It Works** - 3-step process explanation
6. **Find Your Vibe** - 6 activity categories
7. **Testimonial** - Team mission statement
8. **CTA** - Tally.so waitlist form embed
9. **Footer** - Social links and company info

## Local Development

Simply open `index.html` in a browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8000
```

## Deployment

Currently configured for **Netlify** deployment.

## Related Projects

- [konectr-mobile](../konectr-mvp/konectr_mobile/) - Flutter mobile app
- [konectr-analytics](../konectr-analytics/) - Admin dashboard (Next.js)

## License

Copyright © 2025 Konectr. All rights reserved.
