# Konectr Bug Log

Logging-only inbox. Bugs are captured here from any device (phone / cloud sessions) and
worked on later from the Mac Mini: `git pull origin main`, then open this file.

**Rules**
- Log sessions only append entries. No code changes happen in a logging session.
- Newest bugs go at the top of "Open".
- When a bug is fixed, move it to "Fixed" with the commit hash and date.

**Entry format**

```
### BUG-NNN · <short title>
- **Logged:** YYYY-MM-DD
- **Area:** web (konectr.app) / mobile iOS / mobile Android / backend / other
- **Page / screen:** <URL or screen name>
- **What happened:** <observed behaviour>
- **Expected:** <what should happen>
- **Steps to reproduce:** <if known>
- **Severity:** P0 blocker / P1 major / P2 minor / P3 cosmetic
- **Status:** Open
```

---

## Open

### BUG-001 · "Add to Circle" from activity Participants sheet: profile sheet bounces open/closed repeatedly before request sends
- **Logged:** 2026-10-01
- **Area:** mobile iOS
- **Page / screen:** Activity detail (Pickleball @ Bistari Co..., Sun Oct 4, 3:00 PM) -> Participants (3) sheet -> tap participant "Timmy" -> profile sheet -> "Add to Circle"
- **Evidence:** Screen recording `ScreenRecording_10-01-2026_6-32-17AM_1.MP4` (9.3s), timeline below
- **What happened:**
  - 0.0-2.0s: Timmy's profile sheet is open (avatar is just a "T" initial, no photo/details), "Add to Circle" button shown.
  - ~2.0s: after tapping "Add to Circle", the profile sheet slides DOWN and the Participants sheet is revealed. No in-sheet confirmation.
  - ~3.0s: the profile sheet RE-OPENS by itself ("Loading profile..." then Timmy's profile again, still showing "Add to Circle" -- button state never changes to "Requested").
  - ~3.75s: "Add to Circle" button briefly disappears, then reappears.
  - ~5.0-5.25s: profile sheet dismisses, flashes open AGAIN for a frame, then dismisses.
  - ~5.5-6.5s: Participants sheet visible, then it also dismisses.
  - ~6.75s: back on the activity page, green toast "Circle request sent to Timmy" appears -- only after the whole sheet stack has collapsed.
- **Expected:** One tap on "Add to Circle" sends the request once, the button changes in place to "Requested"/"Pending" (disabled), a confirmation shows on the profile sheet, and the user stays on the profile/Participants sheet. No sheet should re-open itself.
- **Likely causes to check (for the fix session):** a pop/navigation fired on tap plus a rebuild/listener re-pushing the profile sheet (double navigation); participant list refresh re-triggering the "open profile" action; snackbar shown on the root scaffold after popping all sheets; button state not bound to circle-request status.
- **Also verify:** whether multiple circle requests were sent to Timmy (check for duplicate rows in the circle request table for this pair); profile sheet showing only an initial "T" with no photo/bio -- confirm whether that is expected for this user or a loading/data bug.
- **Severity:** P1 major (core social action feels broken, possible duplicate requests)
- **Status:** Open


---

## Fixed

_None yet._
