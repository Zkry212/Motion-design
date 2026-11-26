#!/usr/bin/env python3
# Soft Christmas bed for the Élite Maillot ad: an original tune (no existing melody), synthesized with numpy.
# Celesta / music box melody, felt piano chords, string pad, gentle sleigh bells, soft bass, glockenspiel sparkles.
# Tempo set so the final chord lands on the logo (23.7 s = start of bar 10).
#   python3 make_music.py  -> assets/music.wav (48 kHz stereo)
import os, wave
import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'music.wav')
LOGO, BARS_BEFORE_LOGO = 23.7, 9
BAR = LOGO / BARS_BEFORE_LOGO; BEAT = BAR / 4            # ~91 bpm
DUR = 26.6
N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(12)
f = lambda n: 440 * 2 ** ((n - 69) / 12)                 # midi -> Hz

def add(sig, t, pan=0.0, g=1.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i >= N or j <= i: return
    s = sig[:j - i] * g
    L[i:j] += s * np.sqrt((1 - pan) / 2) * 1.4; R[i:j] += s * np.sqrt((1 + pan) / 2) * 1.4

def env(n, a, d):
    t = np.arange(n) / SR; e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d); return e

def celesta(n_, dur=1.6):
    n = int(dur * SR); t = np.arange(n) / SR; fr = f(n_)
    x = np.sin(2 * np.pi * fr * t) + .35 * np.sin(2 * np.pi * fr * 4 * t) * np.exp(-t * 8) + .12 * np.sin(2 * np.pi * fr * 6.9 * t) * np.exp(-t * 14)
    return x * env(n, .003, .55)

def glock(n_, dur=1.2):
    n = int(dur * SR); t = np.arange(n) / SR; fr = f(n_)
    x = np.sin(2 * np.pi * fr * t) + .5 * np.sin(2 * np.pi * fr * 2.76 * t) * np.exp(-t * 6) + .25 * np.sin(2 * np.pi * fr * 5.4 * t) * np.exp(-t * 10)
    return x * env(n, .001, .7)

def piano(n_, dur=2.6):
    n = int(dur * SR); t = np.arange(n) / SR; fr = f(n_)
    x = sum(a * np.sin(2 * np.pi * fr * k * t * (1 + .0004 * k * k)) * np.exp(-t * (1.2 + k * .9)) for k, a in [(1, 1), (2, .45), (3, .22), (4, .1)])
    return x * env(n, .006, 1.5) * .6

def strings(notes, dur):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for n_ in notes:
        for det in (-.18, .0, .18):
            fr = f(n_) * 2 ** (det / 12); ph = rng.uniform(0, 6.28)
            saw = sum(np.sin(2 * np.pi * fr * k * t + ph * k) / k for k in range(1, 7))
            x += saw * (1 + .004 * np.sin(2 * np.pi * 5.2 * t + ph))
    a = np.minimum(1, t / .7) * np.minimum(1, (dur - t) / .6)
    # soft low-pass
    y = np.zeros(n); s = 0.0; k = 1 - np.exp(-2 * np.pi * 1400 / SR)
    for i in range(n): s += k * (x[i] - s); y[i] = s
    return y * a * .05

def bass(n_, dur):
    n = int(dur * SR); t = np.arange(n) / SR; fr = f(n_)
    return (np.sin(2 * np.pi * fr * t) + .25 * np.sin(4 * np.pi * fr * t)) * env(n, .01, .9) * .55

def bell_shake(dur=.16, g=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for fr in rng.uniform(5200, 9800, 9):
        x += np.sin(2 * np.pi * fr * t + rng.uniform(0, 6.28)) * np.exp(-t * rng.uniform(25, 45))
    x += rng.standard_normal(n) * np.exp(-t * 60) * .6
    hp = np.diff(np.concatenate([[0], x]))
    return hp * g * .05

# ---- harmony: C  Am  F  G | C  Em  F  G | Am  F  C  G   (one chord per bar), ends on C at the logo
C, Am, F, G, Em, Dm = [48, 52, 55, 60, 64], [45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [43, 50, 55, 59, 62], [40, 47, 52, 55, 59], [38, 50, 53, 57, 62]
prog = [C, Am, F, G, C, Em, F, G, Dm]
for b, ch in enumerate(prog):
    t0 = b * BAR
    if b >= 1: add(strings(ch[1:4], BAR + .5), t0 - .1, 0, .9)
    if b >= 2:
        for k, n_ in enumerate(ch[1:]): add(piano(n_ + 12), t0 + k * .012, -.2 + k * .1, .5)
        add(piano(ch[1] + 12), t0 + 2 * BEAT, .1, .32)
    if b >= 2: add(bass(ch[0] - 12, BAR * .9), t0, 0, .8)
    # music box arpeggio (bars 1-2 alone, softer underneath afterwards)
    arp = [ch[1] + 24, ch[2] + 24, ch[3] + 24, ch[2] + 24]
    for k in range(8):
        add(celesta(arp[k % 4], 1.1), t0 + k * BEAT / 2, .35 if k % 2 else -.35, .32 if b < 2 else .17)

# ---- original melody (celesta, bars 3-9), quarter / eighth notes over the chords
mel = [
    (2, 0, 72, 1), (2, 1, 76, 1), (2, 2, 77, 1.5), (2, 3.5, 76, .5),
    (3, 0, 74, 2), (3, 2, 71, 1), (3, 3, 74, 1),
    (4, 0, 76, 1), (4, 1, 79, 1), (4, 2, 76, 1), (4, 3, 72, 1),
    (5, 0, 71, 1.5), (5, 1.5, 72, .5), (5, 2, 74, 2),
    (6, 0, 77, 1), (6, 1, 76, 1), (6, 2, 74, 1), (6, 3, 72, 1),
    (7, 0, 74, 2), (7, 2, 79, 2),
    (8, 0, 77, 1.5), (8, 1.5, 76, .5), (8, 2, 74, 2),
]
for b, beat, n_, ln in mel:
    add(celesta(n_, max(1.2, ln * BEAT + .9)), b * BAR + beat * BEAT, .1, .62)

# ---- sleigh bells: soft eighths from bar 3, accent on 2 and 4
for b in range(2, 9):
    for k in range(8):
        add(bell_shake(.16, 1.0 if k in (2, 6) else .55), b * BAR + k * BEAT / 2 + rng.uniform(-.006, .006), .45 if k % 2 else -.1)

# ---- glockenspiel sparkles on some downbeats + a rising run into the logo
for b in (2, 4, 6):
    add(glock(84), b * BAR, -.5, .35)
run = [72, 76, 79, 84, 88, 91]
for k, n_ in enumerate(run):
    add(glock(n_, .9), LOGO - .55 + k * .085, -.4 + k * .16, .3)

# ---- final chord on the logo: C major, piano + strings + celesta + glock, long tail
fin = [36, 48, 55, 60, 64, 67, 72]
for k, n_ in enumerate(fin): add(piano(n_ + (12 if n_ < 48 else 0), 3.2), LOGO + k * .01, -.3 + k * .1, .5)
add(strings([60, 64, 67], 3.0), LOGO, 0, 1.0)
for n_ in (84, 88, 91): add(celesta(n_, 2.4), LOGO + .02, .2, .4)
add(glock(96, 1.8), LOGO + .05, .5, .3)

# ---- reverb (FFT convolution with a soft stereo tail)
def ir(seed, dur=2.2):
    r = np.random.default_rng(seed); n = int(dur * SR); t = np.arange(n) / SR
    x = r.standard_normal(n) * np.exp(-t / (dur / 6.9)); x[:int(.012 * SR)] = 0
    y = np.zeros(n); s = 0.0; k = 1 - np.exp(-2 * np.pi * 4200 / SR)
    for i in range(n): s += k * (x[i] - s); y[i] = s
    return y / np.abs(y).sum() * 18
def fftconv(a, b):
    n = len(a) + len(b) - 1; m = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(a, m) * np.fft.rfft(b, m), m)[:len(a)]
wl, wr = fftconv(L, ir(1)), fftconv(R, ir(2))
L2, R2 = L * .78 + wl * .32, R * .78 + wr * .32
fade_in = np.minimum(1, np.arange(N) / (SR * .8)); fade_out = np.minimum(1, (N - np.arange(N)) / (SR * 1.2))
L2 *= fade_in * fade_out; R2 *= fade_in * fade_out
pk = max(np.abs(L2).max(), np.abs(R2).max()); L2 /= pk / .89; R2 /= pk / .89
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.stack([L2, R2], 1) * 32767).astype('<i2').tobytes())
print('music:', OUT, f'{BAR * 60 / BAR / BEAT * 1:.1f} bpm' if False else f'bpm {60 / BEAT:.1f}')
