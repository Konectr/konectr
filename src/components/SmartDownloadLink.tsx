'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import type { ReactNode } from 'react';
import {
  getSmartCampaignLinkProps,
  getSmartDownloadProps,
  getSmartReferralDownloadProps,
} from '@/lib/smartLink';

interface SmartDownloadLinkProps {
  code: string;
  kind?: 'activity' | 'referral' | 'campaign';
  className?: string;
  children: ReactNode;
}

export default function SmartDownloadLink({
  code,
  kind = 'activity',
  className,
  children,
}: SmartDownloadLinkProps) {
  const props = kind === 'referral'
    ? getSmartReferralDownloadProps(code)
    : kind === 'campaign'
      ? getSmartCampaignLinkProps(code)
      : getSmartDownloadProps(code);
  return (
    <a {...props} className={className}>
      {children}
    </a>
  );
}
