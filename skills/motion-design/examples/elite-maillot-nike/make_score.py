#!/usr/bin/env python3
# Cinematic score for the Élite Maillot "sportswear ad": 90 BPM, a low drone, a heartbeat pulse, a hit on every cut
# (sub boom + noise crack), risers into the big moments, a hard stop before "OFFERT." then the biggest hit, a tail.
#   python3 make_score.py -> assets/score.wav
import os, wave, json
import numpy as np
SR = 48000; D = 20.5; N = int(D * SR); t = np.arange(N) / SR; rng = np.random.default_rng(9)
L = np.zeros(N); R = np.zeros(N)
def add(x, at, g=1., pan=0.):
    i = int(at * SR)
    if i >= N or i < 0: return
    x = x[:N - i]; L[i:i + len(x)] += x * g * (1 - pan); R[i:i + len(x)] += x * g * (1 + pan)
def lp(x, fc):
    a = np.broadcast_to(1 - np.exp(-2 * np.pi * np.asarray(fc, float) / SR), x.shape); y = np.zeros_like(x); s = 0.
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y
T = lambda d: np.arange(int(d * SR)) / SR
def boom(d=1.6, big=1.):
    tt = T(d); sub = np.sin(2 * np.pi * np.cumsum(38 + 90 * np.exp(-tt * 14)) / SR) * np.exp(-tt * (2.4 / big))
    crack = lp(rng.standard_normal(len(tt)), 3500) * np.exp(-tt * 22)
    return np.tanh((sub * 1.2 + crack * .5) * 1.5)
def beat(d=.4):
    tt = T(d); return np.sin(2 * np.pi * np.cumsum(50 + 60 * np.exp(-tt * 30)) / SR) * np.exp(-tt * 10)
def riser(d):
    tt = T(d); k = tt / d; n = rng.standard_normal(len(tt)); x = (n - lp(n, 600 + 5000 * k)) * k ** 2.5 * .5
    x += np.sin(2 * np.pi * np.cumsum(200 + 900 * k ** 2) / SR) * k ** 3 * .15; return x
def whoosh(d=.5):
    tt = T(d); k = tt / d; n = rng.standard_normal(len(tt)); return (lp(n, 1500 + 3000 * np.sin(np.pi * k))) * np.sin(np.pi * k) ** 2
spec = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'spec.json')))
H = spec['scenes'][0]['hits']; BIG = spec['scenes'][0]['big']; STOP = spec['scenes'][0]['stop']
# drone: two detuned low saws, opening filter, cut during the stop
drone = sum(2 * ((t * f) % 1) - 1 for f in (65.4, 65.9, 98.0)) / 3
drone = lp(drone, 220.0) * np.minimum(1, t / 1.5) * .35
gate = np.ones(N); i0, i1 = int(STOP[0] * SR), int(STOP[1] * SR); gate[i0:i1] = 0; gate[i1:i1 + int(.05 * SR)] = np.linspace(0, 1, int(.05 * SR))
L += drone * gate; R += drone * gate
# heartbeat pulse on every beat from 1.33 s until the end card, except the stop
BEAT = 60 / 90
for k in range(2, int(16 / BEAT)):
    at = k * BEAT
    if STOP[0] - .05 < at < STOP[1]: continue
    add(beat(), at, .55); 
for h in H: add(boom(1.2, .8), h, .55); add(whoosh(.45), h - .4, .25, .3)
for h in BIG: add(boom(2.6, 2.0), h, 1.0)
add(riser(STOP[0] - 10.667), 10.667, .5); add(riser(1.2), BIG[-1] - 1.2, .4)
x = np.stack([L, R], 1); x *= np.clip((D - t) / 1.0, 0, 1)[:, None]
x = np.tanh(x / np.abs(x).max() * 1.3); x = x / np.abs(x).max() * .89
with wave.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'score.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
print('score.wav written')
