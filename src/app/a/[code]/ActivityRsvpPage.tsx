'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SharedActivity } from '@/lib/supabase';
import { getActivityRsvpTeaser, type RsvpTeaserResponse } from '@/lib/supabase';
import { getSmartDownloadProps, detectPlatform, type Platform } from '@/lib/smartLink';
import AndroidWaitlistCTA from './AndroidWaitlistCTA';
import WebChatPanel from './WebChatPanel';

// Brand assets
const LOGO_ICON_ORANGE = '/logos/konectr-icon-orange.svg';

// Category emoji mapping (synced with mobile app)
const categoryEmojis: Record<string, string> = {
  cafe: '☕', restaurant: '🍽️', bar: '🍻', fitness: '💪',
  outdoors: '⛰️', entertainment: '🎭', chill: '☕', active: '💪',
  focus: '🎯', creative: '🎨', adventure: '⛰️', social: '🎉',
};

// Hero photo by category — re-uses the same compressed assets the email
// templates render so the cross-channel brand feel stays consistent.
const HERO_PHOTOS: Record<string, string> = {
  cafe: '/images/email/cafe-friends.jpg',
  chill: '/images/email/cafe-friends.jpg',
  restaurant: '/images/email/friends-group.jpg',
  bar: '/images/email/friends-group.jpg',
  social: '/images/email/friends-group.jpg',
  entertainment: '/images/email/friends-group.jpg',
  creative: '/images/email/friends-group.jpg',
  focus: '/images/email/cafe-friends.jpg',
  fitness: '/images/email/fitness-class.jpg',
  active: '/images/email/fitness-class.jpg',
  outdoors: '/images/email/asian-friends-park.jpg',
  adventure: '/images/email/asian-friends-park.jpg',
};
const DEFAULT_HERO = '/images/email/asian-friends-park.jpg';

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

function getHeroPhoto(category: string): string {
  return HERO_PHOTOS[category.toLowerCase()] || DEFAULT_HERO;
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

// Friendly day label for the hero overlay — "Tonight", "Tomorrow", "Friday".
function getDayLabel(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday); startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  const startOfDayAfter = new Date(startOfToday); startOfDayAfter.setDate(startOfDayAfter.getDate() + 2);

  if (date >= startOfToday && date < startOfTomorrow) {
    return date.getHours() >= 17 ? 'TONIGHT' : 'TODAY';
  }
  if (date >= startOfTomorrow && date < startOfDayAfter) return 'TOMORROW';
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
}

// Natural-language relative day for the datetime card — "Tonight", "Tomorrow",
// "This Friday", "Next Wednesday", or the bare weekday for activities ≥2 weeks out.
function getRelativeDayPhrase(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((target.getTime() - startOfToday.getTime()) / 86_400_000);

  if (diffDays <= 0) return date.getHours() >= 17 ? 'Tonight' : 'Today';
  if (diffDays === 1) return 'Tomorrow';
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  if (diffDays <= 6) return `This ${weekday}`;
  if (diffDays <= 13) return `Next ${weekday}`;
  return weekday;
}

function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
  email?: string;
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
  const [email, setEmail] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [teaserData, setTeaserData] = useState<RsvpTeaserResponse | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);

  // Detect platform on mount (SSR-safe)
  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  // Check localStorage on mount + auto-fill + fetch teaser
  useEffect(() => {
    if (!activity) {
      setRsvpState('pre-rsvp');
      return;
    }

    const userProfile = getStoredUserProfile();
    if (userProfile) {
      setGuestName(userProfile.guestName);
      setPhoneNumber(userProfile.phoneNumber);
      setCountryCode(userProfile.countryCode);
      if (userProfile.email) setEmail(userProfile.email);
      // Email is the only optional field behind the disclosure now — expand if present
      if (userProfile.email) setShowOptional(true);
    }

    const existing = getStoredRsvp(shareCode);
    if (existing) {
      setStoredRsvp(existing);
      setRsvpState('post-rsvp');
    } else {
      setRsvpState('pre-rsvp');
    }

    // Fresh teaser data for both states so participant names + spot count
    // reflect reality (B2 fix: stale snapshot after first-to-RSVP).
    getActivityRsvpTeaser(activity.id).then((data) => {
      if (data) setTeaserData(data);
    });
  }, [activity, shareCode]);

  // Poll teaser every 5s while visible (B4 fix: live "X, Y joining" + spots).
  useEffect(() => {
    if (!activity) return;
    const id = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      getActivityRsvpTeaser(activity.id).then((data) => {
        if (data) setTeaserData(data);
      });
    }, 5_000);
    return () => clearInterval(id);
  }, [activity]);

  const handleRsvp = useCallback(async () => {
    if (!guestName.trim() || !phoneNumber.trim() || !activity) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const body: Record<string, string> = {
        share_code: shareCode,
        guest_name: guestName.trim(),
        phone_number: phoneNumber.trim(),
        country_code: countryCode,
      };
      if (email.trim()) {
        body.email = email.trim();
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

      storeUserProfile({
        guestName: guestName.trim(),
        phoneNumber: phoneNumber.trim(),
        countryCode,
        email: email.trim() || undefined,
      });

      setRsvpState('post-rsvp');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [guestName, phoneNumber, countryCode, email, activity, shareCode]);

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
      <SimpleStateLayout
        emoji="🔍"
        title="Activity not found"
        subtitle="This link may have expired or the activity was removed."
        platform={platform}
        shareCode={shareCode}
      />
    );
  }

  const ended = isActivityEnded(activity.end_time);
  const deepLink = `konectr://activity/${shareCode}`;
  const emoji = getCategoryEmoji(activity.category);
  const heroPhoto = getHeroPhoto(activity.category);

  // =============================================
  // Ended State
  // =============================================
  if (ended) {
    return (
      <SimpleStateLayout
        emoji="⏰"
        title="This activity has ended"
        subtitle={
          platform === 'android'
            ? 'Konectr is iOS-only for now — get notified when Android launches.'
            : 'Real plans, real people. Download Konectr to see what’s next.'
        }
        platform={platform}
        shareCode={shareCode}
        activityId={activity.id}
      />
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
  const isFull = spotsRemaining <= 0 && activity.max_participants > 0;

  const canSubmit = guestName.trim().length > 0 && phoneNumber.trim().length >= 7;
  const dayLabel = getDayLabel(activity.start_time);

  // =============================================
  // Active Activity — with RSVP
  // =============================================
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* ============ HERO ============ */}
      <div className="relative w-full h-[260px] sm:h-[300px] overflow-hidden">
        <Image
          src={heroPhoto}
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 100vw, 480px"
          className="object-cover"
        />
        {/* Layered scrim — darker at bottom to let title sit cleanly */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/75" />

        {/* Top row: logo pill + tagline */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 z-10">
          <Link href="/" aria-label="Konectr home">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full pl-1.5 pr-2.5 py-1 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                <Image src={LOGO_ICON_ORANGE} alt="Konectr" width={16} height={16} unoptimized />
              </div>
              <span className="text-[11px] font-bold text-[#1F1F1F] tracking-tight">Konectr</span>
            </div>
          </Link>
          <span className="text-[11px] text-white/95 font-medium tracking-wide italic">
            Let&apos;s make it real
          </span>
        </div>

        {/* Bottom: emoji chip + day label + title */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm text-xl ring-1 ring-white/25">
              {emoji}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/90 bg-[#FF774D] px-2 py-0.5 rounded">
              {dayLabel}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight font-[family-name:var(--font-heading)] line-clamp-2 drop-shadow-sm">
            {activity.title}
          </h1>
        </div>
      </div>

      {/* ============ BODY ============ */}
      <div className="flex-1 px-4 -mt-4 pb-8 relative z-10">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl shadow-black/[0.06] overflow-hidden">
          <div className="p-5">
            {/* Activity meta — datetime card on right, other details on left */}
            <div className="flex items-stretch gap-3">
              <div className="flex-1 min-w-0 space-y-2.5 text-sm text-[#1F1F1F]">
                {activity.venue_name && (
                  <MetaRow icon="📍" iconColor="#FF774D">
                    {activity.venue_name}
                  </MetaRow>
                )}
                <MetaRow icon="👤">
                  Hosted by <strong className="font-semibold">{activity.creator_name}</strong>
                </MetaRow>
                <MetaRow icon="👥">
                  {isFull ? (
                    <span className="text-[#E53E3E] font-semibold">Activity is full</span>
                  ) : activity.max_participants > 0 ? (
                    <span><strong className="font-semibold">{spotsRemaining}</strong> of {activity.max_participants} spots left</span>
                  ) : (
                    <span>Open · <strong className="font-semibold">{participantCount}</strong> joined</span>
                  )}
                </MetaRow>
              </div>

              {/* Datetime card — bigger, visible, hard to miss */}
              <div className="shrink-0 flex flex-col items-center justify-center bg-white border-2 border-[#F0F0F0] rounded-2xl px-4 py-3 min-w-[112px] text-center">
                <span className="text-[12px] font-semibold text-[#555] leading-tight">
                  {getRelativeDayPhrase(activity.start_time)}
                </span>
                <span className="text-[11px] text-[#999] mt-0.5 leading-tight">
                  {formatShortDate(activity.start_time)}
                </span>
                <span className="text-[16px] font-bold text-[#FF774D] mt-1.5 leading-none tabular-nums">
                  {formatTime(activity.start_time)}
                </span>
              </div>
            </div>

            {/* Description */}
            {activity.description && activity.description !== activity.title && (
              <p className="mt-4 pt-4 border-t border-[#F0F0F0] text-sm text-[#555] leading-relaxed">
                {activity.description}
              </p>
            )}

            {/* Social proof — preview shows latest 2 signups; tap to expand full list */}
            {(participantNames.length > 0 || messageCount > 0) && (
              <div className="mt-4 pt-4 border-t border-[#F0F0F0] space-y-2">
                {participantNames.length > 0 && (() => {
                  const previewNames = participantNames.slice(0, 2);
                  const extraCount = participantCount - previewNames.length;
                  const verb = participantCount === 1 ? 'is in' : 'are in';
                  // Only show the chevron if there's more than the preview reveals
                  const expandable = participantNames.length > previewNames.length || extraCount > 0;
                  return (
                    <div>
                      <button
                        type="button"
                        onClick={() => expandable && setShowAllParticipants((v) => !v)}
                        disabled={!expandable}
                        aria-expanded={expandable ? showAllParticipants : undefined}
                        className={`flex items-start gap-2.5 w-full text-left ${expandable ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        <span className="text-base shrink-0 leading-none mt-0.5">🙋</span>
                        <p className="flex-1 text-sm text-[#555] leading-relaxed">
                          <strong className="text-[#1F1F1F] font-semibold">{previewNames.join(', ')}</strong>
                          {extraCount > 0 && (
                            <span> and {extraCount} more</span>
                          )}
                          {' '}<span className="text-[#999]">{verb}</span>
                        </p>
                        {expandable && (
                          <ChevronDownIcon className={`shrink-0 mt-0.5 text-[#999] transition-transform duration-200 ${showAllParticipants ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                      {showAllParticipants && (
                        <ul className="mt-3 ml-7 space-y-1.5">
                          {participantNames.map((name, i) => (
                            <li key={`${name}-${i}`} className="flex items-center gap-2 text-sm text-[#1F1F1F]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF774D] shrink-0" />
                              {name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })()}
                {messageCount > 0 && (
                  <div className="flex items-center gap-2.5">
                    <span className="text-base shrink-0">💬</span>
                    <p className="text-xs text-[#777]">
                      <strong className="text-[#555] font-semibold">{messageCount}</strong> {messageCount === 1 ? 'message' : 'messages'} in chat
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ============ RSVP ============ */}
            {rsvpState === 'loading' ? (
              <div className="mt-5 pt-5 border-t border-[#F0F0F0]">
                <div className="h-12 bg-[#F5F5F5] rounded-xl animate-pulse" />
              </div>
            ) : rsvpState === 'post-rsvp' && storedRsvp ? (
              // ============ POST-RSVP ============
              <div className="mt-5 pt-5 border-t border-[#F0F0F0]">
                {/* Confirmation */}
                <div className="bg-gradient-to-br from-[#F0FFF4] to-[#E6F9EC] border border-[#C6F0D5] rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#22A05B] flex items-center justify-center shrink-0">
                      <CheckIcon />
                    </div>
                    <div>
                      <p className="font-bold text-[#1F1F1F] leading-tight">You&apos;re in, {storedRsvp.guestName}</p>
                      <p className="text-xs text-[#557A66] mt-0.5">Your spot is reserved</p>
                    </div>
                  </div>
                </div>

                {/* Activity Chatter — web chat panel */}
                <div className="mb-4">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-[#999] mb-2 px-1">
                    Activity Chatter
                  </p>
                  <WebChatPanel
                    claimToken={storedRsvp.claimToken}
                    guestName={storedRsvp.guestName}
                  />
                </div>

                {/* Download / Android Waitlist CTA */}
                {platform === 'android' ? (
                  <AndroidWaitlistCTA shareCode={shareCode} activityId={activity.id} />
                ) : (
                  <div className="bg-gradient-to-br from-[#FFF8F5] to-[#FFEFE6] border border-[#FFD9C7] rounded-xl p-4 text-center">
                    <p className="text-xs text-[#5A4438] font-medium mb-3 leading-relaxed">
                      Get reminded, see who&apos;s coming, and join the chat
                    </p>
                    <a
                      {...getSmartDownloadProps(shareCode)}
                      className="inline-flex items-center justify-center gap-2 w-full bg-[#1F1F1F] text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-sm"
                    >
                      <AppleIcon />
                      Download Konectr
                    </a>
                  </div>
                )}

                {/* Open in app (iOS/desktop) */}
                {platform !== 'android' && (
                  <div className="text-center mt-3">
                    <a
                      href={deepLink}
                      className="inline-flex items-center gap-1.5 text-[#FF774D] font-semibold text-xs hover:underline"
                    >
                      Already have the app? Open in Konectr
                      <ExternalIcon />
                    </a>
                  </div>
                )}

                {/* Claim code — quiet fallback */}
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
              // ============ PRE-RSVP ============
              <div className="mt-5 pt-5 border-t border-[#F0F0F0]">
                {isFull ? (
                  <div className="text-center">
                    {platform === 'android' ? (
                      <AndroidWaitlistCTA shareCode={shareCode} activityId={activity.id} />
                    ) : (
                      <>
                        <p className="text-sm text-[#555] mb-3">
                          This one&apos;s full — find another that fits.
                        </p>
                        <DownloadButton shareCode={shareCode} />
                        <OpenInApp deepLink={deepLink} />
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Name input — focal */}
                    <label htmlFor="guest-name" className="block text-[11px] uppercase tracking-wider font-semibold text-[#999] mb-2">
                      Reserve your spot
                    </label>
                    <input
                      id="guest-name"
                      type="text"
                      placeholder="Your first name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleRsvp()}
                      maxLength={50}
                      autoComplete="given-name"
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E5E5] text-[15px] text-[#1F1F1F] placeholder:text-[#BBB] focus:outline-none focus:border-[#FF774D] focus:ring-4 focus:ring-[#FF774D]/10 transition-all mb-3"
                    />

                    {/* Phone — required (links your RSVP + chat) */}
                    <div className="flex gap-1.5 mb-1.5">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-[88px] shrink-0 px-2 py-3 rounded-xl border-2 border-[#E5E5E5] bg-white text-sm text-[#1F1F1F] focus:outline-none focus:border-[#FF774D] focus:ring-2 focus:ring-[#FF774D]/15 transition-all appearance-none"
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
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleRsvp()}
                        autoComplete="tel-national"
                        required
                        aria-required="true"
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-[#E5E5E5] bg-white text-[15px] text-[#1F1F1F] placeholder:text-[#BBB] focus:outline-none focus:border-[#FF774D] focus:ring-4 focus:ring-[#FF774D]/10 transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-[#999] px-0.5 mb-3">
                      Never shared publicly. Used to link your RSVP and chat.
                    </p>

                    {/* Optional email disclosure — 1 click */}
                    {!showOptional ? (
                      <button
                        type="button"
                        onClick={() => setShowOptional(true)}
                        className="w-full text-left text-xs text-[#777] hover:text-[#FF774D] transition-colors mb-3 inline-flex items-center gap-1.5 py-1"
                      >
                        <span className="text-[#BBB]">+</span>
                        Add email <span className="text-[#BBB]">(get a reminder before it starts)</span>
                      </button>
                    ) : (
                      <div className="mb-3 p-3 bg-[#FAFAFA] rounded-xl">
                        <input
                          id="guest-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="Email — get a reminder"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleRsvp()}
                          maxLength={254}
                          className="w-full px-3 py-2.5 rounded-lg border border-[#E5E5E5] bg-white text-sm text-[#1F1F1F] placeholder:text-[#BBB] focus:outline-none focus:border-[#FF774D] focus:ring-2 focus:ring-[#FF774D]/15 transition-all"
                        />
                        <p className="text-[10px] text-[#999] px-0.5 mt-1.5">
                          Optional. Never shared — only to send your reminder.
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      onClick={handleRsvp}
                      disabled={!canSubmit || isSubmitting}
                      className="w-full px-4 py-3.5 bg-[#FF774D] text-white rounded-xl text-[15px] font-bold hover:bg-[#E5693F] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all shadow-sm shadow-[#FF774D]/30"
                    >
                      {isSubmitting ? (
                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin align-middle" />
                      ) : (
                        "I'm In"
                      )}
                    </button>

                    {error && (
                      <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
                    )}

                    {/* Or download */}
                    <div className="flex items-center gap-2 mt-5 mb-3">
                      <div className="flex-1 h-px bg-[#F0F0F0]" />
                      <span className="text-[10px] uppercase tracking-wider text-[#BBB]">or</span>
                      <div className="flex-1 h-px bg-[#F0F0F0]" />
                    </div>

                    {platform === 'android' ? (
                      <AndroidWaitlistCTA shareCode={shareCode} activityId={activity.id} />
                    ) : (
                      <>
                        <a
                          {...getSmartDownloadProps(shareCode)}
                          className="flex items-center justify-center gap-2 w-full bg-[#1F1F1F] text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
                        >
                          <AppleIcon />
                          Download Konectr
                        </a>
                        <OpenInApp deepLink={deepLink} />
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

// =============================================
// Shared Sub-Components
// =============================================

function MetaRow({ icon, iconColor, children }: { icon: string; iconColor?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span
        className="w-5 text-center text-sm shrink-0"
        style={iconColor ? { color: iconColor } : { color: '#999' }}
      >
        {icon}
      </span>
      <span className="truncate text-[#1F1F1F]">{children}</span>
    </div>
  );
}

function SimpleStateLayout({
  emoji,
  title,
  subtitle,
  platform,
  shareCode,
  activityId,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  platform: Platform | null;
  shareCode: string;
  activityId?: string;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#FFF5F2] flex items-center justify-center">
            <Image src={LOGO_ICON_ORANGE} alt="Konectr" width={20} height={20} unoptimized />
          </div>
          <span className="text-base font-bold text-[#1F1F1F]">Konectr</span>
        </Link>
        <div className="mb-6">
          <div className="text-5xl mb-3">{emoji}</div>
          <h1 className="text-xl font-bold text-[#1F1F1F] mb-2">{title}</h1>
          <p className="text-[#666] text-sm leading-relaxed">{subtitle}</p>
        </div>
        {platform === 'android' ? (
          <AndroidWaitlistCTA shareCode={shareCode} activityId={activityId} />
        ) : (
          <DownloadButton shareCode={shareCode} />
        )}
      </div>
      <Footer />
    </div>
  );
}

function DownloadButton({ shareCode }: { shareCode: string }) {
  return (
    <a
      {...getSmartDownloadProps(shareCode)}
      className="inline-flex items-center gap-2 bg-[#1F1F1F] text-white py-2.5 px-5 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
    >
      <AppleIcon />
      Download Konectr
    </a>
  );
}

function OpenInApp({ deepLink }: { deepLink: string }) {
  return (
    <div className="mt-3 text-center">
      <a
        href={deepLink}
        className="inline-flex items-center gap-1.5 text-[#FF774D] font-semibold text-xs hover:underline"
      >
        Already have the app? Open in Konectr
        <ExternalIcon />
      </a>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function Footer() {
  return (
    <p className="mt-6 text-center text-[#999] text-xs">
      <Link href="/" className="hover:text-[#FF774D]">konectr.app</Link> · Let&apos;s make it real
    </p>
  );
}
