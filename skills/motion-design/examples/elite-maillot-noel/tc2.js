// Élite Maillot — Noël. Trois Coups camera language, rebuilt shot for shot:
// one desk of widgets (tiles) and a phone lying among them, filmed by a camera that never stops moving:
// tilted overview while everything assembles -> whip pan (motion blur) onto the clock, hands spinning in time-lapse ->
// whip pan onto the family chat (typing dots, then messages) -> pull back and down to the phone, the camera rights
// itself and the screen lights up -> search typed on the keyboard, the result expands into the REAL site ->
// real scroll, tap, product page, add to cart, cart -> 3D tilted zoom deep into the real 4-item cart ->
// whip back to a bento with counters -> blur, bouncing dots, the real logo.
// World units are px at zoom 1. Camera = [cx, cy, zoom, rotZ, tiltX]; motion blur comes from the camera speed.
(() => {
  const { SCENES, h, esc, clamp, lerp, E, prog, wordsEl, wordsAt, rel } = window.MOTION;
  const IMG = f => rel('assets/' + f);
  const smooth = k => k * k * (3 - 2 * k), sexy = k => (k < .5 ? 16 * k ** 5 : 1 - Math.pow(-2 * k + 2, 5) / 2);   // quintic in-out = whip pans
  const kf = (t, K) => {
    if (t <= K[0][0]) return K[0][1];
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) {
      const [t0, a, ez] = K[i - 1], [t1, b] = K[i], k = (ez || smooth)((t - t0) / (t1 - t0));
      return Array.isArray(a) ? a.map((x, j) => lerp(x, b[j], k)) : lerp(a, b, k);
    }
    return K[K.length - 1][1];
  };
  const win = (t, a, b, fi = .4, fo = .4) => Math.min(prog(t, a, fi, E.out), 1 - prog(t, b - fo, fo, E.inOut));
  const SW = 390, SB = 47, VH = 664, SAF = 76, SH = SB + VH + SAF;            // phone screen (capture css px)
  const PX = -69, PY = 0, PWW = SW + 28, PHH = SH + 28;                        // phone rect in the world
  const SX = PX + 14, SY = PY + 14;                                            // screen origin in the world

  const CSS = `
  .t2 { --ink:#12b5c0; --tq:#5ce1e6; position:absolute; inset:0; font-family: Inter, system-ui, sans-serif; color:#1d1f26; overflow:hidden; }
  .t2 .persp { position:absolute; inset:0; perspective: 2400px; perspective-origin: 540px 960px; }
  .t2 .cam { position:absolute; left:0; top:0; width:0; height:0; transform-origin: 0 0; transform-style: preserve-3d; }
  .t2 .tile { position:absolute; border-radius: 56px; background: linear-gradient(160deg,#ffffff,#edeff2); box-shadow: 0 2px 0 rgba(255,255,255,.95) inset, 0 34px 60px rgba(40,44,60,.17), 0 6px 14px rgba(40,44,60,.10); overflow:hidden; }
  .t2 .tile.k { background: linear-gradient(160deg,#1d1e23,#0b0b0e); box-shadow: 0 1px 0 rgba(255,255,255,.08) inset, 0 34px 60px rgba(20,22,30,.3); color:#fff; }
  .t2 .clock { position:absolute; inset: 7%; }
  .t2 .cal { position:absolute; inset:0; padding: 30px 34px; }
  .t2 .cal .d { font-size: 28px; font-weight: 800; letter-spacing:.06em; color: var(--tq); }
  .t2 .cal .n { font-size: 170px; font-weight: 600; line-height: .95; letter-spacing:-.05em; margin-top: 4px; }
  .t2 .cal .m { font-size: 26px; color: rgba(255,255,255,.55); }
  .t2 .cd { position:absolute; inset:0; padding: 30px 34px; background: linear-gradient(160deg,#25c1cc,#0c8d97); color:#fff; }
  .t2 .cd small { font-size: 24px; font-weight:800; letter-spacing:.06em; opacity:.9; }
  .t2 .cd b { display:block; font-size: 130px; font-weight: 700; letter-spacing:-.05em; line-height:1; margin-top: 16px; }
  .t2 .cd i { font-style:normal; font-size: 24px; opacity:.9; }
  .t2 .chat { position:absolute; inset:0; padding: 28px 34px; }
  .t2 .chat .hd { display:flex; align-items:center; gap: 14px; font-size: 30px; font-weight: 600; }
  .t2 .chat .av { display:flex; } .t2 .chat .av span { width: 46px; height: 46px; border-radius: 50%; margin-right: -12px; border: 3px solid #141418; display:grid; place-items:center; font-size: 20px; font-weight: 700; }
  .t2 .chat .hd small { margin-left:auto; font-size: 20px; color: rgba(255,255,255,.45); font-weight: 500; }
  .t2 .chat .row { display:flex; margin-top: 14px; } .t2 .chat .row.r { justify-content:flex-end; }
  .t2 .chat .b { display:inline-block; padding: 13px 22px; border-radius: 26px; background: rgba(255,255,255,.13); font-size: 28px; font-weight: 500; position:relative; }
  .t2 .chat .row.r .b { background: #0a84ff; }
  .t2 .chat .typing { display:inline-flex; gap: 6px; padding: 18px 22px; border-radius: 26px; background: rgba(255,255,255,.13); }
  .t2 .chat .typing i { width: 10px; height: 10px; border-radius:50%; background: rgba(255,255,255,.7); display:block; }

  /* phone (lives in the world) */
  .t2 .iph { position:absolute; left:${PX}px; top:${PY}px; width:${PWW}px; height:${PHH}px; border-radius: 64px; background:#0b0b0d; padding: 14px; box-sizing:border-box;
     box-shadow: 0 0 0 2px #b9bcc3, 0 0 0 4px #e6e8ec, 0 0 0 5px #a9adb5, 0 46px 80px rgba(30,34,50,.34), 0 12px 24px rgba(30,34,50,.2); }
  .t2 .scr { position:relative; width:${SW}px; height:${SH}px; border-radius: 52px; overflow:hidden; background:#fff; }
  .t2 .off { position:absolute; inset:0; background:#050506; z-index: 40; }
  .t2 .isl { position:absolute; top: 11px; left:50%; width: 120px; height: 34px; margin-left:-60px; border-radius: 20px; background:#000; z-index: 41; }
  .t2 .stat { position:absolute; top:0; left:0; right:0; height:${SB}px; background:#fff; display:flex; justify-content:space-between; align-items:center; padding: 4px 34px 0; font-size: 16px; font-weight: 600; z-index: 25; }
  .t2 .stat .bat { width: 26px; height: 12px; border: 1.5px solid #000; border-radius: 4px; position:relative; } .t2 .stat .bat i { position:absolute; inset: 1.5px; right: 5px; background:#000; border-radius: 2px; }
  .t2 .vp { position:absolute; top:${SB}px; left:0; width:${SW}px; height:${VH}px; overflow:hidden; background:#fff; }
  .t2 .layer { position:absolute; inset:0; }
  .t2 .layer > img { position:absolute; left:0; top:0; width:${SW}px; display:block; }
  .t2 .saf { position:absolute; left:0; right:0; bottom:0; height:${SAF}px; background: rgba(248,248,250,.97); border-top: 1px solid #e3e3e6; z-index: 25; }
  .t2 .saf .url { position:absolute; left: 16px; right: 16px; top: 9px; height: 38px; border-radius: 12px; background:#e9e9ec; display:flex; align-items:center; justify-content:center; font-size: 15px; color:#222; overflow:hidden; }
  .t2 .saf .pg { position:absolute; left:0; bottom:0; height: 3px; background:#0a84ff; }
  .t2 .saf .home { position:absolute; bottom: 7px; left:50%; width: 130px; height: 5px; margin-left:-65px; border-radius: 3px; background:#111; }
  .t2 .tap { position:absolute; width: 46px; height: 46px; margin:-23px; border-radius:50%; background: rgba(90,90,100,.3); border: 1.5px solid rgba(255,255,255,.85); z-index: 28; }
  .t2 .ring { position:absolute; border: 2.5px solid var(--tq); border-radius: 10px; box-shadow: 0 0 0 4px rgba(92,225,230,.28); z-index: 27; }
  .t2 .srch { position:absolute; inset:0; background:#f2f2f7; }
  .t2 .srch h2 { margin: 16px 20px 12px; font-size: 32px; font-weight: 800; letter-spacing:-.02em; }
  .t2 .srch .fld { margin: 0 16px; height: 40px; border-radius: 11px; background:#e3e3e8; display:flex; align-items:center; padding: 0 12px; gap: 8px; font-size: 17px; color:#111; }
  .t2 .srch .fld .ph { color:#8e8e93; } .t2 .srch .caret { width: 2px; height: 20px; background:#0a84ff; }
  .t2 .srch .hint { margin: 18px 22px 6px; font-size: 13px; color:#8e8e93; font-weight: 600; letter-spacing:.04em; }
  .t2 .srch .sug { margin: 6px 16px 0; background:#fff; border-radius: 14px; overflow:hidden; }
  .t2 .srch .sug > div { display:flex; align-items:center; gap: 12px; padding: 11px 14px; border-bottom: 1px solid #eee; font-size: 16px; }
  .t2 .srch .sug .ico { width: 30px; height: 30px; border-radius: 50%; display:grid; place-items:center; font-size: 15px; color:#fff; }
  .t2 .srch .hit { display:none !important; }
  .t2 .srch .hitc { position:absolute; left: 16px; right: 16px; top: 128px; height: 74px; background:#fff; border-radius: 14px; display:flex; align-items:center; gap: 12px; padding: 0 12px; z-index: 3; overflow:hidden; }
  .t2 .srch .hitc .th { width: 54px; height: 54px; border-radius: 10px; background:#fff center/contain no-repeat; border: 1px solid #eee; flex:none; }
  .t2 .srch .hitc b { font-size: 16px; display:block; } .t2 .srch .hitc small { color:#8e8e93; font-size: 13px; }
  .t2 .xp { position:absolute; background:#fff; z-index: 6; overflow:hidden; }
  .t2 .xp img { position:absolute; inset:0; width:100%; height:100%; object-fit: cover; }
  .t2 .kb { position:absolute; left:0; right:0; bottom: 0; height: 290px; background:#d1d3d9; padding: 8px 3px 0; }
  .t2 .kb .r { display:flex; justify-content:center; gap: 6px; margin-bottom: 11px; }
  .t2 .kb .k { width: 33px; height: 44px; border-radius: 6px; background:#fff; box-shadow: 0 1px 0 #8a8a8e; display:grid; place-items:center; font-size: 22px; position:relative; }
  .t2 .kb .k.wide { width: 86px; font-size: 16px; background:#abb0ba; } .t2 .kb .k.sp { width: 180px; font-size: 16px; } .t2 .kb .k.go { width: 86px; background:#0a84ff; color:#fff; font-size: 16px; }
  .t2 .kb .k.on::after { content: attr(data-c); position:absolute; bottom: 36px; left: -8px; width: 49px; height: 56px; border-radius: 10px; background:#fff; box-shadow: 0 2px 6px rgba(0,0,0,.25); display:grid; place-items:center; font-size: 30px; }

  /* iOS widgets */
  .t2 .ical { position:absolute; inset:0; padding: 28px 32px; }
  .t2 .ical .d { font-size: 28px; font-weight: 800; letter-spacing:.04em; color:#ff3b30; }
  .t2 .ical .n { font-size: 150px; font-weight: 400; line-height: 1; letter-spacing:-.05em; color:#111; }
  .t2 .ical .ev { display:flex; align-items:center; gap: 10px; font-size: 22px; font-weight: 600; color:#333; margin-top: 10px; } .t2 .ical .ev i { width: 6px; height: 34px; border-radius: 3px; background:#34c759; display:block; }
  .t2 .wx { position:absolute; inset:0; padding: 28px 32px; color:#fff; background: linear-gradient(180deg,#2f6db5,#5b9be0); }
  .t2 .wx .c { font-size: 26px; font-weight: 700; } .t2 .wx .c span { font-size: 16px; }
  .t2 .wx .tmp { font-size: 110px; font-weight: 300; line-height: 1; letter-spacing:-.04em; }
  .t2 .wx .ic { font-size: 30px; margin-top: 4px; } .t2 .wx .dsc { font-size: 24px; font-weight: 600; } .t2 .wx .hb { font-size: 22px; opacity: .9; }
  .t2 .imsg { position:absolute; left: 50px; top: 0; width: 980px; height: 168px; z-index: 12; box-sizing:border-box; border-radius: 44px; padding: 24px 28px; display:flex; gap: 20px; align-items:flex-start;
     background: rgba(246,246,248,.86); backdrop-filter: blur(20px); box-shadow: 0 24px 60px rgba(30,34,50,.22), 0 1px 0 rgba(255,255,255,.9) inset; transform-origin: 50% 0; }
  .t2 .imsg .mi { width: 70px; height: 70px; border-radius: 17px; background: linear-gradient(180deg,#67f27b,#1ac447); display:grid; place-items:center; flex:none; } .t2 .imsg .mi svg { width: 46px; }
  .t2 .imsg .bd { flex:1; min-width:0; } .t2 .imsg .top { display:flex; justify-content:space-between; align-items:baseline; }
  .t2 .imsg b { font-size: 29px; color:#111; } .t2 .imsg small { font-size: 22px; color:#8a8a8e; }
  .t2 .imsg p { margin: 4px 0 0; font-size: 28px; color:#1c1c1e; white-space: nowrap; overflow:hidden; text-overflow: ellipsis; }
  .t2 .imsg { padding: 28px 32px; border-radius: 50px; } .t2 .imsg .mi { width: 80px; height: 80px; border-radius: 19px; } .t2 .imsg .mi svg { width: 52px; }
  .t2 .imsg b { font-size: 32px; } .t2 .imsg small { font-size: 25px; } .t2 .imsg p { font-size: 31px; }
  .t2 .pill { position:absolute; left:0; top:0; z-index: 13; padding: 20px 34px; border-radius: 40px; background:#0a84ff; color:#fff; font-size: 34px; font-weight: 600; white-space:nowrap; box-shadow: 0 20px 40px rgba(10,60,140,.3); transform-origin: 50% 50%; }
  .t2 .ical .roll { position:relative; height: 150px; overflow:hidden; } .t2 .ical .roll div { position:absolute; left:0; top:0; }
  .t2 .ical .dd { position:relative; height: 34px; overflow:hidden; } .t2 .ical .dd div { position:absolute; left:0; top:0; }
  /* Apple Pay */
  .t2 .dim { position:absolute; inset:0; background: rgba(0,0,0,.58); z-index: 34; }
  .t2 .ap { position:absolute; left: 10px; right: 10px; bottom: 10px; height: 405px; border-radius: 38px; background:#fff; z-index: 35; padding: 20px 22px; box-sizing:border-box; box-shadow: 0 -6px 30px rgba(0,0,0,.25); }
  .t2 .ap .hd { display:flex; align-items:center; gap: 12px; margin-bottom: 14px; } .t2 .ap .hd b { font-size: 21px; flex:1; letter-spacing:-.01em; }
  .t2 .ap .mer { width: 38px; height: 38px; border-radius: 10px; background:#111; display:grid; place-items:center; color:#5ce1e6; font: 400 28px 'Instrument Serif', serif; }
  .t2 .ap .x { width: 30px; height: 30px; border-radius: 50%; background:#ececef; display:grid; place-items:center; font-size: 14px; color:#666; }
  .t2 .ap .row { display:flex; align-items:center; gap: 14px; padding: 10px 0 14px; border-bottom: 1px solid #ececec; } .t2 .ap .row b { display:block; font-size: 17px; } .t2 .ap .row small { font-size: 14px; color:#8a8a8e; }
  .t2 .ap .row > div { flex:1; } .t2 .ap .chev { color:#c7c7cc; font-size: 24px; }
  .t2 .ap .card { width: 62px; height: 40px; border-radius: 6px; background: linear-gradient(135deg,#2c2f45,#11131f 70%); position:relative; box-shadow: 0 1px 2px rgba(0,0,0,.3); } .t2 .ap .card .chip { position:absolute; left: 8px; top: 12px; width: 13px; height: 10px; border-radius: 2px; background: linear-gradient(135deg,#e9cf7b,#b8913a); }
  .t2 .ap .lbl { margin-top: 14px; font-size: 13px; font-weight: 600; color:#8a8a8e; letter-spacing:.04em; }
  .t2 .ap .val { font-size: 16px; color:#1c1c1e; margin-top: 4px; } .t2 .ap .val em { font-style: normal; color:#12a3ad; font-weight: 700; } .t2 .ap .val.sub { color:#3a3a3c; font-size: 15px; padding-bottom: 14px; border-bottom: 1px solid #ececec; }
  .t2 .ap .st { position:relative; height: 120px; margin-top: 6px; } .t2 .ap .st > div { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap: 8px; font-size: 14px; color:#3a3a3c; }
  .t2 .ap .side { width: 22px; height: 40px; border: 2px solid #0a84ff; border-radius: 6px; display:block; } .t2 .ap .s2 svg { width: 54px; }
  .t2 .ap .spin { width: 46px; height: 46px; border-radius: 50%; border: 3.5px solid #e5e5ea; border-top-color: #0a84ff; display:block; }
  .t2 .ap .ok { width: 52px; height: 52px; border-radius: 50%; border: 3.5px solid #0a84ff; color:#0a84ff; display:grid; place-items:center; font-size: 28px; font-weight: 700; }
  .t2 .dbl { position:absolute; right: 0; top: 205px; z-index: 36; display:flex; align-items:center; gap: 10px; color:#fff; font-size: 15px; font-weight: 600; text-align:right; line-height: 1.2; text-shadow: 0 1px 6px rgba(0,0,0,.4); }
  .t2 .dbl i { width: 6px; height: 70px; border-radius: 3px; background:#fff; display:block; }
  .t2 .bt .okp { width: 64px; height: 64px; border-radius: 50%; background: var(--tq); color:#08343a; display:grid; place-items:center; font-size: 36px; font-weight: 800; margin: 10px 0; }
  /* bento tiles (world) */
  .t2 .bt .in { position:absolute; inset:0; padding: 26px 28px; display:flex; flex-direction:column; justify-content:center; }
  .t2 .bt .big { font-size: 80px; font-weight: 700; letter-spacing:-.045em; line-height:1; font-variant-numeric: tabular-nums; }
  .t2 .bt small { font-size: 21px; color:#7d828d; font-weight: 600; } .t2 .bt.k small { color: rgba(255,255,255,.55); }
  .t2 .bt b { font-size: 29px; letter-spacing:-.02em; line-height:1.15; }
  .t2 .bt .stars { color:#00b67a; font-size: 28px; letter-spacing: 3px; margin: 6px 0; }
  .t2 .bt .jt { position:absolute; inset: 7%; background-size: contain; background-repeat:no-repeat; background-position:center; filter: drop-shadow(0 14px 14px rgba(0,0,0,.18)); }
  .t2 .bt s { color: rgba(255,255,255,.45); font-size: 26px; } .t2 .bt .tq { color: var(--tq); }
  .t2 .bt ul { list-style:none; margin: 8px 0 0; padding:0; font-size: 22px; line-height: 1.7; font-weight: 600; } .t2 .bt li::before { content:'✓'; color: var(--ink); margin-right: 10px; font-weight: 800; }
  .t2 .bt li.free { color: var(--ink); }

  .t2 .hl { position:absolute; z-index: 10; left: 3%; right: 3%; top: 175px; text-align:center; font-size: 72px; font-weight: 700; letter-spacing: -.035em; line-height:1.06; color:#1f2129; transform: translateY(-50%); white-space: nowrap; }
  .t2 .hl .w { display:inline-block; margin: 0 .12em; } .t2 .hl .acc { color: var(--ink); }
  .t2 .fog { position:absolute; left:0; right:0; top:0; height: 360px; background: linear-gradient(180deg, rgba(243,244,247,.96) 0%, rgba(243,244,247,.85) 50%, rgba(243,244,247,0) 100%); z-index: 9; }
  .t2 .dots { position:absolute; left:50%; top: 50%; display:flex; gap: 20px; transform: translate(-50%,-50%); z-index: 20; }
  .t2 .dots i { width: 28px; height: 28px; border-radius: 50%; background: var(--ink); display:block; }
  .t2 .end { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index: 21; }
  .t2 .end img { width: 660px; }
  .t2 .end .tg { margin-top: 28px; font-size: 32px; color:#5d626c; font-weight: 500; height: 40px; }
  `;

  SCENES.tc2 = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 't2', root), persp = h('div', 'persp', R), cam = h('div', 'cam', persp), B = s.beats;
    const fog = h('div', 'fog', R);

    // ---------- the desk of widgets (world rects: x0, y0, x1, y1)
    const T = [];
    const tile = (x0, y0, x1, y1, k, html = '', o = {}) => {
      const el = h('div', 'tile' + (k ? ' k' : '') + (o.cls ? ' ' + o.cls : ''), cam, html);
      Object.assign(el.style, { left: x0 + 'px', top: y0 + 'px', width: x1 - x0 + 'px', height: y1 - y0 + 'px' });
      const r = { el, d: o.d ?? (.15 + T.length * .035), from: o.from || [((T.length * 37) % 7 - 3) * 160, ((T.length * 53) % 5 - 2) * 200], bento: o.bento, wallNear: o.near, ...o };
      T.push(r); return r;
    };
    const clockSvg = `<svg class="clock" viewBox="0 0 200 200"><circle cx="100" cy="100" r="97" fill="#fff"/>${Array.from({ length: 60 }, (_, i) => i % 5 ? `<line x1="100" y1="7" x2="100" y2="11" stroke="#bbb" stroke-width="1" transform="rotate(${i * 6} 100 100)"/>` : '').join('')}${Array.from({ length: 12 }, (_, i) => `<text x="${100 + 74 * Math.sin(i * Math.PI / 6)}" y="${108 - 74 * Math.cos(i * Math.PI / 6)}" font-size="22" font-family="Inter" font-weight="500" text-anchor="middle" fill="#222">${i || 12}</text>`).join('')}<line class="hh" x1="100" y1="100" x2="100" y2="52" stroke="#111" stroke-width="7" stroke-linecap="round"/><line class="mm" x1="100" y1="100" x2="100" y2="28" stroke="#111" stroke-width="5" stroke-linecap="round"/><line class="ss" x1="100" y1="114" x2="100" y2="24" stroke="#ff9500" stroke-width="2.5"/><circle cx="100" cy="100" r="6" fill="#ff9500"/></svg>`;
    const tClock = tile(-520, -1000, -100, -580, 0, clockSvg, { d: .3 });
    tile(-60, -1000, 660, -700, 0, '', { d: .38 });
    tile(-60, -660, 280, -320, 0, `<div class="ical"><div class="dd d"><div class="d0">MERCREDI</div><div class="d1">JEUDI</div></div><div class="roll n"><div class="n0">2</div><div class="n1">3</div></div><div class="ev"><i></i><span class="evt">Noël dans 22 jours</span></div></div>`, { d: .45 });
    tile(320, -660, 660, -320, 0, `<div class="wx"><div class="c">Paris <span>➤</span></div><div class="tmp">2°</div><div class="ic">❄️</div><div class="dsc">Neige</div><div class="hb">H:4° B:-1°</div></div>`, { d: .52 });
    tile(-520, -540, -100, -320, 0, '', { d: .6 });
    // around the phone (hidden for the bento)
    tile(-520, -280, -100, 300, 1, '', { near: 1 }); tile(-520, 340, -100, 815, 0, '', { near: 1 });
    tile(380, -280, 800, 200, 0, '', { near: 1 }); tile(380, 240, 800, 815, 1, '', { near: 1 });
    // outer ring
    [[-980, -1460, -560, -1040, 1], [-520, -1460, -100, -1040, 0], [-60, -1460, 360, -1040, 1], [400, -1460, 820, -1040, 0], [860, -1460, 1280, -1040, 1],
     [700, -1000, 1120, -580, 0], [700, -540, 1120, -320, 1], [-980, -1000, -560, -580, 1], [-980, -540, -560, -40, 0], [-980, 0, -560, 500, 1], [-980, 540, -560, 1000, 0],
     [840, -280, 1260, 260, 1], [840, 300, 1260, 815, 0], [-520, 855, -100, 1275, 1], [-60, 855, 360, 1275, 0], [400, 855, 820, 1275, 1], [860, 855, 1280, 1275, 0], [-980, 1040, -560, 1440, 1]]
      .forEach(([a, b, c, d, k]) => tile(a, b, c, d, k, '', { near: (Math.abs((a + c) / 2 - 140) < 900 && (b + d) / 2 > -400) ? 2 : 0 }));
    const CALr = { n0: cam.querySelector('.n0'), n1: cam.querySelector('.n1'), d0: cam.querySelector('.d0'), d1: cam.querySelector('.d1'), ev: cam.querySelector('.evt') };
    const hands = { h: tClock.el.querySelector('.hh'), m: tClock.el.querySelector('.mm'), s: tClock.el.querySelector('.ss') };
    // iMessage notifications (iOS banners) stacking over the desk
    const msgIcon = '<span class="mi"><svg viewBox="0 0 24 24"><path fill="#fff" d="M12 3.2C6.6 3.2 2.3 6.8 2.3 11.2c0 2.5 1.4 4.7 3.6 6.2-.2 1.3-.8 2.6-1.8 3.5 1.9 0 3.6-.7 4.8-1.7 1 .3 2 .4 3.1.4 5.4 0 9.7-3.6 9.7-8.2S17.4 3.2 12 3.2z"/></svg></span>';
    const M = s.notifs.map(m => ({ el: h('div', 'imsg', R, `${msgIcon}<div class="bd"><div class="top"><b>${esc(m.from)}</b><small>maintenant</small></div><p>${esc(m.text)}</p></div>`), ...m }));

    // ---------- bento tiles (world, around the phone; they fly in at the end)
    const BTl = [
      tile(-380, 0, -100, 270, 0, `<div class="in"><small>Trustpilot</small><div class="big rate">4,1</div><div class="stars">★★★★★</div><small>avis clients</small></div>`, { cls: 'bt', bento: 0 }),
      tile(-380, 300, -100, 545, 1, `<div class="in"><b style="font-size:34px">Apple Pay</b><div class="okp">✓</div><small>Paiement accepté</small></div>`, { cls: 'bt', bento: 1 }),
      tile(-380, 575, -100, 815, 0, `<div class="jt" style="background-image:url(${IMG('img/barca.png')})"></div>`, { cls: 'bt', bento: 2 }),
      tile(380, 0, 660, 270, 1, `<div class="in"><small>Total · 4 maillots</small><div class="big tq tot">59,97€</div><s>79,96€</s></div>`, { cls: 'bt', bento: 3 }),
      tile(380, 300, 660, 545, 0, `<div class="jt" style="background-image:url(${IMG('img/france.png')})"></div>`, { cls: 'bt', bento: 4 }),
      tile(380, 575, 660, 815, 0, `<div class="in"><b>Votre panier</b><ul><li>Barça</li><li>France</li><li>Real</li><li class="free">City · offert</li></ul></div>`, { cls: 'bt', bento: 5 }),
    ];
    const rateEl = BTl[0].el.querySelector('.rate'), totEl = BTl[3].el.querySelector('.tot'), lis = [...BTl[5].el.querySelectorAll('li')];

    // ---------- the phone (in the world)
    const iph = h('div', 'iph', cam), scr = h('div', 'scr', iph);
    h('div', 'isl', scr); h('div', 'stat', scr, '<span>20:41</span><span class="bat"><i></i></span>');
    const vp = h('div', 'vp', scr), L = {};
    const lay = (k, src) => { const d = h('div', 'layer', vp), im = h('img', '', d); im.src = IMG('site/' + src); L[k] = { d, im }; };
    lay('home', 'home-scroll.jpg'); lay('pp', 'product-top.jpg'); lay('pps', 'product-size.jpg'); lay('c1', 'cart-1.jpg'); lay('c4', 'cart-4.jpg');
    const query = s.query || 'elite maillot';
    const srch = h('div', 'srch', vp, `<h2>Rechercher</h2><div class="fld">🔍 <span class="tx"></span><span class="caret"></span><span class="ph">Rechercher ou saisir un site</span></div>
      <div class="hint">SUGGESTIONS</div><div class="sug"><div><span class="ico" style="background:#ff9f0a">★</span>Maillots de foot pas chers</div><div><span class="ico" style="background:#34c759">⌁</span>Livraison rapide</div><div><span class="ico" style="background:#5e5ce6">✓</span>Les mieux notés</div></div>
      <div class="hitc"><span class="th" style="background-image:url(${IMG('site/hero.jpg')});background-size:cover"></span><span><b>ÉLITE MAILLOT</b><small>elite-maillot.fr · Maillots dès 19,99€</small></span></div>`);
    const rows = ['azertyuiop', 'qsdfghjklm', 'wxcvbn'];
    const kb = h('div', 'kb', srch, rows.map((r, i) => `<div class="r">${i === 2 ? '<span class="k wide">⇧</span>' : ''}${[...r].map(c => `<span class="k" data-c="${c}">${c.toUpperCase()}</span>`).join('')}${i === 2 ? '<span class="k wide">⌫</span>' : ''}</div>`).join('') + `<div class="r"><span class="k wide">123</span><span class="k wide">🙂</span><span class="k sp" data-c=" ">espace</span><span class="k go">aller</span></div>`);
    const keys = {}; kb.querySelectorAll('.k[data-c]').forEach(k => { keys[k.dataset.c] = k; });
    const tx = srch.querySelector('.tx'), ph = srch.querySelector('.ph'), sugBox = srch.querySelector('.sug'), hint = srch.querySelector('.hint'), hitc = srch.querySelector('.hitc');
    const xp = h('div', 'xp', vp, `<img src="${IMG('site/hero.jpg')}">`);
    const saf = h('div', 'saf', scr, `<div class="url"><span class="u">🔍 Rechercher</span><i class="pg"></i></div><div class="home"></div>`);
    const url = saf.querySelector('.u'), pg = saf.querySelector('.pg');
    const dim = h('div', 'dim', scr);
    const ap = h('div', 'ap', scr, `<div class="hd"><span class="mer">É</span><b>Élite Maillot</b><span class="x">✕</span></div>
      <div class="row"><span class="card"><i class="chip"></i></span><div><b>Carte bancaire</b><small>•••• 4021</small></div><span class="chev">›</span></div>
      <div class="lbl">COMMANDE</div><div class="val">4 maillots · 3 achetés = <em>1 offert</em></div><div class="val sub">Total 59,97 € · Livraison offerte</div>
      <div class="st"><div class="s1"><span class="side"></span>Confirmer avec le bouton latéral</div><div class="s2"><svg viewBox="0 0 40 40"><g fill="none" stroke="#0a84ff" stroke-width="2.4" stroke-linecap="round"><path d="M4 12V7a3 3 0 0 1 3-3h5M28 4h5a3 3 0 0 1 3 3v5M36 28v5a3 3 0 0 1-3 3h-5M12 36H7a3 3 0 0 1-3-3v-5"/><path d="M14 14v3M26 14v3M20 15v7h-2M15 27q5 4 10 0"/></g></svg>Face ID</div><div class="s3"><span class="spin"></span></div><div class="s4"><span class="ok">✓</span>Terminé</div></div>`);
    const dbl = h('div', 'dbl', scr, '<span>Double-cliquer<br>pour payer</span><i></i>');
    const apS = [...ap.querySelectorAll('.st > div')], spin = ap.querySelector('.spin'), okc = ap.querySelector('.ok');
    const tap = h('div', 'tap', scr), ring = h('div', 'ring', scr), off = h('div', 'off', scr);

    // ---------- overlays
    const HL = s.headlines.map(x => { const w = wordsEl(R, x.text, ''); w.box.className = 'hl'; if (x.y) w.box.style.top = x.y + 'px'; return { w, ...x }; });
    const dots = h('div', 'dots', R, '<i></i><i></i><i></i>');
    const end = h('div', 'end', R, `<img src="${IMG('img/logo.png')}"><div class="tg"></div>`);
    const pill = h('div', 'pill', R, esc(s.pill || 'Un maillot pour Noël ?'));
    const svgNS = 'http://www.w3.org/2000/svg';
    R.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute"><filter id="mbf" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur id="mbg" stdDeviation="0 0" edgeMode="duplicate"/></filter></svg>`);
    const mbg = R.querySelector('#mbg');
    const endImg = end.querySelector('img'), endTg = end.querySelector('.tg'), tagline = s.tagline || '';

    // ---------- camera path [cx, cy, zoom, rotZ, tiltX]; third slot of a key = easing of the move that starts there
    const phoneTop = 430, FZ = 1.82, FCY = PY + (960 - phoneTop) / FZ;      // frontal: phone top at y=430
    const ZP = (x, y) => [SX + x, SY + SB + y];                             // capture point -> world
    const city = ZP(300, 300);
    const CAM = [
      [0, [150, 420, .3, -19, 22], E.outQuint],
      [1.15, [140, 60, .6, -13, 15]],
      [1.3, [120, -40, .66, -12, 14], sexy],
      [B.clock - .05, [-285, -770, 1.52, -6, 6]],
      [B.chat - .65, [-150, -735, 1.44, -3.5, 4.5], sexy],
      [B.chat, [300, -560, 1.4, -6, 6]],
      [B.phone - .35, [285, -520, 1.32, -8, 8], sexy],
      [B.phone + .4, [140, 230, .64, -11, 15]],
      [B.phone + 1.0, [140, FCY, FZ, 0, 0]],
      [B.open - .2, [140, FCY - 6, FZ * 1.03, .4, 0], sexy],
      [B.open + .35, [140, FCY + 8, FZ * .985, -.5, 0]],
      [B.choose, [140, FCY, FZ * 1.02, .3, 0]],
      [B.choose + 1.4, [150, FCY + 10, FZ * 1.05, .7, 0], sexy],
      [B.choose + 1.8, [138, FCY - 4, FZ * .99, -.4, 0]],
      [B.add, [140, FCY, FZ * 1.02, 0, 0]],
      [B.add + 1.2, [130, FCY + 8, FZ * 1.05, -.6, 0], sexy],
      [B.add + 1.6, [140, FCY, FZ, .3, 0]],
      [B.zoom - .15, [140, FCY + 10, FZ * 1.03, 0, 0], sexy],
      [B.zoom + .55, [city[0], city[1], 3.4, -7, 10]],
      [B.pay - .55, [city[0] - 8, city[1] + 6, 3.6, -8.5, 11], sexy],
      [B.pay - .05, [140, FCY + 6, FZ * 1.02, 0, 0]],
      [B.pay + .35, [140, FCY + 4, FZ * 1.03, .3, 0], sexy],
      [B.pay + .95, [SX + 230, SY + 470, 2.4, 3, 5]],
      [B.bento - .55, [SX + 200, SY + 560, 3.1, 4.5, 6], sexy],
      [B.bento + .45, [140, 0, .8, 0, 0]],
      [B.end, [140, 10, .78, 0, 0]],
      [s.duration, [140, 30, .74, 0, 0]],
    ];
    const camAt = t => {
      const c = kf(t, CAM);
      // a living camera: tiny handheld drift on top of the path (never fully still)
      return [c[0] + Math.sin(t * .9) * 4 / c[2], c[1] + Math.cos(t * .7) * 4 / c[2], c[2] * (1 + Math.sin(t * .5) * .004), c[3] + Math.sin(t * .6) * .25, c[4]];
    };
    const camCss = c => `translate(540px, 960px) rotateX(${c[4]}deg) rotateZ(${c[3]}deg) scale(${c[2]}) translate(${-c[0]}px, ${-c[1]}px)`;

    return t => {
      const c = camAt(t), p = camAt(t - 1 / 30);
      cam.style.transform = camCss(c);
      // motion blur from the on-screen speed of the camera
      // where does the world point under the screen centre go between two frames? -> blur along that direction
      const scrOf = (wx, wy, q) => { const dx = (wx - q[0]) * q[2], dy = (wy - q[1]) * q[2], r = q[3] * Math.PI / 180; return [540 + dx * Math.cos(r) - dy * Math.sin(r), 960 + (dx * Math.sin(r) + dy * Math.cos(r)) * Math.cos(q[4] * Math.PI / 180)]; };
      const sp = scrOf(c[0], c[1], p), dX = 540 - sp[0], dY = 960 - sp[1];
      const zr = Math.abs(Math.log(c[2] / p[2])) * 520 + Math.abs(c[3] - p[3]) * 14;
      const endBlur = kf(t, [[B.end - .3, 0], [B.end + .5, 22]]);
      const bx = Math.min(30, Math.max(0, Math.abs(dX) - 2) * .55 + zr * .5) + endBlur, by = Math.min(30, Math.max(0, Math.abs(dY) - 2) * .55 + zr * .5) + endBlur;
      if (bx + by > .5) { mbg.setAttribute('stdDeviation', `${bx.toFixed(2)} ${by.toFixed(2)}`); persp.style.filter = 'url(#mbf)'; } else persp.style.filter = 'none';
      const toScreen = (wx, wy) => scrOf(wx, wy, c);
      persp.style.opacity = 1 - prog(t, B.end + .9, .6) * .55;

      // tiles assemble (slide in from their offsets), the wall near the phone gives way to the bento
      T.forEach(o => {
        if (o.bento != null) {
          const k = prog(t, B.bento - .05 + o.bento * .07, .75, E.outQuint), side = o.bento < 3 ? -1 : 1;
          o.el.style.opacity = clamp(k * 1.6); o.el.style.transform = `translate(${(1 - k) * side * 380}px, ${(1 - k) * 140}px) scale(${lerp(.7, 1, k)}) rotate(${(1 - k) * side * 8}deg)`;
          return;
        }
        const d0 = .42 + (o.d - .15) * .9, k = prog(t, d0, .5, E.back), out = o.near ? prog(t, B.bento - .25, .4) : 0;
        o.el.style.opacity = clamp(prog(t, d0, .12)) * (1 - out * (o.near === 1 ? 1 : 0));
        o.el.style.transform = `scale(${Math.max(0, k) * (1 - out * .1)})`;
      });
      // phone lies on the desk, then lifts toward the camera when it stands up
      const lift = win(t, B.phone, B.zoom + .1, .9, .6);
      const pk = prog(t, .22, .55, E.back);
      iph.style.transform = `translateZ(${lift * 70}px) scale(${Math.max(.01, pk)})`; iph.style.opacity = clamp(prog(t, .22, .1));
      off.style.opacity = 1 - prog(t, B.phone + .35, .35);

      // clock: time-lapse from 18:05 to 20:41 while the camera arrives on it
      const mins = kf(t, [[B.clock - .2, 18 * 60 + 5], [B.clock + 1.3, 20 * 60 + 41, E.outQuint], [s.duration, 20 * 60 + 41 + s.duration / 60]]);
      hands.m.setAttribute('transform', `rotate(${(mins % 60) * 6} 100 100)`); hands.h.setAttribute('transform', `rotate(${(mins / 60 % 12) * 30} 100 100)`);
      hands.s.setAttribute('transform', `rotate(${(t * 360 / 60 * 6 + mins * 30) % 360} 100 100)`);
      // calendar: the day rolls over (MERCREDI 2 -> JEUDI 3) under the time-lapse
      const rk = prog(t, B.clock + .95, .45, E.back);
      CALr.n0.style.transform = `translateY(${-rk * 150}px)`; CALr.n1.style.transform = `translateY(${(1 - rk) * 150}px)`;
      CALr.d0.style.transform = `translateY(${-rk * 34}px)`; CALr.d1.style.transform = `translateY(${(1 - rk) * 34}px)`;
      CALr.ev.textContent = rk > .5 ? 'Noël dans 21 jours' : 'Noël dans 22 jours';
      // iMessage banners: slide down from the top edge with a spring, the older ones are pushed down (iOS stack),
      // then all leave upward when the camera goes to the phone; motion blur follows their speed
      const leave = prog(t, B.phone - .45, .45, E.inOut);
      M.forEach((m, i) => {
        if (t < m.at - .02) { m.el.style.display = 'none'; return; } m.el.style.display = '';
        const ky = q => prog(q, m.at, .55, E.back), newer = q => M.filter(o => o.at > m.at && q >= o.at).map(o => prog(q, o.at, .45, E.outQuint)).reduce((a2, v2) => a2 + v2, 0);
        const yAt = q => lerp(-260, 300, ky(q)) + newer(q) * 192 - prog(q, B.phone - .45, .45, E.inOut) * 1300;
        const y = yAt(t), vy = Math.abs(y - yAt(t - 1 / 30));
        m.el.style.opacity = clamp(prog(t, m.at, .15)) * (1 - prog(t, B.phone - .2, .25));
        m.el.style.transform = `translateY(${y}px) scale(${1 - newer(t) * .035})`;
        m.el.style.filter = vy > 3 ? `blur(${Math.min(12, vy * .18).toFixed(1)}px)` : 'none';
        m.el.style.zIndex = 12 + i;
      });
      // a blue message pill leaves the stack and flies into the phone's search field while the camera dives
      const pf = prog(t, B.phone - .3, 1.35, E.inOut);
      if (t > B.phone - .35 && pf < 1) {
        const tgt = toScreen(SX + 195, SY + SB + 74), x = lerp(540, tgt[0], pf), y = lerp(560, tgt[1], pf) - Math.sin(pf * Math.PI) * 120;
        const xs = lerp(540, toScreen(SX + 195, SY + SB + 74 - 1)[0], 0);
        pill.style.display = ''; pill.style.opacity = clamp(prog(t, B.phone - .35, .15)) * (1 - prog(t, B.phone + .85, .2));
        pill.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${lerp(1, .42, pf)}) rotate(${lerp(0, -8, Math.sin(pf * Math.PI))}deg)`;
        pill.style.filter = pf > .05 && pf < .95 ? `blur(${(Math.sin(pf * Math.PI) * 4).toFixed(1)}px)` : 'none';
      } else pill.style.display = 'none';

      // ----- in the phone
      const typeAt = B.phone + .8, cps = 9, typed = Math.floor(clamp((t - typeAt) * cps, 0, query.length));
      tx.textContent = query.slice(0, typed); ph.style.display = typed ? 'none' : '';
      const hasRes = typed >= 5; hitc.style.opacity = prog(t, typeAt + 5 / cps, .25); hitc.style.transform = `translateY(${(1 - prog(t, typeAt + 5 / cps, .35, E.outQuint)) * 20}px)`;
      sugBox.style.opacity = 1 - prog(t, typeAt + 5 / cps, .2); hint.textContent = hasRes ? 'MEILLEUR RÉSULTAT' : 'SUGGESTIONS';
      sugBox.style.transform = `translateY(${hasRes ? 90 : 0}px)`;
      Object.values(keys).forEach(k => k.classList.remove('on'));
      const ci = Math.floor((t - typeAt) * cps); if (ci >= 0 && ci < query.length && (t - typeAt) * cps - ci < .65) { const kk = keys[query[ci]]; kk && kk.classList.add('on'); }
      const tapHit = B.open - .45;
      hitc.style.background = t > tapHit - .08 && t < tapHit + .25 ? '#e5e5ea' : '#fff';
      // shared element: the result card expands into the site, the site rises into place
      const x1 = prog(t, tapHit + .08, .45, E.inOut), x2 = prog(t, B.open + .05, .55, E.inOut);
      if (t > tapHit + .08 && t < B.open + .62) {
        const R0 = [28, 138, 54, 54, 10], R1 = [0, 0, SW, VH, 0], R2 = [16, 218, 358, 478, 14];
        const rr = R0.map((v0, j) => lerp(lerp(v0, R1[j], x1), R2[j], x2));
        xp.style.display = ''; Object.assign(xp.style, { left: rr[0] + 'px', top: rr[1] + 'px', width: rr[2] + 'px', height: rr[3] + 'px', borderRadius: rr[4] + 'px', opacity: 1 });
      } else xp.style.display = 'none';
      srch.style.display = t < B.open + .2 ? '' : 'none';
      L.home.d.style.opacity = prog(t, B.open + .05, .3);
      const hr = prog(t, B.open + .1, .7, E.outQuint);
      url.textContent = t < tapHit + .1 ? '🔍 Rechercher' : '🔒 elite-maillot.fr';
      pg.style.width = prog(t, tapHit + .1, .9, E.out) * 100 + '%'; pg.style.opacity = t > tapHit + .1 && t < tapHit + 1.1 ? 1 : 0;
      const scrollY = kf(t, [[B.choose, 0], [B.choose + 1.3, 1650, sexy]]);
      L.home.im.style.transform = `translateY(${-scrollY}px)`;
      const tapCard = B.choose + 1.5, tapAtc = B.add + 1.0;
      const ppIn = prog(t, tapCard + .1, .45, E.outQuint); L.pp.d.style.transform = `translateX(${(1 - ppIn) * 100}%)`; L.pp.d.style.opacity = t > tapCard ? 1 : 0;
      L.pp.im.style.transform = `translateY(${-kf(t, [[B.add, 0], [tapAtc - .4, 650]])}px)`;
      L.pps.d.style.display = t > tapAtc - .45 ? '' : 'none'; L.pps.d.style.opacity = prog(t, tapAtc - .45, .12);
      const c1 = prog(t, tapAtc + .2, .45, E.outQuint); L.c1.d.style.transform = `translateX(${(1 - c1) * 100}%)`; L.c1.d.style.opacity = t > tapAtc + .15 ? 1 : 0;
      const c4 = prog(t, B.four, .35); L.c4.d.style.opacity = c4; L.c4.im.style.transform = `translateY(${(1 - c4) * 30}px)`;
      const tp = at => clamp((t - at + .2) / .2) * (1 - clamp((t - at - .15) / .25));
      const t1 = tp(tapHit), t2 = tp(tapCard), t3 = tp(tapAtc), t4 = tp(B.pay), m = Math.max(t1, t2, t3, t4);
      const pt = t1 === m ? [200, SB + 165] : t2 === m ? [287, SB + 557] : t3 === m ? [195, SB + 494] : [195, SB + 615];
      tap.style.opacity = m; tap.style.left = pt[0] + 'px'; tap.style.top = pt[1] + 'px'; tap.style.transform = `scale(${lerp(1.5, .85, m)})`;
      // Apple Pay: checkout tap, sheet slides up, double-click hint, Face ID, spinner, Terminé
      const tPay = tp(B.pay);
      const sk = prog(t, B.pay + .15, .5, E.outQuint), sOut = prog(t, B.bento - .3, .3);
      ap.style.transform = `translateY(${(1 - sk) * 115 + sOut * 60}%)`; ap.style.opacity = t > B.pay + .1 ? 1 - sOut : 0;
      dim.style.opacity = sk * (1 - sOut) * (t > B.pay ? 1 : 0);
      const P1 = B.pay + 1.7, P2 = B.pay + 2.15, P3 = B.pay + 2.55;
      const st = t < P1 ? 0 : t < P2 ? 1 : t < P3 ? 2 : 3;
      apS.forEach((el, i) => { el.style.opacity = i === st ? (i ? prog(t, [0, P1, P2, P3][i], .12) : .45) : 0; });
      apS[1].firstChild.style.transform = `scale(${1 + Math.sin(prog(t, P1, .45) * Math.PI) * .12})`;
      spin.style.transform = `rotate(${t * 720}deg)`; okc.style.transform = `scale(${lerp(.4, 1, prog(t, P3, .35, E.back))})`;
      const dk2 = win(t, B.pay + .7, B.pay + 1.75, .25, .2); dbl.style.opacity = dk2;
      dbl.lastChild.style.transform = `scaleY(${1 + Math.max(0, Math.sin((t - B.pay) * 9)) * .25})`; dbl.style.transform = `translateX(${(1 - prog(t, B.pay + .7, .35, E.outQuint)) * 40}px)`;
      const ro = win(t, B.zoom + .6, B.pay - .6, .3, .2);
      ring.style.opacity = ro; Object.assign(ring.style, { left: '228px', top: SB + 254 + 'px', width: '150px', height: '78px', transform: `scale(${lerp(1.2, 1, ro)})` });

      // bento counters
      rateEl.textContent = (lerp(3.2, 4.1, prog(t, B.bento + .2, 1.1, E.outQuint))).toFixed(1).replace('.', ',');
      totEl.textContent = lerp(79.96, 59.97, prog(t, B.bento + .35, 1.2, E.outQuint)).toFixed(2).replace('.', ',') + '€';
      lis.forEach((li, i) => { const k = prog(t, B.bento + .5 + i * .22, .3, E.back); li.style.opacity = k; li.style.transform = `translateX(${(1 - k) * 20}px)`; });

      // headlines (words out of a blur)
      HL.forEach(x => { const k = win(t, x.at - .05, x.out, .05, .35); x.w.box.style.opacity = k; x.w.box.style.filter = k < 1 && t > x.at + .3 ? `blur(${(1 - k) * 12}px)` : 'none'; x.w.box.style.display = t < x.at - .1 || t > x.out + .05 ? 'none' : ''; wordsAt(x.w, t, x.at, x.stagger || .11, .55); });
      fog.style.opacity = (t < B.clock - .6 ? prog(t, B.clock - 1.1, .4) : 1) * (1 - prog(t, B.bento - .2, .4));

      // end: bouncing dots, the logo, the tagline typed
      const dk = win(t, B.end + .35, B.end + 1.35, .2, .25); dots.style.opacity = dk;
      [...dots.children].forEach((d, i) => { const ph2 = ((t - B.end) * 2.6 - i * .18) % 1; d.style.transform = `translateY(${-Math.max(0, Math.sin(ph2 * Math.PI)) * 26}px) scale(${1 + Math.max(0, Math.sin(ph2 * Math.PI)) * .15})`; });
      const ek = prog(t, B.end + 1.3, .7, E.outQuint); end.style.opacity = ek; endImg.style.transform = `scale(${lerp(.82, 1, ek)})`; endImg.style.filter = ek < 1 ? `blur(${(1 - ek) * 14}px)` : 'none';
      endTg.textContent = tagline.slice(0, Math.floor(clamp((t - B.end - 1.9) * 28, 0, tagline.length)));
    };
  };
})();
