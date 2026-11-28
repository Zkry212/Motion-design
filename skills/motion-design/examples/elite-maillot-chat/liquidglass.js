// Liquid Glass (iOS 26 style) for the motion engine: real refraction of what is behind the element, strongest at
// the rim (an edge-lens displacement map generated per size), plus blur, saturation, a tint, a bright rim light and
// a moving specular highlight. Usage: LG.make(el, { w, h, r, depth, scale, tint, blur }) ; LG.sheen(el, t)
(() => {
  let n = 0, svg;
  const ensure = () => { if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('width', 0); svg.setAttribute('height', 0); svg.style.position = 'absolute'; document.body.appendChild(svg); } return svg; };
  function lensMap(w, h, r, depth) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), im = g.createImageData(w, h), d = im.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      // signed distance to the rounded-rect edge (positive inside) + inward normal
      const qx = Math.abs(x + .5 - w / 2) - (w / 2 - r), qy = Math.abs(y + .5 - h / 2) - (h / 2 - r);
      let dist, nx = 0, ny = 0;
      if (qx > 0 && qy > 0) { const L = Math.hypot(qx, qy); dist = r - L; nx = qx / L; ny = qy / L; }
      else if (qx > qy) { dist = r - qx; nx = 1; } else { dist = r - qy; ny = 1; }
      nx *= Math.sign(x + .5 - w / 2) || 1; ny *= Math.sign(y + .5 - h / 2) || 1;
      const k = Math.max(0, 1 - dist / depth), m = k * k * (3 - 2 * k);   // smooth, only near the rim
      const i = (y * w + x) * 4; d[i] = 128 + nx * 127 * m; d[i + 1] = 128 + ny * 127 * m; d[i + 2] = 128; d[i + 3] = 255;
    }
    g.putImageData(im, 0, 0); return c.toDataURL();
  }
  function make(el, o) {
    const w = Math.round(o.w), h = Math.round(o.h), r = Math.min(o.r ?? h / 2, w / 2, h / 2), id = 'lg' + (++n);
    const f = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    f.setAttribute('id', id); f.setAttribute('x', 0); f.setAttribute('y', 0); f.setAttribute('width', w); f.setAttribute('height', h);
    f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('primitiveUnits', 'userSpaceOnUse'); f.setAttribute('color-interpolation-filters', 'sRGB');
    f.innerHTML = `<feImage href="${lensMap(w, h, r, o.depth ?? Math.min(26, h / 3))}" x="0" y="0" width="${w}" height="${h}" result="m"/>
      <feDisplacementMap in="SourceGraphic" in2="m" scale="${o.scale ?? 46}" xChannelSelector="R" yChannelSelector="G"/>`;
    ensure().appendChild(f);
    el.classList.add('lg'); el.style.borderRadius = r + 'px';
    el.style.backdropFilter = el.style.webkitBackdropFilter = `url(#${id}) blur(${o.blur ?? 2}px) saturate(${o.sat ?? 1.7}) brightness(${o.bright ?? 1.08})`;
    el.style.background = o.tint ?? 'rgba(255,255,255,.08)';
    if (!el.querySelector(':scope > .lgrim')) { const rim = document.createElement('i'); rim.className = 'lgrim'; el.prepend(rim); const sh = document.createElement('i'); sh.className = 'lgsheen'; el.prepend(sh); }
    return el;
  }
  // moving specular highlight (call every frame with a phase)
  const sheen = (el, ph) => { const s = el.querySelector(':scope > .lgsheen'); if (s) s.style.backgroundPosition = `${-60 + ((ph % 1) + 1) % 1 * 220}% 0`; };
  const CSS = `.lg { position: absolute; overflow: hidden; isolation: isolate; box-shadow: 0 18px 50px rgba(0,0,0,.35), inset 0 0 0 .5px rgba(255,255,255,.18); }
    .lg > .lgrim { position:absolute; inset:0; border-radius: inherit; pointer-events:none; z-index: 5; padding: 1.2px;
      background: linear-gradient(135deg, rgba(255,255,255,.75), rgba(255,255,255,.08) 35%, rgba(255,255,255,0) 55%, rgba(255,255,255,.12) 80%, rgba(255,255,255,.45));
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
    .lg > .lgsheen { position:absolute; inset:0; border-radius: inherit; pointer-events:none; z-index: 4; mix-blend-mode: screen;
      background: linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.22) 50%, rgba(255,255,255,0) 60%); background-size: 250% 100%; }`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  window.LG = { make, sheen };
})();
