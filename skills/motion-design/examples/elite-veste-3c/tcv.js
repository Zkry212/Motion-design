// Élite Maillot — Brésil jackets in the Trois Coups look: royal-blue stage with light streaks, white cards floating in
// depth with focus blur, big words in glowing pills, small pills around, and ONE camera that keeps flying forward
// through the layers (no cut): each stop builds in, the previous one passes behind the camera.
//  stop 0 "Une veste." · 1 "Six couleurs." (chips, the big jacket swaps) · 2 "une. deux. trois." (cart slots fill)
//  · 3 "+1 offerte" · 4 totals 159,96 → 119,97 · 5 logo, "Le foot, à ton prix.", url.
(() => {
  const { SCENES, h, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f);
  const oq = E.outQuint, io = E.inOut, bk = E.back;
  const BLUE = '#2347e0', INK = '#0d1a4a', TEAL = '#5ce1e6';
  const COL = [['rose', 'Rose'], ['ciel', 'Bleu ciel'], ['nuit', 'Bleu nuit'], ['noir', 'Noir'], ['vert', 'Vert'], ['beige', 'Beige']];
  const CSS = `
  .tv { position:absolute; inset:0; overflow:hidden; font-family: Inter, system-ui, sans-serif; background: radial-gradient(90% 60% at 50% 42%, #5577ff 0%, #2a4fe6 45%, #1530a8 100%); }
  .tv .v-streak { position:absolute; left:-40%; width: 180%; height: 380px; filter: blur(40px); background: linear-gradient(180deg, transparent, rgba(255,255,255,.16), transparent); }
  .tv .v-stage { position:absolute; inset:0; perspective: 1400px; perspective-origin: 540px 960px; }
  .tv .v-world { position:absolute; inset:0; transform-style: preserve-3d; }
  .tv .v-g { position:absolute; left:0; top:0; width:1080px; height:1920px; transform-style: preserve-3d; }
  .tv .v-card { position:absolute; background:#fff; border-radius: 40px; box-shadow: 0 40px 90px rgba(0,10,80,.35); overflow:hidden; }
  .tv .v-img { position:absolute; background: center/contain no-repeat; }
  .tv .v-cap { position:absolute; left:0; right:0; text-align:center; color:#fff; font-weight: 700; letter-spacing: -.035em; line-height: 1.06; white-space: nowrap; text-shadow: 0 0 30px rgba(255,255,255,.3); }
  .tv .v-cap .w { display:inline-block; margin: 0 .11em; }
  .tv .v-pill { display:inline-block; padding: .04em .42em .1em; border-radius: 1em; border: 6px solid #fff; }
  .tv .v-u { position:relative; display:inline-block; } .tv .v-u > i { position:absolute; left:1%; right:1%; bottom:-.1em; height:.07em; border-radius:.04em; background:#fff; transform-origin: 0 50%; }
  .tv .v-chip { position:absolute; padding: 16px 30px; border-radius: 40px; font-size: 38px; font-weight: 600; color:#fff; background: rgba(255,255,255,.16); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.4), 0 10px 30px rgba(0,0,40,.25); white-space: nowrap; }
  .tv .v-badge { position:absolute; width: 60px; height: 60px; border-radius: 50%; background: ${BLUE}; color:#fff; font-size: 30px; font-weight: 800; display:grid; place-items:center; box-shadow: 0 0 0 6px #fff; }
  .tv .v-bokeh { position:absolute; border-radius: 26px; background: rgba(255,255,255,.85); box-shadow: 0 20px 50px rgba(0,0,60,.3); }
  `;

  SCENES.tcv = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'tv', root), T = s.t, Z = s.z, D = s.duration;
    const el = (par, cls, css = {}, html = '') => { const e = h('div', cls, par, html); Object.assign(e.style, css); return e; };
    const kfv = (t, K) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [t0, a] = K[i - 1], [t1, b] = K[i]; return lerp(a, b, io((t - t0) / (t1 - t0))); } return K[K.length - 1][1]; };
    const SK = [0, 1, 2].map(i => el(R, 'v-streak', { top: (300 + i * 600) + 'px', transform: `rotate(${-14 + i * 6}deg)` }));
    const stage = el(R, 'v-stage'), world = el(stage, 'v-world');
    // every 3D thing: [element, z]; blur/opacity from its distance to the camera
    const DEP = [];
    const group = z => { const g = el(world, 'v-g'); g.style.transform = `translateZ(${z}px)`; DEP.push([g, z]); return g; };
    const cap = (par, words, y, size, a) => { const c = el(par, 'v-cap', { top: y + 'px', fontSize: size + 'px' });
      const W = words.map(w => { const p = w.startsWith('*'), u = w.startsWith('_'), x = w.replace(/^[*_]/, ''); const sp = h('span', 'w', c, p ? `<span class="v-pill">${x}</span>` : u ? `<span class="v-u">${x}<i></i></span>` : x); sp._p = p ? sp.firstChild : null; sp._u = u ? sp.querySelector('i') : null; return sp; });
      c._f = t => W.forEach((sp, i) => { const k = prog(t, a + i * .1, .4, oq); sp.style.opacity = clamp(k * 1.8); sp.style.filter = k < 1 ? `blur(${(1 - k) * 14}px)` : 'none'; sp.style.transform = `translateY(${(1 - k) * 30}px)`;
        if (sp._p) { const q = prog(t, a + i * .1 + .1, .45, bk); sp._p.style.boxShadow = `0 0 ${30 * q}px rgba(255,255,255,${.8 * q}), inset 0 0 ${26 * q}px rgba(255,255,255,${.5 * q})`; sp._p.style.borderColor = `rgba(255,255,255,${q})`; }
        if (sp._u) sp._u.style.transform = `scaleX(${prog(t, a + i * .1 + .2, .4, oq)})`; }); return c; };
    const chip = (par, txt, x, y, a) => { const c = el(par, 'v-chip', { left: x + 'px', top: y + 'px' }, txt); c._f = t => { const k = prog(t, a, .5, oq); c.style.opacity = clamp(k * 1.5) * .9; c.style.transform = `translateY(${(1 - k) * 40 + Math.sin(t * 1.3 + x) * 8}px)`; }; return c; };
    const F = [];   // per-frame animators

    // bokeh: blank cards scattered in depth, they stream past the camera
    for (let i = 0; i < 34; i++) { const z = -200 - i * 260, side = i % 2 ? 1 : -1; const b = el(world, 'v-bokeh', { left: (side > 0 ? 760 + (i * 53) % 260 : 20 + (i * 71) % 220) + 'px', top: (180 + (i * 337) % 1560) + 'px', width: (140 + (i * 37) % 120) + 'px', height: (100 + (i * 29) % 90) + 'px' }); b.style.transform = `translateZ(${z}px) rotateY(${side * -18}deg)`; DEP.push([b, z, true]); }

    // ---- stop 0: one jacket
    { const g = group(Z[0]); const cd = el(g, 'v-card', { left: '230px', top: '560px', width: '620px', height: '760px', transform: 'rotateY(-10deg)' }); const im = el(cd, 'v-img', { inset: '40px', backgroundImage: `url(${IMG('v-rose.png')})` });
      const c1 = cap(g, ['Une', '*veste.'], 300, 130, T.s0); const ch = [chip(g, 'Brésil', 70, 1420, T.s0 + .5), chip(g, '39,99 €', 720, 1460, T.s0 + .6), chip(g, 'Taille M', 120, 1600, T.s0 + .7)];
      F.push(t => { const k = prog(t, T.s0 - .2, .7, oq); cd.style.opacity = k; cd.style.transform = `rotateY(${lerp(-30, -10, k) + Math.sin(t * .8) * 3}deg) translateY(${(1 - k) * 100}px)`; c1._f(t); ch.forEach(c => c._f(t)); }); }
    // ---- stop 1: six colours (chips row, the big jacket swaps on each word)
    { const g = group(Z[1]); const cd = el(g, 'v-card', { left: '240px', top: '420px', width: '600px', height: '720px' }); const JI = COL.map(([f]) => el(cd, 'v-img', { inset: '36px', backgroundImage: `url(${IMG('v-' + f + '.png')})` }));
      const c1 = cap(g, ['Six', '*couleurs.'], 190, 120, T.s1);
      const CH = COL.map(([f], i) => { const c = el(g, 'v-card', { left: (45 + i * 168) + 'px', top: '1260px', width: '150px', height: '190px', borderRadius: '24px' }); el(c, 'v-img', { inset: '12px', backgroundImage: `url(${IMG('v-' + f + '.png')})` }); return c; });
      const name = el(g, 'v-cap', { top: '1520px', fontSize: '90px' });
      const ring = el(g, '', { position: 'absolute', top: '1250px', width: '170px', height: '210px', borderRadius: '30px', border: '6px solid #fff', boxShadow: '0 0 30px rgba(255,255,255,.8)' });
      F.push(t => { c1._f(t); let ci = 0; T.colors.forEach((c, i) => { if (t >= c) ci = i; }); const since = t - T.colors[ci];
        JI.forEach((im, i) => { im.style.opacity = i === ci ? 1 : 0; }); JI[ci].style.transform = `scale(${lerp(.88, 1, E.outQuint(clamp(since / .35)))})`;
        CH.forEach((c, i) => { const k = prog(t, T.s1 + .2 + i * .07, .45, bk); c.style.opacity = clamp(k * 2); c.style.transform = `translateY(${(1 - k) * 60 - (i === ci && t > T.colors[0] ? 16 : 0)}px)`; });
        const rx = kfv(t, T.colors.map((c, i) => [c, 35 + i * 168])); ring.style.left = rx + 'px'; ring.style.opacity = prog(t, T.colors[0] - .1, .2);
        name.textContent = t >= T.colors[0] ? COL[ci][1] : ''; const nk = E.outQuint(clamp(since / .35)); name.style.opacity = nk; name.style.filter = nk < 1 ? `blur(${(1 - nk) * 10}px)` : 'none'; cd.style.transform = `rotateY(${Math.sin(t * .8) * 4}deg)`; }); }
    // ---- stop 2: une. deux. trois. — three jackets drop into the cart's slots
    { const g = group(Z[2]); const W = ['une.', 'deux.', 'trois.'].map((x, i) => { const e = el(g, 'v-cap', { left: (60 + i * 330) + 'px', right: 'auto', width: '300px', textAlign: 'center', top: '420px', fontSize: '110px' }, `<span class="v-u">${x}<i></i></span>`); e._u = e.querySelector('i'); return e; });
      const cart = el(g, 'v-card', { left: '120px', top: '760px', width: '840px', height: '880px' }); el(cart, '', { position: 'absolute', left: '50px', top: '40px', fontSize: '60px', fontWeight: 800, color: INK }, 'Panier');
      const SL = [0, 1, 2, 3].map(i => el(cart, '', { position: 'absolute', left: (50 + (i % 2) * 380) + 'px', top: (160 + Math.floor(i / 2) * 340) + 'px', width: '360px', height: '310px', borderRadius: '28px', border: '4px dashed #cfd6f2' }));
      const PK = [0, 2, 4].map((ci, i) => { const j = el(cart, 'v-img', { left: (60 + (i % 2) * 380) + 'px', top: (170 + Math.floor(i / 2) * 340) + 'px', width: '340px', height: '290px', backgroundImage: `url(${IMG('v-' + COL[ci][0] + '.png')})` }); j._b = el(cart, 'v-badge', { left: (50 + (i % 2) * 380 + 310) + 'px', top: (160 + Math.floor(i / 2) * 340 - 18) + 'px' }, i + 1); return j; });
      const q = el(cart, '', { position: 'absolute', left: '430px', top: '500px', width: '360px', height: '310px', display: 'grid', placeItems: 'center', fontSize: '160px', fontWeight: 800, color: '#cfd6f2' }, '?');
      F.push(t => { W.forEach((w, i) => { const a = T.adds[i], k = prog(t, a, .4, oq), on = i === [0, 1, 2].filter(j => t >= T.adds[j]).pop(); w.style.opacity = clamp(k * 1.8) * (on ? 1 : .45); w.style.filter = k < 1 ? `blur(${(1 - k) * 14}px)` : 'none'; w.style.transform = `translateY(${(1 - k) * 30}px)`; w._u.style.transform = `scaleX(${prog(t, a + .2, .4, oq)})`; });
        const ck = prog(t, T.s2 - .2, .6, oq); cart.style.opacity = ck; cart.style.transform = `rotateX(${lerp(25, 6, ck)}deg) translateY(${(1 - ck) * 120}px)`;
        PK.forEach((j, i) => { const k = prog(t, T.adds[i], .5, bk); j.style.opacity = clamp(k * 2); j.style.transform = `translateY(${(1 - k) * -500}px) rotate(${(1 - k) * (i % 2 ? 14 : -14)}deg)`; j._b.style.transform = `scale(${prog(t, T.adds[i] + .3, .35, bk)})`; });
        q.style.opacity = prog(t, T.fourth, .3) * (0.6 + .4 * Math.sin(t * 6)); }); }
    // ---- stop 3: +1 offerte
    { const g = group(Z[3]); const c1 = cap(g, ['La', '4ème', '?'], 260, 120, T.fourth + .1);
      const plus = el(g, 'v-cap', { top: '620px', fontSize: '360px', fontWeight: 900, color: TEAL, textShadow: '0 0 60px rgba(92,225,230,.7)' }, '+1');
      const cd = el(g, 'v-card', { left: '300px', top: '1060px', width: '480px', height: '560px' }); el(cd, 'v-img', { inset: '30px', backgroundImage: `url(${IMG('v-beige.png')})` });
      const rib = el(g, '', { position: 'absolute', left: '600px', top: '1040px', padding: '14px 28px', borderRadius: '18px', background: TEAL, color: INK, fontSize: '44px', fontWeight: 800, transform: 'rotate(8deg)' }, 'OFFERTE');
      const c2 = cap(g, ['*Offerte.'], 1700, 110, T.offer + .2);
      const burst = el(g, '', { position: 'absolute', left: '540px', top: '1340px', width: '1400px', height: '1400px', margin: '-700px', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(92,225,230,.5), rgba(92,225,230,0))' });
      F.push(t => { c1._f(t); c2._f(t); const pk = prog(t, T.offer, .45, bk); plus.style.opacity = clamp(pk * 2); plus.style.transform = `scale(${lerp(1.8, 1, clamp(pk))})`; plus.style.filter = pk < 1 ? `blur(${(1 - clamp(pk)) * 14}px)` : 'none';
        const ck = prog(t, T.offer + .1, .55, bk); cd.style.opacity = clamp(ck * 2); cd.style.transform = `translateY(${(1 - ck) * -700}px) rotate(${(1 - ck) * 12}deg)`; rib.style.transform = `rotate(8deg) scale(${prog(t, T.offer + .5, .35, bk)})`;
        const bu = clamp((t - T.offer - .55) / 1.0); burst.style.opacity = bu > 0 && bu < 1 ? 1 - bu : 0; burst.style.transform = `scale(${.2 + bu})`; }); }
    // ---- stop 4: totals
    { const g = group(Z[4]); const c1 = cap(g, ['4', '_vestes'], 330, 120, T.total - .3);
      const old = el(g, 'v-cap', { top: '620px', fontSize: '100px', opacity: .7 }, '159,96 €'); const strike = el(g, '', { position: 'absolute', left: '330px', width: '420px', top: '683px', height: '10px', borderRadius: '5px', background: '#fff', transformOrigin: '0 50%' });
      const nw = el(g, 'v-cap', { top: '800px', fontSize: '190px' }, '<span class="v-pill" style="font-variant-numeric:tabular-nums">159,96 €</span>'); const nwp = nw.firstChild;
      const ch = [chip(g, 'Rose', 90, 1130, T.total + .4), chip(g, 'Bleu nuit', 640, 1110, T.total + .5), chip(g, 'Vert', 140, 1290, T.total + .6), chip(g, 'Beige · offerte', 560, 1290, T.total + .7)];
      const c2 = cap(g, ['au', 'lieu', 'de', '_159,96 €'], 1480, 80, T.instead);
      F.push(t => { c1._f(t); c2._f(t); ch.forEach(c => c._f(t)); const ok = prog(t, T.total, .4, oq); old.style.opacity = .7 * ok; strike.style.transform = `scaleX(${prog(t, T.total + .9, .35, oq)})`;
        const k = prog(t, T.total + .3, 1.2, io); nwp.textContent = lerp(159.96, 119.97, k).toFixed(2).replace('.', ',') + ' €'; const nk = prog(t, T.total + .2, .45, bk); nw.style.opacity = clamp(nk * 2); nw.style.transform = `scale(${lerp(.6, 1, clamp(nk))})`; const q = clamp(nk); nwp.style.boxShadow = `0 0 ${30 * q}px rgba(255,255,255,${.8 * q}), inset 0 0 ${26 * q}px rgba(255,255,255,${.5 * q})`; }); }
    // ---- stop 5: end card
    { const g = group(Z[5]); const lg = el(g, '', { position: 'absolute', left: '190px', top: '520px', width: '700px' }, `<img src="${IMG('logo-light.svg')}" style="width:100%;display:block;filter:drop-shadow(0 0 30px rgba(92,225,230,.6)) drop-shadow(0 10px 30px rgba(0,0,60,.4))">`);
      const c1 = cap(g, ['Le', 'foot,'], 1040, 110, T.end + .6), c2 = cap(g, ['à', 'ton', '*prix.'], 1170, 110, T.end + .9);
      const url = el(g, '', { position: 'absolute', left: '50%', top: '1430px', padding: '22px 44px', borderRadius: '60px', background: '#fff', color: INK, fontSize: '46px', fontWeight: 700, whiteSpace: 'nowrap' }, 'elite-maillot.fr');
      F.push(t => { const k = prog(t, T.end, .9, io); lg.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`; c1._f(t); c2._f(t); const uk = prog(t, T.end + 1.6, .45, bk); url.style.transform = `translateX(-50%) scale(${uk})`; }); }

    return t => {
      const c = kfv(t, s.cam);   // camera z (negative = deeper)
      world.style.transform = `rotateX(${Math.sin(t * .3) * 1.2}deg) rotateY(${Math.sin(t * .23) * 1.6}deg) translateZ(${-c}px)`;
      DEP.forEach(([e, z, bok]) => { const d = z - c;   // >0: in front of the focus plane (towards the viewer)
        const vis = d < 1150 && d > -4200; e.style.display = vis ? '' : 'none'; if (!vis) return;
        const bl = Math.min(22, Math.abs(d) / (bok ? 55 : 70)); const base = bok ? (e._t || (e._t = e.style.transform)) : `translateZ(${z}px)`;
        e.style.filter = bl > .4 ? `blur(${bl.toFixed(1)}px)` : 'none'; e.style.opacity = (d > 800 ? 1 - (d - 800) / 350 : d < -2600 ? 1 - (-2600 - d) / 1600 : 1) * (bok ? .55 : 1); });
      SK.forEach((k, i) => { k.style.transform = `translateX(${Math.sin(t * .2 + i) * 200 + c * .05}px) rotate(${-14 + i * 6}deg)`; });
      F.forEach(f => f(t));
    };
  };
})();
