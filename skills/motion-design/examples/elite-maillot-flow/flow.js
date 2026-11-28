// Élite Maillot — one continuous shot, no cuts: every element turns into the next one (Trois Coups references).
//  dot → search pill (types "Real Madrid") → the pill unfolds into the product card → its price flies out and grows
//  into the glowing centre pill → the pill splits into three club pills → they turn into jersey tiles → a wall of
//  tiles builds around them → one tile grows back into a card → cursor "Ajouter" → the card flies into the basket
//  icon (×3) → the icon opens into the basket panel, the 4th arrives OFFERT, total re-computes → "Commander" squashes
//  into the delivery line, the parcel rides it → the "Livré" dot grows until it fills the screen → logo, tagline,
//  and the search pill again with the url. The background colour glides between navy, royal blue and lavender white.
(() => {
  const { SCENES, h, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/' + f);
  const oq = E.outQuint, io = E.inOut, bk = E.back, sm = k => k * k * (3 - 2 * k);
  const BLUE = '#2347e0', INK = '#0d1a4a', TEAL = '#5ce1e6';
  const CSS = `
  .fl { position:absolute; inset:0; overflow:hidden; font-family: Inter, system-ui, sans-serif; }
  .fl .f-bg { position:absolute; inset:0; }
  .fl .f-glow { position:absolute; inset:0; pointer-events:none; }
  .fl .f-cam { position:absolute; left:0; top:0; width:1080px; height:1920px; transform-origin: 540px 960px; }
  .fl .f-box { position:absolute; overflow:hidden; box-sizing:border-box; }
  .fl .f-white { background:#fff; box-shadow: 0 30px 80px rgba(10,20,80,.28), 0 0 0 1px rgba(20,40,120,.06); }
  .fl .f-cap { position:absolute; left:0; right:0; text-align:center; font-weight: 700; letter-spacing: -.035em; line-height: 1.08; white-space: nowrap; }
  .fl .f-cap .w { display:inline-block; margin: 0 .11em; }
  .fl .f-pill { display:inline-block; padding: .04em .4em .1em; border-radius: 1em; border: 6px solid currentColor; }
  .fl .f-u { position:relative; display:inline-block; } .fl .f-u > i { position:absolute; left: 1%; right: 1%; bottom: -.1em; height: .07em; border-radius: .04em; background: currentColor; transform-origin: 0 50%; }
  .fl .f-img { position:absolute; background: center/contain no-repeat; }
  .fl .f-badge { position:absolute; width: 50px; height: 50px; border-radius: 50%; background: ${BLUE}; color:#fff; font-size: 26px; font-weight: 700; display:grid; place-items:center; box-shadow: 0 0 0 6px #fff; }
  .fl .f-cur { position:absolute; width: 74px; height: 74px; z-index: 50; filter: drop-shadow(0 6px 10px rgba(0,0,0,.35)); }
  .fl .f-rip { position:absolute; width: 120px; height: 120px; margin: -60px; border-radius: 50%; border: 5px solid ${BLUE}; z-index: 49; }
  .fl .f-txt { position:absolute; white-space: nowrap; font-weight: 700; color: ${INK}; }
  `;
  const CURSOR = '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#0d1a4a" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  const SEARCH = c => `<svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>`;
  const BAG = '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#0d1a4a" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
  const BOX = '<svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; };

  SCENES.flow = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'fl', root), D = s.duration;
    const el = (par, cls, css = {}, html = '') => { const e = h('div', cls, par, html); Object.assign(e.style, css); return e; };
    // keyframe track on box geometry: keys [t, {x,y,w,h,r,o,s,b,rot}, ease]
    const kfo = (t, K) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [t0, a, e2] = K[i - 1], [t1, b] = K[i], k = (e2 || io)((t - t0) / (t1 - t0)), o = {}; for (const p in a) o[p] = lerp(a[p], b[p] ?? a[p], k); for (const p in b) if (!(p in a)) o[p] = b[p]; return o; } return K[K.length - 1][1]; };
    const track = (e, K) => { const d0 = e.style.display || ''; return t => { const g = kfo(t, K); e.style.display = (g.o ?? 1) <= .003 ? 'none' : d0; e.style.left = g.x + 'px'; e.style.top = g.y + 'px'; if (g.w != null) e.style.width = g.w + 'px'; if (g.h != null) e.style.height = g.h + 'px'; if (g.r != null) e.style.borderRadius = g.r + 'px';
      e.style.opacity = g.o ?? 1; e.style.transform = `scale(${g.s ?? 1}) rotate(${g.rot ?? 0}deg)`; e.style.filter = (g.b ?? 0) > .2 ? `blur(${g.b}px)` : 'none'; return g; }; };
    const cap = (par, words, y, size, a, b, color) => {
      const c = el(par, 'f-cap', { top: y + 'px', fontSize: size + 'px', color });
      const W = words.map(w => { const p = w.startsWith('*'), u = w.startsWith('_'), x = w.replace(/^[*_]/, ''); const sp = h('span', 'w', c, p ? `<span class="f-pill">${x}</span>` : u ? `<span class="f-u">${x}<i></i></span>` : x); sp._u = u ? sp.querySelector('i') : null; sp._p = p ? sp.firstChild : null; return sp; });
      return t => { const out = prog(t, b - .3, .3, io); c.style.display = t < a - .05 || out >= 1 ? 'none' : '';
        W.forEach((sp, i) => { const k = prog(t, a + i * .12, .4, oq); sp.style.opacity = clamp(k * 1.8) * (1 - out); sp.style.filter = k < 1 || out > 0 ? `blur(${(1 - k) * 14 + out * 12}px)` : 'none'; sp.style.transform = `translateY(${(1 - k) * 30 - out * 20}px)`;
          if (sp._u) sp._u.style.transform = `scaleX(${prog(t, a + i * .12 + .2, .4, oq)})`; if (sp._p) { const q = prog(t, a + i * .12 + .1, .4, bk); sp._p.style.borderColor = `rgba(255,255,255,${q})`; sp._p.style.boxShadow = `0 0 ${24 * q}px rgba(255,255,255,${.7 * q})`; } }); };
    };
    const bg = el(R, 'f-bg'), glow = el(R, 'f-glow'), cam = el(R, 'f-cam');
    const U = [];
    const T = s.t;

    // ---- 1-2 dot → pill (types) → product card
    const P = el(cam, 'f-box f-white');
    const pIco = el(P, '', { position: 'absolute', left: '40px', top: '38px' }, SEARCH('#0d1a4a')), pTx = el(P, 'f-txt', { left: '120px', top: '34px', fontSize: '52px' }), pPh = el(P, 'f-txt', { left: '120px', top: '34px', fontSize: '52px', color: '#9aa3c7' }, 'Ton maillot…');
    const pCar = el(P, '', { position: 'absolute', top: '38px', width: '4px', height: '56px', background: BLUE });
    const pJer = el(P, 'f-img', { left: '80px', top: '150px', width: '600px', height: '560px', backgroundImage: `url(${IMG('img/real.png')})` });
    const pNm = el(P, 'f-txt', { left: '60px', top: '730px', fontSize: '40px' }, 'Maillot Real Madrid domicile 26/27');
    const pBt = el(P, '', { position: 'absolute', left: '400px', top: '840px', width: '300px', height: '100px', borderRadius: '24px', background: BLUE, color: '#fff', fontSize: '36px', fontWeight: 700, display: 'grid', placeItems: 'center' }, 'Ajouter');
    const Ptr = track(P, [[T.p0, { x: 528, y: 948, w: 24, h: 24, r: 12, o: 0 }], [T.p0 + .25, { x: 528, y: 948, w: 24, h: 24, r: 12, o: 1 }, bk], [T.p1, { x: 140, y: 895, w: 800, h: 130, r: 65, o: 1 }],
      [T.card - .05, { x: 140, y: 895, w: 800, h: 130, r: 65 }], [T.card + .6, { x: 160, y: 520, w: 760, h: 980, r: 44 }], [T.priceFly + .2, { x: 160, y: 520, w: 760, h: 980, r: 44, s: 1, o: 1, b: 0 }], [T.priceFly + .9, { x: 160, y: 520, w: 760, h: 980, r: 44, s: .55, o: 0, b: 10 }]]);
    U.push(t => { const g = Ptr(t); const q = 'Real Madrid', n = Math.floor(clamp((t - T.type) / .07, 0, q.length)); pTx.textContent = q.slice(0, n); pPh.style.display = n ? 'none' : ''; pCar.style.left = (120 + pTx.offsetWidth + 6) + 'px'; pCar.style.opacity = t < T.card && (Math.floor(t * 3) % 2 || n < q.length) ? 1 : 0;
      const shown = prog(t, T.p1 - .2, .3); [pIco, pTx, pPh].forEach(x => { x.style.opacity = shown; });
      const ck = prog(t, T.card + .3, .5, oq); pJer.style.opacity = ck; pJer.style.transform = `scale(${lerp(.8, 1, ck)})`; pNm.style.opacity = prog(t, T.card + .5, .4); const bk2 = prog(t, T.card + .7, .4, bk); pBt.style.transform = `scale(${bk2})`; });

    // ---- 3 the price tag leaves the card and becomes the big glowing pill
    const PT = el(cam, 'f-box', { display: 'grid', placeItems: 'center', fontWeight: 800, letterSpacing: '-.03em', whiteSpace: 'nowrap', borderStyle: 'solid' }, '19,99 €');
    const PTtr = track(PT, [[T.card + .8, { x: 60 + 160, y: 840 + 520, w: 300, h: 100, r: 24, o: 0, s: .6 }], [T.card + 1.1, { x: 220, y: 1360, w: 300, h: 100, r: 24, o: 1, s: 1 }, bk],
      [T.priceFly, { x: 220, y: 1360, w: 300, h: 100, r: 24 }], [T.priceFly + .8, { x: 120, y: 850, w: 840, h: 240, r: 120 }], [T.split, { x: 120, y: 850, w: 840, h: 240, r: 120, o: 1, s: 1 }], [T.split + .4, { x: 120, y: 850, w: 840, h: 240, r: 120, o: 0, s: .7 }]]);
    U.push(t => { const g = PTtr(t); const k = prog(t, T.priceFly, .8, io); PT.style.fontSize = lerp(50, 170, k) + 'px'; PT.style.background = k < .5 ? INK : `rgba(255,255,255,${lerp(1, 0, (k - .5) * 2) * 0})`; PT.style.background = mix('#121a44', '#2a4fe6', k); PT.style.color = '#fff';
      PT.style.borderWidth = lerp(0, 7, k) + 'px'; PT.style.borderColor = '#fff'; PT.style.boxShadow = `0 0 ${50 * k}px rgba(255,255,255,${.75 * k}), inset 0 0 ${30 * k}px rgba(255,255,255,${.5 * k})`; });

    // ---- 4 the pill splits into three club pills → jersey tiles → wall
    const TW = 230, TH = 290, GX = c => 30 + c * 260, GY = r => 330 + r * 320;
    const CLUBS = [['Real', 'real', 1, 2], ['Barça', 'barca', 2, 2], ['PSG', 'psg', 3, 2]];
    const Q = CLUBS.map(([nm, f, c, r], i) => { const q = el(cam, 'f-box f-white'); const lb = el(q, 'f-txt', { left: '0', right: '0', top: '22px', textAlign: 'center', fontSize: '50px' }, nm); const im = el(q, 'f-img', { left: '15px', top: '18px', width: '200px', height: '210px', backgroundImage: `url(${IMG('img/' + f + '.png')})` }); const tg = el(q, '', { position: 'absolute', left: '50%', bottom: '14px', transform: 'translateX(-50%)', padding: '5px 14px', borderRadius: '12px', background: BLUE, color: '#fff', fontSize: '26px', fontWeight: 800, whiteSpace: 'nowrap' }, '19,99 €');
      const x0 = [100, 400, 700][i]; q._tr = track(q, [[T.split, { x: 470, y: 915, w: 140, h: 110, r: 55, o: 0 }], [T.split + .45, { x: x0, y: 905, w: 280, h: 130, r: 65, o: 1 }, bk], [T.tiles, { x: x0, y: 905, w: 280, h: 130, r: 65 }], [T.tiles + .6, { x: GX(c) + 20, y: GY(r), w: TW, h: TH, r: 26 }],
        [T.grow - .05, { x: GX(c) + 20, y: GY(r), w: TW, h: TH, r: 26, o: 1, b: 0 }], ...(i === 1 ? [[T.grow + .7, { x: 160, y: 520, w: 760, h: 980, r: 44, o: 1, b: 0 }], [T.add + .15, { x: 160, y: 520, w: 760, h: 980, r: 44, s: 1, o: 1 }], [T.add + .7, { x: 160, y: 520, w: 760, h: 980, r: 44, s: .06, o: 0 }]] : [[T.grow + .5, { x: GX(c) + 20, y: GY(r), w: TW, h: TH, r: 26, o: 0, b: 12 }]])]);
      q._lb = lb; q._im = im; q._tg = tg; return q; });
    const bigBtn = el(Q[1], '', { position: 'absolute', left: '230px', top: '840px', width: '300px', height: '100px', borderRadius: '24px', background: BLUE, color: '#fff', fontSize: '36px', fontWeight: 700, display: 'grid', placeItems: 'center' }, 'Ajouter');
    const WALL = []; for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { if (r === 2 && c >= 1) continue; const f = s.jerseys[(r * 4 + c * 3) % s.jerseys.length]; const w = el(cam, 'f-box f-white', { left: (GX(c) + 20 + (r % 2 ? 0 : 0)) + 'px', top: GY(r) + 'px', width: TW + 'px', height: TH + 'px', borderRadius: '26px' }, `<div class="f-img" style="left:15px;top:18px;width:200px;height:210px;background-image:url(${IMG('img/' + f + '.png')})"></div><div style="position:absolute;left:50%;bottom:14px;transform:translateX(-50%);padding:5px 14px;border-radius:12px;background:${BLUE};color:#fff;font-size:26px;font-weight:800;white-space:nowrap">19,99 €</div>`); w._d = Math.hypot(c - 2, r - 2); WALL.push(w); }
    U.push(t => { Q.forEach((q, i) => { const g = q._tr(t); const tk = prog(t, T.tiles + .1, .5, io); q._lb.style.opacity = 1 - tk; q._im.style.opacity = tk; q._tg.style.opacity = tk;
        if (i === 1) { const gk = prog(t, T.grow, .7, io); q._im.style.left = lerp(15, 80, gk) + 'px'; q._im.style.top = lerp(18, 120, gk) + 'px'; q._im.style.width = lerp(200, 600, gk) + 'px'; q._im.style.height = lerp(210, 640, gk) + 'px'; q._tg.style.transform = `translateX(-50%) translateY(${gk * -70}px) scale(${lerp(1, 1.9, gk)})`; q._tg.style.left = lerp(50, 22, gk) + '%'; bigBtn.style.transform = `scale(${prog(t, T.grow + .6, .4, bk)})`; } });
      WALL.forEach(w => { const k = prog(t, T.wall + w._d * .12, .45, bk), out = prog(t, T.grow, .5, io); w.style.display = k <= 0 || out >= 1 ? 'none' : ''; w.style.opacity = clamp(k * 2) * (1 - out); w.style.transform = `scale(${lerp(.5, 1, k)})`; w.style.filter = out > 0 ? `blur(${out * 12}px)` : 'none'; });
      const pull = kfo(t, [[T.tiles, { s: 1.15 }], [T.wall + 1.2, { s: .92 }], [T.grow, { s: .92 }], [T.grow + .7, { s: 1 }]]); cam.style.transform = `scale(${pull.s})`; });

    // ---- 5 basket icon; cards fly into it (×3)
    const BI = el(R, 'f-box f-white', { zIndex: 40 }); const biIco = el(BI, '', { position: 'absolute', left: '27px', top: '25px' }, BAG); const biN = el(BI, 'f-badge', { right: '-8px', top: '-8px', width: '46px', height: '46px', fontSize: '24px', zIndex: 3 }, '0'); BI.style.overflow = 'visible';
    const EX = [['psg', T.add2], ['city', T.add3]].map(([f, a]) => { const c = el(R, 'f-box f-white', { zIndex: 35 }, `<div class="f-img" style="inset:20px;background-image:url(${IMG('img/' + f + '.png')})"></div>`); c._tr = track(c, [[a - .52, { x: 340, y: 1900, w: 400, h: 460, r: 34, o: 0, s: 1 }], [a - .5, { x: 340, y: 1900, w: 400, h: 460, r: 34, o: 1, s: 1 }], [a, { x: 340, y: 760, w: 400, h: 460, r: 34 }, bk], [a + .1, { x: 340, y: 760, w: 400, h: 460, r: 34, s: 1, o: 1 }], [a + .5, { x: 760, y: -40, w: 400, h: 460, r: 34, s: .1, o: 0 }]]); return c; });
    const cur = el(R, 'f-cur', {}, CURSOR), rip = el(R, 'f-rip');
    const BItr = track(BI, [[T.basket - .01, { x: 910, y: 120, w: 110, h: 110, r: 55, o: 0, s: .4 }], [T.basket + .4, { x: 910, y: 120, w: 110, h: 110, r: 55, o: 1, s: 1 }, bk], [T.panel, { x: 910, y: 120, w: 110, h: 110, r: 55 }], [T.panel + .7, { x: 110, y: 430, w: 860, h: 1080, r: 44 }]]);
    U.push(t => { BItr(t); EX.forEach(c => c._tr(t)); const n = [T.add + .6, T.add2 + .45, T.add3 + .45].filter(x => t > x).length; biN.textContent = n; const lastHit = [T.add + .6, T.add2 + .45, T.add3 + .45].filter(x => t > x).pop() ?? -9; const bb = Math.max(0, 1 - (t - lastHit) / .3);
      BI.style.transform += ` scale(${1 + bb * .25})`; biIco.style.opacity = 1 - prog(t, T.panel, .25); biN.style.opacity = 1 - prog(t, T.panel, .25);
      const cv = Math.min(prog(t, T.add - .8, .2), 1 - prog(t, T.add + .4, .2)), ck = prog(t, T.add - .7, .6, io); const cx = lerp(880, 400, ck), cy = lerp(1500, 1380, ck); cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; cur.style.opacity = cv; cur.style.transform = `scale(${t > T.add && t < T.add + .1 ? .85 : 1})`;
      const rk = clamp((t - T.add) / .45); rip.style.left = cx + 12 + 'px'; rip.style.top = cy + 12 + 'px'; rip.style.opacity = t > T.add && rk < 1 ? 1 - rk : 0; rip.style.transform = `scale(${.2 + rk * 1.4})`; });

    // ---- 6 the icon opens into the basket panel
    const ROWS = [['barca', 'FC Barcelone'], ['psg', 'Paris'], ['city', 'Manchester City'], ['bresil', 'Brésil']].map(([f, n], i) => { const r = el(BI, '', { position: 'absolute', left: '40px', right: '40px', top: (150 + i * 165) + 'px', height: '145px', borderRadius: '26px', background: '#f3f5fd' }, `<div class="f-img" style="left:14px;top:6px;width:132px;height:132px;background-image:url(${IMG('img/' + f + '.png')})"></div><div class="f-txt" style="left:180px;top:30px;font-size:40px">${n}</div><div class="f-txt" style="left:180px;top:84px;font-size:28px;color:#8a92b2;font-weight:600">Taille M</div><div class="f-txt" style="right:30px;top:50px;font-size:44px;font-weight:800">${i === 3 ? '<s style="color:#9aa2c4;font-size:30px;margin-right:12px">19,99 €</s>0,00 €' : '19,99 €'}</div>`);
      if (i === 3) el(r, '', { position: 'absolute', right: '24px', top: '-20px', padding: '6px 16px', borderRadius: '12px', background: TEAL, color: INK, fontSize: '26px', fontWeight: 800 }, 'OFFERT'); return r; });
    const pHd = el(BI, 'f-txt', { left: '50px', top: '50px', fontSize: '64px', fontWeight: 800 }, 'Panier');
    const pOld = el(BI, 'f-txt', { right: '50px', top: '760px', fontSize: '40px', color: '#9aa2c4', textDecoration: 'line-through' }, '79,96 €'), pTot = el(BI, 'f-txt', { right: '50px', top: '800px', fontSize: '90px', fontWeight: 800, letterSpacing: '-.03em' }, '59,97 €');
    const pTl = el(BI, 'f-txt', { left: '50px', top: '830px', fontSize: '40px', color: '#6b7397', fontWeight: 600 }, 'Total');
    const CB = el(R, 'f-box', { background: BLUE, color: '#fff', fontWeight: 700, display: 'grid', placeItems: 'center', zIndex: 41, whiteSpace: 'nowrap', overflow: 'hidden' }, '<span class="cbl">Commander</span>'); const cbl = CB.querySelector('.cbl');
    const CBtr = track(CB, [[T.panel + .9, { x: 150, y: 1390, w: 780, h: 100, r: 30, o: 0, s: .8 }], [T.panel + 1.2, { x: 150, y: 1390, w: 780, h: 100, r: 30, o: 1, s: 1 }, bk], [T.order + .15, { x: 150, y: 1390, w: 780, h: 100, r: 30 }], [T.order + .75, { x: 160, y: 1316, w: 760, h: 8, r: 4 }], [D, { x: 160, y: 1316, w: 760, h: 8, r: 4 }]]);
    U.push(t => { [pHd, pTl, pTot].forEach(x => { x.style.opacity = prog(t, T.panel + .5, .3); }); ROWS.forEach((r, i) => { const a = i < 3 ? T.panel + .6 + i * .15 : T.offer, k = prog(t, a, .45, bk); r.style.opacity = clamp(k * 2); r.style.transform = `translateX(${(1 - k) * 200}px)`; });
      const ok = prog(t, T.offer + .5, .8, io); pTot.textContent = (t < T.offer + .5 ? 59.97 : lerp(79.96, 59.97, ok)).toFixed(2).replace('.', ',') + ' €'; pOld.style.opacity = prog(t, T.offer + .5, .3); pTot.style.color = ok > .9 ? BLUE : INK;
      const g = CBtr(t); cbl.style.opacity = 1 - prog(t, T.order + .1, .2); CB.style.fontSize = '44px'; if (t > T.order) CB.style.boxShadow = 'none'; else CB.style.boxShadow = '0 16px 40px rgba(35,71,224,.45)';
      const pk = prog(t, T.order + .1, .5, io); BI.style.opacity = (+BI.style.opacity) * (1 - pk); if (pk > 0) BI.style.transform += ` translateY(${pk * -80}px)`; });
    // cursor on Commander
    const cur2 = el(R, 'f-cur', {}, CURSOR);
    U.push(t => { const cv = Math.min(prog(t, T.order - .8, .2), 1 - prog(t, T.order + .4, .2)), ck = prog(t, T.order - .7, .6, io); cur2.style.left = lerp(900, 560, ck) + 'px'; cur2.style.top = lerp(1700, 1410, ck) + 'px'; cur2.style.opacity = cv; cur2.style.transform = `scale(${t > T.order && t < T.order + .1 ? .85 : 1})`; });

    // ---- 7 delivery line: stops, parcel, the end dot grows to fill the screen
    const STOPS = ['Commandé', 'Expédié', 'Livré'].map((x, i) => { const d = el(R, 'f-box', { left: (160 + i * 380 - 22) + 'px', top: '1298px', width: '44px', height: '44px', borderRadius: '22px', zIndex: 42 }); const l = el(R, 'f-txt', { left: (160 + i * 380 - 130) + 'px', width: '260px', textAlign: 'center', top: '1370px', fontSize: '38px', zIndex: 42, color: '#fff' }, x); return [d, l]; });
    const LF = el(R, 'f-box', { left: '160px', top: '1316px', height: '8px', borderRadius: '4px', background: '#fff', zIndex: 42 });
    const PC = el(R, 'f-box', { width: '100px', height: '100px', borderRadius: '26px', background: '#fff', display: 'grid', placeItems: 'center', zIndex: 43, boxShadow: '0 16px 40px rgba(0,0,40,.35)' }, BOX.replace('#fff', BLUE));
    const FILL = el(R, 'f-box', { background: '#0c1749', zIndex: 44 });
    U.push(t => { const on = t > T.order + .6; const lk = prog(t, T.ride, 1.6, io);
      STOPS.forEach(([d, l], i) => { const a = T.order + .6 + i * .12, k = prog(t, a, .35, bk); d.style.display = l.style.display = t > a ? '' : 'none'; d.style.transform = `scale(${k})`; l.style.opacity = k; const lit = lk >= i / 2 - .01 && t > T.ride; d.style.background = lit ? '#fff' : 'rgba(255,255,255,.35)'; d.style.boxShadow = lit ? '0 0 0 10px rgba(255,255,255,.18)' : ''; });
      LF.style.display = t > T.ride ? '' : 'none'; LF.style.width = lk * 760 + 'px';
      PC.style.display = t > T.ride - .2 ? '' : 'none'; PC.style.left = (160 + lk * 760 - 50) + 'px'; PC.style.top = (1180 - Math.abs(Math.sin(lk * Math.PI * 3)) * 24) + 'px'; PC.style.opacity = prog(t, T.ride - .2, .3) * (1 - prog(t, T.fill, .2));
      const fk = prog(t, T.fill, .9, k => k * k * k); const rr = lerp(22, 2400, fk); FILL.style.display = t > T.fill ? '' : 'none'; Object.assign(FILL.style, { left: (920 - rr) + 'px', top: (1320 - rr) + 'px', width: rr * 2 + 'px', height: rr * 2 + 'px', borderRadius: rr + 'px' }); });

    // ---- 8 end: logo, tagline, the search pill with the url
    const LG = el(R, '', { position: 'absolute', left: '190px', top: '560px', width: '700px', zIndex: 46 }, `<img src="${IMG('img/logo-light.svg')}" style="width:100%;display:block;filter:drop-shadow(0 0 40px rgba(92,225,230,.5))">`);
    const tg1 = cap(R, ['Le', 'foot,'], 1040, 110, T.end + .7, D + 1, '#fff'), tg2 = cap(R, ['à', 'ton', '_prix.'], 1170, 110, T.end + 1.0, D + 1, '#fff');
    const SP = el(R, 'f-box f-white', { zIndex: 46 }); const spTx = el(SP, 'f-txt', { left: '120px', top: '30px', fontSize: '46px' }); el(SP, '', { position: 'absolute', left: '40px', top: '32px' }, SEARCH('#0d1a4a'));
    const SPtr = track(SP, [[T.end + 1.6, { x: 528, y: 1448, w: 24, h: 24, r: 12, o: 0 }], [T.end + 1.8, { x: 528, y: 1448, w: 24, h: 24, r: 12, o: 1 }], [T.end + 2.3, { x: 160, y: 1410, w: 760, h: 120, r: 60, o: 1 }, bk]]);
    U.push(t => { const k = prog(t, T.end, .9, io); LG.style.display = t > T.end ? '' : 'none'; LG.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`; LG.style.transform = `scale(${lerp(1.06, 1, prog(t, T.end, 1.3, oq))})`; tg1(t); tg2(t);
      [tg1, tg2]; SPtr(t); const u = 'elite-maillot.fr', n = Math.floor(clamp((t - T.end - 2.4) / .06, 0, u.length)); spTx.textContent = u.slice(0, n); });
    // captions on the way
    const CAPS = s.caps.map(([w, y, sz, a, b, c]) => cap(R, w, y, sz, a, b, c)); CAPS.forEach(c => { c; });
    const capEls = [...R.querySelectorAll('.f-cap')]; capEls.forEach(c => { c.style.zIndex = 45; });

    return t => {
      // background glides: dark → navy → blue → lavender → blue (→ navy fill at the end)
      const c = kfo(t, s.bgKeys.map(([tt, col]) => [tt, { k: 0, col }])); let base = s.bgKeys[0][1];
      for (let i = 1; i < s.bgKeys.length; i++) { const [t0, c0] = s.bgKeys[i - 1], [t1, c1] = s.bgKeys[i]; if (t <= t0) { base = c0; break; } if (t <= t1) { base = mix(c0, c1, sm((t - t0) / (t1 - t0))); break; } base = c1; }
      bg.style.background = base; glow.style.background = `radial-gradient(90% 60% at 50% 42%, rgba(255,255,255,.22), rgba(255,255,255,0) 60%), radial-gradient(120% 80% at 50% 100%, rgba(0,0,30,.25), transparent 60%)`;
      U.forEach(f => f(t)); CAPS.forEach(f => f(t));
    };
  };
})();
