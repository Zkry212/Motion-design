#!/usr/bin/env python3
# Lo-fi groove for the Élite Maillot zipper ad (numpy only): 85 BPM, swung, soft. Dusty kick and snare, brushed hats,
# warm electric-piano chords (Fmaj9 - Em7 - Dm9 - Cmaj7), a round bass, vinyl crackle, a little tape wobble.
#   python3 make_music.py -> assets/music.wav
import os, wave
import numpy as np
SR = 48000; BPM = 85; BEAT = 60 / BPM; BAR = 4 * BEAT; D = 22.5; N = int(D * SR); rng = np.random.default_rng(21)
L = np.zeros(N); R = np.zeros(N)
def add(x, at, g=1., pan=0.):
    i = int(at * SR)
    if i >= N or i < 0: return
    x = x[:N - i]; L[i:i + len(x)] += x * g * (1 - pan); R[i:i + len(x)] += x * g * (1 + pan)
def lp(x, fc):
    a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
T = lambda d: np.arange(int(d * SR)) / SR
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
tt = T(.35); kick = np.sin(2 * np.pi * np.cumsum(50 + 70 * np.exp(-tt * 30)) / SR) * np.exp(-tt * 9) * .9
tt = T(.3); snare = lp(rng.standard_normal(len(tt)), 3000) * np.exp(-tt * 16) * .45 + np.sin(2 * np.pi * 180 * tt) * np.exp(-tt * 30) * .3
tt = T(.08); hat = (lambda n: (n - lp(n, 6000)) * np.exp(-tt * 45))(rng.standard_normal(len(tt)))
def ep(m, d):   # electric piano: sine + soft tine + tremolo
    tt = T(d); f = hz(m)
    x = (np.sin(2 * np.pi * f * tt) + .25 * np.sin(2 * np.pi * f * 2 * tt) * np.exp(-tt * 3) + .12 * np.sin(2 * np.pi * f * 7.1 * tt) * np.exp(-tt * 18))
    return x * np.exp(-tt * 1.2) * (1 + .15 * np.sin(2 * np.pi * 4.5 * tt)) * np.minimum(1, tt / .01)
CH = [[53, 57, 60, 64, 67], [52, 55, 59, 62], [50, 53, 57, 60, 64], [48, 52, 55, 59, 62]]
BASS = [41, 40, 38, 36]
for b in range(int(D / BAR) + 1):
    t0 = b * BAR; c = b % 4
    for m in CH[c]: add(ep(m, BAR * 1.1), t0 + .02 * (m % 3), .12, -.15 + .1 * (m % 3))
    for m in CH[c][1:4]: add(ep(m + 12, BEAT * 1.2), t0 + 2.5 * BEAT, .05, .3)
    tt2 = T(BEAT * 1.8); bs = np.sin(2 * np.pi * hz(BASS[c]) * tt2) * np.exp(-tt2 * 1.5) * np.minimum(1, tt2 / .01)
    add(bs, t0, .5); add(bs * .7, t0 + 2.5 * BEAT, .5)
    if b == 0: continue
    swing = BEAT * .58
    for k, at in enumerate([0, 1.75, 2.5]): add(kick, t0 + at * BEAT, .8)
    for at in (1, 3): add(snare, t0 + at * BEAT, .6)
    for k in range(4):
        add(hat, t0 + k * BEAT, .14, .25); add(hat, t0 + k * BEAT + swing, .09, -.25)
# vinyl crackle + hiss
cr = np.zeros(N); idx = rng.integers(0, N, int(D * 30)); cr[idx] = rng.uniform(-1, 1, len(idx)); cr = lp(cr, 4000) * .6 + lp(rng.standard_normal(N), 2500) * .01
L += cr * .12; R += cr * .12
x = np.stack([lp(L, 7000), lp(R, 7000)], 1)
t = np.arange(N) / SR; x *= np.clip(np.minimum(t / .8, (D - t) / 1.5), 0, 1)[:, None]
x = x / np.abs(x).max() * .89
with wave.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'music.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
print('music.wav written,', BPM, 'BPM, bar', round(BAR, 3))
