// Élite Maillot — "le panier qui se remplit": one product page filmed in extreme close-ups, one continuous camera.
// image ("Une veste.") → the colour swatches ("Six couleurs.") → the cursor clicks each colour, the jacket swaps →
// "Ajouter au panier" ×3, each jacket flies into the bag icon, the counter climbs → the camera rides up to the icon
// ("Et la quatrième ?") → the 4th drops in OFFERTE → the icon opens into the cart drawer → rows, totals 159,96 →
// 119,97 → "Commander" grows until it fills the screen → logo, tagline, url. Times in spec t.
(() => {
  const { SCENES, h, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f);
  const oq = E.outQuint, io = E.inOut, bk = E.back;
  const BLUE = '#2347e0', INK = '#0d1a4a', TEAL = '#5ce1e6', LAV = '#e9ecfa';
  const COL = [['rose', 'Rose', '#f4c6d0'], ['ciel', 'Bleu ciel', '#b7d3d8'], ['nuit', 'Bleu nuit', '#1e3a66'], ['noir', 'Noir', '#1a1a1d'], ['vert', 'Vert', '#b4d3be'], ['beige', 'Beige', '#eee3cf']];
  const CSS = `
  .pn { position:absolute; inset:0; overflow:hidden; background:${LAV}; font-family: Inter, system-ui, sans-serif; color:${INK}; }
  .pn .p-cam { position:absolute; left:0; top:0; width:1080px; height:1920px; transform-origin: 0 0; }
  .pn .p-abs { position:absolute; box-sizing:border-box; }
  .pn .p-card { background:#fff; border-radius: 48px; box-shadow: 0 40px 100px rgba(30,50,150,.16), 0 0 0 1px rgba(20,40,120,.05); }
  .pn .p-img { position:absolute; background: center/contain no-repeat; }
  .pn .p-t { position:absolute; white-space: nowrap; font-weight: 700; }
  .pn .p-sw { position:absolute; width: 96px; height: 96px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
  .pn .p-size { position:absolute; width: 150px; height: 90px; border-radius: 24px; display:grid; place-items:center; font-size: 34px; font-weight: 700; box-shadow: inset 0 0 0 3px #dfe4f5; }
  .pn .p-btn { position:absolute; border-radius: 36px; background: ${BLUE}; color:#fff; font-weight: 800; display:flex; align-items:center; justify-content:center; gap: 18px; box-shadow: 0 20px 50px rgba(35,71,224,.4); white-space: nowrap; }
  .pn .p-badge { position:absolute; border-radius: 50%; background: ${BLUE}; color:#fff; font-weight: 800; display:grid; place-items:center; box-shadow: 0 0 0 5px #fff; }
  .pn .p-cur { position:absolute; width: 64px; height: 64px; z-index: 30; filter: drop-shadow(0 6px 10px rgba(0,0,40,.3)); }
  .pn .p-rip { position:absolute; width: 110px; height: 110px; margin: -55px; border-radius: 50%; border: 5px solid ${BLUE}; z-index: 29; }
  .pn .p-band { position:absolute; left:0; right:0; top:0; height: 420px; background: linear-gradient(180deg, ${LAV} 30%, rgba(233,236,250,0)); z-index: 40; pointer-events:none; }
  .pn .p-cap { position:absolute; left:0; right:0; text-align:center; font-weight: 700; letter-spacing: -.035em; line-height: 1.08; white-space: nowrap; z-index: 50; }
  .pn .p-cap .w { display:inline-block; margin: 0 .11em; }
  .pn .p-u { position:relative; display:inline-block; } .pn .p-u > i { position:absolute; left: 1%; right: 1%; bottom: -.1em; height: .07em; border-radius: .04em; background: currentColor; transform-origin: 0 50%; }
  `;
  const CURSOR = '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#0d1a4a" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  const BAG = c => `<svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`;

  SCENES.panier = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'pn', root), T = s.t, D = s.duration;
    const el = (par, cls, css = {}, html = '') => { const e = h('div', cls, par, html); Object.assign(e.style, css); return e; };
    const kfo = (t, K) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [t0, a, e2] = K[i - 1], [t1, b] = K[i], k = (e2 || io)((t - t0) / (t1 - t0)), o = {}; for (const p in a) o[p] = lerp(a[p], b[p] ?? a[p], k); return o; } return K[K.length - 1][1]; };
    const cap = (words, y, size, a, b, color = INK) => {
      const c = el(R, 'p-cap', { top: y + 'px', fontSize: size + 'px', color });
      const W = words.map(w => { const u = w.startsWith('_'), x = w.replace(/^_/, ''); const sp = h('span', 'w', c, u ? `<span class="p-u">${x}<i></i></span>` : x); sp._u = u ? sp.querySelector('i') : null; return sp; });
      return t => { const out = prog(t, b - .25, .25, io); c.style.display = t < a - .05 || out >= 1 ? 'none' : '';
        W.forEach((sp, i) => { const k = prog(t, a + i * .09, .36, oq); sp.style.opacity = clamp(k * 1.8) * (1 - out); sp.style.filter = k < 1 || out > 0 ? `blur(${(1 - k) * 14 + out * 12}px)` : 'none'; sp.style.transform = `translateY(${(1 - k) * 30 - out * 20}px)`; if (sp._u) sp._u.style.transform = `scaleX(${prog(t, a + i * .09 + .2, .4, oq)})`; }); };
    };
    const cam = el(R, 'p-cam');
    // ---- the product page
    const card = el(cam, 'p-abs p-card', { left: '60px', top: '200px', width: '960px', height: '1640px' });
    const hdr = el(cam, 'p-abs', { left: '60px', top: '40px', width: '960px', height: '120px' });
    el(hdr, '', { position: 'absolute', left: '0', top: '18px', width: '300px' }, `<img src="${IMG('logo-light.svg')}" style="width:100%;filter:invert(1) hue-rotate(180deg) brightness(.55) saturate(3)">`);
    const ICON = el(cam, 'p-abs', { left: '880px', top: '40px', width: '120px', height: '120px', borderRadius: '60px', background: '#fff', boxShadow: '0 16px 40px rgba(30,50,150,.18)', zIndex: 20, overflow: 'visible' });
    const icoSvg = el(ICON, '', { position: 'absolute', left: '28px', top: '26px' }, BAG(INK));
    const CNT = el(ICON, 'p-badge', { right: '-10px', top: '-10px', width: '56px', height: '56px', fontSize: '28px', zIndex: 3 }, '0');
    const imgBox = el(card, 'p-abs', { left: '30px', top: '30px', width: '900px', height: '900px', borderRadius: '36px', overflow: 'hidden' });
    const JI = COL.map(([f]) => el(imgBox, 'p-img', { left: '90px', top: '50px', width: '720px', height: '800px', backgroundImage: `url(${IMG('v-' + f + '.png')})`, filter: 'drop-shadow(0 30px 40px rgba(0,0,30,.25))' }));
    const offerPill = el(card, 'p-abs', { left: '60px', top: '60px', padding: '14px 26px', borderRadius: '30px', background: TEAL, color: INK, fontSize: '34px', fontWeight: 800, whiteSpace: 'nowrap', zIndex: 3 }, '3 achetées = 1 offerte');
    el(card, 'p-t', { left: '50px', top: '965px', fontSize: '64px', letterSpacing: '-.02em' }, 'Veste Brésil');
    el(card, 'p-t', { left: '50px', top: '1050px', fontSize: '60px', color: BLUE, fontWeight: 800 }, '39,99 €');
    const colLab = el(card, 'p-t', { left: '50px', top: '1150px', fontSize: '34px', color: '#6b7397', fontWeight: 600 });
    const SW = COL.map(([, , c], i) => { const w = el(card, 'p-sw', { left: (50 + i * 140) + 'px', top: '1210px', background: c }); return w; });
    const SIZES = ['S', 'M', 'L', 'XL', '2XL'].map((x, i) => el(card, 'p-size', { left: (50 + i * 172) + 'px', top: '1345px' }, x));
    const ADD = el(card, 'p-btn', { left: '50px', top: '1480px', width: '860px', height: '130px', fontSize: '46px' }, `${BAG('#fff')}<span class="lb">Ajouter au panier</span>`); const addLb = ADD.querySelector('.lb');
    // flying thumbnails (the jacket goes into the bag)
    const FLY = s.adds.map(([ci]) => el(cam, 'p-img', { width: '720px', height: '800px', backgroundImage: `url(${IMG('v-' + COL[ci][0] + '.png')})`, zIndex: 25, transformOrigin: '0 0' }));
    const F4 = el(cam, 'p-img', { width: '200px', height: '230px', backgroundImage: `url(${IMG('v-beige.png')})`, zIndex: 25 });
    const BURST = el(cam, 'p-abs', { left: '940px', top: '100px', width: '600px', height: '600px', margin: '-300px', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(92,225,230,.55), rgba(92,225,230,0))', zIndex: 19 });
    const Q = el(cam, 'p-abs', { left: '720px', top: '70px', padding: '10px 22px', borderRadius: '24px', background: INK, color: '#fff', fontSize: '40px', fontWeight: 800, zIndex: 21 }, '?');
    // drawer (the icon opens into it)
    const DR = el(cam, 'p-abs', { background: '#fff', zIndex: 22, overflow: 'hidden', boxShadow: '0 40px 100px rgba(30,50,150,.25)' });
    el(DR, 'p-t', { left: '50px', top: '50px', fontSize: '64px', fontWeight: 800 }, 'Panier');
    const ROWS = [[0, 'Rose'], [2, 'Bleu nuit'], [4, 'Vert'], [5, 'Beige']].map(([ci, n], i) => { const r = el(DR, 'p-abs', { left: '40px', right: '40px', top: (170 + i * 200) + 'px', height: '180px', borderRadius: '30px', background: '#f3f5fd' }, `<div class="p-img" style="left:18px;top:12px;width:150px;height:156px;background-image:url(${IMG('v-' + COL[ci][0] + '.png')})"></div><div class="p-t" style="left:200px;top:34px;font-size:42px">Veste Brésil</div><div class="p-t" style="left:200px;top:96px;font-size:30px;color:#8a92b2;font-weight:600">${n} · M</div><div class="p-t" style="right:34px;top:62px;font-size:46px;font-weight:800">${i === 3 ? '<s style="color:#9aa2c4;font-size:32px;margin-right:14px">39,99 €</s>0,00 €' : '39,99 €'}</div>`);
      if (i === 3) el(r, 'p-abs', { right: '30px', top: '-22px', padding: '8px 18px', borderRadius: '14px', background: TEAL, color: INK, fontSize: '28px', fontWeight: 800 }, 'OFFERTE'); return r; });
    const tl = el(DR, 'p-t', { left: '50px', top: '1010px', fontSize: '42px', color: '#6b7397', fontWeight: 600 }, 'Total · 4 vestes');
    const old = el(DR, 'p-t', { right: '50px', top: '980px', fontSize: '42px', color: '#9aa2c4', textDecoration: 'line-through' }, '159,96 €');
    const tot = el(DR, 'p-t', { right: '50px', top: '1040px', fontSize: '120px', fontWeight: 800, letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums' }, '159,96 €');
    const CMD = el(cam, 'p-btn', { fontSize: '50px', zIndex: 23 }, '<span class="lb">Commander</span>'); const cmdLb = CMD.querySelector('.lb');
    const cur = el(cam, 'p-cur', {}, CURSOR), rip = el(cam, 'p-rip');
    // end card (in screen space, on the blue fill)
    const LG = el(R, '', { position: 'absolute', left: '190px', top: '520px', width: '700px', zIndex: 60 }, `<img src="${IMG('logo-light.svg')}" style="width:100%;display:block;filter:drop-shadow(0 0 30px rgba(92,225,230,.5))">`);
    const URL = el(R, '', { position: 'absolute', left: '50%', top: '1400px', padding: '22px 44px', borderRadius: '60px', background: '#fff', color: INK, fontSize: '46px', fontWeight: 700, zIndex: 60, whiteSpace: 'nowrap' }, 'elite-maillot.fr');
    el(R, 'p-band');
    const band = R.querySelector('.p-band');

    // the cursor path: [time, x, y, click?] in page space
    const swC = i => [60 + 50 + i * 140 + 48, 200 + 1210 + 48], addC = [540, 200 + 1480 + 65], cmdC = [540, 1480];
    const CP = [[T.colors[0] - .6, 900, 1650, 0]]; T.colors.forEach((c, i) => CP.push([c, ...swC(i), 1]));
    s.adds.forEach(([ci, at, sw]) => { if (sw != null) CP.push([sw, ...swC(ci), 1]); CP.push([at, ...addC, 1]); });
    CP.push([T.cmd, ...cmdC, 1]);
    const clicks = CP.filter(c => c[3]).map(c => c[0]);
    const CAPS = s.caps.map(([w, y, sz, a, b, c]) => cap(w, y, sz, a, b, c));

    return t => {
      // ---- camera (page space focus fx, fy and scale)
      const C = kfo(t, s.cam); cam.style.transform = `translate(${540 - C.fx * C.s}px, ${960 - C.fy * C.s}px) scale(${C.s})`;
      // ---- colour state: the selected swatch (clicks first, then each add uses its colour)
      let ci = 0; T.colors.forEach((c, i) => { if (t >= c) ci = i; }); s.adds.forEach(([c2, at, sw]) => { if (sw != null && t >= sw) ci = c2; else if (sw == null && t >= at - .5) ci = c2; });
      JI.forEach((im, i) => { const on = i === ci; im.style.opacity = on ? 1 : 0; });
      const lastSw = Math.max(...[...T.colors, ...s.adds.map(a => a[2] ?? -9)].filter(x => x <= t), -9); const pk = clamp((t - lastSw) / .35);
      JI[ci].style.transform = `scale(${lerp(.9, 1, E.outQuint(pk))}) translateY(${Math.sin(t * 1.4) * 8}px)`;
      imgBox.style.background = COL[ci][2] + '55'; colLab.textContent = 'Couleur : ' + COL[ci][1];
      SW.forEach((w, i) => { w.style.boxShadow = i === ci ? `0 0 0 6px #fff, 0 0 0 11px ${BLUE}` : 'inset 0 0 0 1px rgba(0,0,0,.08)'; w.style.transform = `scale(${i === ci ? 1.08 : 1})`; });
      SIZES.forEach((z, i) => { const on = i === 1 && t > T.colors[5] + .3; z.style.background = on ? INK : '#fff'; z.style.color = on ? '#fff' : INK; });
      // ---- cursor
      const g = kfo(t, CP.map(([tt, x, y]) => [tt, { x, y }])); const vis = Math.min(prog(t, CP[0][0], .3), 1 - prog(t, T.cmd + .3, .2));
      cur.style.left = g.x + 'px'; cur.style.top = g.y + 'px'; cur.style.opacity = vis; const lc = clicks.filter(c => c <= t).pop() ?? -9; cur.style.transform = `scale(${t - lc < .1 ? .85 : 1})`;
      const rk = clamp((t - lc) / .45); rip.style.left = g.x + 10 + 'px'; rip.style.top = g.y + 10 + 'px'; rip.style.opacity = vis * (rk < 1 ? 1 - rk : 0); rip.style.transform = `scale(${.2 + rk * 1.4})`;
      const lastAdd = s.adds.map(a => a[1]).filter(x => x <= t).pop() ?? -9; ADD.style.transform = `scale(${1 - .04 * clamp(1 - Math.abs(t - lastAdd) / .12)})`; addLb.textContent = t - lastAdd < .8 ? 'Ajoutée ✓' : 'Ajouter au panier'; ADD.style.background = t - lastAdd < .8 ? '#1aa86b' : BLUE;
      // ---- jackets fly into the bag icon; counter
      s.adds.forEach(([c2, at], i) => { const f = FLY[i], k = prog(t, at + .05, .7, io); f.style.display = k > 0 && k < 1 ? '' : 'none'; const x = lerp(60 + 30 + 90, 900, k), y = lerp(200 + 30 + 50, 60, k) - Math.sin(k * Math.PI) * 120, sc = lerp(1, .1, k); f.style.left = x + 'px'; f.style.top = y + 'px'; f.style.transform = `scale(${sc}) rotate(${k * 20}deg)`; });
      const n = s.adds.filter(a => t > a[1] + .75).length, last = s.adds.map(a => a[1] + .75).filter(x => x <= t).pop() ?? -9, bb = Math.max(0, 1 - (t - last) / .3);
      const offered = t > T.offer + .45; CNT.textContent = offered ? '3+1' : n; CNT.style.width = offered ? '96px' : '56px'; CNT.style.borderRadius = '28px'; CNT.style.right = offered ? '-30px' : '-10px'; CNT.style.background = offered ? TEAL : BLUE; CNT.style.color = offered ? INK : '#fff';
      CNT.style.transform = `scale(${n || offered ? 1 + bb * .35 : 0})`; ICON.style.transform = `scale(${1 + bb * .12})`;
      // "?" then the 4th drops in, OFFERTE burst
      const qk = prog(t, T.fourth, .35, bk), qo = prog(t, T.offer, .2); Q.style.display = qk > 0 && qo < 1 ? '' : 'none'; Q.style.transform = `scale(${qk}) translateY(${Math.sin(t * 6) * 4}px)`; Q.style.opacity = 1 - qo;
      const fk = prog(t, T.offer, .45, k => k * k); F4.style.display = fk > 0 && fk < 1 ? '' : 'none'; F4.style.left = '840px'; F4.style.top = lerp(-400, 0, fk) + 'px'; F4.style.transform = `scale(${lerp(1, .3, fk)}) rotate(${fk * -15}deg)`;
      const bu = clamp((t - T.offer - .45) / .9); BURST.style.display = bu > 0 && bu < 1 ? '' : 'none'; BURST.style.opacity = 1 - bu; BURST.style.transform = `scale(${.2 + bu})`;
      // ---- the icon opens into the drawer
      const dk = prog(t, T.drawer, .7, io), dOut = prog(t, T.cmd + .1, .4, io);
      const dg = { x: lerp(880, 60, dk), y: lerp(40, 200, dk), w: lerp(120, 960, dk), h: lerp(120, 1640, dk), r: lerp(60, 48, dk) };
      DR.style.display = dk > 0 && dOut < 1 ? '' : 'none'; Object.assign(DR.style, { left: dg.x + 'px', top: dg.y + 'px', width: dg.w + 'px', height: dg.h + 'px', borderRadius: dg.r + 'px', opacity: 1 - dOut });
      ICON.style.opacity = 1 - prog(t, T.drawer, .25); [...DR.children].forEach(c => { if (!c.classList.contains('p-abs')) c.style.opacity = prog(t, T.drawer + .5, .3); });
      ROWS.forEach((r, i) => { const k = prog(t, T.drawer + .55 + i * .15, .45, bk); r.style.opacity = clamp(k * 2); r.style.transform = `translateX(${(1 - k) * 220}px)`; });
      const tk = prog(t, T.total, 1.0, io); tot.textContent = lerp(159.96, 119.97, tk).toFixed(2).replace('.', ',') + ' €'; tot.style.color = tk >= 1 ? BLUE : INK; old.style.opacity = prog(t, T.total + .9, .3); tl.style.opacity = prog(t, T.drawer + .9, .3);
      // ---- Commander: appears in the drawer, then grows to fill the screen (blue), then the end card
      const ck = prog(t, T.drawer + 1.2, .4, bk), fill = prog(t, T.cmd + .15, .8, k => k * k * (3 - 2 * k));
      const cg = { x: lerp(110, -800, fill), y: lerp(1430, -1000, fill), w: lerp(860, 2680, fill), h: lerp(120, 3900, fill), r: lerp(36, 0, fill) };
      CMD.style.display = ck > 0 ? '' : 'none'; Object.assign(CMD.style, { left: cg.x + 'px', top: cg.y + 'px', width: cg.w + 'px', height: cg.h + 'px', borderRadius: cg.r + 'px' }); CMD.style.transform = `scale(${ck * (1 - .04 * clamp(1 - Math.abs(t - T.cmd) / .12))})`; cmdLb.style.opacity = 1 - prog(t, T.cmd + .15, .2);
      band.style.opacity = 1 - prog(t, T.cmd + .2, .4);
      const lk = prog(t, T.end, .9, io); LG.style.display = t > T.end ? '' : 'none'; LG.style.clipPath = `inset(0 ${(1 - lk) * 100}% 0 0)`;
      const uk = prog(t, T.end + 1.6, .45, bk); URL.style.display = uk > 0 ? '' : 'none'; URL.style.transform = `translateX(-50%) scale(${uk})`;
      offerPill.style.transform = `scale(${1 + .05 * Math.sin(t * 3)})`;
      CAPS.forEach(f => f(t));
    };
  };
})();
