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
  .t2 .tw { position:absolute; transform-style: preserve-3d; }
  .t2 .tw > .tsh { position:absolute; inset: 4% 3% -2% 3%; border-radius: 60px; background: rgba(22,26,40,.34); filter: blur(30px); transform: translateZ(-30px) translateY(26px); }
  .t2 .tw > .tx { position:absolute; inset:0; border-radius: 56px; }
  .t2 .tw > .tile { inset: 0; }
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
  .t2 .iph { position:absolute; left:${PX}px; top:${PY}px; width:${PWW}px; height:${PHH}px; border-radius: 68px; padding: 4px; box-sizing:border-box;
     background: linear-gradient(150deg, #f4f5f7 0%, #a8acb3 18%, #e7e8eb 34%, #8a8e95 52%, #d9dbdf 70%, #9a9ea5 86%, #eceef1 100%);
     box-shadow: inset 0 0 0 1px rgba(255,255,255,.7), inset 0 0 2px 1px rgba(0,0,0,.25), 0 60px 90px rgba(30,34,50,.30), 0 18px 30px rgba(30,34,50,.18), 0 2px 4px rgba(30,34,50,.2); }
  .t2 .bez { width:100%; height:100%; border-radius: 64px; background:#050506; padding: 10px; box-sizing:border-box; box-shadow: inset 0 0 0 1.5px #1c1c1f; }
  .t2 .btn { position:absolute; width: 5px; border-radius: 3px; background: linear-gradient(90deg,#7c8087,#e3e5e8 45%,#8d9198); }
  .t2 .scr { position:relative; width:${SW}px; height:${SH}px; border-radius: 54px; overflow:hidden; background:#fff; }
  .t2 .glare { position:absolute; inset:0; z-index: 45; pointer-events:none; border-radius: 54px; background: linear-gradient(118deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.05) 22%, rgba(255,255,255,0) 38%); mix-blend-mode: screen; }
  .t2 .off { position:absolute; inset:0; background:#050506; z-index: 40; }
  .t2 .isl { position:absolute; top: 11px; left:50%; width: 120px; height: 34px; margin-left:-60px; border-radius: 20px; background:#000; z-index: 41; }
  .t2 .stat { position:absolute; top:0; left:0; right:0; width:auto; transform:none; border-radius:0; box-sizing:border-box; height:${SB}px; background:#fff; display:flex; justify-content:space-between; align-items:center; padding: 6px 30px 0 40px; font-size: 16.5px; font-weight: 650; letter-spacing: -.01em; z-index: 25; }
  .t2 .stat .ic { display:flex; align-items:center; gap: 5px; } .t2 .stat svg { display:block; }
  .t2 .stat .bat { width: 26px; height: 12px; border: 1.5px solid #000; border-radius: 4px; position:relative; } .t2 .stat .bat i { position:absolute; inset: 1.5px; right: 5px; background:#000; border-radius: 2px; }
  .t2 .vp { position:absolute; top:${SB}px; left:0; width:${SW}px; height:${VH}px; overflow:hidden; background:#fff; }
  .t2 .layer { position:absolute; inset:0; }
  .t2 .layer > img { position:absolute; left:0; top:0; width:${SW}px; display:block; }
  .t2 .saf { position:absolute; left:0; right:0; bottom:0; height:${SAF}px; background: linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.9) 30%); z-index: 25; }
  .t2 .saf .url { position:absolute; left: 14px; right: 14px; top: 8px; height: 44px; border-radius: 22px; background: rgba(255,255,255,.96); box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 0 0 .5px rgba(0,0,0,.08); display:flex; align-items:center; justify-content:center; font-size: 15.5px; color:#111; overflow:hidden; gap: 6px; }
  .t2 .saf .aa { position:absolute; left: 16px; font-size: 13px; font-weight: 600; color:#111; } .t2 .saf .aa b { font-size: 17px; }
  .t2 .saf .rl { position:absolute; right: 16px; width: 16px; height: 16px; }
  .t2 .saf .pg { position:absolute; left:0; bottom:0; height: 3px; background:#0a84ff; }
  .t2 .saf .home { position:absolute; bottom: 7px; left:50%; width: 130px; height: 5px; margin-left:-65px; border-radius: 3px; background:#111; }
  .t2 .tap { position:absolute; width: 46px; height: 46px; margin:-23px; border-radius:50%; background: rgba(90,90,100,.3); border: 1.5px solid rgba(255,255,255,.85); z-index: 28; }
  .t2 .ring { position:absolute; border: 2.5px solid var(--tq); border-radius: 10px; box-shadow: 0 0 0 4px rgba(92,225,230,.28); z-index: 27; }
  /* Safari iOS 18: start page, bottom address bar, suggestions, keyboard */
  .t2 .srch { position:absolute; left:0; right:0; top:${SB}px; height:${VH + SAF}px; background:#f2f2f7; z-index: 26; overflow:hidden; }
  .t2 .srch .fav { position:absolute; left: 20px; right: 20px; top: 22px; }
  .t2 .srch .fav h3 { margin: 0 0 14px; font-size: 22px; font-weight: 750; letter-spacing:-.02em; }
  .t2 .srch .fav .g { display:grid; grid-template-columns: repeat(4, 1fr); gap: 18px 12px; }
  .t2 .srch .fav .g div { text-align:center; font-size: 11.5px; color:#3a3a3c; } .t2 .srch .fav .g i { display:grid; place-items:center; width: 62px; height: 62px; margin: 0 auto 6px; border-radius: 14px; background:#fff; box-shadow: 0 1px 3px rgba(0,0,0,.08); font-style:normal; font-size: 26px; font-weight: 700; color:#fff; }
  .t2 .srch .card2 { position:absolute; left: 20px; right: 20px; top: 300px; height: 96px; border-radius: 16px; background:#fff; padding: 14px 16px; box-sizing:border-box; font-size: 13px; color:#6c6c70; }
  .t2 .srch .card2 b { display:block; font-size: 16px; color:#111; margin-bottom: 4px; }
  .t2 .srch .sheet { position:absolute; left:0; right:0; top:0; bottom:0; background: rgba(250,250,252,.97); }
  .t2 .srch .sec { font-size: 13px; font-weight: 650; color:#6c6c70; margin: 0 22px; letter-spacing: .01em; }
  .t2 .srch .best { margin: 8px 14px 18px; background:#fff; border-radius: 14px; height: 70px; display:flex; align-items:center; gap: 12px; padding: 0 12px; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .t2 .srch .best .ic { width: 52px; height: 52px; border-radius: 12px; background:#fff center/86% no-repeat; border: 1px solid #e5e5ea; flex:none; }
  .t2 .srch .best b { display:block; font-size: 16.5px; letter-spacing:-.01em; } .t2 .srch .best small { font-size: 13px; color:#8a8a8e; }
  .t2 .srch .rows { margin: 6px 14px 0; background:#fff; border-radius: 14px; overflow:hidden; }
  .t2 .srch .rows div { height: 44px; display:flex; align-items:center; gap: 12px; padding: 0 14px; font-size: 16px; border-bottom: .5px solid #e5e5ea; color:#111; }
  .t2 .srch .rows svg { width: 16px; height: 16px; flex:none; }
  .t2 .srch .bar { position:absolute; left: 14px; right: 14px; height: 46px; border-radius: 23px; background:#fff; box-shadow: 0 2px 12px rgba(0,0,0,.12), 0 0 0 .5px rgba(0,0,0,.06); display:flex; align-items:center; gap: 8px; padding: 0 14px; font-size: 16.5px; box-sizing:border-box; z-index: 3; }
  .t2 .srch .bar .ph { color:#8a8a8e; } .t2 .srch .bar .caret { width: 2px; height: 21px; background:#0a84ff; border-radius: 1px; }
  .t2 .srch .bar svg { width: 17px; height: 17px; flex:none; } .t2 .srch .bar .clr { margin-left:auto; width: 20px; height: 20px; border-radius: 50%; background:#c7c7cc; color:#fff; display:grid; place-items:center; font-size: 11px; }
  .t2 .srch .bar .mic { margin-left:auto; }
  .t2 .xp { position:absolute; background:#fff; z-index: 6; overflow:hidden; }
  .t2 .xp img { position:absolute; inset:0; width:100%; height:100%; object-fit: cover; }
  .t2 .kb { position:absolute; left:0; right:0; bottom: 0; height: 300px; background:#d1d4da; padding: 9px 3px 0; box-sizing:border-box; z-index: 2; }
  .t2 .kb .r { display:flex; justify-content:center; gap: 6px; margin-bottom: 12px; }
  .t2 .kb .k { width: 33px; height: 43px; border-radius: 5.5px; background:#fff; box-shadow: 0 1px 0 #898a8d; display:grid; place-items:center; font-size: 23px; font-weight: 400; color:#000; position:relative; }
  .t2 .kb .k.sp2 { width: 44px; background:#abb1ba; font-size: 18px; } .t2 .kb .k.n { width: 88px; background:#abb1ba; font-size: 16px; } .t2 .kb .k.sp { width: 186px; font-size: 16px; } .t2 .kb .k.go { width: 88px; background:#abb1ba; font-size: 16px; color:#000; }
  .t2 .kb .k.go.on2 { background:#0a84ff; color:#fff; }
  .t2 .kb .k.on::after { content: attr(data-c); position:absolute; bottom: 30px; left: -9px; width: 51px; height: 60px; border-radius: 10px 10px 8px 8px; background:#fff; box-shadow: 0 2px 6px rgba(0,0,0,.28); display:grid; place-items:center; font-size: 34px; padding-bottom: 14px; box-sizing:border-box; }
  .t2 .kb .under { position:absolute; left: 0; right: 0; bottom: 0; height: 52px; display:flex; justify-content:space-between; align-items:center; padding: 0 26px 10px; }
  .t2 .kb .under img { width: 26px; } .t2 .kb .under svg { width: 18px; height: 26px; }
  .t2 .kb .hb { position:absolute; bottom: 7px; left:50%; width: 130px; height: 5px; margin-left:-65px; border-radius: 3px; background:#111; }
  .t2 .ical { position:absolute; inset:0; padding: 26px 28px; background: linear-gradient(160deg,#1f1f22,#0d0d0f); }
  .t2 .ical .d { font-size: 27px; font-weight: 700; letter-spacing:.02em; color:#ff3b30; }
  .t2 .ical .n { font-size: 112px; font-weight: 300; line-height: 1.02; letter-spacing:-.05em; color:#fff; }
  .t2 .ical .ev { display:flex; align-items:stretch; gap: 10px; font-size: 19px; font-weight: 650; color:#fff; margin-top: 8px; line-height: 1.2; } .t2 .ical .ev i { width: 5px; border-radius: 3px; background:#34c759; display:block; } .t2 .ical .ev small { display:block; font-size: 19px; color:#8a8a8e; font-weight: 500; }
  .t2 .ical .ev img { width: 22px; vertical-align: -3px; }
  .t2 .wx { position:absolute; inset:0; padding: 26px 28px; color:#fff; background: linear-gradient(180deg,#0c1631 0%,#223b6b 100%); }
  .t2 .wx .c { font-size: 25px; font-weight: 650; display:flex; align-items:center; gap: 6px; } .t2 .wx .c svg { width: 15px; }
  .t2 .wx .tmp { font-size: 88px; font-weight: 250; line-height: 1; letter-spacing:-.05em; margin-top: 2px; }
  .t2 .wx .ic svg { width: 30px; margin-top: 8px; } .t2 .wx .dsc { font-size: 23px; font-weight: 650; margin-top: 4px; } .t2 .wx .hb { font-size: 22px; font-weight: 600; opacity: .95; }
  /* iOS 18 communication notification: contact monogram + Messages badge */
  .t2 .rem { position:absolute; inset:0; padding: 24px 30px; color:#fff; }
  .t2 .rem .rh { display:flex; align-items:center; gap: 12px; margin-bottom: 10px; } .t2 .rem .rh b { font-size: 25px; color:#ff9f0a; flex:1; } .t2 .rem .rc { font-size: 44px; font-weight: 600; line-height: 1; }
  .t2 .rem .ri { width: 38px; height: 38px; border-radius: 50%; background:#ff9f0a; display:grid; place-content:center; gap: 3px; } .t2 .rem .ri i { display:block; width: 16px; height: 2.5px; background:#fff; border-radius: 2px; }
  .t2 .rem .rr { display:flex; align-items:center; gap: 14px; font-size: 22px; padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,.1); }
  .t2 .rem .cb { width: 24px; height: 24px; border-radius: 50%; border: 2.5px solid #636366; box-sizing:border-box; flex:none; display:grid; place-items:center; font-size: 15px; color:#fff; font-weight: 800; }
  .t2 .rem .cb.on { background:#ff9f0a; border-color:#ff9f0a; }
  .t2 .imsg { position:absolute; left: 44px; top: 0; width: 992px; min-height: 160px; z-index: 12; box-sizing:border-box; border-radius: 54px; padding: 26px 30px; display:flex; gap: 24px; align-items:center;
     background: rgba(248,248,250,.82); backdrop-filter: blur(30px) saturate(1.6); box-shadow: 0 22px 50px rgba(30,34,50,.18), 0 0 0 1px rgba(255,255,255,.6) inset; }
  .t2 .imsg .av { position:relative; width: 92px; height: 92px; flex:none; }
  .t2 .imsg .av .mono { width: 92px; height: 92px; border-radius: 50%; background: linear-gradient(180deg,#a8aeb9,#858b98); color:#fff; display:grid; place-items:center; font-size: 38px; font-weight: 600; letter-spacing: .02em; }
  .t2 .imsg .av .badge { position:absolute; right: -6px; bottom: -6px; width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(180deg,#6af27e,#18c045); display:grid; place-items:center; box-shadow: 0 0 0 3px rgba(248,248,250,.95); }
  .t2 .imsg .av .badge svg { width: 26px; }
  .t2 .imsg .bd { flex:1; min-width:0; } .t2 .imsg .top { display:flex; justify-content:space-between; align-items:baseline; }
  .t2 .imsg b { font-size: 33px; color:#000; font-weight: 650; letter-spacing: -.01em; } .t2 .imsg small { font-size: 26px; color:#7d7d82; }
  .t2 .imsg p { margin: 4px 0 0; font-size: 32px; color:#111; white-space: nowrap; overflow:hidden; text-overflow: ellipsis; letter-spacing: -.01em; }
  .t2 img.emo { height: 1.08em; width: auto; vertical-align: -.2em; margin: 0 .04em; }
  .t2 .pill { position:absolute; left:0; top:0; z-index: 13; padding: 20px 34px; border-radius: 40px; background:#0a84ff; color:#fff; font-size: 34px; font-weight: 600; white-space:nowrap; box-shadow: 0 20px 40px rgba(10,60,140,.3); transform-origin: 50% 50%; }
  .t2 .ical .roll { position:relative; height: 120px; overflow:hidden; } .t2 .ical .roll div { position:absolute; left:0; top:0; }
  .t2 .ical .dd { position:relative; height: 34px; overflow:hidden; } .t2 .ical .dd div { position:absolute; left:0; top:0; }
  /* Apple Pay */
  .t2 .dim { position:absolute; inset:0; background: rgba(0,0,0,.58); z-index: 34; }
  .t2 .ap { position:absolute; left: 10px; right: 10px; bottom: 10px; height: 405px; border-radius: 38px; background:#fff; z-index: 35; padding: 20px 22px; box-sizing:border-box; box-shadow: 0 -6px 30px rgba(0,0,0,.25); }
  .t2 .ap .hd { display:flex; align-items:center; justify-content:space-between; gap: 12px; margin-bottom: 10px; } .t2 .ap .aplogo { height: 46px; display:block; } .t2 .ap .hd b { font-size: 21px; flex:1; letter-spacing:-.01em; }
  .t2 .ap .mer { width: 38px; height: 38px; border-radius: 10px; background:#fff; border: 1px solid #e3e3e6; display:grid; place-items:center; overflow:hidden; }
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
  .t2 .bt .jt { inset: 6% 8% 16% 8%; }
  .t2 .jtag { position:absolute; left: 50%; bottom: 16px; transform: translateX(-50%); padding: 6px 18px; border-radius: 20px; background:#f0f1f4; color:#1d1f26; font-size: 21px; font-weight: 700; white-space:nowrap; }
  .t2 .bt.free .jtag { background: var(--ink); color:#fff; }
  .t2 .bt .okp { width: 64px; height: 64px; border-radius: 50%; background: var(--tq); color:#08343a; display:grid; place-items:center; font-size: 36px; font-weight: 800; margin: 10px 0; }
  /* redrawn Élite Maillot store (clean iOS style) */
  .t2 .app { position:absolute; inset:0; z-index: 24; background:#fff; overflow:hidden; font-family: Inter, system-ui, sans-serif; color:#111; }
  .t2 .app .scrn { position:absolute; inset:0; background:#fff; }
  .t2 .app .hd2 { height: 54px; display:flex; align-items:center; justify-content:space-between; padding: 0 18px; border-bottom: .5px solid #ececef; background:#fff; position:relative; z-index: 2; }
  .t2 .app .hd2 img { height: 34px; } .t2 .app .hd2 .ic2 { width: 26px; height: 26px; position:relative; } .t2 .app .hd2 svg { width: 26px; height: 26px; }
  .t2 .app .bdg { position:absolute; right: -7px; top: -6px; min-width: 18px; height: 18px; border-radius: 9px; background:#12b5c0; color:#fff; font-size: 11px; font-weight: 800; display:grid; place-items:center; }
  .t2 .app .feed { position:absolute; left:0; right:0; top: 54px; }
  .t2 .app .promo { margin: 14px 16px 0; border-radius: 18px; padding: 16px 18px; color:#fff; background: linear-gradient(120deg,#12b5c0,#5ce1e6); box-shadow: 0 8px 18px rgba(18,181,192,.25); }
  .t2 .app .promo b { display:block; font-size: 19px; letter-spacing:-.01em; } .t2 .app .promo span { font-size: 13px; opacity: .92; }
  .t2 .app .ttl { margin: 18px 18px 10px; font-size: 19px; font-weight: 750; letter-spacing:-.02em; }
  .t2 .app .grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 14px 12px; padding: 0 16px; }
  .t2 .app .pc .im { height: 168px; border-radius: 16px; background: radial-gradient(80% 80% at 50% 40%, #ffffff, #eef0f3); background-size: contain; position:relative; overflow:hidden; }
  .t2 .app .pc .im i { position:absolute; inset: 8%; background-size: contain; background-repeat:no-repeat; background-position:center; filter: drop-shadow(0 8px 10px rgba(0,0,0,.15)); }
  .t2 .app .pc b { display:block; font-size: 13.5px; font-weight: 600; margin-top: 8px; line-height: 1.25; } .t2 .app .pc span { display:block; font-size: 14.5px; font-weight: 750; margin-top: 3px; }
  .t2 .app .pd .big { height: 300px; background: radial-gradient(70% 70% at 50% 42%, #ffffff, #e9ecf0); position:relative; }
  .t2 .app .pd .big i { position:absolute; inset: 7% 12%; background-size: contain; background-repeat:no-repeat; background-position:center; filter: drop-shadow(0 18px 18px rgba(0,0,0,.18)); }
  .t2 .app .pd .inf { padding: 16px 18px; } .t2 .app .pd h3 { margin: 0; font-size: 21px; font-weight: 750; letter-spacing:-.02em; line-height: 1.2; }
  .t2 .app .pd .pr2 { font-size: 21px; font-weight: 800; margin-top: 6px; } .t2 .app .pd .of { display:inline-block; margin-top: 8px; padding: 5px 10px; border-radius: 10px; background:#e8fafb; color:#0e9aa4; font-size: 13px; font-weight: 700; }
  .t2 .app .pd .lb { margin-top: 16px; font-size: 13px; color:#6c6c70; font-weight: 600; }
  .t2 .app .chips { display:flex; gap: 8px; margin-top: 8px; } .t2 .app .chips span { flex:1; height: 40px; border-radius: 12px; border: 1.5px solid #e2e2e6; display:grid; place-items:center; font-size: 15px; font-weight: 650; }
  .t2 .app .chips span.on { background:#111; color:#fff; border-color:#111; }
  .t2 .app .cta { position:absolute; left: 16px; right: 16px; bottom: 16px; height: 52px; border-radius: 26px; background:#111; color:#fff; display:grid; place-items:center; font-size: 16px; font-weight: 700; }
  .t2 .app .cartsh { position:absolute; inset: 0; background:#f6f7f9; border-radius: 26px 26px 0 0; box-shadow: 0 -10px 30px rgba(0,0,0,.18); }
  .t2 .app .cartsh .hdl { width: 42px; height: 5px; border-radius: 3px; background:#d1d1d6; margin: 8px auto 6px; }
  .t2 .app .cartsh h4 { margin: 4px 18px 10px; font-size: 21px; font-weight: 800; letter-spacing:-.02em; }
  .t2 .app .ofc { margin: 0 14px 10px; background:#fff; border-radius: 16px; padding: 12px 14px; }
  .t2 .app .ofc .r1 { display:flex; justify-content:space-between; font-size: 14px; font-weight: 700; } .t2 .app .ofc .r1 em { font-style:normal; color:#0e9aa4; }
  .t2 .app .segs { display:flex; gap: 6px; margin-top: 10px; } .t2 .app .segs i { flex:1; height: 7px; border-radius: 4px; background:#e5e5ea; } .t2 .app .segs i.on { background: linear-gradient(90deg,#12b5c0,#5ce1e6); }
  .t2 .app .rows2 { margin: 0 14px; background:#fff; border-radius: 16px; overflow:hidden; }
  .t2 .app .rw { display:flex; align-items:center; gap: 12px; padding: 9px 12px; border-bottom: .5px solid #ececef; height: 64px; box-sizing:border-box; }
  .t2 .app .rw .th2 { width: 48px; height: 48px; border-radius: 12px; background:#f0f1f4 center/80% no-repeat; flex:none; }
  .t2 .app .rw b { display:block; font-size: 13.5px; font-weight: 650; } .t2 .app .rw small { font-size: 12px; color:#8a8a8e; }
  .t2 .app .rw .p3 { margin-left:auto; text-align:right; font-size: 14px; font-weight: 750; white-space:nowrap; } .t2 .app .rw .p3 s { display:block; color:#a1a1a6; font-weight: 500; font-size: 12px; }
  .t2 .app .rw .free2 { background:#12b5c0; color:#fff; border-radius: 8px; padding: 3px 8px; font-size: 12px; font-weight: 800; }
  .t2 .app .tot2 { margin: 12px 18px; display:flex; justify-content:space-between; align-items:baseline; } .t2 .app .tot2 span { font-size: 16px; font-weight: 700; } .t2 .app .tot2 s { color:#a1a1a6; font-size: 14px; margin-right: 8px; } .t2 .app .tot2 b { font-size: 24px; font-weight: 800; }
  .t2 .app .applebtn { position:absolute; left: 16px; right: 16px; bottom: 16px; height: 52px; border-radius: 26px; background:#000; color:#fff; display:grid; place-items:center; font-size: 16px; font-weight: 700; }
  .t2 .tap2 { position:absolute; width: 46px; height: 46px; margin:-23px; border-radius:50%; background: rgba(90,90,100,.3); border: 1.5px solid rgba(255,255,255,.85); z-index: 30; }
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
  .t2 .veil { position:absolute; inset:0; z-index: 19; background: radial-gradient(70% 45% at 50% 47%, rgba(250,251,252,.97) 0%, rgba(246,247,249,.9) 45%, rgba(240,241,244,.55) 100%); }
  .t2 .end { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index: 21; }
  .t2 .end svg.emlogo { width: 860px; overflow: visible; filter: drop-shadow(0 18px 30px rgba(18,120,130,.18)); }
  .t2 .end .tg { margin-top: 44px; font-size: 38px; color:#2b2e35; font-weight: 600; letter-spacing: -.015em; } .t2 .end .tg span { color: var(--ink); }
  .t2 .end .urlp { margin-top: 26px; padding: 16px 32px; border-radius: 40px; background:#14161c; color:#fff; font-size: 28px; font-weight: 600; letter-spacing:.01em; }
  .t2 .ap .mer img { width: 30px; }
  `;

  const EMO = { '🙏': '1f64f', '😄': '1f604', '🎁': '1f381', '🚚': '1f69a', '❄️': '2744-fe0f', '🎄': '1f384', '👌': '1f44c', '⚽': '26bd', '😍': '1f60d', '❤️': '2764-fe0f', '🔥': '1f525', '🏠': '1f3e0', '🔒': '1f512', '😀': '1f600' };
  let emojiMode = 'apple';
  const emo = txt => emojiMode === 'noto' ? esc(txt) : esc(txt).replace(/(❄️|❤️|[\u{1F300}-\u{1FAFF}]|[\u2600-\u27BF])/gu, m => EMO[m] ? `<img class="emo" src="${IMG('emoji/' + EMO[m] + '.png')}">` : m);
  SCENES.tc2 = (s, root) => {
    emojiMode = s.emoji || 'apple';
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 't2', root), persp = h('div', 'persp', R), cam = h('div', 'cam', persp), B = s.beats;
    const fog = h('div', 'fog', R);

    // ---------- the desk of widgets (world rects: x0, y0, x1, y1)
    const T = [];
    const tile = (x0, y0, x1, y1, k, html = '', o = {}) => {
      const el = h('div', 'tw', cam);
      Object.assign(el.style, { left: x0 + 'px', top: y0 + 'px', width: x1 - x0 + 'px', height: y1 - y0 + 'px' });
      h('div', 'tsh', el);
      const edge = k ? ['#050506', '#09090b', '#0e0e11'] : ['#b9bdc4', '#cdd0d5', '#dfe1e5'];
      [26, 18, 10, 4].forEach((z, i) => { const e = h('div', 'tx', el); e.style.transform = `translateZ(${-z}px)`; e.style.background = edge[Math.min(2, i)]; });
      h('div', 'tile' + (k ? ' k' : '') + (o.cls ? ' ' + o.cls : ''), el, html);
      const r = { el, d: o.d ?? (.15 + T.length * .035), from: o.from || [((T.length * 37) % 7 - 3) * 160, ((T.length * 53) % 5 - 2) * 200], bento: o.bento, wallNear: o.near, ...o };
      T.push(r); return r;
    };
    const clockSvg = `<svg class="clock" viewBox="0 0 200 200"><circle cx="100" cy="100" r="97" fill="#fff"/>${Array.from({ length: 60 }, (_, i) => i % 5 ? `<line x1="100" y1="7" x2="100" y2="11" stroke="#bbb" stroke-width="1" transform="rotate(${i * 6} 100 100)"/>` : '').join('')}${Array.from({ length: 12 }, (_, i) => `<text x="${100 + 74 * Math.sin(i * Math.PI / 6)}" y="${108 - 74 * Math.cos(i * Math.PI / 6)}" font-size="22" font-family="Inter" font-weight="500" text-anchor="middle" fill="#222">${i || 12}</text>`).join('')}<line class="hh" x1="100" y1="100" x2="100" y2="52" stroke="#111" stroke-width="7" stroke-linecap="round"/><line class="mm" x1="100" y1="100" x2="100" y2="28" stroke="#111" stroke-width="5" stroke-linecap="round"/><line class="ss" x1="100" y1="114" x2="100" y2="24" stroke="#ff9500" stroke-width="2.5"/><circle cx="100" cy="100" r="6" fill="#ff9500"/></svg>`;
    // a compact desk like the reference: the widgets sit right above the phone, a few blocks around it, empty studio beyond
    const tClock = tile(-300, -760, 120, -340, 0, clockSvg, { d: .3 });
    const tRem = tile(160, -760, 760, -520, 1, `<div class="rem"><div class="rh"><span class="ri"><i></i><i></i><i></i></span><b>Cadeaux de Noël</b><span class="rc">3</span></div>${['Maillot du Barça · Frérot', 'Maillot de la France · Papa', 'Maillot du Real · Le petit'].map(x => `<div class="rr"><span class="cb"></span>${esc(x)}</div>`).join('')}</div>`, { d: .38 });
    tile(160, -490, 445, -205, 1, `<div class="ical"><div class="dd d"><div class="d0">MERCREDI</div><div class="d1">JEUDI</div></div><div class="roll n"><div class="n0">2</div><div class="n1">3</div></div><div class="ev"><i></i><span>${emo('🎄')} Noël en famille<small class="evt">dans 22 jours</small></span></div></div>`, { d: .45 });
    tile(475, -490, 760, -205, 1, `<div class="wx"><div class="c">Paris <svg viewBox="0 0 16 16"><path fill="#fff" d="M14.6 1.4 1.8 7.1c-.6.3-.5 1.2.2 1.3l5.3.9.9 5.3c.1.7 1 .8 1.3.2z"/></svg></div><div class="tmp">2°</div><div class="ic"><svg viewBox="0 0 40 40"><path fill="#fff" d="M31 13.3A9.5 9.5 0 0 0 12.6 11 7.4 7.4 0 0 0 9.8 25.3h20.6a6 6 0 0 0 .6-12z"/><g fill="#fff"><circle cx="13" cy="31" r="2"/><circle cx="20" cy="35" r="2"/><circle cx="27" cy="31" r="2"/><circle cx="16.5" cy="38" r="1.6"/><circle cx="23.5" cy="38" r="1.6"/></g></svg></div><div class="dsc">Neige</div><div class="hb">H:4° B:-1°</div></div>`, { d: .52 });
    tile(-300, -300, 120, -45, 0, '', { d: .6, near: 1 });
    // around the phone (hidden for the bento)
    tile(-520, 60, -110, 520, 0, '', { near: 1 }); tile(-520, 560, -110, 955, 1, '', { near: 1 });
    tile(390, -170, 800, 380, 1, '', { near: 1 }); tile(390, 420, 800, 955, 0, '', { near: 1 });
    tile(-520, 995, -110, 1300, 0, '', { near: 2 }); tile(-69, 995, 349, 1300, 1, '', { near: 2 }); tile(390, 995, 800, 1300, 0, '', { near: 2 });
 tile(800, -760, 1100, -360, 0, '', { near: 0 });
    const remRows = [...tRem.el.querySelectorAll('.rr')], remCount = tRem.el.querySelector('.rc');
    const CALr = { n0: cam.querySelector('.n0'), n1: cam.querySelector('.n1'), d0: cam.querySelector('.d0'), d1: cam.querySelector('.d1'), ev: cam.querySelector('.evt') };
    const hands = { h: tClock.el.querySelector('.hh'), m: tClock.el.querySelector('.mm'), s: tClock.el.querySelector('.ss') };
    // iMessage notifications (iOS banners) stacking over the desk
    const msgIcon = '<span class="mi"><svg viewBox="0 0 24 24"><path fill="#fff" d="M12 3.2C6.6 3.2 2.3 6.8 2.3 11.2c0 2.5 1.4 4.7 3.6 6.2-.2 1.3-.8 2.6-1.8 3.5 1.9 0 3.6-.7 4.8-1.7 1 .3 2 .4 3.1.4 5.4 0 9.7-3.6 9.7-8.2S17.4 3.2 12 3.2z"/></svg></span>';
    const msgBadge = '<svg viewBox="0 0 24 24"><path fill="#fff" d="M12 3.2C6.6 3.2 2.3 6.8 2.3 11.2c0 2.5 1.4 4.7 3.6 6.2-.2 1.3-.8 2.6-1.8 3.5 1.9 0 3.6-.7 4.8-1.7 1 .3 2 .4 3.1.4 5.4 0 9.7-3.6 9.7-8.2S17.4 3.2 12 3.2z"/></svg>';
    const M = s.notifs.map(m => ({ el: h('div', 'imsg', R, `<div class="av"><div class="mono">${esc(m.initials || m.from.slice(0, 1))}</div><span class="badge">${msgBadge}</span></div><div class="bd"><div class="top"><b>${esc(m.from)}</b><small>maintenant</small></div><p>${emo(m.text)}</p></div>`), ...m }));

    // ---------- bento tiles (world, around the phone; they fly in at the end)
    const jt = (img, tag) => `<div class="jt" style="background-image:url(${IMG('img/' + img)})"></div>${tag ? `<span class="jtag">${tag}</span>` : ''}`;
    const BTl = [
      tile(-390, 0, -100, 250, 1, `<div class="in"><b style="font-size:32px">Apple Pay</b><div class="okp">✓</div><small>Paiement accepté</small></div>`, { cls: 'bt', bento: 0 }),
      tile(-390, 280, -100, 540, 0, jt('barca.png', 'Frérot'), { cls: 'bt', bento: 1 }),
      tile(-390, 570, -100, 815, 0, jt('france.png', 'Papa'), { cls: 'bt', bento: 2 }),
      tile(380, 0, 670, 250, 1, `<div class="in"><small>Total · 4 maillots</small><div class="big tq tot" style="font-size:62px">59,97€</div><s>79,96€</s></div>`, { cls: 'bt', bento: 3 }),
      tile(380, 280, 670, 540, 0, jt('real.png', 'Le petit'), { cls: 'bt', bento: 4 }),
      tile(380, 570, 670, 815, 0, jt('city.png', 'OFFERT'), { cls: 'bt free', bento: 5 }),
    ];
    const totEl = BTl[3].el.querySelector('.tot'), jtags = BTl.map(b2 => b2.el.querySelector('.jtag')).filter(Boolean);

    // ---------- the phone (in the world)
    const iphX = [30, 22, 14, 7].map((z, i) => { const e = h('div', 'iphx', cam); Object.assign(e.style, { position: 'absolute', left: PX + 'px', top: PY + 'px', width: PWW + 'px', height: PHH + 'px', borderRadius: '68px', background: ['#5d6168', '#7b7f86', '#9a9ea5', '#b4b8be'][i] }); return { e, z }; });
    const iphSh = h('div', 'iphx', cam); Object.assign(iphSh.style, { position: 'absolute', left: PX + 20 + 'px', top: PY + 30 + 'px', width: PWW - 40 + 'px', height: PHH - 20 + 'px', borderRadius: '70px', background: 'rgba(22,26,40,.4)', filter: 'blur(36px)' });
    const iph = h('div', 'iph', cam), bez = h('div', 'bez', iph), scr = h('div', 'scr', bez);
    [['left', -3, 150, 30], ['left', -3, 215, 56], ['left', -3, 285, 56], ['right', -3, 240, 92]].forEach(([side, o, top, hh]) => { const b2 = h('div', 'btn', iph); b2.style[side] = o + 'px'; b2.style.top = top + 'px'; b2.style.height = hh + 'px'; });
    h('div', 'glare', scr);
    h('div', 'isl', scr); h('div', 'stat', scr, `<span>20:41</span><span class="ic"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.6l2.3-2.6a3.2 3.2 0 0 0-4.6 0zM8 4.6c1.9 0 3.6.8 4.8 2l1.4-1.6A8.4 8.4 0 0 0 8 2.4 8.4 8.4 0 0 0 1.8 5l1.4 1.6A6.5 6.5 0 0 1 8 4.6z" /><path d="M8 0C4.8 0 1.9 1.3 0 3.4l1.1 1.2A9.8 9.8 0 0 1 8 1.8c2.7 0 5.2 1.1 6.9 2.8L16 3.4A11.6 11.6 0 0 0 8 0z"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="#000" opacity=".4"/><rect x="2" y="2" width="17" height="9" rx="2"/><rect x="24.5" y="4.3" width="1.6" height="4.4" rx=".8" opacity=".45"/></svg></span>`);
    const vp = h('div', 'vp', scr), L = {};
    const lay = (k, src) => { const d = h('div', 'layer', vp), im = h('img', '', d); im.src = IMG('site/' + src); L[k] = { d, im }; };
    // real scroll recordings of the site (frame sequences) + real cart states
    const seqLay = (k, dir, n) => { const d = h('div', 'layer', vp); const ims = Array.from({ length: n }, (_, i) => { const im = h('img', '', d); im.src = IMG(`site/seq/${dir}/${String(i).padStart(3, '0')}.jpg`); im.style.opacity = 0; return im; }); L[k] = { d, ims, n }; };
    const showSeq = (k, f, blur = 0) => { const S2 = L[k], i0 = Math.round(clamp(f, 0, S2.n - 1)); S2.ims.forEach((im, i) => { im.style.opacity = i === i0 ? 1 : 0; }); S2.d.style.filter = blur > .4 ? `blur(0) url(#vb${k})` : 'none'; if (S2.fb) S2.fb.setAttribute('stdDeviation', `0 ${blur.toFixed(2)}`); };
    seqLay('home', 'home', 45); seqLay('pp', 'pp', 24);
    R.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute"><filter id="vbhome" x="0" y="-5%" width="100%" height="110%"><feGaussianBlur stdDeviation="0 0" edgeMode="duplicate"/></filter><filter id="vbpp" x="0" y="-5%" width="100%" height="110%"><feGaussianBlur stdDeviation="0 0" edgeMode="duplicate"/></filter></svg>`);
    L.home.fb = R.querySelector('#vbhome feGaussianBlur'); L.pp.fb = R.querySelector('#vbpp feGaussianBlur');
    lay('pps', 'product-M.jpg'); lay('c1', 'cart-1.jpg'); lay('c2', 'cart-2.jpg'); lay('c3', 'cart-3.jpg'); lay('c4', 'cart-4.jpg');
    const query = s.query || 'elite maillot';
    const mag = '<svg viewBox="0 0 17 17"><circle cx="7" cy="7" r="5.6" fill="none" stroke="#8a8a8e" stroke-width="1.9"/><path d="m11.2 11.2 4.4 4.4" stroke="#8a8a8e" stroke-width="1.9" stroke-linecap="round"/></svg>';
    const micSvg = '<svg viewBox="0 0 12 18"><rect x="3" y="1" width="6" height="10" rx="3" fill="#8a8a8e"/><path d="M1 8.5a5 5 0 0 0 10 0M6 13.5V17" fill="none" stroke="#8a8a8e" stroke-width="1.6" stroke-linecap="round"/></svg>';
    const favs = [['A', '#ff9f0a', 'Actus'], ['M', '#5e5ce6', 'Météo'], ['F', '#34c759', 'Foot'], ['S', '#ff375f', 'Shopping'], ['Y', '#ff3b30', 'Vidéos'], ['C', '#0a84ff', 'Cartes'], ['R', '#bf5af2', 'Recettes'], ['B', '#30b0c7', 'Banque']];
    const srch = h('div', 'srch', scr, `<div class="fav"><h3>Favoris</h3><div class="g">${favs.map(([l, c, n]) => `<div><i style="background:${c}">${l}</i>${n}</div>`).join('')}</div></div>
      <div class="card2"><b>Rapport de confidentialité</b>Safari a empêché 14 traqueurs de vous profiler au cours des 7 derniers jours.</div>
      <div class="sheet"><div style="height:16px"></div><div class="sec">Meilleur résultat</div><div class="best"><span class="ic" style="background-image:url(${IMG('img/logo.svg')})"></span><span><b>Élite Maillot</b><small>elite-maillot.fr</small></span></div>
        <div class="sec">Suggestions de recherche</div><div class="rows"><div>${mag}elite maillot</div><div>${mag}elite maillot avis</div><div>${mag}elite maillot noël</div></div></div>
      <div class="bar">${mag}<span class="tx"></span><span class="caret"></span><span class="ph">Rechercher ou saisir un site</span><span class="mic">${micSvg}</span><span class="clr">✕</span></div>`);
    const rows = ['azertyuiop', 'qsdfghjklm', 'wxcvbn'];
    const kb = h('div', 'kb', srch, rows.map((r, i) => `<div class="r">${i === 2 ? '<span class="k sp2">⇧</span>' : ''}${[...r].map(c => `<span class="k" data-c="${c}">${c}</span>`).join('')}${i === 2 ? '<span class="k sp2">⌫</span>' : ''}</div>`).join('') + `<div class="r"><span class="k n">123</span><span class="k sp" data-c=" ">espace</span><span class="k go">aller</span></div><div class="under"><img src="${IMG('emoji/1f600.png')}">${micSvg.replace(/#8a8a8e/g, '#3a3a3c')}</div><div class="hb"></div>`);
    const keys = {}; kb.querySelectorAll('.k[data-c]').forEach(k => { keys[k.dataset.c] = k; });
    const goKey = kb.querySelector('.go');
    const tx = srch.querySelector('.tx'), ph = srch.querySelector('.ph'), sheet = srch.querySelector('.sheet'), bar = srch.querySelector('.bar'), best = srch.querySelector('.best'), sRows = [...srch.querySelectorAll('.rows div')], micEl = srch.querySelector('.mic'), clr = srch.querySelector('.clr'), caretEl = srch.querySelector('.caret');
    const xp = h('div', 'xp', vp, `<img src="${IMG('site/hero.jpg')}">`);
    const saf = h('div', 'saf', scr, `<div class="url"><span class="aa">A<b>A</b></span><span class="u">🔍 Rechercher</span><svg class="rl" viewBox="0 0 16 16"><path d="M13.5 8A5.5 5.5 0 1 1 11.8 4" fill="none" stroke="#111" stroke-width="1.6" stroke-linecap="round"/><path d="M12.6 1.2v3.6H9" fill="none" stroke="#111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><i class="pg"></i></div><div class="home"></div>`);
    const url = saf.querySelector('.u'), pg = saf.querySelector('.pg');
    const dim = h('div', 'dim', scr);
    const ap = h('div', 'ap', scr, `<div class="hd"><img class="aplogo" src="${IMG('img/logo.svg')}"><span class="x">✕</span></div>
      <div class="row"><span class="card"><i class="chip"></i></span><div><b>Carte bancaire</b><small>•••• 4021</small></div><span class="chev">›</span></div>
      <div class="lbl">COMMANDE</div><div class="val">4 maillots · 3 achetés = <em>1 offert</em></div><div class="val sub">Total 59,97 € · Livraison offerte</div>
      <div class="st"><div class="s1"><span class="side"></span>Confirmer avec le bouton latéral</div><div class="s2"><svg viewBox="0 0 40 40"><g fill="none" stroke="#0a84ff" stroke-width="2.4" stroke-linecap="round"><path d="M4 12V7a3 3 0 0 1 3-3h5M28 4h5a3 3 0 0 1 3 3v5M36 28v5a3 3 0 0 1-3 3h-5M12 36H7a3 3 0 0 1-3-3v-5"/><path d="M14 14v3M26 14v3M20 15v7h-2M15 27q5 4 10 0"/></g></svg>Face ID</div><div class="s3"><span class="spin"></span></div><div class="s4"><span class="ok">✓</span>Terminé</div></div>`);
    const dbl = h('div', 'dbl', scr, '<span>Double-cliquer<br>pour payer</span><i></i>');
    const apS = [...ap.querySelectorAll('.st > div')], spin = ap.querySelector('.spin'), okc = ap.querySelector('.ok');
    const app = h('div', 'app', vp);
    const cartIco = '<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.7"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
    const ST = s.store;
    const scHome = h('div', 'scrn', app, `<div class="hd2"><span class="ic2"><svg viewBox="0 0 24 24" stroke="#111" stroke-width="1.7"><path d="M4 7h16M4 12h16M4 17h16"/></svg></span><img src="${IMG('img/logo.svg')}"><span class="ic2">${cartIco}<span class="bdg">0</span></span></div>
      <div class="feed"><div class="promo"><b>${emo('🎁')} 3 achetés = 1 offert</b><span>Le 4ème maillot est offert automatiquement</span></div><div class="ttl">Les plus demandés</div>
      <div class="grid2">${ST.map(p2 => `<div class="pc"><div class="im"><i style="background-image:url(${IMG('img/' + p2.img)})"></i></div><b>${esc(p2.name)}</b><span>19,99€</span></div>`).join('')}</div></div>`);
    const feed = scHome.querySelector('.feed'), pcs = [...scHome.querySelectorAll('.pc')], promo = scHome.querySelector('.promo'), bdg = scHome.querySelector('.bdg');
    const scProd = h('div', 'scrn pd', app, `<div class="hd2"><span class="ic2"><svg viewBox="0 0 24 24" stroke="#111" stroke-width="2" fill="none"><path d="M15 5l-7 7 7 7"/></svg></span><img src="${IMG('img/logo.svg')}"><span class="ic2">${cartIco}</span></div>
      <div class="big"><i style="background-image:url(${IMG('img/barca.png')})"></i></div><div class="inf"><h3>Maillot Barcelone domicile 26/27</h3><div class="pr2">19,99€</div><span class="of">${emo('🎁')} 3 achetés = 1 offert</span>
      <div class="lb">Taille</div><div class="chips"><span>S</span><span class="m">M</span><span>L</span><span>XL</span><span>2XL</span></div></div><div class="cta">Ajouter au panier</div>`);
    const chipM = scProd.querySelector('.chips .m'), cta = scProd.querySelector('.cta'), bigJ = scProd.querySelector('.big i');
    const CR = [['barca.png', 'Barcelone domicile 26/27'], ['france.png', 'France extérieur 2026'], ['real.png', 'Real Madrid domicile 26/27'], ['city.png', 'Manchester City domicile 26/27']];
    const scCart = h('div', 'cartsh', app, `<div class="hdl"></div><h4>Votre panier <span class="cc">(1)</span></h4>
      <div class="ofc"><div class="r1"><span>${emo('🎁')} 3 achetés = 1 offert</span><em class="st2">1/4</em></div><div class="segs"><i></i><i></i><i></i><i></i></div></div>
      <div class="rows2">${CR.map((c2, i) => `<div class="rw"><span class="th2" style="background-image:url(${IMG('img/' + c2[0])})"></span><div><b>${esc(c2[1])}</b><small>Taille M</small></div><span class="p3">${i === 3 ? '<s>19,99€</s><span class="free2">OFFERT</span>' : '19,99€'}</span></div>`).join('')}</div>
      <div class="tot2"><span>Total</span><span><s class="oldt">79,96€</s><b class="tt">19,99€</b></span></div><div class="applebtn">Payer avec Apple Pay</div>`);
    const rws = [...scCart.querySelectorAll('.rw')], segs = [...scCart.querySelectorAll('.segs i')], st2 = scCart.querySelector('.st2'), cc = scCart.querySelector('.cc'), tt = scCart.querySelector('.tt'), oldt = scCart.querySelector('.oldt'), abtn = scCart.querySelector('.applebtn');
    const tap = h('div', 'tap2', scr), ring = h('div', 'ring', scr), off = h('div', 'off', scr);

    // ---------- overlays
    const HL = s.headlines.map(x => { const w = wordsEl(R, x.text, ''); w.box.className = 'hl'; if (x.y) w.box.style.top = x.y + 'px'; return { w, ...x }; });
    const dots = h('div', 'dots', R, '<i></i><i></i><i></i>');
    // the real logo, vectorised (assets/img/logo.svg): ÉLITE and MAILLOT split into letters for the reveal
    const veil = h('div', 'veil', R);
    const xhr = new XMLHttpRequest(); xhr.open('GET', IMG('img/logo.svg'), false); xhr.send();
    const doc = new DOMParser().parseFromString(xhr.responseText, 'image/svg+xml'), vb = doc.documentElement.getAttribute('viewBox');
    const splitLetters = (d, cuts) => { const groups = cuts.map(() => []).concat([[]]); d.split(/(?=M)/).forEach(sp => { const xs = (sp.match(/-?\d+\.?\d*/g) || []).map(Number).filter((_, i) => i % 2 === 0); const cx = xs.reduce((a2, b2) => a2 + b2, 0) / (xs.length || 1); let g = cuts.findIndex(c => cx < c); if (g < 0) g = cuts.length; groups[g].push(sp); }); return groups.filter(g2 => g2.length).map(g2 => g2.join(' ')); };
    const eL = splitLetters(doc.getElementById('elite').getAttribute('d'), [691, 928, 1042, 1304]), mL = splitLetters(doc.getElementById('maillot').getAttribute('d'), [882, 993, 1042, 1122, 1198, 1304]);
    const end = h('div', 'end', R, `<svg class="emlogo" viewBox="${vb}">${eL.map(d => `<path class="le" fill="#5ce1e6" fill-rule="evenodd" d="${d}"/>`).join('')}${mL.map(d => `<path class="lm" fill="#111" fill-rule="evenodd" d="${d}"/>`).join('')}</svg><div class="tg">3 achetés = <span>1 offert</span></div><div class="urlp">elite-maillot.fr</div>`);
    const LE = [...end.querySelectorAll('.le')], LM = [...end.querySelectorAll('.lm')], endTg2 = end.querySelector('.tg'), endPill = end.querySelector('.urlp'), logoSvg = end.querySelector('svg');
    [...LE, ...LM].forEach(pth => { pth.style.transformBox = 'fill-box'; pth.style.transformOrigin = '50% 100%'; });
    const pill = h('div', 'pill', R, esc(s.pill || 'Un maillot pour Noël ?'));
    const svgNS = 'http://www.w3.org/2000/svg';
    R.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute"><filter id="mbf" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur id="mbg" stdDeviation="0 0" edgeMode="duplicate"/></filter></svg>`);
    const mbg = R.querySelector('#mbg');
    const tagline = s.tagline || '';

    // ---------- camera path [cx, cy, zoom, rotZ, tiltX]; third slot of a key = easing of the move that starts there
    const phoneTop = 430, FZ = 1.82, FCY = PY + (960 - phoneTop) / FZ;      // frontal: phone top at y=430
    const ZP = (x, y) => [SX + x, SY + SB + y];                             // capture point -> world
    const city = ZP(300, 300);
    // ---------- camera = the reference's measured moves (optical flow on its 30 fps): a few smooth moves with a
    // measured velocity profile (peak position p), and an almost still camera in between (median 0.09 px/frame)
    const bellCache = {};
    const bell = p => {   // easing whose velocity is k^a (1-k)^b, peak at p
      const key = p.toFixed(3); if (bellCache[key]) return bellCache[key];
      const A = Math.max(.08, 4 * p), Bb = Math.max(.08, 4 * (1 - p)), N = 400, cum = [0];
      for (let i = 1; i <= N; i++) { const k = (i - .5) / N; cum.push(cum[i - 1] + Math.pow(k, A) * Math.pow(1 - k, Bb)); }
      const tot = cum[N]; const f = k => { const x = clamp(k) * N, i = Math.floor(x); return i >= N ? 1 : (cum[i] + (cum[i + 1] - cum[i]) * (x - i)) / tot; };
      bellCache[key] = f; return f;
    };
    const START = [90, -300, .85, -15, 16];
    const MOVES = [
      { t0: .37, t1: 1.87, p: .33, to: [-20, -540, 1.45, -6, 6] },                       // push in + roll onto the clock
      { t0: 1.87, t1: 2.7, p: .5, to: [-14, -536, 1.48, -5.6, 6] },                      // (almost still)
      { t0: 2.7, t1: 3.9, p: .61, to: [460, -410, 1.75, -6, 6] },                        // glide to the widgets / messages
      { t0: 3.9, t1: 5.4, p: .5, to: [462, -408, 1.77, -6.2, 6] },                       // (almost still)
      { t0: 5.4, t1: 7.3, p: .28, to: [140, FCY, FZ, 0, 0], zmid: .78, km: .45 },        // dive: pull out then into the phone
      { t0: B.pay + .3, t1: B.pay + .95, p: .5, to: [SX + 200, SY + 430, 2.12, 1.5, 3] },   // into the Apple Pay sheet, pulse 1
      { t0: B.pay + 1.05, t1: B.pay + 1.83, p: .62, to: [SX + 220, SY + 500, 2.95, 3.5, 5.5] }, // pulse 2
      { t0: B.pay + 2.13, t1: B.pay + 2.7, p: .95, to: [SX + 212, SY + 515, 3.05, 3.8, 5.6] },          // small push on "Terminé"
      { t0: B.bento - .45, t1: B.bento + 1.9, p: .2, to: [140, 0, .8, 0, 0] },                             // pull back, long settle on the bento
      { t0: B.bento + 1.9, t1: B.end - .35, p: .5, to: [140, 12, .78, 0, 0] },                           // (almost still)
      { t0: B.end - .35, t1: B.end + .05, p: .3, to: [150, 0, .94, 3, 0] },                           // punch-in with the blur before the logo
      { t0: B.end + .05, t1: s.duration, p: .5, to: [150, 0, .96, 3, 0] },
    ];
    const camRaw = t => {
      let c = START.slice();
      for (const m of MOVES) {
        if (t <= m.t0) break;
        const k = clamp((t - m.t0) / (m.t1 - m.t0)), e = bell(m.p)(k), from = c;
        c = from.map((v, i) => lerp(v, m.to[i], e));
        if (m.zmid) {   // zoom goes out to zmid then into the target, on its own smooth curve
          const zk = k < m.km ? E.inOut(k / m.km) : E.inOut((k - m.km) / (1 - m.km));
          c[2] = k < m.km ? Math.exp(lerp(Math.log(from[2]), Math.log(m.zmid), zk)) : Math.exp(lerp(Math.log(m.zmid), Math.log(m.to[2]), zk));
        }
        if (t < m.t1) return c;
      }
      return c;
    };
    const m8 = MOVES.find(m => m.t0 === B.bento - .45);
    const camAt = t => {
      const c = camRaw(t);
      // 3/4 angle while on the desk, squared up for the bento (follows the snap-back move)
      return [...c, -6 * (1 - bell(m8.p)(clamp((t - m8.t0) / (m8.t1 - m8.t0))))];
    };
    const camCss = c => `translate(540px, 960px) rotateX(${Math.max(c[4], 9)}deg) rotateY(${c[5] || 0}deg) rotateZ(${c[3]}deg) scale(${c[2]}) translate(${-c[0]}px, ${-c[1]}px)`;

    return t => {
      const c = camAt(t), p = camAt(t - 1 / 30);
      cam.style.transform = camCss(c);
      // motion blur from the on-screen speed of the camera
      // where does the world point under the screen centre go between two frames? -> blur along that direction
      const scrOf = (wx, wy, q) => { const dx = (wx - q[0]) * q[2], dy = (wy - q[1]) * q[2], r = q[3] * Math.PI / 180; return [540 + dx * Math.cos(r) - dy * Math.sin(r), 960 + (dx * Math.sin(r) + dy * Math.cos(r)) * Math.cos(q[4] * Math.PI / 180)]; };
      const sp = scrOf(c[0], c[1], p), dX = 540 - sp[0], dY = 960 - sp[1];
      const zr = Math.abs(Math.log(c[2] / p[2])) * 260 + Math.abs(c[3] - p[3]) * 7;
      const endBlur = kf(t, [[B.end - .3, 0], [B.end + .5, 22]]);
      const bx = Math.min(9, Math.max(0, Math.abs(dX) - 6) * .2 + zr * .3) + endBlur, by = Math.min(9, Math.max(0, Math.abs(dY) - 6) * .2 + zr * .3) + endBlur;
      if (bx + by > .5) { mbg.setAttribute('stdDeviation', `${bx.toFixed(2)} ${by.toFixed(2)}`); persp.style.filter = 'url(#mbf)'; } else persp.style.filter = 'none';
      const toScreen = (wx, wy) => scrOf(wx, wy, c);
      persp.style.opacity = 1 - prog(t, B.end + .9, .6) * .55;

      // tiles assemble (slide in from their offsets), the wall near the phone gives way to the bento
      T.forEach(o => {
        if (o.bento != null) {
          const k = prog(t, B.bento - .05 + o.bento * .07, .75, E.outQuint), side = o.bento < 3 ? -1 : 1;
          o.el.style.opacity = clamp(k * 2); o.el.style.transform = `perspective(900px) translateY(${(1 - k) * 90}px) rotateY(${(1 - k) * side * -95}deg) scale(${lerp(.85, 1, k)})`;
          return;
        }
        const d0 = .16 + (o.d - .15) * .55, k = prog(t, d0, .5, E.back), out = o.near ? prog(t, B.bento - .25, .4) : 0;
        o.el.style.opacity = clamp(prog(t, d0, .12)) * (1 - out * (o.near === 1 ? 1 : 0));
        const kz = prog(t, d0, .7, E.outQuint), sgn = (o.el.offsetLeft % 2 ? 1 : -1);
        o.el.style.transform = `translateZ(${(1 - kz) * 260}px) translateY(${(1 - kz) * -40}px) rotate(${(1 - kz) * 5 * sgn}deg) scale(${lerp(.9, 1, Math.max(0, k)) * (1 - out * .1)})`;
      });
      // phone lies on the desk, then lifts toward the camera when it stands up
      const lift = win(t, B.phone, B.zoom + .1, .9, .6);
      const pk = prog(t, .05, .5, E.back);
      const iphT = `translateZ(${lift * 70}px) scale(${Math.max(.01, pk)})`;
      iph.style.transform = iphT; iph.style.opacity = clamp(prog(t, .05, .1));
      iphX.forEach(({ e, z }) => { e.style.transform = `${iphT} translateZ(${-z}px)`; e.style.opacity = iph.style.opacity; });
      iphSh.style.transform = `${iphT} translateZ(${-40 - lift * 70}px) translateY(${30 + lift * 40}px)`; iphSh.style.opacity = iph.style.opacity * (1 - lift * .35);
      off.style.opacity = 1 - prog(t, B.phone - .05, .3);

      // clock: time-lapse from 18:05 to 20:41 while the camera arrives on it
      const mins = kf(t, [[B.clock - .2, 18 * 60 + 5], [B.clock + 1.3, 20 * 60 + 41, E.outQuint], [s.duration, 20 * 60 + 41 + s.duration / 60]]);
      hands.m.setAttribute('transform', `rotate(${(mins % 60) * 6} 100 100)`); hands.h.setAttribute('transform', `rotate(${(mins / 60 % 12) * 30} 100 100)`);
      hands.s.setAttribute('transform', `rotate(${(t * 360 / 60 * 6 + mins * 30) % 360} 100 100)`);
      // calendar: the day rolls over (MERCREDI 2 -> JEUDI 3) under the time-lapse
      const rk = prog(t, B.clock + .95, .45, E.back);
      CALr.n0.style.transform = `translateY(${-rk * 150}px)`; CALr.n1.style.transform = `translateY(${(1 - rk) * 150}px)`;
      CALr.d0.style.transform = `translateY(${-rk * 34}px)`; CALr.d1.style.transform = `translateY(${(1 - rk) * 34}px)`;
      CALr.ev.textContent = rk > .5 ? 'dans 21 jours' : 'dans 22 jours';
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
        m.el.style.filter = vy > 8 ? `blur(${Math.min(4, vy * .06).toFixed(1)}px)` : 'none';
        m.el.style.zIndex = 12 + i;
      });
      // a blue message pill leaves the stack and flies into the phone's search field while the camera dives
      const pf = prog(t, B.phone - .3, 1.35, E.inOut);
      if (t > B.phone - .35 && pf < 1) {
        const tgt = toScreen(SX + 195, SY + SB + 330), x = lerp(540, tgt[0], pf), y = lerp(560, tgt[1], pf) - Math.sin(pf * Math.PI) * 120;
        const xs = lerp(540, toScreen(SX + 195, SY + SB + 74 - 1)[0], 0);
        pill.style.display = ''; pill.style.opacity = clamp(prog(t, B.phone - .35, .15)) * (1 - prog(t, B.phone + .85, .2));
        pill.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${lerp(1, .42, pf)}) rotate(${lerp(0, -8, Math.sin(pf * Math.PI))}deg)`;
        pill.style.filter = pf > .05 && pf < .95 ? `blur(${(Math.sin(pf * Math.PI) * 4).toFixed(1)}px)` : 'none';
      } else pill.style.display = 'none';

      // ----- in the phone
      const typeAt = B.phone + .55, cps = 10, typed = Math.floor(clamp((t - typeAt) * cps, 0, query.length));
      // keyboard rises when the bar is focused, the bar rides on top of it, suggestions fill in as the query is typed
      const kU = prog(t, B.phone + .35, .45, E.outQuint), barY = lerp(VH + SAF - 68, VH + SAF - 300 - 56, kU);
      kb.style.transform = `translateY(${(1 - kU) * 105}%)`; bar.style.top = barY + 'px';
      sheet.style.opacity = kU; sheet.style.transform = `translateY(${(1 - kU) * 30}px)`;
      tx.textContent = query.slice(0, typed); ph.style.display = typed ? 'none' : ''; caretEl.style.opacity = kU > .5 && (typed < query.length || Math.floor(t * 2.2) % 2) ? 1 : 0;
      micEl.style.display = typed ? 'none' : ''; clr.style.display = typed ? '' : 'none'; goKey.classList.toggle('on2', typed > 0);
      const bk = prog(t, typeAt + 4 / cps, .35, E.outQuint); best.style.opacity = bk; best.style.transform = `translateY(${(1 - bk) * 14}px)`;
      sRows.forEach((r2, i) => { const q = prog(t, typeAt + (6 + i * 2) / cps, .3); r2.style.opacity = q; });
      Object.values(keys).forEach(k => k.classList.remove('on'));
      const ci = Math.floor((t - typeAt) * cps); if (ci >= 0 && ci < query.length && (t - typeAt) * cps - ci < .65) { const kk = keys[query[ci]]; kk && kk.classList.add('on'); }
      const tapHit = B.open - .45;
      best.style.background = t > tapHit - .08 && t < tapHit + .25 ? '#e5e5ea' : '#fff';
      kb.style.opacity = 1 - prog(t, tapHit + .05, .25); bar.style.opacity = 1 - prog(t, tapHit + .05, .25);
      // shared element: the result card expands into the site, the site rises into place
      const x1 = prog(t, tapHit + .03, .42, E.outQuint);
      if (t > tapHit + .03 && t < B.open + .75) {
        const R0 = [26, 54, 52, 52, 12], R1 = [0, 0, SW, VH, 0];
        const rr = R0.map((v0, j) => lerp(v0, R1[j], x1));
        xp.style.display = ''; Object.assign(xp.style, { left: rr[0] + 'px', top: rr[1] + 'px', width: rr[2] + 'px', height: rr[3] + 'px', borderRadius: rr[4] + 'px', opacity: 1 });
      } else xp.style.display = 'none';
      srch.style.display = t < B.open + .2 ? '' : 'none'; srch.style.opacity = 1 - prog(t, tapHit + .2, .3); saf.style.opacity = prog(t, tapHit + .25, .3);
      const rise = prog(t, B.open + .1, .6, E.outQuint); L.home.d.style.opacity = t > B.open + .1 ? 1 : 0; L.home.d.style.transform = `translateY(${(1 - rise) * VH}px)`;
      const hr = prog(t, B.open + .1, .7, E.outQuint);
      url.textContent = 'elite-maillot.fr';
      pg.style.width = prog(t, tapHit + .1, .9, E.out) * 100 + '%'; pg.style.opacity = t > tapHit + .1 && t < tapHit + 1.1 ? 1 : 0;
      const scrollY = kf(t, [[B.choose, 0], [B.choose + 1.3, 1650, sexy]]);
      const scrollPrev = kf(t - 1 / 30, [[B.choose, 0], [B.choose + 1.3, 1650, sexy]]);
      showSeq('home', scrollY / 1650 * 44, Math.min(4, Math.abs(scrollY - scrollPrev) * .05));
      const tapCard = B.choose + 1.5, tapAtc = B.add + 1.0;
      const ppIn = prog(t, tapCard + .1, .45, E.outQuint); L.pp.d.style.transform = `translateX(${(1 - ppIn) * 100}%)`; L.pp.d.style.opacity = t > tapCard ? 1 : 0;
      const ppY = q => kf(q, [[B.add - .1, 0], [tapAtc - .45, 650, sexy]]);
      showSeq('pp', ppY(t) / 650 * 23, Math.min(4, Math.abs(ppY(t) - ppY(t - 1 / 30)) * .05));
      L.pps.d.style.display = t > tapAtc - .45 ? '' : 'none'; L.pps.d.style.opacity = prog(t, tapAtc - .42, .1);
      const c1 = prog(t, tapAtc + .2, .45, E.outQuint); L.c1.d.style.transform = `translateX(${(1 - c1) * 100}%)`; L.c1.d.style.opacity = t > tapAtc + .15 ? 1 : 0;
      // the cart fills live: 1 -> 2 -> 3 -> 4 jerseys (real drawer states), quick UI updates, no cut
      [['c2', B.four - .6], ['c3', B.four - .3], ['c4', B.four]].forEach(([k, at]) => { const q = prog(t, at, .14); L[k].d.style.opacity = q; L[k].im.style.transform = `translateY(${(1 - q) * 10}px)`; });
      const tp = at => clamp((t - at + .2) / .2) * (1 - clamp((t - at - .15) / .25));
      const t1 = tp(tapHit), t2 = tp(tapCard), t3 = tp(tapAtc), t4 = tp(B.pay), m = Math.max(t1, t2, t3, t4);
      const pt = t1 === m ? [195, SB + 80] : t2 === m ? [287, SB + 557] : t3 === m ? [195, SB + 494] : [195, SB + 615];
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
      const ro = win(t, B.four + .25, B.pay - .1, .3, .2);
      ring.style.opacity = ro; Object.assign(ring.style, { left: '16px', top: SB + 326 + 'px', width: '358px', height: '62px', transform: `scale(${lerp(1.2, 1, ro)})` });

      // the Christmas list gets ticked off in the finale
      remRows.forEach((r2, i) => { const on = t > B.bento + .55 + i * .25; const cb = r2.querySelector('.cb'); cb.classList.toggle('on', on); cb.textContent = on ? '✓' : ''; r2.style.opacity = on ? .55 : 1; });
      remCount.textContent = String(3 - remRows.filter((_, i) => t > B.bento + .55 + i * .25).length);
      // bento counters
      totEl.textContent = lerp(79.96, 59.97, prog(t, B.bento + .35, 1.2, E.outQuint)).toFixed(2).replace('.', ',') + '€';
      jtags.forEach((tg, i) => { const k = prog(t, B.bento + .6 + i * .15, .35, E.back); tg.style.opacity = clamp(k * 2); tg.style.transform = `translateX(-50%) scale(${lerp(.5, 1, k)})`; });

      // headlines (words out of a blur)
      HL.forEach(x => {
        const vis = !(t < x.at - .1 || t > x.out + .05); x.w.box.style.display = vis ? '' : 'none'; if (!vis) return;
        const o = 1 - prog(t, x.out - .3, .3, E.inOut); x.w.box.style.opacity = o; x.w.box.style.filter = 'none';
        x.w.box.style.transform = `translateY(-50%) translateY(${(1 - o) * -40}px)`;
        x.w.parts.forEach((p, i) => { const k = prog(t, x.at + i * (x.stagger || .08), .5, E.back), a = clamp(prog(t, x.at + i * (x.stagger || .08), .2)); p.style.opacity = a; p.style.filter = 'none'; p.style.transform = `translateY(${(1 - k) * 46}px) rotate(${(1 - k) * 6}deg) scale(${lerp(.92, 1, k)})`; p.style.transformOrigin = '0 100%'; });
      });
      fog.style.opacity = (t < B.clock - .6 ? prog(t, B.clock - 1.1, .4) : 1) * (1 - prog(t, B.bento - .2, .4));

      // end: bouncing dots, the logo, the tagline typed
      const dk = win(t, B.end + .35, B.end + 1.35, .2, .25); dots.style.opacity = dk;
      [...dots.children].forEach((d, i) => { const ph2 = ((t - B.end) * 2.6 - i * .18) % 1; d.style.transform = `translateY(${-Math.max(0, Math.sin(ph2 * Math.PI)) * 26}px) scale(${1 + Math.max(0, Math.sin(ph2 * Math.PI)) * .15})`; });
      // ----- redrawn store: opens with a cascade, scrolls, tap on the Barça card, product page, size, add, cart fills, Apple Pay
      srch.style.display = 'none'; saf.style.opacity = 1;
      const T0 = B.phone + .05, tCard = B.choose + 1.0, tSize = B.add - .2, tAdd = B.add + 1.0;
      promo.style.opacity = prog(t, T0 + .15, .3); promo.style.transform = `translateY(${(1 - prog(t, T0 + .15, .5, E.outQuint)) * 24}px)`;
      pcs.forEach((pc, i) => { const k = prog(t, T0 + .3 + i * .08, .5, E.back); pc.style.opacity = clamp(k * 2); pc.style.transform = `translateY(${(1 - k) * 40}px) scale(${lerp(.92, 1, k)})`; });
      const fy = kf(t, [[B.open - .3, 0], [B.choose + .6, 230, sexy]]); feed.style.transform = `translateY(${-fy}px)`;
      const pin = prog(t, tCard + .1, .45, E.outQuint); scProd.style.transform = `translateX(${(1 - pin) * 100}%)`; scProd.style.display = t > tCard ? '' : 'none';
      scHome.style.transform = `translateX(${-pin * 30}%)`;
      bigJ.style.transform = `translateY(${Math.sin(t * 1.6) * 4}px) scale(${lerp(.85, 1, prog(t, tCard + .3, .5, E.back))})`;
      chipM.classList.toggle('on', t > tSize); chipM.style.transform = `scale(${1 - .08 * clamp(1 - Math.abs(t - tSize) / .12)})`;
      cta.style.transform = `scale(${1 - .04 * clamp(1 - Math.abs(t - tAdd) / .15)})`;
      const cin = prog(t, tAdd + .15, .5, E.outQuint); scCart.style.transform = `translateY(${(1 - cin) * 105}%)`; scCart.style.display = t > tAdd + .1 ? '' : 'none';
      const addT = [tAdd + .3, B.four - .6, B.four - .3, B.four];
      const nIn = addT.filter(x => t >= x).length;
      rws.forEach((rw, i) => { const k = prog(t, addT[i], .4, E.back); rw.style.display = t >= addT[i] - .01 ? '' : 'none'; rw.style.opacity = clamp(k * 2); rw.style.transform = `translateX(${(1 - k) * 60}px)`; });
      segs.forEach((sg, i) => sg.classList.toggle('on', i < nIn)); st2.textContent = nIn >= 4 ? 'Débloqué ✓' : nIn + '/4'; cc.textContent = `(${nIn})`;
      const totV = nIn >= 4 ? lerp(79.96, 59.97, prog(t, B.four + .15, .6, E.outQuint)) : 19.99 * nIn; tt.textContent = totV.toFixed(2).replace('.', ',') + '€';
      oldt.style.display = nIn >= 4 ? '' : 'none'; bdg.textContent = nIn;
      abtn.style.transform = `scale(${1 - .04 * clamp(1 - Math.abs(t - B.pay) / .15)})`;
      const tp2 = at => clamp((t - at + .2) / .2) * (1 - clamp((t - at - .15) / .25));
      const q1 = tp2(tCard), q2 = tp2(tSize), q3 = tp2(tAdd), q4 = tp2(B.pay), mq = Math.max(q1, q2, q3, q4);
      const ptq = q1 === mq ? [100, SB + 54 + 14 + 70 + 34 + 250 + 84 - 230 + 84] : q2 === mq ? [104, SB + 300 + 16 + 120 + 30] : q3 === mq ? [195, SB + VH - 42] : [195, SB + VH - 42];
      tap.style.opacity = mq; tap.style.left = ptq[0] + 'px'; tap.style.top = ptq[1] + 'px'; tap.style.transform = `scale(${lerp(1.5, .85, mq)})`;

      // logo reveal: a clean light veil, ÉLITE letters pop one by one, MAILLOT rises letter by letter, then the offer and the URL
      const L0 = B.end + 1.62;
      veil.style.opacity = prog(t, B.end + .9, .5);
      end.style.opacity = t > L0 - .05 ? 1 : 0;
      LE.forEach((pth, i) => { const k = prog(t, L0 + i * .07, .5, E.back), o = clamp(prog(t, L0 + i * .07, .18)); pth.style.opacity = o; pth.style.transform = `translateY(${(1 - k) * 60}px) scale(${Math.max(.01, lerp(.35, 1, k))})`; });
      LM.forEach((pth, i) => { const k = prog(t, L0 + .4 + i * .045, .45, E.outQuint); pth.style.opacity = k; pth.style.transform = `translateY(${(1 - k) * 50}px)`; });
      logoSvg.style.transform = `scale(${1 + prog(t, L0, 3, E.out) * .04})`;
      const tg2 = prog(t, L0 + .85, .45, E.outQuint); endTg2.style.opacity = tg2; endTg2.style.transform = `translateY(${(1 - tg2) * 24}px)`;
      const pl2 = prog(t, L0 + 1.1, .45, E.back); endPill.style.opacity = clamp(pl2 * 2); endPill.style.transform = `scale(${lerp(.7, 1, pl2)})`;
    };
  };
})();
