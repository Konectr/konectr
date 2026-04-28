// © Konectr 2026. All rights reserved.
// One-click unsubscribe handler. Reads ?token= UUID, calls unsubscribe_by_token RPC.
// Flips email_notifications_enabled = FALSE on match. Token is opaque + per-user (UUID v4).

import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const metadata = {
  title: 'Unsubscribe · Konectr',
  description: 'Manage your Konectr email preferences.',
  robots: { index: false, follow: false },
};

interface UnsubscribeResult {
  success: boolean;
  email?: string;
  error?: string;
}

async function unsubscribe(token: string): Promise<UnsubscribeResult> {
  const { data, error } = await supabase.rpc('unsubscribe_by_token', {
    p_token: token,
  });

  if (error) {
    return { success: false, error: 'rpc_error' };
  }
  return data as UnsubscribeResult;
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  let result: UnsubscribeResult = { success: false, error: 'missing_token' };
  if (token && /^[0-9a-f-]{36}$/i.test(token)) {
    result = await unsubscribe(token);
  }

  return (
    <main style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1F1F1F', textAlign: 'center' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {result.success ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <h1 style={{ color: '#FF774D', fontSize: 24, margin: '0 0 12px' }}>You&apos;re unsubscribed</h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#444' }}>
              {result.email
                ? <>We won&apos;t send marketing emails to <strong>{result.email}</strong> anymore.</>
                : <>We won&apos;t send you marketing emails anymore.</>}
            </p>
            <p style={{ fontSize: 14, color: '#888', marginTop: 24 }}>
              You&apos;ll still get critical account emails (security, account changes).
            </p>
            <p style={{ fontSize: 14, marginTop: 24 }}>
              Changed your mind? Re-enable email in the Konectr app under <strong>Profile → Notification Settings</strong>.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>ⓘ</div>
            <h1 style={{ color: '#FF774D', fontSize: 24, margin: '0 0 12px' }}>Link expired or invalid</h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#444' }}>
              This unsubscribe link isn&apos;t valid. It may have been used already or copied incorrectly.
            </p>
            <p style={{ fontSize: 14, marginTop: 24 }}>
              You can manage email preferences in the Konectr app under <strong>Profile → Notification Settings</strong>, or email{' '}
              <a href="mailto:hello@konectr.app" style={{ color: '#FF774D' }}>hello@konectr.app</a> for help.
            </p>
          </>
        )}
        <div style={{ marginTop: 32 }}>
          <Link href="/" style={{ color: '#888', fontSize: 14, textDecoration: 'underline' }}>
            Back to konectr.app
          </Link>
        </div>
      </div>
    </main>
  );
}
