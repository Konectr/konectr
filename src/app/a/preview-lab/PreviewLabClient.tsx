// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

// Redesign preview harness — flips between the three RSVP states (claim /
// chatting / withdraw) with mock data so the design can be reviewed without a
// live share code or DB. Not linked; delete before ship.

import { useState } from 'react';
import ClaimScreen from '../[code]/redesign/ClaimScreen';
import ChattingScreen from '../[code]/redesign/ChattingScreen';
import WithdrawSheet, { type WithdrawPhase } from '../[code]/redesign/WithdrawSheet';
import { VIBES } from '../[code]/redesign/vibes';
import { activityImage } from '../[code]/redesign/activity-images';

type StateKey = 'claim' | 'chatting' | 'withdraw';

const COUNTRY_CODES = [
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
];

const MOCK = {
  vibe: VIBES.active,
  photo: activityImage({ vibe: 'active', venueName: 'ASCARO Padel & Social' }),
  venueName: 'ASCARO Padel & Social',
  purpose:
    "A casual padel hit — all levels welcome 🎾 We'll rally a few friendly sets, then head down for drinks after. Got no racket? No stress, there are spares — just shout in the chat.",
  timeLabel: '3:00 PM',
  dayLabel: 'This Sunday · Jul 12',
  venueShort: 'ASCARO Padel',
  areaLabel: 'Bukit Jalil, KL',
  crewNames: ['Julia', 'Pris'],
  crewTotal: 6,
  spotsLeft: 4,
  guestName: 'Dev',
};

export default function PreviewLabClient() {
  const [state, setState] = useState<StateKey>('claim');
  const [withdrawPhase, setWithdrawPhase] = useState<WithdrawPhase | null>(null);
  const [withinLock, setWithinLock] = useState(false);

  // Local form state so the harness is interactive.
  const [name, setName] = useState('');
  const [cc, setCc] = useState('+60');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);

  const form = {
    name, onName: setName,
    countryCode: cc, onCountryCode: setCc, countryCodes: COUNTRY_CODES,
    phone, onPhone: setPhone,
    email, showEmail, onShowEmail: () => setShowEmail(true), onEmail: setEmail,
    canSubmit: name.trim().length > 0 && phone.trim().length >= 7,
    isSubmitting: false,
    error: null,
    onSubmit: () => setState('chatting'),
  };

  return (
    <div className="relative">
      {/* Floating dev switcher */}
      <div className="fixed z-[60] top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full p-1 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] border border-black/5 text-[12px] font-bold">
        {(['claim', 'chatting', 'withdraw'] as StateKey[]).map((s) => (
          <button
            key={s}
            onClick={() => {
              setState(s);
              setWithdrawPhase(s === 'withdraw' ? 'confirming' : null);
            }}
            className={`px-3 py-[6px] rounded-full capitalize transition-colors ${
              state === s ? 'bg-[#FF774D] text-white' : 'text-[#616161] hover:bg-black/5'
            }`}
          >
            {s}
          </button>
        ))}
        <span className="w-px h-4 bg-black/10 mx-1" />
        <button
          onClick={() => setWithinLock((v) => !v)}
          className={`px-3 py-[6px] rounded-full transition-colors ${
            withinLock ? 'bg-[#FFC845] text-[#1F1F1F]' : 'text-[#9E9E9E] hover:bg-black/5'
          }`}
          title="Toggle 24h lockout window"
        >
          {withinLock ? '⏱️ <24h' : '24h off'}
        </button>
      </div>

      {state === 'claim' && <ClaimScreen {...MOCK} form={form} openInAppHref="#" />}

      {(state === 'chatting' || state === 'withdraw') && (
        <ChattingScreen {...MOCK} onWithdraw={() => setWithdrawPhase('confirming')} />
      )}

      {withdrawPhase && (
        <WithdrawSheet
          phase={withdrawPhase}
          withinLock={withinLock}
          venueShort={MOCK.venueShort}
          onConfirm={() => {
            setWithdrawPhase('working');
            setTimeout(() => setWithdrawPhase(withinLock ? 'flagged' : 'withdrawn'), 900);
          }}
          onDismiss={() => {
            setWithdrawPhase(null);
            setState('chatting');
          }}
          onDone={() => {
            setWithdrawPhase(null);
            setState('claim');
          }}
        />
      )}
    </div>
  );
}
