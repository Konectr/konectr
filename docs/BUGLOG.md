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

### BUG-003 · "You're in!" post-create dialog: clipped text, no cancel/close -- redesign minimal
- **Logged:** 2026-10-01
- **Area:** mobile iOS (seen 4:04 PM)
- **Page / screen:** Create Activity sheet -> submit -> "You're in! Let's see who vibes." success dialog (activity: "F1 Week - Go-Kart Grand Prix!")
- **Evidence:** Screenshot from founder
- **What happened:**
  - a) **Broken / clipped text:** the primary button label "Go to activity" is cut off -- only the top half of the glyphs render (vertical clipping, button height/padding or text-scale issue). The activity title "Grand Prix!" line above it is also clipped at the bottom where it meets the button area.
  - b) **No cancel / close:** the dialog has only "Go to activity" and "Undo". There is no X or "Close/Done" to simply dismiss and stay where you are. ("Undo" deletes the activity, so it is not a cancel.)
  - Also seen: the hero icon is a plain yellow circle (looks like a missing emoji/illustration placeholder); behind the dialog the Create Activity submit button is still showing a loading spinner.
- **Expected / requested change (founder, design):** Redesign this dialog to be **minimalistic**:
  - Clean title + activity name, no clipped text at any text scale (test with iOS Larger Text / Dynamic Type).
  - Actions:
    1. **Go to activity** (primary)
    2. **Go to that day** -- opens the calendar on the activity's date (NEW)
    3. **Close / Done** -- dismiss, stay on current screen (NEW, explicit cancel; also allow tap-outside / X)
    4. Undo -- keep, but de-emphasised (text link)
  - Replace or remove the yellow-circle placeholder.
  - Ensure the Create Activity sheet's loading spinner is resolved/closed once the success dialog shows.
- **Severity:** P2 (bug parts: clipped text, missing close) + design change request
- **Status:** Open

### BUG-002 · Keyboard stuck open on Home screen, won't dismiss
- **Logged:** 2026-10-01
- **Area:** mobile iOS (seen once, 4:09 PM)
- **Page / screen:** Home ("Good afternoon, Konectr") -- Your plans / "This weekend" / Next Up card (F1 Week - Go-Kart Gra..., Sat Oct 3)
- **Evidence:** Screenshot from founder (keyboard covering bottom half of Home, no text field visible or focused on screen)
- **What happened:** The iOS keyboard stayed on screen over the Home feed and refused to go away. No visible text input on the page, so there was nothing to tap "done"/return on, and it would not dismiss. Happened once; trigger not captured.
- **Expected:** Keyboard only appears while a text field is focused and dismisses when leaving that field/screen (tap outside, scroll, or navigating back to Home).
- **Likely causes to check (for the fix session):** a TextField on a previous screen/sheet (search, chat, create-plan, circle sheet) kept focus when its route was popped or a sheet was dismissed, so the FocusNode stayed attached; Home has no tap-outside / scroll-to-dismiss (`FocusScope.of(context).unfocus()`, `keyboardDismissBehavior: onDrag`); an offstage/hidden TextField in the Home tree holding focus.
- **Repro to try:** open any screen/sheet with a text field (search, chat, create plan, add to circle), focus it, then go back / swipe-dismiss the sheet / switch tabs to Home while keyboard is up.
- **Severity:** P1 major (blocks half the screen; user may have to force-close)
- **Status:** Open

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
