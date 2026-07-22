'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { useState, useEffect, useCallback } from 'react';
import type { SharedActivity } from '@/lib/supabase';
import { getActivityRsvpTeaser, type RsvpTeaserResponse } from '@/lib/supabase';
import { detectPlatform, getSmartProfileLinkProps, type Platform } from '@/lib/smartLink';
import {
  formatTime,
  getRelativeDayPhrase,
  formatShortDate,
  isActivityEnded,
} from '@/lib/datetime';
import {
  getStoredRsvp,
  storeRsvp,
  removeStoredRsvp,
  getStoredUserProfile,
  storeUserProfile,
  type StoredRsvp,
} from '@/lib/rsvpStorage';
import { countryCodes } from './countryCodes';
import AndroidWaitlistCTA from './AndroidWaitlistCTA';
import TestFlightRequestCTA from './TestFlightRequestCTA';
import WebChatPanel from './WebChatPanel';
import { resolveVibe } from './redesign/vibes';
import { activityImage } from './redesign/activity-images';
import RsvpLayout from './redesign/RsvpLayout';
import ClaimScreen from './redesign/ClaimScreen';
import ChattingScreen from './redesign/ChattingScreen';
import WithdrawSheet from './redesign/WithdrawSheet';
import SimpleStateLayout from './redesign/SimpleStateLayout';
import OpenInApp from './redesign/OpenInApp';

interface Props {
  activity: SharedActivity | null;
  shareCode: string;
  // Inside the 3h cutoff → late withdrawal? Computed server-side (render-pure);
  // the spot is always released, RPC stays authoritative.
  isLate?: boolean;
}

export default function ActivityRsvpPage({ activity, shareCode, isLate = false }: Props) {
  const [rsvpState, setRsvpState] = useState<'loading' | 'pre-rsvp' | 'post-rsvp'>('loading');
  const [storedRsvp, setStoredRsvp] = useState<StoredRsvp | null>(null);
  // True only for the session in which the claim was submitted — a refresh
  // remounts the page and restores from localStorage with this false, so the
  // celebration banner shows once, not on every return visit.
  const [justClaimed, setJustClaimed] = useState(false);
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
  // Withdraw-my-RSVP flow — spot always released; 3h cutoff (late) enforced server-side.
  const [cancelPhase, setCancelPhase] = useState<
    'idle' | 'confirming' | 'working' | 'withdrawn' | 'error'
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

      setJustClaimed(true);
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
  // Host row: tap tries the app profile, falls back to store/waitlist sign-up.
  const creatorLink = activity.user_id ? getSmartProfileLinkProps(activity.user_id) : null;

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
  // the "Here for…" purpose lives in details (description is legacy, empty since
  // build 38); hero image keys to the activity. ──
  const purposeText = activity.details || activity.description;
  const vibe = resolveVibe(activity.category);
  const posterPhoto = activityImage({
    vibe: vibe.key,
    venueName: activity.venue_name,
    title: activity.title,
    purpose: purposeText,
    category: activity.category,
  });
  const heading = activity.venue_name || activity.title;
  const venueShort = activity.venue_name || activity.title;
  const purpose = purposeText && purposeText !== activity.title ? purposeText : null;
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
          venueLat={activity.location_lat}
          venueLng={activity.location_lng}
          guestName={storedRsvp.guestName}
          justClaimed={justClaimed}
          crewNames={participantNames}
          crewTotal={participantCount}
          creatorName={activity.creator_name}
          creatorPhotoUrl={activity.creator_photo_url}
          creatorLinkHref={creatorLink?.href}
          onCreatorLinkClick={creatorLink?.onClick}
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
            isLate={isLate}
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
      venueLat={activity.location_lat}
      venueLng={activity.location_lng}
      crewNames={participantNames}
      crewTotal={participantCount}
      spotsLeft={spotsLeft}
      creatorName={activity.creator_name}
      creatorPhotoUrl={activity.creator_photo_url}
      creatorLinkHref={creatorLink?.href}
      onCreatorLinkClick={creatorLink?.onClick}
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
