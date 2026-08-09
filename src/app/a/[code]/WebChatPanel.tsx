'use client';

// © Konectr 2026. All rights reserved.
// Activity Chatter web panel for post-RSVP guests.
// Polls /api/chat/history every 15s, sends via /api/chat/send.
// 5-message cap per RSVP enforced server-side.

import { useState, useEffect, useCallback, useRef } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  sender_display_name: string;
  is_from_web: boolean;
  is_self: boolean;
  created_at: string;
  /** 'text' or 'image'. Photos are shown as a locked placeholder — guests have
   *  no account, so the storage bucket refuses them by design. */
  message_type?: string;
  /** Number of photos the bubble stands for. 0 once the app's nightly purge
   *  has removed them (activity photos are deleted when the chat closes). */
  photo_count?: number | null;
}

interface HistoryResponse {
  messages: ChatMessage[];
  messages_sent: number;
  messages_remaining: number;
}

interface Props {
  claimToken: string;
  guestName: string;
}

const POLL_INTERVAL_MS = 3_000;

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
}

export default function WebChatPanel({ claimToken, guestName }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesRemaining, setMessagesRemaining] = useState<number>(10);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_token: claimToken }),
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data: HistoryResponse = await res.json();
      // RPC returns messages ASC (oldest first, newest last) — render as-is so
      // newest appears at the bottom and auto-scroll lands on latest.
      setMessages(data.messages);
      setMessagesRemaining(data.messages_remaining);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [claimToken]);

  // Initial load + poll
  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadHistory]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_token: claimToken, content }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send');
        return;
      }

      setInput('');
      setMessagesRemaining(data.messages_remaining ?? messagesRemaining - 1);
      // Refresh to pick up the new message
      loadHistory();
    } catch {
      setError('Network error — please try again');
    } finally {
      setSending(false);
    }
  }, [input, sending, claimToken, messagesRemaining, loadHistory]);

  const capReached = messagesRemaining <= 0;

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
      {/* Header */}
      <div className="bg-[#FFF5F2] px-4 py-2.5 border-b border-[#F0F0F0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">💬</span>
          <span className="text-xs font-bold text-[#1F1F1F]">Activity Chatter</span>
        </div>
        <span className="text-[10px] text-[#999]">
          {capReached ? 'Limit reached' : `${messagesRemaining} left`}
        </span>
      </div>

      {/* Message list */}
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto px-3 py-2 bg-[#FAFAFA]"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-[#999]">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-xs text-[#999]">
              No messages yet. Say hi to {guestName ? 'the group' : 'everyone'}!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.is_self ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-xl ${
                    m.is_self
                      ? 'bg-[#FF774D] text-white'
                      : 'bg-white border border-[#F0F0F0] text-[#1F1F1F]'
                  }`}
                >
                  {!m.is_self && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-[#FF774D]">
                        {m.sender_display_name}
                      </span>
                      {m.is_from_web && (
                        <span className="text-[8px] font-semibold uppercase tracking-wider text-[#FF774D] bg-[#FFE5D6] px-1 py-0.5 rounded">
                          via web
                        </span>
                      )}
                    </div>
                  )}
                  {m.message_type === 'image' ? (
                    <PhotoPlaceholder
                      count={m.photo_count ?? 0}
                      caption={m.content}
                      onDark={m.is_self}
                    />
                  ) : (
                    <div className="text-sm leading-snug whitespace-pre-wrap break-words">
                      {m.content}
                    </div>
                  )}
                  <div
                    className={`text-[9px] mt-1 ${
                      m.is_self ? 'text-white/70' : 'text-[#BBB]'
                    }`}
                  >
                    {formatTime(m.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-[#F0F0F0] p-2">
        {capReached ? (
          <div className="text-center py-2">
            <p className="text-xs text-[#666] mb-1">You&apos;ve used all 10 messages</p>
            <p className="text-[10px] text-[#999]">
              Get unlimited chat in the Konectr Android app (coming soon)
            </p>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              maxLength={1000}
              disabled={sending}
              className="flex-1 px-3 py-2 rounded-lg border border-[#E5E5E5] text-sm text-[#1F1F1F] placeholder:text-[#BBB] focus:outline-none focus:border-[#FF774D] focus:ring-1 focus:ring-[#FF774D] disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="px-4 py-2 bg-[#FF774D] text-white rounded-lg text-sm font-bold hover:bg-[#E5693F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? '...' : 'Send'}
            </button>
          </div>
        )}
        {error && <p className="text-[10px] text-red-500 mt-1 text-center">{error}</p>}
      </div>
    </div>
  );
}

/**
 * What a photo message looks like to someone without the app.
 *
 * Guests are anonymous, and the chat-images bucket only answers to signed-in
 * members of the conversation — so there is genuinely nothing to show them.
 * Rather than hiding the message (which is what happened before, and left a
 * guest with no idea photos had been shared), the gap becomes the install
 * prompt the whole web-RSVP funnel exists to create.
 *
 * A count of 0 means the photos have already expired: activity photos are
 * deleted when the chat closes, so "get the app" would be a lie.
 */
function PhotoPlaceholder({
  count,
  caption,
  onDark,
}: {
  count: number;
  caption: string;
  onDark: boolean;
}) {
  const expired = count === 0;
  // The server writes "📷 Photo" / "📷 N photos" into content when nobody typed
  // a caption; showing that as if it were a caption reads as someone's words.
  const hasCaption = caption && !caption.startsWith('📷 ');

  return (
    <div className="text-sm leading-snug">
      <div
        className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${
          onDark
            ? 'bg-white/15 text-white'
            : 'bg-[#FFF4F1] text-[#1F1F1F] border border-[#FFD9CD]'
        }`}
      >
        <span aria-hidden="true" className="text-base leading-none">
          {expired ? '🖼' : '🔒'}
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold">
            {expired
              ? 'Photo no longer available'
              : count > 1
                ? `${count} photos shared in this chat`
                : 'Photo shared in this chat'}
          </div>
          <div className={`text-[10px] ${onDark ? 'text-white/75' : 'text-[#8A8A8A]'}`}>
            {expired ? 'Removed when this chat closed' : 'Get the app to view'}
          </div>
        </div>
      </div>
      {hasCaption && (
        <div className="mt-1 whitespace-pre-wrap break-words">{caption}</div>
      )}
    </div>
  );
}
