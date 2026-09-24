// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// Clipboard write that survives the in-app browsers (WhatsApp, Instagram)
// where most share links open: Clipboard API first, hidden-textarea
// execCommand fallback where the API is missing or rejects outside a
// secure context. Same pattern as /r/[code]/CopyCodeButton.tsx, which
// proved it for the referral code.

// Legacy path for WebViews without navigator.clipboard, or where the call
// rejects. Selects the text in an off-screen textarea and asks the browser
// to copy the selection.
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

export async function copyText(text: string): Promise<boolean> {
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
