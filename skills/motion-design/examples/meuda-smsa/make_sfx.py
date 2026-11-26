#!/usr/bin/env python3
# Sound kit for the Élite Maillot ad, synthesized from scratch (numpy only), modelled on the sound design of the
# reference: a quiet low pad, a whoosh on every camera move, rising pops when the widgets appear, key clicks,
# soft thuds on landings, a two-note message chime, a payment success chime, and a logo sting (boom + chord).
#   python3 make_sfx.py  -> assets/sfx/*.wav  and  assets/music.wav
import os, wave
import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
os.makedirs(os.path.join(OUT, 'sfx'), exist_ok=True)
rng = np.random.default_rng(7)

def save(name, x, stereo=True):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1 and stereo: x = np.stack([x, x], 1)
    peak = np.abs(x).max() or 1
    x = x / peak * .89
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(2 if x.ndim == 2 else 1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())

T = lambda d: np.arange(int(d * SR)) / SR

def onepole_lp(x, fc):          # fc may be an array (time-varying)
    fc = np.broadcast_to(fc, x.shape); y = np.zeros_like(x); s = 0.0
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y

def bandpass(x, fc, q=1.2):     # state-variable filter, fc time-varying
    fc = np.broadcast_to(fc, x.shape); y = np.zeros_like(x); lp = bp = 0.0
    for i in range(len(x)):
        f = 2 * np.sin(np.pi * min(fc[i], SR / 6) / SR)
        hp = x[i] - lp - bp / q; bp += f * hp; lp += f * bp; y[i] = bp
    return y

def reverb(x, mix=.25, decay=1.6):
    n = int(decay * SR); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (decay * SR / 6.9))
    ir = onepole_lp(ir, 5000.0); wet = np.convolve(x, ir)[:len(x) + n]
    wet = wet / (np.abs(wet).max() or 1); dry = np.concatenate([x, np.zeros(n)]); m = min(len(wet), len(dry)); wet, dry = wet[:m], dry[:m]
    return dry * (1 - mix) + wet * mix * np.abs(x).max()

def whoosh(d, f0, f1, peak=.5, stereo_pan=True):
    t = T(d); k = t / d
    env = np.sin(np.pi * np.clip(k, 0, 1)) ** 2 * np.exp(-3 * np.maximum(0, k - peak) ** 2)
    env = np.where(k < peak, np.sin(np.pi / 2 * k / peak) ** 2, np.exp(-((k - peak) / (1 - peak) * 2.2) ** 2))
    fc = f0 * (f1 / f0) ** np.where(k < peak, k / peak, 1 - (k - peak) / (1 - peak) * .6)
    n = rng.standard_normal(len(t))
    a = bandpass(n, fc, .9) * env; b = bandpass(rng.standard_normal(len(t)), fc * 1.07, .9) * env
    if stereo_pan:
        pan = np.linspace(-.6, .6, len(t))
        return np.stack([a * (1 - pan) * .8 + b * .2, b * (1 + pan) * .8 + a * .2], 1)
    return a

def pop(f, d=.16):
    t = T(d); fr = f * (1 + .6 * np.exp(-t * 60))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    x = np.sin(ph) * np.exp(-t * 26) + .25 * np.sin(2 * ph) * np.exp(-t * 40)
    x[:int(.002 * SR)] *= np.linspace(0, 1, int(.002 * SR))
    return reverb(x, .15, .5)

def click(d=.05, f=3200):
    t = T(d); n = rng.standard_normal(len(t))
    x = bandpass(n, np.full(len(t), f), 2.5) * np.exp(-t * 180) + .3 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 260)
    return x

def thud(d=.5, f0=120, f1=48):
    t = T(d); fr = f1 + (f0 - f1) * np.exp(-t * 18); ph = 2 * np.pi * np.cumsum(fr) / SR
    x = np.sin(ph) * np.exp(-t * 7) + .2 * onepole_lp(rng.standard_normal(len(t)), 900.0) * np.exp(-t * 40)
    return x

def bell(freqs, d=1.2, decay=4.5, amps=None):
    t = T(d); x = np.zeros(len(t))
    for i, f in enumerate(freqs):
        a = (amps or [1] * len(freqs))[i]
        x += a * (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2.01 * t) * np.exp(-t * 6)) * np.exp(-t * decay)
    x[:int(.003 * SR)] *= np.linspace(0, 1, int(.003 * SR))
    return x

def seq(parts, gap):
    total = int(sum(gap) * SR) + max(len(p) for p in parts)
    y = np.zeros(total); o = 0
    for p, g in zip(parts, gap + [0]):
        y[o:o + len(p)] += p; o += int(g * SR)
    return y

# ---- kit
save('sfx/whoosh-long.wav', whoosh(1.7, 300, 5200, .55))
save('sfx/whoosh-med.wav', whoosh(.95, 400, 4200, .5))
save('sfx/whoosh-short.wav', whoosh(.55, 600, 5000, .45))
save('sfx/whoosh-rise.wav', whoosh(2.0, 180, 6000, .82))
for i, f in enumerate([520, 587, 659, 740, 830, 932, 1047, 1175, 1319]):
    save(f'sfx/pop-{i + 1}.wav', pop(f))
save('sfx/key.wav', click(.045, 3600))
save('sfx/tap.wav', click(.07, 2400) * .8 + thud(.07, 300, 200) * .3)
save('sfx/thud.wav', thud())
save('sfx/side.wav', seq([click(.05, 1500), click(.05, 1500)], [.11]))
save('sfx/msg.wav', reverb(seq([bell([1318.5], .35, 14), bell([1760], .5, 10)], [.09]), .2, .8))
save('sfx/pay-ok.wav', reverb(seq([bell([1046.5, 2093], .5, 9, [1, .3]), bell([1568, 3136], .9, 5, [1, .25])], [.12]), .25, 1.2))
save('sfx/blip.wav', pop(1568, .1) * .6)
boom = np.concatenate([thud(2.0, 90, 38) * 1.2, np.zeros(SR)])
chord = bell([220, 277.2, 329.6, 440, 554.4, 659.3], 2.6, 1.6, [1, .8, .8, .6, .4, .35])
sting = np.zeros(int(3.2 * SR)); sting[:len(boom)] += boom[:len(sting)]; sting[int(.02 * SR):int(.02 * SR) + len(chord)] += chord * .7
save('sfx/logo-sting.wav', reverb(sting, .3, 2.2))

# ---- bed: a soft, slowly breathing low pad (A minor add9), like the reference's quiet tonal floor
D = 30; t = T(D)
pad = np.zeros(len(t))
for f, a in [(110, 1), (164.8, .6), (220, .5), (246.9, .3), (329.6, .25), (440, .12)]:
    for det in (-.6, .6):
        pad += a * np.sin(2 * np.pi * (f + det) * t + rng.uniform(0, 6.28))
pad *= .55 + .45 * np.sin(2 * np.pi * t / 7.5) ** 2
pad = onepole_lp(pad, 1200.0)
fade = np.minimum(1, np.minimum(t / 1.5, (D - t) / 2))
save('music.wav', pad * fade)
print('sfx kit written to', OUT)
