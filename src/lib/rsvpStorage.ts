// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// localStorage persistence for the web RSVP flow (/a/[code]): the per-share-code
// claim record + the reusable guest profile (name/phone/email autofill). Keys and
// shapes are load-bearing — the mobile auto-claim + returning-visitor restore both
// read them; do not rename without a matching migration.

const RSVP_STORAGE_KEY = 'konectr_rsvps';
const USER_PROFILE_KEY = 'konectr_user_profile';

export interface StoredRsvp {
  claimToken: string;
  guestName: string;
  rsvpAt: string;
  participantCount: number;
  participantNames: string[];
  messageCount: number;
}

export interface StoredUserProfile {
  guestName: string;
  phoneNumber: string;
  countryCode: string;
  email?: string;
}

export function getStoredRsvp(shareCode: string): StoredRsvp | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(RSVP_STORAGE_KEY);
    if (!stored) return null;
    const rsvps = JSON.parse(stored);
    return rsvps[shareCode] || null;
  } catch {
    return null;
  }
}

export function storeRsvp(shareCode: string, rsvp: StoredRsvp): void {
  try {
    const stored = localStorage.getItem(RSVP_STORAGE_KEY);
    const rsvps = stored ? JSON.parse(stored) : {};
    rsvps[shareCode] = rsvp;
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvps));
  } catch {
    // localStorage unavailable
  }
}

export function removeStoredRsvp(shareCode: string): void {
  try {
    const stored = localStorage.getItem(RSVP_STORAGE_KEY);
    if (!stored) return;
    const rsvps = JSON.parse(stored);
    delete rsvps[shareCode];
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvps));
  } catch {
    // localStorage unavailable
  }
}

export function getStoredUserProfile(): StoredUserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function storeUserProfile(profile: StoredUserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage unavailable
  }
}
