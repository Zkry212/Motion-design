// Élite Maillot — cinematic trailer cut (open-world game trailer language, private mock-up): letterbox, golden-hour
// grade with teal shadows, bloom, light leaks and grain; black title cards; sunset over the sea with palms; slow pushes
// on the real product photos; vertical social-media clips cut into the edit; a fast cut montage; a loading-screen
// panel collage in pink / orange / violet; and the logo in a sunset-gradient rounded tile at the end.
(() => {
  const { SCENES, h, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f);
  const io = E.inOut, oq = E.outQuint;
  const CSS = `
  @font-face { font-family: ArchivoV; src: url(../../short-editing/engine/fonts/Archivo.ttf); font-weight: 100 900; font-stretch: 62% 125%; }
  .tr { position:absolute; inset:0; overflow:hidden; background:#000; font-family: Inter, sans-serif; color:#fff; }
  .tr .shot { position:absolute; inset:0; overflow:hidden; display:none; }
  .tr .ph { position:absolute; left:50%; top:50%; background: center/cover no-repeat; }
  .tr .grade { position:absolute; inset:0; z-index: 30; pointer-events:none; mix-blend-mode: soft-light; background: linear-gradient(180deg, rgba(0,140,160,.55), rgba(255,120,60,.35) 55%, rgba(255,60,120,.45)); }
  .tr .warm { position:absolute; inset:0; z-index: 31; pointer-events:none; mix-blend-mode: screen; background: radial-gradient(70% 50% at 80% 20%, rgba(255,150,70,.28), transparent 70%); }
  .tr .vig { position:absolute; inset:0; z-index: 32; pointer-events:none; background: radial-gradient(110% 75% at 50% 50%, transparent 50%, rgba(0,0,0,.65)); }
  .tr .lb { position:absolute; left:0; right:0; height: 170px; background:#000; z-index: 40; }
  .tr .leak { position:absolute; z-index: 33; width: 1400px; height: 1400px; border-radius:50%; mix-blend-mode: screen; filter: blur(80px); pointer-events:none; }
  .tr .flash { position:absolute; inset:0; z-index: 45; background:#fff; pointer-events:none; }
  .tr .card { position:absolute; left: 80px; right: 80px; top: 50%; transform: translateY(-50%); text-align:center; font-family: ArchivoV; font-weight: 800; font-variation-settings: 'wdth' 80, 'wght' 800; font-size: 74px; line-height: 1.05; letter-spacing: .01em; text-transform: uppercase; }
  .tr .card small { display:block; margin-top: 22px; font-family: Inter; font-weight: 500; font-size: 32px; letter-spacing: .3em; text-transform: uppercase; color: rgba(255,255,255,.7); }
  /* scenery */
  .tr .sky { position:absolute; left:-10%; right:-10%; top:-400px; height: 1800px; background: linear-gradient(180deg, #24123f 0%, #5b2a6e 28%, #c2477a 50%, #ff7b54 66%, #ffb36b 76%, #ffe1a1 81%); }
  .tr .sunb { position:absolute; left:50%; width: 300px; height: 300px; margin-left:-150px; border-radius:50%; background: radial-gradient(circle, #fffbe6 0%, #ffe6a3 45%, rgba(255,190,110,.0) 70%); box-shadow: 0 0 200px 120px rgba(255,170,90,.5); }
  .tr .sea2 { position:absolute; left:0; right:0; height: 1400px; background: linear-gradient(180deg, #ffb077 0%, #d0607a 6%, #6a2f6e 24%, #241034 60%, #0b0614 100%); }
  .tr .glint { position:absolute; left:50%; height: 4px; border-radius: 2px; background: linear-gradient(90deg, transparent, #fff1c6, transparent); }
  .tr .palm { position:absolute; }
  .tr .haze { position:absolute; left:0; right:0; height: 300px; background: linear-gradient(180deg, transparent, rgba(255,190,140,.35), transparent); }
  /* social clip */
  .tr .soc { position:absolute; left: 50%; top: 50%; width: 820px; height: 1460px; margin: -730px 0 0 -410px; border-radius: 46px; overflow:hidden; background:#000; box-shadow: 0 40px 120px rgba(0,0,0,.7); }
  .tr .soc .ph { width: 100%; height: 100%; left:0; top:0; }
  .tr .soc .top { position:absolute; left: 34px; right: 34px; top: 40px; display:flex; align-items:center; gap: 18px; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,.6); }
  .tr .soc .av { width: 76px; height: 76px; border-radius:50%; background: linear-gradient(135deg,#ffb36b,#ff3d7f); border: 3px solid #fff; }
  .tr .soc .bars { position:absolute; left: 30px; right: 30px; top: 18px; height: 6px; border-radius: 3px; background: rgba(255,255,255,.35); overflow:hidden; } .tr .soc .bars i { display:block; height:100%; background:#fff; }
  .tr .soc .cap { position:absolute; left: 34px; right: 140px; bottom: 60px; font-size: 40px; font-weight: 700; line-height: 1.2; text-shadow: 0 2px 12px rgba(0,0,0,.8); }
  .tr .soc .cap span { display:block; font-size: 30px; font-weight: 500; opacity: .85; margin-top: 8px; }
  .tr .soc .side { position:absolute; right: 30px; bottom: 80px; display:flex; flex-direction:column; gap: 34px; align-items:center; font-size: 26px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,.7); }
  .tr .soc .side svg { width: 74px; height: 74px; display:block; filter: drop-shadow(0 2px 8px rgba(0,0,0,.5)); }
  .tr .heart { position:absolute; width: 90px; height: 90px; }
  /* loading-screen panels */
  .tr .lp { position:absolute; overflow:hidden; }
  .tr .lp .ph { width: 130%; height: 130%; filter: contrast(1.1) saturate(1.25); }
  .tr .lp .tint { position:absolute; inset:0; mix-blend-mode: color; opacity: .55; }
  .tr .lp .tint2 { position:absolute; inset:0; mix-blend-mode: soft-light; }
  /* end tile */
  .tr .tile { position:absolute; left: 50%; top: 640px; width: 640px; height: 640px; margin-left: -320px; border-radius: 120px; overflow:hidden;
    background: linear-gradient(200deg, #ffd27a 0%, #ff8a5c 30%, #ff4f8b 58%, #a23fcf 85%, #5b2cc4 100%); box-shadow: 0 50px 140px rgba(255,80,140,.45); }
  .tr .tile::after { content:''; position:absolute; inset:0; background: linear-gradient(180deg, rgba(255,255,255,.35), transparent 40%); }
  .tr .tile img { position:absolute; left: 50%; top: 50%; width: 520px; transform: translate(-50%,-50%); filter: brightness(0) invert(1) drop-shadow(0 6px 18px rgba(80,0,60,.35)); z-index: 2; }
  .tr .eline { position:absolute; left:0; right:0; text-align:center; }
  `;
  const palm = (hgt, lean, seed) => {
    const r = n => { const x = Math.sin(seed * 99.1 + n * 12.9898) * 43758.5453; return x - Math.floor(x); };
    const tx = 200 + lean, ty = 60, pts = [];
    for (let i = 0; i <= 20; i++) { const k = i / 20, x = 200 + lean * k * k, y = hgt + 40 - (hgt - 20) * k, w = lerp(28, 11, k); pts.push([x - w / 2, y], [x + w / 2, y]); }
    const L = pts.filter((_, i) => i % 2 === 0), Rr = pts.filter((_, i) => i % 2 === 1).reverse();
    const d = 'M' + L.concat(Rr).map(p => p.map(v => v.toFixed(1)).join(',')).join(' L') + 'Z';
    let fr = '';
    for (let i = 0; i < 11; i++) {
      const a = -175 + i * 35 + r(i) * 12, len = 200 + r(i + 9) * 80, droop = 70 + r(i + 3) * 60, rad = a * Math.PI / 180;
      const ex = tx + Math.cos(rad) * len, ey = ty + 20 + Math.sin(rad) * len * .45 + droop, mx = tx + Math.cos(rad) * len * .5, my = ty + Math.sin(rad) * len * .5 - 30, nx = -Math.sin(rad) * 22, ny = Math.cos(rad) * 22;
      fr += `M${tx},${ty + 20} Q${(mx + nx).toFixed(1)},${(my + ny).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)} Q${(mx - nx * .4).toFixed(1)},${(my - ny * .4 + 16).toFixed(1)} ${tx},${ty + 20}Z `;
    }
    return `<svg viewBox="0 0 400 ${hgt + 60}" width="400" height="${hgt + 60}"><path d="${d}" fill="#140818"/><path d="${fr}" fill="#140818"/></svg>`;
  };
  const ICO = {
    heart: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M12 21 3.5 12.9A5 5 0 0 1 12 6.1a5 5 0 0 1 8.5 6.8z"/></svg>',
    heartR: '<svg viewBox="0 0 24 24"><path fill="#ff2d55" d="M12 21 3.5 12.9A5 5 0 0 1 12 6.1a5 5 0 0 1 8.5 6.8z"/></svg>',
    com: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M12 3C6.5 3 2 6.8 2 11.5c0 2.4 1.2 4.6 3.1 6.1L4 21l4.2-2c1.2.4 2.5.6 3.8.6 5.5 0 10-3.8 10-8.5S17.5 3 12 3z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M14 4l8 7.5-8 7.5v-4.5c-6 0-9.5 1.8-12 5.5 1-6 4.5-11 12-12z"/></svg>',
  };

  SCENES.trailer = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'tr', root), T = s.cuts;
    const shot = () => h('div', 'shot', R);
    const photo = (par, f, w, hh) => { const p = h('div', 'ph', par); Object.assign(p.style, { width: w + 'px', height: hh + 'px', marginLeft: -w / 2 + 'px', marginTop: -hh / 2 + 'px', backgroundImage: `url(${IMG(f)})` }); return p; };

    // 0 — black title card
    const s0 = shot(); const c0 = h('div', 'card', s0, 'Tout le monde<br>en parle.<small>Élite Maillot</small>');
    // 1 — sunset over the sea, palms, slow crane down
    const s1 = shot(); const sky = h('div', 'sky', s1), sunb = h('div', 'sunb', s1), sea = h('div', 'sea2', s1), haze = h('div', 'haze', s1);
    const GL = Array.from({ length: 22 }, (_, i) => { const g = h('i', 'glint', s1); const w = 420 - i * 15; Object.assign(g.style, { width: w + 'px', marginLeft: -w / 2 + 'px' }); g._i = i; return g; });
    const PALMS = [[-120, 1900, 1500, 150, 1, 1.25], [760, 1980, 1650, -170, 2, 1.35], [120, 1500, 900, 60, 5, .8], [640, 1520, 820, -50, 7, .75]].map(([x, y, hg, ln, sd, par]) => {
      const p = h('div', 'palm', s1, palm(hg, ln, sd)); Object.assign(p.style, { left: x + 'px', top: (y - hg - 60) + 'px', transformOrigin: '50% 100%' }); p._par = par; return p; });
    const c1 = h('div', 'card', s1, ''); c1.style.top = '1520px'; c1.style.fontSize = '44px'; c1.style.letterSpacing = '.25em'; c1.innerHTML = 'ÉLITE MAILLOT';
    // 2 — product shot, slow push with rack focus
    const s2 = shot(); const p2 = photo(s2, 'photo-paris-exterieur.jpg', 1500, 1500);
    // 3 — social clip 1
    const social = (f, user, cap, sub, likes) => {
      const sh = shot(); h('div', 'ph', sh).style.cssText = `left:0;top:0;width:100%;height:100%;background:url(${IMG(f)}) center/cover;filter:blur(40px) brightness(.45)`;
      const so = h('div', 'soc', sh, `<div class="ph" style="background-image:url(${IMG(f)})"></div><div class="bars"><i></i></div><div class="top"><div class="av"></div>${user}<span style="opacity:.7;font-weight:500">· 2 h</span></div>
        <div class="side"><div class="hb">${ICO.heart}</div><span class="lk">${likes}</span>${ICO.com}<span>1 204</span>${ICO.share}<span>Partager</span></div><div class="cap">${cap}<span>${sub}</span></div>`);
      const hearts = Array.from({ length: 7 }, (_, i) => { const x = h('div', 'heart', sh, ICO.heartR); return x; });
      return { sh, so, ph: so.querySelector('.ph'), bar: so.querySelector('.bars i'), hb: so.querySelector('.hb'), lk: so.querySelector('.lk'), hearts, likes };
    };
    const S3 = social('photo-real-madrid-domicile.jpg', 'ryad.93', 'Il est trop propre 😳🔥', '#elitemaillot #realmadrid', 48);
    // 4 — extreme close-up on the crest
    const s4 = shot(); const p4 = photo(s4, 'photo-barcelone-domicile-detail.jpg', 1900, 1900);
    // 5 — social clip 2
    const S5 = social('photo-manchester-city-domicile.jpg', 'ines.lvx', '3 achetés, le 4ème offert 😭', 'jsuis refaite #elitemaillot', 112);
    // 6 — fast montage
    const s6 = shot(); const MF = ['photo-paris-exterieur.jpg', 'photo-real-madrid-domicile.jpg', 'photo-barcelone-domicile.jpg', 'photo-france-exterieur-detail.jpg', 'photo-barcelone-exterieur.jpg', 'photo-manchester-city-domicile.jpg', 'photo-france-exterieur.jpg'].map(f => photo(s6, f, 1700, 1700));
    // 7 — loading-screen panel collage
    const s7 = shot(); s7.style.background = '#120818';
    const LP = [['photo-paris-exterieur.jpg', '#ff4f8b', [[0, 0], [1080, 0], [1080, 520], [0, 760]]], ['photo-barcelone-domicile.jpg', '#ffb04f', [[0, 790], [1080, 550], [1080, 1150], [0, 1250]]],
      ['photo-real-madrid-domicile.jpg', '#4fd6e6', [[0, 1280], [520, 1197], [520, 1920], [0, 1920]]], ['photo-barcelone-exterieur.jpg', '#a23fcf', [[550, 1192], [1080, 1180], [1080, 1920], [550, 1920]]]].map(([f, c, poly]) => {
      const l = h('div', 'lp', s7); l.style.inset = '0'; l.style.clipPath = `polygon(${poly.map(([x, y]) => x + 'px ' + y + 'px').join(',')})`;
      const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]), cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2, sz = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * 1.25;
      const p = h('div', 'ph', l); Object.assign(p.style, { left: cx + 'px', top: cy + 'px', width: sz + 'px', height: sz + 'px', marginLeft: -sz / 2 + 'px', marginTop: -sz / 2 + 'px', backgroundImage: `url(${IMG(f)})` });
      h('div', 'tint', l).style.background = c; h('div', 'tint2', l).style.background = `linear-gradient(160deg, ${c}, transparent 70%)`;
      return { l, p }; });
    // 8 — black card with the offer
    const s8 = shot(); const c8 = h('div', 'card', s8, '3 achetés.<br><span style="color:#ff8a5c">Le 4ème offert.</span>');
    // 9 — end tile
    const s9 = shot(); s9.style.background = 'radial-gradient(80% 50% at 50% 45%, #2a0f2e, #000 75%)';
    const tile = h('div', 'tile', s9, `<img src="${IMG('logo-light.svg')}">`);
    const e1 = h('div', 'eline', s9, 'ELITE-MAILLOT.FR'); Object.assign(e1.style, { top: '1360px', fontFamily: 'ArchivoV', fontWeight: 800, fontVariationSettings: "'wdth' 80, 'wght' 800", fontSize: '64px', letterSpacing: '.06em' });
    const e2 = h('div', 'eline', s9, 'DISPONIBLE MAINTENANT'); Object.assign(e2.style, { top: '1460px', fontSize: '32px', letterSpacing: '.4em', color: 'rgba(255,255,255,.65)', fontWeight: 600 });

    // global film layers
    h('div', 'grade', R); h('div', 'warm', R);
    const leak = h('div', 'leak', R); h('div', 'vig', R);
    const lbT = h('div', 'lb', R), lbB = h('div', 'lb', R); lbT.style.top = '0'; lbB.style.bottom = '0';
    const flash = h('div', 'flash', R);
    const SH = [s0, s1, s2, S3.sh, s4, S5.sh, s6, s7, s8, s9];

    const socialAt = (S, a, b, t) => {
      const k = prog(t, a, .5, oq); S.so.style.transform = `translateY(${(1 - k) * 200}px) rotate(${(1 - k) * 4 - 1.5}deg) scale(${lerp(.9, 1, k)})`;
      S.ph.style.transform = `scale(${1.05 + (t - a) * .05})`; S.bar.style.width = clamp((t - a) / (b - a)) * 100 + '%';
      const tap = a + (b - a) * .45, on = t > tap; S.hb.innerHTML = on ? ICO.heartR : ICO.heart; S.hb.style.transform = `scale(${on ? 1 + .4 * Math.max(0, 1 - (t - tap) / .25) : 1})`;
      S.lk.textContent = (on ? S.likes + 1 + Math.floor((t - tap) * 40) : S.likes) + 'k';
      S.hearts.forEach((x, i) => { const hk = clamp((t - tap - i * .07) / 1.1); x.style.opacity = hk > 0 && hk < 1 ? (1 - hk) : 0; x.style.left = 870 + Math.sin(i * 2.1 + hk * 4) * 40 + 'px'; x.style.top = 1350 - hk * 520 + 'px'; x.style.transform = `scale(${.6 + hk * .6}) rotate(${Math.sin(i) * 20}deg)`; });
    };

    return t => {
      let idx = 0; for (let i = 0; i < T.length; i++) if (t >= T[i]) idx = i;
      SH.forEach((x, i) => { x.style.display = i === idx ? 'block' : 'none'; });
      const a = T[idx], b = T[idx + 1] ?? s.duration, k = clamp((t - a) / (b - a));
      // letterbox opens a little on the end tile
      const lbh = idx === 9 ? lerp(170, 0, prog(t, a, 1.2, io)) : 170; lbT.style.height = lbB.style.height = lbh + 'px';
      // light leak wandering across the frame on the live-action shots
      const lv = [1, 2, 4, 7].includes(idx); leak.style.display = lv ? '' : 'none';
      if (lv) { leak.style.background = `radial-gradient(circle, rgba(255,${120 + 60 * Math.sin(t)},60,.55), transparent 65%)`; leak.style.left = lerp(-700, 600, (t * .23) % 1) + 'px'; leak.style.top = 200 + Math.sin(t * .7) * 400 + 'px'; }
      // white flash on the montage cuts and on the start of the collage
      let fl = 0;
      if (idx === 6) { const n = MF.length, d = (b - a) / n, j = Math.min(n - 1, Math.floor((t - a) / d)); MF.forEach((p, i) => { p.style.display = i === j ? '' : 'none'; }); const kk = (t - a - j * d) / d; MF[j].style.transform = `scale(${1.08 + kk * .1}) rotate(${(j % 2 ? 1 : -1) * (1 - kk) * 2}deg)`; fl = Math.max(0, 1 - (t - a - j * d) / .08) * .8; }
      if (idx === 7 || idx === 9) fl = Math.max(fl, Math.max(0, 1 - (t - a) / .15));
      flash.style.opacity = fl;

      if (idx === 0) { const q = Math.min(prog(t, a + .25, .6, oq), 1 - prog(t, b - .45, .4)); c0.style.opacity = q; c0.style.letterSpacing = lerp(.08, .01, q) + 'em'; }
      if (idx === 1) {
        const pan = lerp(520, 0, io(k)), hz = 1180;
        sky.style.transform = `translateY(${pan * .3}px)`; sunb.style.top = hz - 190 + pan * .4 + 'px'; sea.style.top = hz + pan * .55 + 'px'; haze.style.top = hz - 150 + pan * .5 + 'px';
        GL.forEach(g => { g.style.top = hz + 10 + g._i * 26 + pan * .55 + 'px'; g.style.opacity = (1 - g._i / 24) * (.55 + .45 * Math.sin(t * 3 + g._i * 1.7)); g.style.transform = `translateX(${Math.sin(t * 1.4 + g._i) * 18}px)`; });
        PALMS.forEach((p, i) => { p.style.transform = `translateY(${pan * p._par}px) translateX(${(k - .5) * -60 * p._par}px) rotate(${Math.sin(t * .9 + i) * 1.2}deg)`; });
        c1.style.opacity = Math.min(prog(t, a + 1.0, .6), 1 - prog(t, b - .4, .3));
      }
      if (idx === 2) { p2.style.transform = `scale(${lerp(1.0, 1.18, k)}) translateX(${lerp(30, -30, k)}px)`; p2.style.filter = `blur(${Math.max(0, 1 - k * 3) * 12}px)`; }
      if (idx === 3) socialAt(S3, a, b, t);
      if (idx === 4) { p4.style.transform = `scale(${lerp(1.0, 1.25, io(k))}) rotate(${lerp(-4, 2, k)}deg)`; p4.style.filter = `blur(${Math.max(0, .6 - k) * 14}px)`; }
      if (idx === 5) socialAt(S5, a, b, t);
      if (idx === 7) LP.forEach(({ l, p }, i) => { const q = prog(t, a + i * .18, .6, oq); l.style.transform = `translateX(${(1 - q) * (i % 2 ? 1100 : -1100)}px)`; p.style.transform = `scale(${1.05 + k * .12}) translate(${(i % 2 ? -1 : 1) * k * 30}px, ${k * -20}px)`; });
      if (idx === 8) { const q = Math.min(prog(t, a + .1, .45, oq), 1 - prog(t, b - .3, .25)); c8.style.opacity = q; c8.style.transform = `translateY(-50%) scale(${lerp(1.08, 1, q)})`; }
      if (idx === 9) {
        const q = prog(t, a + .1, 1.0, oq); tile.style.opacity = clamp(q * 2); tile.style.transform = `scale(${lerp(.82, 1, q)})`;
        const sh = clamp((t - a - .9) / 1.0); tile.style.boxShadow = `0 50px 140px rgba(255,80,140,${.25 + .3 * Math.sin(sh * Math.PI)})`;
        e1.style.opacity = prog(t, a + 1.0, .6); e2.style.opacity = prog(t, a + 1.5, .6);
      }
    };
  };
})();
