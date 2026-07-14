# Jom, KL — Homepage Redesign Design Spec

**Date:** 2026-07-12
**Status:** DRAFT — awaiting founder approval. No implementation before sign-off.
**Scope decisions (locked with founder):** Homepage only · Full copy rewrite (founder reviews every line) · Curated Unsplash KL photography with attribution
**Direction:** D — "Jom, KL" (chosen from 4 mocked directions in brainstorm session 79406-1783847638)

---

## 1. The Thesis

Every competitor in the "meet people IRL" space sells the same thing: an app. Timeleft sells
dinners. Meetup sells groups. They could be anywhere; their landing pages are interchangeable
stock-photo humanism.

Konectr's uncopyable asset is that it is OF Kuala Lumpur, not deployed TO Kuala Lumpur. So the
homepage stops selling an app and starts celebrating the city. The emotional arc:

> hometown pride → recognition ("that's MY city, MY mamak, MY hill") → the effortless yes ("Jom?")

"Jom" is the whole product in one word: a Malaysian invitation that needs no explanation, carries
zero commitment weight, and is answered with itself. The site should feel like receiving one.

**What this is not:** a tourism board page, a Petronas-Towers postcard, or heavy Manglish cosplay.
KL locals live in neighborhoods, not landmarks. Manglish is seasoning, never the whole dish.

---

## 2. Homepage Architecture (replaces current 6 sections)

Section order tells one story: the invitation → the city is alive → how it works → your corner of
KL → proof it's real → your turn.

### S1 · Hero — "Jom?"
- Full-viewport KL photograph at dusk (blue-hour city warmth, NOT the towers close-up cliche;
  a rooftop/kampung-baru vantage where the city feels lived-in). Warm gradient scrim bottom-up
  using ink → transparent, with a whisper of Sunset Orange in the top glow.
- Eyebrow (Solar Amber, letterspaced caps): "TONIGHT, KUALA LUMPUR" — rendered live-ish:
  time-of-day aware greeting is a nice-to-have, static is fine for v1.
- Headline: **Jom?** — one word, massive (clamp ~96–180px), Satoshi Black, white, orange question
  mark. The single largest type the brand has ever set.
- Subline (one sentence): "One word is all it takes. Coffee in TTDI. Badminton in Sentul. Sunrise
  on Bukit Tabur."
- Primary CTA (Sunset Orange pill): "Jom, I'm in" → existing TestFlight flow. Secondary ghost
  link: "How it works".
- Footer strip of neighborhood names as quiet texture: TTDI · Sentul · Bangsar · Cheras · Jalan Alor.
- Motion: headline settles with a single 0.5s fade-up; scrim breathes on an ambient ≥8s loop
  (opacity only). Nothing else moves.

### S2 · Tonight in KL — the city is already out
- Replaces TheShift's "lonely vs together" grayscale story with forward energy: a horizontal band
  of "live" activity cards styled like chat invites, each anchored to a real place:
  "Kopi at VCR, 4pm — 2 spots" / "Badminton, Sentul — need 2 more" / "Tabur sunrise Sat, 5:30am".
- Cards are illustrative (marketing copy, not live data) but formatted exactly like the app's
  real activities so the product is being demonstrated, not described.
- Section header: "The city is already out." Sub: "Somewhere in KL right now, someone is one
  person short. That someone could be waiting for you."
- Motion: cards stagger in on scroll (fade-up, 60ms stagger); gentle CSS marquee is explicitly
  NOT used (motion policy: no infinite translation of content users need to read).

### S3 · How it works — three beats, KL-flavored
- Keep the proven 3-step structure but re-voice it around the invitation:
  1. "Say what you feel like" (kopi? hike? padel?)
  2. "We find your people" (matched on vibe, venue, time — no browsing profiles, no hosts)
  3. "Jom. That's it." (show up; the app handles the rest)
- Visual: numbered cards on warm surface, step 3's badge in the Sunset→deep-orange gradient
  (resolves the pending green-vs-orange question in favor of orange here; this section IS the brand
  moment).

### S4 · Your corner of KL — neighborhoods as heroes
- Replaces FindYourVibe's generic vibe grid with a grid of 4–6 neighborhood cards, each a real KL
  place with its own personality in one line:
  - TTDI — "kopitiam mornings, padel evenings"
  - Bangsar — "brunch that turns into dinner"
  - Sentul — "courts, tracks, and teh ais after"
  - Bukit Tabur / Gombak — "sunrise people"
  - Jalan Alor / Bukit Bintang — "the 11pm supper crew"
  - Cheras — "the underrated one, and proud of it"
- Photography: real Unsplash shots of these actual places (curation list in §5). Hover: existing
  hoverLift + slow image scale, consistent with polish pass.
- This section is the moat on display: no French import can write these lines.

### S5 · Real ones — proof
- Evolves JoinMovement (dark ink section stays; it's the visual rest beat). Testimonial quote(s)
  from actual beta users when available; until then, the founder's line: why Konectr exists, signed.
  Honest numbers only (no inflated social proof; we have 77 users and a kill gate — credibility
  is the asset).
- Stats tiles reframed city-first: "KL-born", "0 hosts, 0 stages, just people", "Free during beta".

### S6 · CTA Footer — the invitation, returned
- Big closing card (existing gradient card pattern): headline "So… jom?" CTA "Jom, I'm in".
- Keep Tally waitlist iframe + TestFlight CTA + Android waitlist exactly as wired today
  (conversion plumbing untouched — same rule as the polish pass).

**Navigation & Footer:** unchanged structurally; nav CTA label becomes "Jom, I'm in" (en/ms only,
see §6).

---

## 3. Voice Guide (for the full copy rewrite)

- **One-word energy.** Short sentences. Invitations, not descriptions. Cut every word that a
  friend wouldn't text you.
- **Manglish as seasoning:** "jom", "lah" (sparingly, max ~2 per page), "mamak", "teh ais",
  "lepak". NEVER phonetic-spelled dialect, never trying too hard. If a line feels like a tourism
  ad or a brand pretending to be local, kill it.
- **Zero corporate voice.** Banned: "community", "platform", "connect with like-minded
  individuals", "discover", "unlock", "journey".
- **No em-dashes anywhere.** Use "--" or restructure (standing founder rule).
- **Specificity is the emotion.** "Badminton in Sentul at 8" moves people; "activities near you"
  doesn't. Every claim names a real place, time, or activity.
- Founder reviews every line in chat before it enters code (standing marketing-copy rule).

## 4. Visual System (inherits the polish-pass foundation)

Everything ships on the system already built this session — no new tokens needed:
- Colors: Sunset Orange primary / Solar Amber ≤10% (eyebrows, underlines) / warm graphite dark
  theme / ink sections. 70/20/10 held.
- Type: Satoshi stays (founder-locked). The only new treatment is the hero's display scale.
- Radius 8/12/16, warm shadows, brandEase 200–300ms micro / ≤500ms entrances, transform+opacity
  only, `translate` property lists, whileHover for motion elements, reduced-motion respected.
- Dark mode: photography sections use the same scrim strategy in both themes (images are
  self-lit); card sections follow the warm graphite elevation scale.

## 5. Photography Direction (curated Unsplash, attribution in ToS §7 pattern)

- **Palette rule:** dusk and golden hour only. Warm tungsten + blue hour. No harsh daylight, no
  drone-postcard shots, no stock people-laughing-at-laptop.
- **Subject rule:** lived-in KL — kopitiam interiors, wet streets reflecting neon, badminton
  halls, Tabur ridgelines at dawn, mamak tables at night. People appear mid-activity, never
  posing at camera.
- Curation deliverable: 10–14 candidates presented to founder as a contact sheet before build;
  founder picks. Attribution lines added to the existing third-party credits section.
- Swap path: any image replaceable by founder photos later without layout change (fixed aspect
  containers).

## 6. i18n Strategy (8 locales)

- "Jom" is a **brand word**: untranslated in every locale, like the logo. Headline stays "Jom?"
  globally.
- en + ms carry the full voice natively. The other 6 locales (de/ja/ko/th/vi/zh-HK) get faithful
  plain-language adaptations of the meaning, not the Manglish (a German "lah" would be absurd).
  Machine-drafted, flagged as unreviewed, same as current locale handling.
- All copy flows through the existing next-intl message files; no hardcoded strings.

## 7. Out of Scope (explicitly)

- Inner pages (about / how-it-works / safety / blog / faq) — keep current polished design.
- `/a/[code]` RSVP page — recently redesigned, live, untouched.
- Any live-data integration for S2 (illustrative cards only, v1).
- Nav/Footer structural changes, new dependencies, font changes.
- Anything server-side, Supabase, or app-side.

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Manglish reads as cringe to some locals | Seasoning-only rule; founder (KL local) reviews every line; easy to dial back, copy lives in message files |
| "Jom?" hero too sparse to explain the product | Subline names 3 concrete activities; S2 demonstrates the product within one scroll |
| Unsplash KL depth is thin for specific neighborhoods | Contact-sheet step before build surfaces gaps early; fall back to evocative-KL rather than wrong-neighborhood shots |
| Alienates non-Malay-speaking KL audience | "Jom" is universally understood across KL's communities; all other copy is plain English |
| Homepage diverges stylistically from inner pages | Same tokens/typography/motion system; divergence is voice + photography, which is the point. Inner pages follow if direction wins |

## 9. Success Criteria

- Founder gut-check: "this could ONLY be Konectr, and only KL" on first scroll.
- All existing conversion plumbing (TestFlight CTA, Tally, Android waitlist, locale switching)
  works identically.
- Lighthouse: no regression vs current homepage (hero image via next/image priority, photography
  lazy below fold).
- Build/lint/tsc clean; 156-page build intact.

## 10. Process Gates (unchanged)

Founder approves this spec → implementation plan via writing-plans skill → build on a branch off
`claude/web-visual-polish` or fresh from main (founder's call, noting polish is uncommitted) →
copy reviewed line-by-line in chat → local + preview review → founder commits/deploys. I never
run `vercel --prod`.
