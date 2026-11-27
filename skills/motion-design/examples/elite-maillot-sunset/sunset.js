// Élite Maillot — "sunset" ad in the open-world crime-game trailer language (original, no game logos or fonts):
// neon sunset over the sea with palm silhouettes, a "loading screen" collage of illustrated jerseys in slanted panels
// with ink outlines, halftone and caption tags, a synthwave neon-grid offer card ("3 ACHETÉS, LE 4ᵉ OFFERT") and the
// real Élite Maillot logo on the sunset. Diagonal slash wipes between the parts, cuts on the bars of the 108 BPM bed.
(() => {
  const { SCENES, h, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f);
  const smooth = k => k * k * (3 - 2 * k);
  const kf = (t, K, ez = smooth) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [t0, a, e2] = K[i - 1], [t1, b] = K[i], k = (e2 || ez)((t - t0) / (t1 - t0)); return Array.isArray(a) ? a.map((x, j) => lerp(x, b[j], k)) : lerp(a, b, k); } return K[K.length - 1][1]; };
  const io = E.inOut, oq = E.outQuint;
  const TEAL = '#5ce1e6', PINK = '#ff2e7e', ORANGE = '#ff8a3d', SUN = '#ffd36e', NIGHT = '#1b0638';

  const CSS = `
  @font-face { font-family: ArchivoV; src: url(../../short-editing/engine/fonts/Archivo.ttf); font-weight: 100 900; font-stretch: 62% 125%; }
  .ss { position:absolute; inset:0; overflow:hidden; background:${NIGHT}; font-family: ArchivoV, Inter, sans-serif; color:#fff; }
  .ss .lay { position:absolute; inset:0; }
  .ss .hv { font-family: ArchivoV; font-weight: 900; font-stretch: 62%; font-variation-settings: 'wdth' 62, 'wght' 900; text-transform: uppercase; letter-spacing: -.01em; line-height: .86; }
  /* scenery */
  .ss .sky { position:absolute; left:0; right:0; top:-900px; height: 2400px; background: linear-gradient(180deg, #0d0326 0%, ${NIGHT} 18%, #4a0d6b 40%, #b0167a 56%, ${PINK} 66%, ${ORANGE} 76%, ${SUN} 84%, #ffe9a8 87%); }
  .ss .sun { position:absolute; left: 50%; width: 720px; height: 720px; margin-left: -360px; border-radius: 50%; background: linear-gradient(180deg, #fff3b0 0%, ${SUN} 30%, ${ORANGE} 62%, ${PINK} 100%);
    -webkit-mask: linear-gradient(180deg, #000 52%, transparent 52%, transparent 55%, #000 55%, #000 63%, transparent 63%, transparent 67.5%, #000 67.5%, #000 74%, transparent 74%, transparent 80%, #000 80%, #000 85%, transparent 85%, transparent 92%, #000 92%);
    box-shadow: 0 0 160px 40px rgba(255,140,80,.55); }
  .ss .sea { position:absolute; left:0; right:0; height: 1200px; background: linear-gradient(180deg, #ff6aa0 0%, #8a1a7a 12%, #3a0a5a 40%, #12042a 100%); }
  .ss .sea i { position:absolute; left: 50%; height: 6px; border-radius: 3px; background: linear-gradient(90deg, transparent, #ffe08a, transparent); }
  .ss .city { position:absolute; left:0; right:0; height: 400px; }
  .ss .city b { position:absolute; bottom: 0; background: #2a0838; }
  .ss .city b::after { content:''; position:absolute; inset: 14px 10px auto 10px; height: 70%; background: repeating-linear-gradient(180deg, rgba(255,120,190,.55) 0 6px, transparent 6px 26px); -webkit-mask: repeating-linear-gradient(90deg, #000 0 8px, transparent 8px 20px); opacity: .5; }
  .ss .palm { position:absolute; }
  /* collage */
  .ss .col { position:absolute; left:0; top:0; width:1080px; height:1920px; background:#08020f; }
  .ss .pnl { position:absolute; overflow:hidden; clip-path: polygon(9% 0, 100% 0, 91% 100%, 0 100%); }
  .ss .pnl .bgp { position:absolute; inset:-10%; }
  .ss .pnl .ht { position:absolute; inset:0; background-image: radial-gradient(rgba(0,0,0,.28) 28%, transparent 30%); background-size: 16px 16px; mix-blend-mode: multiply; }
  .ss .pnl .rays { position:absolute; left:50%; top:45%; width: 1600px; height: 1600px; margin: -800px; background: repeating-conic-gradient(rgba(255,255,255,.16) 0 6deg, transparent 6deg 18deg); }
  .ss .pnl img { position:absolute; left: 50%; top: 52%; width: 92%; transform: translate(-50%,-50%); filter: drop-shadow(10px 14px 0 rgba(0,0,0,.45)); }
  .ss .tag { position:absolute; left: 12%; bottom: 7%; padding: 10px 26px 6px; background:#0a0410; transform: skewX(-12deg); box-shadow: 8px 8px 0 ${PINK}; }
  .ss .tag span { display:block; transform: skewX(12deg); font-size: 46px; }
  /* title stamp */
  .ss .stamp { position:absolute; left: 0; right: 0; top: 760px; text-align:center; }
  .ss .lg { width: 860px; filter: drop-shadow(10px 12px 0 #0a0410) drop-shadow(0 0 40px rgba(92,225,230,.6)); }
  .ss .bar { display:inline-block; margin-top: 26px; padding: 14px 36px 8px; background: ${PINK}; transform: skewX(-12deg); box-shadow: 10px 10px 0 #0a0410; }
  .ss .bar span { display:block; transform: skewX(12deg); font-size: 64px; color:#fff; }
  /* offer */
  .ss .grid { position:absolute; left: -1200px; right: -1200px; top: 1060px; height: 2600px; transform-origin: 50% 0; transform: perspective(700px) rotateX(72deg);
    background-image: linear-gradient(90deg, rgba(255,46,126,.9) 3px, transparent 3px), linear-gradient(0deg, rgba(255,46,126,.9) 3px, transparent 3px); background-size: 120px 120px; background-color: #12042a; }
  .ss .glowh { position:absolute; left:0; right:0; top: 1000px; height: 140px; background: linear-gradient(180deg, transparent, rgba(255,46,126,.75), transparent); filter: blur(10px); }
  .ss .big { position:absolute; left:0; right:0; text-align:center; font-size: 250px; -webkit-text-stroke: 14px #0a0410; paint-order: stroke fill; }
  .ss .big.a { top: 210px; background: linear-gradient(180deg, #fff6c8, ${SUN} 45%, ${ORANGE}); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(12px 14px 0 #0a0410); }
  .ss .big.b { top: 470px; font-size: 170px; background: linear-gradient(180deg, #d8ffff, ${TEAL}); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(10px 12px 0 #0a0410); }
  .ss .jo { position:absolute; width: 470px; }
  .ss .gift { position:absolute; padding: 12px 30px 6px; background: linear-gradient(180deg, #fff3a8, #ffc23a); color:#0a0410; transform: skewX(-12deg) rotate(-8deg); box-shadow: 8px 8px 0 #0a0410; }
  .ss .gift span { display:block; transform: skewX(12deg); font-size: 66px; }
  /* end */
  .ss .url { position:absolute; left: 50%; top: 1210px; transform: translateX(-50%) skewX(-12deg); padding: 16px 40px 10px; background:#0a0410; box-shadow: 10px 10px 0 ${TEAL}; white-space: nowrap; }
  .ss .url span { display:block; transform: skewX(12deg); font-size: 70px; }
  .ss .sub { position:absolute; left:0; right:0; top: 1390px; text-align:center; font-size: 60px; color: #fff; text-shadow: 6px 6px 0 #0a0410; }
  .ss .sub em { font-style: normal; color: ${SUN}; }
  /* wipes, film */
  .ss .wipe { position:absolute; left: -600px; width: 2400px; height: 3400px; top: -800px; z-index: 50; }
  .ss .vig { position:absolute; inset:0; z-index: 45; pointer-events:none; background: radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(10,2,20,.55)); }
  .ss .pre { position:absolute; left:0; right:0; top: 560px; text-align:center; font-size: 44px; letter-spacing: .5em; text-indent: .5em; font-weight: 700; color: rgba(255,255,255,.9); text-shadow: 0 0 30px rgba(255,46,126,.8); }
  `;

  // palm silhouette (trunk + fronds), drawn here
  const palm = (hgt, lean, seed) => {
    const r = n => { const x = Math.sin(seed * 99.1 + n * 12.9898) * 43758.5453; return x - Math.floor(x); };
    const tx = 200 + lean, ty = 60, pts = [];
    for (let i = 0; i <= 20; i++) { const k = i / 20, x = 200 + lean * k * k, y = hgt + 40 - (hgt - 20) * k, w = lerp(30, 12, k); pts.push([x - w / 2, y], [x + w / 2, y]); }
    const L = pts.filter((_, i) => i % 2 === 0), Rr = pts.filter((_, i) => i % 2 === 1).reverse();
    let d = 'M' + L.concat(Rr).map(p => p.map(v => v.toFixed(1)).join(',')).join(' L') + 'Z';
    let fr = '';
    for (let i = 0; i < 9; i++) {
      const a = -170 + i * 42 + r(i) * 14, len = 190 + r(i + 9) * 70, droop = 60 + r(i + 3) * 50;
      const rad = a * Math.PI / 180, ex = tx + Math.cos(rad) * len, ey = ty + 20 + Math.sin(rad) * len * .45 + droop;
      const mx = tx + Math.cos(rad) * len * .5, my = ty + Math.sin(rad) * len * .5 - 30;
      const nx = -Math.sin(rad) * 26, ny = Math.cos(rad) * 26;
      fr += `M${tx},${ty + 20} Q${(mx + nx).toFixed(1)},${(my + ny).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)} Q${(mx - nx * .4).toFixed(1)},${(my - ny * .4 + 18).toFixed(1)} ${tx},${ty + 20}Z `;
    }
    return `<svg viewBox="0 0 400 ${hgt + 60}" width="400" height="${hgt + 60}"><path d="${d}" fill="#12031c"/><path d="${fr}" fill="#12031c"/><circle cx="${tx}" cy="${ty + 22}" r="16" fill="#12031c"/></svg>`;
  };

  SCENES.sunset = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'ss', root), B = s.beats;
    const BAR = 4 * 60 / (s.bpm || 108);

    // ---------- scenery (used by the opener and the end card)
    const scen = h('div', 'lay', R);
    const sky = h('div', 'sky', scen), sun = h('div', 'sun', scen), city = h('div', 'city', scen), sea = h('div', 'sea', scen);
    for (let i = 0; i < 26; i++) { const b = h('b', '', city); const w = 40 + (i * 37) % 70, hh = 60 + ((i * 53) % 9) * 32 + (i % 5 === 2 ? 160 : 0); Object.assign(b.style, { left: (i * 43 - 20) + 'px', width: w + 'px', height: hh + 'px' }); }
    const SL = Array.from({ length: 16 }, (_, i) => { const x = h('i', '', sea); const w = 520 - i * 26; Object.assign(x.style, { width: w + 'px', marginLeft: -w / 2 + 'px', top: 18 + i * 22 + 'px', opacity: 1 - i / 18 }); return x; });
    const palms = [[-60, 1350, 1300, 120, 1], [770, 1450, 1250, -140, 2], [-140, 1650, 1500, 160, 3], [880, 1700, 1400, -170, 4]].map(([x, y, hg, ln, sd]) => {
      const p = h('div', 'palm', scen, palm(hg, ln, sd)); Object.assign(p.style, { left: x + 'px', top: (y - hg) + 'px' }); p._y = y - hg; return p; });
    const pre = h('div', 'pre', scen, 'ÉLITE MAILLOT<br><span style="font-size:30px;letter-spacing:.6em">PRÉSENTE</span>');

    // ---------- collage
    const col = h('div', 'col', R);
    const J = [['toon-barca.png', 'FC BARCELONE', ['#ff2e7e', '#7a1fd1']], ['toon-psg.png', 'PARIS', ['#2ec4ff', '#1a2a9a']], ['toon-real.png', 'REAL MADRID', ['#ffd36e', '#ff6a3d']],
      ['toon-city.png', 'MANCHESTER CITY', ['#5ce1e6', '#1b6ad1']], ['toon-france.png', 'ÉQUIPE DE FRANCE', ['#ff8a3d', '#c3125f']], ['toon-barca-ext.png', 'BARÇA EXTÉRIEUR', ['#b04dff', '#ff2e7e']]];
    const PW = 560, PH = 600, GX = [10, 510], GY = [40, 650, 1260];
    const P = J.map(([img, name, [c1, c2]], i) => {
      const x = GX[i % 2] + (Math.floor(i / 2) % 2 ? -14 : 0), y = GY[Math.floor(i / 2)];
      const p = h('div', 'pnl', col, `<div class="bgp" style="background:linear-gradient(160deg, ${c1}, ${c2})"></div><div class="rays"></div><div class="ht"></div><img src="${IMG(img)}"><div class="tag"><span class="hv">${name}</span></div>`);
      Object.assign(p.style, { left: x + 'px', top: y + 'px', width: PW + 'px', height: PH + 'px' }); p._c = [x + PW / 2, y + PH / 2];
      p._img = p.querySelector('img'); p._rays = p.querySelector('.rays'); p._tag = p.querySelector('.tag'); return p; });
    const stamp = h('div', 'stamp', R, `<img class="lg" src="${IMG('logo-light.svg')}"><br><div class="bar"><span class="hv">MAILLOTS DE FOOT</span></div>`);
    const sLg = stamp.querySelector('.lg'), sBar = stamp.querySelector('.bar');

    // ---------- offer
    const off = h('div', 'lay', R);
    off.innerHTML = `<div class="lay" style="background:linear-gradient(180deg,#0d0326 0%,#4a0d6b 35%,#b0167a 48%,#ff2e7e 54%,#ff8a3d 58%,#12042a 58.2%)"></div>`;
    const osun = h('div', 'sun', off); Object.assign(osun.style, { top: '640px', width: '560px', height: '560px', marginLeft: '-280px' });
    const grid = h('div', 'grid', off), glowh = h('div', 'glowh', off);
    const bigA = h('div', 'big a hv', off, '3 ACHETÉS'), bigB = h('div', 'big b hv', off, 'LE 4ÈME OFFERT');
    const JO = ['toon-psg.png', 'toon-real.png', 'toon-city.png', 'toon-barca.png'].map((f, i) => { const j = h('img', 'jo', off); j.src = IMG(f); return j; });
    const gift = h('div', 'gift', off, '<span class="hv">OFFERT</span>');
    const JP = [[60, 980, -14], [305, 940, 0], [550, 980, 14], [300, 1290, -6]];

    // ---------- end card on the scenery
    const endL = h('div', 'lay', R, `<div class="stamp" style="top:620px"><img class="lg" src="${IMG('logo-light.svg')}"></div><div class="url"><span class="hv">ELITE-MAILLOT.FR</span></div><div class="sub hv">3 ACHETÉS = <em>1 OFFERT</em></div>`);
    const eLg = endL.querySelector('.lg'), eUrl = endL.querySelector('.url'), eSub = endL.querySelector('.sub');

    // ---------- slash wipes and vignette
    const WC = [[PINK, ORANGE], [TEAL, '#2ec4ff'], [SUN, PINK]];
    const W = [0, 1, 2].map(i => { const w = h('div', 'wipe', R); w.innerHTML = `<div style="position:absolute;inset:0;background:${WC[i][0]}"></div>`; return w; });
    const W2 = [0, 1, 2].map(i => { const w = h('div', 'wipe', R); w.innerHTML = `<div style="position:absolute;inset:0;background:#0a0410"></div>`; return w; });
    h('div', 'vig', R);
    const CUTS = [B.collage, B.offer, B.end];

    return t => {
      // which part is on screen (the wipe covers each cut)
      const part = t < B.collage ? 0 : t < B.offer ? 1 : t < B.end ? 2 : 3;
      scen.style.display = part === 0 || part === 3 ? '' : 'none'; col.style.display = part === 1 ? '' : 'none'; stamp.style.display = part === 1 ? '' : 'none';
      off.style.display = part === 2 ? '' : 'none'; endL.style.display = part === 3 ? '' : 'none';

      // ---------- scenery: vertical pan from the sky down to the horizon (opener), slow sunset (end)
      if (part === 0 || part === 3) {
        const pan = part === 0 ? kf(t, [[0, 560, io], [B.collage - .1, 0]]) : kf(t, [[B.end, 220, oq], [B.end + 1.6, 0, io], [s.duration, -40]]);
        const hz = 1250;
        sky.style.transform = `translateY(${pan * .3}px)`;
        const sunY = part === 0 ? lerp(hz - 420, hz - 470, clamp(t / B.collage)) : lerp(hz - 470, hz - 330, clamp((t - B.end) / (s.duration - B.end)));
        sun.style.top = sunY + pan * .45 + 'px';
        city.style.top = hz - 400 + pan * .6 + 'px'; sea.style.top = hz + pan * .6 + 'px';
        SL.forEach((x, i) => { x.style.transform = `translateX(${Math.sin(t * 1.6 + i * .9) * 14}px) scaleX(${.9 + .1 * Math.sin(t * 2 + i)})`; });
        palms.forEach((p, i) => { p.style.transform = `translateY(${pan * (1 + i * .25)}px) rotate(${Math.sin(t * .8 + i) * 1.2}deg)`; p.style.transformOrigin = '50% 100%'; });
        const pk = part === 0 ? Math.min(prog(t, .3, .6, oq), 1 - prog(t, B.collage - .6, .4)) : 0; pre.style.opacity = pk; pre.style.transform = `translateY(${(1 - pk) * 30}px)`;
      }

      // ---------- collage: each panel slams in on the half-bar, the camera rides from panel to panel, then pulls out
      if (part === 1) {
        const HB = BAR / 2, T0 = B.collage;
        P.forEach((p, i) => {
          const a = T0 + .15 + i * HB, k = prog(t, a, .45, E.back);
          p.style.opacity = clamp(k * 3); p.style.transform = `translateX(${(1 - k) * (i % 2 ? 700 : -700)}px) rotate(${(1 - k) * (i % 2 ? 8 : -8)}deg)`;
          p._img.style.transform = `translate(-50%,-50%) scale(${lerp(1.25, 1, prog(t, a, 1.6, oq)) * (1 + (t - a) * .015)}) rotate(${(1 - prog(t, a, .8, oq)) * -6}deg)`;
          p._rays.style.transform = `rotate(${t * 10}deg)`;
          const tk = prog(t, a + .3, .35, E.back); p._tag.style.transform = `skewX(-12deg) translateX(${(1 - tk) * -300}px)`; p._tag.style.opacity = clamp(tk * 2);
        });
        const keys = [[T0, [540, 960, 1.0]]];
        P.forEach((p, i) => { const a = T0 + .15 + i * HB; keys.push([a - .05, [...p._c, 1.82], io], [a + HB - .3, [p._c[0], p._c[1], 1.9], io]); });
        keys.push([B.collage + 6 * HB + .1, [540, 950, 1.0], io], [B.offer, [540, 950, 1.04]]);
        keys.sort((x, y) => x[0] - y[0]);
        const [cx, cy, z] = kf(t, keys);
        col.style.transformOrigin = '0 0'; col.style.transform = `translate(${540 - cx * z}px, ${960 - cy * z}px) scale(${z})`;
        const sk = prog(t, B.title, .4, E.back), sb = prog(t, B.title + .35, .35, E.back);
        stamp.style.opacity = clamp(sk * 3); sLg.style.transform = `scale(${lerp(2.4, 1, sk)}) rotate(${(1 - sk) * -6}deg)`;
        sBar.style.transform = `skewX(-12deg) translateX(${(1 - sb) * 900}px)`;
        col.style.filter = t > B.title ? `brightness(${lerp(1, .55, prog(t, B.title, .3))}) saturate(1.2)` : 'none';
      }

      // ---------- offer on the neon grid
      if (part === 2) {
        const T0 = B.offer;
        grid.style.backgroundPosition = `0 ${(t * 360) % 120}px`;
        const shake = (a) => { const k = clamp((t - a) / .25); return k > 0 && k < 1 ? Math.sin(k * 40) * (1 - k) * 14 : 0; };
        const ak = prog(t, T0 + .05, .35, E.back), bk = prog(t, T0 + BAR / 2, .35, E.back);
        bigA.style.opacity = clamp(ak * 3); bigA.style.transform = `translate(${shake(T0 + .25)}px, ${shake(T0 + .25) * .6}px) scale(${lerp(2.2, 1, ak)}) skewX(-8deg)`;
        bigB.style.opacity = clamp(bk * 3); bigB.style.transform = `translateX(${shake(T0 + BAR / 2 + .2)}px) scale(${lerp(2.2, 1, bk)}) skewX(-8deg)`;
        JO.forEach((j, i) => {
          const [x, y, r] = JP[i], a = i < 3 ? T0 + .35 + i * .18 : T0 + BAR, k = prog(t, a, i < 3 ? .5 : .6, E.back);
          const fy = i < 3 ? (1 - k) * 900 : (1 - k) * -1500, spin = i < 3 ? 0 : (1 - k) * 360;
          j.style.left = x + 'px'; j.style.top = y + 'px'; j.style.opacity = clamp(k * 3);
          j.style.transform = `translateY(${fy + Math.sin(t * 2 + i) * 6}px) rotate(${r + spin}deg) scale(${i < 3 ? 1 : 1.15})`;
          j.style.zIndex = i < 3 ? 2 : 4;
        });
        const gk = prog(t, T0 + BAR + .45, .35, E.back);
        gift.style.left = '590px'; gift.style.top = '1330px'; gift.style.zIndex = 5; gift.style.opacity = clamp(gk * 3); gift.style.transform = `skewX(-12deg) rotate(-8deg) scale(${lerp(2.5, 1, gk)})`;
        glowh.style.opacity = .7 + .3 * Math.sin(t * 3);
      }

      // ---------- end card
      if (part === 3) {
        const lk = prog(t, B.end + .25, .55, E.back), uk = prog(t, B.end + 1.0, .4, E.back), sk2 = prog(t, B.end + 1.5, .4, oq);
        eLg.style.opacity = clamp(lk * 3); eLg.style.transform = `scale(${lerp(.4, 1, lk)}) rotate(${(1 - lk) * 8}deg)`;
        const shine = clamp((t - B.end - 1.0) / .8); eLg.style.filter = `drop-shadow(10px 12px 0 #0a0410) drop-shadow(0 0 ${40 + 30 * Math.sin(shine * Math.PI)}px rgba(92,225,230,.8))`;
        eUrl.style.opacity = clamp(uk * 3); eUrl.style.transform = `translateX(-50%) skewX(-12deg) translateY(${(1 - uk) * 120}px)`;
        eSub.style.opacity = sk2; eSub.style.transform = `translateY(${(1 - sk2) * 40}px)`;
      }

      // ---------- slash wipes: a coloured bar then a dark bar sweep diagonally across each cut
      CUTS.forEach((c, i) => {
        const k1 = clamp((t - c + .32) / .55), k2 = clamp((t - c + .22) / .55);
        const pos = k => lerp(-2600, 2600, io(k));
        W[i].style.display = k1 > 0 && k1 < 1 ? '' : 'none'; W[i].style.transform = `translateX(${pos(k1)}px) rotate(18deg)`;
        W2[i].style.display = k2 > 0 && k2 < 1 ? '' : 'none'; W2[i].style.transform = `translateX(${pos(k2) - 120}px) rotate(18deg)`;
      });
    };
  };
})();
