import { describe, it, expect } from 'vitest';
import {
  clipPoly,
  easeInOut,
  mirrorAcross,
  peelFrame,
  smoothstep,
  toClipPath,
  PEEL_END,
  SHADE_IN_END,
  SHADE_MAX,
  SHADE_OUT_START,
  type Pt,
} from '@/lib/peel';

// shoelace — 시계/반시계 무관 절대 면적
function area(poly: readonly Pt[]): number {
  let sum = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

const RECT: Pt[] = [
  [0, 0],
  [2, 0],
  [2, 2],
  [0, 2],
];

describe('clipPoly', () => {
  it('keeps the half of a rect on the negative side of a mid-line', () => {
    // x=1 수직선, 법선 +x → x<=1 쪽 유지
    const out = clipPoly(RECT, [1, 0], [1, 0]);
    expect(out).toHaveLength(4);
    expect(area(out)).toBeCloseTo(2, 10);
    for (const [x] of out) expect(x).toBeLessThanOrEqual(1 + 1e-9);
  });

  it('corner cut yields a pentagon and the complement is a triangle', () => {
    // 우하단 모서리를 지나는 대각 절단 — P0=(1.5,1.5), 법선은 모서리 방향
    const n: Pt = [1, 1];
    const kept = clipPoly(RECT, [1.5, 1.5], n);
    const cut = clipPoly(RECT, [1.5, 1.5], [-n[0], -n[1]]);
    expect(kept).toHaveLength(5);
    expect(cut).toHaveLength(3);
    expect(area(kept) + area(cut)).toBeCloseTo(4, 10);
  });

  it('plane outside the rect keeps everything or nothing', () => {
    expect(area(clipPoly(RECT, [5, 0], [1, 0]))).toBeCloseTo(4, 10);
    expect(clipPoly(RECT, [-1, 0], [1, 0])).toHaveLength(0);
  });
});

describe('mirrorAcross', () => {
  it('reflects across the line through P0 perpendicular to u', () => {
    // P0=(0,0), u=+x → x 부호 반전
    expect(mirrorAcross([3, 5], [0, 0], [1, 0])).toEqual([-3, 5]);
  });

  it('is an involution (mirror twice = identity)', () => {
    const P0: Pt = [1.3, -0.7];
    const raw: Pt = [0.6, 0.8];
    const len = Math.hypot(raw[0], raw[1]);
    const u: Pt = [raw[0] / len, raw[1] / len];
    const pts: Pt[] = [
      [0, 0],
      [4.2, -1.1],
      [-3.3, 7.7],
      [1.3, -0.7],
    ];
    for (const q of pts) {
      const twice = mirrorAcross(mirrorAcross(q, P0, u), P0, u);
      expect(twice[0]).toBeCloseTo(q[0], 10);
      expect(twice[1]).toBeCloseTo(q[1], 10);
    }
  });
});

describe('smoothstep / easeInOut', () => {
  it('hits exact boundary values and clamps outside', () => {
    expect(smoothstep(0.2, 0.8, 0.2)).toBe(0);
    expect(smoothstep(0.2, 0.8, 0.8)).toBe(1);
    expect(smoothstep(0.2, 0.8, 0)).toBe(0);
    expect(smoothstep(0.2, 0.8, 1)).toBe(1);
    expect(smoothstep(0.2, 0.8, 0.5)).toBeCloseTo(0.5, 10);
  });

  it('has zero slope at both ends (no snap)', () => {
    const eps = 1e-4;
    const startSlope = (smoothstep(0, 1, eps) - smoothstep(0, 1, 0)) / eps;
    const endSlope = (smoothstep(0, 1, 1) - smoothstep(0, 1, 1 - eps)) / eps;
    expect(startSlope).toBeLessThan(1e-3);
    expect(endSlope).toBeLessThan(1e-3);
  });

  it('easeInOut fixes 0, 0.5, 1', () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(0.5)).toBeCloseTo(0.5, 10);
    expect(easeInOut(1)).toBe(1);
  });
});

describe('toClipPath', () => {
  it('renders px vertices and degenerates below 3 points', () => {
    expect(toClipPath(RECT)).toBe('polygon(0.0px 0.0px, 2.0px 0.0px, 2.0px 2.0px, 0.0px 2.0px)');
    expect(toClipPath([])).toBe('polygon(0 0, 0 0, 0 0)');
    expect(toClipPath([[1, 1], [2, 2]])).toBe('polygon(0 0, 0 0, 0 0)');
  });
});

describe('peelFrame', () => {
  const W = 1600;
  const H = 1000;
  const FULL = toClipPath([
    [0, 0],
    [W, 0],
    [W, H],
    [0, H],
  ]);

  it('t=0: full front, no fold, no shade, no release', () => {
    const f = peelFrame(W, H, 0);
    expect(f.frontClip).toBe(FULL);
    expect(f.foldVisible).toBe(false);
    expect(f.shadeOpacity).toBe(0);
    expect(f.releaseTransform).toBe('none');
    expect(f.releaseOpacity).toBe(1);
  });

  it('t=1: release fully gone and scrim exactly 0 (no-snap guarantee)', () => {
    const f = peelFrame(W, H, 1);
    expect(f.releaseOpacity).toBe(0);
    expect(f.shadeOpacity).toBe(0);
  });

  it('scrim envelope holds at SHADE_MAX on the plateau and rises/falls around it', () => {
    for (const t of [SHADE_IN_END, 0.4, SHADE_OUT_START]) {
      expect(peelFrame(W, H, t).shadeOpacity).toBeCloseTo(SHADE_MAX, 10);
    }
    expect(peelFrame(W, H, SHADE_IN_END / 2).shadeOpacity).toBeGreaterThan(0);
    expect(peelFrame(W, H, SHADE_IN_END / 2).shadeOpacity).toBeLessThan(SHADE_MAX);
    const late = (SHADE_OUT_START + 1) / 2;
    expect(peelFrame(W, H, late).shadeOpacity).toBeGreaterThan(0);
    expect(peelFrame(W, H, late).shadeOpacity).toBeLessThan(SHADE_MAX);
  });

  it('mid-peel: fold visible, front clipped from the bottom-right corner', () => {
    const f = peelFrame(W, H, PEEL_END / 2);
    expect(f.foldVisible).toBe(true);
    expect(f.frontClip).not.toBe(FULL);
    expect(f.frontClip.startsWith('polygon(')).toBe(true);
    expect(f.foldClip.startsWith('polygon(')).toBe(true);
    // 벗겨짐 구간에서는 릴리즈 없음
    expect(f.releaseTransform).toBe('none');
    expect(f.releaseOpacity).toBe(1);
  });

  it('release phase moves up-left and fades with smoothstep', () => {
    const mid = peelFrame(W, H, (PEEL_END + 1) / 2);
    expect(mid.releaseTransform).toMatch(/^translate\(-.+px, .+px\) rotate\(.+deg\)$/);
    expect(mid.releaseOpacity).toBeGreaterThan(0);
    expect(mid.releaseOpacity).toBeLessThan(1);
  });
});
