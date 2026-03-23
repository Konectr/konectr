'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SharedActivity } from '@/lib/supabase';

// Brand assets
const LOGO_ORANGE = 'https://cdn.prod.website-files.com/6857df346d4e4bd260786fbd/686328457e3945d8a146fbaf_Konectr_Orange_SSVG_2.avif';
const LOGO_ICON_ORANGE = '/logos/konectr-icon-orange.svg';

// Category emoji mapping (synced with mobile app)
const categoryEmojis: Record<string, string> = {
  cafe: '☕', restaurant: '🍽️', bar: '🍻', fitness: '💪',
  outdoors: '⛰️', entertainment: '🎭', chill: '☕', active: '💪',
  focus: '🎯', creative: '🎨', adventure: '⛰️', social: '🎉',
};

function getCategoryEmoji(category: string): string {
  return categoryEmojis[category.toLowerCase()] || '📌';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function getTimeOfDay(dateString: string): string {
  const date = new Date(dateString);
  const hour = date.getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

function isActivityEnded(startTime: string): boolean {
  return new Date(startTime) < new Date();
}

// localStorage helpers
const STORAGE_KEY = 'konectr_rsvps';

interface StoredRsvp {
  claimToken: string;
  guestName: string;
  rsvpAt: string;
  participantCount: number;
  participantNames: string[];
}

function getStoredRsvp(shareCode: string): StoredRsvp | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const rsvps = JSON.parse(stored);
    return rsvps[shareCode] || null;
  } catch {
    return null;
  }
}

function storeRsvp(shareCode: string, rsvp: StoredRsvp): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const rsvps = stored ? JSON.parse(stored) : {};
    rsvps[shareCode] = rsvp;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvps));
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    if (!activity) {
      setRsvpState('pre-rsvp');
      return;
    }
    const existing = getStoredRsvp(shareCode);
    if (existing) {
      setStoredRsvp(existing);
      setRsvpState('post-rsvp');
    } else {
      setRsvpState('pre-rsvp');
    }
  }, [activity, shareCode]);

  const handleRsvp = useCallback(async () => {
    if (!guestName.trim() || !activity) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          share_code: shareCode,
          guest_name: guestName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      const rsvpData: StoredRsvp = {
        claimToken: data.claim_token,
        guestName: data.guest_name,
        rsvpAt: new Date().toISOString(),
        participantCount: data.participant_count,
        participantNames: data.participant_names || [],
      };

      storeRsvp(shareCode, rsvpData);
      setStoredRsvp(rsvpData);
      setRsvpState('post-rsvp');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [guestName, activity, shareCode]);

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
          <DownloadButton />
        </div>
        <Footer />
      </div>
    );
  }

  const ended = isActivityEnded(activity.start_time);
  const deepLink = `konectr://activity/${shareCode}`;
  const emoji = getCategoryEmoji(activity.category);
  const isFull = activity.max_participants > 0 && activity.current_participants >= activity.max_participants;

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
          <DownloadButton />
        </div>
        <Footer />
      </div>
    );
  }

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
              <span>{formatDate(activity.start_time)} · {getTimeOfDay(activity.start_time)}</span>
            </div>
            {activity.venue_name && (
              <div className="flex items-center gap-2.5">
                <span className="text-[#FF774D] w-5 text-center">📍</span>
                <span>{activity.venue_name}</span>
              </div>
            )}
            {/* Spots indicator */}
            <div className="flex items-center gap-2.5">
              <span className="text-[#999] w-5 text-center">👥</span>
              {isFull ? (
                <span className="text-[#E53E3E] font-medium">Activity is full</span>
              ) : activity.max_participants > 0 ? (
                <span>
                  <strong>{activity.max_participants - activity.current_participants}</strong> of {activity.max_participants} spots left
                </span>
              ) : (
                <span>Open · <strong>{activity.current_participants}</strong> joined</span>
              )}
            </div>
          </div>

          {/* RSVP Section */}
          {rsvpState === 'loading' ? (
            <div className="mt-5 pt-4 border-t border-[#F0F0F0]">
              <div className="h-12 bg-[#F5F5F5] rounded-lg animate-pulse" />
            </div>
          ) : rsvpState === 'post-rsvp' && storedRsvp ? (
            // =============================================
            // Post-RSVP State
            // =============================================
            <div className="mt-5 pt-4 border-t border-[#F0F0F0]">
              {/* Confirmation */}
              <div className="bg-[#F0FFF4] rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="font-bold text-[#1F1F1F]">You&apos;re in, {storedRsvp.guestName}!</span>
                </div>
                <p className="text-[#666] text-xs ml-7">Your spot is reserved</p>
              </div>

              {/* Teaser Section */}
              <div className="bg-[#F9FAFB] rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  {/* Blurred avatar circles */}
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-[#DDD] border-2 border-white"
                        style={{ filter: 'blur(1px)' }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#666]">
                    <strong className="text-[#1F1F1F]">{storedRsvp.participantCount} people</strong> joining
                  </span>
                </div>
                <p className="text-xs text-[#999]">
                  Download the app to see who&apos;s coming
                </p>
              </div>

              {/* Claim Code */}
              <div className="bg-[#FFF5F2] rounded-xl p-4 mb-4">
                <p className="text-xs text-[#666] mb-2">Your claim code</p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono font-bold text-[#FF774D] tracking-wider">
                    {storedRsvp.claimToken}
                  </code>
                  <button
                    onClick={copyClaimCode}
                    className="text-xs text-[#999] hover:text-[#FF774D] transition-colors px-2 py-1 rounded border border-[#E5E5E5] hover:border-[#FF774D]"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-[#999] mt-2">
                  Enter this code after signing up to claim your spot
                </p>
              </div>

              {/* Download CTA */}
              <a
                href="#"
                className="flex items-center justify-center gap-2 w-full bg-[#FF774D] text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-[#E5693F] transition-colors"
              >
                <AppleIcon />
                Download Konectr to see who&apos;s coming
              </a>

              {/* Open in App */}
              <div className="mt-3 text-center">
                <a
                  href={deepLink}
                  className="inline-flex items-center gap-1.5 text-[#FF774D] font-medium text-sm hover:underline"
                >
                  Open in Konectr
                  <ExternalIcon />
                </a>
              </div>
            </div>
          ) : (
            // =============================================
            // Pre-RSVP State
            // =============================================
            <div className="mt-5 pt-4 border-t border-[#F0F0F0]">
              {isFull ? (
                <>
                  <DownloadButton />
                  <OpenInApp deepLink={deepLink} />
                </>
              ) : (
                <>
                  {/* RSVP Form */}
                  <div className="mb-4">
                    <label htmlFor="guest-name" className="block text-xs text-[#999] mb-1.5">
                      Reserve your spot — no account needed
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="guest-name"
                        type="text"
                        placeholder="Your first name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRsvp()}
                        maxLength={50}
                        className="flex-1 px-3 py-2.5 rounded-lg border border-[#E5E5E5] text-sm text-[#1F1F1F] placeholder:text-[#BBB] focus:outline-none focus:border-[#FF774D] focus:ring-1 focus:ring-[#FF774D] transition-colors"
                      />
                      <button
                        onClick={handleRsvp}
                        disabled={!guestName.trim() || isSubmitting}
                        className="px-4 py-2.5 bg-[#FF774D] text-white rounded-lg text-sm font-semibold hover:bg-[#E5693F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {isSubmitting ? (
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "I'm In!"
                        )}
                      </button>
                    </div>
                    {error && (
                      <p className="text-xs text-red-500 mt-1.5">{error}</p>
                    )}
                  </div>

                  {/* Existing Download CTA */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px bg-[#F0F0F0]" />
                    <span className="text-xs text-[#CCC]">or</span>
                    <div className="flex-1 h-px bg-[#F0F0F0]" />
                  </div>

                  <a
                    href="#"
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

function DownloadButton() {
  return (
    <a
      href="#"
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
