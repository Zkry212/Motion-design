// MEUDA — SMSA. Apple Music promo in the zensu.visuals language (no phone, no desk): pure black, big moving glow
// "flames" in Apple Music red, the logo blooming in the centre and its name typing, Apple Music UI fragments in
// extreme close-up tilted in 3D with glowing rims and Liquid Glass (real refraction, liquidglass.js), a selection
// capsule sliding down the sidebar, the search typing "Meuda" with the last letters lit, the result, the album card
// turning in 3D, Play, the Now Playing panel with a glowing waveform, whip zooms with motion blur, and the end card
// "DISPONIBLE MAINTENANT SUR TOUTES LES PLATEFORMES" with the platform logos.
(() => {
  const { SCENES, h, esc, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/' + f), LG = window.LG, AM = '#fa2d48';
  const smooth = k => k * k * (3 - 2 * k);
  const kf = (t, K, ez = smooth) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [t0, a, e2] = K[i - 1], [t1, b] = K[i], k = (e2 || ez)((t - t0) / (t1 - t0)); return Array.isArray(a) ? a.map((x, j) => lerp(x, b[j], k)) : lerp(a, b, k); } return K[K.length - 1][1]; };
  const whip = k => (k < .5 ? 16 * k ** 5 : 1 - Math.pow(-2 * k + 2, 5) / 2);
  const win = (t, a, b, fi = .3, fo = .3) => Math.min(prog(t, a, fi, E.out), 1 - prog(t, b - fo, fo, E.inOut));
  const NOTE = '<svg viewBox="0 0 24 24"><path fill="#fff" d="M18 3v11.2a3.2 3.2 0 1 1-1.6-2.8V7.2L9 8.8v7.4A3.2 3.2 0 1 1 7.4 13.4V5.5z"/></svg>';
  const I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    house: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2.5 11h2.7v9h5v-6h3.6v6h5v-9h2.7z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
    radio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2.2" fill="currentColor"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/></svg>',
    lib: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="3" height="16" rx="1"/><rect x="8" y="4" width="3" height="16" rx="1"/><path d="m13.5 5.2 2.9-.8 4.2 15.4-2.9.8z"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 4.5v15l12-7.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    fwd: '<svg viewBox="0 0 32 24"><path fill="currentColor" d="M2 4v16l12-8zM16 4v16l12-8z"/></svg>',
    back: '<svg viewBox="0 0 32 24"><path fill="currentColor" d="M30 4v16L18 12zM16 4v16L4 12z"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7h3c4 0 6 10 10 10h4M3 17h3c1.5 0 2.7-1.3 3.8-3M14 9.8C15 8.2 16 7 17 7h3M18 4l3 3-3 3M18 14l3 3-3 3"/></svg>',
    cursor: '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  };
  // platform marks (simplified, drawn here) for the end card
  const PLAT = {
    apple: `<span class="pm" style="background:linear-gradient(180deg,#ff5e73,#fa2d48 55%,#e01d3c)">${NOTE}</span>`,
    spotify: '<span class="pm" style="background:#1ed760;border-radius:50%"><svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-linecap="round"><path d="M5.5 8.6c4.4-1.4 9.4-1 13 1.1" stroke-width="2.2"/><path d="M6.4 12.1c3.6-1.1 7.6-.7 10.6 1" stroke-width="1.9"/><path d="M7.2 15.3c2.8-.8 5.8-.5 8.2.8" stroke-width="1.6"/></svg></span>',
    deezer: '<span class="pm" style="background:#a238ff"><svg viewBox="0 0 24 24" fill="#fff"><path d="M12 20.5 4.2 12.9A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 7.8 6.3z"/></svg></span>',
    youtube: '<span class="pm" style="background:#ff0033;border-radius:50%"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.6" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M10.2 9.2v5.6l4.6-2.8z" fill="#fff"/></svg></span>',
    amazon: '<span class="pm" style="background:linear-gradient(135deg,#25d1da,#4470ff)"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><path d="M5 14c4 2.6 10 2.6 14 0"/><path d="M16.5 12.6 19 14l-1 2.6"/><path d="M8 6v5M11 6v5M14 6v5M8 8a1.5 1.5 0 0 1 3 0M11 8a1.5 1.5 0 0 1 3 0"/></svg></span>',
    tidal: '<span class="pm" style="background:#000;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35)"><svg viewBox="0 0 24 24" fill="#fff"><path d="M4 9l2.7-2.7L9.4 9 6.7 11.7zM9.3 9 12 6.3 14.7 9 12 11.7zM14.6 9l2.7-2.7L20 9l-2.7 2.7zM9.3 14.3 12 11.6l2.7 2.7L12 17z"/></svg></span>',
    napster: '<span class="pm" style="background:#fff"><svg viewBox="0 0 24 24"><circle cx="12" cy="12.5" r="6.2" fill="#000"/><circle cx="9.6" cy="11.5" r="1.4" fill="#fff"/><circle cx="14.4" cy="11.5" r="1.4" fill="#fff"/><path d="M5.2 11a7 7 0 0 1 13.6 0" fill="none" stroke="#000" stroke-width="2"/><rect x="3.6" y="10.4" width="2.6" height="4.6" rx="1.2" fill="#000"/><rect x="17.8" y="10.4" width="2.6" height="4.6" rx="1.2" fill="#000"/></svg></span>',
  };

  const CSS = `
  .z2 { position:absolute; inset:0; background:#000; overflow:hidden; font-family: Inter, system-ui, sans-serif; color:#fff; }
  .z2 .flame { position:absolute; border-radius: 50%; filter: blur(70px); mix-blend-mode: screen; will-change: transform; }
  .z2 .stage { position:absolute; inset:0; perspective: 1800px; perspective-origin: 540px 960px; }
  .z2 .cam { position:absolute; inset:0; transform-style: preserve-3d; transform-origin: 540px 960px; }
  .z2 .pane { position:absolute; transform-style: preserve-3d; }
  .z2 .trn { position:absolute; inset:0; transform-style: preserve-3d; }
  .z2 .flare { position:absolute; inset:0; z-index: 25; pointer-events:none; background: radial-gradient(60% 40% at 50% 50%, rgba(255,255,255,.9), rgba(250,45,72,.55) 40%, rgba(250,45,72,0) 75%); mix-blend-mode: screen; opacity: 0; }
  .z2 .hookmw { position:absolute; left: 60px; width: 960px; top: 830px; } .z2 .hooksm { position:absolute; left: 50%; width: 300px; margin-left: -150px; top: 700px; }
  .z2 .hookam { position:absolute; left: 50%; top: 1150px; width: 96px; height: 96px; margin-left: -48px; filter: drop-shadow(0 0 30px rgba(250,36,60,.9)); }
  .z2 .rim { box-shadow: 0 0 0 1.5px rgba(255,255,255,.22), 0 0 40px rgba(250,45,72,.35), 0 0 120px rgba(250,45,72,.18), inset 0 1px 0 rgba(255,255,255,.25); }
  .z2 .dark { background: linear-gradient(160deg, rgba(36,36,40,.95), rgba(10,10,12,.97)); border-radius: 44px; }
  /* opener */
  .z2 .amlogo { position:absolute; left: 50%; top: 50%; width: 220px; height: 220px; margin: -110px 0 0 -110px; filter: drop-shadow(0 0 40px rgba(250,36,60,.9)) drop-shadow(0 0 120px rgba(250,36,60,.5)); }
  .z2 .amlogo svg { width: 100%; height: 100%; display:block; }
  .z2 .amname { position:absolute; left: 0; right:0; top: 1110px; text-align:center; font-size: 104px; font-weight: 700; letter-spacing: -.03em; }
  .z2 .amname span { display:inline-block; }
  /* sidebar */
  .z2 .side { width: 760px; padding: 50px 46px; box-sizing:border-box; }
  .z2 .side .it { display:flex; align-items:center; gap: 30px; height: 110px; font-size: 52px; font-weight: 600; color: rgba(255,255,255,.88); padding: 0 34px; position:relative; z-index: 2; }
  .z2 .side .it svg { width: 50px; height: 50px; color: ${AM}; }
  .z2 .side .sel { position:absolute; left: 46px; right: 46px; height: 110px; border-radius: 30px; z-index: 1; }
  .z2 .side .hd { font-size: 38px; font-weight: 700; color: rgba(255,255,255,.45); padding: 0 34px 18px; display:flex; align-items:center; gap: 18px; }
  .z2 .side .hd i { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(180deg,#ff5e73,#fa2d48); display:grid; place-items:center; } .z2 .side .hd i svg { width: 60%; }
  /* search */
  .z2 .sbar { width: 940px; height: 150px; display:flex; align-items:center; gap: 30px; padding: 0 44px; box-sizing:border-box; font-size: 70px; font-weight: 600; letter-spacing: -.02em; }
  .z2 .sbar > * { position:relative; z-index: 6; } .z2 .sbar svg { width: 60px; height: 60px; color: rgba(255,255,255,.7); flex:none; }
  .z2 .sbar .ph { color: rgba(255,255,255,.35); } .z2 .sbar .lit { background: linear-gradient(90deg, #fff, ${AM}); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .z2 .sbar .caret { width: 5px; height: 80px; background: ${AM}; border-radius: 3px; box-shadow: 0 0 20px ${AM}; }
  .z2 .sbar .mic { margin-left:auto; }
  .z2 .res { width: 940px; height: 230px; display:flex; align-items:center; gap: 34px; padding: 0 34px; box-sizing:border-box; }
  .z2 .res .cv { width: 170px; height: 170px; border-radius: 22px; background: #000 center/cover; box-shadow: 0 10px 40px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.15); flex:none; }
  .z2 .res b { font-size: 60px; letter-spacing:-.02em; display:block; } .z2 .res span { font-size: 40px; color: rgba(255,255,255,.55); }
  .z2 .res .e { display:inline-grid; place-items:center; width: 40px; height: 40px; border-radius: 9px; background: rgba(255,255,255,.55); color:#000; font-size: 26px; font-weight: 800; vertical-align: 8px; margin-left: 12px; }
  /* album card */
  .z2 .albc { width: 860px; padding: 50px; box-sizing:border-box; }
  .z2 .albc .cv { width: 760px; height: 760px; border-radius: 30px; background:#000 center/cover; box-shadow: 0 40px 90px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.12); }
  .z2 .albc .t { margin-top: 44px; text-align:center; } .z2 .albc .t b { font-size: 78px; letter-spacing:-.03em; } .z2 .albc .t span { display:block; font-size: 56px; color: ${AM}; font-weight: 500; margin-top: 6px; }
  .z2 .albc .t small { display:block; font-size: 30px; color: rgba(255,255,255,.45); letter-spacing: .08em; font-weight: 600; margin-top: 14px; }
  .z2 .albc .btns { display:flex; gap: 30px; margin-top: 44px; height: 130px; position:relative; }
  .z2 .pbtn { color: ${AM}; font-size: 46px; font-weight: 700; display:flex; align-items:center; justify-content:center; gap: 18px; } .z2 .pbtn > * { position:relative; z-index: 6; } .z2 .pbtn svg { width: 46px; height: 46px; }
  /* now playing */
  .z2 .np { width: 900px; height: 1500px; overflow:hidden; border-radius: 60px; }
  .z2 .np .bg { position:absolute; inset: -30%; background:#000 center/cover; filter: blur(60px) brightness(.5); }
  .z2 .np .art { position:absolute; left: 70px; top: 70px; width: 760px; height: 760px; border-radius: 28px; background:#000 center/cover; box-shadow: 0 40px 90px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.15); }
  .z2 .np .nm { position:absolute; left: 70px; top: 880px; } .z2 .np .nm b { font-size: 66px; letter-spacing:-.02em; } .z2 .np .nm span { display:block; font-size: 50px; color: rgba(255,255,255,.6); }
  .z2 .np .wv { position:absolute; left: 70px; right: 70px; top: 1040px; height: 150px; display:flex; align-items:center; gap: 9px; }
  .z2 .np .wv i { flex:1; border-radius: 6px; background: linear-gradient(180deg, #fff, ${AM}); box-shadow: 0 0 18px rgba(250,45,72,.7); }
  .z2 .np .tm { position:absolute; left: 70px; right: 70px; top: 1210px; display:flex; justify-content:space-between; font-size: 30px; color: rgba(255,255,255,.55); font-weight: 600; }
  .z2 .np .ctl { position:absolute; left: 110px; width: 680px; top: 1280px; height: 160px; display:flex; align-items:center; justify-content:space-around; color:#fff; }
  .z2 .np .ctl > * { position:relative; z-index: 6; } .z2 .np .ctl .s { width: 90px; height: 70px; } .z2 .np .ctl .m { width: 100px; height: 100px; } .z2 .np .ctl svg { width: 100%; height: 100%; }
  .z2 .cur { position:absolute; width: 70px; height: 70px; z-index: 40; filter: drop-shadow(0 6px 10px rgba(0,0,0,.6)); }
  .z2 .ripple { position:absolute; width: 120px; height: 120px; margin: -60px; border-radius:50%; border: 4px solid rgba(255,255,255,.9); z-index: 39; }
  /* end card */
  .z2 .end { position:absolute; inset:0; z-index: 30; }
  .z2 .end .l1, .z2 .end .l2 { position:absolute; left: 0; right: 0; text-align:center; font-weight: 800; letter-spacing: .02em; }
  .z2 .end .l1 { top: 420px; font-size: 128px; line-height: 1.05; } .z2 .end .l2 { top: 720px; font-size: 46px; color: rgba(255,255,255,.75); letter-spacing: .1em; }
  .z2 .end .l1 span, .z2 .end .l2 span { display:inline-block; }
  .z2 .end .acc { color: ${AM}; text-shadow: 0 0 40px rgba(250,45,72,.6); }
  .z2 .end .row { position:absolute; left: 70px; right: 70px; top: 850px; display:grid; grid-template-columns: repeat(4, 1fr); gap: 34px 28px; }
  .z2 .end .pl { height: 200px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap: 14px; font-size: 24px; font-weight: 600; color: rgba(255,255,255,.85); }
  .z2 .end .pl > * { position:relative; z-index: 6; }
  .z2 .pmk { display:grid; place-items:center; width: 104px; height: 104px; } .z2 .pmk svg { display:block; filter: drop-shadow(0 6px 18px rgba(0,0,0,.5)); }
  .z2 .pm { display:grid; place-items:center; width: 104px; height: 104px; border-radius: 26px; } .z2 .pm svg { width: 64%; }
  .z2 .end .mw { position:absolute; left: 50%; width: 560px; margin-left: -280px; top: 1420px; } .z2 .end .sm { position:absolute; left:50%; width: 190px; margin-left:-95px; top: 1340px; }
  .z2 .end .lab { position:absolute; left:0; right:0; top: 1640px; text-align:center; font-size: 26px; letter-spacing: .3em; color: rgba(255,255,255,.5); font-weight: 600; }
  `;

  const SI = name => { const x = new XMLHttpRequest(); x.open('GET', IMG('logos/' + name + '.svg'), false); x.send(); return (x.responseText.match(/ d="([^"]+)"/) || [])[1] || ''; };
  const mark = (name, fill, size = 104) => `<svg class="mk" viewBox="0 0 24 24" width="${size}" height="${size}"><path fill="${fill}" d="${SI(name)}"/></svg>`;
  SCENES.meuda2 = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'z2', root), B = s.beats, COVER = IMG('img/cover.jpg');
    // glow flames (Apple Music red / pink / warm)
    const FL = [['#fa2d48', 900, 30, 12], ['#ff6a3d', 700, 75, 20], ['#c3125f', 800, 60, 88], ['#ff2d55', 600, 20, 70]].map(([c, d, x, y]) => { const f = h('div', 'flame', R); Object.assign(f.style, { width: d + 'px', height: d * .7 + 'px', background: `radial-gradient(closest-side, ${c}, transparent)`, left: x + '%', top: y + '%', marginLeft: -d / 2 + 'px', marginTop: -d * .35 + 'px' }); return f; });
    const stage = h('div', 'stage', R), cam = h('div', 'cam', stage);
    const pane = (cls, x, y, w, hh, html = '') => { const wr = h('div', 'trn', cam); const el = h('div', 'pane ' + cls, wr, html); el._w = wr; Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px' }); return el; };
    const glassify = (el, w, hh, o = {}) => LG.make(el, { w, h: hh, r: o.r, tint: o.tint ?? 'rgba(255,255,255,.07)', scale: o.scale ?? 50, depth: o.depth });

    // 1. opener: Apple Music icon blooms, the name types in
    const logo = pane('', 0, 0, 1080, 1920, `<img class="hooksm" src="${IMG('img/smsa.svg')}"><img class="hookmw" src="${IMG('img/meuda.svg')}"><div class="hookam">${mark('applemusic', '#fa243c', 96)}</div>`);
    const hMW = logo.querySelector('.hookmw'), hSM = logo.querySelector('.hooksm'), hAM = logo.querySelector('.hookam');
    // 2. sidebar (dark panel, glass selection capsule)
    const side = pane('side dark rim', 160, 560, 760, 900, `<div class="hd">${mark('applemusic', '#fa243c', 56)}Apple Music</div>
      ${[['search', 'Rechercher'], ['house', 'Accueil'], ['grid', 'Nouveautés'], ['radio', 'Radio'], ['lib', 'Bibliothèque']].map(([ic, n]) => `<div class="it">${I[ic]}${n}</div>`).join('')}`);
    const sel = h('div', 'sel', side); glassify(sel, 668, 110, { r: 30, tint: 'rgba(250,45,72,.16)' }); sel.style.boxShadow = '0 0 40px rgba(250,45,72,.5)';
    // 3. search bar + result
    const sbar = pane('sbar', 70, 700, 940, 150, `${I.search}<span class="tx"></span><span class="caret"></span><span class="ph">Artistes, titres…</span><span class="mic">${I.mic}</span>`); glassify(sbar, 940, 150, { tint: 'rgba(255,255,255,.08)' }); sbar.classList.add('rim');
    const res = pane('res dark rim', 70, 900, 940, 230, `<div class="cv" style="background-image:url(${COVER})"></div><div><b>Meuda<span class="e">E</span></b><span>Single · SMSA</span></div>`);
    const tx = sbar.querySelector('.tx'), ph = sbar.querySelector('.ph'), caret = sbar.querySelector('.caret');
    // 4. album card
    const albc = pane('albc dark rim', 110, 230, 860, 1420, `<div class="cv" style="background-image:url(${COVER})"></div><div class="t"><b>Meuda</b><span>SMSA</span><small>SINGLE · L.A.P RECORDS</small></div><div class="btns"></div>`);
    const btns = albc.querySelector('.btns');
    const bPlay = h('div', 'pbtn', btns, `${I.play}<span>Lecture</span>`); Object.assign(bPlay.style, { position: 'absolute', left: '0px', top: '0px', width: '365px', height: '130px' }); glassify(bPlay, 365, 130, { tint: 'rgba(255,255,255,.1)' });
    const bShuf = h('div', 'pbtn', btns, `${I.shuffle}<span>Aléatoire</span>`); Object.assign(bShuf.style, { position: 'absolute', left: '395px', top: '0px', width: '365px', height: '130px' }); glassify(bShuf, 365, 130, { tint: 'rgba(255,255,255,.1)' });
    // 5. now playing
    const np = pane('np rim', 90, 210, 900, 1500, `<div class="bg" style="background-image:url(${COVER})"></div><div class="art" style="background-image:url(${COVER})"></div>
      <div class="nm"><b>Meuda</b><span>SMSA</span></div><div class="wv">${Array.from({ length: 42 }, () => '<i></i>').join('')}</div><div class="tm"><span class="t1">0:00</span><span class="t2">-2:41</span></div>`);
    const ctl = h('div', 'ctl', np, `<span class="s">${I.back}</span><span class="m">${I.pause}</span><span class="s">${I.fwd}</span>`); glassify(ctl, 680, 160, { tint: 'rgba(255,255,255,.08)' });
    const npArt = np.querySelector('.art'), wv = [...np.querySelectorAll('.wv i')], t1 = np.querySelector('.t1'), t2 = np.querySelector('.t2'), npBg = np.querySelector('.bg');
    // 3D: every card is a thick slab (stacked edge layers behind it), the cover floats in front of the player
    const SLABS = [];
    const slab = (el, depth, rad) => { const n = 6, L = []; for (let k = 0; k < n; k++) { const d = document.createElement('div'); Object.assign(d.style, { position: 'absolute', left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height, borderRadius: rad + 'px', background: `rgb(${46 - k * 5},${12 - k},${20 - k * 2})`, border: '2px solid rgba(250,45,72,.22)' }); el._w.insertBefore(d, el); L.push([d, -(k + 1) * depth / n]); } SLABS.push([el, L]); };
    slab(res, 40, 40); slab(albc, 70, 60); slab(np, 80, 60);
    const pop = h('div', '', np._w); Object.assign(pop.style, { position: 'absolute', left: 90 + 70 + 'px', top: 210 + 70 + 'px', width: '760px', height: '760px', borderRadius: '28px', background: `#000 url(${COVER}) center/cover`, boxShadow: '0 30px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.15)', transformOrigin: '380px 380px' });
    npArt.style.visibility = 'hidden';
    const cur = h('div', 'cur', R, I.cursor), rip = h('div', 'ripple', R), flare = h('div', 'flare', R);
    // end card
    const end = h('div', 'end', R, `<div class="l1">${'DISPONIBLE'.split('').map(c => `<span>${c}</span>`).join('')}<br>${'MAINTENANT'.split('').map(c => `<span class="acc">${c}</span>`).join('')}</div>
      <div class="l2">${'SUR TOUTES LES PLATEFORMES'.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div><div class="row"></div>
      <img class="sm" src="${IMG('img/smsa.svg')}"><img class="mw" src="${IMG('img/meuda.svg')}"><div class="lab">L.A.P RECORDS</div>`);
    const l1 = [...end.querySelectorAll('.l1 span')], l2 = [...end.querySelectorAll('.l2 span')], row = end.querySelector('.row');
    const PL = [['applemusic', '#fa243c', 'Apple Music'], ['spotify', '#1ed760', 'Spotify'], ['deezer', '#a238ff', 'Deezer'], ['youtubemusic', '#ff0000', 'YouTube Music'], ['tidal', '#ffffff', 'TIDAL'], ['napster', '#2259ff', 'Napster'], ['soundcloud', '#ff5500', 'SoundCloud'], ['audiomack', '#ffa200', 'Audiomack']].map(([k, c, n]) => {
      const el = h('div', 'pl', row, `<span class="pmk">${mark(k, c, 96)}</span><span>${n}</span>`); return el; });
    const eSM = end.querySelector('.sm'), eMW = end.querySelector('.mw'), eLab = end.querySelector('.lab');
    let plGlassDone = false;
    R.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute"><filter id="zmb" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur id="zmbg" stdDeviation="0 0" edgeMode="duplicate"/></filter></svg>`);
    const mbg = R.querySelector('#zmbg');

    // camera: translate x/y, zoom, rotateY, rotateX, rotateZ — whip moves between shots, slow drifts inside a shot
    const BAR = 4 * 60 / (s.bpm || 125);
    // calm camera: soft eased moves, no whips; long slow drifts on the Now Playing screen
    const io = E.inOut, N = B.np, S = (B.out - B.np - .7) / 4;
    const CAM = [
      [0, [0, 0, 1.06, 0, 0, 0], io],
      [B.search - .35, [0, 0, 1.0, 0, 0, 0], io],
      [B.search, [0, 120, 1.02, -22, 10, 2]],
      [B.album - .35, [0, 100, 1.0, -16, 8, 1], io],
      [B.album, [0, 0, .9, 24, 8, -2]],
      [B.play - .4, [0, 0, .96, 16, 6, -1], io],
      [B.play, [0, -150, 1.02, 6, 4, 0]],
      [N - .1, [0, -150, 1.02, 6, 4, 0], io],
      [N + .6, [0, 0, .84, -26, 10, 2], io],
      [N + .6 + S, [0, -200, 1.04, 22, 8, -2], io],
      [N + .6 + S * 2, [0, 180, 1.02, -22, 12, 2], io],
      [N + .6 + S * 3, [0, 0, .88, 24, 6, -1], io],
      [B.out - .1, [0, 40, .94, 8, 4, 0], io],
      [B.out + .4, [0, 0, .74, 0, 0, 0]],
      [s.duration, [0, 0, .76, 0, 0, 0]],
    ];
    const camAt = t => kf(t, CAM);
    const camCss = c => `translate(${c[0]}px, ${c[1]}px) scale(${c[2]}) rotateY(${c[3]}deg) rotateX(${c[4]}deg) rotateZ(${c[5]}deg)`;
    const beat = t => { const bp = (t - (s.beatOffset || 0)) * (s.bpm || 140) / 60; return Math.pow(1 - (((bp % 1) + 1) % 1), 3); };

    return t => {
      const c = camAt(t), p = camAt(t - 1 / 30);
      cam.style.transform = camCss(c);
      const v = Math.hypot(c[0] - p[0], c[1] - p[1]) + Math.abs(Math.log(c[2] / p[2])) * 600 + Math.abs(c[3] - p[3]) * 14 + Math.abs(c[4] - p[4]) * 14;
      const bxy = Math.min(5, Math.max(0, v - 8) * .12), horiz = Math.abs(c[3] - p[3]) * 14 + Math.abs(c[0] - p[0]), vert = Math.abs(c[4] - p[4]) * 14 + Math.abs(c[1] - p[1]);
      const tot = horiz + vert + 1e-6, eb = 0;
      if (bxy + eb > .4) { mbg.setAttribute('stdDeviation', `${(bxy * (.3 + horiz / tot) + eb).toFixed(2)} ${(bxy * (.3 + vert / tot) + eb).toFixed(2)}`); stage.style.filter = 'url(#zmb)'; } else stage.style.filter = 'none';
      const bt = beat(t);
      FL.forEach((f, i) => { f.style.transform = `translate(${Math.sin(t * .7 + i * 2) * 140}px, ${Math.cos(t * .55 + i) * 120}px) scale(${1 + Math.sin(t * .9 + i) * .15 + bt * .08 * (t > B.np ? 1 : 0)}) rotate(${t * 12 + i * 40}deg)`; f.style.opacity = .55 + .25 * Math.sin(t * .8 + i); });
      const show = (el, a, b) => {
        const w2 = el._w || el, ki = a < 0 ? 1 : prog(t, a, .38, E.outQuint), ko = prog(t, b - .22, .22, k => k * k * k), k = Math.min(ki, 1 - ko);
        w2.style.display = k > .001 ? '' : 'none'; w2.style.opacity = clamp(ki * 1.6) * (1 - ko);
        w2.style.transform = `translateZ(${(1 - ki) * -320 + ko * 380}px)`; w2.style.filter = (1 - ki) + ko > .02 ? `blur(${((1 - ki) * 6 + ko * 6).toFixed(1)}px)` : 'none';
        return k; };
      const fl = Math.max(...[B.menu, B.search, B.album, B.np, B.out, B.end].map(x => clamp(1 - Math.abs(t - x) / .12))); flare.style.opacity = fl * .35;
      // 1. opener
      show(logo, -1, B.menu);
      const mk2 = prog(t, .05, .6, E.outQuint); hMW.style.opacity = mk2; hMW.style.transform = `scale(${lerp(1.3, 1, mk2) * (1 + bt * .035)})`; hMW.style.filter = mk2 < 1 ? `blur(${(1 - mk2) * 22}px)` : `drop-shadow(0 0 ${20 + bt * 40}px rgba(250,45,72,.6))`;
      const sk2 = prog(t, .22 + .48, .4, E.outQuint); hSM.style.opacity = sk2; hSM.style.transform = `translateY(${(1 - sk2) * 30}px)`;
      const ak2 = prog(t, .22 + .96, .4, E.back); hAM.style.opacity = clamp(ak2 * 2); hAM.style.transform = `scale(${lerp(.4, 1, ak2) * (1 + bt * .06)})`;
      // 2. sidebar: capsule slides down then back up to "Rechercher"
      show(side, B.menu, B.search);
      const selI = kf(t, [[B.menu + .2, 4], [B.menu + .9, 2], [B.search - .7, 0]]); sel.style.top = (50 + 74 + selI * 110) + 'px'; LG.sheen(sel, t * .4);
      side.style.transform = `translateZ(${(1 - prog(t, B.menu - .3, .5, E.outQuint)) * -500}px)`;
      // 3. search: typing with lit last letters, result rises
      show(sbar, B.search, B.album); show(res, B.search + 1.2, B.album);
      const q = 'Meuda', n = Math.floor(clamp((t - B.search - .15) / (30 / (s.bpm || 125)) + 1, 0, q.length));
      tx.innerHTML = n ? `${esc(q.slice(0, Math.max(0, n - 2)))}<span class="lit">${esc(q.slice(Math.max(0, n - 2), n))}</span>` : ''; ph.style.display = n ? 'none' : ''; caret.style.opacity = Math.floor(t * 3) % 2 || n < q.length ? 1 : 0;
      LG.sheen(sbar, t * .35);
      const rk = prog(t, B.search + 1.2, .5, E.back); res.style.transform = `translateY(${(1 - rk) * 80}px) translateZ(${(1 - rk) * -200}px)`;
      // 4. album card turns in 3D, cursor clicks Play
      show(albc, B.album, B.np);
      const ak = prog(t, B.album - .3, .9, E.outQuint); albc.style.transform = `rotateY(${(1 - ak) * -14}deg) translateZ(${(1 - ak) * -150}px)`;
      [bPlay, bShuf].forEach((b2, i) => LG.sheen(b2, t * .3 + i * .4));
      bPlay.style.transform = `scale(${1 - .06 * clamp(1 - Math.abs(t - B.play) / .12)})`; bPlay.style.boxShadow = t > B.play ? '0 0 50px rgba(250,45,72,.6)' : '';
      const ck = prog(t, B.play - .8, .7, E.inOut), cv2 = win(t, B.play - .9, B.play + .5, .2, .2);
      cur.style.opacity = cv2; cur.style.left = lerp(820, 330, ck) + 'px'; cur.style.top = lerp(1500, 1300, ck) + 'px'; cur.style.transform = `scale(${t > B.play && t < B.play + .1 ? .85 : 1})`;
      const rpk = clamp((t - B.play) / .45); rip.style.opacity = t > B.play ? (1 - rpk) : 0; rip.style.left = '340px'; rip.style.top = '1310px'; rip.style.transform = `scale(${.2 + rpk * 1.6})`;
      // 5. now playing: art pulses on the beat, glowing waveform, time runs
      show(np, B.np, B.out);
      const nk = prog(t, B.np - .05, .6, E.outQuint); np.style.transform = `translateZ(${(1 - nk) * -200}px)`;
      npBg.style.transform = `scale(${1.1 + bt * .05}) rotate(${t * 4}deg)`;
      wv.forEach((b2, i) => { b2.style.height = (14 + 130 * Math.abs(Math.sin(t * 6 + i * .55) * Math.cos(t * 2.3 + i * .21)) * (.45 + bt * .55)) + 'px'; });
      const el = Math.max(0, t - B.np + (s.trackStart || 0)), fm = x => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`; t1.textContent = fm(el); t2.textContent = '-' + fm(Math.max(0, (s.trackLen || 161) - el));
      LG.sheen(ctl, t * .3);
      pop.style.transform = `${np.style.transform || ''} translateZ(150px) scale(${1 + bt * .03})`;
      SLABS.forEach(([el, L]) => L.forEach(([d, z]) => { d.style.transform = `${el.style.transform || ''} translateZ(${z}px)`; }));
      // end card: letters fall into place, the platform marks arrive in Liquid Glass tiles
      const ek = prog(t, B.end, .3); end.style.opacity = ek; end.style.display = ek > 0 ? '' : 'none';
      if (ek > 0 && !plGlassDone) { PL.forEach(pl => { pl.style.position = 'relative'; LG.make(pl, { w: pl.offsetWidth || 200, h: 200, r: 40, tint: 'rgba(255,255,255,.06)' }); pl.style.position = 'relative'; }); plGlassDone = true; }
      l1.forEach((sp, i) => { const k = prog(t, B.end + i * .04, .4, E.outQuint); sp.style.opacity = clamp(k * 2); sp.style.transform = `translateY(${(1 - k) * -40}px)`; });
      l2.forEach((sp, i) => { const k = prog(t, B.end + .96 + i * .02, .45, E.outQuint); sp.style.opacity = k; sp.style.filter = k < 1 ? `blur(${(1 - k) * 10}px)` : 'none'; });
      PL.forEach((pl, i) => { const k = prog(t, B.end + 1.44 + i * .24, .45, E.outQuint); pl.style.opacity = clamp(k * 2); pl.style.transform = `translateY(${(1 - k) * 60}px) scale(${lerp(.6, 1, k)})`; LG.sheen(pl, t * .3 + i * .2); });
      const mk = prog(t, B.end + 3.36, .6, E.outQuint); eMW.style.opacity = mk; eMW.style.transform = `scale(${lerp(1.2, 1, mk) * (1 + bt * .03 * mk)})`; eSM.style.opacity = prog(t, B.end + 3.6, .5); eLab.style.opacity = prog(t, B.end + 3.84, .5);
    };
  };
})();
