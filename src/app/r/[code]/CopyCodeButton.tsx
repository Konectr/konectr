'use client';

// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// "Copy code" for the /r/[code] referral landing.
//
// A referral link cannot carry its code through an app install: the
// konectr://referral/{code} deep link only fires when the app is already on
// the phone, and there is no deferred deep link on either store. The path
// that does work is the recipient pasting the 6-character code into the
// app's "Have an invite code?" field on the first signup screen, so this
// button exists to make that path one tap. Clipboard API first; a hidden
// textarea + execCommand fallback covers older in-app browsers (WhatsApp,
// Instagram), which is where most referral taps land.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

const COPIED_RESET_MS = 2000;

type CopyState = 'idle' | 'copied' | 'failed';

// Legacy path for WebViews without navigator.clipboard, or where the call
// rejects outside a secure context. Selects the text in an off-screen
// textarea and asks the browser to copy the selection.
function copyViaExecCommand(text: string): boolean {
  if (typeof document === 'undefined') return false;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  // iOS Safari ignores select() on a readonly field without an explicit range.
  textarea.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or insecure context: fall through to the legacy path.
    }
  }
  return copyViaExecCommand(text);
}

// Same defensive shape as smartLink.ts: tracking must never block the copy.
function trackCopy(code: string, ok: boolean) {
  try {
    window.posthog?.capture('referral_code_copied', { referral_code: code, ok });
  } catch {
    // ignore
  }
}

interface Props {
  code: string;
}

export default function CopyCodeButton({ code }: Props) {
  const [state, setState] = useState<CopyState>('idle');
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const ok = await copyText(code);
    trackCopy(code, ok);
    setState(ok ? 'copied' : 'failed');
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setState('idle'), COPIED_RESET_MS);
  }, [code]);

  const label =
    state === 'copied' ? 'Copied' : state === 'failed' ? 'Could not copy' : 'Copy code';

  return (
    <div>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 w-full bg-[#FF774D] text-white py-3 px-4 rounded-lg text-sm font-bold hover:bg-[#E5693F] active:scale-[0.98] transition-colors"
      >
        {state === 'copied' ? (
          <Check className="w-4 h-4" aria-hidden />
        ) : (
          <Copy className="w-4 h-4" aria-hidden />
        )}
        <span aria-live="polite">{label}</span>
      </button>
      {state === 'failed' && (
        <p className="text-[#666] text-xs mt-2">
          Long-press the code above to copy it.
        </p>
      )}
    </div>
  );
}
