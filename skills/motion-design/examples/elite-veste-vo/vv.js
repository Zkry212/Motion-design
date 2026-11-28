// Élite Maillot — Brésil jackets, keyed word by word to the ElevenLabs take (spec t), one continuous shot adapted
// from Trois Coups "On guide le regard":
//  warm close-up → floating card among grey cards on dark silk, badge ① "en premier." → the card comes forward as the
//  stage turns royal blue ("La veste du Brésil.") → six chips; on every colour word the jacket swaps, a ring jumps to
//  the chip and a glass pill with the name flies out → "Six couleurs." the chips morph into a 3×2 grid on lavender,
//  the jacket lands in its tile → "tu n'arrives pas à choisir": a ring hops from tile to tile drawing the eye path
//  → "Alors ne choisis pas.": badges ①②③ → "Prends-en trois": the picks slide into the basket, "3 + 1", the 4th
//  flies in OFFERTE → blue, "39,99 €" pill, totals 159,96 → 119,97 → navy, basket folds into the url pill, logo,
//  "Le foot, à ton prix."
(() => {
  const { SCENES, h, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f);
  const oq = E.outQuint, io = E.inOut, bk = E.back, sm = k => k * k * (3 - 2 * k);
  const BLUE = '#2347e0', INK = '#0d1a4a', TEAL = '#5ce1e6';
  const COL = [['rose', 'Rose'], ['ciel', 'Bleu ciel'], ['nuit', 'Bleu nuit'], ['noir', 'Noir'], ['vert', 'Vert'], ['beige', 'Beige']];
  const CSS = `
  .vv { position:absolute; inset:0; overflow:hidden; font-family: Inter, system-ui, sans-serif; }
  .vv .q-bg, .vv .q-glow { position:absolute; inset:0; }
  .vv .q-abs { position:absolute; box-sizing:border-box; }
  .vv .q-card { background:#fff; box-shadow: 0 34px 80px rgba(10,20,80,.3), 0 0 0 1px rgba(20,40,120,.05); overflow:hidden; }
  .vv .q-img { position:absolute; background: center/contain no-repeat; }
  .vv .q-cap { position:absolute; left:0; right:0; text-align:center; font-weight: 700; letter-spacing: -.035em; line-height: 1.06; white-space: nowrap; z-index: 60; }
  .vv .q-cap .w { display:inline-block; margin: 0 .11em; }
  .vv .q-pill { display:inline-block; padding: .04em .42em .1em; border-radius: 1em; border: 6px solid currentColor; }
  .vv .q-u { position:relative; display:inline-block; } .vv .q-u > i { position:absolute; left:1%; right:1%; bottom:-.1em; height:.07em; border-radius:.04em; background: currentColor; transform-origin: 0 50%; }
  .vv .q-chip { position:absolute; padding: 16px 30px; border-radius: 40px; font-size: 38px; font-weight: 600; color:#fff; background: rgba(255,255,255,.16); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.45), 0 10px 30px rgba(0,0,40,.25); white-space: nowrap; z-index: 40; }
  .vv .q-badge { position:absolute; width: 60px; height: 60px; border-radius: 50%; background: ${BLUE}; color:#fff; font-size: 30px; font-weight: 800; display:grid; place-items:center; box-shadow: 0 0 0 6px #fff, 0 8px 20px rgba(35,71,224,.4); z-index: 45; }
  .vv .q-silk { position:absolute; inset:-20%; }
  .vv svg.q-path { position:absolute; inset:0; width:100%; height:100%; z-index: 44; pointer-events:none; }
  .vv .q-txt { position:absolute; white-space: nowrap; font-weight: 700; color: ${INK}; }
  `;
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; };

  SCENES.vv = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'vv', root), T = s.t, D = s.duration;
    const el = (par, cls, css = {}, html = '') => { const e = h('div', cls, par, html); Object.assign(e.style, css); return e; };
    const kfo = (t, K) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [t0, a, e2] = K[i - 1], [t1, b] = K[i], k = (e2 || io)((t - t0) / (t1 - t0)), o = {}; for (const p in a) o[p] = lerp(a[p], b[p] ?? a[p], k); return o; } return K[K.length - 1][1]; };
    const place = (e, g) => { e.style.display = (g.o ?? 1) <= .003 ? 'none' : ''; Object.assign(e.style, { left: g.x + 'px', top: g.y + 'px', width: g.w + 'px', height: g.h + 'px', borderRadius: (g.r ?? 30) + 'px', opacity: g.o ?? 1 }); };
    const cap = (words, y, size, a, b, color) => {
      const c = el(R, 'q-cap', { top: y + 'px', fontSize: size + 'px' });
      const W = words.map(w => { const p = w.startsWith('*'), u = w.startsWith('_'), x = w.replace(/^[*_]/, ''); const sp = h('span', 'w', c, p ? `<span class="q-pill">${x}</span>` : u ? `<span class="q-u">${x}<i></i></span>` : x); sp._p = p ? sp.firstChild : null; sp._u = u ? sp.querySelector('i') : null; return sp; });
      const at = i => Array.isArray(a) ? a[i] : a + i * .09, end = b;
      return t => { const out = prog(t, end - .25, .25, io); c.style.display = t < at(0) - .05 || out >= 1 ? 'none' : ''; c.style.color = typeof color === 'function' ? color(t) : color;
        W.forEach((sp, i) => { const k = prog(t, at(i), .38, oq); sp.style.opacity = clamp(k * 1.8) * (1 - out); sp.style.filter = k < 1 || out > 0 ? `blur(${(1 - k) * 14 + out * 12}px)` : 'none'; sp.style.transform = `translateY(${(1 - k) * 30 - out * 20}px)`;
          if (sp._p) { const q = prog(t, at(i) + .1, .45, bk); sp._p.style.boxShadow = `0 0 ${30 * q}px rgba(255,255,255,${.75 * q}), inset 0 0 ${24 * q}px rgba(255,255,255,${.45 * q})`; }
          if (sp._u) sp._u.style.transform = `scaleX(${prog(t, at(i) + .2, .4, oq)})`; }); };
    };
    const bg = el(R, 'q-bg'), glow = el(R, 'q-glow');
    // ambient: soft blurred cards drifting up in depth, all the time
    const AMB = Array.from({ length: 16 }, (_, i) => { const w = 90 + (i * 37) % 120; const a = el(R, 'q-abs', { width: w + 'px', height: w * .75 + 'px', borderRadius: '22px', background: 'rgba(255,255,255,.55)', left: ((i * 263) % 1000) + 'px' }); a._s = .5 + (i % 4) * .35; a._y = (i * 431) % 1920; a._b = 4 + (i % 3) * 5; return a; });
    // colour splash behind the card on every colour word
    const SPL = [0, 1, 2, 3, 4, 5].map(() => el(R, 'q-abs', { borderRadius: '50%', zIndex: 15 }));
    const PAST = ['#f4c6d0', '#b7d3d8', '#5b7fc0', '#5a5a66', '#b4d3be', '#eee3cf'];
    const F = [];

    // ---- 0: dark silk + grey jacket cards floating in depth
    const silk = el(R, 'q-silk'); silk.innerHTML = `<svg viewBox="0 0 1400 2400" width="100%" height="100%" preserveAspectRatio="none"><defs><linearGradient id="qsg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#cfd6ff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="qsb"><feGaussianBlur stdDeviation="14"/></filter></defs>${Array.from({ length: 7 }, (_, i) => `<path d="M-100 ${300 + i * 300} C 400 ${100 + i * 300}, 900 ${600 + i * 300}, 1500 ${250 + i * 300}" stroke="url(#qsg)" stroke-width="${70 - i * 6}" fill="none" filter="url(#qsb)" opacity="${.5 - i * .04}"/>`).join('')}</svg>`;
    const FLOAT = COL.concat(COL.slice(0, 3)).map(([f], i) => { const sz = [200, 160, 230, 150, 190, 170, 210, 140, 180][i]; const c = el(R, 'q-abs q-card', { width: sz + 'px', height: sz * 1.15 + 'px', borderRadius: '20px', left: [40, 840, 780, 60, 880, 380, 620, 280, 30][i] + 'px', top: [150, 130, 1560, 1480, 880, 80, 1300, 1720, 980][i] + 'px', background: '#e8e8ea' }, `<div class="q-img" style="inset:10px;background-image:url(${IMG('bw-' + f + '.png')})"></div>`); c._d = i % 3; return c; });
    silk.style.display = 'none'; FLOAT.forEach(c => c.remove()); if (0) F.push(t => { const out = prog(t, T.veste - .3, .6, io); silk.style.opacity = 1 - out; silk.style.transform = `translate(${Math.sin(t * .3) * 40}px, ${-t * 20}px) rotate(-8deg)`;
      FLOAT.forEach((c, i) => { const k = prog(t, .5 + i * .05, .6, oq); c.style.opacity = k * .55 * (1 - out); c.style.display = (1 - out) <= 0 ? 'none' : ''; c.style.transform = `translate(${Math.sin(t * .4 + i) * 20}px, ${-t * (14 + c._d * 14) - out * 300 * (c._d + 1)}px) scale(${lerp(.6, 1, k)})`; c.style.filter = `blur(${[1, 4, 7][c._d]}px)`; }); });

    // ---- the main jacket card (close-up → floating card → hero → colours → into its tile)
    const M = el(R, 'q-abs q-card', { zIndex: 20 });
    const close = el(M, 'q-img', { inset: '0', backgroundImage: `url(${IMG('close.jpg')})`, backgroundSize: 'cover' });
    const warm = el(M, 'q-abs', { inset: '0', background: 'linear-gradient(170deg, rgba(255,255,255,0) 25%, rgba(255,90,20,.9) 52%, rgba(255,190,40,.85) 66%, rgba(255,255,255,0) 88%)', mixBlendMode: 'multiply' });
    const MJ = COL.map(([f]) => el(M, 'q-img', { inset: '6%', backgroundImage: `url(${IMG('v-' + f + '.png')})` }));
    const B1 = el(R, 'q-badge', {}, '1');
    const tileXY = i => [[60, 390, 720][i % 3], [560, 980][Math.floor(i / 3)]];
    const MK = [[0, { x: 330, y: 560, w: 420, h: 520, r: 30 }], [T.veste, { x: 330, y: 560, w: 420, h: 520, r: 30 }],
      [T.veste + .7, { x: 220, y: 420, w: 640, h: 780, r: 40 }], [T.six, { x: 220, y: 420, w: 640, h: 780, r: 40 }], [T.six + .7, { x: tileXY(5)[0], y: tileXY(5)[1], w: 300, h: 380, r: 30, o: 1 }], [T.six + .75, { x: tileXY(5)[0], y: tileXY(5)[1], w: 300, h: 380, r: 30, o: 0 }]];
    const CI = t => { let c = 0; T.colors.forEach((x, i) => { if (t >= x) c = i; }); return c; };
    close.style.display = warm.style.display = 'none';
    const DOT = el(R, 'q-abs', { width: '34px', height: '34px', margin: '-17px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 8px rgba(255,255,255,.25), 0 0 40px 10px rgba(255,255,255,.7)', zIndex: 25 });
    const OLs = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); OLs.setAttribute('class', 'q-path'); OLs.setAttribute('viewBox', '0 0 1080 1920'); R.appendChild(OLs); OLs.style.zIndex = 24;
    OLs.innerHTML = '<rect x="330" y="560" width="420" height="520" rx="30" fill="none" stroke="#fff" stroke-width="6" pathLength="1000" stroke-dasharray="1000" style="filter:drop-shadow(0 0 12px rgba(255,255,255,.9))"/>'; const OLr = OLs.querySelector('rect');
    const RIP0 = el(R, 'q-abs', { borderRadius: '50%', border: '4px solid rgba(255,255,255,.8)', zIndex: 24 });
    F.push(t => { const g = kfo(t, MK); place(M, g);
      // the dot appears, runs once round the card drawing its outline, then the card fills and the jacket rises in
      const dk = prog(t, .05, .3, bk), run = prog(t, .3, .55, io), fillk = prog(t, .8, .3, io); const per = 2 * (420 + 520), d = run * per;
      let px, py; if (d < 420) { px = 330 + d; py = 560; } else if (d < 940) { px = 750; py = 560 + (d - 420); } else if (d < 1360) { px = 750 - (d - 940); py = 1080; } else { px = 330; py = 1080 - (d - 1360); }
      if (t < .3) { px = 540; py = 820; } DOT.style.left = px + 'px'; DOT.style.top = py + 'px'; DOT.style.display = t < 1.15 ? '' : 'none'; DOT.style.transform = `scale(${dk * (1 - prog(t, .85, .3))})`;
      OLr.setAttribute('stroke-dashoffset', 1000 - run * 1000); OLs.style.display = t < T.veste + .1 ? '' : 'none'; OLs.style.opacity = 1 - fillk;
      M.style.background = `rgba(255,255,255,${t < T.veste + .5 ? fillk : 1})`; M.style.boxShadow = fillk > .5 ? '' : 'none';
      const rp = clamp((t - T.premier) / .6); RIP0.style.display = rp > 0 && rp < 1 ? '' : 'none'; Object.assign(RIP0.style, { left: (750 - 20 - rp * 80) + 'px', top: (560 - 20 - rp * 80) + 'px', width: (40 + rp * 160) + 'px', height: (40 + rp * 160) + 'px', opacity: 1 - rp });
      const ci = CI(t); MJ.forEach((m, i) => { const on = t > .7 && i === ci; const since = t - (i ? T.colors[i] : .7); m.style.opacity = on ? clamp(since / .3) : 0; m.style.transform = on ? (i ? `scale(${lerp(.88, 1, E.outQuint(clamp(since / .4)))})` : `translateY(${(1 - E.outQuint(clamp(since / .6))) * 120}px)`) : ''; m.style.filter = on && !i && since < .6 ? `blur(${(1 - since / .6) * 10}px)` : 'none'; });
      const bk1 = prog(t, T.premier, .35, bk), bo = prog(t, T.veste, .3); B1.style.display = bk1 > 0 && bo < 1 ? '' : 'none'; B1.style.left = (g.x + g.w - 40) + 'px'; B1.style.top = (g.y - 20) + 'px'; B1.style.transform = `scale(${bk1 * (1 - bo)})`; });

    // ---- chips (colours) → grid tiles
    const CH = COL.map(([f], i) => { const c = el(R, 'q-abs q-card', { zIndex: 21 }); const im = el(c, 'q-img', { inset: '8%', backgroundImage: `url(${IMG('v-' + f + '.png')})` }); c._im = im; return c; });
    const RING = el(R, 'q-abs', { border: '6px solid #fff', boxShadow: '0 0 30px rgba(255,255,255,.8)', zIndex: 22 });
    const NP = COL.map(([, n], i) => el(R, 'q-chip', {}, n));
    const NPpos = [[60, 260], [700, 300], [40, 1560], [760, 1600], [380, 1700], [420, 190]];
    const chipXY = i => [52 + i * 165, 1290];
    F.push(t => { const ci = CI(t);
      CH.forEach((c, i) => { const a = T.colors[0] - .35 + i * .06; const K = [[a, { x: chipXY(i)[0] + 75, y: 1380, w: 0, h: 0, r: 20, o: 0 }], [a + .4, { x: chipXY(i)[0], y: chipXY(i)[1], w: 150, h: 180, r: 22, o: 1 }], [T.six, { x: chipXY(i)[0], y: chipXY(i)[1], w: 150, h: 180, r: 22, o: 1 }], [T.six + .7, { x: tileXY(i)[0], y: tileXY(i)[1], w: 300, h: 380, r: 30, o: 1 }]];
        const g = kfo(t, K); if (t >= T.pick) return; place(c, g); c.style.transform = t < T.six && i === ci && t > T.colors[0] ? 'translateY(-18px)' : ''; });
      const rv = t > T.colors[0] - .1 && t < T.six; RING.style.display = rv ? '' : 'none';
      if (rv) { const rx = kfo(t, T.colors.map((c, i) => [c, { x: chipXY(i)[0] - 12 }])).x; place(RING, { x: rx, y: chipXY(0)[1] - 12 - 18, w: 174, h: 204, r: 30 }); }
      NP.forEach((p, i) => { const a = T.colors[i], k = prog(t, a, .5, oq), out = prog(t, T.six, .35); p.style.display = k > 0 && out < 1 ? '' : 'none'; const [x0, y0] = [chipXY(i)[0], 1290], [x1, y1] = NPpos[i]; p.style.left = lerp(x0, x1, k) + 'px'; p.style.top = lerp(y0, y1, k) + Math.sin(t * 1.3 + i) * 8 + 'px'; p.style.opacity = clamp(k * 2) * (1 - out) * .95; p.style.filter = out > 0 ? `blur(${out * 10}px)` : 'none'; }); });

    // ---- eye path on the grid (ring hops tile to tile, a line follows)
    const SV = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); SV.setAttribute('class', 'q-path'); SV.setAttribute('viewBox', '0 0 1080 1920'); R.appendChild(SV);
    const HOPS = [5, 1, 3, 0, 4, 2, 5, 1]; SV.innerHTML = `<polyline id="pl" fill="none" stroke="${BLUE}" stroke-width="5" stroke-dasharray="14 12" stroke-linecap="round"/>`; const PL = SV.querySelector('#pl');
    const RG2 = el(R, 'q-abs', { border: `7px solid ${BLUE}`, boxShadow: '0 0 0 8px rgba(35,71,224,.15)', zIndex: 23 });
    const tc = i => [tileXY(i)[0] + 150, tileXY(i)[1] + 190];
    F.push(t => { const a = T.hesit, dt = (T.pick - .1 - a) / HOPS.length; const vis = t > a - .05 && t < T.pick; RG2.style.display = SV.style.display = vis ? '' : 'none'; if (!vis) return;
      const n = clamp((t - a) / dt, 0, HOPS.length - 1), j = Math.floor(n), f = io(n - j), A = tc(HOPS[j]), B = tc(HOPS[Math.min(j + 1, HOPS.length - 1)]); const x = lerp(A[0], B[0], f), y = lerp(A[1], B[1], f);
      place(RG2, { x: x - 165, y: y - 205, w: 330, h: 410, r: 36 }); const pts = HOPS.slice(0, j + 1).map(tc).concat([[x, y]]).slice(-4); PL.setAttribute('points', pts.map(p => p.join(',')).join(' ')); SV.style.opacity = .8; });

    // ---- picks, basket, offer
    const PICK = [0, 2, 4];
    const BADGE = PICK.map((_, i) => el(R, 'q-badge', {}, i + 1));
    const BK = el(R, 'q-abs q-card', { zIndex: 19, borderRadius: '40px' });
    const SLOTS = [0, 1, 2, 3].map(i => el(BK, 'q-abs', { left: (30 + i * 230) + 'px', top: '30px', width: '210px', height: '270px', borderRadius: '24px', border: '3px dashed #cfd6f2' }));
    const SN = [0, 1, 2, 3].map(i => el(R, 'q-badge', { width: '52px', height: '52px', fontSize: '24px', zIndex: 47 }, i < 3 ? i + 1 : '+1')); SN[3].style.background = TEAL; SN[3].style.color = INK;
    const TL = el(BK, 'q-txt', { left: '40px', top: '345px', fontSize: '40px', color: '#6b7397', fontWeight: 600 }, '4 vestes');
    const OLD = el(BK, 'q-txt', { right: '40px', top: '330px', fontSize: '40px', color: '#9aa2c4', textDecoration: 'line-through' }, '159,96 €');
    const TOT = el(BK, 'q-txt', { right: '40px', top: '380px', fontSize: '96px', fontWeight: 800, letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums' }, '159,96 €');
    const URL = el(BK, 'q-txt', { left: '0', right: '0', top: '30px', textAlign: 'center', fontSize: '50px' }, 'elite-maillot.fr');
    const RIB = el(R, 'q-abs', { padding: '10px 22px', borderRadius: '14px', background: TEAL, color: INK, fontSize: '34px', fontWeight: 800, zIndex: 46, whiteSpace: 'nowrap' }, 'OFFERTE');
    const BIG = el(R, 'q-cap', { top: '520px', fontSize: '330px', fontWeight: 900, letterSpacing: '-.05em', color: INK, zIndex: 35 }, `<span class="w">3</span><span class="w" style="color:${BLUE}">+</span><span class="w" style="color:${TEAL};text-shadow:0 0 50px rgba(92,225,230,.6)">1</span>`); const BW = [...BIG.querySelectorAll('.w')];
    const PRICE = el(R, 'q-cap', { top: '640px', fontSize: '190px', color: '#fff', zIndex: 36 }, '<span class="q-pill">39,99 €</span>'); const PRp = PRICE.firstChild;
    const LAV = el(R, 'q-cap', { top: '880px', fontSize: '70px', color: '#fff', zIndex: 36 }, 'la veste');
    const BKK = [[T.trois - .4, { x: 60, y: 1960, w: 960, h: 520, r: 40, o: 1 }], [T.trois, { x: 60, y: 1300, w: 960, h: 520, r: 40 }, oq], [T.end, { x: 60, y: 1300, w: 960, h: 520, r: 40 }], [T.end + .45, { x: 160, y: 1440, w: 760, h: 120, r: 60 }]];
    F.push(t => { const bg2 = kfo(t, BKK); if (t > T.trois - .4) place(BK, bg2); else BK.style.display = 'none';
      const ek = prog(t, T.end, .25); [...SLOTS, ...SN, TL, OLD, TOT].forEach(x => { x.style.opacity = 1 - ek; }); URL.style.opacity = prog(t, T.end + .25, .3);
      SN.forEach((n, i) => { const k = i < 3 ? prog(t, T.trois + .45 + i * .15, .3, bk) : prog(t, T.offerte + .6, .35, bk); n.style.display = k > 0 && ek < 1 && t > T.trois - .4 ? '' : 'none'; n.style.left = (60 + 30 + i * 230 + 175) + 'px'; n.style.top = (bg2.y + 8) + 'px'; n.style.transform = `scale(${k})`; });
      const tk = prog(t, T.price + .8, 1.0, io); TOT.textContent = lerp(159.96, 119.97, tk).toFixed(2).replace('.', ',') + ' €'; TOT.style.color = tk >= 1 ? BLUE : INK; TOT.style.opacity = (1 - ek) * prog(t, T.price + .5, .3); OLD.style.opacity = (1 - ek) * prog(t, T.price + 1.6, .3); TL.style.opacity = (1 - ek) * prog(t, T.price + .5, .3);
      // tiles: picks get badges, then slide into slots; the 4th (beige, tile 5) flies in OFFERTE; the others fade
      CH.forEach((c, i) => { if (t < T.pick) return; const [tx, ty] = tileXY(i), slot = PICK.indexOf(i), by = bg2.y;
        if (slot >= 0) { const k = prog(t, T.trois + slot * .15, .55, io); place(c, { x: lerp(tx, 90 + slot * 230, k), y: lerp(ty, by + 30, k), w: lerp(300, 210, k), h: lerp(380, 270, k), r: lerp(30, 24, k), o: 1 - ek }); c.style.zIndex = 30; c.style.opacity = (1 - ek) * (t > T.end + .3 ? 0 : 1); c.style.filter = 'none'; }
        else if (i === 5) { const k = prog(t, T.offerte + .1, .6, bk); const fromY = -420; if (t < T.offerte + .1) { const q = prog(t, T.pick + .2, .4); place(c, { x: tx, y: ty, w: 300, h: 380, r: 30, o: (1 - q * .65) * (1 - prog(t, T.trois, .4)) }); return; } place(c, { x: 90 + 3 * 230, y: lerp(fromY, by + 30, k) - Math.sin(clamp(k) * Math.PI) * 260, w: lerp(300, 210, clamp(k)), h: lerp(380, 270, clamp(k)), r: 24, o: 1 - ek }); c.style.zIndex = 31; c.style.filter = 'none'; c.style.boxShadow = t > T.offerte + .7 ? `0 0 0 5px ${TEAL}, 0 0 40px rgba(92,225,230,.6)` : ''; const dim = t > T.pick && t < T.offerte + .1 ? .35 : 1; c.style.opacity = (1 - ek) * dim; }
        else { const k = prog(t, T.pick + .2, .4); place(c, { x: tx, y: ty, w: 300, h: 380, r: 30, o: (1 - k * .65) * (1 - prog(t, T.trois, .4)) }); } });
      BADGE.forEach((b, i) => { const [x, y] = tileXY(PICK[i]), k = prog(t, T.pick + .15 + i * .2, .35, bk), out = prog(t, T.trois, .3); b.style.display = k > 0 && out < 1 ? '' : 'none'; b.style.left = (x + 260) + 'px'; b.style.top = (y - 22) + 'px'; b.style.transform = `scale(${k * (1 - out)})`; });
      const rk = prog(t, T.offerte + .7, .35, bk), ro = prog(t, T.end, .3); RIB.style.display = rk > 0 && ro < 1 ? '' : 'none'; RIB.style.left = '800px'; RIB.style.top = (bg2.y + 250) + 'px'; RIB.style.transform = `rotate(-8deg) scale(${rk})`; RIB.style.opacity = 1 - ro;
      const bo = prog(t, T.price - .2, .4, io); BIG.style.display = t > T.trois + .2 && bo < 1 ? '' : 'none'; [T.trois + .3, T.offerte - .1, T.offerte + .25].forEach((a, i) => { const k = prog(t, a, .35, bk); BW[i].style.opacity = clamp(k * 2) * (1 - bo); BW[i].style.transform = `scale(${lerp(1.8, 1, clamp(k))})`; BW[i].style.filter = k < 1 ? `blur(${(1 - clamp(k)) * 14}px)` : 'none'; });
      const pk = prog(t, T.price, .45, bk), po = prog(t, T.end, .35); PRICE.style.display = LAV.style.display = pk > 0 && po < 1 ? '' : 'none'; PRICE.style.transform = `scale(${lerp(.5, 1, clamp(pk))})`; PRICE.style.opacity = clamp(pk * 2) * (1 - po); const q = clamp(pk); PRp.style.boxShadow = `0 0 ${30 * q}px rgba(255,255,255,${.8 * q}), inset 0 0 ${24 * q}px rgba(255,255,255,${.45 * q})`;
      const lk = prog(t, T.price + .5, .4, oq); LAV.style.opacity = lk * (1 - po); LAV.style.transform = `translateY(${(1 - lk) * 20}px)`; });
    // ---- end: logo
    const LG = el(R, 'q-abs', { left: '190px', top: '500px', width: '700px', zIndex: 50 }, `<img src="${IMG('logo-light.svg')}" style="width:100%;display:block;filter:drop-shadow(0 0 30px rgba(92,225,230,.55))">`);
    F.push(t => { const k = prog(t, T.end + .1, .9, io); LG.style.display = t > T.end ? '' : 'none'; LG.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`; LG.style.transform = `scale(${lerp(1.06, 1, prog(t, T.end, 1.3, oq))})`; });

    // ---- extra motion layer
    const SPK = Array.from({ length: 16 }, (_, i) => el(R, 'q-abs', { width: '16px', height: '16px', margin: '-8px', borderRadius: '50%', background: i % 3 ? TEAL : '#fff', zIndex: 48 }));
    const SPK2 = Array.from({ length: 12 }, (_, i) => el(R, 'q-abs', { width: '12px', height: '12px', margin: '-6px', borderRadius: '50%', background: '#fff', zIndex: 48 }));
    PRp.style.position = 'relative'; PRp.style.overflow = 'hidden'; const shine = el(PRp, 'q-abs', { top: '-20%', bottom: '-20%', width: '30%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.7), transparent)', filter: 'blur(4px)' });
    LG.style.overflow = 'hidden'; const lshine = el(LG, 'q-abs', { top: '-20%', bottom: '-20%', width: '30%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.75), transparent)', mixBlendMode: 'overlay', filter: 'blur(6px)' });
    F.push(t => {
      const light = t > T.six + .3 && t < T.price - .2;
      AMB.forEach((a, i) => { const y = ((a._y - t * 60 * a._s) % 2100 + 2100) % 2100 - 120; a.style.top = y + 'px'; a.style.transform = `translateX(${Math.sin(t * .4 + i) * 30}px) rotate(${Math.sin(t * .3 + i) * 8}deg)`; a.style.filter = `blur(${a._b}px)`; a.style.opacity = light ? .5 : .14; a.style.background = light ? 'rgba(120,140,255,.18)' : 'rgba(255,255,255,.55)'; });
      // splash + card wiggle on each colour word
      T.colors.forEach((c, i) => { const k = clamp((t - c) / .9), sp = SPL[i]; sp.style.display = k > 0 && k < 1 ? '' : 'none'; const r = 60 + E.outQuint(k) * 700; Object.assign(sp.style, { left: (540 - r) + 'px', top: (810 - r) + 'px', width: r * 2 + 'px', height: r * 2 + 'px', background: PAST[i], opacity: (1 - k) * .55 }); });
      const lastC = Math.max(-9, ...T.colors.filter(c => c <= t)), wk = clamp((t - lastC) / .5), wig = t < T.six && t > T.colors[0] ? Math.sin(wk * Math.PI * 2) * (1 - wk) * 14 : 0;
      M.style.transform = `perspective(1400px) rotateY(${wig + (t > 1 && t < T.six ? Math.sin(t * .9) * 5 : 0)}deg) rotateX(${t > 1 && t < T.six ? Math.cos(t * .7) * 3 : 0}deg)`;
      // grid: tiles float in a wave
      if (t > T.six + .7 && t < T.pick) CH.forEach((c, i) => { c.style.transform = `translateY(${Math.sin(t * 2.2 + i * .9) * 10}px) rotate(${Math.sin(t * 1.4 + i) * 1.2}deg)`; });
      // landing squash in the basket
      CH.forEach((c, i) => { const slot = PICK.indexOf(i), land = slot >= 0 ? T.trois + slot * .15 + .55 : i === 5 ? T.offerte + .7 : null; if (land == null || t < land || t > land + .4) return; const q = (t - land) / .4; c.style.transform = `scaleY(${1 - Math.sin(q * Math.PI) * .12}) scaleX(${1 + Math.sin(q * Math.PI) * .06})`; c.style.transformOrigin = '50% 100%'; });
      // burst on the offered jacket
      const bt = T.offerte + .7; SPK.forEach((p, i) => { const k = clamp((t - bt) / .8), a = i / 16 * Math.PI * 2, r = E.outQuint(k) * (140 + (i % 3) * 50), cx = 60 + 30 + 3 * 230 + 105, cy = 1300 + 165; p.style.display = k > 0 && k < 1 ? '' : 'none'; p.style.left = cx + Math.cos(a) * r + 'px'; p.style.top = cy + Math.sin(a) * r + 'px'; p.style.opacity = 1 - k; p.style.transform = `scale(${1 - k * .6})`; });
      // sparkles round the price pill + shine sweeps
      SPK2.forEach((p, i) => { const k = clamp((t - T.price - .2 - (i % 4) * .08) / .9), a = i / 12 * Math.PI * 2, r = 330 + E.outQuint(k) * 120; p.style.display = k > 0 && k < 1 ? '' : 'none'; p.style.left = 540 + Math.cos(a) * r * 1.2 + 'px'; p.style.top = 740 + Math.sin(a) * r * .45 + 'px'; p.style.opacity = Math.sin(k * Math.PI); });
      shine.style.left = lerp(-40, 130, prog(t, T.price + .4, .8, io)) + '%'; lshine.style.left = lerp(-40, 130, prog(t, T.end + 1.1, .9, io)) + '%';
    });
    const ink = t => (t < T.six + .2 || t > T.price - .3 ? '#fff' : INK);
    const CAPS = [cap(["Tu", "l'as", 'remarquée'], 1500, 96, [T.c1, T.c1 + .25, T.c1 + .45], T.veste, '#fff'), cap(['_en', '_premier.'], 1620, 110, [T.premier, T.premier + .2], T.veste, '#fff'),
      cap(['La', 'veste', 'du', '*Brésil.'], 200, 110, [T.veste, T.veste + .2, T.veste + .4, T.veste + .55], T.colors[0], '#fff')];
    COL.forEach(([, n], i) => CAPS.push(cap([n + '.'], 1540, 100, T.colors[i], T.colors[i + 1] ?? T.six, '#fff')));
    CAPS.push(cap(['Six', '*couleurs.'], 200, 120, [T.six + .35, T.six + .55], T.hesit, INK), cap(['Et', 'tu', "n'arrives", 'pas', 'à', '_choisir.'], 260, 80, T.hesit, T.pick, INK),
      cap(['Alors', 'ne', 'choisis', '_pas.'], 260, 96, [T.pick, T.pick + .2, T.pick + .4, T.pick + .6], T.trois, INK), cap(['Prends-en', '_trois,'], 260, 110, [T.trois, T.trois + .35], T.offerte, INK),
      cap(['la', '4ème', 'est', '_offerte.'], 260, 110, [T.offerte, T.offerte + .25, T.offerte + .5, T.offerte + .7], T.price, INK),
      cap(['Le', 'foot,'], 1040, 110, [T.foot, T.foot + .2], D + 1, '#fff'), cap(['à', 'ton', '*prix.'], 1170, 110, [T.prix, T.prix + .15, T.prix + .3], D + 1, '#fff'));

    return t => {
      let col = s.bg[0][1]; for (let i = 1; i < s.bg.length; i++) { const [t0, c0] = s.bg[i - 1], [t1, c1] = s.bg[i]; if (t <= t0) { col = c0; break; } if (t <= t1) { col = mix(c0, c1, sm((t - t0) / (t1 - t0))); break; } col = c1; }
      bg.style.background = col; glow.style.background = 'radial-gradient(90% 60% at 50% 40%, rgba(255,255,255,.22), rgba(255,255,255,0) 60%), radial-gradient(120% 80% at 50% 100%, rgba(0,0,30,.25), transparent 60%)';
      F.forEach(f => f(t)); CAPS.forEach(f => f(t));
    };
  };
})();
