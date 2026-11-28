// Élite Maillot — voice-over ad mixing the three Trois Coups references, 9:16. Every caption and move is keyed to a
// time in spec.scenes[0].t (estimated from the script, re-keyed to the real take with voice.words.json later).
//  1 warm close-up → floating card among cards in depth, "Ce maillot-là… tu le veux."
//  2 a price tag that shakes, a progress bar that stalls, "hmm…" bubbles, "Mais le prix… te freine."
//  3 the logo, then the price counting up into a glowing pill, glass pills around, "Chez Élite Maillot, …"
//  4 Real / Barça / PSG swap in a pill with their jersey · 5 a wall of jersey cards with 19,99 € tags cascading
//  6 a basket: three jerseys drop in, a fourth arrives with an OFFERT ribbon, the total re-computes
//  7 three steps: cursor taps the card, the button turns "Commandé ✓", a parcel rides a timeline to "Livré"
//  8 end card: logo, "Le foot, à ton prix.", a search field typing the url.
(() => {
  const { SCENES, h, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/' + f);
  const oq = E.outQuint, io = E.inOut, bk = E.back;
  const BLUE = '#2347e0', INK = '#0d1a4a', TEAL = '#5ce1e6';
  const CSS = `
  .vo { position:absolute; inset:0; overflow:hidden; background:#05070f; font-family: Inter, system-ui, sans-serif; }
  .vo .v-sc { position:absolute; inset:0; overflow:hidden; display:none; }
  .vo .v-dark { background: radial-gradient(90% 70% at 50% 40%, #191c26 0%, #07080d 70%); }
  .vo .v-navy { background: radial-gradient(90% 60% at 50% 45%, #1a2c78 0%, #0c1749 55%, #060b26 100%); }
  .vo .v-blue { background: radial-gradient(90% 60% at 50% 40%, #4f74ff 0%, #2a4fe6 45%, #1a33b8 100%); }
  .vo .v-light { background: radial-gradient(90% 60% at 50% 40%, #ffffff 0%, #eef0fb 50%, #dde2f5 100%); }
  .vo .v-cap { position:absolute; left: 0; right: 0; text-align:center; font-weight: 700; letter-spacing: -.035em; line-height: 1.08; white-space: nowrap; }
  .vo .v-cap .w { display:inline-block; margin: 0 .11em; }
  .vo .v-pill { display:inline-block; padding: .04em .4em .1em; border-radius: 1em; border: 6px solid #fff; box-shadow: 0 0 26px rgba(255,255,255,.8), inset 0 0 26px rgba(255,255,255,.55); }
  .vo .v-u { position:relative; display:inline-block; } .vo .v-u > i { position:absolute; left: 1%; right: 1%; bottom: -.1em; height: .07em; border-radius: .04em; background: ${BLUE}; transform-origin: 0 50%; }
  .vo .v-u.lt > i { background: #8aa4ff; }
  .vo .v-card { position:absolute; border-radius: 30px; background:#fff; box-shadow: 0 30px 70px rgba(10,20,80,.25), 0 0 0 1px rgba(20,40,120,.06); }
  .vo .v-img { position:absolute; border-radius: 22px; background: #f1f3fb center/80% no-repeat; }
  .vo .v-float { position:absolute; border-radius: 18px; background: center/cover no-repeat; box-shadow: 0 20px 40px rgba(0,0,0,.5); }
  .vo .v-badge { position:absolute; width: 50px; height: 50px; border-radius: 50%; background: ${BLUE}; color:#fff; font-size: 26px; font-weight: 700; display:grid; place-items:center; box-shadow: 0 0 0 6px #fff, 0 6px 18px rgba(35,71,224,.45); }
  .vo .v-btn { position:absolute; border-radius: 22px; background: ${BLUE}; color:#fff; font-weight: 700; display:flex; align-items:center; justify-content:center; gap: 14px; white-space: nowrap; box-shadow: 0 16px 40px rgba(35,71,224,.45); }
  .vo .v-gp { position:absolute; padding: 18px 32px; border-radius: 40px; font-size: 38px; font-weight: 600; color: rgba(255,255,255,.95); background: rgba(255,255,255,.14); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.35), 0 10px 30px rgba(0,0,30,.25); white-space: nowrap; }
  .vo .v-bub { position:absolute; padding: 28px 44px; border-radius: 50px; background:#fff; color:${INK}; font-size: 56px; font-weight: 600; box-shadow: 0 16px 40px rgba(30,50,150,.18); white-space: nowrap; }
  .vo .v-bar { position:absolute; height: 40px; border-radius: 20px; background: #dfe4f7; overflow:hidden; } .vo .v-bar i { display:block; height: 100%; border-radius: 13px; background: ${BLUE}; }
  .vo .v-tag { position:absolute; padding: 34px 60px; border-radius: 40px; font-size: 150px !important; background: linear-gradient(180deg, #1b2457, #121a44); color:#fff; font-size: 96px; font-weight: 800; letter-spacing: -.03em; box-shadow: 0 30px 70px rgba(0,0,40,.35); white-space: nowrap; }
  .vo .v-tile { position:absolute; width: 230px; height: 300px; border-radius: 26px; background: linear-gradient(180deg, #fff, #eef1ff); box-shadow: 0 16px 40px rgba(30,50,150,.18); }
  .vo .v-tile img { position:absolute; left: 10%; top: 6%; width: 80%; } .vo .v-tile span { position:absolute; left: 50%; bottom: 14px; transform: translateX(-50%); padding: 6px 16px; border-radius: 14px; background: ${BLUE}; color:#fff; font-size: 26px; font-weight: 800; white-space: nowrap; }
  .vo .v-cur { position:absolute; width: 74px; height: 74px; z-index: 30; filter: drop-shadow(0 6px 10px rgba(0,0,0,.35)); }
  .vo .v-rip { position:absolute; width: 120px; height: 120px; margin: -60px; border-radius: 50%; border: 5px solid ${BLUE}; z-index: 29; }
  .vo .v-silk { position:absolute; inset: -20%; }
  .vo .v-srch { position:absolute; left: 140px; right: 140px; height: 120px; border-radius: 60px; background:#fff; display:flex; align-items:center; gap: 22px; padding: 0 40px; color: ${INK}; font-size: 46px; font-weight: 600; box-shadow: 0 0 0 6px rgba(255,255,255,.2), 0 20px 60px rgba(0,0,0,.4); }
  .vo .v-flash { position:absolute; inset:0; z-index: 70; pointer-events:none; background: rgba(255,255,255,.2); }
  `;
  const CURSOR = '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#0d1a4a" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  const BOX = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/></svg>';
  const PIN = '<svg viewBox="0 0 24 24"><path fill="#2347e0" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
  const SEARCH = '<svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="#0d1a4a" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

  SCENES.vo = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'vo', root), T = s.t, C = s.cuts;
    const scene = cls => h('div', 'v-sc ' + cls, R);
    const el = (par, cls, css = {}, html = '') => { const e = h('div', cls, par, html); Object.assign(e.style, css); return e; };
    // caption: words like "*key" (pill), "_key" (underline); each word gets its own time (array) or a start + stagger
    const cap = (par, words, y, size, color, times, ul = '') => {
      const c = el(par, 'v-cap', { top: y + 'px', fontSize: size + 'px', color });
      const W = words.map(w => { const p = w.startsWith('*'), u = w.startsWith('_'), x = w.replace(/^[*_]/, '');
        const sp = h('span', 'w', c, p ? `<span class="v-pill">${x}</span>` : u ? `<span class="v-u ${ul}">${x}<i></i></span>` : x); sp._p = p ? sp.firstChild : null; sp._u = u ? sp.querySelector('i') : null; return sp; });
      const at = i => Array.isArray(times) ? times[i] : times + i * .12;
      return t => W.forEach((sp, i) => { const a = at(i), k = prog(t, a, .4, oq); sp.style.opacity = clamp(k * 1.8); sp.style.filter = k < 1 ? `blur(${(1 - k) * 14}px)` : 'none'; sp.style.transform = `translateY(${(1 - k) * 30}px)`;
        if (sp._p) { const q = prog(t, a + .1, .45, bk); sp._p.style.borderColor = `rgba(255,255,255,${q})`; sp._p.style.boxShadow = `0 0 ${26 * q}px rgba(255,255,255,${.8 * q}), inset 0 0 ${26 * q}px rgba(255,255,255,${.55 * q})`; }
        if (sp._u) sp._u.style.transform = `scaleX(${prog(t, a + .2, .4, oq)})`; });
    };
    const badge = (par, n, x, y) => el(par, 'v-badge', { left: x + 'px', top: y + 'px' }, n);
    const pop = (e, t, a, base = '') => { const k = prog(t, a, .4, bk); e.style.transform = `${base} scale(${k})`; e.style.opacity = clamp(k * 3); return k; };
    const rise = (e, t, a, dy = 80, base = '') => { const k = prog(t, a, .5, oq); e.style.opacity = clamp(k * 1.6); e.style.transform = `${base} translateY(${(1 - k) * dy}px)`; return k; };
    const silk = par => { const sv = el(par, 'v-silk'); sv.innerHTML = `<svg viewBox="0 0 1400 2400" width="100%" height="100%" preserveAspectRatio="none"><defs><linearGradient id="vsg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#cfd6ff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="vsb"><feGaussianBlur stdDeviation="14"/></filter></defs>${Array.from({ length: 7 }, (_, i) => `<path d="M-100 ${300 + i * 300} C 400 ${100 + i * 300}, 900 ${600 + i * 300}, 1500 ${250 + i * 300}" stroke="url(#vsg)" stroke-width="${70 - i * 6}" fill="none" filter="url(#vsb)" opacity="${.5 - i * .04}"/>`).join('')}</svg>`; return sv; };
    const U = [];

    // 1 — warm close-up → floating card among cards in depth
    { const sc = scene('v-dark'), a = C[0]; const sv = silk(sc);
      const FL = ['bw-barca', 'bw-milan', 'bw-psg', 'bw-arsenal', 'bw-portugal', 'bw-manu', 'bw-city', 'bw-france'].map((f, i) => { const sz = [210, 170, 240, 150, 200, 180, 220, 140][i];
        const p = el(sc, 'v-float', { width: sz + 'px', height: sz * 1.05 + 'px', backgroundImage: `url(${IMG('photo/' + f + '.jpg')})`, left: [40, 830, 760, 70, 880, 330, 600, 300][i] + 'px', top: [160, 140, 1560, 1480, 900, 90, 1250, 1720][i] + 'px' }); p._d = i % 3; return p; });
      const ph = el(sc, 'v-float', { backgroundImage: `url(${IMG('photo/close.jpg')})`, backgroundSize: 'cover' });
      el(ph, '', { position: 'absolute', inset: '0', borderRadius: 'inherit', background: 'linear-gradient(170deg, rgba(255,255,255,0) 25%, rgba(255,90,20,.95) 52%, rgba(255,190,40,.9) 66%, rgba(255,255,255,0) 88%)', mixBlendMode: 'multiply' });
      const c1 = cap(sc, ['Ce', 'maillot-là…'], 1250, 110, '#fff', [T.a1, T.a1 + .25]), c2 = cap(sc, ['tu', 'le', '_veux.'], 1390, 130, '#fff', [T.a2, T.a2 + .12, T.a2 + .24], 'lt');
      U.push([sc, t => { const dt = t - a; sv.style.transform = `translate(${Math.sin(t * .3) * 40}px, ${-dt * 20}px) rotate(-8deg)`;
        const k = prog(t, T.a1 - .2, 1.0, io); Object.assign(ph.style, { left: lerp(0, 190, k) + 'px', top: lerp(0, 380, k) + 'px', width: lerp(1080, 700, k) + 'px', height: lerp(1920, 760, k) + 'px', borderRadius: lerp(0, 36, k) + 'px' });
        FL.forEach((p, i) => { const fk = prog(t, T.a1 + .4 + i * .05, .6, oq); p.style.opacity = fk * .6; p.style.transform = `translate(${Math.sin(t * .4 + i) * 20}px, ${-dt * (10 + p._d * 12)}px) scale(${lerp(.6, 1, fk)})`; p.style.filter = `blur(${[1, 4, 7][p._d]}px)`; });
        c1(t); c2(t); }]); }
    // 2 — the price holds you back
    { const sc = scene('v-light'), a = C[1];
      const tag = el(sc, 'v-tag', { left: '50%', top: '330px' }, '€€€');
      const bar = el(sc, 'v-bar', { left: '140px', width: '800px', top: '700px' }, '<i></i>'), bi = bar.firstChild;
      const B1 = el(sc, 'v-bub', { left: '130px', top: '960px' }, 'hmm…'), B2 = el(sc, 'v-bub', { left: '560px', top: '1060px' }, 'trop cher…'), B3 = el(sc, 'v-bub', { left: '250px', top: '1170px' }, '<span style="letter-spacing:.2em">•••</span>');
      const c1 = cap(sc, ['Mais', 'le', '_prix…'], 1420, 110, INK, [T.b1, T.b1 + .15, T.b1 + .3]), c2 = cap(sc, ['te', 'freine.'], 1550, 110, INK, [T.b2, T.b2 + .15]);
      U.push([sc, t => { const k = prog(t, a, .5, bk); const sh = t > T.b2 ? Math.sin(t * 60) * 10 * Math.max(0, 1 - (t - T.b2) / .5) : 0;
        tag.style.opacity = clamp(k * 2); tag.style.transform = `translateX(calc(-50% + ${sh}px)) rotate(${-4 + sh * .3}deg) scale(${lerp(.6, 1, k)})`;
        bar.style.opacity = prog(t, a + .2, .3); bi.style.width = lerp(0, 68, prog(t, a + .3, 1.2, oq)) + '%'; bi.style.background = t > T.b2 ? '#e0485a' : BLUE;
        [B1, B2, B3].forEach((b, i) => pop(b, t, a + .6 + i * .3)); c1(t); c2(t); }]); }
    // 3 — Élite Maillot: the price counts into a glowing pill
    { const sc = scene('v-blue'), a = C[2];
      const lg = el(sc, '', { position: 'absolute', left: '240px', top: '330px', width: '600px' }, `<img src="${IMG('img/logo-light.svg')}" style="width:100%;display:block;filter:drop-shadow(0 0 30px rgba(92,225,230,.5))">`);
      const P = [['Real Madrid', 70, 1250], ['Barça', 760, 1210], ['PSG', 120, 1480], ['Arsenal', 690, 1520], ['Milan', 420, 1660]].map(([x, l, tp]) => el(sc, 'v-gp', { left: l + 'px', top: tp + 'px' }, x));
      const pr = el(sc, 'v-cap', { top: '880px', fontSize: '180px', color: '#fff' }, '<span class="v-pill" style="font-variant-numeric:tabular-nums">0,00 €</span>');
      const c1 = cap(sc, ['Chez', 'Élite', 'Maillot,'], 760, 70, '#fff', [T.c1, T.c1 + .15, T.c1 + .3]);
      U.push([sc, t => { const k = prog(t, T.c1 - .2, .9, io); lg.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`; c1(t);
        const pk = prog(t, T.c2, .45, bk); pr.style.opacity = clamp(pk * 2); pr.style.transform = `scale(${lerp(.5, 1, pk)})`;
        const v = lerp(0, 19.99, prog(t, T.c2, 1.2, oq)); pr.firstChild.textContent = v.toFixed(2).replace('.', ',') + ' €'; const q = prog(t, T.c2 + .1, .45, bk); pr.firstChild.style.borderColor = `rgba(255,255,255,${q})`;
        P.forEach((p, i) => { const g = prog(t, T.c2 + .5 + i * .1, .5, oq); p.style.opacity = g * .85; p.style.filter = `blur(${(i % 2 ? 2 : 0) + (1 - g) * 8}px)`; p.style.transform = `translateY(${Math.sin(t * 1.3 + i) * 10 + (1 - g) * 40}px)`; }); }]); }
    // 4 — Real. Barça. PSG.
    { const sc = scene('v-blue'), a = C[3];
      const NM = [['Real.', 'real', T.d1], ['Barça.', 'barca', T.d2], ['PSG.', 'psg', T.d3]];
      const JI = NM.map(([, f]) => el(sc, '', { position: 'absolute', left: '190px', top: '380px', width: '700px', height: '700px', background: `url(${IMG('img/' + f + '.png')}) center/contain no-repeat`, filter: 'drop-shadow(0 40px 60px rgba(0,0,50,.5))' }));
      const W = NM.map(([w]) => el(sc, 'v-cap', { top: '1200px', fontSize: '160px', color: '#fff' }, `<span class="v-pill">${w}</span>`));
      U.push([sc, t => { let j = 0; NM.forEach((n, i) => { if (t >= n[2] - .05) j = i; }); const lk = clamp((t - NM[j][2] + .05) / .5), e = E.outQuint(lk);
        JI.forEach((im, i) => { im.style.display = i === j ? '' : 'none'; }); JI[j].style.transform = `scale(${lerp(.8, 1.02, e)}) rotate(${(1 - e) * (j % 2 ? 8 : -8)}deg)`;
        W.forEach((w, i) => { w.style.display = i === j ? '' : 'none'; }); W[j].style.filter = e < 1 ? `blur(${(1 - e) * 12}px)` : 'none'; W[j].style.transform = `translateY(${(1 - e) * 40}px)`; }]); }
    // 5 — wall of jersey cards, every tag at 19,99 €
    { const sc = scene('v-light'), a = C[4], J = s.jerseys;
      const wall = el(sc, '', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
      const TL = []; for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) { const i = r * 4 + c; const tl = el(wall, 'v-tile', { left: (40 + c * 255 + (r % 2) * 40 - 20) + 'px', top: (560 + r * 330) + 'px' }, `<img src="${IMG('img/' + J[(i * 5) % J.length] + '.png')}"><span>19,99 €</span>`); TL.push(tl); }
      const c1 = cap(sc, ['Tous', 'tes', 'clubs,'], 200, 110, INK, [T.e1, T.e1 + .15, T.e1 + .3]), c2 = cap(sc, ['au', '_même', '_prix.'], 340, 110, INK, [T.e2, T.e2 + .15, T.e2 + .3]);
      U.push([sc, t => { wall.style.transform = `translateY(${-(t - a) * 70}px)`; TL.forEach((tl, i) => { const k = prog(t, a + .05 + ((i * 7) % 24) * .035, .45, bk); tl.style.opacity = clamp(k * 2); tl.style.transform = `scale(${lerp(.5, 1, k)}) rotate(${(1 - k) * (i % 2 ? 6 : -6)}deg)`; });
        c1(t); c2(t); }]); }
    // 6 — basket: three drop in, the fourth is offered, the total re-computes
    { const sc = scene('v-navy'), a = C[5];
      const bk2 = el(sc, 'v-card', { left: '90px', top: '760px', width: '900px', height: '760px' });
      el(bk2, '', { position: 'absolute', left: '50px', top: '40px', fontSize: '56px', fontWeight: 800, color: INK }, 'Panier');
      const SL = ['arsenal', 'milan', 'argentine', 'bresil'].map((f, i) => { const c = el(bk2, 'v-img', { left: (40 + i * 210) + 'px', top: '150px', width: '190px', height: '220px', backgroundImage: `url(${IMG('img/' + f + '.png')})` }); if (i === 3) { el(c, '', { position: 'absolute', left: '-6px', right: '-6px', top: '80px', padding: '10px 0', textAlign: 'center', background: `linear-gradient(90deg, ${BLUE}, #5f7dff)`, color: '#fff', fontSize: '30px', fontWeight: 800, transform: 'rotate(-8deg)', boxShadow: '0 10px 24px rgba(35,71,224,.45)' }, 'OFFERT'); } c._b = badge(c, i < 3 ? i + 1 : '+1', 150, -16); if (i === 3) { c._b.style.background = TEAL; c._b.style.color = INK; } return c; });
      const tl = el(bk2, '', { position: 'absolute', left: '50px', top: '440px', fontSize: '40px', color: '#6b7397', fontWeight: 600 }, 'Total');
      const old = el(bk2, '', { position: 'absolute', right: '60px', top: '440px', fontSize: '44px', color: '#9aa2c4', fontWeight: 700, textDecoration: 'line-through' }, '79,96 €');
      const tot = el(bk2, '', { position: 'absolute', right: '60px', top: '510px', fontSize: '120px', color: INK, fontWeight: 800, letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums' }, '0,00 €');
      const c1 = cap(sc, ['Tu', 'en', 'prends', '*trois', '?'], 330, 92, '#fff', [T.f1, T.f1 + .1, T.f1 + .2, T.f1 + .35, T.f1 + .5]), c2 = cap(sc, ['Le', '4ème', 'est', '_offert.'], 470, 92, '#fff', [T.f2, T.f2 + .12, T.f2 + .24, T.f2 + .36], 'lt');
      U.push([sc, t => { rise(bk2, t, a, 120); c1(t); c2(t);
        const drops = [T.f1 + .35, T.f1 + .55, T.f1 + .75, T.f2 + .4];
        SL.forEach((c, i) => { const k = prog(t, drops[i], .5, bk); c.style.opacity = clamp(k * 3); c.style.transform = `translateY(${(1 - k) * -500}px) rotate(${(1 - k) * (i % 2 ? 20 : -20)}deg)`; pop(c._b, t, drops[i] + .25); });
        const n = drops.filter(d => t > d + .4).length, full = Math.min(n, 4) * 19.99, ok = prog(t, T.f2 + .7, .7, io);
        tot.textContent = (n >= 4 ? lerp(79.96, 59.97, ok) : full).toFixed(2).replace('.', ',') + ' €'; old.style.opacity = n >= 4 ? ok : 0; tot.style.color = n >= 4 && ok > .5 ? BLUE : INK; }]); }
    // 7 — three steps: choose, order, delivered
    { const sc = scene('v-light'), a = C[6];
      const cd = el(sc, 'v-card', { left: '120px', top: '330px', width: '840px', height: '520px' });
      const im = el(cd, 'v-img', { left: '30px', top: '30px', width: '380px', height: '460px', backgroundImage: `url(${IMG('img/real.png')})` });
      el(cd, '', { position: 'absolute', left: '450px', top: '60px', fontSize: '40px', fontWeight: 700, color: INK, lineHeight: 1.15 }, 'Maillot Real Madrid<br>domicile 26/27');
      el(cd, '', { position: 'absolute', left: '450px', top: '190px', fontSize: '64px', fontWeight: 800, color: INK }, '19,99 €');
      const bt = el(cd, 'v-btn', { left: '450px', top: '360px', width: '350px', height: '100px', fontSize: '38px' }, '<span class="lb">Commander</span>');
      const btL = bt.querySelector('.lb');
      const cur = el(sc, 'v-cur', {}, CURSOR), rip = el(sc, 'v-rip');
      const line = el(sc, '', { position: 'absolute', left: '160px', width: '760px', top: '1210px', height: '8px', borderRadius: '4px', background: '#dfe4f7' }), lineF = el(line, '', { height: '100%', borderRadius: '4px', background: BLUE, width: '0' });
      const stops = ['Commandé', 'Expédié', 'Livré'].map((x, i) => { const d = el(sc, '', { position: 'absolute', left: (160 + i * 380 - 22) + 'px', top: '1192px', width: '44px', height: '44px', borderRadius: '50%', background: '#dfe4f7' }); const l = el(sc, '', { position: 'absolute', left: (160 + i * 380 - 120) + 'px', width: '240px', textAlign: 'center', top: '1262px', fontSize: '34px', fontWeight: 700, color: INK }, x); return [d, l]; });
      const box = el(sc, '', { position: 'absolute', top: '1110px', width: '90px', height: '90px', borderRadius: '24px', background: BLUE, display: 'grid', placeItems: 'center', boxShadow: '0 14px 30px rgba(35,71,224,.45)' }, BOX); box.firstChild.style.width = '56px';
      const pin = el(sc, '', { position: 'absolute', left: '895px', top: '1080px', width: '70px', height: '70px' }, PIN);
      const c1 = cap(sc, ['Tu', '_choisis.'], 1450, 100, INK, [T.g1, T.g1 + .12]), c2 = cap(sc, ['Tu', '_commandes.'], 1570, 100, INK, [T.g2, T.g2 + .12]), c3 = cap(sc, ['Il', 'arrive', 'chez', '_toi.'], 1690, 100, INK, [T.g3, T.g3 + .1, T.g3 + .2, T.g3 + .3]);
      U.push([sc, t => { rise(cd, t, a, 100); c1(t); c2(t); c3(t);
        const sel = t > T.g1 + .4; cd.style.boxShadow = sel ? `0 0 0 6px ${BLUE}, 0 30px 70px rgba(10,20,80,.25)` : '';
        const ck = prog(t, T.g1 - .2, .6, io), ck2 = prog(t, T.g2 - .2, .5, io); let cx = lerp(900, 300, ck), cy = lerp(1100, 560, ck); if (t > T.g2 - .2) { cx = lerp(300, 640, ck2); cy = lerp(560, 760, ck2); }
        cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; cur.style.opacity = Math.min(prog(t, T.g1 - .3, .2), 1 - prog(t, T.g3, .3)); const tap = t > T.g2 + .35 ? T.g2 + .35 : T.g1 + .4; cur.style.transform = `scale(${t > tap && t < tap + .1 ? .85 : 1})`;
        const rk = clamp((t - tap) / .45); rip.style.left = cx + 12 + 'px'; rip.style.top = cy + 12 + 'px'; rip.style.opacity = t > tap && rk < 1 ? 1 - rk : 0; rip.style.transform = `scale(${.2 + rk * 1.4})`;
        const ord = t > T.g2 + .35; btL.innerHTML = ord ? `${CHECK}<span style="vertical-align:10px;margin-left:10px">Commandé</span>` : 'Commander'; bt.style.background = ord ? '#1aa86b' : BLUE;
        const lk = prog(t, T.g3 - .1, 1.3, io); line.style.opacity = prog(t, T.g2, .3); lineF.style.width = lk * 100 + '%'; box.style.left = (160 + lk * 760 - 45) + 'px'; box.style.opacity = prog(t, T.g2 + .4, .3); box.style.transform = `translateY(${-Math.abs(Math.sin(lk * Math.PI * 3)) * 20}px)`;
        stops.forEach(([d, l], i) => { const on = lk >= i / 2 - .01 && t > T.g2 + .4; d.style.background = on ? BLUE : '#dfe4f7'; d.style.boxShadow = on ? '0 0 0 8px rgba(35,71,224,.18)' : ''; l.style.opacity = prog(t, T.g2 + .2 + i * .1, .3); });
        pop(pin, t, T.g3 + 1.0); }]); }
    // 8 — end card
    { const sc = scene('v-navy'), a = C[7];
      const lg = el(sc, '', { position: 'absolute', left: '190px', top: '520px', width: '700px' }, `<img src="${IMG('img/logo-light.svg')}" style="width:100%;display:block;filter:drop-shadow(0 0 40px rgba(92,225,230,.5))">`);
      const c1 = cap(sc, ['Le', 'foot,'], 1030, 110, '#fff', [T.h2, T.h2 + .15]), c2 = cap(sc, ['à', 'ton', '_prix.'], 1160, 110, '#fff', [T.h3, T.h3 + .12, T.h3 + .24], 'lt');
      const sr = el(sc, 'v-srch', { top: '1400px' }, `${SEARCH}<span class="tx"></span><span class="cr" style="width:4px;height:56px;background:${BLUE}"></span>`); const stx = sr.querySelector('.tx'), scr = sr.querySelector('.cr');
      U.push([sc, t => { const k = prog(t, T.h1 - .1, .9, io); lg.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`; lg.style.transform = `scale(${lerp(1.06, 1, prog(t, T.h1 - .1, 1.3, oq))})`; c1(t); c2(t);
        const sk = prog(t, T.h3 + .8, .45, bk); sr.style.opacity = clamp(sk * 2); sr.style.transform = `scale(${lerp(.8, 1, sk)})`;
        const u = 'elite-maillot.fr', n = Math.floor(clamp((t - T.h3 - 1.2) / .06, 0, u.length)); stx.textContent = u.slice(0, n); scr.style.opacity = Math.floor(t * 3) % 2 || n < u.length ? 1 : 0; }]); }

    const flash = el(R, 'v-flash'), TR = s.trans;
    return t => {
      let idx = 0; for (let i = 0; i < C.length; i++) if (t >= C[i]) idx = i;
      U.forEach(([sc]) => { sc.style.display = 'none'; sc.style.transform = ''; sc.style.filter = ''; sc.style.opacity = ''; });
      const cur = U[idx]; cur[0].style.display = 'block'; cur[1](t);
      const WH = .28, kin = clamp((t - C[idx]) / WH), nx = C[idx + 1];
      const apply = (sc, tr, e, sign) => { if (tr === 'b') { sc.style.filter = `blur(${e * 24}px)`; sc.style.opacity = 1 - e * .6; } else { const [dx, dy] = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] }[tr]; sc.style.transform = `translate(${sign * dx * 1000 * e}px, ${sign * dy * 1600 * e}px)`; sc.style.filter = `blur(${e * 20}px)`; } };
      if (idx > 0 && kin < 1) apply(cur[0], TR[idx - 1], 1 - E.outQuint(kin), 1);
      if (nx != null) { const ko = clamp((t - (nx - WH)) / WH); if (ko > 0) apply(cur[0], TR[idx], ko * ko * ko, -1); }
      flash.style.opacity = idx > 0 && TR[idx - 1] !== 'b' ? Math.max(0, 1 - (t - C[idx]) / .2) : 0;
    };
  };
})();
