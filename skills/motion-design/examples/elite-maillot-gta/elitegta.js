// Élite Maillot — "GTA 6 mood" ad built in the house language (see SKILL.md "House style", reference build meuda-smsa):
// dark stage with sunset glow flames (pink / orange / violet / teal), palm silhouettes on a sunset horizon, app UI as
// thick 3D slabs held at one angle, Liquid Glass, a cursor that taps, shared-element moves (the tapped jersey flies
// into the cart), rows building in one by one, a Dynamic Island, and the 3 + 1 offer end card with the real logo.
(() => {
  const { SCENES, h, esc, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f), LG = window.LG;
  const PINK = '#ff3d8b', ORANGE = '#ff8a3d', TEAL = '#5ce1e6', VIOLET = '#8b3dff';
  const smooth = k => k * k * (3 - 2 * k), io = E.inOut, oq = E.outQuint;
  const kf = (t, K, ez = smooth) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [t0, a, e2] = K[i - 1], [t1, b] = K[i], k = (e2 || ez)((t - t0) / (t1 - t0)); return Array.isArray(a) ? a.map((x, j) => lerp(x, b[j], k)) : lerp(a, b, k); } return K[K.length - 1][1]; };
  const win = (t, a, b, fi = .3, fo = .3) => Math.min(prog(t, a, fi, E.out), 1 - prog(t, b - fo, fo, E.inOut));
  const I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9h18v4H3zM5 13h14v8H5z" opacity=".9"/><path d="M11 9h2v12h-2z" fill="#000" opacity=".35"/><path d="M12 9C9 9 7 7.5 8 6s3 0 4 3c1-3 3-4.5 4-3s-1 3-4 3z"/></svg>',
    cursor: '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  };
  const palm = (hgt, lean, seed) => {
    const r = n => { const x = Math.sin(seed * 99.1 + n * 12.9898) * 43758.5453; return x - Math.floor(x); };
    const tx = 200 + lean, ty = 60, pts = [];
    for (let i = 0; i <= 20; i++) { const k = i / 20, x = 200 + lean * k * k, y = hgt + 40 - (hgt - 20) * k, w = lerp(26, 10, k); pts.push([x - w / 2, y], [x + w / 2, y]); }
    const L = pts.filter((_, i) => i % 2 === 0), Rr = pts.filter((_, i) => i % 2 === 1).reverse();
    const d = 'M' + L.concat(Rr).map(p => p.map(v => v.toFixed(1)).join(',')).join(' L') + 'Z';
    let fr = '';
    for (let i = 0; i < 11; i++) {
      const a = -175 + i * 35 + r(i) * 12, len = 190 + r(i + 9) * 70, droop = 60 + r(i + 3) * 50, rad = a * Math.PI / 180;
      const ex = tx + Math.cos(rad) * len, ey = ty + 20 + Math.sin(rad) * len * .45 + droop, mx = tx + Math.cos(rad) * len * .5, my = ty + Math.sin(rad) * len * .5 - 30, nx = -Math.sin(rad) * 22, ny = Math.cos(rad) * 22;
      fr += `M${tx},${ty + 20} Q${(mx + nx).toFixed(1)},${(my + ny).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)} Q${(mx - nx * .4).toFixed(1)},${(my - ny * .4 + 16).toFixed(1)} ${tx},${ty + 20}Z `;
    }
    return `<svg viewBox="0 0 400 ${hgt + 60}" width="400" height="${hgt + 60}"><path d="${d}" fill="#07030c"/><path d="${fr}" fill="#07030c"/></svg>`;
  };

  const CSS = `
  .eg { position:absolute; inset:0; background:#05030a; overflow:hidden; font-family: Inter, system-ui, sans-serif; color:#fff; }
  .eg .flame { position:absolute; border-radius: 50%; filter: blur(80px); mix-blend-mode: screen; }
  .eg .hor { position:absolute; left:-10%; right:-10%; bottom: 0; height: 760px; background: linear-gradient(180deg, transparent 0%, rgba(139,61,255,.25) 30%, rgba(255,61,139,.45) 62%, rgba(255,138,61,.6) 82%, rgba(255,210,120,.55) 92%, rgba(5,3,10,.9) 92.3%, #05030a 100%); }
  .eg .sunh { position:absolute; left: 50%; bottom: 40px; width: 520px; height: 520px; margin-left: -260px; border-radius: 50%; background: radial-gradient(circle, rgba(255,240,190,.9), rgba(255,170,90,.55) 35%, rgba(255,61,139,0) 70%); }
  .eg .palm { position:absolute; transform-origin: 50% 100%; }
  .eg .stage { position:absolute; inset:0; perspective: 1800px; perspective-origin: 540px 960px; }
  .eg .cam { position:absolute; inset:0; transform-style: preserve-3d; transform-origin: 540px 960px; }
  .eg .pane { position:absolute; transform-style: preserve-3d; }
  .eg .trn { position:absolute; inset:0; transform-style: preserve-3d; }
  .eg .rim { box-shadow: 0 0 0 1.5px rgba(255,255,255,.22), 0 0 40px rgba(255,61,139,.35), 0 0 120px rgba(255,138,61,.18), inset 0 1px 0 rgba(255,255,255,.25); }
  .eg .dark { background: linear-gradient(160deg, rgba(38,30,46,.96), rgba(12,9,16,.98)); border-radius: 48px; }
  .eg .lgo { position:absolute; left: 90px; width: 900px; top: 640px; filter: drop-shadow(0 0 40px rgba(92,225,230,.55)); }
  .eg .tagl { position:absolute; left:0; right:0; top: 1230px; text-align:center; font-size: 40px; font-weight: 700; letter-spacing: .38em; text-indent: .38em; color: rgba(255,255,255,.8); }
  /* search */
  .eg .sbar { width: 940px; height: 150px; display:flex; align-items:center; gap: 28px; padding: 0 44px; box-sizing:border-box; font-size: 66px; font-weight: 600; letter-spacing: -.02em; }
  .eg .sbar > * { position:relative; z-index: 6; } .eg .sbar svg { width: 58px; height: 58px; color: rgba(255,255,255,.7); flex:none; }
  .eg .sbar .ph { color: rgba(255,255,255,.35); } .eg .sbar .caret { width: 5px; height: 78px; background: ${PINK}; border-radius: 3px; box-shadow: 0 0 20px ${PINK}; }
  .eg .res { width: 940px; height: 230px; display:flex; align-items:center; gap: 32px; padding: 0 34px; box-sizing:border-box; }
  .eg .res .th { width: 170px; height: 170px; border-radius: 26px; background: #fff center/cover; flex:none; }
  .eg .res b { font-size: 46px; letter-spacing:-.01em; display:block; line-height: 1.15; } .eg .res span { font-size: 40px; color: ${ORANGE}; font-weight: 700; }
  /* product */
  .eg .prod { width: 860px; height: 1420px; padding: 50px; box-sizing:border-box; }
  .eg .prod .im { width: 760px; height: 760px; border-radius: 34px; background: radial-gradient(80% 80% at 50% 40%, #ffd9b0, #ff8fb4 55%, #a56bff); }
  .eg .prod h3 { margin: 44px 0 0; font-size: 62px; line-height: 1.08; letter-spacing: -.02em; }
  .eg .prod .pr { margin-top: 16px; font-size: 64px; font-weight: 800; color: ${ORANGE}; } .eg .prod .pr small { font-size: 32px; color: rgba(255,255,255,.5); font-weight: 600; margin-left: 16px; }
  .eg .prod .of { display:inline-block; margin-top: 18px; padding: 10px 22px; border-radius: 16px; background: rgba(92,225,230,.15); color: ${TEAL}; font-size: 30px; font-weight: 700; }
  .eg .abtn { color: #fff; font-size: 48px; font-weight: 700; display:flex; align-items:center; justify-content:center; gap: 18px; } .eg .abtn > * { position:relative; z-index: 6; } .eg .abtn svg { width: 52px; height: 52px; }
  /* cart */
  .eg .cart2 { width: 900px; height: 1420px; padding: 50px 40px; box-sizing:border-box; }
  .eg .cart2 .hd { font-size: 76px; font-weight: 800; letter-spacing: -.03em; display:flex; align-items:center; gap: 22px; padding: 0 10px 20px; } .eg .cart2 .hd svg { width: 70px; height: 70px; color: ${PINK}; }
  .eg .row2 { position:absolute; left: 40px; right: 40px; height: 190px; display:flex; align-items:center; gap: 30px; border-radius: 30px; padding: 0 20px; box-sizing:border-box; background: rgba(255,255,255,.05); }
  .eg .row2 .th { width: 150px; height: 150px; border-radius: 24px; background: radial-gradient(80% 80% at 50% 40%, #ffe6c8, #ffb0c8); flex:none; display:grid; place-items:center; overflow:hidden; } .eg .row2 .th img { width: 92%; }
  .eg .row2 b { display:block; font-size: 40px; line-height: 1.15; } .eg .row2 small { font-size: 30px; color: rgba(255,255,255,.5); }
  .eg .row2 .p { margin-left:auto; text-align:right; font-size: 42px; font-weight: 800; white-space: nowrap; } .eg .row2 .p s { display:block; font-size: 28px; color: rgba(255,255,255,.4); font-weight: 600; }
  .eg .row2 .badge { position:absolute; right: 26px; top: -22px; padding: 8px 18px; border-radius: 14px; background: linear-gradient(90deg, ${PINK}, ${ORANGE}); font-size: 28px; font-weight: 800; color:#fff; box-shadow: 0 8px 30px rgba(255,61,139,.5); }
  .eg .tot { position:absolute; left: 40px; right: 40px; top: 1010px; display:flex; justify-content:space-between; align-items:flex-end; padding: 0 20px; }
  .eg .tot > * { white-space: nowrap; } .eg .tot .l { font-size: 36px; margin-bottom: 16px; color: rgba(255,255,255,.6); font-weight: 600; } .eg .tot .v { font-size: 84px; font-weight: 800; letter-spacing: -.03em; } .eg .tot s { font-size: 40px; color: rgba(255,255,255,.4); margin-right: 20px; }
  .eg .pay { position:absolute; left: 40px; right: 40px; top: 1180px; height: 150px; }
  .eg .pay .in2 { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap: 18px; font-size: 52px; font-weight: 800; z-index: 6; }
  .eg .pay .in2 svg { width: 60px; height: 60px; }
  /* overlays */
  .eg .isl { position:absolute; left:50%; top: 46px; z-index: 36; background:#000; border-radius: 60px; overflow:hidden; box-shadow: 0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06); }
  .eg .isl .ic { position:absolute; left: 28px; top: 50%; width: 110px; height: 110px; margin-top:-55px; border-radius: 28px; background: linear-gradient(135deg, ${PINK}, ${ORANGE}); display:grid; place-items:center; color:#fff; } .eg .isl .ic svg { width: 60px; height: 60px; }
  .eg .isl .it2 { position:absolute; left: 165px; top: 50%; transform: translateY(-50%); white-space:nowrap; } .eg .isl .it2 b { display:block; font-size: 40px; } .eg .isl .it2 span { font-size: 30px; color: rgba(255,255,255,.6); }
  .eg .cur { position:absolute; width: 70px; height: 70px; z-index: 40; filter: drop-shadow(0 6px 10px rgba(0,0,0,.6)); }
  .eg .ripple { position:absolute; width: 120px; height: 120px; margin: -60px; border-radius:50%; border: 4px solid rgba(255,255,255,.9); z-index: 39; }
  /* end */
  .eg .end { position:absolute; inset:0; z-index: 30; }
  .eg .end .l1 { position:absolute; left:0; right:0; top: 300px; text-align:center; font-size: 150px; font-weight: 900; letter-spacing: -.03em; line-height: 1; }
  .eg .end .l2 { position:absolute; left:0; right:0; top: 470px; text-align:center; font-size: 110px; font-weight: 900; letter-spacing: -.03em; filter: drop-shadow(0 0 40px rgba(255,61,139,.45)); }
  .eg .end .l1 span, .eg .end .l2 span { display:inline-block; }
  .eg .end .row3 { position:absolute; left: 60px; right: 60px; top: 680px; display:grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
  .eg .end .jt { height: 250px; display:grid; place-items:center; } .eg .end .jt > img { position:relative; z-index: 6; width: 82%; }
  .eg .end .jt .bd { position:absolute; z-index: 7; left: 50%; bottom: -20px; transform: translateX(-50%); padding: 6px 14px; border-radius: 12px; background: linear-gradient(90deg, ${PINK}, ${ORANGE}); font-size: 24px; font-weight: 800; white-space: nowrap; }
  .eg .end .elg { position:absolute; left: 190px; width: 700px; top: 1040px; filter: drop-shadow(0 0 30px rgba(92,225,230,.5)); }
  .eg .end .url { position:absolute; left:0; right:0; top: 1500px; text-align:center; font-size: 52px; font-weight: 800; letter-spacing: .06em; }
  `;

  SCENES.elitegta = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'eg', root), B = s.beats;
    // sunset glow flames + horizon + palms (background, not in the 3D camera)
    const FL = [[PINK, 900, 25, 18], [ORANGE, 760, 78, 28], [VIOLET, 860, 70, 80], [TEAL, 520, 15, 70]].map(([c, d, x, y]) => { const f = h('div', 'flame', R); Object.assign(f.style, { width: d + 'px', height: d * .7 + 'px', background: `radial-gradient(closest-side, ${c}, transparent)`, left: x + '%', top: y + '%', marginLeft: -d / 2 + 'px', marginTop: -d * .35 + 'px' }); return f; });
    const hor = h('div', 'hor', R), sunh = h('div', 'sunh', R);
    const PALMS = [[-150, 1960, 900, 140, 1], [800, 1960, 980, -150, 2], [60, 1960, 560, 50, 5], [700, 1960, 520, -40, 7]].map(([x, y, hg, ln, sd]) => { const p = h('div', 'palm', R, palm(hg, ln, sd)); Object.assign(p.style, { left: x + 'px', top: (y - hg - 60) + 'px' }); return p; });

    const stage = h('div', 'stage', R), cam = h('div', 'cam', stage);
    const pane = (cls, x, y, w, hh, html = '') => { const wr = h('div', 'trn', cam); const el = h('div', 'pane ' + cls, wr, html); el._w = wr; Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px' }); return el; };
    const glassify = (el, w, hh, o = {}) => LG.make(el, { w, h: hh, r: o.r, tint: o.tint ?? 'rgba(255,255,255,.08)', scale: o.scale ?? 50 });
    const SLABS = [];
    const slab = (el, depth, rad) => { const L = []; for (let k = 0; k < 6; k++) { const d = document.createElement('div'); Object.assign(d.style, { position: 'absolute', left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height, borderRadius: rad + 'px', background: `rgb(${48 - k * 5},${18 - k * 2},${40 - k * 4})`, border: '2px solid rgba(255,61,139,.22)' }); el._w.insertBefore(d, el); L.push([d, -(k + 1) * depth / 6]); } SLABS.push([el, L]); };

    // 1. opener: the real logo
    const logo = pane('', 0, 0, 1080, 1920, `<img class="lgo" src="${IMG('logo-light.svg')}"><div class="tagl">MAILLOTS DE FOOT</div>`);
    const lgo = logo.querySelector('.lgo'), tagl = logo.querySelector('.tagl');
    // 2. search + result
    const sbar = pane('sbar', 70, 640, 940, 150, `${I.search}<span class="tx"></span><span class="caret"></span><span class="ph">Rechercher un maillot</span>`); glassify(sbar, 940, 150); sbar.classList.add('rim');
    const res = pane('res dark rim', 70, 840, 940, 230, `<div class="th" style="background-image:url(${IMG('photo-barcelone-domicile.jpg')})"></div><div><b>Maillot Barcelone<br>domicile 26/27</b><span>19,99 €</span></div>`);
    const tx = sbar.querySelector('.tx'), ph = sbar.querySelector('.ph'), caret = sbar.querySelector('.caret');
    slab(res, 40, 48);
    // 3. product card
    const prod = pane('prod dark rim', 110, 230, 860, 1420, `<div class="im"></div><h3>Maillot Barcelone domicile 26/27</h3><div class="pr">19,99 €<small>TTC</small></div><div class="of">3 achetés = 1 offert</div>`);
    const prodIm = prod.querySelector('.im'); prodIm.innerHTML = `<img src="${IMG('barca.png')}" style="width:89%;margin:40px 0 0 40px;display:block">`; const prodJ = prodIm.querySelector('img');
    const abtn = h('div', 'abtn', prod, `${I.bag}<span>Ajouter au panier</span>`); Object.assign(abtn.style, { position: 'absolute', left: '50px', top: '1200px', width: '760px', height: '140px' }); glassify(abtn, 760, 140, { tint: 'rgba(255,61,139,.22)' });
    const aIco = abtn.querySelector('svg'), aLab = abtn.querySelector('span');
    slab(prod, 70, 48);
    // the jersey that flies from the product card into the cart (shared element)
    const flyW = h('div', 'trn', cam), fly = h('div', '', flyW, `<img src="${IMG('barca.png')}" style="width:100%;display:block">`);
    Object.assign(fly.style, { position: 'absolute', left: '200px', top: '310px', width: '680px', transformOrigin: '0 0' });
    // 4. cart
    const cart = pane('cart2 dark rim', 90, 250, 900, 1420, `<div class="hd">${I.bag}Panier</div>`);
    const ITEMS = [['barca.png', 'Barcelone domicile', '19,99 €'], ['psg.png', 'Paris extérieur', '19,99 €'], ['real.png', 'Real Madrid domicile', '19,99 €'], ['city.png', 'Manchester City', '<s>19,99 €</s>0,00 €']];
    const ROWS = ITEMS.map(([img, n, p], i) => { const r = h('div', 'row2', cart, `<div class="th"><img src="${IMG(img)}"></div><div><b>${esc(n)}</b><small>Taille M</small></div><div class="p">${p}</div>${i === 3 ? '<div class="badge">OFFERT</div>' : ''}`); r.style.top = 190 + i * 205 + 'px'; return r; });
    const row1Img = ROWS[0].querySelector('.th img');
    const tot = h('div', 'tot', cart, `<div class="l">Total</div><div><s></s><span class="v">0,00 €</span></div>`);
    const totV = tot.querySelector('.v'), totS = tot.querySelector('s');
    const pay = h('div', 'pay', cart, `<div class="in2"><span class="pi">${I.check}</span><span class="pl2">Commander</span></div>`); glassify(pay, 820, 150, { tint: 'rgba(255,138,61,.25)', r: 40 });
    const payIco = pay.querySelector('.pi'), payLab = pay.querySelector('.pl2'); payIco.style.display = 'none';
    slab(cart, 80, 48);
    // overlays
    const isl = h('div', 'isl', R, `<div class="ic">${I.gift}</div><div class="it2"><b>Offre activée</b><span>3 achetés = 1 offert</span></div>`);
    const islIn = [...isl.querySelectorAll('.ic,.it2')];
    const cur = h('div', 'cur', R, I.cursor), rip = h('div', 'ripple', R);
    // end card
    const end = h('div', 'end', R, `<div class="l1">${'3 ACHETÉS'.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div>
      <div class="l2">${'LE 4ÈME OFFERT'.split('').map((c, i, a) => `<span style="color:rgb(255,${Math.round(61 + 77 * i / (a.length - 1))},${Math.round(139 - 78 * i / (a.length - 1))})">${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div><div class="row3"></div>
      <img class="elg" src="${IMG('logo-light.svg')}"><div class="url">ELITE-MAILLOT.FR</div>`);
    const l1 = [...end.querySelectorAll('.l1 span')], l2 = [...end.querySelectorAll('.l2 span')], row3 = end.querySelector('.row3'), elg = end.querySelector('.elg'), url = end.querySelector('.url');
    const JT = ['barca.png', 'psg.png', 'real.png', 'city.png'].map((f, i) => h('div', 'jt', row3, `<img src="${IMG(f)}">${i === 3 ? '<div class="bd">OFFERT</div>' : ''}`));
    let jtDone = false;

    // camera: one fixed 3D angle, slow push-ins and vertical detail shots only
    const A = [-16, 8, 0], N = B.cart;
    const CAM = [
      [0, [0, 0, 1.03, 0, 0, 0], io],
      [B.search - .35, [0, 0, 1.0, 0, 0, 0], io],
      [B.search, [0, 120, 1.0, ...A]],
      [B.prod - .35, [0, 110, 1.02, ...A], io],
      [B.prod, [0, 0, .92, ...A]],
      [B.add - .4, [0, -60, .96, ...A], io],
      [B.add, [0, -120, 1.0, ...A]],
      [N - .1, [0, 0, .95, ...A], io],
      [N + .6, [0, 0, .88, ...A], io],
      [N + 2.6, [0, 220, 1.08, ...A], io],
      [B.pay - 1.4, [0, -330, 1.12, ...A], io],
      [B.pay + .3, [0, -380, 1.15, ...A], io],
      [B.end - .1, [0, 0, .95, ...A], io],
      [B.end + .4, [0, 0, .74, 0, 0, 0]],
      [s.duration, [0, 0, .75, 0, 0, 0]],
    ];
    const camCss = c => `translate(${c[0]}px, ${c[1]}px) scale(${c[2]}) rotateY(${c[3]}deg) rotateX(${c[4]}deg) rotateZ(${c[5]}deg)`;
    const eur = v => v.toFixed(2).replace('.', ',') + ' €';

    return t => {
      cam.style.transform = camCss(kf(t, CAM));
      FL.forEach((f, i) => { f.style.transform = `translate(${Math.sin(t * .5 + i * 2) * 120}px, ${Math.cos(t * .4 + i) * 100}px) scale(${1 + Math.sin(t * .7 + i) * .12})`; f.style.opacity = .5 + .2 * Math.sin(t * .6 + i); });
      PALMS.forEach((p, i) => { p.style.transform = `rotate(${Math.sin(t * .6 + i * 1.3) * 1.5}deg)`; });
      const show = (el, a, b) => {
        const w2 = el._w || el, ki = a < 0 ? 1 : prog(t, a, .38, oq), ko = prog(t, b - .22, .22, k => k * k * k), k = Math.min(ki, 1 - ko);
        w2.style.display = k > .001 ? '' : 'none'; w2.style.opacity = clamp(ki * 1.6) * (1 - ko);
        w2.style.transform = `translateZ(${(1 - ki) * -320 + ko * 380}px)`; w2.style.filter = (1 - ki) + ko > .02 ? `blur(${((1 - ki) * 6 + ko * 6).toFixed(1)}px)` : 'none';
        return k; };
      // 1. opener: logo wipes in, tagline letters open up
      show(logo, -1, B.search);
      const lk = prog(t, .1, .8, io); lgo.style.clipPath = `inset(0 ${(1 - lk) * 100}% 0 0)`; lgo.style.transform = `scale(${lerp(1.08, 1, prog(t, .1, 1.2, oq))})`;
      const tk = prog(t, .9, .7, oq); tagl.style.opacity = tk; tagl.style.letterSpacing = lerp(.8, .38, tk) + 'em';
      // 2. search: types, result rises, cursor taps it
      show(sbar, B.search, B.prod); show(res, B.search + 1.0, B.prod);
      const q = 'Maillot Barça', n = Math.floor(clamp((t - B.search - .15) / .06, 0, q.length));
      tx.textContent = q.slice(0, n); ph.style.display = n ? 'none' : ''; caret.style.opacity = Math.floor(t * 3) % 2 || n < q.length ? 1 : 0; LG.sheen(sbar, t * .35);
      const rk = prog(t, B.search + 1.0, .5, E.back); res.style.transform = `translateY(${(1 - rk) * 80}px)`;
      const TR = B.prod - .4; res.style.background = t > TR ? 'linear-gradient(160deg, rgba(255,61,139,.3), rgba(12,9,16,.98))' : '';
      // 3. product card, cursor taps "Ajouter au panier"
      show(prod, B.prod, B.cart);
      const pk = prog(t, B.prod - .3, .9, oq); prod.style.transform = `rotateY(${(1 - pk) * -14}deg) translateZ(${(1 - pk) * -150}px)`;
      const added = t > B.add; aLab.textContent = added ? 'Ajouté au panier' : 'Ajouter au panier'; abtn.style.transform = `scale(${1 - .05 * clamp(1 - Math.abs(t - B.add) / .12)})`; abtn.style.boxShadow = added ? '0 0 50px rgba(255,61,139,.6)' : ''; LG.sheen(abtn, t * .3);
      // cursor (result tap, then add-to-cart tap, then pay tap)
      const taps = [[TR, 820, 1400, 520, 960], [B.add, 860, 1650, 560, 1500], [B.pay, 860, 1700, 560, 1530]];
      let cv = 0, cx = 0, cy = 0, tapT = -9, rx = 0, ry = 0;
      taps.forEach(([tt, x0, y0, x1, y1]) => { const v = win(t, tt - .8, tt + .3, .2, .2); if (v > cv) { cv = v; const kk = prog(t, tt - .7, .6, io); cx = lerp(x0, x1, kk); cy = lerp(y0, y1, kk); tapT = tt; rx = x1 + 10; ry = y1 + 10; } });
      cur.style.opacity = cv; cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; cur.style.transform = `scale(${t > tapT && t < tapT + .1 ? .85 : 1})`;
      const rpk = clamp((t - tapT) / .45); rip.style.opacity = cv > 0 && t > tapT && rpk < 1 ? 1 - rpk : 0; rip.style.left = rx + 'px'; rip.style.top = ry + 'px'; rip.style.transform = `scale(${.2 + rpk * 1.6})`;
      // shared element: the jersey lifts off the product card and lands as the first cart row
      const fk = prog(t, B.add + .05, N + .7 - B.add, io), lift = Math.sin(fk * Math.PI);
      flyW.style.display = t > B.add && t < N + .75 ? '' : 'none'; prodJ.style.visibility = t > B.add ? 'hidden' : '';
      const [x0, y0, w0] = [200, 310, 680], [x1, y1, w1] = [90 + 40 + 20 + 6, 250 + 190 + 20 + 14, 138];
      fly.style.transform = `translate(${lerp(0, x1 - x0, fk)}px, ${lerp(0, y1 - y0, fk) - lift * 120}px) translateZ(${lift * 260}px) scale(${lerp(1, w1 / w0, fk)}) rotate(${lift * -8}deg)`;
      fly.style.filter = `drop-shadow(0 ${20 + lift * 40}px ${30 + lift * 40}px rgba(0,0,0,.6))`;
      row1Img.style.visibility = t > N + .72 ? '' : 'hidden';
      // 4. cart: rows build in, total counts, island, pay
      show(cart, N, B.end);
      ROWS.forEach((r, i) => { const k = i === 0 ? prog(t, N + .1, .4, oq) : prog(t, N + .55 + i * .45, .5, E.back); r.style.opacity = clamp(k * 2); r.style.transform = `translateX(${(1 - k) * 160}px)`; });
      const badgeK = prog(t, N + 2.2, .4, E.back), bd = ROWS[3].querySelector('.badge'); bd.style.transform = `scale(${badgeK})`;
      const cnt = Math.min(4, (t > N + .1 ? 1 : 0) + [1, 2, 3].filter(i => t > N + .55 + i * .45).length);
      const full = cnt * 19.99, offK = prog(t, N + 2.4, .8, io), shown = cnt === 4 ? lerp(full, 59.97, offK) : full;
      totV.textContent = eur(shown); tot.querySelector('.l').textContent = `Total · ${cnt} maillot${cnt > 1 ? 's' : ''}`; totS.textContent = cnt === 4 && offK > .05 ? '79,96 €' : '';
      const ik = Math.min(prog(t, N + 2.5, .6, oq), 1 - prog(t, N + 5.2, .5, io)), iv = win(t, N + 2.3, N + 5.9, .2, .2);
      isl.style.opacity = iv; isl.style.width = lerp(250, 900, ik) + 'px'; isl.style.height = lerp(72, 170, ik) + 'px'; isl.style.marginLeft = -lerp(250, 900, ik) / 2 + 'px'; islIn.forEach(x => { x.style.opacity = clamp((ik - .6) * 2.5); });
      const paid = t > B.pay; payIco.style.display = paid ? '' : 'none'; payLab.textContent = paid ? 'Commande validée' : 'Commander'; pay.style.transform = `scale(${1 - .05 * clamp(1 - Math.abs(t - B.pay) / .12)})`; pay.style.boxShadow = paid ? '0 0 60px rgba(92,225,230,.55)' : ''; LG.sheen(pay, t * .3);
      SLABS.forEach(([el, L]) => L.forEach(([d, z]) => { d.style.transform = `${el.style.transform || ''} translateZ(${z}px)`; }));
      // end card
      const ek = prog(t, B.end, .3); end.style.opacity = ek; end.style.display = ek > 0 ? '' : 'none';
      if (ek > 0 && !jtDone) { JT.forEach(j => { j.style.position = 'relative'; LG.make(j, { w: j.offsetWidth || 220, h: 250, r: 40, tint: 'rgba(255,255,255,.07)' }); j.style.position = 'relative'; }); jtDone = true; }
      l1.forEach((sp, i) => { const k = prog(t, B.end + .1 + i * .04, .4, oq); sp.style.opacity = clamp(k * 2); sp.style.transform = `translateY(${(1 - k) * -40}px)`; });
      l2.forEach((sp, i) => { const k = prog(t, B.end + .7 + i * .035, .4, oq); sp.style.opacity = clamp(k * 2); sp.style.transform = `translateY(${(1 - k) * 40}px)`; });
      JT.forEach((j, i) => { const k = prog(t, B.end + 1.4 + i * .2, .5, oq); j.style.opacity = clamp(k * 2); j.style.transform = `perspective(900px) rotateX(${(1 - k) * -90}deg) translateY(${(1 - k) * 40}px)`; LG.sheen(j, t * .3 + i * .2); });
      const gk = prog(t, B.end + 2.5, .7, io); elg.style.clipPath = `inset(0 ${(1 - gk) * 100}% 0 0)`; url.style.opacity = prog(t, B.end + 3.1, .5);
    };
  };
})();
