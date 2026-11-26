---
name: motion-design
description: Creates a product ad in motion design (no camera, no footage) in the style of premium SaaS / app launch videos: dark stage with a glow, words rising out of a blur, glass UI cards, a prompt that types, a cursor that clicks, a counting stat, a logo reveal, an ad-quality voice-over (ElevenLabs or a recording) with broadcast processing, music ducked under it and sound effects on the beats. 16:9 or 9:16. Use when the user says motion design, pub, ad, product video, launch video, teaser, logo reveal, voix off.
---

# motion-design

A spec (`spec.json`) describes the scenes on a timeline; the engine renders it frame by frame in headless Chrome, then mixes the voice-over, music and SFX with ffmpeg.

```
<projet>/
  spec.json          scenes, colors, voice settings, audio cues
  voiceover.txt      the script read by the voice (with <break time="0.4s" />)
  .env               ELEVENLABS_API_KEY=...   (never committed, never printed)
  assets/            voice.mp3, voice.words.json, music.mp3, images
  output/            <name>.mp4 + <name>.mix.wav
```

## Workflow

1. **Brief** (ask only what is missing): product name, the one promise, target length (15 / 20 / 30 s), format (16:9 or 9:16), palette (see [references/style-guide.md](references/style-guide.md)), tone of voice.
2. **Script** in `voiceover.txt`: 2.3-2.6 words/s, 3-7 words per sentence, hook → demo → proof → logo → CTA. Rules in [references/voiceover.md](references/voiceover.md) §2.
3. **Voice**: `node engine/voiceover.mjs <projet> --takes 3` (ElevenLabs, needs a key and `voice.id`), or `--file prise.wav` for a recording. Let the user pick the take.
4. **Scenes**: copy `examples/demo-launch/` and edit `spec.json`. Set each scene's `at` from `assets/voice.words.json` (+ `audio.voiceAt`); titles take `"sync": true`.
5. **Check frames**: `node engine/render.mjs <projet> --still 4.2`, look at 4-6 stills before the full render. Live preview: open `engine/scene.html?spec=<url of spec.json>` through any local server.
6. **Render**: `node engine/render.mjs <projet>` (about 10 s of compute per second of video at 1080p/30).

## Scene types (`scenes[]`, all take `at` and `dur` in seconds)

| type | fields | from the refs |
|---|---|---|
| `title` | `text` (`*mot*` = accent color), `size` (px, 110), `y` (%), `stagger`, `sync`, `delay` | words out of a blur |
| `orb` | `from`, `to` (% x) | light drifting over a horizon glow |
| `prompt` | `text`, `hello`, `chip`, `model`, `typeAt`, `cps`, `clickAt` | glass prompt that types, cursor clicks send |
| `pills` | `items[]`, `pick`, `clickAt` | row of glass buttons, one clicked |
| `stat` | `label`, `value`, `unit`, `bars[]` (0-1), `hi` | number counts up, hero bar glows |
| `phone` | `img` or `html` | iPhone mockup slides up |
| `logo` | `name`, `mark` (html, `'jersey'`, default spark), `markColors`, `tagline` (html), `tagY`, `y`, `sans` | mark spins in, name writes |
| `flash` | `max` (0-1) | light flash transition |
| `chat` | `title`, `subtitle`, `bubbles[]` ({from, text, at, side, dot}) | message thread that drops in |
| `cart` | `items[]` ({name, colors, at, size, price}), `steps`, `milestones[]` ({n, label}), `reward` ({at, text}), `footer` | cart fills, reward bar climbs |
| `price` | `from`, `to`, `countAt`, `caption`, `note` | old price struck, new one counts down |
| `jersey` | `name`, `number`, `colors` [body, sleeves, stripes?], `nameAt`, `chip`, `chipAt` | jersey back gets its name and number (no crest) |
| `snow` | `count` | soft snowfall over the whole piece |

Global: `width`, `height` (1080×1920 for vertical), `fps`, `duration`, `accent`, `accent2`, `bg`, `font`.
New scene type: add a function to `SCENES` in `engine/runtime.js` (pure function of `t`, never use real time) and its CSS in `engine/scene.html`.

## Audio (`audio`)

```json
"audio": { "voice": "assets/voice.mp3", "voiceAt": 0.4, "music": "assets/music.mp3", "musicGain": -12, "duck": true,
  "sfx": [ { "at": 13.4, "src": "impact-boom", "peak": true, "gain": -9 }, { "at": 0, "src": "riser", "endAt": 2.6, "gain": -14 } ] }
```

SFX `src`: the sounds bundled with short-editing (`zhhh`, `impact-boom`, `riser`, `glass-shatter`, `pop-back`, from github.com/Melvynx/video-agent-skills), synthesized ones (`click`, `tick`, `sub`, `whoosh`), or any file in the project. House rule: sounds on the payoffs only (a click on a real click, riser + impact + sub on the logo), 4 to 7 per ad. Music: any royalty-free track in `assets/` (or a bed from `../short-editing/assets/music/` once short-editing's setup has generated them).

The voice gets the broadcast chain and the master lands at -14 LUFS / -1 dBTP: details in [references/voiceover.md](references/voiceover.md) §5.

## Requirements

Node 20+, ffmpeg, and Playwright (`npm i playwright && npx playwright install chromium`) or `npm i playwright-core` in `engine/` (uses the Chrome already on the computer, found by short-editing's `platform.mjs`).
