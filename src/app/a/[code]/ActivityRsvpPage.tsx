'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SharedActivity } from '@/lib/supabase';
import { getActivityRsvpTeaser, type RsvpTeaserResponse } from '@/lib/supabase';
import { detectPlatform, type Platform } from '@/lib/smartLink';
import AndroidWaitlistCTA from './AndroidWaitlistCTA';
import TestFlightRequestCTA from './TestFlightRequestCTA';
import WebChatPanel from './WebChatPanel';
import { resolveVibe } from './redesign/vibes';
import { activityImage } from './redesign/activity-images';
import RsvpLayout from './redesign/RsvpLayout';
import ClaimScreen from './redesign/ClaimScreen';
import ChattingScreen from './redesign/ChattingScreen';
import WithdrawSheet from './redesign/WithdrawSheet';

// Brand assets
const LOGO_ICON_ORANGE = '/logos/konectr-icon-orange.svg';

// Country codes (synced with mobile: auth_constants.dart)
const countryCodes = [
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+1', name: 'USA', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
];

// Konectr is Malaysia-only: every activity time is displayed in Asia/Kuala_Lumpur
// (fixed GMT+8, no DST), regardless of the viewer's device TZ or the render server
// (Vercel = UTC). Stored start_time/end_time are true UTC — we always format them in MYT.
const MYT_TZ = 'Asia/Kuala_Lumpur';
const MYT_OFFSET_MS = 8 * 60 * 60 * 1000;

// Returns a Date whose getUTC* fields read the Asia/KL wall-clock of `instant`, so
// day-boundary / hour arithmetic below can use getUTC* deterministically (no DST in MY).
function asMyt(instant: Date): Date {
  return new Date(instant.getTime() + MYT_OFFSET_MS);
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: MYT_TZ,
  });
}

// Natural-language relative day for the datetime card — "Tonight", "Tomorrow",
// "This Friday", "Next Wednesday", or the bare weekday for activities ≥2 weeks out (all MYT).
function getRelativeDayPhrase(dateString: string): string {
  const d = asMyt(new Date(dateString));
  const now = asMyt(new Date());
  const startOfToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const target = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const diffDays = Math.round((target - startOfToday) / 86_400_000);

  if (diffDays <= 0) return d.getUTCHours() >= 17 ? 'Tonight' : 'Today';
  if (diffDays === 1) return 'Tomorrow';
  const weekday = new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', timeZone: MYT_TZ });
  if (diffDays <= 6) return `This ${weekday}`;
  if (diffDays <= 13) return `Next ${weekday}`;
  return weekday;
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', timeZone: MYT_TZ,
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

function removeStoredRsvp(shareCode: string): void {
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
  // Within the 24h lockout? Computed server-side (render-pure); RPC stays authoritative.
  withinLock?: boolean;
}

export default function ActivityRsvpPage({ activity, shareCode, withinLock = false }: Props) {
  const [rsvpState, setRsvpState] = useState<'loading' | 'pre-rsvp' | 'post-rsvp'>('loading');
  const [storedRsvp, setStoredRsvp] = useState<StoredRsvp | null>(null);
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+60');
  const [email, setEmail] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [teaserData, setTeaserData] = useState<RsvpTeaserResponse | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  // Cancel-my-RSVP flow (24h lockout enforced server-side)
  const [cancelPhase, setCancelPhase] = useState<
    'idle' | 'confirming' | 'working' | 'withdrawn' | 'flagged' | 'error'
  >('idle');
  const [cancelError, setCancelError] = useState<string | null>(null);

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

  const handleCancelRsvp = useCallback(async () => {
    if (!storedRsvp) return;
    setCancelPhase('working');
    setCancelError(null);
    try {
      const res = await fetch('/api/rsvp/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_token: storedRsvp.claimToken }),
      });
      const data = await res.json();

      if (data?.outcome === 'withdrawn' || data?.outcome === 'already_withdrawn') {
        removeStoredRsvp(shareCode);
        setCancelPhase('withdrawn');
        if (activity) getActivityRsvpTeaser(activity.id).then((d) => d && setTeaserData(d));
      } else if (data?.outcome === 'flagged_locked') {
        setCancelPhase('flagged');
      } else {
        setCancelError((data && data.error) || 'Something went wrong. Please try again.');
        setCancelPhase('error');
      }
    } catch {
      setCancelError('Network error. Please try again.');
      setCancelPhase('error');
    }
  }, [storedRsvp, shareCode, activity]);

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
            : 'Real plans, real people. Join the Konectr beta to see what’s next.'
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
  const spotsRemaining = teaserData?.spots_remaining
    ?? (activity.max_participants > 0 ? activity.max_participants - participantCount : -1);
  const isFull = spotsRemaining <= 0 && activity.max_participants > 0;

  const canSubmit = guestName.trim().length > 0 && phoneNumber.trim().length >= 7;

  // ── Redesign props (Kinetic system). Heading auto = venue name (no host role);
  // the "Here for…" purpose is the description; hero image keys to the activity. ──
  const vibe = resolveVibe(activity.category);
  const posterPhoto = activityImage({
    vibe: vibe.key,
    venueName: activity.venue_name,
    title: activity.title,
    purpose: activity.description,
    category: activity.category,
  });
  const heading = activity.venue_name || activity.title;
  const venueShort = activity.venue_name || activity.title;
  const purpose = activity.description && activity.description !== activity.title ? activity.description : null;
  const timeLabel = formatTime(activity.start_time);
  const whenDay = `${getRelativeDayPhrase(activity.start_time)} · ${formatShortDate(activity.start_time)}`;
  const spotsLeft = isFull || activity.max_participants <= 0 ? 0 : spotsRemaining;

  const handleAddToCalendar = () => {
    if (typeof window !== 'undefined') window.open(`/api/calendar/${shareCode}`, '_blank');
  };
  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: heading, url }); } catch { /* dismissed */ }
    } else {
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* no clipboard */ }
    }
  };

  // Platform-aware download / beta CTA reused across states.
  const platformCta = (variant: 'full' | 'compact') =>
    platform === 'android'
      ? <AndroidWaitlistCTA shareCode={shareCode} activityId={activity.id} />
      : <TestFlightRequestCTA shareCode={shareCode} activityId={activity.id} variant={variant} />;

  // =============================================
  // Active Activity — Kinetic redesign
  // =============================================

  // Loading → poster paints instantly (activity is server-provided); only the
  // RSVP-vs-chatting decision is pending, so we skeleton the body. Prevents a
  // returning RSVP'd user from flashing the claim form before localStorage reads.
  if (rsvpState === 'loading') {
    return (
      <RsvpLayout vibe={vibe} photo={posterPhoto} venueName={heading}>
        <div className="flex gap-3">
          <div className="flex-1 h-[116px] rounded-[18px] bg-[#F0EEEC] animate-pulse" />
          <div className="flex-1 h-[116px] rounded-[18px] bg-[#F0EEEC] animate-pulse" />
        </div>
        <div className="h-[64px] rounded-[18px] bg-[#F0EEEC] animate-pulse mt-5" />
        <div className="h-[52px] rounded-[13px] bg-[#F0EEEC] animate-pulse mt-6" />
        <div className="h-[52px] rounded-[15px] bg-[#F0EEEC] animate-pulse mt-3" />
      </RsvpLayout>
    );
  }

  // Post-RSVP → chatting (with the withdraw sheet layered above).
  if (rsvpState === 'post-rsvp' && storedRsvp) {
    return (
      <>
        <ChattingScreen
          vibe={vibe}
          photo={posterPhoto}
          venueName={heading}
          purpose={purpose}
          timeLabel={timeLabel}
          dayLabel={whenDay}
          venueShort={venueShort}
          guestName={storedRsvp.guestName}
          crewNames={participantNames}
          crewTotal={participantCount}
          onAddToCalendar={handleAddToCalendar}
          onShare={handleShare}
          onWithdraw={() => setCancelPhase('confirming')}
          chat={<WebChatPanel claimToken={storedRsvp.claimToken} guestName={storedRsvp.guestName} />}
          belowChat={
            <div className="mt-5 space-y-4">
              {platform === 'android' ? (
                <AndroidWaitlistCTA shareCode={shareCode} activityId={activity.id} />
              ) : (
                <div className="bg-[#FFF4F1] border border-[#F3E4DD] rounded-[16px] p-4 text-center">
                  <p className="text-[12.5px] text-[#8A6A5A] font-medium mb-3 leading-relaxed">
                    Get reminded, see who&apos;s coming, and keep chatting in the app
                  </p>
                  <TestFlightRequestCTA shareCode={shareCode} activityId={activity.id} variant="full" />
                  <OpenInApp deepLink={deepLink} />
                </div>
              )}
              {/* Claim code — quiet fallback */}
              <div className="text-center">
                <p className="text-[10px] text-[#BBB] mb-1">Having trouble? Use your claim code</p>
                <button
                  onClick={copyClaimCode}
                  className="text-[12px] font-mono text-[#999] hover:text-[#FF774D] transition-colors"
                >
                  {copied ? 'Copied!' : storedRsvp.claimToken}
                </button>
              </div>
            </div>
          }
        />
        {cancelPhase !== 'idle' && (
          <WithdrawSheet
            phase={cancelPhase}
            withinLock={withinLock}
            venueShort={venueShort}
            errorMessage={cancelError}
            onConfirm={handleCancelRsvp}
            onRetry={handleCancelRsvp}
            onDismiss={() => setCancelPhase('idle')}
            onDone={() => {
              removeStoredRsvp(shareCode);
              setStoredRsvp(null);
              setCancelPhase('idle');
              setRsvpState('pre-rsvp');
            }}
          />
        )}
      </>
    );
  }

  // Pre-RSVP → claim (loading shows the same shell; inputs are simply empty).
  return (
    <ClaimScreen
      vibe={vibe}
      photo={posterPhoto}
      venueName={heading}
      purpose={purpose}
      timeLabel={timeLabel}
      dayLabel={whenDay}
      venueShort={venueShort}
      crewNames={participantNames}
      crewTotal={participantCount}
      spotsLeft={spotsLeft}
      isFull={isFull}
      openInAppHref={platform !== 'android' ? deepLink : undefined}
      fullSlot={
        platform === 'android' ? (
          <AndroidWaitlistCTA shareCode={shareCode} activityId={activity.id} />
        ) : (
          <div className="text-center">
            <p className="text-[14px] text-[#616161] mb-3">This one&apos;s full — grab another that fits.</p>
            {platformCta('compact')}
          </div>
        )
      }
      belowForm={
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-[#EDEBE9]" />
            <span className="text-[10px] uppercase tracking-wider text-[#B5B0AB]">or</span>
            <div className="flex-1 h-px bg-[#EDEBE9]" />
          </div>
          {platformCta('full')}
        </div>
      }
      form={{
        name: guestName,
        onName: setGuestName,
        countryCode,
        onCountryCode: setCountryCode,
        countryCodes,
        phone: phoneNumber,
        onPhone: setPhoneNumber,
        email,
        showEmail: showOptional,
        onShowEmail: () => setShowOptional(true),
        onEmail: setEmail,
        canSubmit,
        isSubmitting,
        error,
        onSubmit: handleRsvp,
      }}
    />
  );

}

// =============================================
// Shared Sub-Components
// =============================================

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
          <TestFlightRequestCTA shareCode={shareCode} activityId={activityId} variant="compact" />
        )}
      </div>
      <Footer />
    </div>
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

function ExternalIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
