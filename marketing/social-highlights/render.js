const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { APP, CIRCLE } = require('./content');

const PUB = require('url').pathToFileURL(path.resolve(__dirname, '../../public')).href + '/';
const IMG = PUB + 'images/';
const OUT = path.join(__dirname, 'out');
const C = { orange: '#FF774D', amber: '#FFC845', graphite: '#1F1F1F', cloud: '#FAFAFA', tint: '#FFF4F1', hover: '#E6693F' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hl = s => esc(s).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>');

const FMT = {
  story: { W: 1080, H: 1920, top: 235, contentTop: 350, contentBottom: 470, footBottom: 200, s: 1 },
  threads: { W: 1080, H: 1350, top: 64, contentTop: 160, contentBottom: 270, footBottom: 50, s: 0.8 },
};

function css(theme, f) {
  const dark = theme === 'dark';
  const z = n => Math.round(n * f.s) + 'px';
  return `
@font-face{font-family:Satoshi;src:url(${PUB}fonts/Satoshi-Bold.woff2) format('woff2');font-weight:700}
@font-face{font-family:Satoshi;src:url(${PUB}fonts/Satoshi-Black.woff2) format('woff2');font-weight:900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${f.W}px;height:${f.H}px;overflow:hidden}
body{font-family:Satoshi,'Noto Color Emoji',sans-serif;font-weight:700;background:${dark ? C.graphite : C.cloud};color:${dark ? C.cloud : C.graphite};position:relative;-webkit-font-smoothing:antialiased}
.hdr{position:absolute;left:60px;right:60px;top:${f.top}px;display:flex;align-items:center;justify-content:space-between;z-index:5}
.brand{display:flex;align-items:center;gap:${z(14)};font-weight:900;font-size:${z(46)};letter-spacing:-0.03em}
.brand img{width:${z(68)};height:${z(68)}}
.brand .sub{color:${dark ? C.orange : C.hover};}
.pill{display:inline-flex;align-items:center;gap:${z(10)};background:${C.amber};color:${C.graphite};font-weight:900;font-size:${z(30)};padding:${z(12)} ${z(24)};border-radius:999px;letter-spacing:.02em}
.count{font-size:${z(28)};opacity:.6;margin-left:${z(14)};font-weight:700}
.content{position:absolute;left:60px;right:60px;top:${f.contentTop}px;bottom:${f.contentBottom}px;display:flex;flex-direction:column;justify-content:center;z-index:3}
.big{font-weight:900;font-size:${z(108)};line-height:1.02;letter-spacing:-0.035em;max-width:${z(940)}}
.small{font-size:${z(50)};line-height:1.28;color:${dark ? '#BDBDBD' : '#4A4A4A'};margin-top:${z(30)};max-width:${z(900)}}
.hl{${dark ? `color:${C.orange}` : `background:linear-gradient(transparent 58%, ${C.amber} 58%, ${C.amber} 92%, transparent 92%);`}}
.foot{position:absolute;left:60px;bottom:${f.footBottom}px;z-index:4}
.foot .t{font-weight:900;font-size:${z(34)};letter-spacing:-0.02em}
.foot .u{font-size:${z(28)};margin-top:${z(4)};color:${dark ? C.orange : '#4A4A4A'}}
.foot .u b{color:${C.orange}}
.sun{position:absolute;right:0;z-index:1}
.photo{flex:none;width:100%;border-radius:${z(44)};background-size:cover;background-position:center;position:relative;box-shadow:0 30px 60px -30px rgba(0,0,0,.45);margin-bottom:${z(56)}}
.photo .pill{position:absolute;left:${z(28)};top:${z(28)}}
.step{background:${C.orange};color:${C.graphite}}
.card{flex:none;background:#fff;border-radius:${z(44)};box-shadow:0 40px 80px -40px rgba(31,31,31,.45);border:1px solid #F0EEEC;color:${C.graphite};margin-bottom:${z(56)};overflow:hidden}
.full{position:absolute;inset:0;background-size:cover;background-position:center;z-index:0}
.scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(31,31,31,.55) 0%,rgba(31,31,31,0) 22%,rgba(31,31,31,.05) 40%,rgba(31,31,31,.88) 72%,rgba(31,31,31,.96) 100%)}
.onphoto{color:${C.cloud}}
.onphoto .small{color:#E6E6E6}
.onphoto .foot .u{color:${C.amber}}
.onphoto .hdr,.onphoto .foot{text-shadow:0 2px 12px rgba(0,0,0,.55)}
.onphoto .brand .sub{color:${C.amber}}
.onphoto .count{opacity:.9}
`;
}

// Sunset motif: concentric arcs rising from the right edge (Sunset Orange + Solar Amber).
function sun(f, onPhoto) {
  const R = Math.round(260 * f.s), h = R + 10, w = R + 10;
  const cols = [C.amber, C.orange, C.amber, C.orange, C.orange];
  const rings = [0.28, 0.46, 0.64, 0.82, 1].map((k, i) =>
    `<circle cx="${w}" cy="${h}" r="${Math.round(R * k) - 10}" fill="none" stroke="${cols[i]}" stroke-width="${Math.round(17 * f.s)}" opacity="${onPhoto ? 0.95 : 1}"/>`).join('');
  return `<svg class="sun" style="bottom:${f.footBottom - 20}px" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${rings}</svg>`;
}

function header(acct, sec, i, n, light) {
  
  const sub = acct === CIRCLE ? ' <span class="sub">circle</span>' : '';
  const counter = n ? `<span class="count">${i}/${n}</span>` : '';
  return `<div class="hdr"><div class="brand"><img src="${PUB}logos/konectr-icon-orange.svg" style="${light ? 'filter:brightness(0) invert(1)' : ''}">konectr${sub}</div>${sec ? `<div><span class="pill">${esc(sec)}</span>${counter}</div>` : ''}</div>`;
}
const footer = () => `<div class="foot"><div class="t">Log off. Show up.</div><div class="u">konectr<b>.</b>app</div></div>`;

function wrap(theme, f, inner, onPhoto) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css(theme, f)}</style></head><body class="${onPhoto ? 'onphoto' : ''}">${inner}</body></html>`;
}

// ---------- slide bodies ----------
function body(acct, sec, sl, i, n, f) {
  const z = x => Math.round(x * f.s) + 'px';
  const dark = acct.theme === 'dark';
  const H = header(acct, sec.key, i, n, false);
  const text = (big, small) => `${big ? `<div class="big">${hl(big)}</div>` : ''}${small ? `<div class="small">${hl(small)}</div>` : ''}`;
  const std = (top, extra = '') => ({ html: `${H}<div class="content">${top}${text(sl.big, sl.small)}${extra}</div>${sun(f)}${footer()}` });
  const stepPill = sl.step ? `<span class="pill step">STEP ${sl.step} OF 5</span>` : '';

  switch (sl.t) {
    case 'title': {
      if (sl.img) {
        const word = sl.word || sec.key;
        const fs = Math.min(340, Math.floor(980 / (word.length * 0.66))) * f.s;
        return { photo: true, html: `<div class="full" style="background-image:url(${IMG + sl.img})"></div><div class="scrim"></div>
          ${header(acct, null, 0, 0, true)}
          <div class="content" style="justify-content:flex-end">
            ${sl.kicker ? `<div class="pill" style="align-self:flex-start;margin-bottom:${z(24)}">${esc(sl.kicker)}</div>` : ''}
            <div style="font-weight:900;font-size:${fs}px;line-height:.9;letter-spacing:-0.05em;color:${C.amber}">${esc(word)}</div>
            <div class="small" style="font-size:${z(58)};color:#fff;margin-top:${z(26)}">${hl(sl.sub)}</div>
            <div style="margin-top:${z(40)};font-size:${z(32)};color:${C.amber}">Tap through →</div>
          </div>${footer()}` };
      }
      const word = sec.key;
      const fs = Math.min(300, Math.floor(980 / (word.length * 0.66))) * f.s;
      return { html: `${header(acct, null, 0, 0, false)}
        <div class="content">
          <div style="width:${z(200)};height:${z(200)};border-radius:50%;background:${C.amber};display:grid;place-items:center;font-size:${z(104)};margin-bottom:${z(50)}">${sec.emoji}</div>
          <div style="font-weight:900;font-size:${fs}px;line-height:.9;letter-spacing:-0.05em;color:${C.orange}">${esc(word)}</div>
          <div class="small" style="font-size:${z(60)};color:${C.cloud};margin-top:${z(34)}">${hl(sl.sub)}</div>
          <div style="margin-top:${z(44)};font-size:${z(32)};color:${C.amber}">Tap through →</div>
        </div>${sun(f)}${footer()}` };
    }
    case 'photo':
      return std(`<div class="photo" style="height:${z(470)};background-image:url(${IMG + sl.img})">${stepPill}</div>`);
    case 'icon':
      return std(`<div style="display:flex;align-items:center;gap:${z(24)};margin-bottom:${z(56)}">
        <div style="width:${z(170)};height:${z(170)};border-radius:${z(46)};background:${dark ? 'rgba(255,119,77,.16)' : C.tint};display:grid;place-items:center;font-size:${z(96)}">${sl.icon}</div>
        ${sl.chip ? `<span class="pill">${esc(sl.chip)}</span>` : ''}</div>`);
    case 'logo':
      return std(`<div style="width:${z(260)};height:${z(260)};border-radius:${z(64)};background:${C.orange};display:grid;place-items:center;margin-bottom:${z(56)};box-shadow:0 30px 60px -24px rgba(255,119,77,.6)"><img src="${PUB}logos/konectr-icon-orange.svg" style="width:72%;filter:brightness(0) invert(1)"></div>`);
    case 'steps': {
      const rows = sl.steps.map((s, k) => `<div style="display:flex;align-items:center;gap:${z(34)};margin:${z(22)} 0">
        <div style="flex:none;width:${z(140)};height:${z(140)};border-radius:50%;background:${k === 2 ? C.orange : C.amber};color:${C.graphite};display:grid;place-items:center;font-weight:900;font-size:${z(74)}">${k + 1}</div>
        <div style="font-weight:900;font-size:${z(96)};letter-spacing:-0.035em;line-height:1;${k === 2 ? `color:${C.orange}` : ''}">${esc(s)}</div></div>`).join('');
      return { html: `${H}<div class="content"><span class="pill" style="align-self:flex-start;margin-bottom:${z(30)}">How it works</span>${rows}<div class="small" style="margin-top:${z(44)}">${hl(sl.small)}</div></div>${sun(f)}${footer()}` };
    }
    case 'strikes': {
      const rows = [['3', 'Warning', C.amber, 50], ['6', 'Suspended', C.orange, 74], ['9', 'Six-month ban', C.hover, 100]].map(([num, lab, col, w]) =>
        `<div style="display:flex;align-items:center;gap:${z(26)};margin:${z(20)} 0">
          <div style="flex:none;width:${z(170)};font-weight:900;font-size:${z(96)};color:${col};letter-spacing:-0.04em">${num}</div>
          <div style="width:${w}%;background:${col};color:${C.graphite};border-radius:${z(30)};padding:${z(30)} ${z(34)};font-weight:900;font-size:${z(46)};white-space:nowrap">${lab}</div></div>`).join('');
      return { html: `${H}<div class="content"><div class="big">${hl(sl.big)}</div>
        <div style="margin-top:${z(56)}"><div style="font-size:${z(30)};color:#BDBDBD;margin-bottom:${z(8)};letter-spacing:.06em">REPORTS → WHAT HAPPENS</div>${rows}</div></div>${sun(f)}${footer()}` };
    }
    case 'code':
      return std(`<div style="display:flex;align-items:center;gap:${z(22)};margin-bottom:${z(60)}">
        <div style="border:${z(6)} dashed ${C.amber};border-radius:${z(30)};padding:${z(30)} ${z(40)};font-family:ui-monospace,monospace;font-weight:700;font-size:${z(72)};letter-spacing:.08em;color:${C.amber}">YOUR-CODE</div>
        <div style="background:${C.orange};color:${C.graphite};border-radius:999px;padding:${z(26)} ${z(38)};font-weight:900;font-size:${z(40)}">Paste</div></div>`);
    case 'cta':
      return std('', `<div style="margin-top:${z(60)};display:flex;align-items:center;gap:${z(26)};flex-wrap:wrap">
        <div style="background:${C.orange};color:${C.graphite};border-radius:999px;padding:${z(36)} ${z(54)};font-weight:900;font-size:${z(52)};box-shadow:0 24px 50px -20px rgba(255,119,77,.7)">${esc(sl.button)} ↗</div>
        <div style="font-size:${z(34)};opacity:.7">${esc(sl.note)}</div></div>`);
    case 'qa': {
      const aStyle = dark ? `color:#E8E8E8` : `color:#333`;
      return { html: `${H}<div style="position:absolute;right:-60px;top:${f.contentTop - 40}px;font-weight:900;font-size:${z(900)};line-height:1;color:${C.orange};opacity:${dark ? .07 : .09};z-index:0">?</div>
        <div class="content">
          <div style="font-weight:900;font-size:${z(220)};line-height:.85;color:${C.orange};margin-bottom:${z(30)}">?</div>
          <div class="big" style="font-size:${z(104)}">${esc(sl.q)}</div>
          <div style="width:${z(120)};height:${z(12)};border-radius:9px;background:${C.amber};margin:${z(46)} 0 ${z(40)}"></div>
          <div class="small ${dark ? 'ans' : ''}" style="font-size:${z(58)};margin-top:0;${aStyle}">${dark ? esc(sl.a).replace(/\*(.+?)\*/g, `<span style="color:${C.amber}">$1</span>`) : hl(sl.a)}</div>
        </div>${sun(f)}${footer()}` };
    }
    case 'rule':
      return std(`<div style="font-weight:900;font-size:${z(240)};line-height:.85;letter-spacing:-0.05em;color:${C.orange};margin-bottom:${z(40)}">${sl.n}</div>`,
        sl.foot ? `<div style="margin-top:${z(44)}"><span class="pill" style="background:${C.graphite};color:${C.cloud}">${esc(sl.foot)}</span></div>` : '');
    case 'vibegrid': {
      const v = [['☕', 'Chill'], ['💪', 'Active'], ['🎯', 'Focus'], ['🎨', 'Creative'], ['⛰️', 'Adventure'], ['🎉', 'Social']];
      const chips = v.map(([e, nme]) => `<div style="display:flex;align-items:center;gap:${z(16)};background:${C.amber};border-radius:999px;padding:${z(24)} ${z(32)};font-weight:900;font-size:${z(48)}"><span style="font-size:${z(56)}">${e}</span>${nme}</div>`).join('');
      return std(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:${z(22)};margin-bottom:${z(64)}">${chips}</div>`);
    }
    case 'vibe': {
      const fs = Math.min(230, Math.floor(960 / (sl.name.length * 0.66))) * f.s;
      return { photo: true, html: `<div class="full" style="background-image:url(${IMG + sl.img})"></div><div class="scrim"></div>
        ${header(acct, sec.key, i, n, true)}
        <div class="content" style="justify-content:flex-end">
          <span class="pill" style="align-self:flex-start;font-size:${z(40)};padding:${z(16)} ${z(30)}"><span style="font-size:${z(52)}">${sl.emoji}</span> Vibe</span>
          <div style="font-weight:900;font-size:${fs}px;line-height:.92;letter-spacing:-0.045em;margin-top:${z(24)}">${esc(sl.name)}</div>
          <div class="small" style="font-size:${z(62)};color:#fff">${hl(sl.small)}</div>
        </div>${footer()}` };
    }
    case 'rsvp': {
      const card = `<div class="card" style="width:${z(860)}">
        <div style="height:${z(160)};background:url(${IMG}activities/cafe.jpg) center/cover;position:relative">
          <span class="pill" style="position:absolute;left:${z(26)};bottom:${z(22)}">☕ Chill</span>
          ${sl.step ? `<span class="pill step" style="position:absolute;right:${z(22)};top:${z(22)}">STEP ${sl.step} OF 5</span>` : ''}</div>
        <div style="padding:${z(28)} ${z(34)}">
          <div style="font-weight:900;font-size:${z(46)};letter-spacing:-0.02em">JOM KOPI · BANGSAR</div>
          <div style="display:flex;gap:${z(18)};margin-top:${z(24)}">
            ${[['🗓️', 'WHEN', 'Sat · 10 AM'], ['📍', 'WHERE', 'Bangsar']].map(([ic, l, v]) => `<div style="flex:1;background:${C.tint};border-radius:${z(24)};padding:${z(20)} ${z(24)}"><div style="font-size:${z(24)};color:#6E6E6E;letter-spacing:.08em">${ic} ${l}</div><div style="font-weight:900;font-size:${z(40)};margin-top:${z(4)}">${v}</div></div>`).join('')}
          </div>
          <div style="margin-top:${z(22)};border:2px solid #E5E1DD;border-radius:${z(22)};padding:${z(22)} ${z(26)};font-size:${z(38)};color:${C.graphite}">Aisyah<span style="display:inline-block;width:3px;height:${z(40)};background:${C.orange};vertical-align:middle;margin-left:4px"></span></div>
          <div style="margin-top:${z(22)};background:${C.orange};border-radius:999px;text-align:center;padding:${z(26)};font-weight:900;font-size:${z(44)}">I'm in 🙌</div>
        </div></div>`;
      return std(card);
    }
    case 'chat': {
      const b = (who, msg, me) => `<div style="display:flex;flex-direction:column;align-items:${me ? 'flex-end' : 'flex-start'};margin-top:${z(18)}">
        ${who ? `<div style="font-size:${z(26)};color:#6E6E6E;margin:0 ${z(10)} ${z(6)}">${who}</div>` : ''}
        <div style="max-width:80%;background:${me ? C.orange : '#F1EFED'};color:${C.graphite};border-radius:${z(34)};${me ? `border-bottom-right-radius:${z(10)}` : `border-bottom-left-radius:${z(10)}`};padding:${z(22)} ${z(30)};font-size:${z(38)};line-height:1.25">${esc(msg)}</div></div>`;
      const card = `<div class="card" style="width:${z(900)};padding:${z(32)}">
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:${z(18)};border-bottom:2px solid #F0EEEC">
          <div style="font-weight:900;font-size:${z(38)}">💬 Jom Kopi · Bangsar</div>
          ${sl.step ? `<span class="pill step" style="font-size:${z(24)}">STEP ${sl.step} OF 5</span>` : ''}</div>
        ${b('Wei', 'Anyone else getting the kaya toast? 👀')}
        ${b('Priya', "I'll be the one in the yellow cap 🧢")}
        ${b('', 'Obviously. See you at 10! 🙌', true)}</div>`;
      return std(card);
    }
    case 'withdraw': {
      const card = `<div class="card" style="width:${z(860)};padding:${z(40)}">
        <div style="display:flex;justify-content:space-between;align-items:center"><div style="width:${z(90)};height:${z(10)};border-radius:9px;background:#E5E1DD"></div>
        ${sl.step ? `<span class="pill step" style="font-size:${z(24)}">STEP ${sl.step} OF 5</span>` : ''}</div>
        <div style="font-weight:900;font-size:${z(56)};margin-top:${z(26)};letter-spacing:-0.02em">Can't make it?</div>
        <div style="font-size:${z(34)};color:#555;margin-top:${z(12)};line-height:1.3">Free your seat so someone else can come. The crew gets a heads-up.</div>
        <div style="margin-top:${z(30)};background:${C.graphite};color:${C.cloud};border-radius:999px;text-align:center;padding:${z(26)};font-weight:900;font-size:${z(40)}">Free my seat</div>
        <div style="margin-top:${z(16)};border:2px solid #E5E1DD;border-radius:999px;text-align:center;padding:${z(24)};font-weight:900;font-size:${z(40)}">I'll still come</div></div>`;
      return std(card);
    }
  }
  throw new Error('unknown type ' + sl.t);
}

function cover(acct, sec) {
  const f = FMT.story, app = acct === APP;
  const bg = app ? C.orange : C.amber;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css(acct.theme, f)}
    body{background:${bg};color:${C.graphite};display:grid;place-items:center}</style></head><body>
    <div style="text-align:center"><div style="font-size:300px;line-height:1">${sec.emoji}</div>
    <div style="font-weight:900;font-size:${sec.key.length > 4 ? 120 : 140}px;letter-spacing:-0.04em;margin-top:30px">${esc(sec.key)}</div></div></body></html>`;
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const page = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const tmp = path.join(__dirname, '_slide.html');
  const shoot = async (html, file, f) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(tmp, html);
    await page.setViewportSize({ width: f.W, height: f.H });
    await page.goto('file://' + tmp, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: file, type: 'png' });
  };
  const only = process.argv[2];
  let count = 0;
  for (const acct of [APP, CIRCLE]) {
    if (only && !acct.name.toLowerCase().includes(only)) continue;
    let si = 0;
    for (const sec of acct.sections) {
      si++;
      const dir = path.join(OUT, acct.folder, 'IG Highlights', `${String(si).padStart(2, '0')} ${sec.key}`);
      await shoot(cover(acct, sec), path.join(dir, '00 cover (highlight icon).png'), FMT.story); count++;
      const n = sec.slides.length;
      for (let k = 0; k < n; k++) {
        const r = body(acct, sec, sec.slides[k], k + 1, n, FMT.story);
        await shoot(wrap(acct.theme, FMT.story, r.html, r.photo), path.join(dir, `${String(k + 1).padStart(2, '0')}.png`), FMT.story); count++;
      }
    }
    if (acct.threads) {
      const n = acct.threads.length, sec = { key: 'JOM', emoji: '👋' };
      for (let k = 0; k < n; k++) {
        const r = body(acct, sec, acct.threads[k], k + 1, n, FMT.threads);
        await shoot(wrap(acct.theme, FMT.threads, r.html, r.photo), path.join(OUT, acct.folder, 'Threads Pinned Post (4x5)', `${String(k + 1).padStart(2, '0')}.png`), FMT.threads); count++;
      }
    }
  }
  await b.close();
  console.log('rendered', count);
})();
