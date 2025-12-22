export const locales = ['en', 'ms', 'zh-HK', 'de', 'th', 'ko', 'ja', 'vi'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  'en': 'English',
  'ms': 'Bahasa Melayu',
  'zh-HK': '繁體中文',
  'de': 'Deutsch',
  'th': 'ไทย',
  'ko': '한국어',
  'ja': '日本語',
  'vi': 'Tiếng Việt'
};

// For SEO and metadata
export const localeMetadata: Record<Locale, { name: string; region: string }> = {
  'en': { name: 'English', region: 'US' },
  'ms': { name: 'Malay', region: 'MY' },
  'zh-HK': { name: 'Chinese', region: 'HK' },
  'de': { name: 'German', region: 'DE' },
  'th': { name: 'Thai', region: 'TH' },
  'ko': { name: 'Korean', region: 'KR' },
  'ja': { name: 'Japanese', region: 'JP' },
  'vi': { name: 'Vietnamese', region: 'VN' }
};
