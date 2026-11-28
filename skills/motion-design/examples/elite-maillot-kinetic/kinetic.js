// Élite Maillot — kinetic typography ad in the language of the user's latest references (Trois Coups promos):
// big centred sentences that build word by word (blur → sharp), the key word in a glowing white kpill (on blue) or
// underlined in blue (on light), backgrounds alternating navy / royal blue / lavender white, small floating glass
// pills, walls of numbered cards, a product kcard that assembles (jersey ①, price ②, button ③), kstep pills, and fast
// whip transitions with a short directional blur. Real, well-known jerseys from the shop. One scene per bar (140 BPM).
(() => {
  const { SCENES, h, esc, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f);
  const oq = E.outQuint, io = E.inOut;
  const NAVY = '#0a1440', BLUE = '#2347e0', INK = '#0d1a4a', TEAL = '#5ce1e6';
  const CSS = `
  .kn { position:absolute; inset:0; overflow:hidden; background:${NAVY}; font-family: Inter, system-ui, sans-serif; }
  .kn .sc { position:absolute; inset:0; overflow:hidden; display:none; }
  .kn .bg-navy { background: radial-gradient(90% 60% at 50% 45%, #1a2c78 0%, #0c1749 55%, #070d2e 100%); }
  .kn .bg-blue { background: radial-gradient(90% 60% at 50% 40%, #4f74ff 0%, #2a4fe6 45%, #1a33b8 100%); }
  .kn .bg-light { background: radial-gradient(90% 60% at 50% 40%, #ffffff 0%, #eef0fb 50%, #dfe3f6 100%); }
  .kn .streak { position:absolute; left:-30%; width: 160%; height: 420px; top: 60%; transform: rotate(-12deg); background: linear-gradient(180deg, transparent, rgba(255,255,255,.10), transparent); filter: blur(30px); }
  .kn .blob { position:absolute; border-radius: 50%; filter: blur(60px); }
  .kn .ln { position:absolute; left: 0; right: 0; text-align:center; font-weight: 700; letter-spacing: -.035em; line-height: 1.08; white-space: nowrap; }
  .kn .w { display:inline-block; margin: 0 .12em; }
  .kn .dk { color:#fff; text-shadow: 0 0 30px rgba(255,255,255,.35); }
  .kn .lt { color:${INK}; }
  .kn .kpill { display:inline-block; padding: .06em .42em .12em; border-radius: 1em; border: 6px solid #fff; box-shadow: 0 0 26px rgba(255,255,255,.8), inset 0 0 26px rgba(255,255,255,.55); }
  .kn .ul { display:inline-block; position:relative; color: ${BLUE}; } .kn .ul i { position:absolute; left: 2%; right: 2%; bottom: -.08em; height: .085em; border-radius: .05em; background: ${BLUE}; transform-origin: 0 50%; }
  .kn .gp { position:absolute; padding: 18px 32px; border-radius: 40px; font-size: 38px; font-weight: 600; color: rgba(255,255,255,.92); background: rgba(255,255,255,.14); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.35), 0 10px 30px rgba(0,0,30,.25); backdrop-filter: blur(10px); white-space: nowrap; }
  .kn .gp.l { color: ${INK}; background: rgba(255,255,255,.75); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.9), 0 14px 40px rgba(40,60,160,.18); }
  .kn .kcard { position:absolute; border-radius: 34px; background: #fff; box-shadow: 0 30px 70px rgba(30,50,150,.22), 0 0 0 1px rgba(20,40,120,.06); }
  .kn .ktile { position:absolute; width: 230px; height: 270px; border-radius: 28px; background: linear-gradient(180deg, #fff, #eef1ff); box-shadow: 0 16px 40px rgba(0,10,60,.3); display:grid; place-items:center; }
  .kn .ktile img { width: 78%; } .kn .ktile b { position:absolute; right: -10px; top: -10px; width: 46px; height: 46px; border-radius: 50%; background: ${BLUE}; color:#fff; font-size: 24px; display:grid; place-items:center; box-shadow: 0 0 0 5px rgba(255,255,255,.9); }
  .kn .knum { position:absolute; width: 64px; height: 64px; border-radius: 50%; background: ${BLUE}; color:#fff; font-size: 32px; font-weight: 700; display:grid; place-items:center; box-shadow: 0 0 0 7px #fff, 0 8px 20px rgba(35,71,224,.4); }
  .kn .kbtn { position:absolute; border-radius: 40px; background: ${BLUE}; color:#fff; font-weight: 700; display:flex; align-items:center; justify-content:center; box-shadow: 0 16px 40px rgba(35,71,224,.45); }
  .kn .kstep { position:absolute; padding: 22px 40px; border-radius: 50px; background: #fff; color: ${INK}; font-size: 60px; font-weight: 700; box-shadow: 0 16px 40px rgba(0,10,60,.35); white-space: nowrap; } .kn .kstep small { font-size: 34px; color: ${BLUE}; margin-right: 14px; }
  .kn .kdot { position:absolute; width: 44px; height: 44px; border-radius: 50%; display:grid; place-items:center; font-size: 22px; font-weight: 700; }
  .kn .big { position:absolute; left:50%; top:50%; transform: translate(-50%,-50%); }
  .kn .kflash { position:absolute; inset:0; background:#fff; z-index: 60; pointer-events:none; }
  .kn .klg { position:absolute; left: 190px; width: 700px; top: 620px; filter: drop-shadow(0 0 40px rgba(92,225,230,.55)); }
  .kn .srch { position:absolute; left: 140px; right: 140px; top: 1330px; height: 120px; border-radius: 60px; background:#fff; display:flex; align-items:center; gap: 22px; padding: 0 40px; color: ${INK}; font-size: 46px; font-weight: 600; box-shadow: 0 0 0 6px rgba(255,255,255,.25), 0 20px 60px rgba(0,0,0,.4); }
  .kn .srch svg { width: 50px; height: 50px; flex:none; } .kn .srch .cr { width: 4px; height: 56px; background: ${BLUE}; }
  `;
  const SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="#0d1a4a" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

  SCENES.kinetic = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'kn', root), C = s.cuts, D = s.duration;
    // a sentence line: words with optional kpill / underline on the key words; returns animator
    const line = (par, words, y, size, cls, start, stagger = .1) => {
      const el = h('div', 'ln ' + cls, par); el.style.top = y + 'px'; el.style.fontSize = size + 'px';
      const W = words.map(w => { const key = w.startsWith('*'), ul = w.startsWith('_'), txt = esc(w.replace(/^[*_]/, ''));
        const sp = h('span', 'w', el, key ? `<span class="kpill">${txt}</span>` : ul ? `<span class="ul">${txt}<i></i></span>` : txt); sp._k = key ? sp.firstChild : ul ? sp.querySelector('i') : null; sp._t = key ? 'p' : ul ? 'u' : ''; return sp; });
      return t => W.forEach((sp, i) => {
        const a = start + i * stagger, k = prog(t, a, .4, oq); sp.style.opacity = clamp(k * 1.8); sp.style.filter = k < 1 ? `blur(${(1 - k) * 14}px)` : 'none'; sp.style.transform = `translateY(${(1 - k) * 34}px)`;
        if (sp._t === 'p') { const q = prog(t, a + .12, .45, E.back); sp._k.style.borderColor = `rgba(255,255,255,${q})`; sp._k.style.boxShadow = `0 0 ${26 * q}px rgba(255,255,255,${.8 * q}), inset 0 0 ${26 * q}px rgba(255,255,255,${.55 * q})`; }
        if (sp._t === 'u') { sp._k.style.transform = `scaleX(${prog(t, a + .2, .4, oq)})`; }
      });
    };
    const scene = (bg) => { const sc = h('div', 'sc ' + bg, R); if (bg !== 'bg-light') h('div', 'streak', sc); return sc; };
    const blobs = (sc, cols) => cols.map(([c, x, y, d]) => { const b = h('div', 'blob', sc); Object.assign(b.style, { left: x + 'px', top: y + 'px', width: d + 'px', height: d + 'px', background: c }); return b; });
    const gpill = (sc, txt, x, y, light) => { const p = h('div', 'gp' + (light ? ' l' : ''), sc, txt); p.style.left = x + 'px'; p.style.top = y + 'px'; return p; };
    const U = [];   // per-scene update functions: (t, local k) => void

    // S0 navy — "Ton maillot / *préféré."
    { const sc = scene('bg-navy'), a = C[0];
      const P = [['Real Madrid', 90, 560], ['Barça', 700, 520], ['PSG', 120, 1260], ['Arsenal', 690, 1300], ['Milan', 420, 1460]].map(([t2, x, y]) => gpill(sc, t2, x, y));
      const l1 = line(sc, ['Ton', 'maillot'], 780, 130, 'dk', a + .15), l2 = line(sc, ['*préféré.'], 930, 140, 'dk', a + .45);
      U.push([sc, t => { l1(t); l2(t); P.forEach((p, i) => { const k = prog(t, a + .3 + i * .08, .5, oq); p.style.opacity = clamp(k) * .85; p.style.filter = `blur(${(i % 2 ? 3 : 0) + (1 - k) * 8}px)`; p.style.transform = `translateY(${Math.sin(t * 1.3 + i) * 10 + (1 - k) * 40}px)`; }); }]); }
    // S1 light — "Sans payer / le _prix _fort."
    { const sc = scene('bg-light'), a = C[1]; blobs(sc, [['rgba(120,140,255,.25)', -200, 300, 700], ['rgba(255,255,255,.9)', 500, 1200, 600]]);
      const cd = h('div', 'kcard', sc); Object.assign(cd.style, { left: '70px', right: '70px', top: '760px', height: '400px', borderRadius: '200px' });
      const l1 = line(sc, ['Sans', 'payer'], 805, 120, 'lt', a + .1), l2 = line(sc, ['le', '_prix', '_fort.'], 950, 130, 'lt', a + .35);
      U.push([sc, t => { const k = prog(t, a, .5, oq); cd.style.opacity = k; cd.style.transform = `scale(${lerp(.9, 1, k)})`; l1(t); l2(t); }]); }
    // S2 blue — wall of jersey tiles, "19,99 €" in a kpill
    { const sc = scene('bg-blue'), a = C[2], J = s.jerseys;
      const wall = h('div', '', sc); wall.style.cssText = 'position:absolute;left:0;top:0;width:1080px;height:1920px;';
      const T = []; for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) { const i = r * 4 + c, tl = h('div', 'ktile', wall, `<img src="${IMG(J[i % J.length] + '.png')}"><b>${(i * 7) % 9 + 1}</b>`); tl.style.left = (c * 270 - 30 + (r % 2) * 60) + 'px'; tl.style.top = (r * 310 - 260) + 'px'; T.push(tl); }
      const pr = h('div', 'ln dk', sc, '<span class="kpill" style="background:#fff;color:#2347e0;box-shadow:0 0 40px rgba(255,255,255,.9),0 30px 80px rgba(0,0,60,.45)">19,99 €</span>'); pr.style.top = '840px'; pr.style.fontSize = '170px';
      const sub = () => {};
      U.push([sc, t => { const dt = t - a; wall.style.transform = `translateY(${-dt * 60}px) rotate(-6deg) scale(1.08)`;
        T.forEach((tl, i) => { const k = prog(t, a + (i % 11) * .03, .45, oq); tl.style.opacity = clamp(k * 2) * .95; tl.style.transform = `scale(${lerp(.6, 1, k)})`; tl.style.filter = Math.abs((i % 4) - 1.5) > 1 ? 'blur(2px)' : 'none'; });
        const pk = prog(t, a + .3, .5, E.back); pr.style.opacity = clamp(pk * 2); pr.style.transform = `scale(${lerp(.5, 1, pk)})`; sub(t); }]); }
    // S3 light — "Le maillot. / Le prix. / Le bouton." + product kcard assembling with numbered badges
    { const sc = scene('bg-light'), a = C[3]; blobs(sc, [['rgba(120,140,255,.22)', 400, -100, 800]]);
      const L = ['Le maillot.', 'Le prix.', 'Le bouton.'].map((t2, i) => { const el = h('div', 'ln lt', sc, t2); Object.assign(el.style, { left: '80px', right: 'auto', textAlign: 'left', top: (330 + i * 120) + 'px', fontSize: '96px' }); return el; });
      const cd = h('div', 'kcard', sc); Object.assign(cd.style, { left: '170px', width: '740px', top: '760px', height: '900px' });
      const im = h('img', '', cd); im.src = IMG('real.png'); Object.assign(im.style, { position: 'absolute', left: '120px', top: '40px', width: '500px' });
      const nm = h('div', '', cd, 'Maillot Real Madrid domicile 26/27'); Object.assign(nm.style, { position: 'absolute', left: '50px', right: '50px', top: '560px', fontSize: '40px', fontWeight: 700, color: INK });
      const pz = h('div', '', cd, '19,99 €'); Object.assign(pz.style, { position: 'absolute', left: '50px', top: '670px', fontSize: '64px', fontWeight: 800, color: BLUE });
      const bt = h('div', 'kbtn', cd, 'Ajouter au panier'); Object.assign(bt.style, { left: '50px', right: '50px', top: '760px', height: '100px', fontSize: '40px' });
      const N = [[60, 760], [120, 1400], [840, 1530]].map(([x, y], i) => { const n = h('div', 'knum', sc, i + 1); n.style.left = x + 'px'; n.style.top = y + 'px'; return n; });
      U.push([sc, t => { const HB = (C[4] - a) / 4;
        L.forEach((el, i) => { const k = prog(t, a + .1 + i * HB, .4, oq); el.style.opacity = clamp(k * 1.8) * (i === Math.min(2, Math.floor((t - a - .1) / HB)) ? 1 : .35); el.style.filter = k < 1 ? `blur(${(1 - k) * 12}px)` : 'none'; el.style.transform = `translateY(${(1 - k) * 30}px)`; });
        const ck = prog(t, a, .5, oq); cd.style.opacity = ck; cd.style.transform = `translateY(${(1 - ck) * 120}px)`;
        [[im, 0], [pz, 1], [bt, 2]].forEach(([el, i]) => { const k = prog(t, a + .15 + i * HB, .45, E.back); el.style.opacity = clamp(k * 2); el.style.transform = `scale(${lerp(.6, 1, k)})`; });
        nm.style.opacity = prog(t, a + .3, .4);
        N.forEach((n, i) => { const k = prog(t, a + .2 + i * HB, .4, E.back); n.style.transform = `scale(${k})`; }); }]); }
    // S4 blue — club names swap in the kpill, the jersey behind changes with each word
    { const sc = scene('bg-blue'), a = C[4];
      const NM = [['Real.', 'real'], ['Barça.', 'barca'], ['PSG.', 'psg'], ['City.', 'city']];
      const JI = NM.map(([, f]) => { const j = h('img', '', sc); j.src = IMG(f + '.png'); Object.assign(j.style, { position: 'absolute', left: '190px', top: '380px', width: '700px', filter: 'drop-shadow(0 40px 60px rgba(0,0,50,.5))' }); return j; });
      const W = NM.map(([w]) => { const el = h('div', 'ln dk', sc, `<span class="kpill">${w}</span>`); el.style.top = '1180px'; el.style.fontSize = '150px'; return el; });
      U.push([sc, t => { const q = (C[5] - a) / 4, j = clamp(Math.floor((t - a) / q), 0, 3), lk = (t - a - j * q) / q;
        JI.forEach((im, i) => { im.style.display = i === j ? '' : 'none'; }); JI[j].style.transform = `scale(${lerp(.85, 1.02, E.outQuint(clamp(lk * 2)))}) rotate(${(1 - E.outQuint(clamp(lk * 2))) * (j % 2 ? 6 : -6)}deg)`;
        W.forEach((el, i) => { el.style.display = i === j ? '' : 'none'; }); const k = E.outQuint(clamp(lk * 3)); W[j].style.filter = k < 1 ? `blur(${(1 - k) * 12}px)` : 'none'; W[j].style.transform = `translateY(${(1 - k) * 40}px)`; }]); }
    // S5 navy — "comment ça marche." 3 kstep pills, progress dots
    { const sc = scene('bg-navy'), a = C[5];
      const l1 = line(sc, ['3', '*étapes.'], 520, 130, 'dk', a + .05);
      const S = [['Étape 1', 'Tu choisis'], ['Étape 2', 'Tu ajoutes'], ['Étape 3', 'Tu reçois']].map(([n, t2], i) => { const p = h('div', 'kstep', sc, `<small>${n}</small>${t2}`); p.style.left = '50%'; p.style.top = (840 + i * 170) + 'px'; return p; });
      const DT = Array.from({ length: 9 }, (_, i) => { const d = h('div', 'kdot', sc); d.style.left = (260 + i * 64) + 'px'; d.style.top = '1400px'; return d; });
      U.push([sc, t => { l1(t); const HB = (C[6] - a) / 4;
        S.forEach((p, i) => { const k = prog(t, a + .3 + i * HB, .4, E.back); p.style.opacity = clamp(k * 2); p.style.transform = `translateX(-50%) scale(${lerp(.6, 1, k)})`; });
        const fill = clamp((t - a - .3) / (3 * HB)) * 9; DT.forEach((d, i) => { const on = i < fill; d.style.background = on ? '#fff' : 'rgba(255,255,255,.18)'; d.style.color = on ? BLUE : 'transparent'; d.textContent = i + 1; d.style.transform = `scale(${on ? 1 : .7})`; }); }]); }
    // S6 light — "3 achetés, / le 4ème _offert." four cards, a check
    { const sc = scene('bg-light'), a = C[6]; blobs(sc, [['rgba(120,140,255,.25)', -150, 1100, 700]]);
      const l1 = line(sc, ['3', 'achetés,'], 420, 130, 'lt', a + .05), l2 = line(sc, ['le', '4ème', '_offert.'], 570, 130, 'lt', a + .35);
      const K = ['arsenal', 'milan', 'argentine', 'bresil'].map((f, i) => { const c = h('div', 'kcard', sc, `<img src="${IMG(f + '.png')}" style="position:absolute;left:12%;top:10%;width:76%">`); Object.assign(c.style, { left: (60 + i * 245) + 'px', top: '880px', width: '225px', height: '270px', borderRadius: '26px' });
        const n = h('div', 'knum', c, i < 3 ? i + 1 : '🎁'); Object.assign(n.style, { right: '-14px', top: '-18px', width: '54px', height: '54px', fontSize: i < 3 ? '26px' : '26px', boxShadow: '0 0 0 6px #fff' });
        if (i === 3) { n.textContent = '+1'; n.style.background = TEAL; n.style.color = INK; const o = h('div', '', c, 'OFFERT'); Object.assign(o.style, { position: 'absolute', left: '50%', bottom: '-26px', transform: 'translateX(-50%)', padding: '8px 18px', borderRadius: '14px', background: BLUE, color: '#fff', fontSize: '26px', fontWeight: 800 }); }
        return c; });
      const ck = h('div', '', sc, CHECK); Object.assign(ck.style, { position: 'absolute', left: '480px', top: '1290px', width: '120px', height: '120px', borderRadius: '50%', background: BLUE, padding: '22px', boxSizing: 'border-box', boxShadow: '0 16px 40px rgba(35,71,224,.45)' });
      U.push([sc, t => { l1(t); l2(t); K.forEach((c, i) => { const k = prog(t, a + .5 + i * .18, .45, E.back); c.style.opacity = clamp(k * 2); c.style.transform = `translateY(${(1 - k) * 80}px) scale(${lerp(.7, 1, k)})`; });
        const q = prog(t, a + 1.25, .4, E.back); ck.style.transform = `scale(${q})`; }]); }
    // S7 blue — total counts down, glass pills of more jerseys around
    { const sc = scene('bg-blue'), a = C[7];
      const P = [['Man United', 80, 520], ['France', 720, 560], ['Portugal', 110, 1340], ['Maroc', 740, 1300]].map(([t2, x, y]) => gpill(sc, t2, x, y));
      const l1 = line(sc, ['4', 'maillots'], 640, 96, 'dk', a + .05);
      const old = h('div', 'ln dk', sc, '79,96 €'); old.style.top = '780px'; old.style.fontSize = '80px'; old.style.opacity = .6;
      const strike = h('div', '', sc); Object.assign(strike.style, { position: 'absolute', left: '370px', width: '340px', top: '830px', height: '8px', background: '#fff', borderRadius: '4px', transformOrigin: '0 50%' });
      const nw = h('div', 'ln dk', sc, '<span class="kpill" style="font-variant-numeric: tabular-nums">59,97 €</span>'); nw.style.top = '920px'; nw.style.fontSize = '170px';
      U.push([sc, t => { l1(t); const ok = prog(t, a + .25, .35, oq); old.style.opacity = .65 * ok; strike.style.transform = `scaleX(${prog(t, a + .6, .3, oq)})`;
        const k = prog(t, a + .7, .7, io), v = lerp(79.96, 59.97, k); nw.firstChild.textContent = v.toFixed(2).replace('.', ',') + ' €'; const nk = prog(t, a + .6, .4, E.back); nw.style.opacity = clamp(nk * 2); nw.style.transform = `scale(${lerp(.6, 1, nk)})`;
        P.forEach((p, i) => { const q = prog(t, a + .2 + i * .1, .5, oq); p.style.opacity = q * .85; p.style.filter = `blur(${(i % 2 ? 2 : 0) + (1 - q) * 8}px)`; p.style.transform = `translateY(${Math.sin(t * 1.3 + i) * 10}px)`; }); }]); }
    // S8 navy — "Le foot, / à *ton *prix."
    { const sc = scene('bg-navy'), a = C[8];
      const l1 = line(sc, ['Le', 'foot,'], 790, 140, 'dk', a + .05), l2 = line(sc, ['à', '*ton prix.'], 960, 140, 'dk', a + .3);
      U.push([sc, t => { l1(t); l2(t); }]); }
    // S9 end — logo, tagline underlined, search kpill typing the url
    { const sc = scene('bg-navy'), a = C[9];
      const klg = h('img', 'klg', sc); klg.src = IMG('logo-light.svg');
      const tg = line(sc, ['Le', 'foot,', 'à', 'ton', 'prix.'], 1110, 70, 'dk', a + .9, .07);
      const sr = h('div', 'srch', sc, `${SEARCH}<span class="tx"></span><span class="cr"></span>`); const stx = sr.querySelector('.tx'), scr = sr.querySelector('.cr');
      U.push([sc, t => { const k = prog(t, a + .1, .8, io); klg.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`; klg.style.transform = `scale(${lerp(1.08, 1, prog(t, a + .1, 1.2, oq))})`; tg(t);
        const sk = prog(t, a + 1.5, .45, E.back); sr.style.opacity = clamp(sk * 2); sr.style.transform = `translateY(${(1 - sk) * 60}px) scale(${lerp(.8, 1, sk)})`;
        const u = 'elite-maillot.fr', n = Math.floor(clamp((t - a - 1.9) / .06, 0, u.length)); stx.textContent = u.slice(0, n); scr.style.opacity = Math.floor(t * 3) % 2 || n < u.length ? 1 : 0; }]); }
    const kflash = h('div', 'kflash', R);

    // whip transitions: the outgoing scene shoots off with a directional blur, the incoming one arrives from the other side
    const WH = .24, DIRS = [[1, 0], [0, 1], [1, 0], [-1, 0], [0, -1], [1, 0], [0, 1], [-1, 0], [1, 0]];
    return t => {
      let idx = 0; for (let i = 0; i < C.length; i++) if (t >= C[i]) idx = i;
      U.forEach(([sc], i) => { sc.style.display = 'none'; sc.style.transform = ''; sc.style.filter = ''; });
      const cur = U[idx]; cur[0].style.display = 'block'; cur[1](t);
      // incoming part of the whip
      const kin = clamp((t - C[idx]) / WH);
      if (idx > 0 && kin < 1) { const [dx, dy] = DIRS[(idx - 1) % DIRS.length], e = 1 - E.outQuint(kin); cur[0].style.transform = `translate(${dx * 900 * e}px, ${dy * 1400 * e}px)`; cur[0].style.filter = `blur(${e * 18}px)`; }
      // outgoing part (just before the next cut)
      const nx = C[idx + 1]; if (nx != null) { const ko = clamp((t - (nx - WH)) / WH); if (ko > 0) { const [dx, dy] = DIRS[idx % DIRS.length], e = ko * ko * ko; cur[0].style.transform = `translate(${-dx * 900 * e}px, ${-dy * 1400 * e}px)`; cur[0].style.filter = `blur(${e * 18}px)`; } }
      kflash.style.opacity = idx > 0 ? Math.max(0, .25 - (t - C[idx]) * 2) : 0;
    };
  };
})();
