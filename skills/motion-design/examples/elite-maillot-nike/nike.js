// Élite Maillot — sportswear-ad style (black stage, studio light, haze, massive condensed uppercase type), 9:16.
// Shots are cut on the beat (90 BPM): "TON CLUB." · Real under a spotlight with its name huge behind · "TES COULEURS."
// · rapid fire, one jersey per beat (Barça, PSG, City, Arsenal, Milan, Argentine) · "PORTE-LE." · the offer: three
// jerseys slam in a row, "3 ACHETÉS.", "LE 4ÈME", a stop, "OFFERT." with the fourth falling into the light · the
// logo revealed by a light sweep, "PORTE TES COULEURS.", the url.
(() => {
  const { SCENES, h, clamp, lerp, E, prog, rel } = window.MOTION;
  const IMG = f => rel('assets/img/' + f);
  const oq = E.outQuint, io = E.inOut;
  const CSS = `
  @font-face { font-family: ArchivoN; src: url(../../short-editing/engine/fonts/Archivo.ttf); font-weight: 100 900; font-stretch: 62% 125%; }
  .nk { position:absolute; inset:0; overflow:hidden; background:#000; font-family: ArchivoN, Inter, sans-serif; color:#fff; }
  .nk .n-sc { position:absolute; inset:0; overflow:hidden; display:none; }
  .nk .n-big { position:absolute; left:0; right:0; text-align:center; font-weight: 900; font-variation-settings: 'wdth' 62, 'wght' 900; text-transform: uppercase; line-height: .84; letter-spacing: -.01em; white-space: nowrap; }
  .nk .n-out { color: transparent; -webkit-text-stroke: 3px rgba(255,255,255,.22); }
  .nk .n-small { position:absolute; left: 70px; font-family: Inter; font-weight: 700; font-size: 30px; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,.75); white-space: nowrap; }
  .nk .n-spot { position:absolute; left: 50%; top: -200px; width: 1400px; height: 2000px; margin-left: -700px; background: radial-gradient(40% 55% at 50% 0%, rgba(255,255,255,.28), rgba(255,255,255,.08) 45%, transparent 70%); filter: blur(34px); clip-path: polygon(38% 0, 62% 0, 100% 100%, 0 100%); }
  .nk .n-pool { position:absolute; left: 50%; width: 900px; height: 180px; margin-left: -450px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.22), transparent); filter: blur(10px); }
  .nk .n-haze { position:absolute; border-radius: 50%; background: radial-gradient(closest-side, rgba(200,210,230,.10), transparent); filter: blur(30px); }
  .nk .n-dust { position:absolute; width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,.7); }
  .nk .n-jer { position:absolute; background: center/contain no-repeat; }
  .nk .n-ref { position:absolute; background: center/contain no-repeat; transform: scaleY(-1); opacity: .18; -webkit-mask: linear-gradient(0deg, rgba(0,0,0,.9), transparent 45%); }
  .nk .n-flash { position:absolute; inset:0; background:#fff; z-index: 80; pointer-events:none; }
  .nk .n-vig { position:absolute; inset:0; z-index: 70; pointer-events:none; background: radial-gradient(100% 70% at 50% 45%, transparent 50%, rgba(0,0,0,.8)); }
  .nk .n-bars { position:absolute; left:0; right:0; height: 0; background:#000; z-index: 75; }
  `;

  SCENES.nike = (s, root) => {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const R = h('div', 'nk', root), C = s.cuts, B = 60 / 90;
    const el = (par, cls, css = {}, html = '') => { const e = h('div', cls, par, html); Object.assign(e.style, css); return e; };
    const stage = (par, spotY = 0) => {   // spotlight + pool + haze + dust: the studio
      const sp = el(par, 'n-spot', { top: (spotY - 200) + 'px' }), pool = el(par, 'n-pool', { top: (spotY + 1450) + 'px' });
      const hz = [0, 1, 2].map(i => el(par, 'n-haze', { width: '900px', height: '600px', left: [-200, 400, 100][i] + 'px', top: [500, 900, 1300][i] + 'px' }));
      const du = Array.from({ length: 26 }, (_, i) => { const d = el(par, 'n-dust'); d._x = 300 + ((i * 97) % 480); d._y = (i * 173) % 1500 + 200; d._s = .3 + (i % 5) * .15; return d; });
      return t => { sp.style.opacity = .85 + .15 * Math.sin(t * 7) * Math.sin(t * 3.1); hz.forEach((x, i) => { x.style.transform = `translate(${Math.sin(t * .3 + i * 2) * 120}px, ${Math.cos(t * .25 + i) * 60}px)`; });
        du.forEach((d, i) => { d.style.left = d._x + Math.sin(t * .7 + i) * 30 + 'px'; d.style.top = ((d._y - t * 40 * d._s) % 1500 + 1500) % 1500 + 200 + 'px'; d.style.opacity = .25 + .5 * Math.abs(Math.sin(t + i)); }); };
    };
    // massive word that slams in (scale from big, blur → sharp), optional letter stagger
    const slam = (e, t, a, from = 1.35) => { const k = prog(t, a, .28, oq); e.style.opacity = clamp(k * 2.5); e.style.transform = `scale(${lerp(from, 1, k)})`; e.style.filter = k < 1 ? `blur(${(1 - k) * 16}px)` : 'none'; return k; };
    const jersey = (par, f, x, y, w) => { const j = el(par, 'n-jer', { left: x + 'px', top: y + 'px', width: w + 'px', height: w + 'px', backgroundImage: `url(${IMG(f + '.png')})`, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.8)) drop-shadow(0 0 2px rgba(255,255,255,.5)) contrast(1.08)' }); const r = el(par, 'n-ref', { left: x + 'px', top: (y + w - 40) + 'px', width: w + 'px', height: w + 'px', backgroundImage: `url(${IMG(f + '.png')})` }); return [j, r]; };
    const U = [];

    // 1 "TON CLUB."
    { const sc = el(R, 'n-sc'), a = C[0], st2 = stage(sc);
      const w = el(sc, 'n-big', { top: '640px', fontSize: '440px' }, 'TON<br>CLUB.');
      U.push([sc, t => { st2(t); slam(w, t, a + .25, 1.6); w.style.letterSpacing = lerp(.08, -.01, prog(t, a + .25, 1.2, oq)) + 'em'; }]); }
    // 2 Real under the spotlight, its name huge behind
    const jshot = (f, name, sub, a, dur) => {
      const sc = el(R, 'n-sc'), st2 = stage(sc);
      const bg = el(sc, 'n-big n-out', { top: '520px', fontSize: '420px' }, name), bg2 = el(sc, 'n-big n-out', { top: '880px', fontSize: '420px' }, name);
      const [j, r] = jersey(sc, f, 140, 520, 800);
      const lab = el(sc, 'n-small', { top: '1640px' }, sub);
      U.push([sc, t => { st2(t); const dt = t - a, k = prog(t, a, .3, oq);
        bg.style.transform = `translateX(${200 - dt * 260}px)`; bg2.style.transform = `translateX(${-400 + dt * 260}px)`;
        const sx = 1 + Math.sin(dt * 2) * .015; j.style.transform = `translateY(${(1 - k) * 80}px) scale(${lerp(1.15, 1, k) * (1 + dt * .03)}) scaleX(${sx})`; j.style.opacity = clamp(k * 2); r.style.opacity = .18 * k;
        const lk = prog(t, a + .15, .35, oq); lab.style.opacity = lk; lab.style.letterSpacing = lerp(.5, .28, lk) + 'em'; }]);
    };
    jshot('real', 'REAL MADRID', 'Real Madrid · domicile 26/27', C[1], C[2] - C[1]);
    // 3 "TES COULEURS." over split colour bands
    { const sc = el(R, 'n-sc'), a = C[2];
      const bands = ['#ffffff', '#a50044', '#004d98', '#e30613', '#6cabdd', '#ef0107'].map((c, i) => el(sc, '', { position: 'absolute', left: (i * 180) + 'px', top: '0', width: '180px', height: '1920px', background: c, transformOrigin: '50% 0' }));
      const shade = el(sc, '', { position: 'absolute', inset: '0', background: 'linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.2) 50%, rgba(0,0,0,.65))' });
      const w = el(sc, 'n-big', { top: '780px', fontSize: '260px', textShadow: '0 10px 60px rgba(0,0,0,.6)' }, 'TES<br>COULEURS.');
      U.push([sc, t => { bands.forEach((b, i) => { const k = prog(t, a + i * .05, .35, oq); b.style.transform = `scaleY(${k})`; }); slam(w, t, a + .3, 1.4); }]); }
    // 4 rapid fire, one jersey per beat
    s.rapid.forEach(([f, name, sub], i) => jshot(f, name, sub, C[3] + i * B, B));
    // 5 "PORTE-LE." over a back-lit silhouette
    { const sc = el(R, 'n-sc'), a = C[4], st2 = stage(sc, -100);
      const sil = el(sc, 'n-jer', { left: '90px', top: '420px', width: '900px', height: '900px', backgroundImage: `url(${IMG('psg.png')})`, filter: 'brightness(0) drop-shadow(0 0 30px rgba(120,160,255,.9)) drop-shadow(0 0 80px rgba(80,120,255,.6))' });
      const w = el(sc, 'n-big', { top: '1360px', fontSize: '280px' }, 'PORTE-LE.');
      U.push([sc, t => { st2(t); const k = prog(t, a, 1.6, io); sil.style.transform = `scale(${lerp(1.1, 1, k)})`; sil.style.filter = `brightness(${lerp(0, .35, prog(t, a + .8, 1.2, io))}) drop-shadow(0 0 30px rgba(120,160,255,.9)) drop-shadow(0 0 80px rgba(80,120,255,.6))`; slam(w, t, a + .6, 1.5); }]); }
    // 6 the offer
    { const sc = el(R, 'n-sc'), a = C[5], st2 = stage(sc), O = s.offer;
      const J3 = [['arsenal', 20], ['milan', 360], ['argentine', 700]].map(([f, x]) => jersey(sc, f, x, 880, 360));
      const w1 = el(sc, 'n-big', { top: '420px', fontSize: '250px' }, '3 ACHETÉS.');
      const w2 = el(sc, 'n-big', { top: '420px', fontSize: '250px' }, 'LE 4ÈME');
      const w3 = el(sc, 'n-big', { top: '360px', fontSize: '330px', color: '#5ce1e6', textShadow: '0 0 60px rgba(92,225,230,.55)' }, 'OFFERT.');
      const [j4, r4] = jersey(sc, 'bresil', 190, 760, 700);
      const burst = el(sc, '', { position: 'absolute', left: '50%', top: '1100px', width: '1600px', height: '1600px', margin: '-800px', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(92,225,230,.45), rgba(92,225,230,.08) 45%, transparent)', mixBlendMode: 'screen' });
      U.push([sc, t => { st2(t); const big = t >= O.off;
        J3.forEach(([j, r], i) => { const k = prog(t, O.j[i], .25, oq), out = prog(t, O.off - .05, .25, io); j.style.opacity = clamp(k * 3) * (1 - out); r.style.opacity = .18 * k * (1 - out); j.style.transform = `translateY(${(1 - k) * -300}px) scale(${lerp(1.3, 1, k)})`; });
        const v1 = t >= O.w1 && t < O.w2; w1.style.display = v1 ? '' : 'none'; if (v1) slam(w1, t, O.w1);
        const v2 = t >= O.w2 && t < O.stop; w2.style.display = v2 ? '' : 'none'; if (v2) slam(w2, t, O.w2);
        w3.style.display = big ? '' : 'none'; if (big) slam(w3, t, O.off, 1.8);
        const fk = prog(t, O.off, .45, E.back); j4.style.display = r4.style.display = big ? '' : 'none'; j4.style.transform = `translateY(${(1 - fk) * -900}px) rotate(${(1 - fk) * 12}deg)`; r4.style.opacity = .18 * fk;
        const bk = clamp((t - O.off) / 1.2); burst.style.opacity = big ? (1 - bk) : 0; burst.style.transform = `scale(${.3 + bk * .9})`;
        sc.style.background = t >= O.stop && t < O.off ? '#000' : ''; }]); }
    // 7 logo revealed by a light sweep
    { const sc = el(R, 'n-sc'), a = C[6], st2 = stage(sc, 200);
      const lg = el(sc, '', { position: 'absolute', left: '170px', top: '640px', width: '740px' }, `<img src="${IMG('logo-light.svg')}" style="width:100%;display:block">`);
      const sweep = el(lg, '', { position: 'absolute', top: '-20%', bottom: '-20%', width: '35%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.85), transparent)', mixBlendMode: 'overlay', filter: 'blur(6px)' });
      const tg = el(sc, 'n-big', { top: '1200px', fontSize: '120px' }, 'PORTE TES COULEURS.');
      const url = el(sc, 'n-small', { left: '0', right: '0', textAlign: 'center', top: '1400px', fontSize: '36px' }, 'elite-maillot.fr');
      U.push([sc, t => { st2(t); const k = prog(t, a + .2, 1.4, io); lg.style.opacity = k; lg.style.filter = `brightness(${lerp(0, 1, k)}) drop-shadow(0 0 ${30 * k}px rgba(92,225,230,.5))`; lg.style.transform = `scale(${lerp(1.08, 1, prog(t, a, 2.5, oq))})`;
        sweep.style.left = lerp(-40, 120, prog(t, a + 1.2, 1.0, io)) + '%'; slam(tg, t, a + 1.9, 1.25); const uk = prog(t, a + 2.6, .6, oq); url.style.opacity = uk; url.style.letterSpacing = lerp(.6, .3, uk) + 'em'; }]); }

    const flash = el(R, 'n-flash'); el(R, 'n-vig');
    const bt = el(R, 'n-bars', { top: '0' }), bb = el(R, 'n-bars', { bottom: '0' });
    const CUTS = s.allCuts;
    return t => {
      let idx = 0; for (let i = 0; i < CUTS.length; i++) if (t >= CUTS[i]) idx = i;
      U.forEach(([sc]) => { sc.style.display = 'none'; });
      U[idx][0].style.display = 'block'; U[idx][1](t);
      // impact: short white flash and a small shake on every cut
      const since = t - CUTS[idx], sh = idx > 0 ? Math.max(0, 1 - since / .25) : 0;
      flash.style.opacity = idx > 0 ? Math.max(0, .55 - since * 5) : 0;
      U[idx][0].style.transform = sh > 0 ? `translate(${Math.sin(since * 90) * 14 * sh}px, ${Math.cos(since * 70) * 10 * sh}px)` : '';
      const lb = 120 * (1 - prog(t, s.cuts[6], .8, io)); bt.style.height = bb.style.height = lb + 'px';
    };
  };
})();
