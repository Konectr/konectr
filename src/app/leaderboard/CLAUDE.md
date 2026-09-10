# /leaderboard — KL weekly leaderboard

Public, no-locale route. `page.tsx` (ISR 300s) calls `get_public_leaderboard(0)` and `(-1)` via the anon
key and hands both weeks to `LeaderboardBoard.tsx` (client: tabs, glance sheet, WhatsApp copy button).

- **Ranking (since 2026-09-10):** completed activities (`verified_meetups` = distinct meetups confirmed
  in-app, credited to the user), points (`score`, 3 both-confirmed / 2 confirmer-only) break ties.
  The RPC column name is historical — do not "fix" it back to both-confirmed-only.
- **Privacy:** rows render only what the RPC returns — first name, photo, weekly count, points,
  champion flag. Opt-in (`profiles.show_on_leaderboard`, Settings → Privacy in the app); test accounts
  excluded server-side. Never add venues, dates, or lifetime counts. The glance sheet is a download
  driver and shows nothing new on purpose.
- **Entry points:** the app's Settings → Community tile (in-app browser view). No internal site link yet.
- **Copy rule:** "starter", never "host". Week labels are KL calendar days (`lib/datetime.ts`).
- **Empty board is a data problem:** 0 opt-ins and ~0 confirmed meetups as of 2026-09-10 — check
  `profiles.show_on_leaderboard` and `match_status.confirmation_status` before touching this page.
