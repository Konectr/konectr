# Women-Only Feature -- Plan

**Date**: 2026-09-23 | **Status**: Plan (not built) | **Repos**: konectr-web (this), konectr-mobile, Supabase `Konectr-App`

---

## 1. Decisions locked (founder, 2026-09-23)

| # | Decision | Choice |
|---|----------|--------|
| D1 | Shape | **Both** -- per-activity "Women only" flag (Phase 1) + personal "Women-only mode" filter (Phase 2) |
| D2 | Verification | **Self-declared** profile gender + report-to-remove + strike escalation |
| D3 | Web RSVP guests | **Self-attest checkbox** ("I'm a woman"), host sees "via web" and can remove |
| D4 | Goals | Safety/comfort, Acquisition, Partner demand |
| D5 | Visibility | **Hidden from men** -- not in feed; share link hides venue + exact time until a woman RSVPs |
| D6 | Eligibility | **Strictly profile gender = `Woman`**. Non-binary / Other / Prefer not to say / null are not eligible |
| D7 | Who can host | **Any user with gender = `Woman`** |
| D8 | Gender edits | **One free self-serve change**, then locked (support-only) |

---

## 2. Ground truth (prod `Konectr-App`, queried 2026-09-23)

| `profiles.gender` | Count |
|---|---|
| `null` | **77** (48%) |
| `Man` | 43 |
| `Woman` | 36 |
| `Non-binary` / `Other` / `Prefer not to say` | 1 / 1 / 1 |

- `profiles.gender` is free `text`, **optional** today. Nearly half of users have no value.
- `waitlist_users.gender` exists (Tally form collects it) -- can backfill converted users.
- Web RSVP guests (`web_rsvps`) have **no gender** -- name + phone (+ optional email) only.

**Implication**: a women-only gate on today's data silently excludes ~half of the women on the platform. Phase 0 must fix the data before the feature is useful.

---

## 3. Mental model

> The feature *is* the trust promise. Its value is binary: one man in a women-only group and the promise is broken for everyone who hears about it.

So the design optimizes for three things, in order:
1. **Don't leak** -- men can't find women-only activities or where/when they happen (D5).
2. **Fast removal** -- when self-declaration fails, a report removes the person immediately, without waiting on a support ticket (D2).
3. **Friction on identity change** -- gender is expensive to flip (D8).

Self-declaration is the weak link we accepted to ship now. Photo Verification (currently "Coming Soon") is the natural V2 upgrade and should be scoped with this feature in mind.

---

## 4. Phased plan

### Phase 0 -- Gender data foundation (prerequisite, ~2-3 days)

| Item | Where | Detail |
|---|---|---|
| Normalize values | DB migration | `CHECK (gender IN ('Woman','Man','Non-binary','Other','Prefer not to say'))` after cleaning; keep text, not enum, to avoid mobile model churn |
| Change counter | DB | `profiles.gender_changes_used smallint default 0`, `gender_locked_at timestamptz` |
| Lock trigger | DB | `BEFORE UPDATE` trigger on `profiles.gender`: first change on a set value increments counter; second is rejected (`RAISE`) unless `service_role`. Setting from `null` is free. Log every change to `profile_gender_audit(user_id, old, new, changed_at, actor)` |
| Backfill | DB, one-off | Copy `waitlist_users.gender` → `profiles.gender` where linked + profile null (map Tally labels) |
| Prompt | Mobile | Nudge sheet for `null`-gender users: "Set your gender to see women-only activities" (required only when they touch a women-only surface -- don't hard-block the whole app) |
| Onboarding | Mobile | Make gender required for new signups, with copy explaining it powers women-only spaces and changes are limited |

### Phase 1 -- Women-only activities (core, ~1.5-2 weeks)

**Data**
- `activities.women_only boolean not null default false`
- `activities.women_only` immutable once any participant has joined (prevents a host flipping a mixed group to women-only, or the reverse, after people joined under different expectations)

**Server enforcement (RLS + RPCs -- never trust the client)**
- `is_eligible_woman(uid)` SQL helper → `gender = 'Woman'`.
- Feed / discovery RPCs + RLS on `activities`: `women_only = false OR is_eligible_woman(auth.uid())`. Men get **no row**, not a locked row.
- Join RPC: reject if `women_only` and not eligible.
- Create RPC: only eligible users may set `women_only = true` (D7).
- Matching (Vibe · Venue · Time): exclude women-only activities from candidate pools of ineligible users.
- Notifications / push / email digests: filter the same way -- a common leak path.

**Share link `/a/[code]` (this repo)**
- `get_activity_by_share_code`: when `women_only`, return a **redacted** payload (title, vibe, day-part e.g. "Saturday evening", area-level location only, `women_only: true`) -- no venue name, no exact time, no crew names.
- `ActivityRsvpPage.tsx` / `ClaimScreen`: "Women-only activity" badge + banner; required checkbox "I confirm I'm a woman. Women-only spaces are for women only -- misrepresenting yourself leads to removal and a ban."
- `create_web_rsvp`: new param `attest_woman boolean`; reject if activity is women-only and not attested. Store `web_rsvps.attested_woman_at`.
- Full details (venue, time, crew, chat) unlock **after** RSVP, the same moment they currently switch to the Chatting screen.
- OG/metadata: generic ("A women-only activity on Konectr"), never venue/time -- previews get forwarded.
- `/api/calendar/[code]` (.ics): gate behind the RSVP claim token for women-only activities, or it leaks venue + time.

**Host controls**
- Host (and any woman participant) can **remove** a web guest or app user from a women-only activity with reason "Not a woman".
- Mobile activity screen marks web guests "via web · self-attested".

**Reporting**
- New report reason: `women_only_violation`.
- 1 report from a participant of that activity → **immediate removal** from the activity + temporary block from all women-only surfaces pending review. (Higher-sensitivity than the standard 3/6/9 strike ladder; still feeds it.)
- Confirmed violation → instant suspension (skip ladder) + gender locked by support.
- Web guest violation → ban the hashed phone from future women-only web RSVPs.

### Phase 2 -- Women-only mode (~1 week, after Phase 1 has usage data)

- `profiles.women_only_mode boolean default false`, toggle visible to eligible users only (Settings + a feed filter chip).
- On: feed, matching and suggestions show **only** women-only activities (plus optionally mixed activities where all current participants are women -- decide after Phase 1 data).
- Matching: pair only with eligible users.
- Empty-state risk: with ~36 women in prod, the mode will often be empty. Ship with a "Host one" CTA and consider showing count of women nearby to make it feel alive.

### Phase 3 -- Acquisition + partners (parallel to Phase 2)

- **Web**: `/women` landing page (or section on homepage) -- safety story, how it works, CTA to waitlist/TestFlight. Add to sitemap + footer, 8 locales.
- **Safety page**: new card "Women-Only Activities".
- **FAQ**: 3-4 new Qs (who's eligible, how it's enforced, what if a man joins, can I change my gender).
- **Partners**: women's run clubs, padel/pilates studios host via a woman staff account (D7 = any woman user); seed 4-6 recurring women-only activities before public announce so the feed isn't empty on day 1.
- **Analytics**: PostHog events `women_only_toggled`, `women_only_viewed`, `women_only_rsvp`, `women_only_report`.

---

## 5. Policy copy (draft -- needs founder sign-off)

> **Women-only activities** are open only to members whose profile gender is *Woman*. Hosts, participants and Konectr can remove anyone from a women-only activity. Misrepresenting your gender to access a women-only space is a Community Guidelines violation and results in immediate suspension. You can change your profile gender once; after that, changes require contacting support.

Add to: Community Guidelines, Terms (acceptable use), Safety page, in-app first-time women-only tooltip.

---

## 6. Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Man self-declares as Woman | High | Hidden venue/time pre-RSVP; 1-report instant removal; one-change lock; Photo Verification as V2 |
| Web guest lies on checkbox | High | Same redaction; host removal; hashed-phone ban; consider requiring host approval for web guests on women-only activities if abuse appears |
| 48% null gender → feature looks empty | High | Phase 0 backfill + contextual prompt |
| Leaks via side channels (share OG, .ics, push, emails, leaderboard, crew lists) | Medium | Explicit audit checklist in §7; test each as a Man account |
| Excluded users (non-binary, Other) feel shut out | Medium | Clear neutral copy; they still see all mixed activities; revisit policy with data |
| App store review questions | Low | Gender-specific communities are allowed; have §5 policy linked in review notes |
| Malaysia legal | Low | Private services may be gender-specific; PDPA: gender is personal data (already disclosed in Privacy). Update Privacy to say it's now used for access control, not just display |
| Host flips flag post-join | Low | Immutable after first join |

---

## 7. Leak audit checklist (run as a `Man` test account + logged-out web)

- [ ] Home feed, search, map, category filters
- [ ] Matching / suggestions / "people also joined"
- [ ] Push + email reminders, digests, "new activity near you"
- [ ] `/a/[code]` HTML, OG tags, JSON-LD, `<title>`
- [ ] `/api/calendar/[code]`
- [ ] `get_activity_rsvp_teaser` (crew names)
- [ ] Web chat history API
- [ ] Host / user profile "past activities"
- [ ] `/leaderboard`, activity counts
- [ ] Supabase direct table access via anon key (RLS)

---

## 8. Success metrics (first 60 days)

- # women-only activities hosted / week; % filled
- Women's D30 retention: women-only participants vs mixed-only
- Women share of new signups (target: meaningfully above current 36/82 ≈ 44% of gendered users)
- `women_only_violation` reports: count, time-to-removal (target < 5 min automated)
- Partner-hosted women-only activities live

---

## 9. Open questions

1. Phase 2: should women-only mode also show mixed activities whose current crew is all women?
2. Web guests: keep self-attest only, or add host approval if abuse > 0?
3. Does the one free change reset if support corrects an error?
4. Photo Verification timeline -- tie it to women-only V2?

---

## 10. Single next action

Approve §5 policy copy and Phase 0 → then write the Phase 0 migration (gender normalization + change-lock trigger + waitlist backfill) in the mobile repo.
