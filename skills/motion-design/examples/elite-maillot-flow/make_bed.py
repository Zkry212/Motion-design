#!/usr/bin/env python3
# Soft bed in the Trois Coups manner: a quiet, slowly breathing pad (A minor add9 -> F maj7 -> C -> G6) with sparse
# soft bell notes, no drums. It sits low under the sound effects.   python3 make_bed.py -> assets/bed.wav
import os, wave
import numpy as np
SR = 48000; D = 35.0; t = np.arange(int(D * SR)) / SR; rng = np.random.default_rng(5)
def lp(x, fc):
    a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
CH = [[45, 52, 57, 59, 64], [41, 48, 53, 57, 64], [48, 52, 55, 59, 62], [43, 50, 55, 59, 64]]
SEG = 4.0; pad = np.zeros(len(t))
for i in range(int(D / SEG) + 1):
    t0 = i * SEG; n0 = int(t0 * SR); n1 = min(len(t), int((t0 + SEG + 1.5) * SR)); tt = t[n0:n1] - t0
    env = np.minimum(1, tt / 1.2) * np.minimum(1, np.maximum(0, (SEG + 1.5 - tt) / 1.5))
    for m in CH[i % 4]:
        for det in (-.7, .7): pad[n0:n1] += env * np.sin(2 * np.pi * (hz(m) + det) * tt + rng.uniform(0, 6.28)) * (1.0 if m < 50 else .45)
pad = lp(pad, 1500.0)
bell = np.zeros(len(t))
for k, (at, m) in enumerate([(1.0, 76), (3.0, 81), (5.0, 79), (9.0, 76), (11.0, 84), (13.0, 81), (17.0, 76), (19.0, 79), (21.0, 83), (25.0, 76), (27.0, 81), (29.0, 79), (31.0, 76)]):
    n0 = int(at * SR); tt = t[n0:n0 + int(2.5 * SR)] - at
    x = (np.sin(2 * np.pi * hz(m) * tt) + .3 * np.sin(2 * np.pi * hz(m) * 2 * tt) * np.exp(-tt * 6)) * np.exp(-tt * 2.2) * np.minimum(1, tt / .004)
    bell[n0:n0 + len(x)] += x * .5
x = pad / np.abs(pad).max() * .7 + bell * .35
d = int(.42 * SR); L = x.copy(); R = x.copy(); L[d:] += .25 * x[:-d]; R[2 * d:] += .2 * x[:-2 * d]
fade = np.minimum(1, np.minimum(t / 1.0, (D - t) / 2.0)); st = np.stack([L * fade, R * fade], 1); st = st / np.abs(st).max() * .89
with wave.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'bed.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
print('bed.wav written')
