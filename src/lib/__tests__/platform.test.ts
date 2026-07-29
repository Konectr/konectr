// © Konectr 2026. All rights reserved.
// FI-41 — platform classification tests.
//
// These matter more than typical unit tests: this classifier's output IS the
// evidence base for the Android build decision. A bot leaking into the iOS bucket
// biases that decision toward "stay iOS-only", which is the expensive direction to
// get wrong.

import { describe, it, expect } from 'vitest';
import { classifyPlatform } from '../platform';

describe('classifyPlatform', () => {
  it('classifies real Android phones', () => {
    expect(
      classifyPlatform(
        'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
      )
    ).toBe('android');
    // The founder's own test device (Redmi A7 Pro / HyperOS)
    expect(
      classifyPlatform(
        'Mozilla/5.0 (Linux; Android 16; 25128RN17Y) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
      )
    ).toBe('android');
  });

  it('classifies real iPhones and iPods', () => {
    expect(
      classifyPlatform(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1'
      )
    ).toBe('ios');
    expect(classifyPlatform('Mozilla/5.0 (iPod touch; CPU iPhone OS 17_0 like Mac OS X)')).toBe('ios');
  });

  it('does NOT let Android UAs containing "like Mac OS X" fall through to iOS', () => {
    expect(
      classifyPlatform('Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Mac OS X) Mobile')
    ).toBe('android');
  });

  it('classifies desktop', () => {
    expect(classifyPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120')).toBe('desktop');
    expect(classifyPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120')).toBe('desktop');
    expect(classifyPlatform('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120')).toBe('desktop');
  });

  // The highest-value cases. Konectr's whole distribution loop is WhatsApp shares,
  // so every single share triggers a preview fetch against /a/[code]. If those land
  // in `ios`, the Android share looks artificially small — exactly the wrong answer.
  describe('link-preview bots must never be counted as humans', () => {
    it.each([
      ['WhatsApp', 'WhatsApp/2.23.20.0 A'],
      ['WhatsApp iOS-flavoured', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 WhatsApp/2.23'],
      ['Facebook', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'],
      ['Slack', 'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)'],
      ['Telegram', 'TelegramBot (like TwitterBot)'],
      ['Twitter', 'Twitterbot/1.0'],
      ['Google', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'],
      ['Apple', 'Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 (KHTML, like Gecko) Applebot/0.1'],
      ['curl', 'curl/8.4.0'],
      ['node-fetch', 'node-fetch/1.0'],
      ['Vercel monitoring', 'Vercel Edge Functions'],
    ])('%s → bot', (_label, ua) => {
      expect(classifyPlatform(ua)).toBe('bot');
    });
  });

  it('handles missing or junk user agents without throwing', () => {
    expect(classifyPlatform(null)).toBe('other');
    expect(classifyPlatform(undefined)).toBe('other');
    expect(classifyPlatform('')).toBe('other');
    expect(classifyPlatform('¯\\_(ツ)_/¯')).toBe('other');
  });
});
