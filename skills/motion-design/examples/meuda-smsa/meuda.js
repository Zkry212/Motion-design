// MEUDA — SMSA (L.A.P Records). Apple Music promo in the iOS 26 Liquid Glass language, filmed like the reference
// ads: hook on the wordmark under a glass lens, a dark 3D desk of glass widgets, notifications from the top, a camera
// dive into the iPhone, the Apple Music album page (glass buttons, glass tab bar, glass mini player), Play opens the
// Now Playing screen, zooms, a glass bento, and the end card. Liquid Glass = liquidglass.js (real refraction).
(() => {
  const { SCENES, h, esc, clamp, lerp, E, prog, wordsEl, rel } = window.MOTION;
  const IMG = f => rel('assets/' + f), LG = window.LG;
  const AM = '#fa2d48';
  const win = (t, a, b, fi = .4, fo = .4) => Math.min(prog(t, a, fi, E.out), 1 - prog(t, b - fo, fo, E.inOut));
  const SW = 390, SH = 844, PX = -69, PY = 0, PWW = SW + 28, PHH = SH + 28, SX = PX + 14, SY = PY + 14;
  const bellCache = {};
  const bell = p => { const key = p.toFixed(3); if (bellCache[key]) return bellCache[key]; const A = Math.max(.08, 4 * p), Bb = Math.max(.08, 4 * (1 - p)), N = 400, cum = [0];
    for (let i = 1; i <= N; i++) { const k = (i - .5) / N; cum.push(cum[i - 1] + Math.pow(k, A) * Math.pow(1 - k, Bb)); }
    const tot = cum[N], f = k => { const x = clamp(k) * N, i = Math.floor(x); return i >= N ? 1 : (cum[i] + (cum[i + 1] - cum[i]) * (x - i)) / tot; }; bellCache[key] = f; return f; };

  const ICON = {
    note: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M18 3v11.2a3.2 3.2 0 1 1-1.6-2.8V7.2L9 8.8v7.4A3.2 3.2 0 1 1 7.4 13.4V5.5z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 4.5v15l12-7.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    fwd: '<svg viewBox="0 0 32 24"><path fill="currentColor" d="M2 4v16l12-8zM16 4v16l12-8z"/></svg>',
    back: '<svg viewBox="0 0 32 24"><path fill="currentColor" d="M30 4v16L18 12zM16 4v16L4 12z"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7h3c4 0 6 10 10 10h4M3 17h3c1.5 0 2.7-1.3 3.8-3M14 9.8C15 8.2 16 7 17 7h3M18 4l3 3-3 3M18 14l3 3-3 3"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M15 5l-7 7 7 7"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="#fff"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    house: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2.5 11h2.7v9h5v-6h3.6v6h5v-9h2.7z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
    radio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2.2" fill="currentColor"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/></svg>',
    lib: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="3" height="16" rx="1"/><rect x="8" y="4" width="3" height="16" rx="1"/><path d="m13.5 5.2 2.9-.8 4.2 15.4-2.9.8z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    lyrics: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>',
    airplay: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M6 17H4V5h16v12h-2"/><path d="m12 14 5 6H7z" fill="#fff"/></svg>',
    queue: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M4 6h12M4 11h12M4 16h7M17 14v6l4-3z"/></svg>',
    vlo: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M4 9h4l5-4v14l-5-4H4z"/></svg>',
    vhi: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.3 5.7a9 9 0 0 1 0 12.6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
  };
  const amIcon = '<span class="amic">' + ICON.note + '</span>';

  const CSS = `
  .mz { position:absolute; inset:0; font-family: Inter, system-ui, sans-serif; color:#fff; overflow:hidden; background: radial-gradient(90% 60% at 50% 40%, #1d1d21 0%, #0a0a0c 60%, #030304 100%); }
  .mz .persp { position:absolute; inset:0; perspective: 2400px; perspective-origin: 540px 960px; }
  .mz .cam { position:absolute; left:0; top:0; width:0; height:0; transform-origin: 0 0; transform-style: preserve-3d; }
  .mz .tw { position:absolute; transform-style: preserve-3d; }
  .mz .tw > .tsh { position:absolute; inset: 4% 3% -2% 3%; border-radius: 60px; background: rgba(0,0,0,.6); filter: blur(30px); transform: translateZ(-30px) translateY(26px); }
  .mz .tw > .tx { position:absolute; inset:0; border-radius: 56px; }
  .mz .face { position:absolute; inset:0; border-radius: 56px; overflow:hidden; color:#fff;
     background: linear-gradient(150deg, rgba(70,70,78,.92), rgba(24,24,28,.96) 55%, rgba(14,14,17,.98));
     box-shadow: inset 0 1.5px 0 rgba(255,255,255,.28), inset 0 0 0 1px rgba(255,255,255,.08), inset 0 -30px 60px rgba(0,0,0,.35); }
  .mz .face::after { content:''; position:absolute; inset:0; border-radius: inherit; background: linear-gradient(120deg, rgba(255,255,255,.14), rgba(255,255,255,0) 40%); pointer-events:none; }
  .mz .face.lt { background: linear-gradient(150deg, rgba(235,236,240,.95), rgba(190,192,198,.95)); color:#111; }
  .mz .amic { display:grid; place-items:center; width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(180deg,#ff5e73,#fa2d48 55%,#e01d3c); flex:none; }
  .mz .amic svg { width: 62%; }
  .mz .wnp { position:absolute; inset:0; padding: 30px; display:flex; flex-direction:column; }
  .mz .wnp .cv { width: 150px; height: 150px; border-radius: 18px; background: #000 center/cover; box-shadow: 0 10px 30px rgba(0,0,0,.5); }
  .mz .wnp b { font-size: 34px; margin-top: 18px; letter-spacing: -.02em; } .mz .wnp small { font-size: 26px; color: rgba(255,255,255,.6); }
  .mz .wnp .bar { margin-top: auto; height: 7px; border-radius: 4px; background: rgba(255,255,255,.2); overflow:hidden; } .mz .wnp .bar i { display:block; height:100%; background:#fff; border-radius: 4px; }
  .mz .wnew { position:absolute; inset:0; padding: 28px 32px; display:flex; gap: 22px; align-items:center; }
  .mz .wnew .cv { width: 170px; height: 170px; border-radius: 16px; background:#000 center/cover; flex:none; box-shadow: 0 10px 30px rgba(0,0,0,.5); }
  .mz .wnew small { color:${AM}; font-weight: 800; font-size: 22px; letter-spacing: .06em; } .mz .wnew b { display:block; font-size: 40px; letter-spacing:-.02em; margin: 6px 0 2px; } .mz .wnew span { font-size: 26px; color: rgba(255,255,255,.6); }
  .mz .wav { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap: 10px; }
  .mz .wav i { display:block; width: 14px; border-radius: 7px; background: linear-gradient(180deg,#fff, ${AM}); }
  .mz .wlab { position:absolute; inset:0; padding: 30px; display:flex; flex-direction:column; justify-content:flex-end; } .mz .wlab small { color: rgba(255,255,255,.55); font-size: 22px; font-weight: 600; } .mz .wlab b { font-size: 38px; letter-spacing:-.02em; }
  .mz .bigcv { position:absolute; inset: 0; background:#000 center/cover; }

  /* phone */
  .mz .iph { position:absolute; left:${PX}px; top:${PY}px; width:${PWW}px; height:${PHH}px; border-radius: 70px; padding: 4px; box-sizing:border-box;
     background: linear-gradient(150deg, #3a3b40 0%, #17181b 25%, #4a4b51 45%, #121316 65%, #3c3d43 85%, #222327 100%);
     box-shadow: inset 0 0 0 1px rgba(255,255,255,.25), 0 60px 90px rgba(0,0,0,.6), 0 18px 30px rgba(0,0,0,.4); }
  .mz .bez { width:100%; height:100%; border-radius: 66px; background:#000; padding: 10px; box-sizing:border-box; }
  .mz .scr { position:relative; width:${SW}px; height:${SH}px; border-radius: 56px; overflow:hidden; background:#000; }
  .mz .isl { position:absolute; top: 11px; left:50%; width: 124px; height: 36px; margin-left:-62px; border-radius: 20px; background:#000; z-index: 60; }
  .mz .stb { position:absolute; top:0; left:0; right:0; height: 50px; display:flex; justify-content:space-between; align-items:center; padding: 6px 32px 0 42px; font-size: 16.5px; font-weight: 650; z-index: 55; color:#fff; box-sizing:border-box; }
  .mz .stb .ic { display:flex; gap: 5px; align-items:center; } .mz .stb svg { display:block; }
  .mz .glare { position:absolute; inset:0; z-index: 70; pointer-events:none; border-radius: 56px; background: linear-gradient(118deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,.03) 22%, rgba(255,255,255,0) 38%); }
  .mz .off { position:absolute; inset:0; background:#000; z-index: 65; }
  .mz .hi { position:absolute; bottom: 8px; left:50%; width: 134px; height: 5px; margin-left: -67px; border-radius: 3px; background: rgba(255,255,255,.85); z-index: 58; }
  /* Apple Music album page */
  .mz .alb { position:absolute; inset:0; background: linear-gradient(180deg, #262628 0%, #0c0c0d 46%, #000 100%); }
  .mz .alb .topb { position:absolute; left: 16px; right: 16px; top: 54px; height: 40px; z-index: 5; }
  .mz .gbtn { color:#fff; display:grid; place-items:center; } .mz .gbtn svg { width: 20px; height: 20px; position:relative; z-index: 6; }
  .mz .alb .cv { position:absolute; left: 60px; top: 108px; width: 270px; height: 270px; border-radius: 14px; background:#000 center/cover; box-shadow: 0 24px 50px rgba(0,0,0,.65), 0 0 0 .5px rgba(255,255,255,.15); }
  .mz .alb .tt { position:absolute; left:0; right:0; top: 396px; text-align:center; } .mz .alb .tt b { font-size: 25px; letter-spacing:-.02em; } .mz .alb .tt .ar { display:block; font-size: 21px; color:${AM}; margin-top: 3px; font-weight: 500; } .mz .alb .tt small { display:block; font-size: 13px; color: rgba(255,255,255,.5); margin-top: 6px; font-weight: 600; letter-spacing: .02em; }
  .mz .ebadge { display:inline-grid; place-items:center; width: 17px; height: 17px; border-radius: 4px; background: rgba(255,255,255,.55); color:#000; font-size: 11px; font-weight: 800; vertical-align: 3px; margin-left: 6px; }
  .mz .pb { color:${AM}; font-size: 17px; font-weight: 700; display:flex; align-items:center; justify-content:center; gap: 8px; } .mz .pb svg { width: 18px; height: 18px; position:relative; z-index: 6; } .mz .pb span { position:relative; z-index: 6; }
  .mz .trk { position:absolute; left: 20px; right: 20px; top: 556px; height: 48px; display:flex; align-items:center; gap: 14px; border-top: .5px solid rgba(255,255,255,.12); border-bottom: .5px solid rgba(255,255,255,.12); font-size: 16px; }
  .mz .trk i { font-style:normal; color: rgba(255,255,255,.45); width: 14px; } .mz .trk .dt { margin-left:auto; width: 22px; opacity: .7; }
  .mz .ftr { position:absolute; left: 20px; right: 20px; top: 618px; font-size: 13px; color: rgba(255,255,255,.45); line-height: 1.6; }
  .mz .mini { color:#fff; display:flex; align-items:center; gap: 12px; padding: 0 16px 0 8px; box-sizing:border-box; }
  .mz .mini > * { position:relative; z-index: 6; } .mz .mini .th { width: 40px; height: 40px; border-radius: 9px; background:#000 center/cover; flex:none; } .mz .mini b { font-size: 15px; flex:1; } .mz .mini svg { width: 22px; height: 22px; }
  .mz .tab { display:flex; align-items:center; justify-content:space-around; padding: 0 6px; box-sizing:border-box; }
  .mz .tab > div { position:relative; z-index: 6; display:flex; flex-direction:column; align-items:center; gap: 2px; font-size: 10px; font-weight: 600; color: rgba(255,255,255,.75); width: 70px; }
  .mz .tab > div.on { color:${AM}; } .mz .tab svg { width: 24px; height: 24px; }
  .mz .srch svg { width: 22px; height: 22px; position:relative; z-index: 6; color:#fff; }
  /* Now Playing */
  .mz .np { position:absolute; inset:0; overflow:hidden; z-index: 50; }
  .mz .np .nm span.ebadge { display:inline-grid; margin-top:0; color:#000; font-size: 11px; }
  .mz .np .bgc { position:absolute; inset: -40%; background: center/cover; filter: blur(46px) brightness(.55) saturate(1.2); }
  .mz .np .tint { position:absolute; inset:0; background: radial-gradient(80% 50% at 50% 30%, rgba(80,80,90,.35), rgba(0,0,0,.6)); }
  .mz .np .grab { position:absolute; top: 58px; left:50%; width: 40px; height: 5px; margin-left: -20px; border-radius: 3px; background: rgba(255,255,255,.4); }
  .mz .np .art { position:absolute; left: 30px; top: 92px; width: 330px; height: 330px; border-radius: 14px; background:#000 center/cover; box-shadow: 0 30px 60px rgba(0,0,0,.6), 0 0 0 .5px rgba(255,255,255,.18); }
  .mz .np .nm { position:absolute; left: 30px; right: 30px; top: 452px; } .mz .np .nm b { font-size: 23px; letter-spacing:-.02em; } .mz .np .nm span { display:block; font-size: 20px; color: rgba(255,255,255,.6); margin-top: 2px; }
  .mz .np .scrub { position:absolute; left: 30px; right: 30px; top: 520px; } .mz .np .scrub .tr { height: 6px; border-radius: 3px; background: rgba(255,255,255,.22); overflow:hidden; } .mz .np .scrub .tr i { display:block; height:100%; background: rgba(255,255,255,.9); }
  .mz .np .scrub .tm { display:flex; justify-content:space-between; font-size: 12px; color: rgba(255,255,255,.55); margin-top: 6px; font-weight: 600; }
  .mz .ctl { display:flex; align-items:center; justify-content:space-around; color:#fff; padding: 0 20px; box-sizing:border-box; }
  .mz .ctl > span { position:relative; z-index: 6; display:grid; place-items:center; } .mz .ctl .s { width: 40px; height: 30px; } .mz .ctl .m { width: 46px; height: 46px; }
  .mz .ctl svg { width: 100%; height: 100%; }
  .mz .np .vol { position:absolute; left: 30px; right: 30px; top: 692px; display:flex; align-items:center; gap: 12px; } .mz .np .vol svg { width: 18px; height: 18px; } .mz .np .vol .tr { flex:1; height: 6px; border-radius: 3px; background: rgba(255,255,255,.22); overflow:hidden; } .mz .np .vol .tr i { display:block; height:100%; width: 62%; background: rgba(255,255,255,.9); }
  .mz .np .bot { position:absolute; left: 50px; right: 50px; top: 744px; height: 44px; }
  .mz .eq { position:absolute; display:flex; align-items:flex-end; gap: 4px; height: 26px; } .mz .eq i { display:block; width: 5px; border-radius: 3px; background: ${AM}; }
  /* overlays */
  .mz .hl { position:absolute; z-index: 10; left: 3%; right: 3%; top: 175px; text-align:center; font-size: 74px; font-weight: 750; letter-spacing: -.035em; line-height:1.06; color:#fff; transform: translateY(-50%); white-space: nowrap; text-shadow: 0 4px 30px rgba(0,0,0,.6); }
  .mz .hl .w { display:inline-block; margin: 0 .12em; } .mz .hl .acc { color: ${AM}; }
  .mz .fog { position:absolute; left:0; right:0; top:0; height: 380px; background: linear-gradient(180deg, rgba(5,5,6,.92) 0%, rgba(5,5,6,.7) 50%, rgba(5,5,6,0) 100%); z-index: 9; }
  .mz .hook { position:absolute; inset:0; z-index: 15; display:grid; place-items:center; }
  .mz .hook img.mw { position:absolute; left: 60px; width: 960px; top: 820px; }
  .mz .hook img.sm { position:absolute; left: 50%; width: 300px; margin-left: -150px; top: 700px; }
  .mz .chip { color:#fff; font-size: 34px; font-weight: 700; display:flex; align-items:center; justify-content:center; gap: 14px; } .mz .chip > * { position:relative; z-index: 6; }
  .mz .ntf { position:absolute; left: 44px; top: 0; width: 992px; height: 160px; z-index: 12; display:flex; align-items:center; gap: 24px; padding: 0 30px; box-sizing:border-box; }
  .mz .ntf > * { position:relative; z-index: 6; } .mz .ntf .av { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(180deg,#8a8f9a,#5d626d); display:grid; place-items:center; font-size: 38px; font-weight: 600; flex:none; position:relative; }
  .mz .ntf .av .bd2 { position:absolute; right: -6px; bottom: -6px; width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(180deg,#6af27e,#18c045); display:grid; place-items:center; } .mz .ntf .av .bd2 svg { width: 24px; }
  .mz .ntf .amic { width: 88px; height: 88px; border-radius: 22px; }
  .mz .ntf .bd { flex:1; min-width:0; } .mz .ntf .top { display:flex; justify-content:space-between; } .mz .ntf b { font-size: 33px; } .mz .ntf small { font-size: 26px; color: rgba(255,255,255,.6); }
  .mz .ntf p { margin: 4px 0 0; font-size: 31px; color: rgba(255,255,255,.92); white-space:nowrap; overflow:hidden; text-overflow: ellipsis; }
  .mz img.emo { height: 1.08em; vertical-align: -.2em; }
  .mz .dots { position:absolute; left:50%; top: 50%; display:flex; gap: 20px; transform: translate(-50%,-50%); z-index: 20; } .mz .dots i { width: 26px; height: 26px; border-radius: 50%; background: ${AM}; display:block; }
  .mz .end { position:absolute; inset:0; z-index: 21; }
  .mz .end img.mw { position:absolute; left: 60px; width: 960px; top: 760px; }
  .mz .end img.sm { position:absolute; left: 50%; width: 280px; margin-left: -140px; top: 640px; }
  .mz .end .av2 { color:#fff; font-size: 34px; font-weight: 700; display:flex; align-items:center; justify-content:center; gap: 16px; }
  .mz .end .av2 > * { position:relative; z-index: 6; } .mz .end .av2 .amic { width: 56px; height: 56px; border-radius: 14px; }
  .mz .end .lab { position:absolute; left:0; right:0; top: 1290px; text-align:center; font-size: 26px; letter-spacing: .3em; color: rgba(255,255,255,.55); font-weight: 600; }
  .mz .veil { position:absolute; inset:0; z-index: 19; background: radial-gradient(70% 45% at 50% 48%, rgba(8,8,10,.92), rgba(5,5,6,.75) 60%, rgba(0,0,0,.6)); }
  `;

  SCENES.meuda = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'mz', root), persp = h('div', 'persp', R), cam = h('div', 'cam', persp), B = s.beats;
    const fog = h('div', 'fog', R);
    const COVER = IMG('img/cover.svg');

    // ---------- desk of dark glass widgets (world)
    const T = [];
    const tile = (x0, y0, x1, y1, html = '', o = {}) => {
      const el = h('div', 'tw', cam); Object.assign(el.style, { left: x0 + 'px', top: y0 + 'px', width: x1 - x0 + 'px', height: y1 - y0 + 'px' });
      h('div', 'tsh', el);
      [26, 18, 10, 4].forEach((z, i) => { const e = h('div', 'tx', el); e.style.transform = `translateZ(${-z}px)`; e.style.background = ['#020203', '#060607', '#0b0b0d', '#121215'][i]; });
      const face = h('div', 'face' + (o.lt ? ' lt' : ''), el, html);
      const r = { el, face, d: o.d ?? (.15 + T.length * .03), near: o.near, bento: o.bento }; T.push(r); return r;
    };
    const tNP = tile(-300, -760, 120, -340, `<div class="wnp"><div class="cv" style="background-image:url(${COVER})"></div><b>Meuda</b><small>SMSA</small><div class="bar"><i class="pbw"></i></div></div>`, { d: .3 });
    tile(160, -760, 760, -520, `<div class="wnew"><div class="cv" style="background-image:url(${COVER})"></div><div><small>NOUVELLE SORTIE</small><b>Meuda</b><span>SMSA · Single</span></div></div>`, { d: .38 });
    const tWav = tile(160, -490, 445, -205, `<div class="wav">${Array.from({ length: 9 }, () => '<i></i>').join('')}</div>`, { d: .45 });
    tile(475, -490, 760, -205, `<div class="wlab"><small>Label</small><b>L.A.P<br>Records</b></div>`, { d: .52 });
    tile(-300, -300, 120, -45, `<div class="wlab"><small>Artiste</small><b>SMSA</b></div>`, { d: .6, near: 1 });
    tile(-520, 60, -110, 520, '', { near: 1 }); tile(-520, 560, -110, 955, '', { near: 1, lt: 1 });
    tile(390, -170, 800, 380, '', { near: 1, lt: 1 }); tile(390, 420, 800, 955, '', { near: 1 });
    tile(-520, 995, -110, 1300, '', { near: 2 }); tile(-69, 995, 349, 1300, '', { near: 2 }); tile(390, 995, 800, 1300, '', { near: 2 });
    tile(800, -760, 1100, -360, '', {});
    const pbw = tNP.el.querySelector('.pbw'), wavBars = [...tWav.el.querySelectorAll('.wav i')];
    // bento (finale)
    const BT = [
      tile(-390, 0, -100, 250, `<div class="bigcv" style="background-image:url(${COVER})"></div>`, { bento: 0 }),
      tile(-390, 280, -100, 540, `<div class="wlab"><small>Artiste</small><b>SMSA</b></div>`, { bento: 1 }),
      tile(-390, 570, -100, 815, `<div class="wav">${Array.from({ length: 7 }, () => '<i></i>').join('')}</div>`, { bento: 2 }),
      tile(380, 0, 670, 250, `<div class="wlab"><small>Single</small><b>Meuda</b></div>`, { bento: 3 }),
      tile(380, 280, 670, 540, `<div class="wlab" style="align-items:flex-start">${amIcon}<b style="margin-top:14px;font-size:32px">Apple Music</b></div>`, { bento: 4 }),
      tile(380, 570, 670, 815, `<div class="wlab"><small>Label</small><b>L.A.P<br>Records</b></div>`, { bento: 5 }),
    ];
    const bentoWav = [...BT[2].el.querySelectorAll('.wav i')];

    // ---------- the phone (world) with Apple Music inside
    const iphX = [30, 22, 14, 7].map((z, i) => { const e = h('div', '', cam); Object.assign(e.style, { position: 'absolute', left: PX + 'px', top: PY + 'px', width: PWW + 'px', height: PHH + 'px', borderRadius: '70px', background: ['#050506', '#0c0c0e', '#17171a', '#222226'][i] }); return { e, z }; });
    const iphSh = h('div', '', cam); Object.assign(iphSh.style, { position: 'absolute', left: PX + 20 + 'px', top: PY + 30 + 'px', width: PWW - 40 + 'px', height: PHH - 20 + 'px', borderRadius: '70px', background: 'rgba(0,0,0,.6)', filter: 'blur(36px)' });
    const iph = h('div', 'iph', cam), bez = h('div', 'bez', iph), scr = h('div', 'scr', bez);
    h('div', 'glare', scr); h('div', 'isl', scr);
    h('div', 'stb', scr, `<span>21:30</span><span class="ic"><svg width="18" height="12" viewBox="0 0 18 12" fill="#fff"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="16" height="12" viewBox="0 0 16 12" fill="#fff"><path d="M8 11.6l2.3-2.6a3.2 3.2 0 0 0-4.6 0zM8 4.6c1.9 0 3.6.8 4.8 2l1.4-1.6A8.4 8.4 0 0 0 8 2.4 8.4 8.4 0 0 0 1.8 5l1.4 1.6A6.5 6.5 0 0 1 8 4.6z"/><path d="M8 0C4.8 0 1.9 1.3 0 3.4l1.1 1.2A9.8 9.8 0 0 1 8 1.8c2.7 0 5.2 1.1 6.9 2.8L16 3.4A11.6 11.6 0 0 0 8 0z"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="#fff" opacity=".45"/><rect x="2" y="2" width="17" height="9" rx="2" fill="#fff"/><rect x="24.5" y="4.3" width="1.6" height="4.4" rx=".8" fill="#fff" opacity=".5"/></svg></span>`);
    h('div', 'hi', scr);
    const off = h('div', 'off', scr);
    // album page
    const alb = h('div', 'alb', scr, `<div class="cv" style="background-image:url(${COVER})"></div>
      <div class="tt"><b>Meuda</b><span class="ebadge">E</span><span class="ar">SMSA</span><small>SINGLE · 2026</small></div>
      <div class="trk"><i>1</i>Meuda<span class="ebadge" style="margin-left:2px;vertical-align:1px">E</span><span class="dt">${ICON.dots}</span></div>
      <div class="ftr">1 morceau<br>℗ 2026 L.A.P Records</div>`);
    const gl = (parent, cls, x, y, w, hh, html, o = {}) => { const el = h('div', cls, parent, html); Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px', zIndex: o.z ?? 8 }); LG.make(el, { w, h: hh, r: o.r, tint: o.tint ?? 'rgba(40,40,46,.28)', scale: o.scale ?? 40, depth: o.depth }); return el; };
    const G = [];
    G.push(gl(alb, 'gbtn', 16, 56, 40, 40, ICON.chev));
    G.push(gl(alb, 'gbtn', 290, 56, 40, 40, ICON.plus));
    G.push(gl(alb, 'gbtn', 336, 56, 40, 40, ICON.dots));
    const bPlay = gl(alb, 'pb', 20, 484, 168, 50, `${ICON.play}<span>Lecture</span>`, { tint: 'rgba(255,255,255,.1)' }); G.push(bPlay);
    G.push(gl(alb, 'pb', 202, 484, 168, 50, `${ICON.shuffle}<span>Aléatoire</span>`, { tint: 'rgba(255,255,255,.1)' }));
    const mini = gl(scr, 'mini', 14, 690, 362, 58, `<span class="th" style="background-image:url(${COVER})"></span><b>Pas de lecture</b><span class="mp">${ICON.play}</span><span>${ICON.fwd}</span>`, { z: 40 }); G.push(mini);
    const tab = gl(scr, 'tab', 14, 760, 300, 64, `<div>${ICON.house}Accueil</div><div class="on">${ICON.grid}Nouveautés</div><div>${ICON.radio}Radio</div><div>${ICON.lib}Biblioth.</div>`, { z: 40 }); G.push(tab);
    G.push(gl(scr, 'srch', 322, 760, 64, 64, ICON.search, { z: 40 }));
    const miniTitle = mini.querySelector('b'), miniPlay = mini.querySelector('.mp');
    // Now Playing
    const np = h('div', 'np', scr, `<div class="bgc" style="background-image:url(${COVER})"></div><div class="tint"></div><div class="grab"></div>
      <div class="art" style="background-image:url(${COVER})"></div>
      <div class="nm"><b>Meuda</b><span class="ebadge">E</span><span>SMSA</span></div>
      <div class="scrub"><div class="tr"><i></i></div><div class="tm"><span class="t1">0:00</span><span class="t2">-2:41</span></div></div>
      <div class="vol">${ICON.vlo}<div class="tr"><i></i></div>${ICON.vhi}</div>`);
    const npArt = np.querySelector('.art'), npBar = np.querySelector('.scrub i'), npT1 = np.querySelector('.t1'), npT2 = np.querySelector('.t2'), npBg = np.querySelector('.bgc');
    G.push(gl(np, 'gbtn', 286, 450, 40, 40, ICON.star, { z: 32 })); G.push(gl(np, 'gbtn', 334, 450, 40, 40, ICON.dots, { z: 32 }));
    const ctl = gl(np, 'ctl', 30, 588, 330, 84, `<span class="s">${ICON.back}</span><span class="m pp">${ICON.pause}</span><span class="s">${ICON.fwd}</span>`, { z: 32, tint: 'rgba(255,255,255,.08)' }); G.push(ctl);
    const botG = [gl(np, 'gbtn', 46, 750, 48, 48, ICON.lyrics, { z: 32 }), gl(np, 'gbtn', 171, 750, 48, 48, ICON.airplay, { z: 32 }), gl(np, 'gbtn', 296, 750, 48, 48, ICON.queue, { z: 32 })]; G.push(...botG);
    const eq = h('div', 'eq', np, Array.from({ length: 4 }, () => '<i></i>').join('')); Object.assign(eq.style, { left: '246px', top: '460px', zIndex: 33 }); eq.style.display = 'none';
    const tapEl = h('div', '', scr); Object.assign(tapEl.style, { position: 'absolute', width: '46px', height: '46px', margin: '-23px', borderRadius: '50%', background: 'rgba(255,255,255,.28)', border: '1.5px solid rgba(255,255,255,.7)', zIndex: 80, opacity: 0 });

    // ---------- overlays: hook, notifications, headlines, end
    const hook = h('div', 'hook', R, `<img class="sm" src="${IMG('img/smsa.svg')}"><img class="mw" src="${IMG('img/meuda.svg')}">`);
    const hookMW = hook.querySelector('.mw'), hookSM = hook.querySelector('.sm');
    const lens = h('div', '', hook); Object.assign(lens.style, { left: '0px', top: '760px', width: '460px', height: '300px' }); LG.make(lens, { w: 460, h: 300, r: 150, scale: 90, depth: 70, tint: 'rgba(255,255,255,.04)', blur: .6 });
    const chip = h('div', 'chip', hook, `${amIcon.replace('amic', 'amic" style="width:52px;height:52px;border-radius:13px')}<span>Nouveau single</span>`); Object.assign(chip.style, { left: '290px', top: '1230px', width: '500px', height: '96px' }); LG.make(chip, { w: 500, h: 96, tint: 'rgba(255,255,255,.08)' });
    const NT = s.notifs.map(n2 => { const el = h('div', 'ntf', R, `${n2.app ? amIcon : `<div class="av">${esc(n2.from.slice(0, 1))}<span class="bd2"><svg viewBox="0 0 24 24"><path fill="#fff" d="M12 3.2C6.6 3.2 2.3 6.8 2.3 11.2c0 2.5 1.4 4.7 3.6 6.2-.2 1.3-.8 2.6-1.8 3.5 1.9 0 3.6-.7 4.8-1.7 1 .3 2 .4 3.1.4 5.4 0 9.7-3.6 9.7-8.2S17.4 3.2 12 3.2z"/></svg></span></div>`}<div class="bd"><div class="top"><b>${esc(n2.from)}</b><small>maintenant</small></div><p>${n2.text.replace(/🔥/g, `<img class="emo" src="${IMG('emoji/1f525.png')}">`).replace(/😍/g, `<img class="emo" src="${IMG('emoji/1f60d.png')}">`)}</p></div>`); LG.make(el, { w: 992, h: 160, r: 54, tint: 'rgba(60,60,66,.35)', scale: 50 }); return { el, ...n2 }; });
    const HL = s.headlines.map(x => { const w = wordsEl(R, x.text, ''); w.box.className = 'hl'; if (x.y) w.box.style.top = x.y + 'px'; return { w, ...x }; });
    const dots = h('div', 'dots', R, '<i></i><i></i><i></i>');
    const veil = h('div', 'veil', R);
    const end = h('div', 'end', R, `<img class="sm" src="${IMG('img/smsa.svg')}"><img class="mw" src="${IMG('img/meuda.svg')}"><div class="lab">L.A.P RECORDS</div>`);
    const eMW = end.querySelector('.mw'), eSM = end.querySelector('.sm'), eLab = end.querySelector('.lab');
    const av2 = h('div', 'av2', end, `${amIcon}<span>Disponible sur Apple Music</span>`); Object.assign(av2.style, { left: '170px', top: '1130px', width: '740px', height: '110px' }); LG.make(av2, { w: 740, h: 110, tint: 'rgba(255,255,255,.08)' });
    R.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute"><filter id="mbf2" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur id="mbg2" stdDeviation="0 0" edgeMode="duplicate"/></filter></svg>`);
    const mbg = R.querySelector('#mbg2');

    // ---------- camera (moves with measured-style velocity profiles, still in between)
    const phoneTop = 430, FZ = 1.74, FCY = PY + (960 - phoneTop) / FZ;
    const START = [90, -300, .85, -15, 16];
    const MOVES = [
      { t0: B.desk, t1: B.desk + 1.5, p: .33, to: [-20, -560, 1.5, -6, 6] },
      { t0: B.desk + 1.5, t1: B.glide, p: .5, to: [-14, -556, 1.53, -5.6, 6] },
      { t0: B.glide, t1: B.glide + 1.1, p: .61, to: [460, -420, 1.6, -6, 6] },
      { t0: B.glide + 1.1, t1: B.dive, p: .5, to: [462, -418, 1.62, -6.2, 6] },
      { t0: B.dive, t1: B.dive + 1.7, p: .28, to: [140, FCY, FZ, 0, 0], zmid: .8, km: .45 },
      { t0: B.play + .6, t1: B.play + 1.4, p: .5, to: [SX + 195, SY + 270, 2.6, -2, 4] },          // into the artwork
      { t0: B.play + 2.4, t1: B.play + 3.1, p: .55, to: [SX + 195, SY + 640, 2.7, 2.5, 5] },        // down to the controls
      { t0: B.bento - .45, t1: B.bento + 1.9, p: .2, to: [140, 0, .8, 0, 0] },
      { t0: B.bento + 1.9, t1: B.end - .35, p: .5, to: [140, 12, .78, 0, 0] },
      { t0: B.end - .35, t1: B.end + .05, p: .3, to: [150, 0, .94, 3, 0] },
      { t0: B.end + .05, t1: s.duration, p: .5, to: [150, 0, .96, 3, 0] },
    ];
    const m8 = MOVES[7];
    const camRaw = t => { let c = START.slice(); for (const m of MOVES) { if (t <= m.t0) break; const k = clamp((t - m.t0) / (m.t1 - m.t0)), e = bell(m.p)(k), from = c; c = from.map((v, i) => lerp(v, m.to[i], e));
      if (m.zmid) { const zk = k < m.km ? E.inOut(k / m.km) : E.inOut((k - m.km) / (1 - m.km)); c[2] = k < m.km ? Math.exp(lerp(Math.log(from[2]), Math.log(m.zmid), zk)) : Math.exp(lerp(Math.log(m.zmid), Math.log(m.to[2]), zk)); }
      if (t < m.t1) return c; } return c; };
    const camAt = t => [...camRaw(t), -6 * (1 - bell(m8.p)(clamp((t - m8.t0) / (m8.t1 - m8.t0))))];
    const camCss = c => `translate(540px, 960px) rotateX(${Math.max(c[4], 9)}deg) rotateY(${c[5]}deg) rotateZ(${c[3]}deg) scale(${c[2]}) translate(${-c[0]}px, ${-c[1]}px)`;
    const beat = t => { const bp = (t - .1) * (s.bpm || 140) / 60; return Math.pow(1 - (bp % 1), 3); };   // pulse 1 -> 0 each beat

    return t => {
      const c = camAt(t), p = camAt(t - 1 / 30); cam.style.transform = camCss(c);
      const scrOf = (wx, wy, q) => { const dx = (wx - q[0]) * q[2], dy = (wy - q[1]) * q[2], r = q[3] * Math.PI / 180; return [540 + dx * Math.cos(r) - dy * Math.sin(r), 960 + (dx * Math.sin(r) + dy * Math.cos(r)) * Math.cos(q[4] * Math.PI / 180)]; };
      const sp = scrOf(c[0], c[1], p), dX = 540 - sp[0], dY = 960 - sp[1], zr = Math.abs(Math.log(c[2] / p[2])) * 260 + Math.abs(c[3] - p[3]) * 7;
      const endBlur = prog(t, B.end - .3, .8) * 22;
      const bx = Math.min(9, Math.max(0, Math.abs(dX) - 6) * .2 + zr * .3) + endBlur, by = Math.min(9, Math.max(0, Math.abs(dY) - 6) * .2 + zr * .3) + endBlur;
      if (bx + by > .5) { mbg.setAttribute('stdDeviation', `${bx.toFixed(2)} ${by.toFixed(2)}`); persp.style.filter = 'url(#mbf2)'; } else persp.style.filter = 'none';
      // world appears behind the hook
      persp.style.opacity = prog(t, B.desk - .5, .7) * (1 - prog(t, B.end + .9, .6) * .55);
      T.forEach(o => {
        if (o.bento != null) { const k = prog(t, B.bento - .05 + o.bento * .07, .75, E.outQuint), side = o.bento < 3 ? -1 : 1; o.el.style.opacity = clamp(k * 2); o.el.style.transform = `perspective(900px) translateY(${(1 - k) * 90}px) rotateY(${(1 - k) * side * -95}deg) scale(${lerp(.85, 1, k)})`; return; }
        const d0 = B.desk - .4 + (o.d - .15) * .55, k = prog(t, d0, .5, E.back), kz = prog(t, d0, .7, E.outQuint), out = o.near ? prog(t, B.bento - .25, .4) : 0;
        o.el.style.opacity = clamp(prog(t, d0, .12)) * (1 - out * (o.near === 1 ? 1 : 0));
        o.el.style.transform = `translateZ(${(1 - kz) * 260}px) translateY(${(1 - kz) * -40}px) scale(${lerp(.9, 1, Math.max(0, k)) * (1 - out * .1)})`;
      });
      // live widgets: progress, waveform bars on the beat
      pbw.style.width = (12 + t * 2.2) % 100 + '%';
      const bt = beat(t);
      wavBars.forEach((b2, i) => { b2.style.height = (40 + 140 * Math.abs(Math.sin(t * 5.3 + i * 1.3)) * (.5 + bt * .5)) + 'px'; });
      bentoWav.forEach((b2, i) => { b2.style.height = (30 + 120 * Math.abs(Math.sin(t * 5 + i * 1.1)) * (.5 + bt * .5)) + 'px'; });
      // phone
      const lift = win(t, B.dive, B.bento - .2, .9, .6), pk = prog(t, B.desk - .45, .5, E.back);
      const iphT = `translateZ(${lift * 70}px) scale(${Math.max(.01, pk)})`;
      iph.style.transform = iphT; iph.style.opacity = clamp(prog(t, B.desk - .45, .1));
      iphX.forEach(({ e, z }) => { e.style.transform = `${iphT} translateZ(${-z}px)`; e.style.opacity = iph.style.opacity; });
      iphSh.style.transform = `${iphT} translateZ(${-40 - lift * 70}px) translateY(${30 + lift * 40}px)`; iphSh.style.opacity = iph.style.opacity * (1 - lift * .35);
      off.style.opacity = 1 - prog(t, B.dive + .5, .4);
      // album page -> tap Lecture -> Now Playing slides up
      const tp = at => clamp((t - at + .2) / .2) * (1 - clamp((t - at - .15) / .25));
      const tq = tp(B.play); tapEl.style.opacity = tq; tapEl.style.left = '104px'; tapEl.style.top = '509px'; tapEl.style.transform = `scale(${lerp(1.5, .85, tq)})`;
      bPlay.style.transform = `scale(${1 - .06 * tq})`;
      const playing = t > B.play;
      miniTitle.textContent = playing ? 'Meuda' : 'Pas de lecture'; miniPlay.innerHTML = playing ? ICON.pause : ICON.play;
      const nk = prog(t, B.play + .12, .55, E.outQuint); np.style.transform = `translateY(${(1 - nk) * 100}%)`; np.style.display = t > B.play + .1 ? '' : 'none';
      npArt.style.transform = `scale(${lerp(.4, 1, nk) * (1 + bt * .018 * (playing ? 1 : 0))})`;
      const el = Math.max(0, t - B.play); npBar.style.width = Math.min(100, 4 + el * 0.7) + '%';
      const fm = x => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`; npT1.textContent = fm(el); npT2.textContent = '-' + fm(Math.max(0, 161 - el));
      npBg.style.transform = `scale(${1.1 + Math.sin(t * .6) * .05}) rotate(${t * 3}deg)`;
      eq.style.display = playing ? '' : 'none'; [...eq.children].forEach((b2, i) => { b2.style.height = (6 + 20 * Math.abs(Math.sin(t * 7 + i * 1.7)) * (.4 + bt * .6)) + 'px'; });
      G.forEach((g, i) => LG.sheen(g, t * .18 + i * .13));
      // hook: wordmark + glass lens sweeping across it
      const hk = 1 - prog(t, B.desk - .2, .5, E.inOut);
      hook.style.opacity = hk; hook.style.display = hk > 0 ? '' : 'none';
      const mk = prog(t, .05, .7, E.outQuint); hookMW.style.transform = `scale(${lerp(1.25, 1, mk) + t * .02})`; hookMW.style.opacity = mk; hookMW.style.filter = mk < 1 ? `blur(${(1 - mk) * 18}px)` : 'none';
      const sk = prog(t, .35, .5, E.outQuint); hookSM.style.opacity = sk; hookSM.style.transform = `translateY(${(1 - sk) * 30}px)`;
      const lx = kf2(t, .15, B.desk - .2, -480, 1100); lens.style.left = lx + 'px'; lens.style.top = 760 + Math.sin(t * 2.2) * 20 + 'px'; LG.sheen(lens, t * .4);
      const ck = prog(t, .7, .5, E.back); chip.style.opacity = clamp(ck * 2); chip.style.transform = `translateY(${(1 - ck) * 40}px) scale(${lerp(.8, 1, ck)})`; LG.sheen(chip, t * .3);
      // notifications from the top
      NT.forEach((m, i) => {
        if (t < m.at - .02) { m.el.style.display = 'none'; return; } m.el.style.display = '';
        const ky = q => prog(q, m.at, .55, E.back), newer = q => NT.filter(o => o.at > m.at && q >= o.at).map(o => prog(q, o.at, .45, E.outQuint)).reduce((a2, v2) => a2 + v2, 0);
        const yAt = q => lerp(-260, 300, ky(q)) + newer(q) * 184 - prog(q, B.dive - .45, .45, E.inOut) * 1300;
        const y = yAt(t), vy = Math.abs(y - yAt(t - 1 / 30));
        m.el.style.opacity = clamp(prog(t, m.at, .15)) * (1 - prog(t, B.dive - .2, .25));
        m.el.style.transform = `translateY(${y}px) scale(${1 - newer(t) * .035})`; m.el.style.filter = vy > 8 ? `blur(${Math.min(4, vy * .06).toFixed(1)}px)` : 'none'; m.el.style.zIndex = 12 + i;
        LG.sheen(m.el, t * .25 + i * .3);
      });
      // headlines
      HL.forEach(x => {
        const vis = !(t < x.at - .1 || t > x.out + .05); x.w.box.style.display = vis ? '' : 'none'; if (!vis) return;
        const o = 1 - prog(t, x.out - .3, .3, E.inOut); x.w.box.style.opacity = o; x.w.box.style.transform = `translateY(-50%) translateY(${(1 - o) * -40}px)`;
        x.w.parts.forEach((p2, i) => { const k = prog(t, x.at + i * (x.stagger || .08), .5, E.back), a = clamp(prog(t, x.at + i * (x.stagger || .08), .2)); p2.style.opacity = a; p2.style.filter = 'none'; p2.style.transform = `translateY(${(1 - k) * 46}px) rotate(${(1 - k) * 6}deg) scale(${lerp(.92, 1, k)})`; p2.style.transformOrigin = '0 100%'; });
      });
      fog.style.opacity = prog(t, B.desk - .2, .4) * (1 - prog(t, B.bento - .2, .4));
      // end: dots, then the wordmark under the glass pill
      const dk = win(t, B.end + .3, B.end + 1.2, .2, .25); dots.style.opacity = dk;
      [...dots.children].forEach((d2, i) => { const ph = ((t - B.end) * 2.6 - i * .18) % 1; d2.style.transform = `translateY(${-Math.max(0, Math.sin(ph * Math.PI)) * 26}px)`; });
      veil.style.opacity = prog(t, B.end + .8, .5);
      const L0 = B.end + 1.3, ek = prog(t, L0, .8, E.outQuint); end.style.opacity = t > L0 - .05 ? 1 : 0;
      eMW.style.opacity = ek; eMW.style.transform = `scale(${lerp(1.3, 1, ek) + prog(t, L0, 3) * .03})`; eMW.style.filter = ek < 1 ? `blur(${(1 - ek) * 20}px)` : 'none';
      const es = prog(t, L0 + .35, .5, E.outQuint); eSM.style.opacity = es; eSM.style.transform = `translateY(${(1 - es) * 30}px)`;
      const ea = prog(t, L0 + .7, .5, E.back); av2.style.opacity = clamp(ea * 2); av2.style.transform = `translateY(${(1 - ea) * 40}px) scale(${lerp(.8, 1, ea)})`; LG.sheen(av2, t * .3);
      eLab.style.opacity = prog(t, L0 + 1.0, .5);
    };
  };
  function kf2(t, a, b, v0, v1) { const k = clamp((t - a) / (b - a)); return lerp(v0, v1, k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2); }
})();
