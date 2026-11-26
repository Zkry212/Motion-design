// Élite Maillot — Noël. One continuous "world" in the Trois Coups style: light studio background, a wall of
// rounded white/black tiles seen in 3D, a headline at the top whose words come out of a blur, an iPhone showing
// the real site (real photos, names, prices, the site's own pack drawer), cut-out jerseys flying out of the screen,
// and the real logo on a blurred end card. Timings follow voiceover.txt (see spec.json "beats").
(() => {
  const { SCENES, h, esc, clamp, lerp, E, prog, wordsEl, wordsAt, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f);

  // keyframes [[t, v], ...] eased in-out between keys; values may be arrays
  const kf = (t, K, ease = E.inOut) => {
    if (t <= K[0][0]) return K[0][1];
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) {
      const [t0, a] = K[i - 1], [t1, b] = K[i], k = ease((t - t0) / (t1 - t0));
      return Array.isArray(a) ? a.map((x, j) => lerp(x, b[j], k)) : lerp(a, b, k);
    }
    return K[K.length - 1][1];
  };
  const on = (t, a, b, fi = .45, fo = .45) => Math.min(prog(t, a, fi, E.out), 1 - prog(t, b - fo, fo, E.inOut));

  const CSS = `
  .w3 { --accent-ink: #12b5c0; position:absolute; inset:0; font-family: Inter, system-ui, sans-serif; color:#1d1f26; }
  .w3 .world { position:absolute; inset:0; perspective: 2600px; }
  .w3 .wall { position:absolute; left:50%; top:50%; width:0; height:0; transform-style: preserve-3d; }
  .w3 .tile { position:absolute; border-radius: 64px; background: linear-gradient(160deg,#ffffff,#eef0f3); box-shadow: 0 2px 0 rgba(255,255,255,.9) inset, 0 40px 70px rgba(40,44,60,.18), 0 8px 18px rgba(40,44,60,.10); overflow:hidden; }
  .w3 .tile.k { background: linear-gradient(160deg,#1c1d22,#0c0c0f); box-shadow: 0 1px 0 rgba(255,255,255,.08) inset, 0 40px 70px rgba(20,22,30,.32); color:#fff; }
  .w3 .clock { position:absolute; inset: 9%; }
  .w3 .cal { position:absolute; inset:0; padding: 34px 38px; }
  .w3 .cal .d { font-size: 30px; font-weight: 800; letter-spacing:.06em; color: var(--accent); }
  .w3 .cal .n { font-size: 200px; font-weight: 600; line-height: .95; letter-spacing:-.04em; margin-top: 8px; }
  .w3 .cal .m { font-size: 28px; color: rgba(255,255,255,.55); }
  .w3 .countdown { position:absolute; inset:0; padding: 34px 38px; }
  .w3 .countdown small { font-size: 26px; color:#8a8f99; font-weight:600; letter-spacing:.04em; }
  .w3 .countdown b { display:block; font-size: 120px; font-weight: 700; letter-spacing:-.04em; margin-top: 12px; }
  .w3 .countdown i { display:block; font-style:normal; font-size: 26px; color: var(--accent-ink); font-weight: 600; }
  .w3 .chat { position:absolute; inset:0; padding: 34px 40px; }
  .w3 .chat .hd { display:flex; align-items:center; gap: 14px; font-size: 32px; font-weight: 600; }
  .w3 .chat .av { display:flex; } .w3 .chat .av span { width: 50px; height: 50px; border-radius: 50%; margin-right: -14px; border: 3px solid #141418; display:grid; place-items:center; font-size: 22px; font-weight: 700; }
  .w3 .chat .hd small { margin-left:auto; font-size: 22px; color: rgba(255,255,255,.45); font-weight: 500; }
  .w3 .chat .b { display:inline-block; margin-top: 18px; padding: 16px 26px; border-radius: 30px; background: rgba(255,255,255,.12); font-size: 32px; font-weight: 500; }
  .w3 .chat .b.r { background: var(--accent-ink); }
  .w3 .chat .row { display:flex; } .w3 .chat .row.r { justify-content:flex-end; }
  .w3 .info { position:absolute; inset:0; padding: 30px 34px; display:flex; flex-direction:column; justify-content:center; gap: 8px; }
  .w3 .info .ic { font-size: 50px; }
  .w3 .info b { font-size: 36px; font-weight: 700; letter-spacing: -.02em; line-height: 1.1; }
  .w3 .info small { font-size: 24px; color:#7d828d; }
  .w3 .tile.k .info small { color: rgba(255,255,255,.55); }
  .w3 .info .bar { height: 10px; border-radius: 5px; background: rgba(255,255,255,.15); margin-top: 10px; overflow:hidden; } .w3 .info .bar i { display:block; height:100%; background: var(--accent); border-radius:5px; }
  .w3 .stars { color: #00b67a; font-size: 34px; letter-spacing: 2px; }
  .w3 .jt { position:absolute; inset: 6%; background-size: contain; background-position: center; background-repeat: no-repeat; filter: drop-shadow(0 18px 18px rgba(0,0,0,.18)); }

  /* headline */
  .w3 .fog { position:absolute; left:0; right:0; top:0; height: 420px; background: linear-gradient(180deg, #f3f4f7 0%, rgba(243,244,247,.92) 45%, rgba(243,244,247,0) 100%); z-index: 2; }
  .w3 .hl { position:absolute; z-index: 10; left: 5%; right: 5%; top: 165px; text-align:center; font-size: 78px; font-weight: 700; letter-spacing: -.035em; line-height:1.06; color:#1f2129; transform: translateY(-50%); }
  .w3 .hl .w { display:inline-block; margin: 0 .12em; }
  .w3 .hl .acc { color: var(--accent-ink); }

  /* phone */
  .w3 .iphone { position:absolute; z-index: 4; left:50%; top:0; width: 600px; height: 1240px; margin-left: -300px; border-radius: 96px; background:#0b0b0d; padding: 16px;
     box-shadow: 0 0 0 3px #b9bcc3, 0 0 0 6px #e6e8ec, 0 0 0 7px #a9adb5, 0 70px 120px rgba(30,34,50,.35), 0 20px 40px rgba(30,34,50,.2); }
  .w3 .scr { position:relative; width:100%; height:100%; border-radius: 82px; overflow:hidden; background:#fff; }
  .w3 .island { position:absolute; top: 20px; left:50%; width: 170px; height: 50px; margin-left: -85px; border-radius: 30px; background:#000; z-index: 20; }
  .w3 .sbar { position:absolute; top: 0; left:0; right:0; height: 88px; display:flex; justify-content:space-between; align-items:center; padding: 8px 54px 0; font-size: 26px; font-weight: 600; z-index: 15; color:#000; background:#fff; }
  .w3 .page { position:absolute; left:0; right:0; top: 88px; }
  .w3 .ann { background:#000; color:#fff; font-size: 19px; text-align:center; padding: 12px 0; white-space:nowrap; overflow:hidden; font-weight: 500; }
  .w3 .hdr { display:flex; align-items:center; justify-content:space-between; padding: 14px 26px; border-bottom: 1px solid #eee; }
  .w3 .hdr img { height: 74px; }
  .w3 .ico { width: 40px; height: 40px; position:relative; }
  .w3 .ico svg { width:100%; height:100%; }
  .w3 .badge { position:absolute; right: -10px; top: -8px; min-width: 26px; height: 26px; border-radius: 13px; background: #C4301C; color:#fff; font-size: 16px; font-weight: 700; display:grid; place-items:center; }
  .w3 .sec { padding: 26px 26px 10px; font-size: 30px; font-weight: 800; letter-spacing: -.02em; line-height:1.15; }
  .w3 .sec small { display:block; font-size: 18px; font-weight: 600; color:#C4301C; letter-spacing: .1em; margin-bottom: 6px; }
  .w3 .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 18px 14px; padding: 8px 22px; }
  .w3 .card img { width:100%; aspect-ratio: 1; object-fit: cover; display:block; border-radius: 8px; }
  .w3 .card b { display:block; font-size: 19px; font-weight: 600; margin-top: 10px; line-height:1.2; }
  .w3 .card span { display:block; font-size: 20px; color:#C4301C; font-weight: 700; margin-top: 4px; }
  .w3 .pp { position:absolute; inset: 88px 0 0 0; background:#fff; }
  .w3 .pp img { width:100%; aspect-ratio:1; object-fit:cover; display:block; }
  .w3 .pp .in { padding: 22px 28px; }
  .w3 .pp h3 { margin:0; font-size: 32px; font-weight: 700; letter-spacing:-.02em; }
  .w3 .pp .pr { font-size: 32px; color:#C4301C; font-weight: 800; margin: 8px 0 4px; }
  .w3 .pp .off { font-size: 20px; color:#555; }
  .w3 .sizes { display:flex; gap: 10px; margin: 18px 0; } .w3 .sizes span { flex:1; text-align:center; border: 1.5px solid #ddd; border-radius: 10px; padding: 12px 0; font-size: 22px; font-weight: 600; }
  .w3 .sizes span.on { border-color:#000; background:#000; color:#fff; }
  .w3 .atc { background:#000; color:#fff; text-align:center; border-radius: 12px; padding: 22px 0; font-size: 24px; font-weight: 700; }
  .w3 .toast { position:absolute; left: 24px; right: 24px; top: 100px; background: rgba(20,20,22,.92); color:#fff; border-radius: 26px; padding: 18px 22px; display:flex; align-items:center; gap: 16px; font-size: 21px; z-index: 12; box-shadow: 0 20px 40px rgba(0,0,0,.3); }
  .w3 .toast img { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; }
  .w3 .toast b { display:block; font-size: 22px; } .w3 .toast small { color: var(--accent); font-weight: 600; font-size: 19px; }
  .w3 .drawer { position:absolute; left:0; right:0; bottom:0; height: 1000px; background:#fff; border-radius: 40px 40px 0 0; box-shadow: 0 -20px 60px rgba(0,0,0,.25); padding: 26px 26px; z-index: 11; }
  .w3 .drawer .gr { width: 90px; height: 8px; border-radius: 4px; background:#ddd; margin: 0 auto 20px; }
  .w3 .drawer h4 { margin: 0 0 16px; font-size: 30px; font-weight: 800; }
  .w3 .pack { background: #f4fbfb; border: 2px solid var(--accent); border-radius: 18px; padding: 16px 18px 20px; margin-bottom: 16px; }
  .w3 .pack .t { font-size: 21px; font-weight: 700; } .w3 .pack .t em { font-style: normal; color: var(--accent-ink); }
  .w3 .pk { position:relative; height: 10px; background:#e3e6ea; border-radius: 5px; margin: 46px 6px 26px; }
  .w3 .pk .f { position:absolute; left:0; top:0; bottom:0; border-radius:5px; background: linear-gradient(90deg, var(--accent), var(--accent-ink)); }
  .w3 .pk .s { position:absolute; top: 50%; transform: translate(-50%,-50%); width: 46px; height: 46px; border-radius: 50%; background:#fff; border: 2px solid #d5d9de; display:grid; place-items:center; font-size: 22px; }
  .w3 .pk .s.on { border-color: var(--accent-ink); box-shadow: 0 0 0 4px rgba(15,181,192,.18); }
  .w3 .pk .s em { position:absolute; top: 52px; white-space:nowrap; font-style:normal; font-size: 15px; color:#666; font-weight:600; }
  .w3 .ln { display:flex; align-items:center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 20px; }
  .w3 .ln img { width: 84px; height: 84px; border-radius: 10px; object-fit: cover; }
  .w3 .ln b { display:block; font-size: 20px; font-weight: 600; } .w3 .ln small { color:#888; font-size: 17px; }
  .w3 .ln .p { margin-left:auto; font-weight: 700; color:#111; white-space:nowrap; } .w3 .ln .p.free { color: var(--accent-ink); }
  .w3 .tot { display:flex; justify-content:space-between; align-items:baseline; font-size: 24px; font-weight: 700; margin: 18px 0 14px; }
  .w3 .tot s { color:#999; font-weight: 500; font-size: 21px; margin-right: 10px; } .w3 .tot .v { font-size: 34px; }
  .w3 .touch { position:absolute; width: 90px; height: 90px; margin: -45px; border-radius: 50%; background: rgba(120,120,130,.35); border: 2px solid rgba(255,255,255,.7); z-index: 30; }
  .w3 .fly { position:absolute; z-index: 6; left:0; top:0; width: 420px; height: 420px; background-size: contain; background-position: center; background-repeat:no-repeat; filter: drop-shadow(0 40px 40px rgba(30,34,50,.28)); }
  .w3 .fly .tag { position:absolute; left: 50%; bottom: -10px; transform: translateX(-50%); background:#fff; color:#1d1f26; border-radius: 30px; padding: 10px 22px; font-size: 26px; font-weight: 700; white-space:nowrap; box-shadow: 0 10px 30px rgba(0,0,0,.12); }
  .w3 .fly .tag.free { background: var(--accent-ink); color:#fff; }

  /* end card */
  .w3 .end { position:absolute; z-index: 20; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .w3 .end img { width: 640px; }
  .w3 .end .tg { margin-top: 34px; font-size: 40px; font-weight: 700; letter-spacing:-.02em; color:#1f2129; }
  .w3 .end .tg span { color: var(--accent-ink); }
  .w3 .end .pill { margin-top: 28px; background:#fff; border-radius: 40px; padding: 16px 34px; font-size: 30px; font-weight: 600; box-shadow: 0 14px 40px rgba(30,34,50,.14); }
  `;

  SCENES.troiscoups = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const W3 = h('div', 'w3', root), world = h('div', 'world', W3), wall = h('div', 'wall', world), fog = h('div', 'fog', W3);
    const B = s.beats;

    // ---------- the tile wall (wall coordinates, px, centred on the screen)
    const T = [];
    const tile = (x, y, w, hh, k, html = '', z = 0) => { const el = h('div', 'tile' + (k ? ' k' : ''), wall, html); Object.assign(el.style, { left: x - w / 2 + 'px', top: y - hh / 2 + 'px', width: w + 'px', height: hh + 'px' }); const o = { el, x, y, z, w, hh, d: T.length * .045 }; T.push(o); return o; };
    const clockSvg = `<svg class="clock" viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" fill="#fff"/>${Array.from({ length: 12 }, (_, i) => `<text x="${100 + 76 * Math.sin(i * Math.PI / 6)}" y="${108 - 76 * Math.cos(i * Math.PI / 6)}" font-size="22" font-family="Inter" font-weight="500" text-anchor="middle" fill="#222">${i || 12}</text>`).join('')}<line class="hh" x1="100" y1="100" x2="100" y2="52" stroke="#111" stroke-width="7" stroke-linecap="round"/><line class="mm" x1="100" y1="100" x2="100" y2="30" stroke="#111" stroke-width="5" stroke-linecap="round"/><line class="ss" x1="100" y1="112" x2="100" y2="26" stroke="var(--accent-ink)" stroke-width="2.5"/><circle cx="100" cy="100" r="6" fill="var(--accent-ink)"/></svg>`;
    const tClock = tile(-330, -330, 420, 420, 0, clockSvg);
    const tCal = tile(140, -330, 400, 420, 1, `<div class="cal"><div class="d">JEUDI</div><div class="n">24</div><div class="m">décembre</div></div>`);
    const tCount = tile(-330, 160, 420, 420, 0, `<div class="countdown"><small>NOËL DANS</small><b>21 j</b><i>et toujours aucun cadeau</i></div>`);
    const tChat = tile(170, 140, 480, 420, 1, `<div class="chat"><div class="hd"><div class="av"><span style="background:#a50044">F</span><span style="background:#1b3a8a">P</span><span style="background:#e9e9e9;color:#111">L</span></div>La famille<small>maintenant</small></div>
      <div class="row"><span class="b">Moi le Barça 🙏</span></div><div class="row"><span class="b">La France, évidemment</span></div><div class="row"><span class="b">Real Madrid !!!</span></div></div>`);
    tile(640, -330, 440, 420, 1); tile(-820, -330, 400, 420, 1); tile(660, 150, 420, 420, 0); tile(-820, 160, 380, 420, 1);
    tile(-330, 650, 420, 420, 1); tile(170, 650, 480, 420, 0); tile(660, 650, 420, 420, 1); tile(-330, -820, 420, 420, 0); tile(170, -820, 480, 420, 1); tile(660, -820, 420, 420, 0);
    const bubbles = [...tChat.el.querySelectorAll('.row')], hands = { h: tClock.el.querySelector('.hh'), m: tClock.el.querySelector('.mm'), s: tClock.el.querySelector('.ss') };

    // ---------- info tiles for the "livré chez vous" beat (screen space, right of the phone)
    const infoBox = h('div', '', W3); Object.assign(infoBox.style, { position: 'absolute', inset: 0, zIndex: 5 });
    const info = (y, k, html) => { const el = h('div', 'tile' + (k ? ' k' : ''), infoBox, `<div class="info">${html}</div>`); Object.assign(el.style, { left: '590px', top: y + 'px', width: '440px', height: '270px', borderRadius: '52px' }); return el; };
    const I = [
      info(560, 0, `<span class="ic">🚚</span><b>Livraison offerte</b><small>dès 2 maillots achetés</small>`),
      info(860, 1, `<span class="ic">📦</span><b>Suivi de colis</b><small>Expédié · en route</small><div class="bar"><i style="width:64%"></i></div>`),
      info(1160, 0, `<span class="ic">↩️</span><b>Échange et retours gratuits</b>`),
      info(1460, 0, `<span class="stars">★★★★★</span><b>Noté 4,1 sur Trustpilot</b>`),
    ];

    // ---------- phone with the real site
    const prods = s.products;
    const phone = h('div', 'iphone', W3), scr = h('div', 'scr', phone);
    h('div', 'island', scr); h('div', 'sbar', scr, `<span>20:41</span><span>●●● ▮</span>`);
    const cartIco = `<div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="badge">0</span></div>`;
    const page = h('div', 'page', scr, `<div class="ann">Livraison offerte à partir de 2 maillots achetés &nbsp;•&nbsp; 3 maillots achetés = 1 offert</div>
      <div class="hdr"><div class="ico"><svg viewBox="0 0 24 24" stroke="#000" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg></div><img src="${IMG('logo.png')}">${cartIco}</div>
      <div class="sec"><small>SAISON 26/27</small>Les maillots les plus demandés du moment !</div>
      <div class="grid">${prods.map(p => `<div class="card"><img src="${IMG(p.photo)}"><b>${esc(p.name)}</b><span>${esc(p.price)}</span></div>`).join('')}</div>`);
    const badge = page.querySelector('.badge'), cards = [...page.querySelectorAll('.card')];
    const P0 = prods[0];
    const pp = h('div', 'pp', scr, `<img src="${IMG(P0.photo)}"><div class="in"><h3>${esc(P0.name)}</h3><div class="pr">${esc(P0.price)}</div><div class="off">3 achetés = 1 offert · s'applique automatiquement</div>
      <div class="sizes"><span>S</span><span class="on">M</span><span>L</span><span>XL</span><span>2XL</span></div><div class="atc">Ajouter au panier</div></div>`);
    const atc = pp.querySelector('.atc');
    const toast = h('div', 'toast', scr), drawer = h('div', 'drawer', scr, `<div class="gr"></div><h4>Votre panier (4)</h4>
      <div class="pack"><div class="t">🎁 Offre Pack - <em>Débloqué</em></div><div class="pk"><i class="f"></i>
        <span class="s" style="left:25%">🚚<em>Livraison offerte</em></span><span class="s" style="left:50%">🎁<em>1 maillot offert</em></span><span class="s" style="left:100%">🎁<em>2 offerts</em></span></div></div>
      ${s.cart.map(c => `<div class="ln"><img src="${IMG(c.photo)}"><div><b>${esc(c.name)}</b><small>Taille ${esc(c.size || 'M')}</small></div><span class="p${c.free ? ' free' : ''}">${c.free ? 'OFFERT' : esc(c.price)}</span></div>`).join('')}
      <div class="tot"><span>Total estimé</span><span><s>79,96€</s><span class="v">59,97€</span></span></div><div class="atc">Passer à la caisse</div>`);
    const pkFill = drawer.querySelector('.f'), pkSteps = [...drawer.querySelectorAll('.s')], lines = [...drawer.querySelectorAll('.ln')];
    const touch = h('div', 'touch', scr);

    // ---------- cut-out jerseys that fly out of the screen
    const flyers = s.flyers.map(f => { const el = h('div', 'fly', W3, f.tag ? `<span class="tag${f.free ? ' free' : ''}">${esc(f.tag)}</span>` : ''); el.style.backgroundImage = `url(${IMG(f.img)})`; return { el, ...f }; });

    // ---------- headlines
    const HL = s.headlines.map(x => { const w = wordsEl(W3, x.text, ''); w.box.className = 'hl'; if (x.y) w.box.style.top = x.y + 'px'; return { w, ...x }; });

    // ---------- end card
    const end = h('div', 'end', W3, `<img src="${IMG('logo.png')}"><div class="tg">3 achetés = <span>1 offert</span></div><div class="pill">elite-maillot.fr · @elite.maillot</div>`);
    const endImg = end.querySelector('img'), endTg = end.querySelector('.tg'), endPill = end.querySelector('.pill');

    return t => {
      // camera on the wall: assemble, push to the chat, recede behind the phone, come back for the finale
      const cam = kf(t, [[0, [0, 60, .78, 22, -9]], [B.chat - .2, [0, 0, .92, 18, -7]], [B.open - .3, [-120, -60, 1.05, 14, -6]], [B.open + .9, [0, 0, .82, 24, -10]], [B.final - .4, [0, 80, .78, 26, -10]], [B.final + 1.2, [0, 140, .7, 22, -8]], [s.duration, [0, 150, .68, 22, -8]]]);
      wall.style.transform = `translate(${cam[0]}px, ${cam[1]}px) rotateX(${cam[3]}deg) rotateZ(${cam[4]}deg) scale(${cam[2]})`;
      T.forEach(o => { const k = prog(t, o.d, .9, E.outQuint); o.el.style.opacity = k; o.el.style.transform = `translateZ(${(1 - k) * -400}px) scale(${lerp(.85, 1, k)})`; });
      // wall goes soft behind the phone (depth of field), sharp again for the finale
      const dof = Math.max(0, kf(t, [[B.open - .2, 0], [B.open + .6, 9], [B.final - .5, 9], [B.final + .3, 3], [B.end - .3, 3], [B.end + .6, 30]]));
      world.style.filter = dof > .05 ? `blur(${dof}px)` : 'none';
      // clock runs (20:4x), chat bubbles land on the voice
      const sec = 41 * 60 + t * 6; hands.s.setAttribute('transform', `rotate(${(t * 360 / 3) % 360} 100 100)`); hands.m.setAttribute('transform', `rotate(${sec / 10} 100 100)`); hands.h.setAttribute('transform', `rotate(${240 + sec / 120} 100 100)`);
      bubbles.forEach((b, i) => { const k = prog(t, B.chat + .15 + i * .42, .4, E.back); b.style.opacity = clamp(k * 2); b.style.transform = `translateY(${(1 - k) * 24}px) scale(${lerp(.8, 1, k)})`; b.style.transformOrigin = 'left center'; });

      // phone: rises at "open", slides left for the delivery tiles, centre & smaller for the finale, blurs at the end
      const ph = kf(t, [[B.open - .5, [0, 2000, 1, 6]], [B.open + .5, [0, 560, 1, 0]], [B.deliver - .2, [0, 560, 1, 0]], [B.deliver + .5, [-250, 600, .86, 0]], [B.final - .3, [-250, 600, .86, 0]], [B.final + .6, [0, 640, .62, 0]], [s.duration, [0, 650, .6, 0]]], E.outQuint);
      phone.style.transform = `translate(${ph[0]}px, ${ph[1]}px) scale(${ph[2]}) rotate(${ph[3]}deg)`; phone.style.transformOrigin = '50% 0';
      phone.style.opacity = 1 - prog(t, B.end - .2, .5); phone.style.filter = t > B.end - .3 ? `blur(${prog(t, B.end - .3, .6) * 20}px)` : 'none';
      // inside the phone: home scrolls, tap on the first card, product page, add to cart, toasts, drawer
      page.style.transform = `translateY(${-kf(t, [[B.open + .5, 0], [B.choose + .6, 330]], E.inOut)}px)`;
      const tapAt = B.choose + .9; const tp = clamp((t - tapAt + .25) / .25) * (1 - clamp((t - tapAt - .2) / .2));
      const tapAt2 = B.choose + 1.9; const tp2 = clamp((t - tapAt2 + .25) / .25) * (1 - clamp((t - tapAt2 - .2) / .2));
      const tpp = Math.max(tp, tp2); touch.style.opacity = tpp; touch.style.transform = `scale(${lerp(1.4, .8, tpp)})`;
      if (t < tapAt2 + .3) { touch.style.left = (t < tapAt + .3 ? 150 : 284) + 'px'; touch.style.top = (t < tapAt + .3 ? 520 : 1000) + 'px'; }
      const ppk = prog(t, tapAt + .1, .45, E.outQuint) * (1 - prog(t, B.offer - .2, .4)); pp.style.opacity = ppk; pp.style.transform = `translateX(${(1 - ppk) * 100}%)`;
      atc.style.transform = `scale(${1 - tp2 * .05})`;
      const added = prods.slice(0, 3).filter((_, i) => t >= B.items[i]).length + (t >= B.offer + .6 ? 1 : 0); badge.textContent = added;
      // toasts: one per item named by the voice
      const ti = B.items.findLastIndex(x => t >= x); const tk = ti < 0 ? 0 : on(t, B.items[ti], B.items[ti] + .75, .18, .2);
      if (ti >= 0) { const c = s.cart[ti]; if (toast.dataset.i != ti) { toast.innerHTML = `<img src="${IMG(c.photo)}"><div><b>${esc(c.name)}</b><small>✓ Ajouté au panier</small></div>`; toast.dataset.i = ti; } }
      toast.style.opacity = tk; toast.style.transform = `translateY(${(1 - tk) * -40}px)`;
      cards.forEach((c, i) => { c.style.transform = `scale(${i === 0 ? 1 - tp * .04 : 1})`; });
      const dk = prog(t, B.offer - .2, .55, E.outQuint); drawer.style.transform = `translateY(${(1 - dk) * 105}%)`;
      pkFill.style.width = kf(t, [[B.offer + .1, 37.5], [B.offer + .7, 50]], E.outQuint) + '%';
      pkSteps.forEach((el, i) => el.classList.toggle('on', i === 0 || (i === 1 && t > B.offer + .6)));
      lines.forEach((l, i) => { const k = i < 3 ? 1 : prog(t, B.offer + .6, .4, E.back); l.style.opacity = k; l.style.transform = `translateX(${(1 - k) * 60}px)`; });

      // flying jerseys: out of the screen on their beat, into a ring around the phone, then to their finale spot
      flyers.forEach((f, i) => {
        const a = f.at, k = prog(t, a, .8, E.outQuint), kF = prog(t, B.final - .2 + i * .06, .9, E.inOut);
        const p0 = [540 + (ph[0]), 1150], p1 = f.mid, p2 = f.end;
        const x = lerp(lerp(p0[0], p1[0], k), p2[0], kF), y = lerp(lerp(p0[1], p1[1], k), p2[1], kF);
        const sc = lerp(lerp(.3, f.midScale || .8, k), f.endScale || .62, kF) * (1 + Math.sin(t * 1.3 + i) * .015);
        const gone = 1 - prog(t, B.deliver - .1, .3) * (1 - prog(t, B.final - .3, .4));
        f.el.style.opacity = (t < a ? 0 : clamp(k * 3)) * gone * (1 - prog(t, B.end - .2, .5));
        f.el.style.transform = `translate(${x - 210}px, ${y - 210}px) scale(${sc}) rotate(${lerp(f.rot || 0, 0, kF) + Math.sin(t * .9 + i * 2) * 2}deg)`;
        f.el.style.filter = `drop-shadow(0 40px 40px rgba(30,34,50,.28))${t > B.end - .3 ? ` blur(${prog(t, B.end - .3, .6) * 20}px)` : ''}`;
        const tag = f.el.querySelector('.tag'); if (tag) tag.style.opacity = prog(t, a + .4, .3) * (1 - kF);
      });

      // delivery tiles
      I.forEach((el, i) => { const k = on(t, B.deliver + .25 + i * .18, B.final - .1, .5, .4); el.style.opacity = k; el.style.transform = `translateX(${(1 - prog(t, B.deliver + .25 + i * .18, .6, E.outQuint)) * 200}px) scale(${lerp(.92, 1, k)})`; el.style.filter = k < 1 ? `blur(${(1 - k) * 10}px)` : 'none'; });

      // headlines: words out of a blur, the line leaves in a blur
      HL.forEach(x => { const k = on(t, x.at - .05, x.out, .05, .35); x.w.box.style.opacity = k; x.w.box.style.filter = k < 1 && t > x.at + .3 ? `blur(${(1 - k) * 12}px)` : 'none'; x.w.box.style.display = t < x.at - .1 || t > x.out + .05 ? 'none' : ''; wordsAt(x.w, t, x.at, x.stagger || .11, .55); });

      fog.style.opacity = 1 - prog(t, B.end, .5);
      world.style.opacity = 1 - prog(t, B.end, .8) * .55;
      // end card
      const ek = prog(t, B.end + .2, .8, E.outQuint); end.style.opacity = ek; endImg.style.transform = `scale(${lerp(.86, 1, ek)})`; endImg.style.filter = `blur(${(1 - ek) * 14}px)`;
      const tg = prog(t, B.end + .8, .5); endTg.style.opacity = tg; endTg.style.transform = `translateY(${(1 - tg) * 20}px)`;
      const pl = prog(t, B.end + 1.2, .5, E.back); endPill.style.opacity = clamp(pl * 2); endPill.style.transform = `scale(${lerp(.7, 1, pl)})`;
    };
  };
})();
