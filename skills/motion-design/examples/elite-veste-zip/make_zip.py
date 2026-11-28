#!/usr/bin/env python3
# Zipper sound: a train of tiny filtered clicks whose rate follows the pull's speed, plus a soft fabric rustle.
#   python3 make_zip.py -> assets/sfx/zip.wav (0.65 s) and assets/sfx/clink.wav (hanger)
import os, wave
import numpy as np
SR = 48000; rng = np.random.default_rng(4)
def save(name, x):
    x = x / np.abs(x).max() * .89; x = np.stack([x, x], 1)
    with wave.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'sfx', name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())
D = .65; N = int(D * SR); x = np.zeros(N); t = 0.
while t < D:
    k = t / D; rate = 60 + 260 * np.sin(np.pi * k) ** 1.5      # clicks per second, fastest mid-pull
    i = int(t * SR); n = int(.004 * SR); c = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * .0008))
    x[i:i + n] += c[:max(0, N - i)] * (.6 + .4 * np.sin(np.pi * k)); t += 1 / rate
y = np.zeros_like(x); s = 0.; a = 1 - np.exp(-2 * np.pi * 5000 / SR)
for i in range(N): s += a * (x[i] - s); y[i] = x[i] - s * .6
rust = rng.standard_normal(N) * np.sin(np.pi * np.arange(N) / N) ** 2 * .08
save('zip.wav', y + rust)
tt = np.arange(int(.5 * SR)) / SR
save('clink.wav', sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * d) for f, d in [(2200, 9), (3300, 12), (5100, 16)]))
print('zip.wav, clink.wav written')
