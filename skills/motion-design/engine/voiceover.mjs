#!/usr/bin/env node
// Voice-over for an ad, with word timings so the on-screen words land on the spoken ones.
//
//   node voiceover.mjs <project>                 ElevenLabs TTS of <project>/voiceover.txt  -> assets/voice.mp3 + assets/voice.words.json
//   node voiceover.mjs <project> --takes 3       3 takes of the same script (voice-1.mp3 ...) to pick the best read
//   node voiceover.mjs <project> --voices        list the voices of your ElevenLabs account (id, name, accent)
//   node voiceover.mjs <project> --file my.wav   your own recording (or a pro voice actor's): copied to assets/voice.wav,
//                                                words timed with ElevenLabs Scribe when a key is set
//
// Settings live in spec.json -> "voice": { "id": "...", "model": "eleven_multilingual_v2", "stability": .45,
//   "similarity": .8, "style": .3, "speed": 1.0, "language": "fr" }   (see references/voiceover.md for the ad presets)
// Key: ELEVENLABS_API_KEY (or ELEVEN_KEY) in the environment, <project>/.env, or video-agent/.env. Never printed.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2), flag = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : args[i + 1]; };
const proj = path.resolve(args.find(a => !a.startsWith('--')) || '.');
const spec = fs.existsSync(path.join(proj, 'spec.json')) ? JSON.parse(fs.readFileSync(path.join(proj, 'spec.json'), 'utf8')) : {};
const V = { model: 'eleven_multilingual_v2', stability: .45, similarity: .8, style: .3, speed: 1, ...(spec.voice || {}) };
const assets = path.join(proj, 'assets'); fs.mkdirSync(assets, { recursive: true });

function key() {
  if (process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_KEY) return process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_KEY;
  for (const f of [path.join(proj, '.env'), path.join(process.cwd(), '.env'), path.join(process.cwd(), 'video-agent/.env')]) {
    if (!fs.existsSync(f)) continue;
    const m = fs.readFileSync(f, 'utf8').match(/^\s*(?:ELEVENLABS_API_KEY|ELEVEN_KEY)\s*=\s*"?([^"\n]+)"?/m); if (m) return m[1].trim();
  }
  return null;
}
const K = key();
const api = async (p, init = {}) => {
  const r = await fetch('https://api.elevenlabs.io' + p, { ...init, headers: { 'xi-api-key': K, ...(init.headers || {}) } });
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r;
};

// character alignment -> words [{word, start, end}]
function wordsFrom(al, offset = 0) {
  const out = []; let cur = null;
  al.characters.forEach((c, i) => {
    if (/\s/.test(c)) { if (cur) out.push(cur); cur = null; return; }
    if (!cur) cur = { word: '', start: al.character_start_times_seconds[i] + offset };
    cur.word += c; cur.end = al.character_end_times_seconds[i] + offset;
  });
  if (cur) out.push(cur);
  return out.map(w => ({ ...w, word: w.word.replace(/^[«"“(]+|[»"”),.;:!?…]+$/g, '') })).filter(w => w.word);
}

if (args.includes('--voices')) {
  if (!K) throw new Error('No ElevenLabs key: add ELEVENLABS_API_KEY=... to ' + path.join(proj, '.env'));
  const { voices } = await (await api('/v1/voices')).json();
  for (const v of voices) console.log(`${v.voice_id}  ${v.name.padEnd(28)} ${[v.labels?.gender, v.labels?.accent, v.labels?.age, v.labels?.use_case].filter(Boolean).join(', ')}`);
  process.exit(0);
}

const own = flag('--file');
if (own) {
  const dst = path.join(assets, 'voice' + path.extname(own)); fs.copyFileSync(path.resolve(own), dst);
  console.log('voice:', dst);
  if (K) {
    const fd = new FormData(); fd.append('model_id', 'scribe_v1'); fd.append('timestamps_granularity', 'word');
    if (V.language) fd.append('language_code', V.language);
    fd.append('file', new Blob([fs.readFileSync(dst)]), path.basename(dst));
    const j = await (await api('/v1/speech-to-text', { method: 'POST', body: fd })).json();
    const words = j.words.filter(w => w.type === 'word').map(w => ({ word: w.text.replace(/[,.;:!?…»«"]+/g, ''), start: w.start, end: w.end }));
    fs.writeFileSync(path.join(assets, 'voice.words.json'), JSON.stringify(words, null, 1));
    console.log(`words: ${words.length} timed (assets/voice.words.json)`);
  } else console.log('no ElevenLabs key: no word timings, the scenes keep their own times');
  process.exit(0);
}

if (!K) { console.error('No ElevenLabs key. Put ELEVENLABS_API_KEY=... in ' + path.join(proj, '.env') + ' (never in chat), or record yourself and use --file.'); process.exit(1); }
if (!V.id) { console.error('No voice id: set spec.json "voice": {"id": "..."} (list them with --voices, or pick one in the ElevenLabs Voice Library).'); process.exit(1); }
const script = fs.readFileSync(path.join(proj, 'voiceover.txt'), 'utf8').trim();
const takes = +flag('--takes', 1);
for (let k = 1; k <= takes; k++) {
  const body = {
    text: script, model_id: V.model,
    voice_settings: { stability: V.stability, similarity_boost: V.similarity, style: V.style, use_speaker_boost: true, speed: V.speed },
    ...(V.language && V.model !== 'eleven_multilingual_v2' ? { language_code: V.language } : {}),
    ...(V.seed != null ? { seed: V.seed + k - 1 } : {}),
  };
  const j = await (await api(`/v1/text-to-speech/${V.id}/with-timestamps?output_format=mp3_44100_192`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })).json();
  const tag = takes > 1 ? `-${k}` : '';
  fs.writeFileSync(path.join(assets, `voice${tag}.mp3`), Buffer.from(j.audio_base64, 'base64'));
  const words = wordsFrom(j.alignment || j.normalized_alignment);
  fs.writeFileSync(path.join(assets, `voice${tag}.words.json`), JSON.stringify(words, null, 1));
  console.log(`take ${k}: assets/voice${tag}.mp3, ${words.length} words, ${words.at(-1)?.end.toFixed(2)} s`);
}
if (takes > 1) console.log('Listen, keep the best: rename it to assets/voice.mp3 (and its .words.json).');
