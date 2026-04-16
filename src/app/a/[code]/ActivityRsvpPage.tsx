'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SharedActivity } from '@/lib/supabase';
import { getActivityRsvpTeaser, type RsvpTeaserResponse } from '@/lib/supabase';
import { getSmartDownloadProps } from '@/lib/smartLink';

// Brand assets
const LOGO_ORANGE = 'https://cdn.prod.website-files.com/6857df346d4e4bd260786fbd/686328457e3945d8a146fbaf_Konectr_Orange_SSVG_2.avif';
const LOGO_ICON_ORANGE = '/logos/konectr-icon-orange.svg';

// Category emoji mapping (synced with mobile app)
const categoryEmojis: Record<string, string> = {
  cafe: '☕', restaurant: '🍽️', bar: '🍻', fitness: '💪',
  outdoors: '⛰️', entertainment: '🎭', chill: '☕', active: '💪',
  focus: '🎯', creative: '🎨', adventure: '⛰️', social: '🎉',
};

// Country codes (synced with mobile: auth_constants.dart)
const countryCodes = [
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+1', name: 'USA', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
];

function getCategoryEmoji(category: string): string {
  return categoryEmojis[category.toLowerCase()] || '📌';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function isActivityEnded(endTime: string): boolean {
  return new Date(endTime) < new Date();
}

// =============================================
// localStorage helpers
// =============================================
const RSVP_STORAGE_KEY = 'konectr_rsvps';
const USER_PROFILE_KEY = 'konectr_user_profile';

interface StoredRsvp {
  claimToken: string;
  guestName: string;
  rsvpAt: string;
  participantCount: number;
  participantNames: string[];
  messageCount: number;
}

interface StoredUserProfile {
  guestName: string;
  phoneNumber: string;
  countryCode: string;
}

function getStoredRsvp(shareCode: string): StoredRsvp | null {
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

function storeRsvp(shareCode: string, rsvp: StoredRsvp): void {
  try {
    const stored = localStorage.getItem(RSVP_STORAGE_KEY);
    const rsvps = stored ? JSON.parse(stored) : {};
    rsvps[shareCode] = rsvp;
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvps));
  } catch {
    // localStorage unavailable
  }
}

function getStoredUserProfile(): StoredUserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function storeUserProfile(profile: StoredUserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage unavailable
  }
}

interface Props {
  activity: SharedActivity | null;
  shareCode: string;
}

export default function ActivityRsvpPage({ activity, shareCode }: Props) {
  const [rsvpState, setRsvpState] = useState<'loading' | 'pre-rsvp' | 'post-rsvp'>('loading');
  const [storedRsvp, setStoredRsvp] = useState<StoredRsvp | null>(null);
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+60');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [teaserData, setTeaserData] = useState<RsvpTeaserResponse | null>(null);

  // Check localStorage on mount + auto-fill + fetch teaser
  useEffect(() => {
    if (!activity) {
      setRsvpState('pre-rsvp');
      return;
    }

    // Auto-fill from stored user profile (repeat RSVPs)
    const userProfile = getStoredUserProfile();
    if (userProfile) {
      setGuestName(userProfile.guestName);
      setPhoneNumber(userProfile.phoneNumber);
      setCountryCode(userProfile.countryCode);
    }

    // Check if already RSVP'd to this activity
    const existing = getStoredRsvp(shareCode);
    if (existing) {
      setStoredRsvp(existing);
      setRsvpState('post-rsvp');
    } else {
      setRsvpState('pre-rsvp');
      // Fetch fresh teaser data only for pre-RSVP users
      getActivityRsvpTeaser(activity.id).then((data) => {
        if (data) setTeaserData(data);
      });
    }
  }, [activity, shareCode]);

  const handleRsvp = useCallback(async () => {
    if (!guestName.trim() || !activity) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Build request body — phone is optional
      const body: Record<string, string> = {
        share_code: shareCode,
        guest_name: guestName.trim(),
      };
      if (phoneNumber.trim()) {
        body.phone_number = phoneNumber.trim();
        body.country_code = countryCode;
      }

      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      // Store RSVP for this activity
      const rsvpData: StoredRsvp = {
        claimToken: data.claim_token,
        guestName: data.guest_name,
        rsvpAt: new Date().toISOString(),
        participantCount: data.participant_count,
        participantNames: data.participant_names || [],
        messageCount: data.message_count || 0,
      };
      storeRsvp(shareCode, rsvpData);
      setStoredRsvp(rsvpData);

      // Save user profile for auto-fill on next RSVP
      storeUserProfile({
        guestName: guestName.trim(),
        phoneNumber: phoneNumber.trim(),
        countryCode,
      });

      setRsvpState('post-rsvp');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [guestName, phoneNumber, countryCode, activity, shareCode]);

  const copyClaimCode = useCallback(() => {
    if (!storedRsvp) return;
    navigator.clipboard.writeText(storedRsvp.claimToken).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [storedRsvp]);

  // =============================================
  // Not Found State
  // =============================================
  if (!activity) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <Link href="/">
            <Image src={LOGO_ORANGE} alt="Konectr" width={120} height={32} className="mx-auto mb-6" unoptimized />
          </Link>
          <div className="mb-6">
            <div className="text-5xl mb-3">🔍</div>
            <h1 className="text-xl font-bold text-[#1F1F1F] mb-2">Activity not found</h1>
            <p className="text-[#666] text-sm">This link may have expired or the activity was removed.</p>
          </div>
          <DownloadButton shareCode={shareCode} />
        </div>
        <Footer />
      </div>
    );
  }

  const ended = isActivityEnded(activity.end_time);
  const deepLink = `konectr://activity/${shareCode}`;
  const emoji = getCategoryEmoji(activity.category);
  // isFull is computed after teaser data loads (see spotsRemaining below)

  // =============================================
  // Ended State
  // =============================================
  if (ended) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <Link href="/">
            <Image src={LOGO_ORANGE} alt="Konectr" width={120} height={32} className="mx-auto mb-6" unoptimized />
          </Link>
          <div className="mb-6">
            <div className="text-5xl mb-3">⏰</div>
            <h1 className="text-xl font-bold text-[#1F1F1F] mb-2">This activity has ended</h1>
            <p className="text-[#666] text-sm">Download the app to discover more activities.</p>
          </div>
          <DownloadButton shareCode={shareCode} />
        </div>
        <Footer />
      </div>
    );
  }

  // Prefer fresh teaser data; fall back to stored RSVP snapshot
  const participantNames = teaserData?.participant_names
    || storedRsvp?.participantNames || [];
  const participantCount = teaserData?.participant_count
    ?? storedRsvp?.participantCount ?? activity.current_participants;
  const messageCount = teaserData?.message_count
    ?? storedRsvp?.messageCount ?? 0;
  const spotsRemaining = teaserData?.spots_remaining
    ?? (activity.max_participants > 0 ? activity.max_participants - participantCount : -1);

  const canSubmit = guestName.trim().length > 0;

  // =============================================
  // Active Activity — with RSVP
  // =============================================
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Logo Header */}
        <div className="bg-[#FF774D] py-6 px-4">
          <Link href="/">
            <div className="w-14 h-14 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Image src={LOGO_ICON_ORANGE} alt="Konectr" width={36} height={36} unoptimized />
            </div>
          </Link>
        </div>

        {/* Activity Card */}
        <div className="p-5">
          {/* Activity Name with Emoji */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#FFF5F2] rounded-xl flex items-center justify-center text-2xl shrink-0">
              {emoji}
            </div>
            <h1 className="text-lg font-bold text-[#1F1F1F] leading-tight">
              {activity.title}
            </h1>
          </div>

          {/* Details */}
          <div className="space-y-2.5 text-sm text-[#1F1F1F]">
            <div className="flex items-center gap-2.5">
              <span className="text-[#999] w-5 text-center">👤</span>
              <span>Hosted by <strong>{activity.creator_name}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[#999] w-5 text-center">📅</span>
              <span>{formatDate(activity.start_time)} · {formatTime(activity.start_time)}</span>
            </div>
            {activity.venue_name && (
              <div className="flex items-center gap-2.5">
                <span className="text-[#FF774D] w-5 text-center">📍</span>
                <span>{activity.venue_name}</span>
              </div>
            )}
            {/* Spots indicator — uses teaser count (confirmed + web RSVPs) */}
            <div className="flex items-center gap-2.5">
              <span className="text-[#999] w-5 text-center">👥</span>
              {spotsRemaining <= 0 && activity.max_participants > 0 ? (
                <span className="text-[#E53E3E] font-medium">Activity is full</span>
              ) : activity.max_participants > 0 ? (
                <span>
                  <strong>{spotsRemaining}</strong> of {activity.max_participants} spots left
                </span>
              ) : (
                <span>Open · <strong>{participantCount}</strong> joined</span>
              )}
            </div>
          </div>

          {/* Description */}
          {activity.description && activity.description !== activity.title && (
            <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
              <p className="text-sm text-[#555] leading-relaxed">{activity.description}</p>
            </div>
          )}

          {/* Who's Joining + Chatter Teaser (always visible) */}
          {(participantNames.length > 0 || messageCount > 0) && (
            <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
              {participantNames.length > 0 && (
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-sm mt-0.5">🙋</span>
                  <p className="text-sm text-[#555]">
                    <strong className="text-[#1F1F1F]">{participantNames.join(', ')}</strong>
                    {participantCount > participantNames.length && (
                      <span> and {participantCount - participantNames.length} more</span>
                    )}
                    <span className="text-[#999]"> joining</span>
                  </p>
                </div>
              )}
              {messageCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">💬</span>
                  <p className="text-xs text-[#999]">
                    <strong className="text-[#777]">{messageCount} messages</strong> in Activity Chatter
                  </p>
                </div>
              )}
            </div>
          )}

          {/* RSVP Section */}
          {rsvpState === 'loading' ? (
            <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
              <div className="h-12 bg-[#F5F5F5] rounded-lg animate-pulse" />
            </div>
          ) : rsvpState === 'post-rsvp' && storedRsvp ? (
            // =============================================
            // Post-RSVP State
            // =============================================
            <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
              {/* Confirmation */}
              <div className="bg-[#F0FFF4] rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="font-bold text-[#1F1F1F]">You&apos;re in, {storedRsvp.guestName}!</span>
                </div>
                <p className="text-[#666] text-xs ml-7">Your spot is reserved</p>
              </div>

              {/* Download CTA */}
              <div className="bg-[#F9FAFB] rounded-xl p-4 mb-4 text-center">
                <p className="text-xs text-[#555] font-medium mb-3">
                  Download Konectr to join the conversation and get notified
                </p>
                <a
                  {...getSmartDownloadProps(shareCode)}
                  className="inline-flex items-center justify-center gap-2 w-full bg-[#FF774D] text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-[#E5693F] transition-colors shadow-sm"
                >
                  <AppleIcon />
                  Download Konectr
                </a>
              </div>

              {/* Open in App */}
              <div className="text-center">
                <a
                  href={deepLink}
                  className="inline-flex items-center gap-1.5 text-[#FF774D] font-medium text-sm hover:underline"
                >
                  Already have the app? Open in Konectr
                  <ExternalIcon />
                </a>
              </div>

              {/* Claim code — de-emphasized fallback */}
              <div className="mt-4 pt-3 border-t border-[#F0F0F0] text-center">
                <p className="text-[10px] text-[#BBB] mb-1">Having trouble? Use your claim code</p>
                <button
                  onClick={copyClaimCode}
                  className="text-xs font-mono text-[#999] hover:text-[#FF774D] transition-colors"
                >
                  {copied ? 'Copied!' : storedRsvp.claimToken}
                </button>
              </div>
            </div>
          ) : (
            // =============================================
            // Pre-RSVP State — RSVP Form
            // =============================================
            <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
              {spotsRemaining <= 0 && activity.max_participants > 0 ? (
                <div className="text-center">
                  <DownloadButton shareCode={shareCode} />
                  <OpenInApp deepLink={deepLink} />
                </div>
              ) : (
                <>
                  {/* RSVP Form */}
                  <div className="mb-4">
                    <label htmlFor="guest-name" className="block text-xs text-[#999] mb-1.5">
                      Reserve your spot
                    </label>

                    {/* Name input */}
                    <input
                      id="guest-name"
                      type="text"
                      placeholder="Your first name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canSubmit && !phoneNumber && handleRsvp()}
                      maxLength={50}
                      className="w-full px-3 py-2.5 rounded-lg border border-[#E5E5E5] text-sm text-[#1F1F1F] placeholder:text-[#BBB] focus:outline-none focus:border-[#FF774D] focus:ring-1 focus:ring-[#FF774D] transition-colors mb-2"
                    />

                    {/* Phone input with country code (optional) */}
                    <div className="flex gap-1.5 mb-3">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-[88px] shrink-0 px-2 py-2.5 rounded-lg border border-[#E5E5E5] text-sm text-[#1F1F1F] bg-white focus:outline-none focus:border-[#FF774D] focus:ring-1 focus:ring-[#FF774D] transition-colors appearance-none"
                        aria-label="Country code"
                      >
                        {countryCodes.map((cc) => (
                          <option key={cc.code} value={cc.code}>
                            {cc.flag} {cc.code}
                          </option>
                        ))}
                      </select>
                      <input
                        id="guest-phone"
                        type="tel"
                        placeholder="Phone (optional)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleRsvp()}
                        className="flex-1 px-3 py-2.5 rounded-lg border border-[#E5E5E5] text-sm text-[#1F1F1F] placeholder:text-[#BBB] focus:outline-none focus:border-[#FF774D] focus:ring-1 focus:ring-[#FF774D] transition-colors"
                      />
                    </div>

                    {/* Submit button */}
                    <button
                      onClick={handleRsvp}
                      disabled={!canSubmit || isSubmitting}
                      className="w-full px-4 py-3 bg-[#FF774D] text-white rounded-xl text-sm font-bold hover:bg-[#E5693F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "I'm In!"
                      )}
                    </button>

                    {error && (
                      <p className="text-xs text-red-500 mt-1.5">{error}</p>
                    )}

                    <p className="text-[10px] text-[#BBB] mt-2 text-center">
                      Phone links your RSVP when you sign up. Never shared.
                    </p>
                  </div>

                  {/* Download CTA */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px bg-[#F0F0F0]" />
                    <span className="text-xs text-[#CCC]">or</span>
                    <div className="flex-1 h-px bg-[#F0F0F0]" />
                  </div>

                  <a
                    {...getSmartDownloadProps(shareCode)}
                    className="flex items-center justify-center gap-2 w-full bg-[#1F1F1F] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
                  >
                    <AppleIcon />
                    Download on App Store
                  </a>

                  <OpenInApp deepLink={deepLink} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// =============================================
// Shared Sub-Components
// =============================================

function DownloadButton({ shareCode }: { shareCode: string }) {
  return (
    <a
      {...getSmartDownloadProps(shareCode)}
      className="inline-flex items-center gap-2 bg-[#1F1F1F] text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-[#333] transition-colors"
    >
      <AppleIcon />
      Download Konectr
    </a>
  );
}

function OpenInApp({ deepLink }: { deepLink: string }) {
  return (
    <div className="mt-4 text-center">
      <p className="text-[#999] text-xs mb-1">Already have the app?</p>
      <a
        href={deepLink}
        className="inline-flex items-center gap-1.5 text-[#FF774D] font-medium text-sm hover:underline"
      >
        Open in Konectr
        <ExternalIcon />
      </a>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function Footer() {
  return (
    <p className="mt-6 text-[#999] text-xs">
      <Link href="/" className="hover:text-[#FF774D]">konectr.app</Link> · The Offline First App
    </p>
  );
}
