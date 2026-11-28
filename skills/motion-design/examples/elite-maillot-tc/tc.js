// Élite Maillot — shot-for-shot adaptation of the user's Trois Coups reference ("On guide le regard"), 9:16:
//  1 warm close-up that shrinks into a floating card · 2 dark silk background, cards floating in depth, "ici." ①
//  "là." ② "là." ③, the eye path drawn 1→2→3, "sans réfléchir." and the three parts snap into one product card ·
//  3 blue wall of B&W photos, one lights up · 4 a word sharpening out of a blur, underlined · 5 a wireframe card
//  with ①②③, "en premier." · 6 "maillot. / prix. / bouton." while the card assembles · 7 a waveform timeline: the
//  playhead triggers each element · 8 "3 achetés, le 4ème offert." on the timeline · 9 a chain of linked cards
//  whips by, "exactement prévu." · 10 three product cards "Tes clubs. Pareil." · 11 a message typing · 12 end card.
(() => {
  const { SCENES, h, esc, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/' + f);
  const oq = E.outQuint, io = E.inOut, bk = E.back;
  const BLUE = '#2347e0', INK = '#0d1a4a';
  const CSS = `
  .tq { position:absolute; inset:0; overflow:hidden; background:#05070f; font-family: Inter, system-ui, sans-serif; }
  .tq .t-sc { position:absolute; inset:0; overflow:hidden; display:none; }
  .tq .t-dark { background: radial-gradient(90% 70% at 50% 40%, #191c26 0%, #07080d 70%); }
  .tq .t-navy { background: radial-gradient(90% 60% at 50% 45%, #1a2c78 0%, #0c1749 55%, #060b26 100%); }
  .tq .t-blue { background: radial-gradient(90% 60% at 50% 40%, #4f74ff 0%, #2a4fe6 45%, #1a33b8 100%); }
  .tq .t-light { background: radial-gradient(90% 60% at 50% 40%, #ffffff 0%, #eef0fb 50%, #dde2f5 100%); }
  .tq .t-w { position:absolute; font-weight: 700; letter-spacing: -.035em; white-space: nowrap; line-height: 1.05; }
  .tq .t-c { left:0; right:0; text-align:center; }
  .tq .t-u { position:relative; display:inline-block; } .tq .t-u > i { position:absolute; left: 1%; right: 1%; bottom: -.1em; height: .07em; border-radius: .04em; background: ${BLUE}; transform-origin: 0 50%; }
  .tq .t-u.lt > i { background: #7f9bff; }
  .tq .t-badge { position:absolute; width: 50px; height: 50px; border-radius: 50%; background: ${BLUE}; color:#fff; font-size: 26px; font-weight: 700; display:grid; place-items:center; box-shadow: 0 0 0 6px #fff, 0 6px 18px rgba(35,71,224,.45); }
  .tq .t-card { position:absolute; border-radius: 30px; background: #fff; box-shadow: 0 30px 70px rgba(10,20,80,.25), 0 0 0 1px rgba(20,40,120,.06); overflow: visible; }
  .tq .t-ph { position:absolute; border-radius: 22px; background: #eee center/cover; overflow:hidden; }
  .tq .t-price { position:absolute; border-radius: 26px; background: linear-gradient(180deg, #1b2457, #121a44); color:#fff; box-shadow: 0 0 0 1.5px rgba(140,160,255,.35), 0 20px 50px rgba(0,0,0,.5); }
  .tq .t-price small { position:absolute; left: 30px; top: 22px; font-size: 22px; letter-spacing: .2em; color: rgba(255,255,255,.55); font-weight: 600; } .tq .t-price b { position:absolute; left: 30px; bottom: 18px; font-size: 76px; letter-spacing: -.03em; }
  .tq .t-btn { position:absolute; border-radius: 22px; background: ${BLUE}; color:#fff; font-weight: 700; display:flex; align-items:center; justify-content:center; box-shadow: 0 0 0 1.5px rgba(160,180,255,.5), 0 16px 40px rgba(35,71,224,.5); white-space: nowrap; }
  .tq .t-float { position:absolute; border-radius: 18px; background: center/cover; box-shadow: 0 20px 40px rgba(0,0,0,.5); }
  .tq .t-silk { position:absolute; inset: -20%; }
  .tq .t-tile { position:absolute; border-radius: 14px; background: center/cover; }
  .tq .t-wave { position:absolute; left: 60px; right: 60px; height: 170px; border-radius: 30px; background:#fff; box-shadow: 0 20px 60px rgba(30,50,150,.18); display:flex; align-items:center; gap: 5px; padding: 0 30px; box-sizing:border-box; }
  .tq .t-wave i { flex: 1; border-radius: 3px; }
  .tq .t-head { position:absolute; width: 5px; background: ${BLUE}; border-radius: 3px; } .tq .t-head::before { content:''; position:absolute; left: -9px; top: -12px; width: 23px; height: 23px; border-radius: 50%; background: ${BLUE}; }
  .tq .t-chip { position:absolute; padding: 10px 22px; border-radius: 16px; background:#fff; color:${INK}; font-weight: 700; font-size: 30px; box-shadow: 0 10px 30px rgba(30,50,150,.2); white-space: nowrap; }
  .tq .t-node { position:absolute; border-radius: 20px; background:#fff; box-shadow: 0 16px 40px rgba(0,0,0,.35); }
  .tq .t-inp { position:absolute; left: 80px; right: 80px; height: 140px; border-radius: 70px; background:#fff; display:flex; align-items:center; gap: 20px; padding: 0 30px 0 44px; box-sizing:border-box; font-size: 46px; font-weight: 600; color:${INK}; box-shadow: 0 0 0 8px rgba(255,255,255,.2), 0 30px 80px rgba(0,0,40,.4); }
  .tq .t-inp .snd { margin-left:auto; width: 86px; height: 86px; border-radius: 50%; background:${BLUE}; display:grid; place-items:center; flex:none; } .tq .t-inp .snd svg { width: 46px; height: 46px; }
  .tq .t-tag { position:absolute; padding: 12px 24px; border-radius: 30px; background: rgba(255,255,255,.95); color:${INK}; font-size: 30px; font-weight: 700; display:flex; align-items:center; gap: 12px; box-shadow: 0 10px 30px rgba(0,0,40,.3); }
  .tq .t-flash { position:absolute; inset:0; z-index: 70; pointer-events:none; }
  .tq svg.t-lines { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
  `;
  const UP = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>';

  SCENES.tc = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'tq', root), C = s.cuts, D = s.duration, J = s.jerseys;
    const scene = cls => h('div', 't-sc ' + cls, R);
    const el = (par, cls, css = {}, html = '') => { const e = h('div', cls, par, html); Object.assign(e.style, css); return e; };
    const word = (par, txt, x, y, size, color, o = {}) => { const e = el(par, 't-w' + (o.c ? ' t-c' : ''), { left: o.c ? 0 : x + 'px', top: y + 'px', fontSize: size + 'px', color }, o.u ? `<span class="t-u ${o.lt ? 'lt' : ''}">${txt}<i></i></span>` : txt); e._u = e.querySelector('i'); return e; };
    // blur-in for a word block; underline draws after
    const wIn = (e, t, a, d = .45, dy = 30) => { const k = prog(t, a, d, oq); e.style.opacity = clamp(k * 1.8); e.style.filter = k < 1 ? `blur(${(1 - k) * 14}px)` : 'none'; e.style.transform = `translateY(${(1 - k) * dy}px)`; if (e._u) e._u.style.transform = `scaleX(${prog(t, a + .2, .4, oq)})`; return k; };
    const wOut = (e, t, a, d = .3) => { const k = prog(t, a, d, io); if (k > 0) { e.style.opacity = (1 - k) * (+e.style.opacity || 1); e.style.filter = `blur(${k * 12}px)`; } };
    const badge = (par, n, x, y) => el(par, 't-badge', { left: x + 'px', top: y + 'px' }, n);
    const pop = (e, t, a, base = '') => { const k = prog(t, a, .4, bk); e.style.transform = `${base} scale(${k})`; e.style.opacity = clamp(k * 3); return k; };
    const silk = par => { const sv = el(par, 't-silk'); sv.innerHTML = `<svg viewBox="0 0 1400 2400" width="100%" height="100%" preserveAspectRatio="none"><defs><linearGradient id="sg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#cfd6ff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="sb"><feGaussianBlur stdDeviation="14"/></filter></defs>${Array.from({ length: 7 }, (_, i) => `<path d="M-100 ${300 + i * 300} C 400 ${100 + i * 300}, 900 ${600 + i * 300}, 1500 ${250 + i * 300}" stroke="url(#sg)" stroke-width="${70 - i * 6}" fill="none" filter="url(#sb)" opacity="${.5 - i * .04}"/>`).join('')}</svg>`; return sv; };
    const U = [];

    // ---------- 1. warm close-up (full frame), shrinks to a card at the cut
    { const sc = scene('t-dark'), a = C[0];
      const ph = el(sc, 't-float', { left: '0', top: '0', width: '1080px', height: '1920px', borderRadius: '0', backgroundImage: `url(${IMG('photo/close.jpg')})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' });
      const warm = el(ph, '', { position: 'absolute', inset: '0', background: 'linear-gradient(170deg, rgba(255,255,255,0) 25%, rgba(255,90,20,.95) 52%, rgba(255,190,40,.9) 66%, rgba(255,255,255,0) 88%)', mixBlendMode: 'multiply' });
      U.push([sc, t => { const k = prog(t, C[1] - .55, .55, io); const w = lerp(1080, 600, k), hh = lerp(1920, 420, k);
        Object.assign(ph.style, { width: w + 'px', height: hh + 'px', left: lerp(0, 420, k) + 'px', top: lerp(0, 260, k) + 'px', borderRadius: lerp(0, 30, k) + 'px', filter: `blur(${k * 4}px)` });
        ph.style.backgroundSize = `auto ${lerp(130, 104, prog(t, 0, C[1], io))}%`; warm.style.transform = `translateY(${Math.sin(t * 1.5) * 30}px)`; }]); }

    // ---------- 2. dark silk, floating cards, eye path
    { const sc = scene('t-dark'), a = C[1], b = C[2]; const sv = silk(sc); const back = el(sc, 't-card', { left: '300px', top: '480px', width: '480px', height: '760px', opacity: 0 });
      const FL = ['bw-barca', 'bw-milan', 'bw-psg', 'bw-arsenal', 'bw-portugal', 'bw-manu', 'bw-maroc', 'bw-city', 'bw-france'].map((f, i) => { const sz = [210, 170, 240, 150, 200, 180, 160, 220, 140][i];
        const p = el(sc, 't-float', { width: sz + 'px', height: sz * 1.05 + 'px', backgroundImage: `url(${IMG('photo/' + f + '.jpg')})`, left: [40, 820, 760, 70, 880, 360, 40, 640, 300][i] + 'px', top: [140, 120, 1580, 1500, 860, 70, 980, 1180, 1700][i] + 'px', opacity: .55 }); p._d = i % 3; return p; });
      const warmc = el(sc, 't-float', { left: '420px', top: '260px', width: '600px', height: '420px', backgroundImage: `url(${IMG('photo/close.jpg')})`, filter: 'blur(4px)' });
      const jc = el(sc, 't-card', { left: '110px', top: '520px', width: '330px', height: '380px', padding: '0', background: '#e9e9ea' }, `<div class="t-ph" style="inset:18px;background-image:url(${IMG('photo/real.jpg')})"></div>`);
      const pc = el(sc, 't-price', { left: '560px', top: '820px', width: '400px', height: '200px' }, '<small>PRIX</small><b>19,99 €</b>');
      const bt = el(sc, 't-btn', { left: '600px', top: '420px', width: '400px', height: '120px', fontSize: '44px' }, 'Ajouter au panier');
      const B1 = badge(jc, 1, 300, -18), B2 = badge(pc, 2, 368, -20), B3 = badge(bt, 3, 368, -24);
      const lines = el(sc, '', {}); lines.outerHTML; const LS = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); LS.setAttribute('class', 't-lines'); LS.setAttribute('viewBox', '0 0 1080 1920'); sc.appendChild(LS);
      LS.innerHTML = '<line id="l12" stroke="rgba(255,255,255,.75)" stroke-width="3"/><line id="l23" stroke="rgba(255,255,255,.75)" stroke-width="3"/>';
      const l12 = LS.querySelector('#l12'), l23 = LS.querySelector('#l23');
      const w1 = word(sc, 'ici.', 110, 960, 150, '#fff', { u: true, lt: true }), w2 = word(sc, 'là.', 560, 1080, 150, '#fff', { u: true, lt: true }), w3 = word(sc, 'là.', 640, 580, 150, '#fff', { u: true, lt: true });
      const w4 = word(sc, 'sans réfléchir.', 0, 1500, 120, '#fff', { c: true });
      const HB = (b - a) / 10;
      U.push([sc, t => { const dt = t - a;
        sv.style.transform = `translate(${Math.sin(t * .3) * 40}px, ${-dt * 20}px) rotate(${-8 + Math.sin(t * .2) * 3}deg)`;
        FL.forEach((p, i) => { p.style.transform = `translate(${Math.sin(t * .4 + i) * 20}px, ${-dt * (10 + p._d * 12)}px)`; p.style.filter = `blur(${[1, 4, 7][p._d]}px)`; });
        const wk = prog(t, a, .8, io); warmc.style.opacity = 1 - prog(t, a + .6, .8); warmc.style.transform = `translate(${wk * 60}px, ${-wk * 80}px) scale(${lerp(1, .7, wk)})`;
        const merge = prog(t, a + HB * 8, HB * 1.6, io);
        // the three elements: arrive, get their badge, then converge into a single product card at the end
        const place = (e, k, dx, dy, sc1) => { e.style.opacity = clamp(k * 2); e.style.transform = `translate(${lerp(0, dx, merge)}px, ${lerp(0, dy, merge)}px) scale(${lerp(lerp(.8, 1, k), sc1, merge)})`; };
        place(jc, prog(t, a + .2, .5, oq), 265, 20, 1.05); place(pc, prog(t, a + HB * 2.5, .5, oq), -220, 80, .75); place(bt, prog(t, a + HB * 5, .5, oq), -260, 670, .9);
        pop(B1, t, a + HB * 1); pop(B2, t, a + HB * 3); pop(B3, t, a + HB * 5.5);
        wIn(w1, t, a + HB * 1); wIn(w2, t, a + HB * 3); wIn(w3, t, a + HB * 5.5);
        const fade = prog(t, a + HB * 7.4, .4); [w1, w2, w3].forEach(w => { w.style.opacity = (+w.style.opacity) * (1 - fade); });
        // eye path
        const lk1 = prog(t, a + HB * 6.4, .45, io), lk2 = prog(t, a + HB * 6.8, .45, io), lf = 1 - merge;
        const c1 = [275, 710], c2 = [760, 920], c3 = [800, 480];
        l12.setAttribute('x1', c1[0]); l12.setAttribute('y1', c1[1]); l12.setAttribute('x2', lerp(c1[0], c2[0], lk1)); l12.setAttribute('y2', lerp(c1[1], c2[1], lk1));
        l23.setAttribute('x1', c2[0]); l23.setAttribute('y1', c2[1]); l23.setAttribute('x2', lerp(c2[0], c3[0], lk2)); l23.setAttribute('y2', lerp(c2[1], c3[1], lk2)); LS.style.opacity = (lk1 > 0 ? 1 : 0) * lf;
        wIn(w4, t, a + HB * 8.2); back.style.opacity = merge; back.style.transform = `scale(${lerp(.9, 1, merge)})`; }]); }

    // ---------- 3. blue wall of B&W photos, one lights up
    { const sc = scene('t-blue'), a = C[2], b = C[3];
      const wall = el(sc, '', { position: 'absolute', left: '0', top: '0', width: '1080px', height: '1920px' });
      const T = []; for (let r = 0; r < 9; r++) for (let c = 0; c < 5; c++) { const i = r * 5 + c, f = J[(i * 5 + r) % J.length]; const tl = el(wall, 't-tile', { left: (40 + c * 205) + 'px', top: (330 + r * 165) + 'px', width: '185px', height: '145px', backgroundImage: `url(${IMG('photo/bw-' + f + '.jpg')})` }); T.push(tl); }
      const hl = T[22]; const hlC = el(wall, 't-tile', { left: hl.style.left, top: hl.style.top, width: '185px', height: '145px', backgroundImage: `url(${IMG('photo/real.jpg')})`, boxShadow: '0 0 0 5px #fff, 0 20px 50px rgba(0,0,40,.5)' });
      const w1 = word(sc, 'Ton maillot.', 0, 120, 120, '#fff', { c: true }), w2 = word(sc, 'En un regard.', 0, 1830 - 160, 96, '#fff', { c: true });
      U.push([sc, t => { const dt = t - a;
        T.forEach((tl, i) => { const k = prog(t, a + .1 + ((i * 7) % 45) * .012, .4, oq); tl.style.opacity = clamp(k * 2) * .85; tl.style.transform = `scale(${lerp(.5, 1, k)})`; tl.style.filter = 'saturate(0) brightness(.95) sepia(.3) hue-rotate(190deg)'; });
        wall.style.transform = `scale(${lerp(1, 1.12, clamp(dt / (b - a)))})`; wall.style.transformOrigin = '50% 55%';
        const hk = prog(t, a + .9, .45, bk); hlC.style.opacity = clamp(hk * 2); hlC.style.transform = `scale(${lerp(1, 1.5, hk)})`; hlC.style.zIndex = 5;
        wIn(w1, t, a + .3); wIn(w2, t, a + 1.1); }]); }

    // ---------- 4. light: a word sharpening out of a blur, underlined
    { const sc = scene('t-light'), a = C[3];
      const w1 = word(sc, 'Élite Maillot', 0, 880, 140, INK, { c: true, u: true });
      U.push([sc, t => { const k = prog(t, a + .1, .9, io); w1.style.opacity = clamp(k * 1.5); w1.style.filter = k < 1 ? `blur(${(1 - k) * 30}px)` : 'none'; w1.style.letterSpacing = lerp(.08, -.035, k) + 'em'; w1._u.style.transform = `scaleX(${prog(t, a + .9, .5, oq)})`; w1.style.color = INK; w1.querySelector('.t-u').style.color = INK; }]); }

    // ---------- 5. light: wireframe card ①②③ "en premier."
    { const sc = scene('t-light'), a = C[4];
      const cd = el(sc, 't-card', { left: '140px', top: '760px', width: '800px', height: '380px' });
      const im = el(cd, '', { position: 'absolute', left: '36px', top: '36px', width: '300px', height: '308px', borderRadius: '20px', background: '#eef1fb', boxShadow: 'inset 0 0 0 3px #dfe5fb' }, '<svg viewBox="0 0 24 24" style="position:absolute;left:35%;top:35%;width:30%;height:30%" fill="none" stroke="#b9c4ea" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/></svg>');
      const L = [[380, 70, 380], [380, 120, 280], [380, 190, 160]].map(([x, y, w]) => el(cd, '', { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: '22px', borderRadius: '11px', background: '#e6eaf8' }));
      const bt = el(cd, '', { position: 'absolute', left: '380px', top: '270px', width: '380px', height: '60px', borderRadius: '30px', background: '#e6eaf8' });
      const fill = el(cd, '', { position: 'absolute', left: '36px', top: '36px', width: '300px', height: '308px', borderRadius: '20px', background: `#fff url(${IMG('img/real.png')}) center/80% no-repeat`, boxShadow: `inset 0 0 0 4px ${BLUE}` });
      const B = [badge(cd, 1, 14, 14), badge(cd, 2, 680, 180), badge(cd, 3, 740, 250)];
      const w1 = word(sc, 'Le maillot <span style="color:#2347e0">en premier.</span>', 0, 560, 110, INK, { c: true });
      U.push([sc, t => { const k = prog(t, a, .5, oq); cd.style.opacity = k; cd.style.transform = `translateY(${(1 - k) * 80}px)`;
        B.forEach((b2, i) => pop(b2, t, a + .35 + i * .22)); wIn(w1, t, a + .6);
        const fk = prog(t, a + 1.1, .5, bk); fill.style.opacity = clamp(fk * 2); fill.style.transform = `scale(${lerp(1.4, 1, fk)}) translate(${(1 - fk) * -200}px, ${(1 - fk) * -120}px)`; }]); }

    // ---------- 6. blue: "maillot. / prix. / bouton." while the card assembles
    { const sc = scene('t-blue'), a = C[5], b = C[6];
      const W = ['maillot.', 'prix.', 'bouton.'].map((x, i) => word(sc, x, 80, 330 + i * 130, 120, '#fff', { u: true, lt: true }));
      const cd = el(sc, 't-card', { left: '250px', top: '780px', width: '620px', height: '880px' });
      const ph = el(cd, 't-ph', { left: '30px', top: '30px', width: '560px', height: '500px', background: `#f1f3fb url(${IMG('img/real.png')}) center/78% no-repeat` });
      const nm = el(cd, '', { position: 'absolute', left: '40px', top: '560px', fontSize: '36px', fontWeight: 700, color: INK }, 'Maillot Real Madrid domicile');
      const pz = el(cd, '', { position: 'absolute', left: '40px', top: '620px', fontSize: '70px', fontWeight: 800, color: INK }, '19,99 €');
      const bt = el(cd, 't-btn', { left: '40px', top: '740px', width: '540px', height: '100px', fontSize: '40px' }, 'Ajouter au panier');
      const B = [badge(cd, 1, 560, 10), badge(cd, 2, 320, 640), badge(cd, 3, 560, 720)];
      U.push([sc, t => { const HB = (b - a) / 4; const ck = prog(t, a, .5, oq); cd.style.opacity = ck; cd.style.transform = `translateX(${(1 - ck) * 300}px) rotate(${(1 - ck) * 6}deg)`;
        W.forEach((w, i) => wIn(w, t, a + .1 + i * HB)); [ph, pz, bt].forEach((e, i) => { const k = prog(t, a + .15 + i * HB, .45, bk); e.style.opacity = clamp(k * 2); e.style.transform = `scale(${lerp(.7, 1, k)})`; });
        nm.style.opacity = prog(t, a + .3, .4); B.forEach((b2, i) => pop(b2, t, a + .3 + i * HB)); }]); }

    // ---------- 7+8. light: waveform timeline, the playhead triggers the elements; then the 3 + 1 offer on it
    const timeline = (sc, a, b, items, title) => {
      const wv = el(sc, 't-wave', { top: '1150px' }); const N = 70; const bars = Array.from({ length: N }, (_, i) => { const x = h('i', '', wv); x.style.height = (14 + 90 * Math.abs(Math.sin(i * 1.3) * Math.cos(i * .41)) * (i % 9 === 0 ? 1.3 : 1)) + 'px'; return x; });
      const hd = el(sc, 't-head', { top: '1110px', height: '250px' });
      const IT = items.map(([html, xk, cls, css]) => { const e = el(sc, cls, Object.assign({ top: '990px', left: (90 + xk * 900) + 'px' }, css || {}), html); e._x = xk; return e; });
      const BG = items.map((_, i) => badge(sc, i + 1, 0, 0));
      return t => { const k = clamp((t - a - .3) / (b - a - .6)); const x = 90 + k * 900; hd.style.left = x + 'px';
        bars.forEach((br, i) => { br.style.background = i / N < k ? BLUE : '#cfd6f2'; });
        const wk = prog(t, a, .4, oq); wv.style.opacity = wk; hd.style.opacity = wk;
        IT.forEach((e, i) => { const on = k >= e._x; const pk = on ? prog(t, a + .3 + e._x * (b - a - .6), .4, bk) : 0; e.style.opacity = clamp(pk * 2); e.style.transform = `translateY(${(1 - pk) * 30}px) scale(${lerp(.6, 1, pk)})`;
          const bb = BG[i]; bb.style.left = (parseFloat(e.style.left) + e.offsetWidth / 2 - 25) + 'px'; bb.style.top = (parseFloat(e.style.top) - 70) + 'px'; bb.style.transform = `scale(${pk})`; }); };
    };
    { const sc = scene('t-light'), a = C[6], b = C[7];
      const w1 = word(sc, 'Au bon <span class="t-u">moment.<i></i></span>', 0, 600, 120, INK, { c: true }); w1._u = w1.querySelector('i');
      const tl = timeline(sc, a, b, [[`<div class="t-ph" style="position:relative;width:150px;height:120px;background:#f1f3fb url(${IMG('img/real.png')}) center/80% no-repeat"></div>`, .12, 't-card', { width: '150px', height: '120px' }],
        ['19,99 €', .45, 't-chip', { fontSize: '40px' }], ['Ajouter au panier', .8, 't-btn', { width: '300px', height: '80px', fontSize: '32px' }]]);
      U.push([sc, t => { wIn(w1, t, a + .1); tl(t); }]); }
    { const sc = scene('t-light'), a = C[7], b = C[8];
      const w1 = word(sc, '3 achetés,', 0, 520, 120, INK, { c: true }), w2 = word(sc, 'le 4ème <span class="t-u">offert.<i></i></span>', 0, 660, 120, INK, { c: true }); w2._u = w2.querySelector('i');
      const th = f => `<div class="t-ph" style="position:relative;width:130px;height:110px;background:#f1f3fb url(${IMG('img/' + f + '.png')}) center/80% no-repeat"></div>`;
      const tl = timeline(sc, a, b, [[th('barca'), .05, 't-card', { width: '130px', height: '110px' }], [th('psg'), .3, 't-card', { width: '130px', height: '110px' }], [th('city'), .55, 't-card', { width: '130px', height: '110px' }], ['OFFERT', .8, 't-btn', { width: '180px', height: '80px', fontSize: '34px' }]]);
      U.push([sc, t => { wIn(w1, t, a + .1); wIn(w2, t, a + .5); tl(t); }]); }

    // ---------- 9. dark: chain of linked cards whips by, "exactement prévu."
    { const sc = scene('t-navy'), a = C[8], b = C[9];
      const row = el(sc, '', { position: 'absolute', left: '0', top: '980px', width: '3600px', height: '200px' });
      const NODES = [['img', 'real'], ['txt', '19,99 €'], ['img', 'barca'], ['txt', 'Panier'], ['img', 'psg'], ['txt', 'Payé ✓'], ['img', 'arsenal'], ['txt', 'Envoyé'], ['img', 'milan']];
      const NE = NODES.map(([k, v], i) => { const n = el(row, 't-node', { left: (i * 340) + 'px', top: '0', width: '260px', height: '180px' }, k === 'img' ? `<div class="t-ph" style="inset:14px;background:#f1f3fb url(${IMG('img/' + v + '.png')}) center/70% no-repeat"></div>` : `<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:44px;font-weight:800;color:${INK}">${v}</div>`); badge(n, i + 1, 220, -18); return n; });
      const ln = el(row, '', { position: 'absolute', left: '130px', top: '88px', height: '4px', width: (8 * 340) + 'px', background: 'rgba(160,180,255,.6)', zIndex: -1 });
      const w1 = word(sc, 'exactement', 0, 640, 130, '#fff', { c: true, u: true, lt: true }), w2 = word(sc, 'prévu.', 0, 790, 130, '#fff', { c: true });
      U.push([sc, t => { const k = prog(t, a, b - a, k2 => 1 - Math.pow(1 - k2, 3)); row.style.transform = `translateX(${lerp(1000, -2300, k)}px)`;
        const v = Math.max(0, 1 - (t - a) / .6); row.style.filter = v > .05 ? `blur(${v * 16}px)` : 'none';
        ln.style.transform = 'none'; wIn(w1, t, a + .3); wIn(w2, t, a + .6); }]); }

    // ---------- 10. light: three product cards "Tes clubs. Pareil."
    { const sc = scene('t-light'), a = C[9];
      const w1 = word(sc, 'Tes <span style="color:#2347e0">clubs.</span>', 0, 460, 120, INK, { c: true }), w2 = word(sc, '<span class="t-u">Pareil.<i></i></span>', 0, 600, 120, INK, { c: true }); w2._u = w2.querySelector('i');
      const CD = [['real', 'Ajouter'], ['barca', 'Ajouter'], ['psg', 'Ajouter']].map(([f, b2], i) => { const c = el(sc, 't-card', { left: (60 + i * 330) + 'px', top: '880px', width: '300px', height: '470px' });
        el(c, 't-ph', { left: '18px', top: '18px', width: '264px', height: '260px', background: `#f1f3fb url(${IMG('img/' + f + '.png')}) center/80% no-repeat` });
        el(c, '', { position: 'absolute', left: '22px', top: '300px', fontSize: '44px', fontWeight: 800, color: INK }, '19,99 €');
        el(c, 't-btn', { left: '18px', right: '18px', top: '380px', height: '70px', fontSize: '30px', borderRadius: '18px' }, b2);
        c._b = [badge(c, 1, 250, -14), badge(c, 2, 200, 296), badge(c, 3, 250, 370)]; return c; });
      U.push([sc, t => { wIn(w1, t, a + .1); wIn(w2, t, a + .45);
        CD.forEach((c, i) => { const k = prog(t, a + .3 + i * .15, .5, bk); c.style.opacity = clamp(k * 2); c.style.transform = `translateY(${(1 - k) * 120}px)`; c._b.forEach((b2, j) => pop(b2, t, a + .9 + i * .08 + j * .12)); }); }]); }

    // ---------- 11. blue: "message" → the DM field types
    { const sc = scene('t-blue'), a = C[10], b = C[11];
      const w0 = word(sc, 'Un message.', 0, 640, 120, '#fff', { c: true });
      const tg1 = el(sc, 't-tag', { left: '80px', top: '880px' }, '@elite.maillot'), tg2 = el(sc, 't-tag', { left: '420px', top: '880px' }, 'Instagram');
      const inp = el(sc, 't-inp', { top: '980px' }, `<span class="tx"></span><span style="width:4px;height:60px;background:${BLUE};display:inline-block" class="cr"></span><span class="snd">${UP}</span>`);
      const tx = inp.querySelector('.tx'), cr = inp.querySelector('.cr'), Q = 'Le maillot du Real en M ?';
      U.push([sc, t => { const k = wIn(w0, t, a + .05); w0.style.opacity = clamp(k * 1.8) * (1 - prog(t, a + .8, .3)); w0.style.filter = t > a + .8 ? `blur(${prog(t, a + .8, .3) * 14}px)` : w0.style.filter;
        [tg1, tg2].forEach((g, i) => pop(g, t, a + .9 + i * .12)); const ik = prog(t, a + .8, .45, bk); inp.style.opacity = clamp(ik * 2); inp.style.transform = `scale(${lerp(.7, 1, ik)})`;
        const n = Math.floor(clamp((t - a - 1.1) / .045, 0, Q.length)); tx.textContent = Q.slice(0, n); cr.style.opacity = Math.floor(t * 3) % 2 || n < Q.length ? 1 : 0; }]); }

    // ---------- 12. end card
    { const sc = scene('t-navy'), a = C[11];
      const lg = el(sc, '', { position: 'absolute', left: '190px', top: '560px', width: '700px' }, `<img src="${IMG('img/logo-light.svg')}" style="width:100%;display:block;filter:drop-shadow(0 0 40px rgba(92,225,230,.5))">`);
      const w1 = word(sc, 'Le foot,', 0, 1060, 110, '#fff', { c: true }), w2 = word(sc, 'à ton <span class="t-u lt">prix.<i></i></span>', 0, 1190, 110, '#fff', { c: true }); w2._u = w2.querySelector('i');
      const tg = el(sc, 't-tag', { left: '50%', top: '1400px' }, 'elite-maillot.fr');
      const dots = [badge(sc, '', 900, 1080), badge(sc, '', 860, 1250)];
      U.push([sc, t => { const k = prog(t, a + .1, .8, io); lg.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`; lg.style.transform = `scale(${lerp(1.06, 1, prog(t, a, 1.2, oq))})`;
        wIn(w1, t, a + .7); wIn(w2, t, a + 1.0); const gk = prog(t, a + 1.6, .45, bk); tg.style.opacity = clamp(gk * 2); tg.style.transform = `translateX(-50%) scale(${gk})`;
        dots.forEach((d, i) => { const q = prog(t, a + 1.9 + i * .15, .35, bk); d.style.transform = `scale(${q * .5})`; d.style.opacity = q; }); }]); }

    // transitions: per cut 'b' blur dissolve or a whip direction
    const flash = el(R, 't-flash');
    const TR = s.trans;
    return t => {
      let idx = 0; for (let i = 0; i < C.length; i++) if (t >= C[i]) idx = i;
      U.forEach(([sc]) => { sc.style.display = 'none'; sc.style.transform = ''; sc.style.filter = ''; sc.style.opacity = ''; });
      const cur = U[idx]; cur[0].style.display = 'block'; cur[1](t);
      const WH = .28, kin = clamp((t - C[idx]) / WH), nx = C[idx + 1];
      const apply = (sc, tr, e, sign) => { if (tr === 'b') { sc.style.filter = `blur(${e * 24}px)`; sc.style.opacity = 1 - e * .6; } else { const [dx, dy] = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] }[tr]; sc.style.transform = `translate(${sign * dx * 1000 * e}px, ${sign * dy * 1600 * e}px)`; sc.style.filter = `blur(${e * 20}px)`; } };
      if (idx > 0 && kin < 1) apply(cur[0], TR[idx - 1], 1 - E.outQuint(kin), 1);
      if (nx != null) { const ko = clamp((t - (nx - WH)) / WH); if (ko > 0) apply(cur[0], TR[idx], ko * ko * ko, -1); }
      flash.style.background = idx > 0 && TR[idx - 1] !== 'b' ? 'rgba(255,255,255,.18)' : 'transparent'; flash.style.opacity = idx > 0 ? Math.max(0, 1 - (t - C[idx]) / .2) : 0;
    };
  };
})();
