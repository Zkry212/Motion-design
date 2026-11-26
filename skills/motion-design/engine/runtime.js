// Motion runtime: a deterministic, seekable timeline. Every scene is a pure function of time t (seconds),
// so the renderer can ask for any frame in any order (window.seek(t)) and get the exact same pixels.
// The look comes from the 7 reference ads (see ../references/style-guide.md): dark stage with a warm or cold glow,
// words that arrive one by one out of a blur, glass UI cards, a prompt that types, a cursor that clicks,
// a slow camera push with depth of field, a logo reveal, a bright accent word.
(() => {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const E = {
    out: k => 1 - Math.pow(1 - k, 3),
    outQuint: k => 1 - Math.pow(1 - k, 5),
    inOut: k => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    expo: k => (k === 1 ? 1 : 1 - Math.pow(2, -10 * k)),
    back: k => { const c = 1.6; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
  };
  const prog = (t, start, dur, ease = E.out) => ease(clamp((t - start) / dur));
  const h = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; parent && parent.appendChild(e); return e; };
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  // in/out envelope of a scene: 0 before, 1 while on, fades on the edges
  const env = (t, s, fi = .35, fo = .35) => Math.min(prog(t, s.at, fi, E.out), 1 - prog(t, s.at + s.dur - fo, fo, E.inOut));

  // ---------- words: each word rises out of a blur, one after the other (refs: robimotion, xzecreative, troiscoups)
  // text: "See what your friends are *playing.*" -> words between * * take the accent color
  function wordsEl(parent, text, cls = '') {
    const box = h('div', 'words ' + cls, parent);
    const parts = text.split(/\s+/).filter(Boolean).map(w => {
      const acc = /^\*.*\*$/.test(w) || /^\*/.test(w) || /\*$/.test(w);
      const span = h('span', 'w' + (acc ? ' acc' : ''), box, esc(w.replace(/\*/g, '')));
      return span;
    });
    // words between a *start and an end* are all accented
    let inAcc = false; text.split(/\s+/).filter(Boolean).forEach((w, i) => { if (w.startsWith('*')) inAcc = true; if (inAcc) parts[i].classList.add('acc'); if (w.endsWith('*')) inAcc = false; });
    return { box, parts };
  }
  function wordsAt(W, t, start, stagger = .09, dur = .55, times) {
    W.parts.forEach((p, i) => {
      const s = times ? times[i] ?? start + i * stagger : start + i * stagger, k = prog(t, s, dur, E.outQuint);
      p.style.opacity = k; p.style.filter = `blur(${(1 - k) * 14}px)`;
      p.style.transform = `translateY(${(1 - k) * 0.35}em) scale(${lerp(1.08, 1, k)})`;
    });
  }

  // word timings from the voice-over (words.json from voiceover.mjs): the scene's words land on the spoken words
  function voiceTimes(text, from) {
    const V = window.VOICE_WORDS || []; if (!V.length) return null;
    const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9%]/g, '');
    const words = text.split(/\s+/).filter(Boolean).map(w => norm(w.replace(/\*/g, '')));
    let j = V.findIndex(v => v.start >= (from ?? 0) - .05 && norm(v.word) === words[0]);
    if (j < 0) return null;
    return words.map((w, i) => { const v = V[j + i]; return v && norm(v.word) === w ? v.start - .06 : undefined; });
  }

  // ---------- scene types --------------------------------------------------------------------------------
  const SCENES = {
    // kinetic title line. {text, size, y, align, stagger, sync: true -> words land on the voice}
    title(s, root) {
      const W = wordsEl(root, s.text, 'title'); W.box.style.fontSize = (s.size || 110) + 'px';
      if (s.y != null) W.box.style.top = s.y + '%';
      const times = s.sync ? voiceTimes(s.text, s.at) : null;
      return t => { const e = env(t, s, .01, .4); W.box.style.opacity = e; W.box.style.filter = `blur(${(1 - e) * 10}px)`; wordsAt(W, t, s.at + (s.delay || .05), s.stagger || .1, .55, times); };
    },
    // glowing orb / light that drifts across a horizon glow (ref robimotion intro)
    orb(s, root) {
      const glow = h('div', 'horizon', root), orb = h('div', 'orb', root);
      return t => {
        const e = env(t, s, .6, .5), k = prog(t, s.at, s.dur, E.inOut);
        glow.style.opacity = e; glow.style.transform = `translateY(${lerp(8, 0, k)}%) scaleX(${lerp(1.1, 1, k)})`;
        orb.style.opacity = e; orb.style.left = lerp(s.from ?? 30, s.to ?? 68, k) + '%'; orb.style.top = lerp(46, 40, Math.sin(k * Math.PI)) + '%';
      };
    },
    // a glass prompt box that types a request, with a model chip and a send button that gets clicked
    prompt(s, root) {
      const card = h('div', 'glass prompt', root);
      if (s.hello) h('div', 'hello', card, `<span class="spark"></span>${esc(s.hello)}`);
      const field = h('div', 'field', card), txt = h('span', 'typed', field), caret = h('span', 'caret', field);
      const bar = h('div', 'bar', card, `<span class="plus">+</span><span class="chip">${esc(s.chip || 'Chat')}</span><span class="grow"></span><span class="model">${esc(s.model || 'Sonnet 5')}</span><span class="send">↑</span>`);
      const send = bar.querySelector('.send'), cur = cursor(root);
      const typeAt = s.typeAt ?? s.at + .6, cps = s.cps || 26, typedEnd = typeAt + s.text.length / cps, clickAt = s.clickAt ?? typedEnd + .5;
      return t => {
        const e = env(t, s, .5, .45), cam = prog(t, s.at, s.dur, E.inOut);
        card.style.opacity = e; card.style.filter = `blur(${(1 - e) * 16}px)`;
        card.style.transform = `translate(-50%,-50%) perspective(1400px) rotateX(${lerp(14, 0, prog(t, s.at, 1.2))}deg) scale(${lerp(.92, 1.06, cam)})`;
        const n = Math.floor(clamp((t - typeAt) * cps, 0, s.text.length)); txt.textContent = s.text.slice(0, n);
        caret.style.opacity = t < typedEnd ? 1 : (Math.floor(t * 2) % 2 ? 0 : 1);
        moveCursor(cur, t, [[clickAt - .9, 70, 78], [clickAt, 66.5, 61.5]], clickAt, e);
        const ck = 1 - Math.abs(clamp((t - clickAt) / .12, -1, 1)); send.style.transform = `scale(${1 - ck * .18})`; send.classList.toggle('on', t > clickAt);
      };
    },
    // a row of glass pills, one gets hovered and clicked (ref zensu.visuals: Create / Write / Code ...)
    pills(s, root) {
      const row = h('div', 'pills', root), items = s.items.map(x => h('span', 'pill glass', row, esc(x)));
      const cur = cursor(root), pick = s.pick ?? 2, clickAt = s.clickAt ?? s.at + 1.6;
      return t => {
        const e = env(t, s, .4, .4); row.style.opacity = e;
        items.forEach((p, i) => { const k = prog(t, s.at + .1 + i * .07, .5, E.back); p.style.transform = `translateY(${(1 - k) * 30}px) scale(${lerp(.8, 1, k)})`; p.style.opacity = k; p.classList.toggle('hot', i === pick && t > clickAt - .35); });
        const x = 50 + (pick - (items.length - 1) / 2) * (100 / (items.length + 1.4)) * .9;
        moveCursor(cur, t, [[clickAt - 1, x + 12, 70], [clickAt, x + 1, 53]], clickAt, e);
      };
    },
    // a stat card that counts up with a glowing bar chart (refs mcvisuals / Opal)
    stat(s, root) {
      const card = h('div', 'glass stat', root, `<div class="lbl">${esc(s.label || '')}</div><div class="num"><span class="n">0</span><span class="u">${esc(s.unit || '')}</span></div>`);
      const n = card.querySelector('.n'), bars = h('div', 'bars', card), vals = s.bars || [.35, .5, .42, .9, .55, .6];
      const B = vals.map((v, i) => { const b = h('i', i === (s.hi ?? vals.indexOf(Math.max(...vals))) ? 'hi' : '', bars); return [b, v]; });
      return t => {
        const e = env(t, s, .45, .4); card.style.opacity = e; card.style.filter = `blur(${(1 - e) * 14}px)`;
        card.style.transform = `translate(-50%,-50%) scale(${lerp(.94, 1.04, prog(t, s.at, s.dur, E.inOut))})`;
        n.textContent = Math.round(lerp(0, s.value, prog(t, s.at + .3, 1.3, E.expo))).toLocaleString(s.locale || 'fr-FR');
        B.forEach(([b, v], i) => { b.style.height = v * 100 * prog(t, s.at + .35 + i * .06, .7, E.back) + '%'; });
      };
    },
    // a phone mockup that slides up, its screen is any image or an HTML block (ref troiscoups)
    phone(s, root) {
      const ph = h('div', 'phone', root), scr = h('div', 'screen', ph, s.html || (s.img ? `<img src="${s.img}">` : ''));
      h('div', 'island', ph);
      return t => {
        const e = env(t, s, .5, .45), k = prog(t, s.at, .9, E.outQuint), cam = prog(t, s.at, s.dur, E.inOut);
        ph.style.opacity = e; ph.style.transform = `translate(-50%, ${lerp(30, -50, k)}%) rotate(${lerp(-6, 0, k)}deg) scale(${lerp(1, 1.05, cam)})`;
        scr.scrollTop = 0;
      };
    },
    // the logo reveal: a mark spins in, the name writes itself next to it (refs: Claude, Spotify 2.0, Opal)
    logo(s, root) {
      const box = h('div', 'logo' + (s.sans ? ' sans' : ''), root); if (s.y != null) box.style.top = s.y + '%';
      const mark = h('div', 'mark', box, s.mark === 'jersey' ? jersey(s.markColors) : s.mark || '<span class="spark big"></span>'), name = wordsEl(box, s.name, 'name');
      const tag = s.tagline ? h('div', 'tagline', root, s.tagline) : null; if (tag && s.tagY != null) tag.style.top = s.tagY + '%';
      return t => {
        const e = env(t, s, .3, .5), k = prog(t, s.at, .9, E.back);
        box.style.opacity = e; mark.style.transform = `rotate(${lerp(-120, 0, k)}deg) scale(${lerp(.2, 1, k)})`;
        name.parts.forEach((p, i) => { const q = prog(t, s.at + .45 + i * .08, .5, E.outQuint); p.style.opacity = q; p.style.filter = `blur(${(1 - q) * 10}px)`; p.style.letterSpacing = lerp(.3, 0, q) + 'em'; });
        if (tag) { const q = prog(t, s.at + 1.1, .6); tag.style.opacity = q * e; tag.style.transform = `translate(-50%, ${(1 - q) * 14}px)`; }
      };
    },
    // ---------- e-commerce scenes (first used by the elite-maillot Christmas ad) ----------
    // message bubbles that drop in one by one. {title, bubbles: [{from, text, at, side: 'l'|'r', dot: '#hex'}]}
    chat(s, root) {
      const box = h('div', 'chat glass', root);
      if (s.title) h('div', 'chat-head', box, `<span class="av"></span><b>${esc(s.title)}</b><small>${esc(s.subtitle || '')}</small>`);
      const B = s.bubbles.map(b => { const el = h('div', 'bubble ' + (b.side || 'l'), box, `<small>${esc(b.from || '')}</small><span>${esc(b.text)}${b.dot ? `<i class="dot" style="background:${b.dot}"></i>` : ''}</span>`); return [el, b]; });
      return t => {
        const e = env(t, s, .5, .4); box.style.opacity = e; box.style.filter = `blur(${(1 - e) * 14}px)`;
        box.style.transform = `translate(-50%,-50%) scale(${lerp(.95, 1.03, prog(t, s.at, s.dur, E.inOut))})`;
        B.forEach(([el, b]) => { const k = prog(t, b.at, .45, E.back); el.style.opacity = clamp(k * 2); el.style.transform = `translateY(${(1 - k) * 40}px) scale(${lerp(.7, 1, k)})`; el.style.display = t < b.at - .02 ? 'none' : ''; });
      };
    },
    // cart that fills with jerseys while a reward bar climbs its milestones. {items: [{name, colors:[body, sleeves], at}], steps: 8,
    //   milestones: [{n: 2, label}, {n: 4, label}], reward: {at, text}, footer}
    cart(s, root) {
      const card = h('div', 'cart glass', root);
      h('div', 'cart-head', card, `<b>${esc(s.title || 'Mon panier')}</b><span class="cnt">0</span>`);
      const list = h('div', 'cart-list', card), cnt = card.querySelector('.cnt');
      const I = s.items.map(it => { const row = h('div', 'cart-row', list, `${jersey(it.colors)}<div><b>${esc(it.name)}</b><small>${esc(it.size || 'Taille M')}</small></div><span class="pr">${esc(it.price || '19,99 €')}</span>`); return [row, it]; });
      const bar = h('div', 'reward', card), fill = h('i', 'fill', bar), steps = s.steps || 8;
      const M = (s.milestones || []).map(m => { const el = h('span', 'ms', bar, `<em>${esc(m.label)}</em>`); el.style.left = (m.n / steps * 100) + '%'; return [el, m]; });
      const rw = s.reward ? h('div', 'reward-pop', card, esc(s.reward.text)) : null;
      if (s.footer) h('div', 'cart-foot', card, s.footer);
      return t => {
        const e = env(t, s, .45, .4); card.style.opacity = e; card.style.filter = `blur(${(1 - e) * 14}px)`;
        card.style.transform = `translate(-50%,-50%) perspective(1600px) rotateX(${lerp(12, 0, prog(t, s.at, 1))}deg) scale(${lerp(.94, 1.03, prog(t, s.at, s.dur, E.inOut))})`;
        let n = 0; I.forEach(([row, it]) => { const k = prog(t, it.at, .5, E.back); if (t >= it.at) n++; row.style.opacity = clamp(k * 1.5); row.style.transform = `translateX(${(1 - k) * 120}px)`; row.style.display = t < it.at - .02 ? 'none' : ''; });
        cnt.textContent = n; cnt.style.transform = `scale(${1 + .35 * (1 - clamp((t - (I[n - 1]?.[1].at ?? -9)) / .3))})`;
        const last = I[n - 1]?.[1].at ?? s.at, prevW = (Math.max(0, n - 1) / steps) * 100, k = prog(t, last, .45, E.outQuint);
        fill.style.width = lerp(prevW, n / steps * 100, k) + '%';
        M.forEach(([el, m]) => el.classList.toggle('on', n >= m.n));
        if (rw) { const q = prog(t, s.reward.at, .5, E.back); rw.style.opacity = clamp(q * 2); rw.style.transform = `translateX(-50%) scale(${lerp(.5, 1, q)}) rotate(${lerp(-8, -2, q)}deg)`; }
      };
    },
    // old price gets struck, the new one counts down to it. {from: 19.99, to: 14.99, currency: '€', caption, note}
    price(s, root) {
      const box = h('div', 'price', root, `<div class="old">${fmt(s.from)} ${esc(s.currency || '€')}<i class="strike"></i></div><div class="new"><span class="v">${fmt(s.from)}</span><span class="cur"> ${esc(s.currency || '€')}</span></div><div class="cap">${esc(s.caption || '')}</div><div class="note">${esc(s.note || '')}</div>`);
      const old = box.querySelector('.old'), strike = box.querySelector('.strike'), v = box.querySelector('.v'), nw = box.querySelector('.new'), cap = box.querySelector('.cap'), note = box.querySelector('.note');
      const countAt = s.countAt ?? s.at + .5;
      return t => {
        const e = env(t, s, .35, .4); box.style.opacity = e;
        box.style.transform = `translate(-50%,-50%) scale(${lerp(.96, 1.05, prog(t, s.at, s.dur, E.inOut))})`;
        const o = prog(t, s.at, .4); old.style.opacity = o; old.style.filter = `blur(${(1 - o) * 10}px)`;
        strike.style.width = prog(t, s.at + .35, .3, E.inOut) * 108 + '%';
        const k = prog(t, countAt, 1.1, E.expo); v.textContent = fmt(lerp(s.from, s.to, k));
        const land = 1 - clamp((t - countAt - 1.1) / .35); nw.style.transform = `scale(${1 + (t > countAt + 1.1 ? land * .12 : 0)})`;
        const nk = prog(t, countAt - .2, .4); nw.style.opacity = nk;
        const c = prog(t, countAt + .9, .5); cap.style.opacity = c; cap.style.transform = `translateY(${(1 - c) * 20}px)`;
        const q = prog(t, countAt + 1.3, .5); note.style.opacity = q;
      };
    },
    // back of a jersey: the name types in, the number lands, a size chip pops. {name, number, colors, chip, chipAt}
    jersey(s, root) {
      const box = h('div', 'jback', root, `${jersey(s.colors || ['#c4301c', '#111'], 'big')}<div class="jname"></div><div class="jnum"></div>`);
      const nm = box.querySelector('.jname'), nu = box.querySelector('.jnum'), chip = s.chip ? h('div', 'chip-size glass', root, s.chip) : null;
      const nameAt = s.nameAt ?? s.at + .4, numAt = nameAt + s.name.length * .07 + .15;
      return t => {
        const e = env(t, s, .4, .4), k = prog(t, s.at, .8, E.outQuint);
        box.style.opacity = e; box.style.transform = `translate(-50%,-50%) translateY(${(1 - k) * 160}px) rotate(${lerp(8, 0, k)}deg) scale(${lerp(.96, 1.04, prog(t, s.at, s.dur, E.inOut))})`;
        nm.textContent = s.name.slice(0, Math.floor(clamp((t - nameAt) / .07, 0, s.name.length)));
        const q = prog(t, numAt, .45, E.back); nu.textContent = s.number; nu.style.opacity = clamp(q * 2); nu.style.transform = `translateX(-50%) scale(${lerp(2.2, 1, q)})`;
        if (chip) { const c = prog(t, s.chipAt ?? numAt + .4, .45, E.back); chip.style.opacity = clamp(c * 2) * e; chip.style.transform = `translateX(-50%) scale(${lerp(.6, 1, c)})`; }
      };
    },
    // soft deterministic snowfall over the whole piece. {count: 70}
    snow(s, root) {
      const n = s.count || 70, F = Array.from({ length: n }, (_, i) => { const r = k => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }; const el = h('i', 'flake', root); const z = r(3); el.style.width = el.style.height = (3 + z * 9) + 'px'; el.style.filter = `blur(${(1 - z) * 2.5}px)`; return { el, x: r(1) * 100, y: r(2), v: .03 + z * .05, a: r(4) * 6.28, z }; });
      return t => { const e = env(t, s, 1, 1); F.forEach(f => { const y = ((f.y + t * f.v) % 1.1) - .05; f.el.style.transform = `translate(${f.x * 10.8 + Math.sin(t * .8 + f.a) * 18}px, ${y * (root.clientHeight || 1920)}px)`; f.el.style.opacity = e * (.25 + f.z * .55); }); };
    },
    // white flash / blur wipe between two scenes (the troiscoups transition)
    flash(s, root) {
      const f = h('div', 'flash', root);
      return t => { const k = prog(t, s.at, (s.dur || .5) / 2, E.out) - prog(t, s.at + (s.dur || .5) / 2, (s.dur || .5) / 2, E.inOut); f.style.opacity = clamp(k) * (s.max ?? .85); };
    },
  };

  // generic jersey (no crest, no maker logo): body + sleeves colors, optional vertical stripes as a 3rd color
  function jersey([body, sleeves, stripes] = ['#c4301c', '#111'], cls = '') {
    const id = 'j' + Math.random().toString(36).slice(2, 8);
    return `<svg class="jersey ${cls}" viewBox="0 0 200 215"><defs><clipPath id="${id}"><path d="M62 8 82 2q18 14 36 0l20 6 52 32-20 42-22-12v145H52V70L30 82 10 40z"/></clipPath>
      <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient></defs>
      <g clip-path="url(#${id})"><rect width="200" height="215" fill="${body}"/>${stripes ? [70, 100, 130].map(x => `<rect x="${x - 9}" width="18" height="215" fill="${stripes}"/>`).join('') : ''}
      <path d="M0 0h52v215H0zM148 0h52v215h-52z" fill="${sleeves}" opacity=".95"/><path d="M82 2q18 14 36 0" stroke="${sleeves}" stroke-width="8" fill="none"/><rect width="200" height="215" fill="url(#${id}g)"/></g></svg>`;
  }
  const fmt = x => x.toFixed(2).replace('.', ',');

  // ---------- cursor
  function cursor(root) { const c = h('div', 'cursor', root, '<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/></svg>'); h('div', 'ripple', c); return c; }
  function moveCursor(c, t, path, clickAt, e) {
    const [[t0, x0, y0], [t1, x1, y1]] = path, k = prog(t, t0, t1 - t0, E.inOut);
    c.style.opacity = e * prog(t, t0 - .2, .3); c.style.left = lerp(x0, x1, k) + '%'; c.style.top = lerp(y0, y1, k) + '%';
    const ck = clamp((t - clickAt) / .45); c.style.transform = `scale(${t > clickAt && t < clickAt + .12 ? .85 : 1})`;
    const r = c.querySelector('.ripple'); r.style.opacity = t > clickAt ? (1 - ck) * .8 : 0; r.style.transform = `translate(-50%,-50%) scale(${.2 + ck * 2.2})`;
  }

  // ---------- boot
  async function boot() {
    const specUrl = new URL(new URLSearchParams(location.search).get('spec') || 'spec.json', location.href);
    const spec = window.SPEC || await (await fetch(specUrl)).json();
    // every path in the spec (words, img, audio) is relative to the spec file
    const rel = x => (x && !/^(data:|https?:|\/)/.test(x) ? new URL(x, specUrl).href : x);
    spec.scenes.forEach(s => { if (s.img) s.img = rel(s.img); });
    if (spec.preview) spec.preview = rel(spec.preview);
    if (spec.words && !window.VOICE_WORDS) { try { const off = spec.audio?.voiceAt || 0; window.VOICE_WORDS = (await (await fetch(rel(spec.words))).json()).map(w => ({ ...w, start: w.start + off, end: w.end + off })); } catch { /* no voice timings: scenes use their own times */ } }
    const stage = document.getElementById('stage'), W = spec.width || 1920, H = spec.height || 1080;
    document.documentElement.style.setProperty('--accent', spec.accent || '#ff7a3d');
    document.documentElement.style.setProperty('--accent2', spec.accent2 || '#ffb36b');
    document.documentElement.style.setProperty('--bg', spec.bg || '#07070a');
    if (spec.font) document.documentElement.style.setProperty('--font', spec.font);
    stage.style.width = W + 'px'; stage.style.height = H + 'px'; stage.classList.toggle('vertical', H > W);
    const bgGlow = h('div', 'bgglow', stage), grain = h('div', 'grain', stage);
    const updaters = spec.scenes.map(s => { const layer = h('div', 'layer', stage); layer.dataset.type = s.type; const u = SCENES[s.type](s, layer); return t => { const on = t >= s.at - .05 && t <= s.at + s.dur + .05; layer.style.display = on ? '' : 'none'; if (on) u(t); }; });
    window.DURATION = spec.duration || Math.max(...spec.scenes.map(s => s.at + s.dur));
    window.seek = t => { bgGlow.style.transform = `translate(${Math.sin(t * .35) * 4}%, ${Math.cos(t * .27) * 3}%) scale(1.15)`; grain.style.backgroundPosition = `${(t * 997) % 200}px ${(t * 613) % 200}px`; updaters.forEach(u => u(t)); };
    await document.fonts.ready; window.seek(0); window.READY = true;
    // preview mode: open the page in a browser to watch it play (add ?t=3.2 to freeze a frame)
    if (!navigator.webdriver) {
      const q = new URLSearchParams(location.search); if (q.get('t')) return window.seek(+q.get('t'));
      const scale = () => { const k = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = `scale(${k})`; stage.style.transformOrigin = '0 0'; }; scale(); addEventListener('resize', scale);
      let t0 = performance.now(); const loop = n => { const t = ((n - t0) / 1000) % window.DURATION; window.seek(t); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
      if (spec.preview) { const a = new Audio(spec.preview); document.body.addEventListener('click', () => { t0 = performance.now(); a.currentTime = 0; a.play(); }); }
    }
  }
  boot().catch(e => { window.READY_ERROR = e.message; console.error(e); });
})();
