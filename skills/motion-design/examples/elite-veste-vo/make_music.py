#!/usr/bin/env python3
# Clean "agency promo" bed in the Trois Coups manner (numpy only): 100 BPM, bright and light, never loud.
# Soft felt piano arpeggios over Cmaj9 - Am9 - Fmaj9 - G6/9, a warm pad that breathes with the kick, a rounded sub,
# finger snaps on 2 and 4, a soft shaker, a small pluck motif in the second half, airy echo.  -> assets/music.wav
import os, wave
import numpy as np
SR = 48000; BPM = 100; BEAT = 60 / BPM; BAR = 4 * BEAT; D = 30.0; N = int(D * SR); rng = np.random.default_rng(31)
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
def piano(m, d=1.6, v=1.):
    t = T(d); f = hz(m); x = np.zeros(len(t))
    for k, a in enumerate([1, .45, .22, .12, .06]):
        x += a * np.sin(2 * np.pi * f * (k + 1) * t * (1 + .0004 * k)) * np.exp(-t * (2.2 + k * 1.6))
    x += .15 * lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 60)          # felt hammer
    return x * np.minimum(1, t / .004) * v
def pad(ms, d):
    t = T(d); x = sum(np.sin(2 * np.pi * hz(m) * t + i) + .5 * np.sin(2 * np.pi * hz(m) * 1.003 * t) for i, m in enumerate(ms))
    return lp(x, 1800) * np.minimum(1, t / .6) * np.minimum(1, np.maximum(0, d - t) / .6)
def pluck(m, d=.5):
    t = T(d); return np.sign(np.sin(2 * np.pi * hz(m) * t)) * .3 * np.exp(-t * 9) + np.sin(2 * np.pi * hz(m) * t) * np.exp(-t * 7)
t = T(.3); kick = np.sin(2 * np.pi * np.cumsum(45 + 70 * np.exp(-t * 35)) / SR) * np.exp(-t * 11)
t = T(.18); snap = lp(rng.standard_normal(len(t)), 6000) * np.exp(-t * 40); snap = snap - lp(snap, 1200)
t = T(.07); shk = (lambda n: (n - lp(n, 7000)) * np.exp(-t * 50))(rng.standard_normal(len(t)))
CH = [[48, 52, 55, 59, 62], [45, 48, 52, 55, 59], [41, 45, 48, 52, 55], [43, 47, 50, 52, 57]]
ARP = [0, 2, 4, 3, 1, 3, 4, 2]
pump = np.ones(N)
for b in range(int(D / BAR) + 1):
    t0 = b * BAR; c = CH[b % 4]
    add(pad([m + 12 for m in c[1:4]], BAR + .6), t0, .05, 0)
    for k, ai in enumerate(ARP): add(piano(c[ai] + 12, 1.4, .9 if k % 2 == 0 else .7), t0 + k * BEAT / 2, .16, -.3 + .6 * (k % 2))
    add(np.sin(2 * np.pi * hz(c[0] - 12) * T(BAR * .95)) * np.exp(-T(BAR * .95) * .8) * np.minimum(1, T(BAR * .95) / .01), t0, .32)
    if b >= 1:
        for k in (0, 2): add(kick, t0 + k * BEAT, .55); i = int((t0 + k * BEAT) * SR); n = int(.35 * SR); pump[i:i + n] = np.minimum(pump[i:i + n], .55 + .45 * (np.arange(n) / n)[:max(0, min(n, N - i))] if i + n <= N else 1)
        for k in (1, 3): add(snap, t0 + k * BEAT, .22)
        for k in range(16): add(shk, t0 + k * BEAT / 4, .05 if k % 2 else .08, .4 if k % 2 else -.4)
    if b >= 4:
        for k, m in enumerate([c[4] + 12, c[3] + 12, c[2] + 24]): add(pluck(m), t0 + (3 + k * .5) * BEAT, .07, .5)
L *= pump; R *= pump
d = int(BEAT * .75 * SR); L2 = L.copy(); R2 = R.copy(); L2[d:] += .22 * R[:-d]; R2[d:] += .22 * L[:-d]
x = np.stack([L2, R2], 1); t = np.arange(N) / SR
x *= np.clip(np.minimum(t / 1.0, (D - t) / 2.0), 0, 1)[:, None]; x = x / np.abs(x).max() * .85
with wave.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'music.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
print('music.wav written,', BPM, 'BPM')
