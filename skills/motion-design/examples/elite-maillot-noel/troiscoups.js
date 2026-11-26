// Élite Maillot — Noël, faithful Trois Coups construction with the REAL site in the phone.
// Light studio, a 3D wall of rounded white/black tiles (clock, calendar, countdown, family chat), centred headline
// whose words come out of a blur, then a big iPhone rising in front of the wall: Safari search typed on the keyboard,
// the real elite-maillot.fr home loading, scroll, tap on the Barça jersey, real product page, real "Ajouter au panier",
// real cart, real 4-item cart (the site sets the 4th to 0,00€), a fast zoom with motion blur on the proof, pull back
// to a final bento, blur, three dots, the real logo.
(() => {
  const { SCENES, h, esc, clamp, lerp, E, prog, wordsEl, wordsAt, rel } = window.MOTION;
  const IMG = f => rel('assets/' + f);
  const kf = (t, K, ease = E.inOut) => {
    if (t <= K[0][0]) return K[0][1];
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) {
      const [t0, a] = K[i - 1], [t1, b] = K[i], k = ease((t - t0) / (t1 - t0));
      return Array.isArray(a) ? a.map((x, j) => lerp(x, b[j], k)) : lerp(a, b, k);
    }
    return K[K.length - 1][1];
  };
  const win = (t, a, b, fi = .45, fo = .45) => Math.min(prog(t, a, fi, E.out), 1 - prog(t, b - fo, fo, E.inOut));
  // screen = iPhone 14 capture viewport (390 x 664 css px) + iOS status bar + Safari bar
  const SW = 390, SB = 47, VH = 664, SAF = 76, SH = SB + VH + SAF, K = 1.88, PW = SW * K + 28, PH = SH * K + 28, PTOP = 430;

  const CSS = `
  .w3 { --ink:#12b5c0; --tq:#5ce1e6; position:absolute; inset:0; font-family: Inter, system-ui, sans-serif; color:#1d1f26; overflow:hidden; }
  .w3 .world { position:absolute; inset:0; perspective: 2600px; }
  .w3 .wall { position:absolute; left:50%; top:50%; width:0; height:0; transform-style: preserve-3d; }
  .w3 .tile { position:absolute; border-radius: 64px; background: linear-gradient(160deg,#ffffff,#eef0f3); box-shadow: 0 2px 0 rgba(255,255,255,.9) inset, 0 40px 70px rgba(40,44,60,.18), 0 8px 18px rgba(40,44,60,.10); overflow:hidden; }
  .w3 .tile.k { background: linear-gradient(160deg,#1c1d22,#0c0c0f); box-shadow: 0 1px 0 rgba(255,255,255,.08) inset, 0 40px 70px rgba(20,22,30,.32); color:#fff; }
  .w3 .clock { position:absolute; inset: 9%; }
  .w3 .cal { position:absolute; inset:0; padding: 34px 38px; }
  .w3 .cal .d { font-size: 30px; font-weight: 800; letter-spacing:.06em; color: var(--tq); }
  .w3 .cal .n { font-size: 200px; font-weight: 600; line-height: .95; letter-spacing:-.04em; margin-top: 8px; }
  .w3 .cal .m { font-size: 28px; color: rgba(255,255,255,.55); }
  .w3 .cd { position:absolute; inset:0; padding: 34px 38px; background: linear-gradient(160deg,#21b8c4,#0d8f99); color:#fff; }
  .w3 .cd small { font-size: 26px; font-weight:700; letter-spacing:.06em; opacity:.85; }
  .w3 .cd b { display:block; font-size: 150px; font-weight: 700; letter-spacing:-.05em; line-height:1; margin-top: 18px; }
  .w3 .cd i { font-style:normal; font-size: 26px; opacity:.85; }
  .w3 .chat { position:absolute; inset:0; padding: 34px 40px; }
  .w3 .chat .hd { display:flex; align-items:center; gap: 14px; font-size: 32px; font-weight: 600; }
  .w3 .chat .av { display:flex; } .w3 .chat .av span { width: 50px; height: 50px; border-radius: 50%; margin-right: -14px; border: 3px solid #141418; display:grid; place-items:center; font-size: 22px; font-weight: 700; }
  .w3 .chat .hd small { margin-left:auto; font-size: 22px; color: rgba(255,255,255,.45); font-weight: 500; }
  .w3 .chat .b { display:inline-block; margin-top: 18px; padding: 16px 26px; border-radius: 30px; background: rgba(255,255,255,.12); font-size: 32px; font-weight: 500; }
  .w3 .chat .row { display:flex; } .w3 .chat .row.r { justify-content:flex-end; } .w3 .chat .row.r .b { background: #0a84ff; }

  .w3 .fog { position:absolute; left:0; right:0; top:0; height: 400px; background: linear-gradient(180deg, #f3f4f7 0%, rgba(243,244,247,.9) 50%, rgba(243,244,247,0) 100%); z-index: 9; }
  .w3 .hl { position:absolute; z-index: 10; left: 4%; right: 4%; top: 175px; text-align:center; font-size: 74px; font-weight: 700; letter-spacing: -.035em; line-height:1.06; color:#1f2129; transform: translateY(-50%); white-space: nowrap; }
  .w3 .hl .w { display:inline-block; margin: 0 .12em; }
  .w3 .hl .acc { color: var(--ink); }

  /* phone */
  .w3 .iph { position:absolute; left:50%; top:0; width:${PW}px; height:${PH}px; margin-left:${-PW / 2}px; border-radius: 120px; background:#0b0b0d; padding: 14px; box-sizing:border-box; z-index: 6; transform-origin: 50% 0;
     box-shadow: 0 0 0 3px #b9bcc3, 0 0 0 6px #e6e8ec, 0 0 0 7px #a9adb5, 0 70px 120px rgba(30,34,50,.35), 0 20px 40px rgba(30,34,50,.2); }
  .w3 .scr { position:relative; width:${SW}px; height:${SH}px; transform: scale(${K}); transform-origin:0 0; border-radius:${106 / K}px; overflow:hidden; background:#fff; }
  .w3 .isl { position:absolute; top: 11px; left:50%; width: 120px; height: 34px; margin-left:-60px; border-radius: 20px; background:#000; z-index: 30; }
  .w3 .stat { position:absolute; top:0; left:0; right:0; height:${SB}px; background:#fff; display:flex; justify-content:space-between; align-items:center; padding: 4px 34px 0; font-size: 16px; font-weight: 600; z-index: 25; }
  .w3 .stat .bat { width: 26px; height: 12px; border: 1.5px solid #000; border-radius: 4px; position:relative; } .w3 .stat .bat i { position:absolute; inset: 1.5px; right: 5px; background:#000; border-radius: 2px; }
  .w3 .vp { position:absolute; top:${SB}px; left:0; width:${SW}px; height:${VH}px; overflow:hidden; background:#fff; }
  .w3 .vp img { position:absolute; left:0; top:0; width:${SW}px; display:block; }
  .w3 .layer { position:absolute; inset:0; }
  .w3 .saf { position:absolute; left:0; right:0; bottom:0; height:${SAF}px; background: rgba(248,248,250,.97); border-top: 1px solid #e3e3e6; z-index: 25; }
  .w3 .saf .url { position:absolute; left: 16px; right: 16px; top: 9px; height: 38px; border-radius: 12px; background:#e9e9ec; display:flex; align-items:center; justify-content:center; gap: 6px; font-size: 15px; color:#222; overflow:hidden; }
  .w3 .saf .url .pg { position:absolute; left:0; bottom:0; height: 3px; background:#0a84ff; }
  .w3 .saf .home { position:absolute; bottom: 7px; left:50%; width: 130px; height: 5px; margin-left:-65px; border-radius: 3px; background:#111; }
  .w3 .tap { position:absolute; width: 50px; height: 50px; margin:-25px; border-radius:50%; background: rgba(90,90,100,.3); border: 1.5px solid rgba(255,255,255,.85); z-index: 28; }
  .w3 .ring { position:absolute; border: 2.5px solid var(--tq); border-radius: 10px; box-shadow: 0 0 0 4px rgba(92,225,230,.25); z-index: 27; }
  /* iOS search page + keyboard */
  .w3 .srch { position:absolute; inset:0; background:#f2f2f7; }
  .w3 .srch h2 { margin: 18px 20px 12px; font-size: 32px; font-weight: 800; letter-spacing:-.02em; }
  .w3 .srch .fld { margin: 0 16px; height: 40px; border-radius: 11px; background:#e3e3e8; display:flex; align-items:center; padding: 0 12px; gap: 8px; font-size: 17px; color:#111; }
  .w3 .srch .fld .ph { color:#8e8e93; }
  .w3 .srch .caret { width: 2px; height: 20px; background:#0a84ff; }
  .w3 .srch .sug { margin: 16px 16px 0; background:#fff; border-radius: 14px; overflow:hidden; }
  .w3 .srch .sug div { display:flex; align-items:center; gap: 12px; padding: 12px 14px; border-bottom: 1px solid #eee; font-size: 16px; }
  .w3 .srch .sug img { position: static; width: 40px; height: 40px; border-radius: 10px; object-fit: contain; background:#fff; border: 1px solid #eee; }
  .w3 .srch .sug small { display:block; color:#8e8e93; font-size: 13px; }
  .w3 .srch .sug .q { width: 40px; text-align:center; color:#8e8e93; }
  .w3 .kb { position:absolute; left:0; right:0; bottom: 0; height: 290px; background:#d1d3d9; padding: 8px 3px 0; }
  .w3 .kb .r { display:flex; justify-content:center; gap: 6px; margin-bottom: 11px; }
  .w3 .kb .k { width: 33px; height: 44px; border-radius: 6px; background:#fff; box-shadow: 0 1px 0 #8a8a8e; display:grid; place-items:center; font-size: 22px; position:relative; }
  .w3 .kb .k.wide { width: 86px; font-size: 16px; background:#abb0ba; } .w3 .kb .k.sp { width: 180px; font-size: 16px; } .w3 .kb .k.go { width: 86px; background:#0a84ff; color:#fff; font-size: 16px; }
  .w3 .kb .k.on::after { content: attr(data-c); position:absolute; bottom: 36px; left: -8px; width: 49px; height: 56px; border-radius: 10px; background:#fff; box-shadow: 0 2px 6px rgba(0,0,0,.25); display:grid; place-items:center; font-size: 30px; }

  /* final bento */
  .w3 .bento { position:absolute; inset:0; z-index: 7; }
  .w3 .bt { position:absolute; border-radius: 46px; background: linear-gradient(160deg,#ffffff,#eef0f3); box-shadow: 0 30px 60px rgba(40,44,60,.16); overflow:hidden; }
  .w3 .bt.k { background: linear-gradient(160deg,#1c1d22,#0c0c0f); color:#fff; }
  .w3 .bt .in { position:absolute; inset:0; padding: 26px 28px; display:flex; flex-direction:column; justify-content:center; }
  .w3 .bt .big { font-size: 84px; font-weight: 700; letter-spacing:-.04em; line-height:1; }
  .w3 .bt small { font-size: 22px; color:#7d828d; font-weight: 600; } .w3 .bt.k small { color: rgba(255,255,255,.55); }
  .w3 .bt b { font-size: 30px; letter-spacing:-.02em; line-height:1.15; }
  .w3 .bt .stars { color:#00b67a; font-size: 30px; letter-spacing: 3px; margin: 6px 0; }
  .w3 .bt .jt { position:absolute; inset: 8%; background-size: contain; background-repeat:no-repeat; background-position:center; filter: drop-shadow(0 14px 14px rgba(0,0,0,.18)); }
  .w3 .bt s { color: rgba(255,255,255,.45); font-size: 28px; } .w3 .bt .tq { color: var(--tq); }
  .w3 .bt ul { list-style:none; margin: 10px 0 0; padding:0; font-size: 22px; line-height: 1.75; font-weight: 600; } .w3 .bt li::before { content:'✓'; color: var(--ink); margin-right: 10px; font-weight: 800; }
  .w3 .bt li.free { color: var(--ink); }

  .w3 .dots { position:absolute; left:50%; top: 50%; display:flex; gap: 22px; transform: translate(-50%,-50%); z-index: 20; }
  .w3 .dots i { width: 30px; height: 30px; border-radius: 50%; background: var(--ink); display:block; }
  .w3 .end { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; z-index: 21; }
  .w3 .end img { width: 680px; }
  .w3 .end .tg { margin-top: 30px; font-size: 34px; color:#5d626c; font-weight: 500; }
  `;

  SCENES.troiscoups = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const W3 = h('div', 'w3', root), world = h('div', 'world', W3), wall = h('div', 'wall', world), fog = h('div', 'fog', W3);
    const B = s.beats;

    // ---------- tile wall
    const T = [];
    const tile = (x, y, w, hh, k, html = '') => { const el = h('div', 'tile' + (k ? ' k' : ''), wall, html); Object.assign(el.style, { left: x - w / 2 + 'px', top: y - hh / 2 + 'px', width: w + 'px', height: hh + 'px' }); T.push({ el, d: T.length * .04 }); return el; };
    const clockSvg = `<svg class="clock" viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" fill="#fff"/>${Array.from({ length: 12 }, (_, i) => `<text x="${100 + 76 * Math.sin(i * Math.PI / 6)}" y="${108 - 76 * Math.cos(i * Math.PI / 6)}" font-size="22" font-family="Inter" font-weight="500" text-anchor="middle" fill="#222">${i || 12}</text>`).join('')}<line class="hh" x1="100" y1="100" x2="100" y2="52" stroke="#111" stroke-width="7" stroke-linecap="round"/><line class="mm" x1="100" y1="100" x2="100" y2="30" stroke="#111" stroke-width="5" stroke-linecap="round"/><line class="ss" x1="100" y1="112" x2="100" y2="26" stroke="#12b5c0" stroke-width="2.5"/><circle cx="100" cy="100" r="6" fill="#12b5c0"/></svg>`;
    const tClock = tile(-330, -330, 420, 420, 0, clockSvg);
    tile(140, -330, 400, 420, 1, `<div class="cal"><div class="d">JEUDI</div><div class="n">24</div><div class="m">décembre</div></div>`);
    tile(-330, 160, 420, 420, 0, `<div class="cd"><small>NOËL DANS</small><b>21 j</b><i>aucun cadeau trouvé</i></div>`);
    const tChat = tile(170, 140, 480, 420, 1, `<div class="chat"><div class="hd"><div class="av"><span style="background:#a50044">F</span><span style="background:#1b3a8a">P</span><span style="background:#e9e9e9;color:#111">L</span></div>La famille<small>maintenant</small></div>
      <div class="row"><span class="b">On offre quoi à Noël ?</span></div><div class="row"><span class="b">Un maillot de foot 🙏</span></div><div class="row r"><span class="b">Je m'en occupe</span></div></div>`);
    tile(640, -330, 440, 420, 1); tile(-820, -330, 400, 420, 1); tile(660, 150, 420, 420, 0); tile(-820, 160, 380, 420, 1);
    tile(-330, 650, 420, 420, 1); tile(170, 650, 480, 420, 0); tile(660, 650, 420, 420, 1); tile(-820, 650, 380, 420, 0);
    tile(-330, -820, 420, 420, 0); tile(170, -820, 480, 420, 1); tile(660, -820, 420, 420, 0);
    tile(-330, 1140, 420, 420, 0); tile(170, 1140, 480, 420, 1); tile(660, 1140, 420, 420, 0);
    const bubbles = [...tChat.querySelectorAll('.row')], hands = { h: tClock.querySelector('.hh'), m: tClock.querySelector('.mm'), s: tClock.querySelector('.ss') };

    // ---------- phone
    const iph = h('div', 'iph', W3), scr = h('div', 'scr', iph);
    h('div', 'isl', scr); h('div', 'stat', scr, '<span>20:41</span><span class="bat"><i></i></span>');
    const vp = h('div', 'vp', scr), L = {};
    const lay = (k, src) => { const d = h('div', 'layer', vp), im = h('img', '', d); im.src = IMG('site/' + src); L[k] = { d, im }; };
    lay('home', 'home-scroll.jpg'); lay('pp', 'product-top.jpg'); lay('pps', 'product-size.jpg'); lay('c1', 'cart-1.jpg'); lay('c4', 'cart-4.jpg');
    // iOS search page with the keyboard (drawn) on top of the site layers until the site opens
    const query = s.query || 'elite maillot';
    const srch = h('div', 'srch', vp, `<h2>Rechercher</h2><div class="fld">🔍 <span class="tx"></span><span class="caret"></span><span class="ph">Rechercher ou saisir un site</span></div>
      <div class="sug"><div class="hit"><img src="${IMG('img/logo.png')}"><span><b>ÉLITE MAILLOT</b><small>elite-maillot.fr</small></span></div><div><span class="q">🔍</span>elite maillot avis</div><div><span class="q">🔍</span>elite maillot noël</div></div>`);
    const rows = ['azertyuiop', 'qsdfghjklm', 'wxcvbn'];
    const kb = h('div', 'kb', srch, rows.map((r, i) => `<div class="r">${i === 2 ? '<span class="k wide">⇧</span>' : ''}${[...r].map(c => `<span class="k" data-c="${c}">${c.toUpperCase()}</span>`).join('')}${i === 2 ? '<span class="k wide">⌫</span>' : ''}</div>`).join('') + `<div class="r"><span class="k wide">123</span><span class="k wide">🙂</span><span class="k sp" data-c=" ">espace</span><span class="k go">aller</span></div>`);
    const keys = {}; kb.querySelectorAll('.k[data-c]').forEach(k => { keys[k.dataset.c] = k; });
    const tx = srch.querySelector('.tx'), ph = srch.querySelector('.ph'), sug = srch.querySelector('.sug'), hit = srch.querySelector('.hit');
    const saf = h('div', 'saf', scr, `<div class="url"><span class="u">🔍 Rechercher</span><i class="pg"></i></div><div class="home"></div>`);
    const url = saf.querySelector('.u'), pg = saf.querySelector('.pg');
    const tap = h('div', 'tap', scr), ring = h('div', 'ring', scr);

    // ---------- final bento (screen px)
    const bento = h('div', 'bento', W3);
    const bt = (x, y, w, hh, k, html) => { const el = h('div', 'bt' + (k ? ' k' : ''), bento, html); Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px' }); return el; };
    const BT = [
      bt(40, 760, 300, 300, 0, `<div class="in"><small>Trustpilot</small><div class="big">4,1</div><div class="stars">★★★★★</div><small>avis clients</small></div>`),
      bt(40, 1090, 300, 330, 0, `<div class="jt" style="background-image:url(${IMG('img/barca.png')})"></div>`),
      bt(40, 1450, 300, 260, 1, `<div class="in"><span style="font-size:44px">🚚</span><b>Livraison offerte</b><small>dès 2 maillots</small></div>`),
      bt(740, 760, 300, 300, 1, `<div class="in"><small>Total · 4 maillots</small><div class="big tq">59,97€</div><s>79,96€</s></div>`),
      bt(740, 1090, 300, 330, 0, `<div class="jt" style="background-image:url(${IMG('img/france.png')})"></div>`),
      bt(740, 1450, 300, 260, 0, `<div class="in"><b>Votre panier</b><ul><li>Barça</li><li>France</li><li>Real</li><li class="free">City · offert</li></ul></div>`),
      bt(40, 300, 300, 300, 0, `<svg class="clock" viewBox="0 0 200 200" style="position:absolute;inset:9%">${clockSvg.replace(/^<svg[^>]*>/, '').replace('</svg>', '')}</svg>`),
      bt(370, 300, 340, 300, 1, `<div class="in"><small style="color:#5ce1e6;font-weight:800">JEUDI</small><div class="big">24</div><small>décembre</small></div>`),
      bt(740, 300, 300, 300, 0, `<div class="jt" style="background-image:url(${IMG('img/real.png')})"></div>`),
    ];

    // ---------- headlines
    const HL = s.headlines.map(x => { const w = wordsEl(W3, x.text, ''); w.box.className = 'hl'; if (x.y) w.box.style.top = x.y + 'px'; return { w, ...x }; });

    const dots = h('div', 'dots', W3, '<i></i><i></i><i></i>');
    const end = h('div', 'end', W3, `<img src="${IMG('img/logo.png')}"><div class="tg">${esc(s.tagline || '')}</div>`);
    const endImg = end.querySelector('img'), endTg = end.querySelector('.tg');
    const P = (x, y) => [x, SB + y];
    let lastZ = null;

    return t => {
      // ----- wall camera: assembles tilted, pushes to the chat, flattens behind the phone, recedes for the bento
      const cam = kf(t, [[0, [0, 80, .8, 22, -9]], [B.chat - .3, [0, 10, .92, 18, -7]], [B.phone - .4, [-60, -40, 1.0, 14, -6]], [B.phone + .8, [0, 200, 1.05, 0, 0]], [B.bento - .4, [0, 200, 1.05, 0, 0]], [B.bento + .6, [0, 200, .9, 0, 0]], [s.duration, [0, 200, .88, 0, 0]]]);
      wall.style.transform = `translate(${cam[0]}px, ${cam[1]}px) rotateX(${cam[3]}deg) rotateZ(${cam[4]}deg) scale(${cam[2]})`;
      T.forEach(o => { const k = prog(t, o.d, .9, E.outQuint); o.el.style.opacity = k; o.el.style.transform = `translateZ(${(1 - k) * -400}px) scale(${lerp(.85, 1, k)})`; });
      const sec = 41 * 60 + t * 6; hands.s.setAttribute('transform', `rotate(${(t * 120) % 360} 100 100)`); hands.m.setAttribute('transform', `rotate(${sec / 10} 100 100)`); hands.h.setAttribute('transform', `rotate(${240 + sec / 120} 100 100)`);
      bubbles.forEach((b, i) => { const k = prog(t, B.chat + .1 + i * .55, .4, E.back); b.style.opacity = clamp(k * 2); b.style.transform = `translateY(${(1 - k) * 24}px) scale(${lerp(.8, 1, k)})`; });
      const wallBlur = kf(t, [[B.phone + .2, 0], [B.phone + 1, 6], [B.bento - .4, 6], [B.bento + .4, 14], [B.end - .3, 14], [B.end + .4, 30]]);
      world.style.filter = wallBlur > .05 ? `blur(${wallBlur}px)` : 'none';
      world.style.opacity = 1 - prog(t, B.bento - .1, .5) * .6;

      // ----- camera on the phone: rise, hold, fast zoom (motion blur) on the proof, pull back to the bento
      const zp = (x, y, z) => { const [sx, sy] = P(x, y); return [540 - PW / 2 + 14 + sx * K, PTOP + 14 + sy * K, z]; };
      const Z = kf(t, [[B.zoom - .05, [540, 1200, 1]], [B.zoom + .45, zp(300, 300, 1.75)], [B.bento - .5, zp(300, 300, 1.75)], [B.bento + .5, [540, 1200, .44]], [s.duration, [540, 1200, .43]]], E.inOut);
      const rise = kf(t, [[B.phone - .2, 1500], [B.phone + .7, 0]], E.outQuint);
      // zoom about the stage point (Z0, Z1), drawn toward the centre while zoomed in
      const pull = clamp((Z[2] - 1) * 1.1), cx = lerp(Z[0], 540, pull), cy = lerp(Z[1], 1150, pull), ox = 540 - PW / 2;
      const ax = cx + Z[2] * (ox - Z[0]) - ox, ay = cy + Z[2] * (PTOP + rise - Z[1]);
      iph.style.transformOrigin = '0 0'; iph.style.transform = `translate(${ax}px, ${ay}px) scale(${Z[2]})`;
      // motion blur while the zoom moves fast
      const zSpeed = lastZ && Math.abs(t - lastZ.t) < .1 ? Math.abs(Z[2] - lastZ.z) / Math.abs(t - lastZ.t || 1) : 0; lastZ = { z: Z[2], t };
      iph.style.filter = `${zSpeed > .6 ? `blur(${Math.min(7, zSpeed * 2.5)}px)` : ''}${t > B.end - .3 ? ` blur(${prog(t, B.end - .3, .6) * 26}px)` : ''}` || 'none';
      iph.style.opacity = t < B.phone - .25 ? 0 : 1 - prog(t, B.end + .2, .4);

      // ----- inside the screen
      const typeAt = B.phone + .6, cps = 9, typed = Math.floor(clamp((t - typeAt) * cps, 0, query.length));
      tx.textContent = query.slice(0, typed); ph.style.display = typed ? 'none' : ''; sug.style.opacity = typed >= 5 ? 1 : 0;
      Object.values(keys).forEach(k => k.classList.remove('on'));
      if (typed > 0 && typed < query.length + 1 && t - typeAt - typed / cps > -.07 && t < typeAt + query.length / cps + .05) { const c = query[typed - 1]; keys[c] && keys[c].classList.add('on'); }
      const tapHit = typeAt + query.length / cps + .45, open = tapHit + .15;
      hit.style.background = t > tapHit - .1 && t < open + .2 ? '#e8e8ed' : '';
      srch.style.opacity = 1 - prog(t, open + .15, .25);
      url.textContent = t < open ? '🔍 Rechercher' : '🔒 elite-maillot.fr';
      pg.style.width = (t > open ? Math.min(100, prog(t, open, .8, E.out) * 100) : 0) + '%'; pg.style.opacity = 1 - prog(t, open + .8, .2);
      L.home.d.style.opacity = prog(t, open + .25, .45);
      L.home.im.style.transform = `translateY(${-kf(t, [[B.choose, 0], [B.choose + 1.3, 1650]], E.inOut)}px)`;
      const tapCard = B.choose + 1.55, tapAtc = B.add + .9;
      const ppIn = prog(t, tapCard + .1, .4, E.outQuint); L.pp.d.style.transform = `translateX(${(1 - ppIn) * 100}%)`; L.pp.d.style.opacity = t > tapCard ? 1 : 0;
      L.pp.im.style.transform = `translateY(${-kf(t, [[B.add, 0], [tapAtc - .4, 650]], E.inOut)}px)`;
      L.pps.d.style.display = t > tapAtc - .45 ? '' : 'none'; L.pps.d.style.opacity = prog(t, tapAtc - .45, .12);
      const c1 = prog(t, tapAtc + .2, .4, E.outQuint); L.c1.d.style.transform = `translateX(${(1 - c1) * 100}%)`; L.c1.d.style.opacity = t > tapAtc + .15 ? 1 : 0;
      L.c4.d.style.opacity = prog(t, B.four - .1, .3);
      const tp = at => clamp((t - at + .2) / .2) * (1 - clamp((t - at - .15) / .25));
      const T1 = tp(tapHit), T2 = tp(tapCard), T3 = tp(tapAtc), m = Math.max(T1, T2, T3);
      const pt = T1 === m ? P(150, 150) : T2 === m ? P(287, 557) : P(195, 494);
      tap.style.opacity = m; tap.style.left = pt[0] + 'px'; tap.style.top = pt[1] + 'px'; tap.style.transform = `scale(${lerp(1.5, .85, m)})`;
      const ro = win(t, B.zoom + .5, B.bento - .5, .3, .25);
      ring.style.opacity = ro; Object.assign(ring.style, { left: '228px', top: SB + 254 + 'px', width: '150px', height: '78px', transform: `scale(${lerp(1.15, 1, ro)})` });

      // ----- bento
      BT.forEach((el, i) => { const k = win(t, B.bento + .1 + i * .06, B.end + .2, .6, .5); el.style.opacity = k; el.style.transform = `translateY(${(1 - prog(t, B.bento + .1 + i * .06, .7, E.outQuint)) * 120}px) scale(${lerp(.9, 1, k)})`; el.style.filter = t > B.end - .3 ? `blur(${prog(t, B.end - .3, .6) * 26}px)` : 'none'; });

      // ----- headlines (centred, words out of a blur)
      HL.forEach(x => { const k = win(t, x.at - .05, x.out, .05, .35); x.w.box.style.opacity = k; x.w.box.style.filter = k < 1 && t > x.at + .3 ? `blur(${(1 - k) * 12}px)` : 'none'; x.w.box.style.display = t < x.at - .1 || t > x.out + .05 ? 'none' : ''; wordsAt(x.w, t, x.at, x.stagger || .11, .55); });
      fog.style.opacity = 1 - prog(t, B.bento - .2, .4);

      // ----- end: three dots, then the logo
      const dk = win(t, B.end + .1, B.end + 1.1, .25, .3); dots.style.opacity = dk;
      [...dots.children].forEach((d, i) => { d.style.transform = `translateY(${Math.sin((t - B.end) * 9 - i * .8) * 10}px)`; });
      const ek = prog(t, B.end + 1.05, .7, E.outQuint); end.style.opacity = ek; endImg.style.transform = `scale(${lerp(.9, 1, ek)})`; endImg.style.filter = ek < 1 ? `blur(${(1 - ek) * 14}px)` : 'none';
      const tg = prog(t, B.end + 1.5, .5); endTg.style.opacity = tg; endTg.style.transform = `translateY(${(1 - tg) * 16}px)`;
    };
  };
})();
