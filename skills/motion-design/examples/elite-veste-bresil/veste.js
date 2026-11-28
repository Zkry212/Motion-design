// Élite Maillot — Brésil jackets, one continuous shot led by a "gaze" dot (Trois Coups "on guide le regard"):
// the dot appears ("Regarde ici.") → opens into a lens on the crest ("Tu l'as vue ?") → the lens widens to the whole
// jacket ("La veste du Brésil.") → six colour swatches; the dot hops swatch to swatch and the jacket + background
// change colour on each word → the swatches morph into six tiles, the jacket shrinks into its tile ("Six couleurs…")
// → the dot hesitates between tiles ("laquelle ?") → it splits into three dots that pick three tiles → they slide
// into the basket's slots ("Prends-en trois…") → the fourth falls in OFFERTE → price and totals → the basket folds
// into the url pill, the logo, "Ton regard a déjà choisi." All times come from spec t (re-keyed to the real take).
(() => {
  const { SCENES, h, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f);
  const oq = E.outQuint, io = E.inOut, bk = E.back, sm = k => k * k * (3 - 2 * k);
  const BLUE = '#2347e0', INK = '#0d1a4a', TEAL = '#5ce1e6';
  const CSS = `
  .vb { position:absolute; inset:0; overflow:hidden; font-family: Inter, system-ui, sans-serif; }
  .vb .b-bg, .vb .b-glow { position:absolute; inset:0; }
  .vb .b-box { position:absolute; box-sizing:border-box; }
  .vb .b-white { background:#fff; box-shadow: 0 30px 80px rgba(10,20,80,.22), 0 0 0 1px rgba(20,40,120,.05); }
  .vb .b-img { position:absolute; background: center/contain no-repeat; }
  .vb .b-cap { position:absolute; left:0; right:0; text-align:center; font-weight: 700; letter-spacing: -.035em; line-height: 1.08; white-space: nowrap; z-index: 60; }
  .vb .b-cap .w { display:inline-block; margin: 0 .11em; }
  .vb .b-u { position:relative; display:inline-block; } .vb .b-u > i { position:absolute; left: 1%; right: 1%; bottom: -.1em; height: .07em; border-radius: .04em; background: currentColor; transform-origin: 0 50%; }
  .vb .b-pill { display:inline-block; padding: .04em .4em .1em; border-radius: 1em; border: 6px solid currentColor; }
  .vb .b-gaze { position:absolute; width: 36px; height: 36px; margin: -18px; border-radius: 50%; background: #fff; z-index: 70; box-shadow: 0 0 0 8px rgba(255,255,255,.25), 0 0 30px 6px rgba(255,255,255,.7), 0 0 80px 20px rgba(92,225,230,.45); }
  .vb .b-ring { position:absolute; width: 36px; height: 36px; margin: -18px; border-radius: 50%; border: 3px solid rgba(255,255,255,.8); z-index: 69; }
  .vb .b-txt { position:absolute; white-space: nowrap; font-weight: 700; color: ${INK}; }
  .vb .b-badge { position:absolute; width: 56px; height: 56px; border-radius: 50%; background: ${BLUE}; color:#fff; font-size: 28px; font-weight: 800; display:grid; place-items:center; box-shadow: 0 0 0 6px #fff, 0 8px 20px rgba(35,71,224,.4); }
  `;
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; };
  const COL = [['rose', 'Rose', '#f4c6d0', '#e88aa0', INK], ['ciel', 'Bleu ciel', '#b7d3d8', '#8fb6bd', INK], ['nuit', 'Bleu nuit', '#17305a', '#1e3f78', '#fff'], ['noir', 'Noir', '#141417', '#2a2a30', '#fff'], ['vert', 'Vert', '#b4d3be', '#8db89c', INK], ['beige', 'Beige', '#eee3cf', '#d9c8a6', INK]];

  SCENES.veste = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'vb', root), T = s.t, D = s.duration;
    const el = (par, cls, css = {}, html = '') => { const e = h('div', cls, par, html); Object.assign(e.style, css); return e; };
    const kfo = (t, K) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [t0, a, e2] = K[i - 1], [t1, b] = K[i], k = (e2 || io)((t - t0) / (t1 - t0)), o = {}; for (const p in a) o[p] = lerp(a[p], b[p] ?? a[p], k); for (const p in b) if (!(p in a)) o[p] = b[p]; return o; } return K[K.length - 1][1]; };
    const track = (e, K) => { const d0 = e.style.display || ''; return t => { const g = kfo(t, K); e.style.display = (g.o ?? 1) <= .003 ? 'none' : d0; e.style.left = g.x + 'px'; e.style.top = g.y + 'px'; if (g.w != null) e.style.width = g.w + 'px'; if (g.h != null) e.style.height = g.h + 'px'; if (g.r != null) e.style.borderRadius = g.r + 'px';
      e.style.opacity = g.o ?? 1; e.style.transform = `scale(${g.s ?? 1}) rotate(${g.rot ?? 0}deg)`; e.style.filter = (g.b ?? 0) > .2 ? `blur(${g.b}px)` : 'none'; return g; }; };
    const cap = (words, y, size, a, b, color) => {
      const c = el(R, 'b-cap', { top: y + 'px', fontSize: size + 'px' });
      const W = words.map(w => { const p = w.startsWith('*'), u = w.startsWith('_'), x = w.replace(/^[*_]/, ''); const sp = h('span', 'w', c, p ? `<span class="b-pill">${x}</span>` : u ? `<span class="b-u">${x}<i></i></span>` : x); sp._u = u ? sp.querySelector('i') : null; sp._p = p ? sp.firstChild : null; return sp; });
      return t => { const out = prog(t, b - .3, .3, io); c.style.display = t < a - .05 || out >= 1 ? 'none' : ''; c.style.color = typeof color === 'function' ? color(t) : color;
        W.forEach((sp, i) => { const k = prog(t, a + i * .1, .4, oq); sp.style.opacity = clamp(k * 1.8) * (1 - out); sp.style.filter = k < 1 || out > 0 ? `blur(${(1 - k) * 14 + out * 12}px)` : 'none'; sp.style.transform = `translateY(${(1 - k) * 30 - out * 20}px)`;
          if (sp._u) sp._u.style.transform = `scaleX(${prog(t, a + i * .1 + .2, .4, oq)})`; if (sp._p) { const q = prog(t, a + i * .1 + .1, .4, bk); sp._p.style.boxShadow = `0 0 ${24 * q}px rgba(255,255,255,${.6 * q})`; } }); };
    };
    const bg = el(R, 'b-bg'), glow = el(R, 'b-glow');
    const U = [];

    // colour index over time (the swatch the gaze sits on)
    const CI = t => { let c = 0; T.colors.forEach((x, i) => { if (t >= x) c = i; }); return c; };

    // ---- the jacket, seen through a lens that opens to full frame
    const LENS = el(R, 'b-box', { left: '0', top: '0', width: '1080px', height: '1920px', zIndex: 10 });
    const JK = el(LENS, 'b-box', { left: '190px', top: '360px', width: '700px', height: '870px', transformOrigin: '64% 31%' });
    const JI = COL.map(([f]) => el(JK, 'b-img', { inset: '0', backgroundImage: `url(${IMG('v-' + f + '.png')})`, filter: 'drop-shadow(0 40px 50px rgba(0,0,30,.35))' }));
    const JKtr = track(JK, [[T.grid - .05, { x: 190, y: 360, w: 700, h: 870, s: 1 }], [T.grid + .7, { x: 720 + 30, y: 920 + 30, w: 240, h: 300, s: 1 }], [T.pick3 + .3, { x: 750, y: 950, w: 240, h: 300, o: 1 }], [T.pick3 + .5, { x: 750, y: 950, w: 240, h: 300, o: 0 }]]);
    U.push(t => {
      const lr = kfo(t, [[T.lens - .01, { r: 0 }], [T.lens + .5, { r: 260 }, bk], [T.reveal, { r: 260 }], [T.reveal + .9, { r: 1500 }]]).r;
      LENS.style.clipPath = lr >= 1499 ? 'none' : `circle(${lr}px at 540px 700px)`; LENS.style.display = lr < 1 ? 'none' : '';
      const z = kfo(t, [[T.lens, { s: 3.2, y: 0 }], [T.reveal, { s: 2.6, y: 0 }], [T.reveal + 1.0, { s: 1, y: 0 }]]);
      const g = JKtr(t); if (t < T.grid) JK.style.transform = `scale(${z.s})`; JK.style.transformOrigin = '64% 31%';
      const ci = CI(t); JI.forEach((im, i) => { const since = t - (T.colors[i] ?? 99); const on = i === ci; const k = on ? prog(t, T.colors[i] || 0, .35, oq) : 0; im.style.opacity = i === ci ? (i === 0 ? 1 : clamp(k * 1.5)) : 0; im.style.transform = on && i > 0 ? `translateX(${(1 - k) * 60}px) scale(${lerp(.92, 1, k)})` : ''; });
    });
    // lens ring (the rim of the lens)
    const LR = el(R, 'b-box', { borderRadius: '50%', border: '4px solid rgba(255,255,255,.9)', boxShadow: '0 0 40px rgba(255,255,255,.6)', zIndex: 11 });
    U.push(t => { const lr = kfo(t, [[T.lens - .01, { r: 0 }], [T.lens + .5, { r: 260 }, bk], [T.reveal, { r: 260 }], [T.reveal + .9, { r: 1500 }]]).r; const vis = lr > 1 && lr < 1400; LR.style.display = vis ? '' : 'none'; Object.assign(LR.style, { left: (540 - lr) + 'px', top: (700 - lr) + 'px', width: lr * 2 + 'px', height: lr * 2 + 'px', opacity: 1 - clamp((lr - 300) / 600) }); });

    // ---- swatches → tiles
    const SW = COL.map(([f, n, c1, c2], i) => { const b = el(R, 'b-box b-white', { zIndex: 20, overflow: 'hidden' }); const dot = el(b, 'b-box', { inset: '10px', borderRadius: '50%', background: `linear-gradient(135deg, ${c1}, ${c2})` }); const im = el(b, 'b-img', { inset: '18px', backgroundImage: `url(${IMG('v-' + f + '.png')})` });
      const sx = 135 + i * 162 - 45, tx = [60, 390, 720][i % 3], ty = [500, 920][Math.floor(i / 3)];
      b._tr = track(b, [[T.swatch + i * .08, { x: sx + 45, y: 1475, w: 0, h: 0, r: 45, o: 0 }], [T.swatch + i * .08 + .4, { x: sx, y: 1430, w: 90, h: 90, r: 45, o: 1 }, bk], [T.grid, { x: sx, y: 1430, w: 90, h: 90, r: 45 }], [T.grid + .7, { x: tx, y: ty, w: 300, h: 380, r: 30 }]]);
      b._dot = dot; b._im = im; b._t = [tx, ty]; return b; });
    const BADGES = [0, 1, 2].map(i => el(R, 'b-badge', { zIndex: 30 }, i + 1));
    U.push(t => { const ci = CI(t); SW.forEach((b, i) => { const g = b._tr(t); const gk = prog(t, T.grid + .2, .5, io); b._dot.style.opacity = 1 - gk; b._im.style.opacity = gk; if (t < T.grid) b.style.boxShadow = i === ci && t > T.colors[0] - .1 ? `0 0 0 6px #fff, 0 0 0 10px ${COL[i][3]}` : ''; else b.style.boxShadow = ''; }); });

    // ---- the gaze: where it goes, the eye goes
    const G = el(R, 'b-gaze'), RG = el(R, 'b-ring');
    const swC = i => [135 + i * 162, 1475], tileC = i => [[60, 390, 720][i % 3] + 150, [500, 920][Math.floor(i / 3)] + 190];
    const GK = [[0, { x: 540, y: 960, o: 0, s: .2 }], [T.dot, { x: 540, y: 960, o: 0, s: .2 }], [T.dot + .4, { x: 540, y: 960, o: 1, s: 1 }, bk], [T.lens - .3, { x: 540, y: 700, o: 1, s: 1 }], [T.lens, { x: 540, y: 700, o: 1, s: 1.6 }], [T.lens + .2, { x: 540, y: 700, o: 0, s: 3 }],
      [T.colors[0] - .3, { x: swC(0)[0], y: swC(0)[1], o: 0, s: .5 }], [T.colors[0], { x: swC(0)[0], y: swC(0)[1], o: 1, s: 1 }, bk]];
    T.colors.slice(1).forEach((c, i) => { GK.push([c - .28, { x: swC(i)[0], y: swC(i)[1] }], [c, { x: swC(i + 1)[0], y: swC(i + 1)[1] }]); });
    GK.push([T.grid, { x: swC(5)[0], y: swC(5)[1], o: 1 }], [T.grid + .7, { x: tileC(5)[0], y: tileC(5)[1] }], [T.which, { x: tileC(5)[0], y: tileC(5)[1] }]);
    const Z = [1, 3, 0, 4, 2, 5, 1]; Z.forEach((ti, i) => GK.push([T.which + .25 + i * .32, { x: tileC(ti)[0], y: tileC(ti)[1] }]));
    GK.push([T.split - .05, { x: 540, y: 820, o: 1, s: 1 }], [T.split + .1, { x: 540, y: 820, o: 0, s: .4 }]);
    const Gtr = track(G, GK);
    // three dots after the split
    const PICK = [0, 2, 4], G3 = PICK.map(() => el(R, 'b-gaze'));
    const G3tr = G3.map((g, i) => track(g, [[T.split, { x: 540, y: 820, o: 0, s: .5 }], [T.split + .1, { x: 540, y: 820, o: 1, s: 1 }], [T.split + .55 + i * .12, { x: tileC(PICK[i])[0], y: tileC(PICK[i])[1], o: 1, s: 1 }, bk], [T.pick3, { x: tileC(PICK[i])[0], y: tileC(PICK[i])[1], o: 1, s: 1 }], [T.pick3 + .2, { x: tileC(PICK[i])[0], y: tileC(PICK[i])[1], o: 0, s: 2.5 }]]));
    U.push(t => { const g = Gtr(t); const pk = (t * 1.4) % 1; RG.style.display = G.style.display; RG.style.left = G.style.left; RG.style.top = G.style.top; RG.style.opacity = (g.o ?? 1) * (1 - pk); RG.style.transform = `scale(${1 + pk * 2.4})`; G3tr.forEach(f => f(t));
      BADGES.forEach((b, i) => { const [x, y] = tileC(PICK[i]); const k = prog(t, T.split + .7 + i * .12, .35, bk), out = prog(t, T.pick3 + .3, .3); b.style.left = (x + 110) + 'px'; b.style.top = (y - 210) + 'px'; b.style.transform = `scale(${k})`; b.style.opacity = 1 - out; b.style.display = k > 0 && out < 1 ? '' : 'none'; }); });

    // ---- basket with four slots; the three picks slide in, the fourth falls in OFFERTE
    const BK = el(R, 'b-box b-white', { zIndex: 25, borderRadius: '40px' });
    const BKtr = track(BK, [[T.pick3 - .01, { x: 60, y: 1950, w: 960, h: 520, o: 0 }], [T.pick3, { x: 60, y: 1950, w: 960, h: 520, o: 1 }], [T.pick3 + .5, { x: 60, y: 1180, w: 960, h: 520 }, oq], [T.end, { x: 60, y: 1180, w: 960, h: 520, o: 1 }], [T.end + .7, { x: 160, y: 1470, w: 760, h: 120, r: 60 }]]);
    const SLOTS = [0, 1, 2, 3].map(i => el(BK, 'b-box', { left: (30 + i * 230) + 'px', top: '30px', width: '210px', height: '270px', borderRadius: '24px', border: '3px dashed #cfd6f2' }));
    const SN = [0, 1, 2, 3].map(i => el(BK, 'b-badge', { left: (30 + i * 230 + 160) + 'px', top: '10px', width: '46px', height: '46px', fontSize: '22px' }, i < 3 ? i + 1 : '+1'));
    const b4 = SN[3]; b4.style.background = TEAL; b4.style.color = INK;
    const TOTL = el(BK, 'b-txt', { left: '40px', top: '345px', fontSize: '40px', color: '#6b7397', fontWeight: 600 }, '4 vestes');
    const OLD = el(BK, 'b-txt', { right: '40px', top: '330px', fontSize: '40px', color: '#9aa2c4', textDecoration: 'line-through' }, '159,96 €');
    const TOT = el(BK, 'b-txt', { right: '40px', top: '380px', fontSize: '96px', fontWeight: 800, letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums' }, '119,97 €');
    const URL = el(BK, 'b-txt', { left: '0', right: '0', top: '30px', textAlign: 'center', fontSize: '52px' }, 'elite-maillot.fr');
    // the three chosen tiles move into slots 1-3; the 4th jacket (beige) falls into slot 4
    U.push(t => { const g = BKtr(t); const ek = prog(t, T.end, .4); [...SLOTS, ...SN, TOTL, OLD, TOT].forEach(x => { x.style.opacity = 1 - ek; }); URL.style.opacity = prog(t, T.end + .5, .3);
      SN.forEach((n, i) => { n.style.transform = `scale(${i < 3 ? prog(t, T.pick3 + .6 + i * .1, .3, bk) : prog(t, T.offer + .3, .35, bk)})`; });
      const tk = prog(t, T.price, .8, io); TOT.textContent = lerp(0, 119.97, tk).toFixed(2).replace('.', ',') + ' €'; TOT.style.opacity = (1 - ek) * prog(t, T.price - .1, .3); OLD.style.opacity = (1 - ek) * prog(t, T.price + .6, .3); TOTL.style.opacity = (1 - ek) * prog(t, T.price, .3); TOT.style.color = tk >= 1 ? BLUE : INK; });
    U.push(t => { SW.forEach((b, i) => { b.style.zIndex = t >= T.pick3 ? 30 : 20; if (t < T.pick3) return; const slot = PICK.indexOf(i); const bkG = kfo(t, [[T.pick3, { y: 1950 }], [T.pick3 + .5, { y: 1180 }, oq], [T.end, { y: 1180 }], [T.end + .7, { y: 1470 }]]); const by = bkG.y;
        if (slot >= 0) { const k = prog(t, T.pick3 + .1 + slot * .1, .6, io), [tx, ty] = b._t, x = lerp(tx, 60 + 30 + slot * 230, k), y = lerp(ty, by + 30, k); Object.assign(b.style, { left: x + 'px', top: y + 'px', width: lerp(300, 210, k) + 'px', height: lerp(380, 270, k) + 'px', display: '' }); b.style.opacity = 1 - prog(t, T.end, .3); }
        else if (i === 5) { const k = prog(t, T.offer, .55, bk); const x = 60 + 30 + 3 * 230, y = lerp(-500, by + 30, k); Object.assign(b.style, { left: x + 'px', top: y + 'px', width: '210px', height: '270px', borderRadius: '24px', display: '' }); b.style.opacity = (t > T.offer ? 1 : 0) * (1 - prog(t, T.end, .3)); b.style.boxShadow = t > T.offer + .5 ? `0 0 0 5px ${TEAL}, 0 0 40px rgba(92,225,230,.6)` : ''; }
        else { const k = prog(t, T.pick3, .4); b.style.opacity = 1 - k; b.style.filter = `blur(${k * 12}px)`; } }); });
    const RIB = el(R, 'b-box', { padding: '10px 22px', borderRadius: '14px', background: TEAL, color: INK, fontSize: '34px', fontWeight: 800, zIndex: 35, whiteSpace: 'nowrap' }, 'OFFERTE');
    U.push(t => { const k = prog(t, T.offer + .45, .4, bk), out = prog(t, T.end, .3); RIB.style.display = k > 0 && out < 1 ? '' : 'none'; RIB.style.left = '790px'; RIB.style.top = '1440px'; RIB.style.transform = `rotate(-8deg) scale(${k})`; RIB.style.opacity = 1 - out; });
    // price pill above the basket
    const PP = el(R, 'b-box', { left: '50%', top: '1010px', padding: '18px 40px', borderRadius: '60px', background: BLUE, color: '#fff', fontSize: '58px', fontWeight: 800, whiteSpace: 'nowrap', zIndex: 36, boxShadow: '0 16px 40px rgba(35,71,224,.45)' }, '39,99 € <span style="font-weight:600;font-size:40px;opacity:.85">la veste</span>');
    U.push(t => { const k = prog(t, T.price, .4, bk), out = prog(t, T.end, .3); PP.style.display = k > 0 && out < 1 ? '' : 'none'; PP.style.transform = `translateX(-50%) scale(${k})`; PP.style.opacity = 1 - out; });
    // giant "3 + 1" between the caption and the basket — the offer is the hero
    const BIG = el(R, 'b-cap', { top: '560px', fontSize: '360px', fontWeight: 900, letterSpacing: '-.05em', color: INK, zIndex: 34 }, '<span class="w">3</span><span class="w" style="color:#2347e0">+</span><span class="w" style="color:#5ce1e6;text-shadow:0 0 50px rgba(92,225,230,.6)">1</span>');
    const BW = [...BIG.querySelectorAll('.w')];
    U.push(t => { const out = prog(t, T.end, .3); BIG.style.display = t > T.pick3 + .5 && out < 1 ? '' : 'none';
      [T.pick3 + .6, T.offer - .1, T.offer + .1].forEach((a, i) => { const k = prog(t, a, .35, bk); BW[i].style.opacity = clamp(k * 2) * (1 - out); BW[i].style.transform = `scale(${lerp(1.8, 1, clamp(k))})`; BW[i].style.filter = k < 1 ? `blur(${(1 - clamp(k)) * 14}px)` : 'none'; });
      BIG.style.transform = `translateY(${-prog(t, T.price - .2, .5, io) * 60}px) scale(${lerp(1, .8, prog(t, T.price - .2, .5, io))})`; });
    // ---- end: logo + tagline
    const LG = el(R, 'b-box', { left: '190px', top: '470px', width: '700px', zIndex: 40 }, `<img src="${IMG('logo-light.svg')}" style="width:100%;display:block;filter:drop-shadow(0 0 40px rgba(92,225,230,.5))">`);
    U.push(t => { const k = prog(t, T.end + .2, .9, io); LG.style.display = t > T.end ? '' : 'none'; LG.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`; LG.style.transform = `scale(${lerp(1.06, 1, prog(t, T.end + .2, 1.3, oq))})`; });

    // captions (the voice-over, on screen)
    const ink = t => { const ci = CI(t); return t > T.reveal && t < T.grid && (ci === 2 || ci === 3) ? '#fff' : (t < T.reveal || t > T.end - .2 ? '#fff' : INK); };
    const CAPS = [cap(['Regarde', '_ici.'], 1080, 96, T.dot, T.lens, '#fff'), cap(['Tu', "l'as", 'vue', '?'], 1080, 96, T.lens + .3, T.reveal, '#fff'),
      cap(['La', 'veste', 'du', '_Brésil.'], 180, 100, T.reveal + .3, T.colors[0], ink)];
    COL.forEach(([, n], i) => CAPS.push(cap([n + '.'], 1580, 96, T.colors[i], T.colors[i + 1] ?? T.grid, ink)));
    CAPS.push(cap(['Six', 'couleurs…'], 220, 100, T.grid, T.which, INK), cap(['une', 'seule', 'question', ':'], 220, 84, T.which - .2, T.which + 1.2, INK), cap(['_laquelle', '?'], 1420, 120, T.which + 1.2, T.split, INK),
      cap(['Et', 'si', 'tu', 'ne', 'choisissais', '_pas', '?'], 220, 80, T.split - .3, T.pick3, INK), cap(['Prends-en', '_trois…'], 220, 110, T.pick3, T.offer, INK),
      cap(['la', '4ème', 'est', '_offerte.'], 220, 110, T.offer, T.price + 1.4, INK), cap(['3', 'achetées', '=', '1', 'offerte'], 380, 64, T.offer + .6, T.end, BLUE),
      cap(['Ton', 'regard', 'a', 'déjà', '_choisi.'], 1090, 80, T.end + .8, D + 1, '#fff'));

    return t => {
      // background follows the story: night → the jacket's colour → lavender → navy
      const ci = CI(t); let col;
      if (t < T.reveal) col = '#0b1230'; else if (t < T.grid) { const c = COL[ci][2], p = COL[Math.max(0, ci - 1)][2], k = ci === 0 ? prog(t, T.reveal, .8) : prog(t, T.colors[ci], .5, io); col = ci === 0 ? mix('#0b1230', c, k) : mix(p, c, k); }
      else if (t < T.end) col = mix(COL[5][2], '#e9ecfa', prog(t, T.grid, .8, io)); else col = mix('#e9ecfa', '#0c1749', prog(t, T.end, .7, io));
      bg.style.background = col; glow.style.background = 'radial-gradient(90% 60% at 50% 40%, rgba(255,255,255,.28), rgba(255,255,255,0) 60%), radial-gradient(120% 80% at 50% 100%, rgba(0,0,30,.18), transparent 60%)';
      U.forEach(f => f(t)); CAPS.forEach(f => f(t));
    };
  };
})();
