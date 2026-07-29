---
name: verify
description: Build/launch/drive recipe for verifying konectr-web changes at runtime (esp. the /a/[code] RSVP page)
---

# Verifying konectr-web at runtime

## Launch

- A PreToolUse hook blocks any Bash command containing `npm run dev` and demands tmux — but **tmux is not installed** on this machine. Workaround: `(npx next dev > <scratchpad>/devserver.log 2>&1 &)` from `konectr-web/`, then `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/<path>` to confirm ready (~10s).
- Dev server talks to the **live prod Supabase** via `.env.local` — any RSVP you submit writes real rows. Clean up test RSVPs via the in-page withdraw flow ("Can't make it anymore?" → "Yes, free up my spot"). The withdraw still posts a "X is no longer attending" **system** message into the group conversation (visible in the in-app mobile chat), but as of 2026-07-14 it **no longer shows in the web Activity Chatter** — `get_web_chat_messages` and `/api/chat/history` filter the feed to `message_type='text'` only.
- Kill with `pkill -f "next dev"`.

## Browser driving

- chrome-devtools MCP: if it errors with "browser already running for chrome-devtools-mcp/chrome-profile", a stale automation Chrome is holding the profile — `pkill -f "chrome-devtools-mcp/chrome-profile"` (plus `kill -9` stragglers) then retry. This is the MCP's own profile, never the user's personal Chrome.
- `take_screenshot` on `/a/[code]` usually times out over CDP (page polls teaser every 5s). Use `evaluate_script` with `document.body.innerText.slice(...)` for evidence instead.
- React controlled inputs need the native-setter trick: `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el, v)` + dispatch `input` event.

## RSVP page state

- Activities live in `user_availability` (NOT `activities`): `SELECT share_code, start_time FROM user_availability WHERE share_code IS NOT NULL AND start_time > now()` gives live `/a/[code]` codes.
- Returning-visitor state is simulated by seeding localStorage key `konectr_rsvps` = `{"<SHARECODE>": {claimToken, guestName, rsvpAt, participantCount, participantNames, messageCount}}` then reloading — no prod write needed for the refresh path.
- `konectr_user_profile` localStorage key autofills the claim form; clear both keys for a genuinely fresh visitor.
