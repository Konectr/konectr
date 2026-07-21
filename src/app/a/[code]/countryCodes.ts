// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

export interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

// Country codes (synced with mobile: auth_constants.dart)
export const countryCodes: CountryCode[] = [
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+1', name: 'USA', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
];
