// Élite Maillot — Noël, "vitrine" version.
// The phone shows the REAL site, captured on an iPhone 14 viewport (assets/site/*.jpg: home scrolled, product page,
// size chosen, cart drawer after the real "Ajouter au panier", then the real cart with 4 jerseys where the site
// itself sets the 4th to 0,00€). Around it: a soft turquoise studio, giant ghost words, iOS notifications floating
// with the cut-out jerseys, an editorial headline (sans + serif italic), camera zooms into the screen on the proof,
// then a fly-through into the logo.
(() => {
  const { SCENES, h, esc, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/' + f);
  const kf = (t, K, ease = E.inOut) => {
    if (t <= K[0][0]) return K[0][1];
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) {
      const [t0, a] = K[i - 1], [t1, b] = K[i], k = ease((t - t0) / (t1 - t0));
      return Array.isArray(a) ? a.map((x, j) => lerp(x, b[j], k)) : lerp(a, b, k);
    }
    return K[K.length - 1][1];
  };
  const win = (t, a, b, fi = .4, fo = .4) => Math.min(prog(t, a, fi, E.out), 1 - prog(t, b - fo, fo, E.inOut));

  // phone screen in CSS pixels of the capture (iPhone 14 viewport 390 x 664) + iOS status bar + Safari bar
  const SW = 390, SB = 47, VH = 664, SAF = 76, SH = SB + VH + SAF, K = 1.6, PW = SW * K + 28;

  const CSS = `
  .vt { --ink:#11a9b4; --tq:#5ce1e6; position:absolute; inset:0; font-family: Inter, system-ui, sans-serif; color:#14161c; overflow:hidden; }
  .vt .blob { position:absolute; border-radius:50%; filter: blur(90px); }
  .vt .ghost { position:absolute; left:50%; top:50%; font-weight: 900; font-size: 520px; letter-spacing:-.06em; line-height:1; white-space:nowrap; color: transparent; -webkit-text-stroke: 3px rgba(17,169,180,.16); }
  .vt .stagefx { position:absolute; inset:0; }
  .vt .fog { position:absolute; left:0; right:0; top:0; height: 470px; z-index: 11; background: linear-gradient(180deg, rgba(251,254,254,.97) 0%, rgba(251,254,254,.9) 55%, rgba(251,254,254,0) 100%); }
  .vt .kicker { position:absolute; left: 76px; top: 120px; font-size: 24px; font-weight: 700; letter-spacing: .22em; color: var(--ink); z-index: 12; display:flex; align-items:center; gap: 14px; }
  .vt .kicker i { width: 40px; height: 3px; background: var(--ink); display:block; }
  .vt .hl { position:absolute; left: 72px; right: 60px; top: 168px; font-size: 92px; font-weight: 800; letter-spacing: -.045em; line-height: 1.0; z-index: 12; }
  .vt .hl .w { display:inline-block; margin-right: .22em; }
  .vt .hl .acc { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; letter-spacing: -.01em; color: var(--ink); font-size: 1.14em; }

  .vt .notif { position:absolute; left:0; top:0; width: 720px; padding: 26px 30px; border-radius: 40px; background: rgba(255,255,255,.78); backdrop-filter: blur(24px);
     box-shadow: 0 30px 70px rgba(20,60,70,.16), 0 1px 0 rgba(255,255,255,.9) inset; display:flex; gap: 22px; align-items:flex-start; z-index: 6; }
  .vt .notif .app { width: 78px; height: 78px; border-radius: 20px; background: linear-gradient(180deg,#5ff777,#13c142); display:grid; place-items:center; flex:none; }
  .vt .notif .app svg { width: 50px; }
  .vt .notif b { font-size: 31px; } .vt .notif small { float:right; font-size: 24px; color:#8a8f98; font-weight:500; }
  .vt .notif p { margin: 6px 0 0; font-size: 31px; line-height:1.25; color:#24272e; }
  .vt .jet { position:absolute; left:0; top:0; width: 460px; height: 460px; background-size: contain; background-repeat:no-repeat; background-position:center; z-index: 5; }

  .vt .iph { position:absolute; left:50%; top:0; width: ${PW}px; height: ${SH * K + 28}px; margin-left: ${-PW / 2}px; border-radius: 92px; background:#0c0c0e; padding: 14px; z-index: 8;
     box-shadow: 0 0 0 3px #c3c7cd, 0 0 0 5px #eef0f2, 0 80px 140px rgba(16,70,80,.28), 0 24px 50px rgba(16,40,50,.18); transform-origin: 50% 0; box-sizing: border-box; }
  .vt .scr { position:relative; width:${SW}px; height:${SH}px; transform: scale(${K}); transform-origin: 0 0; border-radius: ${78 / K}px; overflow:hidden; background:#fff; }
  .vt .isl { position:absolute; top: 11px; left:50%; width: 120px; height: 34px; margin-left:-60px; border-radius: 20px; background:#000; z-index: 30; }
  .vt .stat { position:absolute; top:0; left:0; right:0; height:${SB}px; background:#fff; display:flex; justify-content:space-between; align-items:center; padding: 4px 34px 0; font-size: 16px; font-weight: 600; z-index: 25; }
  .vt .stat .bat { width: 26px; height: 12px; border: 1.5px solid #000; border-radius: 4px; position:relative; } .vt .stat .bat i { position:absolute; inset: 1.5px; right: 5px; background:#000; border-radius: 2px; }
  .vt .vp { position:absolute; top:${SB}px; left:0; width:${SW}px; height:${VH}px; overflow:hidden; background:#fff; }
  .vt .vp img { position:absolute; left:0; top:0; width:${SW}px; display:block; }
  .vt .layer { position:absolute; inset:0; }
  .vt .saf { position:absolute; left:0; right:0; bottom:0; height:${SAF}px; background: rgba(248,248,250,.97); border-top: 1px solid #e3e3e6; z-index: 25; }
  .vt .saf .url { position:absolute; left: 16px; right: 16px; top: 9px; height: 38px; border-radius: 12px; background:#e9e9ec; display:flex; align-items:center; justify-content:center; gap: 6px; font-size: 15px; color:#222; }
  .vt .saf .home { position:absolute; bottom: 7px; left:50%; width: 130px; height: 5px; margin-left:-65px; border-radius: 3px; background:#111; }
  .vt .tap { position:absolute; width: 54px; height: 54px; margin:-27px; border-radius:50%; background: rgba(90,90,100,.32); border: 1.5px solid rgba(255,255,255,.8); z-index: 28; }
  .vt .ring { position:absolute; border: 3px solid var(--tq); border-radius: 12px; box-shadow: 0 0 0 5px rgba(92,225,230,.25); z-index: 27; }

  .vt .end { position:absolute; inset:0; background: radial-gradient(90% 60% at 50% 42%, #ffffff, #e9fbfc 70%, #d4f5f7); z-index: 40; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .vt .end img { width: 660px; }
  .vt .end .offer { margin-top: 46px; display:flex; align-items:center; gap: 14px; padding: 20px 34px; border-radius: 22px; background: #14161c; color:#fff; font-size: 36px; font-weight: 700; }
  .vt .end .offer span { color: var(--tq); }
  .vt .end .url { margin-top: 26px; font-size: 32px; font-weight: 600; color:#3b4049; letter-spacing: .01em; }
  `;

  SCENES.vitrine = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const V = h('div', 'vt', root), B = s.beats;
    // studio: drifting turquoise light + ghost words
    const blobs = [['#bff3f5', 900, 20, 18], ['#d9f8f9', 800, 80, 60], ['#a6eef1', 700, 30, 85]].map(([c, d, x, y]) => { const b = h('div', 'blob', V); Object.assign(b.style, { background: c, width: d + 'px', height: d + 'px', left: x + '%', top: y + '%', marginLeft: -d / 2 + 'px', marginTop: -d / 2 + 'px' }); return b; });
    const FX = h('div', 'stagefx', V);
    const ghosts = s.ghosts.map(g => ({ el: h('div', 'ghost', FX, esc(g.text)), ...g }));

    // iOS notifications + cut-out jerseys floating in depth (opening)
    const msgSvg = '<svg viewBox="0 0 24 24"><path fill="#fff" d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.6 3.4 6.1L4.5 21l4.2-2.2c1 .3 2.1.4 3.3.4 5.5 0 10-3.6 10-8s-4.5-8.2-10-8.2z"/></svg>';
    const notes = s.notifs.map(n => ({ el: h('div', 'notif', FX, `<div class="app">${msgSvg}</div><div style="flex:1"><b>${esc(n.from)}</b><small>maintenant</small><p>${esc(n.text)}</p></div>`), ...n }));
    const jets = s.jerseys.map(j => { const el = h('div', 'jet', FX); el.style.backgroundImage = `url(${IMG('img/' + j.img)})`; return { el, ...j }; });

    // the phone with the real site
    const iph = h('div', 'iph', FX), scr = h('div', 'scr', iph);
    h('div', 'isl', scr); h('div', 'stat', scr, '<span>20:41</span><span class="bat"><i></i></span>');
    const vp = h('div', 'vp', scr), L = {};
    const lay = (k, src) => { const d = h('div', 'layer', vp), im = h('img', '', d); im.src = IMG('site/' + src); L[k] = { d, im }; };
    lay('home', 'home-scroll.jpg'); lay('pp', 'product-top.jpg'); lay('pps', 'product-size.jpg'); lay('c1', 'cart-1.jpg'); lay('c4', 'cart-4.jpg');
    h('div', 'saf', scr, `<div class="url">🔒 elite-maillot.fr</div><div class="home"></div>`);
    const tap = h('div', 'tap', scr), ring = h('div', 'ring', scr);

    // headline (kicker + lines, accent words in serif italic)
    const fog = h('div', 'fog', V);
    const kick = h('div', 'kicker', V, `<i></i>${esc(s.kicker || 'ÉLITE MAILLOT')}`);
    const HL = s.headlines.map(x => {
      const box = h('div', 'hl', V); let acc = false;
      const parts = x.text.split(/\s+/).map(w => { if (w.startsWith('*')) acc = true; const sp = h('span', 'w' + (acc ? ' acc' : ''), box, esc(w.replace(/\*/g, ''))); if (w.endsWith('*')) acc = false; return sp; });
      if (x.br) parts[x.br - 1].insertAdjacentHTML('afterend', '<br>');
      return { box, parts, ...x };
    });

    const end = h('div', 'end', V, `<img src="${IMG('img/logo.png')}"><div class="offer">🎁 3 achetés = <span>1 offert</span></div><div class="url">elite-maillot.fr · @elite.maillot</div>`);
    const eImg = end.querySelector('img'), eOff = end.querySelector('.offer'), eUrl = end.querySelector('.url');
    const P = (x, y) => [x, SB + y];   // capture css px (inside the viewport) -> screen px

    return t => {
      blobs.forEach((b, i) => { b.style.transform = `translate(${Math.sin(t * .3 + i * 2) * 60}px, ${Math.cos(t * .25 + i) * 50}px)`; });
      ghosts.forEach(g => { const k = win(t, g.at, g.out, .8, .8); g.el.style.opacity = k; g.el.style.transform = `translate(-50%,-50%) translate(${lerp(90, -90, prog(t, g.at, g.out - g.at, E.inOut))}px, ${g.y || 0}px)`; });

      // phone: rises with a 3D turn, holds, steps back for the family arc
      const ph = kf(t, [[B.open - .3, [1900, 38, .9]], [B.open + .8, [440, 0, 1]], [B.family - .2, [440, 0, 1]], [B.family + .7, [560, 0, .72]], [s.duration, [570, 0, .7]]], E.outQuint);
      iph.style.transform = `translateY(${ph[0]}px) perspective(2200px) rotateY(${ph[1]}deg) rotateX(${ph[1] * .3}deg) scale(${ph[2]})`;

      // opening: notifications drop in on the voice, then leave upward in a blur when the phone arrives
      const outN = prog(t, B.open - .4, .6, E.inOut);
      notes.forEach(n => {
        const k = prog(t, n.at, .6, E.back);
        n.el.style.opacity = clamp(k * 2) * (1 - outN);
        n.el.style.transform = `translate(${n.x}px, ${n.y + (1 - k) * -60 - outN * 300}px) scale(${lerp(.85, 1, clamp(k))}) rotate(${n.r || 0}deg)`;
        n.el.style.filter = outN > 0 ? `blur(${outN * 12}px)` : 'none';
      });
      // jerseys: float in the opening, fly out of the screen when the voice names them, arc around the phone at the end
      jets.forEach((j, i) => {
        const fl = Math.sin(t * .9 + i * 1.7) * 14, rot = Math.sin(t * .6 + i) * 4;
        const o1 = win(t, j.inAt ?? .2, B.open - .1, .8, .5), k2 = prog(t, j.at, .75, E.outQuint), kF = prog(t, B.family - .1 + i * .07, .9, E.inOut);
        let x, y, sc, op, bl;
        if (t < j.at) { x = j.x0; y = j.y0 + fl - prog(t, B.open - .4, .6) * 200; sc = j.s0; op = o1; bl = j.b0 || 0; }
        else { x = lerp(lerp(540, j.x1, k2), j.x2, kF); y = lerp(lerp(1150, j.y1, k2), j.y2, kF) + fl; sc = lerp(lerp(.25, j.s1, k2), j.s2, kF); op = clamp(k2 * 3) * (1 - prog(t, B.zoom - .3, .3) * (1 - prog(t, B.family - .2, .3))); bl = 0; }
        op *= 1 - prog(t, B.end - .3, .3);
        j.el.style.opacity = op; j.el.style.filter = `drop-shadow(0 40px 36px rgba(16,60,70,.25))${bl ? ` blur(${bl}px)` : ''}`;
        j.el.style.transform = `translate(${x - 230}px, ${y - 230}px) scale(${sc}) rotate(${(t < j.at ? j.r0 || 0 : lerp(j.r1 || 0, 0, kF)) + rot}deg)`;
        j.el.style.zIndex = t < j.at ? (j.front ? 7 : 4) : 9;
      });

      // camera: zoom into the screen on the proof (a point of the capture), then back
      const zp = (x, y, z) => { const [sx, sy] = P(x, y); return [540 - PW / 2 + 14 + sx * K, 440 + 14 + sy * K, z]; };
      const Z = kf(t, [[B.zoom - .1, [540, 1100, 1]], [B.zoom + .6, zp(300, 290, 2.0)], [B.ship - .2, zp(300, 290, 2.0)], [B.ship + .45, zp(195, 128, 1.9)], [B.family - .5, zp(195, 128, 1.9)], [B.family + .3, [540, 1100, 1]]]);
      const fly = prog(t, B.end - .25, .7, E.inOut);
      // keep the zoom point where it is on screen, slightly drawn toward the centre
      const cx = lerp(Z[0], 540, (Z[2] - 1) * .9), cy = lerp(Z[1], 1180, (Z[2] - 1) * .95);
      const zs = Z[2] * (1 + fly * 3.2);
      FX.style.transform = `translate(${cx}px, ${cy}px) scale(${zs}) translate(${-Z[0]}px, ${-Z[1]}px)`;
      FX.style.transformOrigin = '0 0';
      FX.style.opacity = 1 - prog(t, B.end + .15, .3);

      // inside the screen (real captures)
      L.home.im.style.transform = `translateY(${-kf(t, [[B.scroll, 0], [B.scroll + 1.5, 1650]], E.inOut)}px)`;
      const tapCard = B.scroll + 1.75, tapAtc = B.add;
      const ppIn = prog(t, tapCard + .1, .45, E.outQuint); L.pp.d.style.transform = `translateX(${(1 - ppIn) * 100}%)`; L.pp.d.style.opacity = t > tapCard ? 1 : 0;
      L.pp.im.style.transform = `translateY(${-kf(t, [[tapCard + .6, 0], [tapAtc - .45, 650]], E.inOut)}px)`;
      L.pps.d.style.opacity = prog(t, tapAtc - .5, .15); L.pps.d.style.display = t > tapAtc - .55 ? '' : 'none';
      const c1 = prog(t, tapAtc + .25, .45, E.outQuint); L.c1.d.style.transform = `translateX(${(1 - c1) * 100}%)`; L.c1.d.style.opacity = t > tapAtc + .2 ? 1 : 0;
      L.c4.d.style.opacity = prog(t, B.four - .15, .3);
      const tp = at => clamp((t - at + .2) / .2) * (1 - clamp((t - at - .15) / .25));
      const a1 = tp(tapCard), a2 = tp(tapAtc), pt = a1 >= a2 ? P(287, 557) : P(195, 494);
      tap.style.opacity = Math.max(a1, a2); tap.style.left = pt[0] + 'px'; tap.style.top = pt[1] + 'px'; tap.style.transform = `scale(${lerp(1.5, .85, Math.max(a1, a2))})`;
      // highlight on the site's own proof: "3 achetés, 1 offert" + 0,00€, then "Vous bénéficiez de la livraison gratuite."
      const r1 = win(t, B.zoom + .55, B.ship - .1, .3, .2), r2 = win(t, B.ship + .5, B.family - .4, .3, .2);
      const R = r1 >= r2 ? [228, 254, 150, 78] : [6, 112, 330, 28], ro = Math.max(r1, r2);
      ring.style.opacity = ro; Object.assign(ring.style, { left: R[0] + 'px', top: SB + R[1] + 'px', width: R[2] + 'px', height: R[3] + 'px', transform: `scale(${lerp(1.15, 1, ro)})` });

      // headline: words rise out of a blur; the line leaves upward in a blur
      kick.style.opacity = 1 - prog(t, B.end - .3, .3); fog.style.opacity = kick.style.opacity;
      HL.forEach(x => {
        const vis = t >= x.at - .05 && t <= x.out + .05; x.box.style.display = vis ? '' : 'none'; if (!vis) return;
        const o = 1 - prog(t, x.out - .3, .3, E.inOut); x.box.style.opacity = o; x.box.style.transform = `translateY(${(1 - o) * -30}px)`; x.box.style.filter = o < 1 ? `blur(${(1 - o) * 10}px)` : 'none';
        x.parts.forEach((p, i) => { const k = prog(t, x.at + i * (x.stagger || .09), .55, E.outQuint); p.style.opacity = k; p.style.filter = k < 1 ? `blur(${(1 - k) * 14}px)` : 'none'; p.style.transform = `translateY(${(1 - k) * 40}px)`; });
      });

      // end card: the logo comes out of the flight through the screen
      end.style.opacity = prog(t, B.end + .1, .45);
      const li = prog(t, B.end + .25, .8, E.outQuint); eImg.style.transform = `scale(${lerp(1.25, 1, li)})`; eImg.style.filter = li < 1 ? `blur(${(1 - li) * 16}px)` : 'none'; eImg.style.opacity = li;
      const oi = prog(t, B.end + .9, .5, E.back); eOff.style.opacity = clamp(oi * 2); eOff.style.transform = `translateY(${(1 - oi) * 30}px) scale(${lerp(.85, 1, oi)})`;
      eUrl.style.opacity = prog(t, B.end + 1.25, .5);
    };
  };
})();
