import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  // Load all translation files and merge them
  const [common, home, about, howItWorks, safety, contact, blog] = await Promise.all([
    import(`@/messages/${locale}/common.json`),
    import(`@/messages/${locale}/home.json`),
    import(`@/messages/${locale}/about.json`),
    import(`@/messages/${locale}/how-it-works.json`),
    import(`@/messages/${locale}/safety.json`),
    import(`@/messages/${locale}/contact.json`),
    import(`@/messages/${locale}/blog.json`),
  ]);

  return {
    locale,
    messages: {
      ...common.default,
      home: home.default,
      about: about.default,
      howItWorks: howItWorks.default,
      safety: safety.default,
      contact: contact.default,
      blog: blog.default,
    }
  };
});
