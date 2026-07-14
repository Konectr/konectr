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
  // Only 'text' messages are rendered in the web Activity Chatter. System
  // notices ("X is no longer attending") and location pins are filtered out
  // by the get_web_chat_messages RPC and again in /api/chat/history.
  message_type?: string;
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
                  <div className="text-sm leading-snug whitespace-pre-wrap break-words">
                    {m.content}
                  </div>
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
