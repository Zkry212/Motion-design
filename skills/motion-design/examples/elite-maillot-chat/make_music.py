#!/usr/bin/env python3
# Synthwave bed for the Élite Maillot "sunset" ad, made from scratch (numpy): 108 BPM, A minor (Am-F-C-G),
# four-on-the-floor kick, gated-reverb snare, octave bass in eighths, detuned saw pad, a bright arpeggio from bar 3.
#   python3 make_music.py -> assets/music.wav
import os, wave
import numpy as np
SR = 48000; BPM = 120; BEAT = 60 / BPM; BAR = 4 * BEAT; D = 21.0
rng = np.random.default_rng(3); N = int(D * SR); t = np.arange(N) / SR
L = np.zeros(N); Rr = np.zeros(N)
def add(x, at, pan=0., g=1.):
    i = int(at * SR); x = x[:max(0, N - i)]
    L[i:i + len(x)] += x * g * (1 - pan) ; Rr[i:i + len(x)] += x * g * (1 + pan)
def lp(x, fc):
    a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
def saw(f, d, det=0.):
    tt = np.arange(int(d * SR)) / SR; return 2 * ((tt * f * (1 + det)) % 1) - 1
def env(d, a=.005, r=.1):
    n = int(d * SR); e = np.ones(n); na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
kick = (lambda tt: np.sin(2 * np.pi * np.cumsum(45 + 110 * np.exp(-tt * 30)) / SR) * np.exp(-tt * 7))(np.arange(int(.45 * SR)) / SR)
nz = rng.standard_normal(int(.5 * SR)); tt = np.arange(len(nz)) / SR
snare = (lp(nz, 6000) * np.exp(-tt * 9) + .5 * np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 25)) * (tt < .32)   # gated
hat = (lambda n: (n - lp(n, 7000)) * np.exp(-np.arange(len(n)) / SR * 60))(rng.standard_normal(int(.06 * SR)))
CH = [[54, 57, 61], [50, 54, 57], [45, 49, 52], [52, 56, 59]]   # Am F C G (midi)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
nb = int(D / BAR) + 1
for b in range(nb):
    t0 = b * BAR; root = CH[b % 4][0] - 24
    for k in range(4):
        if b > 0 or k >= 2: add(kick, t0 + k * BEAT, 0, .9)
        if b > 0 and k in (1, 3): add(snare, t0 + k * BEAT, 0, .45)
    for k in range(8):
        add(hat, t0 + k * BEAT / 2 + BEAT / 4 * 0, .3 if k % 2 else -.3, .12 if b > 0 else 0)
        f = hz(root + (12 if k % 2 else 0)); x = lp(saw(f, BEAT / 2 * .9) + saw(f, BEAT / 2 * .9, .006), 900) * env(BEAT / 2 * .9, .003, .05)
        add(x, t0 + k * BEAT / 2, 0, .32)
    pad = sum(lp(saw(hz(m), BAR, d) , 1500) for m in CH[b % 4] for d in (-.004, .004)) * env(BAR, .25, .3)
    add(pad, t0, -.2, .07); add(pad, t0, .2, .07)
    if b >= 2:
        arp = CH[b % 4] + [CH[b % 4][0] + 12]
        for k in range(16):
            f = hz(arp[k % 4] + 12); x = lp(saw(f, BEAT / 4 * .8, .003), 3500) * env(BEAT / 4 * .8, .002, .05)
            add(x, t0 + k * BEAT / 4, .4 if k % 2 else -.4, .05)
# simple stereo echo on everything + fades
d = int(BEAT * .75 * SR)
for X in (L, Rr): X[d:] += .22 * X[:-d].copy()
fade = np.minimum(1, np.minimum(t / .3, (D - t) / 1.5)); L *= fade; Rr *= fade
x = np.stack([L, Rr], 1); x = x / np.abs(x).max() * .89
os.makedirs('assets', exist_ok=True)
with wave.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'music.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
print('music.wav written (chat ad),', BPM, 'BPM, bar', round(BAR, 3), 's')
