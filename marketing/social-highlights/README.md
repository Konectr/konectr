# Social highlights (IG + Threads)

Generator for the pinned IG Story Highlights and Threads pinned carousel, built on the
Kinetic brand system (Satoshi, Sunset Orange `#FF774D`, Solar Amber `#FFC845`, Graphite `#1F1F1F`).

| Profile | Theme | Output |
|---|---|---|
| Konectr App (`@konectr.app`, IG) | Dark graphite | HELLO · SAFE · FAQ · GET IT highlights |
| Konectr Circle (IG + Threads) | Light, photo-led | JOM · VIBES · RULES · ASK highlights + Threads 4:5 carousel |

- Copy lives in `content.js` (`*word*` = highlighted word). Edit copy there, then re-render.
- Photos come from `public/images/` (activities, homepage, email) and fonts from `public/fonts/`.
- Each highlight has `00 cover (highlight icon).png` to set as the highlight ring cover.

```bash
# needs the global playwright package and a Chromium binary
CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
NODE_PATH=$(npm root -g) node render.js          # → out/
NODE_PATH=$(npm root -g) node sheet.js "out/Konectr Circle" sheet.png 200   # contact sheet
```

Facts on the slides (verify before re-posting): accounts are email-verified, live on the
App Store and Google Play, KL only, strikes 3/6/9, reports reviewed within 24h.
