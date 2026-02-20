// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({
    locales,
    defaultLocale,
    localePrefix: 'always'
  });
