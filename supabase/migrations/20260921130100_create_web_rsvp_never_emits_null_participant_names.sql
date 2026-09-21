-- Applied to production (Konectr-App) 2026-09-21.
--
-- Same latent crash as get_activity_rsvp_teaser (previous migration):
-- split_part(NULL, ' ', 1) is NULL for a member who has not finished
-- onboarding, and jsonb_agg keeps it as a JSON null. This response is rendered
-- by /a/[code] the instant a web guest submits their RSVP, so the null would
-- have taken the page down again at the worst possible moment -- right after a
-- conversion.
--
-- Only the participant_names aggregation changes. Nulls are now filtered out
-- BEFORE the LIMIT 3, so the preview shows up to 3 people who actually have a
-- name instead of burning a slot on a blank.

CREATE OR REPLACE FUNCTION public.create_web_rsvp(p_activity_id uuid, p_guest_name text, p_ip_hash text DEFAULT NULL::text, p_phone_hash text DEFAULT NULL::text, p_email text DEFAULT NULL::text, p_utm_source text DEFAULT NULL::text, p_utm_medium text DEFAULT NULL::text, p_utm_campaign text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_activity RECORD;
  v_ip_count INT;
  v_claim_token VARCHAR(9);
  v_rsvp_id UUID;
  v_participant_names JSONB;
  v_total_count INT;
  v_message_count INT;
  v_normalized_email TEXT;
BEGIN
  SELECT id, title, status, start_time, end_time, max_participants, current_participants, user_id
  INTO v_activity
  FROM user_availability
  WHERE id = p_activity_id;

  IF v_activity IS NULL THEN RAISE EXCEPTION 'Activity not found'; END IF;
  IF v_activity.status NOT IN ('active', 'confirmed') THEN RAISE EXCEPTION 'Activity is not active'; END IF;
  IF v_activity.end_time < now() THEN RAISE EXCEPTION 'Activity has ended'; END IF;

  -- Normalize + validate email up front: it is now the primary dedupe key, so
  -- it has to be canonical before the duplicate check runs.
  v_normalized_email := NULLIF(LOWER(TRIM(p_email)), '');
  IF v_normalized_email IS NOT NULL THEN
    IF length(v_normalized_email) > 254 OR v_normalized_email !~ '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$' THEN
      RAISE EXCEPTION 'Invalid email';
    END IF;
  END IF;

  -- Dedupe: same email already holds a pending RSVP on this activity.
  -- Deliberately does NOT return the existing row/claim_token (see header).
  IF v_normalized_email IS NOT NULL AND EXISTS (
    SELECT 1 FROM web_rsvps
    WHERE activity_id = p_activity_id
      AND lower(email) = v_normalized_email
      AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'Already RSVP''d for this activity';
  END IF;

  -- Dedupe: same phone (when supplied — phone is optional since 2026-08-08).
  IF p_phone_hash IS NOT NULL AND EXISTS (
    SELECT 1 FROM web_rsvps
    WHERE activity_id = p_activity_id
      AND phone_hash = p_phone_hash
      AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'Already RSVP''d for this activity';
  END IF;

  -- current_participants is host-inclusive and already counts pending web RSVPs (recalc trigger).
  IF v_activity.current_participants >= v_activity.max_participants THEN
    RAISE EXCEPTION 'Activity is full';
  END IF;

  IF p_ip_hash IS NOT NULL THEN
    SELECT COUNT(*) INTO v_ip_count
    FROM web_rsvps WHERE ip_hash = p_ip_hash AND created_at > now() - INTERVAL '1 hour';
    IF v_ip_count >= 10 THEN RAISE EXCEPTION 'Too many RSVPs. Please try again later.'; END IF;
  END IF;

  -- 2026-09-16 hardening: the IP cap only applies when the caller supplies
  -- p_ip_hash, so a caller that omits it had no limit at all — and every RSVP
  -- now pushes the starter. Per-activity hourly cap that no caller can skip.
  IF (SELECT COUNT(*) FROM web_rsvps
      WHERE activity_id = p_activity_id AND created_at > now() - INTERVAL '1 hour') >= 20 THEN
    RAISE EXCEPTION 'Too many RSVPs. Please try again later.';
  END IF;

  LOOP
    v_claim_token := 'RSVP-' || upper(substr(md5(random()::text), 1, 4));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM web_rsvps WHERE claim_token = v_claim_token);
  END LOOP;

  -- unique_violation = a concurrent submit won the race on either
  -- idx_web_rsvps_pending_email_unique or idx_web_rsvps_pending_phone_unique.
  -- We cannot tell which, hence the field-agnostic message.
  BEGIN
    INSERT INTO web_rsvps (activity_id, guest_name, claim_token, ip_hash, phone_hash, email, utm_source, utm_medium, utm_campaign)
    VALUES (p_activity_id, p_guest_name, v_claim_token, p_ip_hash, p_phone_hash, v_normalized_email,
            left(p_utm_source, 200), left(p_utm_medium, 200), left(p_utm_campaign, 200))
    RETURNING id INTO v_rsvp_id;
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'Already RSVP''d for this activity';
  END;

  -- Names are normalised and blanks dropped before LIMIT, so this never returns
  -- a JSON null element (see migration header).
  SELECT jsonb_agg(name) INTO v_participant_names
  FROM (
    SELECT name FROM (
      SELECT NULLIF(TRIM(split_part(COALESCE(p.display_name, ''), ' ', 1)), '') AS name
      FROM activity_participants ap
      JOIN profiles p ON p.id = ap.user_id
      WHERE ap.activity_id = p_activity_id AND ap.status IN ('confirmed', 'joined')
      UNION ALL
      SELECT NULLIF(TRIM(COALESCE(wr.guest_name, '')), '') AS name
      FROM web_rsvps wr
      WHERE wr.activity_id = p_activity_id AND wr.status = 'pending' AND wr.id != v_rsvp_id
    ) all_names
    WHERE name IS NOT NULL
    LIMIT 3
  ) sub;

  SELECT COUNT(*) INTO v_message_count
  FROM messages m
  JOIN conversations c ON c.id = m.conversation_id
  WHERE c.activity_id = p_activity_id AND c.conversation_type = 'group';

  -- Post-insert read: the recalc trigger has already updated the column in this transaction.
  SELECT ua.current_participants INTO v_total_count
  FROM user_availability ua WHERE ua.id = p_activity_id;

  RETURN jsonb_build_object(
    'claim_token', v_claim_token,
    'guest_name', p_guest_name,
    'activity_title', v_activity.title,
    'participant_count', v_total_count,
    'participant_names', COALESCE(v_participant_names, '[]'::jsonb),
    'spots_remaining', GREATEST(0, v_activity.max_participants - v_total_count),
    'message_count', COALESCE(v_message_count, 0)
  );
END;
$function$;
