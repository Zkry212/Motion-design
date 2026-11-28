// Élite Maillot — "message the shop" ad in the house language (SKILL.md "House style", reference build meuda-smsa):
// dark stage with turquoise / blue glow flames, Apple-only UI as thick 3D slabs at one fixed angle, Liquid Glass.
// An iMessage conversation with Élite Maillot: the question types in the glass field, the sent text flies up into a
// blue bubble (shared element), typing dots, the replies and a product card build in, a tap on "Acheter", the Apple Pay
// sheet rises (real Apple Pay mark), Face ID ring, "Terminé", a Dynamic Island, and the 3 + 1 end card with the logo.
(() => {
  const { SCENES, h, esc, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/' + f), LG = window.LG;
  const TEAL = '#5ce1e6', BLUE = '#0a84ff', SKY = '#2ec4ff', MINT = '#7dffd8';
  const smooth = k => k * k * (3 - 2 * k), io = E.inOut, oq = E.outQuint;
  const kf = (t, K, ez = smooth) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [t0, a, e2] = K[i - 1], [t1, b] = K[i], k = (e2 || ez)((t - t0) / (t1 - t0)); return Array.isArray(a) ? a.map((x, j) => lerp(x, b[j], k)) : lerp(a, b, k); } return K[K.length - 1][1]; };
  const win = (t, a, b, fi = .3, fo = .3) => Math.min(prog(t, a, fi, E.out), 1 - prog(t, b - fo, fo, E.inOut));
  const SI = name => { const x = new XMLHttpRequest(); x.open('GET', IMG('logos/' + name + '.svg'), false); x.send(); return (x.responseText.match(/ d="([^"]+)"/) || [])[1] || ''; };
  const mark = (name, fill, w, hh = w) => `<svg viewBox="0 0 24 24" width="${w}" height="${hh}" style="display:block"><path fill="${fill}" d="${SI(name)}"/></svg>`;
  const I = {
    up: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#0a84ff"/><path d="M12 17V7m-4.5 4.5L12 7l4.5 4.5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="#0a84ff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4 7 12l8 8"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    side: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M20.5 7v4" stroke-width="2.6" stroke-linecap="round"/></svg>',
    card: '<svg viewBox="0 0 48 32"><rect width="48" height="32" rx="5" fill="url(#cg)"/><defs><linearGradient id="cg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#2ec4ff"/><stop offset="1" stop-color="#1b3fa0"/></linearGradient></defs><rect x="6" y="9" width="9" height="7" rx="1.5" fill="#ffd36e"/></svg>',
    cursor: '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  };

  const CSS = `
  .ec { position:absolute; inset:0; background:#020509; overflow:hidden; font-family: Inter, system-ui, sans-serif; color:#fff; }
  .ec .flame { position:absolute; border-radius: 50%; filter: blur(80px); mix-blend-mode: screen; }
  .ec .stage { position:absolute; inset:0; perspective: 1800px; perspective-origin: 540px 960px; }
  .ec .cam { position:absolute; inset:0; transform-style: preserve-3d; transform-origin: 540px 960px; }
  .ec .pane { position:absolute; transform-style: preserve-3d; }
  .ec .trn { position:absolute; inset:0; transform-style: preserve-3d; }
  .ec .rim { box-shadow: 0 0 0 1.5px rgba(255,255,255,.22), 0 0 40px rgba(92,225,230,.35), 0 0 120px rgba(46,196,255,.18), inset 0 1px 0 rgba(255,255,255,.25); }
  .ec .dark { background: linear-gradient(160deg, rgba(28,32,38,.97), rgba(8,10,13,.98)); border-radius: 56px; }
  .ec .lgo { position:absolute; left: 190px; width: 700px; top: 755px; filter: drop-shadow(0 0 40px rgba(92,225,230,.55)); }
  .ec .ring { position:absolute; width: 210px; } .ec .hook { position:absolute; left:0; right:0; top: 230px; text-align:center; font-size: 66px; font-weight: 800; letter-spacing: -.01em; }
  .ec .hook span { display:inline-block; } .ec .hook .t { color: ${TEAL}; text-shadow: 0 0 30px rgba(92,225,230,.6); }
  /* chat */
  .ec .chat { width: 900px; height: 1480px; overflow: hidden; }
  .ec .chat .hd { position:absolute; left:0; right:0; top:0; height: 230px; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; padding-bottom: 22px; box-sizing:border-box; border-bottom: 1px solid rgba(255,255,255,.08); background: #181b20; z-index: 3; }
  .ec .chat .hd .bk { position:absolute; left: 34px; top: 92px; width: 54px; height: 54px; }
  .ec .chat .av { width: 110px; height: 110px; border-radius: 50%; background: radial-gradient(circle at 50% 35%, #26333a, #0b1014); display:grid; place-items:center; box-shadow: 0 0 0 2px rgba(92,225,230,.4); } .ec .chat .av img { width: 84%; }
  .ec .chat .nm { margin-top: 10px; font-size: 32px; font-weight: 600; color: rgba(255,255,255,.9); }
  .ec .bub { position:absolute; max-width: 780px; white-space: nowrap; padding: 26px 34px; border-radius: 44px; font-size: 44px; line-height: 1.25; font-weight: 500; }
  .ec .bub.me { right: 36px; background: ${BLUE}; border-bottom-right-radius: 14px; }
  .ec .bub.them { left: 36px; background: #2a2d33; border-bottom-left-radius: 14px; }
  .ec .dots { position:absolute; left: 36px; padding: 26px 32px; border-radius: 44px; background:#2a2d33; display:flex; gap: 12px; } .ec .dots i { width: 18px; height: 18px; border-radius: 50%; background: rgba(255,255,255,.6); }
  .ec .car { position:absolute; left: 36px; width: 828px; height: 920px; overflow: hidden; border-radius: 40px; } .ec .heartb { position:absolute; width: 74px; height: 74px; border-radius: 50%; background: #2a2d33; border: 4px solid #181b20; display:grid; place-items:center; } .ec .heartb svg { width: 40px; height: 40px; }
  .ec .spark { position:absolute; left: 50%; top: 50%; width: 16px; height: 16px; margin: -8px; border-radius: 50%; }
  .ec .pcard { position:absolute; top: 0; width: 600px; border-radius: 40px; overflow:hidden; background:#1c1f24; box-shadow: 0 0 0 1px rgba(255,255,255,.08); }
  .ec .pcard .im { height: 520px; background: radial-gradient(80% 80% at 50% 40%, #e9fbff, #9fe9f0 50%, #3fb6d6); display:grid; place-items:center; overflow:hidden; } .ec .pcard .im img { max-width: 80%; max-height: 88%; }
  .ec .pcard .tx2 { padding: 26px 30px 30px; } .ec .pcard b { display:block; font-size: 38px; line-height: 1.15; } .ec .pcard .pr { margin-top: 10px; font-size: 44px; font-weight: 800; color: ${TEAL}; }
  .ec .buy { position:absolute; left: 30px; right: 30px; bottom: 30px; height: 110px; color:#fff; font-size: 42px; font-weight: 700; display:flex; align-items:center; justify-content:center; } .ec .buy > * { position:relative; z-index: 6; }
  .ec .inp { z-index: 4; position:absolute; left: 30px; right: 30px; bottom: 34px; height: 116px; display:flex; align-items:center; padding: 0 20px 0 40px; box-sizing:border-box; font-size: 42px; }
  .ec .inp > * { position:relative; z-index: 6; } .ec .inp .ph { color: rgba(255,255,255,.35); } .ec .inp .caret { width: 4px; height: 56px; background: ${BLUE}; border-radius: 2px; margin-left: 2px; }
  .ec .inp .snd { margin-left: auto; width: 78px; height: 78px; flex:none; } .ec .inp .snd svg { width: 100%; height: 100%; }
  /* apple pay sheet */
  .ec .ap { width: 940px; height: 1250px; padding: 46px 50px; box-sizing:border-box; }
  .ec .ap .top { display:flex; align-items:center; justify-content:space-between; } .ec .ap .x { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,.12); display:grid; place-items:center; font-size: 34px; color: rgba(255,255,255,.7); }
  .ec .ap .mer { display:flex; align-items:center; gap: 26px; margin-top: 44px; padding-bottom: 36px; border-bottom: 1px solid rgba(255,255,255,.1); }
  .ec .ap .mer .lg2 { width: 120px; height: 120px; border-radius: 28px; background:#0b1014; display:grid; place-items:center; box-shadow: 0 0 0 1px rgba(255,255,255,.12); } .ec .ap .mer .lg2 img { width: 88%; }
  .ec .ap .mer b { font-size: 44px; display:block; } .ec .ap .mer span { font-size: 32px; color: rgba(255,255,255,.55); }
  .ec .ap .ln { display:flex; align-items:center; gap: 26px; padding: 30px 0; border-bottom: 1px solid rgba(255,255,255,.1); font-size: 36px; } .ec .ap .ln .k { width: 170px; color: rgba(255,255,255,.5); font-size: 30px; font-weight: 600; } .ec .ap .ln svg { width: 72px; height: 48px; }
  .ec .ap .ln .of { color: ${TEAL}; font-weight: 700; }
  .ec .ap .pay2 { display:flex; justify-content:space-between; align-items:baseline; padding: 34px 0; } .ec .ap .pay2 span { font-size: 36px; color: rgba(255,255,255,.6); } .ec .ap .pay2 b { font-size: 76px; letter-spacing: -.02em; }
  .ec .ap .conf { position:absolute; left: 0; right: 0; bottom: 60px; display:flex; flex-direction:column; align-items:center; gap: 22px; font-size: 34px; color: rgba(255,255,255,.75); }
  .ec .ap .fid { width: 170px; height: 170px; position:relative; }
  .ec .ap .fid svg { position:absolute; inset:0; width:100%; height:100%; }
  .ec .isl { position:absolute; left:50%; top: 46px; z-index: 36; background:#000; border-radius: 60px; overflow:hidden; box-shadow: 0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06); }
  .ec .isl .ic { position:absolute; left: 30px; top: 50%; width: 100px; height: 100px; margin-top: -50px; border-radius: 50%; background: #30d158; display:grid; place-items:center; color:#fff; } .ec .isl .ic svg { width: 60px; height: 60px; }
  .ec .isl .it2 { position:absolute; left: 160px; top: 50%; transform: translateY(-50%); white-space:nowrap; } .ec .isl .it2 b { display:block; font-size: 40px; } .ec .isl .it2 span { font-size: 30px; color: rgba(255,255,255,.6); }
  .ec .cur { position:absolute; width: 70px; height: 70px; z-index: 40; filter: drop-shadow(0 6px 10px rgba(0,0,0,.6)); }
  .ec .ripple { position:absolute; width: 120px; height: 120px; margin: -60px; border-radius:50%; border: 4px solid rgba(255,255,255,.9); z-index: 39; }
  /* end */
  .ec .end { position:absolute; inset:0; z-index: 30; }
  .ec .end .l1 { position:absolute; left:0; right:0; top: 300px; text-align:center; font-size: 150px; font-weight: 900; letter-spacing: -.03em; line-height: 1; }
  .ec .end .l2 { position:absolute; left:0; right:0; top: 470px; text-align:center; font-size: 110px; font-weight: 900; letter-spacing: -.03em; filter: drop-shadow(0 0 40px rgba(92,225,230,.45)); }
  .ec .end .l1 span, .ec .end .l2 span { display:inline-block; }
  .ec .end .row3 { position:absolute; left: 60px; right: 60px; top: 680px; display:grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
  .ec .end .jt { height: 250px; display:grid; place-items:center; } .ec .end .jt > img { position:relative; z-index: 6; width: 82%; }
  .ec .end .jt .bd { position:absolute; z-index: 7; left: 50%; bottom: -20px; transform: translateX(-50%); padding: 6px 14px; border-radius: 12px; background: linear-gradient(90deg, ${SKY}, ${TEAL}); color: #001418; font-size: 24px; font-weight: 800; white-space: nowrap; }
  .ec .end .elg { position:absolute; left: 190px; width: 700px; top: 1040px; filter: drop-shadow(0 0 30px rgba(92,225,230,.5)); }
  .ec .end .url { position:absolute; left:0; right:0; top: 1500px; text-align:center; font-size: 52px; font-weight: 800; letter-spacing: .06em; }
  `;

  SCENES.elitechat = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'ec', root), B = s.beats;
    const FL = [[TEAL, 900, 25, 18], [BLUE, 800, 80, 30], [MINT, 600, 70, 82], [SKY, 760, 20, 72]].map(([c, d, x, y]) => { const f = h('div', 'flame', R); Object.assign(f.style, { width: d + 'px', height: d * .7 + 'px', background: `radial-gradient(closest-side, ${c}, transparent)`, left: x + '%', top: y + '%', marginLeft: -d / 2 + 'px', marginTop: -d * .35 + 'px' }); return f; });
    const stage = h('div', 'stage', R), cam = h('div', 'cam', stage);
    const pane = (cls, x, y, w, hh, html = '') => { const wr = h('div', 'trn', cam); const el = h('div', 'pane ' + cls, wr, html); el._w = wr; Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px' }); return el; };
    const glassify = (el, w, hh, o = {}) => LG.make(el, { w, h: hh, r: o.r, tint: o.tint ?? 'rgba(255,255,255,.08)', scale: o.scale ?? 50 });
    const SLABS = [];
    const slab = (el, depth, rad) => { const L = []; for (let k = 0; k < 6; k++) { const d = document.createElement('div'); Object.assign(d.style, { position: 'absolute', left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height, borderRadius: rad + 'px', background: `rgb(${22 - k * 2},${40 - k * 4},${48 - k * 5})`, border: '2px solid rgba(92,225,230,.22)' }); el._w.insertBefore(d, el); L.push([d, -(k + 1) * depth / 6]); } SLABS.push([el, L]); };

    // 1. opener: the logo with eight jerseys from the shop around it
    const RING = ['miami', 'juve', 'inter', 'naples', 'flamengo', 'gala', 'benfica', 'ajax'];
    const logo = pane('', 0, 0, 1080, 1920, `<div class="hook">${'Ton maillot,'.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('')} ${'en un message.'.split('').map(c => `<span class="t">${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div>${RING.map(f => `<img class="ring" src="${IMG('img/j-' + f + '.png')}">`).join('')}<img class="lgo" src="${IMG('img/logo-light.svg')}">`);
    const ringEl = [...logo.querySelectorAll('.ring')];
    const hook = [...logo.querySelectorAll('.hook span')], lgo = logo.querySelector('.lgo');
    // 2. iMessage conversation
    const chat = pane('chat dark rim', 90, 220, 900, 1480, `<div class="hd"><div class="bk">${I.back}</div><div class="av"><img src="${IMG('img/logo-light.svg')}"></div><div class="nm">Élite Maillot</div></div>`);
    const Q = "T'as le maillot de l'Inter Miami ?";
    const inp = h('div', 'inp', chat, `<span class="tx"></span><span class="caret"></span><span class="ph">iMessage</span><span class="snd">${I.up}</span>`); glassify(inp, 840, 116, { r: 58 });
    const tx = inp.querySelector('.tx'), ph = inp.querySelector('.ph'), caret = inp.querySelector('.caret'), snd = inp.querySelector('.snd');
    const bMe = h('div', 'bub me', chat, esc(Q)); bMe.style.top = '270px';
    const dots = h('div', 'dots', chat, '<i></i><i></i><i></i>'); dots.style.top = '440px'; const dI = [...dots.querySelectorAll('i')];
    const b1 = h('div', 'bub them', chat, 'Oui, et pas que lui'); b1.style.top = '440px';
    const hb = h('div', 'heartb', b1, '<svg viewBox="0 0 24 24"><path fill="#ff375f" d="M12 21 3.5 12.9A5 5 0 0 1 12 6.1a5 5 0 0 1 8.5 6.8z"/></svg>'); Object.assign(hb.style, { right: '-40px', top: '-46px' });
    // carousel of three cards in the reply; it slides to the last one (Inter Miami), which gets bought
    const car = h('div', 'car', chat); car.style.top = '580px';
    const CARDS = [['juve', 'Maillot Juventus domicile 26/27'], ['inter', 'Maillot Inter Milan domicile 26/27'], ['miami', 'Maillot Inter Miami domicile 26/27']].map(([f, n], i) => {
      const c = h('div', 'pcard', car, `<div class="im"><img src="${IMG('img/j-' + f + '.png')}"></div><div class="tx2"><b>${esc(n)}</b><div class="pr">19,99 €</div></div>`); c.style.left = i * 628 + 'px'; c.style.height = '920px';
      const bb = h('div', 'buy', c, `<span>Acheter</span>`); glassify(bb, 540, 110, { tint: 'rgba(10,132,255,.35)', r: 55 }); c._b = bb; c._im = c.querySelector('.im img'); return c; });
    const pc = car, buy = CARDS[2]._b;
    const b2 = h('div', 'bub them', chat, 'Et 3 achetés = le 4ème offert'); b2.style.top = '1520px';
    slab(chat, 80, 56);
    // 3. Apple Pay sheet
    const ap = pane('ap dark rim', 70, 560, 940, 1250, `<div class="top">${mark('applepay', '#fff', 150, 150)}<div class="x">✕</div></div>
      <div class="mer"><div class="lg2"><img src="${IMG('img/logo-light.svg')}"></div><div><b>ÉLITE MAILLOT</b><span>elite-maillot.fr</span></div></div>
      <div class="ln"><span class="k">CARTE</span>${I.card}<span>Carte bancaire</span></div>
      <div class="ln"><span class="k">ARTICLE</span><span>Maillot Inter Miami domicile</span></div>
      <div class="ln"><span class="k">OFFRE</span><span class="of">3 achetés = 1 offert</span></div>
      <div class="pay2"><span>PAYER ÉLITE MAILLOT</span><b>19,99 €</b></div>
      <div class="conf"><div class="fid"></div><span class="cl">Confirmer avec le bouton latéral</span></div>`);
    const fid = ap.querySelector('.fid'), cl = ap.querySelector('.cl');
    const fidW = h('div', '', fid); fidW.style.cssText = 'position:absolute;inset:0';
    const SP = Array.from({ length: 18 }, (_, i) => { const p = h('div', 'spark', fid); p.style.background = [TEAL, BLUE, '#fff', MINT][i % 4]; p._a = i / 18 * Math.PI * 2; p._r = 150 + (i % 3) * 40; return p; });
    slab(ap, 70, 56);
    // overlays
    const isl = h('div', 'isl', R, `<div class="ic">${I.check}</div><div class="it2"><b>Paiement réussi</b><span>Élite Maillot · 19,99 €</span></div>`); const islIn = [...isl.querySelectorAll('.ic,.it2')];
    const cur = h('div', 'cur', R, I.cursor), rip = h('div', 'ripple', R);
    // end card
    const end = h('div', 'end', R, `<div class="l1">${'3 ACHETÉS'.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div>
      <div class="l2">${'LE 4ÈME OFFERT'.split('').map((c, i, a) => `<span style="color:rgb(${Math.round(46 + 46 * i / (a.length - 1))},${Math.round(196 + 29 * i / (a.length - 1))},${Math.round(255 - 25 * i / (a.length - 1))})">${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div><div class="row3"></div>
      <img class="elg" src="${IMG('img/logo-light.svg')}"><div class="url">ELITE-MAILLOT.FR</div>`);
    const l1 = [...end.querySelectorAll('.l1 span')], l2 = [...end.querySelectorAll('.l2 span')], row3 = end.querySelector('.row3'), elg = end.querySelector('.elg'), url = end.querySelector('.url');
    const JT = ['j-naples.png', 'j-flamengo.png', 'j-gala.png', 'j-benfica.png'].map((f, i) => h('div', 'jt', row3, `<img src="${IMG('img/' + f)}">${i === 3 ? '<div class="bd">OFFERT</div>' : ''}`));
    let jtDone = false;

    // camera: one fixed 3D angle; push-ins and vertical moves only
    const A = [-16, 8, 0];
    const CAM = [
      [0, [0, 0, 1.03, 0, 0, 0], io],
      [B.chat - .35, [0, 0, 1.0, 0, 0, 0], io],
      [B.chat, [0, -260, 1.12, ...A]],
      [B.send, [0, -300, 1.14, ...A], io],
      [B.send + .9, [0, 320, 1.12, ...A], io],
      [B.reply + 1.2, [0, 120, 1.0, ...A], io],
      [B.buy - .9, [0, -160, 1.04, ...A], io],
      [B.buy, [0, -200, 1.06, ...A], io],
      [B.pay - .1, [0, 0, .98, ...A], io],
      [B.pay + .6, [0, -60, .92, ...A], io],
      [B.fid, [0, -330, 1.1, ...A], io],
      [B.end - .1, [0, -300, 1.12, ...A], io],
      [B.end + .4, [0, 0, .74, 0, 0, 0]],
      [s.duration, [0, 0, .75, 0, 0, 0]],
    ];
    const camCss = c => `translate(${c[0]}px, ${c[1]}px) scale(${c[2]}) rotateY(${c[3]}deg) rotateX(${c[4]}deg) rotateZ(${c[5]}deg)`;
    // face ID / done ring drawn as SVG each frame
    const ring = (spin, done) => {
      if (done > 0) { const L = 2 * Math.PI * 70; return `<svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="70" fill="none" stroke="#0a84ff" stroke-width="8" stroke-dasharray="${L * done} ${L}" transform="rotate(-90 85 85)" stroke-linecap="round"/><path d="M55 88 l20 20 l40 -44" fill="none" stroke="#0a84ff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="120" stroke-dashoffset="${120 * (1 - clamp(done * 1.6 - .6))}"/></svg>`; }
      return `<svg viewBox="0 0 170 170"><g transform="rotate(${spin} 85 85)"><circle cx="85" cy="85" r="70" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="8"/><circle cx="85" cy="85" r="70" fill="none" stroke="#fff" stroke-width="8" stroke-dasharray="90 350" stroke-linecap="round"/></g><path d="M62 70v8M108 70v8M85 70v24h-6M66 108c10 9 28 9 38 0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>`;
    };

    return t => {
      cam.style.transform = camCss(kf(t, CAM));
      FL.forEach((f, i) => { f.style.transform = `translate(${Math.sin(t * .5 + i * 2) * 120}px, ${Math.cos(t * .4 + i) * 100}px) scale(${1 + Math.sin(t * .7 + i) * .12})`; f.style.opacity = .45 + .2 * Math.sin(t * .6 + i); });
      const show = (el, a, b) => {
        const w2 = el._w || el, ki = a < 0 ? 1 : prog(t, a, .38, oq), ko = prog(t, b - .22, .22, k => k * k * k), k = Math.min(ki, 1 - ko);
        w2.style.display = k > .001 ? '' : 'none'; w2.style.opacity = clamp(ki * 1.6) * (1 - ko);
        w2.style.transform = `translateZ(${(1 - ki) * -320 + ko * 380}px)`; w2.style.filter = (1 - ki) + ko > .02 ? `blur(${((1 - ki) * 6 + ko * 6).toFixed(1)}px)` : 'none';
        return k; };
      // 1. opener
      show(logo, -1, B.chat);
      hook.forEach((sp, i) => { const k = prog(t, .1 + i * .025, .35, oq); sp.style.opacity = clamp(k * 2); sp.style.transform = `translateY(${(1 - k) * -30}px)`; });
      ringEl.forEach((r, i) => { const k = prog(t, .25 + i * .09, .55, E.back), out = prog(t, B.chat - .55, .5, k2 => k2 * k2), a = (i / 8) * Math.PI * 2 - Math.PI / 2 + t * .12;
        const rx = 430 * (1 + out * .8), ry = 560 * (1 + out * .8), x = 540 + Math.cos(a) * rx - 105, y = 990 + Math.sin(a) * ry - 120;
        r.style.left = x + 'px'; r.style.top = y + 'px'; r.style.opacity = clamp(k * 2) * (1 - out); r.style.transform = `scale(${lerp(.3, 1, k) * (1 + out * .6)}) rotate(${Math.sin(a) * 8}deg)`; r.style.filter = `drop-shadow(0 20px 30px rgba(0,0,0,.6)) blur(${out * 6}px)`; });
      const lk = prog(t, .5, .8, io); lgo.style.clipPath = `inset(0 ${(1 - lk) * 100}% 0 0)`; lgo.style.transform = `scale(${lerp(1.08, 1, prog(t, .5, 1.2, oq))})`;
      // 2. chat
      show(chat, B.chat, B.pay);
      const n = Math.floor(clamp((t - B.chat - .35) / .035, 0, Q.length)), sent = t > B.send;
      tx.textContent = sent ? '' : Q.slice(0, n); ph.style.display = n && !sent ? 'none' : ''; caret.style.opacity = sent ? 0 : (Math.floor(t * 3) % 2 || n < Q.length ? 1 : 0); LG.sheen(inp, t * .3);
      snd.style.opacity = n > 0 && !sent ? 1 : .35; snd.style.transform = `scale(${1 - .15 * clamp(1 - Math.abs(t - B.send) / .1)})`;
      // shared element: the typed text rises from the field into the blue bubble
      const fk = prog(t, B.send, .5, oq); bMe.style.opacity = sent ? clamp(fk * 3) : 0; bMe.style.transform = `translateY(${(1 - fk) * 1080}px) scale(${lerp(.7, 1, fk)})`; bMe.style.transformOrigin = '100% 100%';
      const dv = win(t, B.send + .6, B.reply, .15, .1); dots.style.opacity = dv; dI.forEach((d, i) => { d.style.transform = `translateY(${Math.sin(t * 9 - i * .8) * -6}px)`; d.style.opacity = .5 + .5 * Math.max(0, Math.sin(t * 9 - i * .8)); });
      const pop = (el, a) => { const k = prog(t, a, .45, E.back); el.style.opacity = clamp(k * 2.5); el.style.transform = `scale(${lerp(.6, 1, k)})`; el.style.transformOrigin = '0 100%'; };
      pop(b1, B.reply); pop(pc, B.reply + .5); pop(b2, B.reply + 1.1);
      // the chat scrolls so the card is in view, then the bubble below
      const scroll = kf(t, [[B.reply + .4, 0, io], [B.reply + 1.4, -320, io]]);
      [bMe, dots, b1, pc, b2].forEach(el => { el.style.marginTop = scroll + 'px'; });
      const cx2 = kf(t, [[B.reply + 1.7, 0, io], [B.reply + 2.4, -628, io], [B.reply + 3.0, -628, io], [B.reply + 3.7, -1256]]);
      CARDS.forEach((c, i) => { c.style.transform = `translateX(${cx2}px)`; c._im.style.transform = `translateY(${Math.sin(t * 1.6 + i) * 8}px) rotate(${Math.sin(t * 1.2 + i) * 2}deg)`; });
      const hk = prog(t, B.reply + .7, .35, E.back); hb.style.opacity = clamp(hk * 2); hb.style.transform = `scale(${hk})`;
      buy.style.transform = `scale(${1 - .05 * clamp(1 - Math.abs(t - B.buy) / .12)})`; buy.style.boxShadow = t > B.buy ? '0 0 50px rgba(10,132,255,.7)' : ''; LG.sheen(buy, t * .3);
      // cursor taps: send, then Acheter
      const taps = [[B.send, 880, 1500, 900, 1640], [B.buy, 820, 1500, 540, 1150]];
      let cv = 0, cx = 0, cy = 0, tapT = -9;
      taps.forEach(([tt, x0, y0, x1, y1]) => { const v = win(t, tt - .8, tt + .3, .2, .2); if (v > cv) { cv = v; const kk = prog(t, tt - .7, .6, io); cx = lerp(x0, x1, kk); cy = lerp(y0, y1, kk); tapT = tt; } });
      cur.style.opacity = cv; cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; cur.style.transform = `scale(${t > tapT && t < tapT + .1 ? .85 : 1})`;
      const rpk = clamp((t - tapT) / .45); rip.style.opacity = cv > 0 && t > tapT && rpk < 1 ? 1 - rpk : 0; rip.style.left = cx + 10 + 'px'; rip.style.top = cy + 10 + 'px'; rip.style.transform = `scale(${.2 + rpk * 1.6})`;
      // 3. Apple Pay sheet rises from the bottom
      show(ap, B.pay, B.end);
      const ak = prog(t, B.pay - .1, .7, oq); ap.style.transform = `translateY(${(1 - ak) * 700}px)`;
      const done = prog(t, B.fid + 1.0, .8, io), spin = (t - B.fid) * 400;
      fidW.innerHTML = t < B.fid ? `<div style="width:100%;height:100%;display:grid;place-items:center">${I.side.replace('<svg', '<svg width="120" height="120"')}</div>` : ring(spin, done);
      cl.textContent = t < B.fid ? 'Confirmer avec le bouton latéral' : done > 0 ? 'Terminé' : 'Face ID';
      cl.style.color = done > 0 ? BLUE : '';
      SP.forEach(p => { const k = clamp((t - B.fid - 1.6) / .9); p.style.opacity = k > 0 && k < 1 ? 1 - k : 0; p.style.transform = `translate(${Math.cos(p._a) * p._r * E.outQuint(k)}px, ${Math.sin(p._a) * p._r * E.outQuint(k)}px) scale(${1 - k * .6})`; });
      const ik = Math.min(prog(t, B.fid + 1.4, .6, oq), 1 - prog(t, B.end - .6, .4, io)), iv = win(t, B.fid + 1.2, B.end - .1, .2, .2);
      isl.style.opacity = iv; isl.style.width = lerp(250, 860, ik) + 'px'; isl.style.height = lerp(72, 160, ik) + 'px'; isl.style.marginLeft = -lerp(250, 860, ik) / 2 + 'px'; islIn.forEach(x => { x.style.opacity = clamp((ik - .6) * 2.5); });
      SLABS.forEach(([el, L]) => L.forEach(([d, z]) => { d.style.transform = `${el.style.transform || ''} translateZ(${z}px)`; }));
      // end card
      const ek = prog(t, B.end, .3); end.style.opacity = ek; end.style.display = ek > 0 ? '' : 'none';
      if (ek > 0 && !jtDone) { JT.forEach(j => { j.style.position = 'relative'; LG.make(j, { w: j.offsetWidth || 220, h: 250, r: 40, tint: 'rgba(255,255,255,.07)' }); j.style.position = 'relative'; }); jtDone = true; }
      l1.forEach((sp, i) => { const k = prog(t, B.end + .1 + i * .04, .4, oq); sp.style.opacity = clamp(k * 2); sp.style.transform = `translateY(${(1 - k) * -40}px)`; });
      l2.forEach((sp, i) => { const k = prog(t, B.end + .7 + i * .035, .4, oq); sp.style.opacity = clamp(k * 2); sp.style.transform = `translateY(${(1 - k) * 40}px)`; });
      JT.forEach((j, i) => { const k = prog(t, B.end + 1.4 + i * .2, .5, oq); j.style.opacity = clamp(k * 2); j.style.transform = `perspective(900px) rotateX(${(1 - k) * -90}deg) translateY(${(1 - k) * 40}px)`; LG.sheen(j, t * .3 + i * .2); });
      const gk = prog(t, B.end + 2.5, .7, io); elg.style.clipPath = `inset(0 ${(1 - gk) * 100}% 0 0)`; url.style.opacity = prog(t, B.end + 3.1, .5);
    };
  };
})();
