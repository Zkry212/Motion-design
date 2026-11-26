#!/usr/bin/env node
// Renders a motion-design spec to MP4: headless Chrome seeks the scene frame by frame, ffmpeg encodes,
// then mix.mjs lays the voice-over, the music and the sound effects under it.
//
//   node render.mjs <project-dir>            -> <project>/output/<name>.mp4
//   node render.mjs <project-dir> --still 3.2 -> <project>/output/still-3.2.png (check a frame by eye)
//   node render.mjs <project-dir> --fps 60 --no-audio
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { mix } from './mix.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), SKILLS = path.resolve(HERE, '../..');
const args = process.argv.slice(2), flag = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : args[i + 1]; };
const proj = path.resolve(args.find(a => !a.startsWith('--') && !/^\d/.test(a)) || '.');
const spec = JSON.parse(fs.readFileSync(path.join(proj, 'spec.json'), 'utf8'));
const W = spec.width || 1920, H = spec.height || 1080, FPS = +flag('--fps', spec.fps || 30);
const out = path.join(proj, 'output'); fs.mkdirSync(out, { recursive: true });
const name = spec.name || path.basename(proj);

// tiny static server: /skills/* -> the skills folder (engine + shared fonts), /p/* -> the project
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const [root, rest] = u.startsWith('/skills/') ? [SKILLS, u.slice(8)] : u.startsWith('/p/') ? [proj, u.slice(3)] : [null];
  const f = root && path.resolve(root, rest);
  if (!f || !f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/skills/motion-design/engine/scene.html?spec=/p/spec.json`;

// Playwright if installed, else playwright-core from the short-editing engine with the Chrome it found
async function browser() {
  // CommonJS require honours NODE_PATH (global installs) and this folder's node_modules (npm i playwright-core)
  for (const from of [import.meta.url, path.join(SKILLS, 'short-editing/engine/package.json')])
    for (const m of ['playwright', 'playwright-core']) {
      try { const { chromium } = createRequire(from)(m); return m === 'playwright' ? await chromium.launch() : await launchCore(chromium); } catch {}
    }
  throw new Error('No Playwright: run `npm i playwright-core` in skills/motion-design/engine (Chrome is found on this computer), or `npm i playwright && npx playwright install chromium`.');
}
async function launchCore(chromium) {
  const { findChrome } = await import(path.join(SKILLS, 'short-editing/engine/platform.mjs'));
  return chromium.launch({ executablePath: process.env.CHROME_PATH || findChrome(), args: ['--no-sandbox'] });
}
const b = await browser(), page = await b.newPage({ viewport: { width: W, height: H } });
page.on('pageerror', e => console.error('  pageerror:', e.message));
await page.goto(url); await page.waitForFunction(() => window.READY || window.READY_ERROR);
const err = await page.evaluate(() => window.READY_ERROR); if (err) { console.error(err); process.exit(1); }
const D = spec.duration || await page.evaluate(() => window.DURATION);

const still = flag('--still');
if (still != null) {
  await page.evaluate(t => window.seek(t), +still);
  const f = path.join(out, `still-${still}.png`); await page.screenshot({ path: f }); console.log(f);
} else {
  const silent = path.join(out, `${name}.video.mp4`), N = Math.round(D * FPS), t0 = Date.now();
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < N; i++) {
    await page.evaluate(t => window.seek(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % FPS === 0) process.stdout.write(`\r  frames ${i}/${N}`);
  }
  ff.stdin.end(); await new Promise((r, j) => ff.on('close', c => (c ? j(new Error('ffmpeg ' + c)) : r())));
  console.log(`\r  video ${N} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  const final = path.join(out, `${name}.mp4`);
  if (args.includes('--no-audio')) fs.renameSync(silent, final);
  else { await mix(proj, spec, silent, final, D); fs.rmSync(silent); }
  console.log(final);
}
await b.close(); server.close();
