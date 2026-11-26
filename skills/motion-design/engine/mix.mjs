// Ad-grade audio mix with ffmpeg only:
//   voice-over  -> high-pass, de-ess, presence EQ, 2-stage compression, -16 LUFS  ("broadcast" chain, see references/voiceover.md)
//   music bed   -> levelled under the voice and ducked by it (sidechain), fade in/out
//   sound FX    -> placed at their time (or with their peak on that time), levelled in dB under the voice
//   master      -> -14 LUFS integrated, -1 dBTP true peak (TikTok / Reels / YouTube)
// spec.audio = { voice: 'assets/voice.mp3', voiceAt: .4, music: 'assets/music.mp3', musicGain: -20, duck: true,
//                sfx: [{ at: 2.0, src: 'zhhh', gain: -8, peak: true }, ...] }
// sfx src: a file path (project-relative) or the name of a sound bundled with short-editing (zhhh, impact-boom, riser, glass-shatter, pop-back),
//          or a synthesized one: 'click', 'tick', 'sub' (sub-bass drop for the logo), 'whoosh'.
// gain: dB under the voice peaks (default -10). peak: true lands the loudest instant on `at`. endAt: a riser ends on that time.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BUNDLED = path.resolve(HERE, '../../short-editing/assets/sfx');
const SYNTH = {   // ffmpeg aevalsrc one-liners, 48 kHz mono
  click: ['0.6*sin(2*PI*2400*t)*exp(-t*90)+0.4*(random(0)-0.5)*exp(-t*160)', .12],
  tick: ['0.5*sin(2*PI*1800*t)*exp(-t*140)', .06],
  sub: ['0.9*sin(2*PI*(55-25*t)*t)*exp(-t*2.2)', 1.6],
  whoosh: ['(random(0)-0.5)*sin(PI*t/0.7)^3', .7],
};

const probe = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
// loudest instant (to land an impact exactly on its cue) and its level (to level every sound the same way)
function peak(f) {
  const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
  const a = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4); let m = 1e-6, k = 0;
  for (let i = 0; i < a.length; i++) if (Math.abs(a[i]) > m) { m = Math.abs(a[i]); k = i; }
  return { t: k / 16000, db: 20 * Math.log10(m) };
}

export async function mix(proj, spec, video, outFile, D) {
  const A = spec.audio || {}, P = f => path.resolve(proj, f), inputs = [], chains = [], mixIn = [];
  let n = 0; const idx = () => n++;
  inputs.push('-i', video); idx();

  // voice-over
  let voiceLabel = null;
  if (A.voice && fs.existsSync(P(A.voice))) {
    inputs.push('-i', P(A.voice)); const i = idx(), at = Math.round((A.voiceAt || 0) * 1000);
    chains.push(`[${i}:a]aformat=channel_layouts=mono,aresample=48000,highpass=f=80,` +
      // the broadcast chain: de-ess, cut the mud, add presence and air, two gentle compressors, -16 LUFS
      `deesser=i=0.4:m=0.5:f=0.5,equalizer=f=250:t=q:w=1.2:g=-2.5,equalizer=f=3500:t=q:w=1.5:g=2,equalizer=f=11000:t=h:w=1:g=2.5,` +
      `acompressor=threshold=-22dB:ratio=3:attack=8:release=120:makeup=3dB,acompressor=threshold=-10dB:ratio=6:attack=2:release=60,` +
      `loudnorm=I=-16:TP=-2:LRA=7,adelay=${at}:all=1,apad=whole_dur=${D},atrim=0:${D},asplit=2[vo][vsc]`);
    voiceLabel = 'vo'; mixIn.push('[vo]');
  }

  // music bed
  if (A.music && fs.existsSync(P(A.music))) {
    inputs.push('-stream_loop', '-1', '-i', P(A.music)); const i = idx();
    chains.push(`[${i}:a]aformat=channel_layouts=stereo,aresample=48000,atrim=0:${D},loudnorm=I=${-16 + (A.musicGain ?? -12)}:TP=-3,` +
      `afade=t=in:d=0.6,afade=t=out:st=${Math.max(0, D - 1.5)}:d=1.5[mraw]`);
    if (voiceLabel && A.duck !== false) { chains.push(`[mraw][vsc]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450:makeup=1[mus]`); mixIn.push('[mus]'); }
    else { mixIn.push('[mraw]'); if (voiceLabel) chains.push('[vsc]anullsink'); }
  } else if (voiceLabel) chains.push('[vsc]anullsink');

  // sound effects
  for (const s of A.sfx || []) {
    const gain = s.gain ?? -10;
    let file = null;
    if (SYNTH[s.src]) { const [expr, d] = SYNTH[s.src]; inputs.push('-f', 'lavfi', '-i', `aevalsrc='${expr}':s=48000:d=${d}`); }
    else {
      file = fs.existsSync(P(s.src)) ? P(s.src) : path.join(BUNDLED, s.src.replace(/\.mp3$/, '') + '.mp3');
      if (!fs.existsSync(file)) { console.warn(`  sfx not found: ${s.src}`); continue; }
      inputs.push('-i', file);
    }
    const i = idx();
    const pk = file ? peak(file) : { t: 0, db: -1.5 };
    let at = s.at; if (s.peak) at -= pk.t; if (s.endAt != null && file) at = s.endAt - probe(file);
    const ms = Math.max(0, Math.round(at * 1000));
    // level: peak-normalised to -3 dBFS (where the voice peaks), then `gain` dB under it
    chains.push(`[${i}:a]aformat=channel_layouts=stereo,aresample=48000,volume=${(-3 + gain - pk.db).toFixed(1)}dB,adelay=${ms}:all=1[s${i}]`);
    mixIn.push(`[s${i}]`);
  }

  if (!mixIn.length) { fs.copyFileSync(video, outFile); return; }
  chains.push(`${mixIn.join('')}amix=inputs=${mixIn.length}:normalize=0:duration=longest,atrim=0:${D},` +
    `loudnorm=I=-14:TP=-1:LRA=9,alimiter=limit=0.89:level=false,aresample=48000[mix]`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', chains.join(';'), '-map', '0:v', '-map', '[mix]',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-t', String(D), outFile], { stdio: 'inherit' });
  // keep the mix as a wav beside the video, for CapCut / Premiere
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', outFile, '-vn', '-c:a', 'pcm_s24le', outFile.replace(/\.mp4$/, '.mix.wav')]);
  console.log('  audio mixed: voice -16 LUFS, master -14 LUFS / -1 dBTP');
}
