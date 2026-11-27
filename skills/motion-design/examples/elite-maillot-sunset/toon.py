#!/usr/bin/env python3
# Turns the jersey cut-outs into "loading screen" illustrations: edge-preserving smoothing, colour posterize,
# ink lines from the edges, thick dark outline around the silhouette, alpha kept.  -> assets/img/toon-*.png
import sys, os, cv2, numpy as np
for f in sys.argv[1:]:
    a = cv2.imread(f, cv2.IMREAD_UNCHANGED); bgr, al = a[:, :, :3], a[:, :, 3]
    s = cv2.edgePreservingFilter(bgr, flags=1, sigma_s=40, sigma_r=.35)
    s = cv2.bilateralFilter(s, 9, 60, 60)
    q = (s // 28) * 28 + 14
    hsv = cv2.cvtColor(q.astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32); hsv[..., 1] = np.clip(hsv[..., 1] * 1.35, 0, 255); hsv[..., 2] = np.clip((hsv[..., 2] - 128) * 1.15 + 140, 0, 255)
    q = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    g = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY); g = cv2.medianBlur(g, 5)
    ed = cv2.adaptiveThreshold(g, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 6)
    q[ed == 0] = (q[ed == 0] * .25).astype(np.uint8)
    m = (al > 128).astype(np.uint8); k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    big = cv2.dilate(m, k); out = np.zeros((*m.shape, 4), np.uint8)
    out[big > 0] = (20, 12, 18, 255); out[m > 0, :3] = q[m > 0]; out[m > 0, 3] = 255
    pad = 20; out = cv2.copyMakeBorder(out, pad, pad, pad, pad, cv2.BORDER_CONSTANT, value=(0, 0, 0, 0))
    cv2.imwrite(os.path.join(os.path.dirname(f), 'toon-' + os.path.basename(f)), out)
