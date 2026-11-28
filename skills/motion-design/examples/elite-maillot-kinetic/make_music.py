#!/usr/bin/env python3
# Trap beat for the Élite Maillot chat ad, made from scratch (numpy): 140 BPM half-time, C# minor.
# 2-bar intro (filtered bell melody + riser), drop on bar 3: gliding 808, punchy kick, clap on 3, hi-hats with
# 1/16 and 1/32 rolls, open hats, the bell melody on top, a short stop before the end card, outro.
#   python3 make_music.py -> assets/music.wav
import os, wave
import numpy as np
SR = 48000; BPM = 140; BEAT = 60 / BPM; BAR = 4 * BEAT; D = 20.6
rng = np.random.default_rng(11); N = int(D * SR)
L = np.zeros(N); Rr = np.zeros(N)
def add(x, at, pan=0., g=1.):
    i = int(at * SR)
    if i >= N: return
    x = x[:N - i]; L[i:i + len(x)] += x * g * (1 - pan); Rr[i:i + len(x)] += x * g * (1 + pan)
def lp(x, fc):
    a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
def hp(x, fc): return x - lp(x, fc)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
T = lambda d: np.arange(int(d * SR)) / SR

# ---- drums
t = T(.5); kick = np.tanh(3 * np.sin(2 * np.pi * np.cumsum(48 + 160 * np.exp(-t * 38)) / SR) * np.exp(-t * 9)) * .9
t = T(.35); nz = rng.standard_normal(len(t))
clap = sum(hp(lp(nz, 5000), 900) * np.exp(-np.maximum(0, t - o) * 28) * (t >= o) for o in (0, .011, .022)) * .5
t = T(.05); hat = hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * 90)
t = T(.3); ohat = hp(rng.standard_normal(len(t)), 6500) * np.exp(-t * 12)
def e808(m0, d, m1=None, glide=.08):
    t = T(d); f = np.full(len(t), hz(m0))
    if m1 is not None: k = np.clip((t - (d - glide)) / glide, 0, 1); f = hz(m0) * (hz(m1) / hz(m0)) ** k
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / .004) * np.exp(-t * .9)
    x = np.tanh(x * 2.2) * .8; x[-int(.02 * SR):] *= np.linspace(1, 0, int(.02 * SR)); return x
def bell(m, d=.6):
    t = T(d); f = hz(m)
    x = (np.sin(2 * np.pi * f * t) + .45 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 9) + .2 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 14)) * np.exp(-t * 5)
    x[:int(.003 * SR)] *= np.linspace(0, 1, int(.003 * SR)); return x

ROOTS = [37, 33, 40, 35]             # C#, A, E, B (808 an octave down)
MEL = [[73, 76, 80, 76, 73, 76, 81, 80], [69, 73, 76, 73, 69, 73, 78, 76], [76, 80, 83, 80, 76, 80, 85, 83], [71, 75, 78, 75, 71, 75, 80, 78]]
nb = int(D / BAR) + 1; DROP = 2; STOP = 9   # bar 9 = short stop before the end card
mel = np.zeros(N); mr = np.zeros(N)
for b in range(nb):
    t0 = b * BAR; ch = b % 4
    for k, m in enumerate(MEL[ch]):
        x = bell(m, .7); i = int((t0 + k * BEAT / 2) * SR); x = x[:max(0, N - i)]
        mel[i:i + len(x)] += x * (.6 if k % 2 else .75)
        if b >= DROP: mr[i:i + len(x)] += x * .25
    if b < DROP or b == STOP: continue
    # drums
    for k in (0, 1.5, 2.75) if b % 2 else (0, 2.5):
        add(kick, t0 + k * BEAT, 0, .95)
    add(clap, t0 + 2 * BEAT, 0, .55)
    for k in range(8):
        add(hat, t0 + k * BEAT / 2, .25, .16)
    if b % 2 == 1:   # rolls at the end of every other bar
        for k in range(6): add(hat, t0 + 3 * BEAT + k * BEAT / 6, -.25, .12)
        for k in range(4): add(hat, t0 + 3.5 * BEAT + k * BEAT / 8, .25, .1)
    else:
        add(ohat, t0 + 3.5 * BEAT, -.3, .12)
    # 808
    nxt = ROOTS[(ch + 1) % 4]
    add(e808(ROOTS[ch], BEAT * 2.4), t0, 0, .85)
    add(e808(ROOTS[ch] + 12, BEAT * 1.4, nxt, .12), t0 + 2.5 * BEAT, 0, .55)
# intro: melody low-passed, opening up; riser into the drop
intro_end = int(DROP * BAR * SR)
melf = mel.copy(); melf[:intro_end] = lp(mel[:intro_end], 1400)
L += melf * .22; Rr += melf * .22
d = int(BEAT * .75 * SR); L[d:] += mr[:-d] * .2; Rr[d:] += mr[:-d] * .12   # echo
t = T(DROP * BAR); rise = hp(rng.standard_normal(len(t)), 2000) * (t / t[-1]) ** 3 * .25
add(rise, 0, 0, 1)
x = np.stack([L, Rr], 1)
t = np.arange(N) / SR; fade = np.minimum(1, (D - t) / 1.2)[:, None]; x *= np.clip(fade, 0, 1)
x = np.tanh(x / np.abs(x).max() * 1.6); x = x / np.abs(x).max() * .89
with wave.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'music.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
print('music.wav written,', BPM, 'BPM, bar', round(BAR, 3), 's, drop at', round(DROP * BAR, 3), 's, stop at', round(STOP * BAR, 3))
