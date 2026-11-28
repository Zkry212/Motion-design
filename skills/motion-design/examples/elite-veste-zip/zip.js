// Élite Maillot — Brésil jackets, driven by a zipper. One continuous shot: the zip pull is what the eye follows.
//  the zip line draws down a night screen, the pull drops in ("Ouvre.") → the pull runs down and the screen opens in
//  a real V like a zipper, revealing the pink world and its jacket → it runs back up and opens the next colour, and so
//  on for the six colours (down, up, down…) → the pull lands on a clothes rail; the six jackets swing in on hangers
//  → the pull slides from hanger to hanger ("Tu hésites ?") → three jackets unhook and drop into an Élite Maillot
//  bag, the fourth follows with a swinging OFFERTE tag, "3 + 1" → the tag flies up, grows and flips: price / totals
//  → the screen zips shut in navy, the logo, "Le foot, à ton prix.", the url.
(() => {
  const { SCENES, h, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f);
  const oq = E.outQuint, io = E.inOut, bk = E.back;
  const BLUE = '#2347e0', INK = '#0d1a4a', TEAL = '#5ce1e6', NIGHT = '#0b1230';
  const COL = [['rose', 'Rose', '#f4c6d0', INK], ['ciel', 'Bleu ciel', '#b7d3d8', INK], ['nuit', 'Bleu nuit', '#17305a', '#fff'], ['noir', 'Noir', '#141417', '#fff'], ['vert', 'Vert', '#b4d3be', INK], ['beige', 'Beige', '#eee3cf', INK]];
  const CSS = `
  .zp { position:absolute; inset:0; overflow:hidden; font-family: Inter, system-ui, sans-serif; background:${NIGHT}; }
  .zp .z-w { position:absolute; inset:0; overflow:hidden; }
  .zp .z-w::after { content:''; position:absolute; inset:0; background: radial-gradient(90% 60% at 50% 40%, rgba(255,255,255,.25), rgba(255,255,255,0) 60%), radial-gradient(120% 70% at 50% 100%, rgba(0,0,30,.2), transparent 60%); pointer-events:none; }
  .zp .z-img { position:absolute; background: center/contain no-repeat; }
  .zp .z-cap { position:absolute; left:0; right:0; text-align:center; font-weight: 700; letter-spacing: -.035em; line-height: 1.08; white-space: nowrap; z-index: 60; }
  .zp .z-cap .w { display:inline-block; margin: 0 .11em; }
  .zp .z-u { position:relative; display:inline-block; } .zp .z-u > i { position:absolute; left: 1%; right: 1%; bottom: -.1em; height: .07em; border-radius: .04em; background: currentColor; transform-origin: 0 50%; }
  .zp .z-badge { position:absolute; width: 60px; height: 60px; border-radius: 50%; background: ${BLUE}; color:#fff; font-size: 30px; font-weight: 800; display:grid; place-items:center; box-shadow: 0 0 0 6px #fff, 0 8px 20px rgba(35,71,224,.4); }
  .zp svg.z-teeth { position:absolute; inset:0; width:100%; height:100%; z-index: 20; pointer-events:none; overflow: visible; }
  .zp .z-pull { position:absolute; width: 90px; height: 190px; margin-left: -45px; margin-top: -40px; z-index: 30; filter: drop-shadow(0 10px 14px rgba(0,0,0,.45)); transform-origin: 50% 20px; }
  .zp .z-txt { position:absolute; white-space: nowrap; font-weight: 700; color: ${INK}; }
  `;
  const PULL = `<svg viewBox="0 0 90 190"><defs><linearGradient id="zm" x1="0" x2="1"><stop offset="0" stop-color="#8d939e"/><stop offset=".45" stop-color="#f4f6fa"/><stop offset=".7" stop-color="#b9bfca"/><stop offset="1" stop-color="#6f7580"/></linearGradient></defs>
    <path d="M18 6h54l-6 46H24z" fill="url(#zm)" stroke="#5c626c" stroke-width="2"/><rect x="36" y="40" width="18" height="22" rx="4" fill="url(#zm)" stroke="#5c626c" stroke-width="2"/>
    <path d="M28 60h34a6 6 0 0 1 6 6v104a14 14 0 0 1-14 14H36a14 14 0 0 1-14-14V66a6 6 0 0 1 6-6z" fill="url(#zm)" stroke="#5c626c" stroke-width="2"/><rect x="38" y="80" width="14" height="70" rx="7" fill="#5c626c" opacity=".55"/></svg>`;
  const HOOK = '<svg viewBox="0 0 120 70" width="120" height="70"><path d="M60 4c-8 0-12 5-12 10s5 9 12 9v8L8 62h104L60 31" fill="none" stroke="#8a92a8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  SCENES.zip = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'zp', root), T = s.t, D = s.duration, O = T.open;
    const el = (par, cls, css = {}, html = '') => { const e = h('div', cls, par, html); Object.assign(e.style, css); return e; };
    const kfo = (t, K) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [t0, a, e2] = K[i - 1], [t1, b] = K[i], k = (e2 || io)((t - t0) / (t1 - t0)), o = {}; for (const p in a) o[p] = lerp(a[p], b[p] ?? a[p], k); for (const p in b) if (!(p in a)) o[p] = b[p]; return o; } return K[K.length - 1][1]; };
    const cap = (words, y, size, a, b, color) => {
      const c = el(R, 'z-cap', { top: y + 'px', fontSize: size + 'px', color });
      const W = words.map(w => { const u = w.startsWith('_'), x = w.replace(/^_/, ''); const sp = h('span', 'w', c, u ? `<span class="z-u">${x}<i></i></span>` : x); sp._u = u ? sp.querySelector('i') : null; return sp; });
      return t => { const out = prog(t, b - .25, .25, io); c.style.display = t < a - .05 || out >= 1 ? 'none' : '';
        W.forEach((sp, i) => { const k = prog(t, a + i * .1, .38, oq); sp.style.opacity = clamp(k * 1.8) * (1 - out); sp.style.filter = k < 1 || out > 0 ? `blur(${(1 - k) * 14 + out * 12}px)` : 'none'; sp.style.transform = `translateY(${(1 - k) * 30 - out * 20}px)`; if (sp._u) sp._u.style.transform = `scaleX(${prog(t, a + i * .1 + .2, .4, oq)})`; }); };
    };
    // ---- worlds: intro (night) + six colour worlds, each with a main copy and two "door" copies for its opening
    const world = (i, par) => { const w = el(par, 'z-w', { background: i < 0 ? NIGHT : COL[i][2] }); if (i >= 0) el(w, 'z-img', { left: '130px', top: '400px', width: '820px', height: '1010px', backgroundImage: `url(${IMG('v-' + COL[i][0] + '.png')})`, filter: 'drop-shadow(0 40px 50px rgba(0,0,30,.35))' }); return w; };
    const MAIN = [-1, 0, 1, 2, 3, 4, 5].map(i => world(i, R)), DOORS = [-1, 0, 1, 2, 3, 4].map(i => [world(i, R), world(i, R)]);
    const JM = MAIN.slice(1).map(w => w.querySelector('.z-img'));
    // zipper teeth: left edge, right edge, closed part
    const SV = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); SV.setAttribute('class', 'z-teeth'); SV.setAttribute('viewBox', '0 0 1080 1920'); R.appendChild(SV);
    SV.innerHTML = ['a', 'b', 'c'].map(k => `<line id="u${k}" stroke="#4b515c" stroke-width="22" stroke-linecap="butt"/><line id="t${k}" stroke="#d6dbe4" stroke-width="18" stroke-dasharray="6 6"/>`).join('');
    const L = k => [SV.querySelector('#u' + k), SV.querySelector('#t' + k)];
    const setL = (k, x1, y1, x2, y2, vis) => L(k).forEach(l => { l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2); l.style.display = vis ? '' : 'none'; });
    const PU = el(R, 'z-pull', {}, PULL);

    // ---- rail phase
    const RAIL = [0, 1].map(r => el(R, '', { position: 'absolute', left: '-20px', right: '-20px', top: (430 + r * 520) + 'px', height: '14px', borderRadius: '7px', background: 'linear-gradient(180deg,#d9dde8,#9aa1b5)', boxShadow: '0 6px 14px rgba(0,0,40,.18)', zIndex: 8 }));
    const SLOT = i => [[60, 390, 720][i % 3], 470 + Math.floor(i / 3) * 520];
    const HJ = COL.map(([f], i) => { const g = el(R, '', { position: 'absolute', width: '300px', height: '440px', zIndex: 9, transformOrigin: '150px 0px' }); el(g, '', { position: 'absolute', left: '90px', top: '-34px' }, HOOK); const im = el(g, 'z-img', { left: '0', top: '40px', width: '300px', height: '380px', backgroundImage: `url(${IMG('v-' + f + '.png')})`, filter: 'drop-shadow(0 20px 24px rgba(0,0,40,.25))' }); g._im = im; return g; });
    // bag
    const BAG = el(R, '', { position: 'absolute', left: '320px', width: '440px', height: '460px', zIndex: 12 });
    const bagBack = el(BAG, '', { position: 'absolute', left: '10px', right: '10px', top: '0', height: '60px', borderRadius: '10px', background: '#d9dde8' });
    const bagFront = el(BAG, '', { position: 'absolute', left: '0', right: '0', top: '40px', bottom: '0', borderRadius: '18px 18px 30px 30px', background: 'linear-gradient(180deg,#ffffff,#eef1f8)', boxShadow: '0 30px 60px rgba(0,0,40,.25)', zIndex: 14 }, `<img src="${IMG('logo-light.svg')}" style="position:absolute;left:60px;top:150px;width:320px;filter:invert(1) hue-rotate(180deg) brightness(.6) saturate(4)">`);
    const handle = el(BAG, '', { position: 'absolute', left: '120px', width: '200px', top: '-80px', height: '140px', border: '10px solid #c9cfdd', borderBottom: 'none', borderRadius: '100px 100px 0 0' });
    const BN = el(BAG, 'z-badge', { right: '-16px', top: '20px', zIndex: 15 }, '0');
    const TAG = el(R, '', { position: 'absolute', width: '220px', height: '120px', zIndex: 40, transformOrigin: '30px 0px', perspective: '900px' });
    const tagIn = el(TAG, '', { position: 'absolute', inset: '0', transformStyle: 'preserve-3d' });
    const face = (back) => el(tagIn, '', { position: 'absolute', inset: '0', borderRadius: '18px', background: back ? BLUE : TEAL, color: back ? '#fff' : INK, display: 'grid', placeItems: 'center', fontWeight: 800, backfaceVisibility: 'hidden', transform: back ? 'rotateY(180deg)' : 'none', boxShadow: '0 16px 40px rgba(0,0,40,.3)', textAlign: 'center', lineHeight: 1.05 });
    const tF = face(false), tB = face(true); const hole = el(TAG, '', { position: 'absolute', left: '22px', top: '50%', width: '18px', height: '18px', marginTop: '-9px', borderRadius: '50%', background: 'rgba(255,255,255,.85)', zIndex: 3 });
    const BIG = el(R, 'z-cap', { top: '500px', fontSize: '340px', fontWeight: 900, letterSpacing: '-.05em', color: INK, zIndex: 35 }, `<span class="w">3</span><span class="w" style="color:${BLUE}">+</span><span class="w" style="color:${TEAL};text-shadow:0 0 50px rgba(92,225,230,.6)">1</span>`);
    const BW = [...BIG.querySelectorAll('.w')];
    // closing doors + end card
    const CL = [el(R, 'z-w', { background: '#0c1749', zIndex: 45 }), el(R, 'z-w', { background: '#0c1749', zIndex: 45 })];
    const LG = el(R, '', { position: 'absolute', left: '190px', top: '520px', width: '700px', zIndex: 55 }, `<img src="${IMG('logo-light.svg')}" style="width:100%;display:block;filter:drop-shadow(0 0 40px rgba(92,225,230,.5))">`);
    const URL = el(R, '', { position: 'absolute', left: '50%', top: '1400px', padding: '22px 44px', borderRadius: '60px', background: '#fff', color: INK, fontSize: '46px', fontWeight: 700, zIndex: 55, whiteSpace: 'nowrap' }, 'elite-maillot.fr');
    const BGL = el(R, 'z-w', { zIndex: 7 }); BGL.style.background = '#e9ecfa';

    const CAPS = [cap(['_Ouvre.'], 1560, 120, T.ouvre, O[0] + .2, '#fff')];
    COL.forEach(([, n, , c], i) => CAPS.push(cap([n + '.'], 1560, 110, O[i] + .35, (O[i + 1] ?? T.rail) + .2, c)));
    CAPS.push(cap(['La', 'veste', 'du', '_Brésil,'], 130, 92, T.rail + .3, T.hes, INK), cap(['en', 'six', 'couleurs.'], 240, 92, T.rail + 1.1, T.hes, INK),
      cap(['Tu', '_hésites', '?'], 1500, 120, T.hes, T.bag + .2, INK), cap(['Prends-en', '_trois…'], 150, 110, T.bag + .2, T.offer, INK),
      cap(['la', '4ème', 'est', '_offerte.'], 150, 110, T.offer, T.close, INK), cap(['3', 'achetées', '=', '1', 'offerte'], 280, 60, T.offer + .5, T.price, BLUE),
      cap(['Le', 'foot,'], 1040, 110, T.end + .6, D + 1, '#fff'), cap(['à', 'ton', '_prix.'], 1170, 110, T.end + .9, D + 1, '#fff'));

    return t => {
      // ---- which opening is running
      let oi = -1; O.forEach((o, i) => { if (t >= o) oi = i; });
      const dur = .6, exit = .18;
      MAIN.forEach((w, i) => { w.style.display = 'none'; w.style.zIndex = 1; }); DOORS.forEach(d => d.forEach(x => { x.style.display = 'none'; }));
      const cur = oi + 1;                   // world index in MAIN (0 = night)
      MAIN[cur].style.display = ''; const phase = oi >= 0 ? t - O[oi] : -1, down = oi % 2 === 0;
      let p = 0, vis = true;
      if (oi >= 0 && phase < dur + exit) {
        const k = io(clamp(phase / dur)); p = down ? lerp(-40, 1960, k) : lerp(1960, -40, k);
        const [dl, dr] = DOORS[oi]; dl.style.display = dr.style.display = ''; dl.style.zIndex = dr.style.zIndex = 3;
        const w = down ? Math.min(560, Math.max(0, p) * .36) : Math.min(560, Math.max(0, 1920 - p) * .36), ek = clamp((phase - dur) / exit);
        if (down) { dl.style.clipPath = `polygon(0 0, ${540 - w}px 0, 540px ${p}px, 540px 1920px, 0 1920px)`; dr.style.clipPath = `polygon(${540 + w}px 0, 1080px 0, 1080px 1920px, 540px 1920px, 540px ${p}px)`; }
        else { dl.style.clipPath = `polygon(0 0, 540px 0, 540px ${p}px, ${540 - w}px 1920px, 0 1920px)`; dr.style.clipPath = `polygon(540px 0, 1080px 0, 1080px 1920px, ${540 + w}px 1920px, 540px ${p}px)`; }
        dl.style.transform = `translateX(${-ek * 700}px)`; dr.style.transform = `translateX(${ek * 700}px)`;
        if (down) { setL('a', 540 - w - ek * 700, -10, 540, p, true); setL('b', 540 + w + ek * 700, -10, 540, p, true); setL('c', 540, p, 540, 1930, true); }
        else { setL('a', 540 - w - ek * 700, 1930, 540, p, true); setL('b', 540 + w + ek * 700, 1930, 540, p, true); setL('c', 540, -10, 540, p, true); }
      } else {
        p = oi < 0 ? lerp(-200, 120, prog(t, .3, .5, bk)) : (down ? 1960 : -40);
        const draw = oi < 0 ? prog(t, .05, .6, io) * 1940 : 1940; setL('a', 0, 0, 0, 0, false); setL('b', 0, 0, 0, 0, false); setL('c', 540, -10, 540, -10 + draw, t < T.rail + .3);
      }
      // jacket inside each world: a slow breath of scale while it's on screen
      if (cur > 0) JM[cur - 1].style.transform = `scale(${1 + clamp((t - O[oi]) / 3) * .04})`;
      const teethFade = 1 - prog(t, T.rail, .4); SV.style.opacity = teethFade;

      // ---- pull path: on the zip, then to the rail, hanger to hanger, then onto the bag/tag, then the closing zip
      let px = 540, py = p, rot = Math.sin(t * 6) * 3, pv = 1;
      if (t >= T.rail - .1) {
        const hx = i => SLOT(i)[0] + 150, hy = i => SLOT(i)[1] - 50;
        const K = [[T.rail - .1, { x: 540, y: -40 }], [T.rail + .6, { x: hx(0), y: hy(0) }, bk], [T.hes, { x: hx(0), y: hy(0) }]];
        [1, 2, 5, 4, 3, 1, 0].forEach((j, n) => K.push([T.hes + .2 + n * .2, { x: hx(j), y: hy(j) }]));
        K.push([T.bag, { x: hx(0), y: hy(0) }]);
        const g = kfo(t, K); px = g.x; py = g.y; rot = Math.sin(t * 5) * 6; pv = 1 - prog(t, T.bag, .3);
      }
      if (t >= T.close) { const ck = prog(t, T.close + .25, .7, io); px = 540; py = lerp(-200, 1960, ck); rot = 0; pv = 1; }
      PU.style.left = px + 'px'; PU.style.top = py + 'px'; PU.style.transform = `rotate(${rot}deg)`; PU.style.opacity = pv; PU.style.display = pv <= 0 ? 'none' : '';

      // ---- rail: background → lavender, rails slide in, jackets swing in on hangers
      const rk = prog(t, T.rail, .6, io); BGL.style.display = rk > 0 ? '' : 'none'; BGL.style.opacity = rk;
      RAIL.forEach((r, i) => { const k = prog(t, T.rail + .1 + i * .1, .5, oq); r.style.display = k > 0 ? '' : 'none'; r.style.transform = `scaleX(${k})`; r.style.opacity = 1 - prog(t, T.offer + .2, .4); });
      const PICK = [0, 2, 4];
      HJ.forEach((g, i) => {
        const [sx, sy] = SLOT(i), a = T.rail + .2 + i * .12, k = prog(t, a, .5, oq); if (k <= 0) { g.style.display = 'none'; return; } g.style.display = '';
        const sw = Math.sin((t - a) * 7) * 18 * Math.exp(-(t - a) * 2.2) * (1 - (i === 5 && t > T.rail ? 0 : 0));
        let x = lerp(i % 3 === 2 ? 1200 : i % 3 === 0 ? -400 : sx, sx, k), y = sy, sc = 1, o = 1, r2 = sw;
        if (i === 5 && t < T.rail + .6) { /* the beige jacket comes from the full-screen world */ const q = prog(t, T.rail, .6, io); x = lerp(130, sx, q); y = lerp(400 - 40, sy, q); sc = lerp(2.73, 1, q); g.style.transformOrigin = '0 0'; } else g.style.transformOrigin = '150px 0px';
        // hesitation: the hovered jacket lifts a little
        const hov = [1, 2, 5, 4, 3, 1, 0].map((j, n) => [j, T.hes + .2 + n * .2]).filter(([j, tt]) => j === i && Math.abs(t - tt) < .15).length; if (hov) sc *= 1.06;
        const pi = PICK.indexOf(i);
        if (pi >= 0 && t > T.drops[pi]) { const q = prog(t, T.drops[pi], .55, E.in || (z => z * z)), bx = 540 - 150, by = T.bagY - 60; x = lerp(sx, bx, q); y = lerp(sy, by, q) - Math.sin(q * Math.PI) * 160; sc = lerp(1, .45, q); r2 = q * (pi % 2 ? 25 : -25); o = 1 - prog(t, T.drops[pi] + .45, .1); }
        if (i === 5 && t > T.offer) { const q = prog(t, T.offer, .6, z => z * z), bx = 540 - 150, by = T.bagY - 60; x = lerp(sx, bx, q); y = lerp(sy, by, q) - Math.sin(q * Math.PI) * 220; sc = lerp(1, .45, q); r2 = q * 15; o = 1 - prog(t, T.offer + .5, .1); }
        if ((i === 1 || i === 3) && t > T.offer - .3) { const q = prog(t, T.offer - .3, .4, io); o = 1 - q; x += (i === 1 ? -1 : 1) * q * 300; }
        g.style.left = x + 'px'; g.style.top = y + 'px'; g.style.opacity = o; g.style.transform = `rotate(${r2}deg) scale(${sc})`; if (o <= 0) g.style.display = 'none';
      });
      // bag rises, counts, bounces on each drop
      const bk2 = prog(t, T.bag, .6, oq), bout = prog(t, T.price + .3, .6, io); BAG.style.display = bk2 > 0 && bout < 1 ? '' : 'none';
      const hits = [...T.drops.map(d => d + .5), T.offer + .55], n = hits.filter(x => t > x).length, last = hits.filter(x => t > x).pop() ?? -9, bb = Math.max(0, 1 - (t - last) / .3);
      BAG.style.top = lerp(1980, T.bagY, bk2) + bout * 900 + 'px'; BAG.style.transform = `scaleY(${1 - bb * .08}) scaleX(${1 + bb * .05})`; BAG.style.transformOrigin = '50% 100%'; BN.textContent = n > 3 ? '+1' : n;
      BN.style.background = n > 3 ? TEAL : BLUE; BN.style.color = n > 3 ? INK : '#fff'; BN.style.transform = `scale(${n ? 1 + bb * .3 : 0})`;
      // "3 + 1"
      const bout2 = prog(t, T.price - .1, .4, io); BIG.style.display = t > T.drops[2] + .4 && bout2 < 1 ? '' : 'none';
      [T.drops[2] + .5, T.offer + .2, T.offer + .55].forEach((a, i) => { const k = prog(t, a, .35, bk); BW[i].style.opacity = clamp(k * 2) * (1 - bout2); BW[i].style.transform = `scale(${lerp(1.8, 1, clamp(k))})`; BW[i].style.filter = k < 1 ? `blur(${(1 - clamp(k)) * 14}px)` : 'none'; });
      // the tag: hangs from the 4th jacket, swings, then flies up, grows and flips
      const tv = t > T.offer + .55; TAG.style.display = tv && t < T.close + .5 ? '' : 'none';
      if (tv) { const sw = Math.sin((t - T.offer - .55) * 8) * 22 * Math.exp(-(t - T.offer - .55) * 1.8), fk = prog(t, T.price, .7, io), flip = prog(t, T.flip, .6, io);
        const x = lerp(700, 240, fk), y = lerp(T.bagY + 20, 760, fk), w = lerp(220, 600, fk), hh = lerp(120, 340, fk);
        Object.assign(TAG.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px', transform: `rotate(${sw * (1 - fk)}deg) translateY(${-prog(t, T.close, .5, io) * 1200}px)` });
        tagIn.style.transform = `rotateY(${flip * 180}deg)`; tF.style.fontSize = lerp(30, 110, fk) + 'px'; tF.innerHTML = fk < .5 ? 'OFFERTE' : `39,99 €<br><span style="font-size:.38em;font-weight:600">la veste</span>`;
        tB.style.fontSize = lerp(30, 64, fk) + 'px'; tB.innerHTML = `<div><span style="font-size:.6em;font-weight:600;opacity:.85">4 vestes</span><br>119,97 €<br><s style="font-size:.5em;opacity:.7">159,96 €</s></div>`; hole.style.opacity = 1 - flip; }
      // ---- close: navy halves zip shut downwards, then logo + tagline + url
      const ck = prog(t, T.close + .25, .7, io), cin = prog(t, T.close, .3, oq); const pz = lerp(-200, 1960, ck), wb = Math.min(560, Math.max(0, 1920 - pz) * .36);
      CL.forEach((c, i) => { c.style.display = cin > 0 ? '' : 'none'; c.style.clipPath = i === 0 ? `polygon(0 0, 540px 0, 540px ${pz}px, ${540 - wb}px 1920px, 0 1920px)` : `polygon(540px 0, 1080px 0, 1080px 1920px, ${540 + wb}px 1920px, 540px ${pz}px)`; c.style.transform = `translateX(${(i ? 1 : -1) * (1 - cin) * 600}px)`; });
      if (t > T.close) { SV.style.opacity = 1; setL('a', 540 - wb, 1930, 540, pz, true); setL('b', 540 + wb, 1930, 540, pz, true); setL('c', 540, -10, 540, pz, true); SV.style.zIndex = 46; PU.style.zIndex = 47; } else { SV.style.zIndex = 20; PU.style.zIndex = 30; }
      const lk = prog(t, T.end, .9, io); LG.style.display = t > T.end ? '' : 'none'; LG.style.clipPath = `inset(0 ${(1 - lk) * 100}% 0 0)`;
      const uk = prog(t, T.end + 1.5, .45, bk); URL.style.display = uk > 0 ? '' : 'none'; URL.style.transform = `translateX(-50%) scale(${uk})`;
      if (t > T.end) { const ek = prog(t, T.end, .5); SV.style.opacity = 1 - ek; PU.style.opacity = 1 - ek; }
      CAPS.forEach(f => f(t));
    };
  };
})();
