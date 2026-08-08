import type { MetadataRoute } from 'next'

// Drop-in replacement for konectr-web/src/app/robots.ts
//
// Why: the default `User-agent: *` already allows AI crawlers, but naming them
// explicitly (a) documents intent so a future dev never accidentally blocks an
// AI citation source, and (b) some crawlers only honour named rules. This is
// Track A2 from the discoverability playbook.
//
// AI/answer-engine crawlers covered:
//   OpenAI:     GPTBot (training), OAI-SearchBot (ChatGPT search index), ChatGPT-User (live browse)
//   Perplexity: PerplexityBot (index), Perplexity-User (live fetch)
//   Anthropic:  ClaudeBot, anthropic-ai, Claude-User
//   Google:     Google-Extended (Gemini/AI training opt-in), Googlebot (search)
//   Microsoft:  Bingbot (powers ChatGPT's web results)
//   Apple:      Applebot, Applebot-Extended (Apple Intelligence / Siri)
//
// Reconcile with the existing robots.ts before shipping — keep any
// Disallow paths the current file already has (e.g. /api, preview routes).

const SITE_URL = 'https://konectr.app'

// Crawlers we explicitly welcome at the site root.
const ALLOWED_AGENTS = [
  '*',
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: ALLOWED_AGENTS.map((userAgent) => ({
      userAgent,
      allow: '/',
      // Keep these in sync with whatever the current robots.ts disallows.
      disallow: ['/api/'],
    })),
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
