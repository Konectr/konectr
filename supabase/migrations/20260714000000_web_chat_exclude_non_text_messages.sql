-- 2026-07-14 — Web Activity Chatter: show text messages only
--
-- The web RSVP share page (/a/[code]) renders "Activity Chatter" from the
-- get_web_chat_messages RPC. That RPC previously returned EVERY message in the
-- group conversation, so 'system' notices (e.g. "X is no longer attending",
-- posted by cancel_web_rsvp when a guest withdraws) and location pins leaked
-- onto the public page — rendered as normal guest bubbles because the system
-- message carries the cancelled RSVP's web_rsvp_id (so is_from_web=true and
-- sender_display_name = the guest's name).
--
-- Fix: whitelist message_type='text' in the web read path. The in-app mobile
-- group chat is unaffected — it reads the messages table directly, not via this
-- RPC, so members still see join/leave notices in-app.
--
-- NOTE: The canonical home for DB migrations is the konectr mobile repo's
-- supabase/migrations. This copy was applied directly to production
-- (project rsrplvdtbycqcxjlyeju / Konectr-App) via MCP on 2026-07-14 and is
-- mirrored here so the web repo carries a record of the change. Back-port this
-- file into the mobile repo's migration history to keep the two in sync.

CREATE OR REPLACE FUNCTION public.get_web_chat_messages(p_claim_token text, p_limit integer DEFAULT 50)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_rsvp RECORD;
  v_conversation_id UUID;
  v_messages JSONB;
  v_sent_count INT;
BEGIN
  SELECT id, activity_id, guest_name, status INTO v_rsvp
  FROM web_rsvps WHERE claim_token = upper(TRIM(p_claim_token));
  IF v_rsvp IS NULL THEN RAISE EXCEPTION 'Invalid claim token' USING ERRCODE = 'P0001'; END IF;

  SELECT id INTO v_conversation_id FROM conversations
  WHERE activity_id = v_rsvp.activity_id AND conversation_type = 'group' LIMIT 1;

  IF v_conversation_id IS NULL THEN
    RETURN jsonb_build_object('messages', '[]'::jsonb, 'messages_sent', 0, 'messages_remaining', 10);
  END IF;

  -- Cap counter: only the guest's own text sends count toward the 10-message limit.
  SELECT COUNT(*) INTO v_sent_count
  FROM messages WHERE web_rsvp_id = v_rsvp.id AND message_type = 'text';

  SELECT jsonb_agg(row_to_json(m)::jsonb ORDER BY created_at ASC) INTO v_messages
  FROM (
    SELECT m.id, m.content, m.created_at, m.message_type,
      CASE WHEN m.web_rsvp_id IS NOT NULL THEN wr.guest_name
           ELSE COALESCE(p.display_name, 'User') END AS sender_display_name,
      (m.web_rsvp_id IS NOT NULL) AS is_from_web,
      (m.web_rsvp_id = v_rsvp.id) AS is_self
    FROM messages m
    LEFT JOIN profiles p ON p.id = m.sender_id
    LEFT JOIN web_rsvps wr ON wr.id = m.web_rsvp_id
    WHERE m.conversation_id = v_conversation_id
      AND m.message_type = 'text'  -- exclude system notices + location pins from web display
    ORDER BY m.created_at DESC LIMIT p_limit
  ) m;

  RETURN jsonb_build_object(
    'messages', COALESCE(v_messages, '[]'::jsonb),
    'messages_sent', v_sent_count,
    'messages_remaining', GREATEST(0, 10 - v_sent_count)
  );
END; $function$;
