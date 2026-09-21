-- Applied to production (Konectr-App) 2026-09-21.
--
-- get_activity_rsvp_teaser built each name with split_part(display_name, ' ', 1).
-- A member who has not finished onboarding has a NULL display_name, and
-- split_part(NULL, …) is NULL, which jsonb_agg keeps as a JSON null element.
-- The /a/[code] web page rendered initials from that array and died on
-- null.trim() -- one un-onboarded member took the whole share page down
-- (share code E34220B0).
--
-- Names are now normalised and unnamed people are filtered OUT of the name
-- list. They remain in participant_count, so the UI still reads
-- "Mai, Tania & 2 more are in" -- counted, just not named.

CREATE OR REPLACE FUNCTION public.get_activity_rsvp_teaser(p_activity_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_activity RECORD;
  v_participant_names JSONB;
  v_total_count INT;
  v_creator_name TEXT;
  v_message_count INT;
BEGIN
  SELECT id, max_participants, current_participants, user_id
  INTO v_activity
  FROM user_availability
  WHERE id = p_activity_id;

  IF v_activity IS NULL THEN
    RETURN jsonb_build_object('error', 'Activity not found');
  END IF;

  -- current_participants is already trigger-maintained as (in-app + pending web).
  -- Do NOT add the pending web count again here, or it double-counts web RSVPs.
  v_total_count := COALESCE(v_activity.current_participants, 0);

  SELECT NULLIF(TRIM(split_part(COALESCE(display_name, ''), ' ', 1)), '')
  INTO v_creator_name
  FROM profiles
  WHERE id = v_activity.user_id;

  -- All participant names, ordered by signup recency (most recent first).
  -- FILTER drops anyone without a usable name rather than emitting a JSON null.
  SELECT jsonb_agg(name ORDER BY signed_up_at DESC) FILTER (WHERE name IS NOT NULL)
  INTO v_participant_names
  FROM (
    SELECT NULLIF(TRIM(split_part(COALESCE(p.display_name, ''), ' ', 1)), '') AS name,
           ap.joined_at AS signed_up_at
    FROM activity_participants ap
    JOIN profiles p ON p.id = ap.user_id
    WHERE ap.activity_id = p_activity_id AND ap.status IN ('confirmed', 'joined')
    UNION ALL
    SELECT NULLIF(TRIM(COALESCE(wr.guest_name, '')), '') AS name,
           wr.created_at AS signed_up_at
    FROM web_rsvps wr
    WHERE wr.activity_id = p_activity_id AND wr.status = 'pending'
  ) sub;

  SELECT COUNT(*) INTO v_message_count
  FROM messages m
  JOIN conversations c ON c.id = m.conversation_id
  WHERE c.activity_id = p_activity_id
    AND c.conversation_type = 'group';

  RETURN jsonb_build_object(
    'participant_count', v_total_count,
    'participant_names', COALESCE(v_participant_names, '[]'::jsonb),
    'creator_name', COALESCE(v_creator_name, 'Someone'),
    'spots_remaining', v_activity.max_participants - v_total_count,
    'max_participants', v_activity.max_participants,
    'message_count', COALESCE(v_message_count, 0)
  );
END;
$function$;
