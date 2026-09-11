// 모서리 필(달력 벗겨냄) 순수 계산 — portfolio/prototypes/2026-09-11-corner-peel-v4.html(승인본)의
// 수학을 그대로 이식했다. 우하단 모서리에서 좌상단 대각선 방향으로 벗겨진다. 좌표 단위는 px.
// DOM에 어떻게 입히는지는 components/page-turn.tsx가 담당한다.

export type Pt = readonly [number, number];

/** 넘김 전체 길이 */
export const PEEL_DURATION_MS = 1000;
/** 벗겨짐 구간 종료 시점 — 이후는 릴리즈(남은 조각이 떠서 나감) */
export const PEEL_END = 0.72;
/** 대각선의 몇 %까지 벗긴 뒤 릴리즈로 넘어가는가 */
export const PEEL_FRAC = 0.66;
/** 밑장 스크림 최대 불투명도 */
export const SHADE_MAX = 0.95;
/** 스크림 차오름 완료 시점 */
export const SHADE_IN_END = 0.28;
/** 스크림 걷힘 시작 시점 */
export const SHADE_OUT_START = 0.55;

/** 반평면 클리핑(Sutherland–Hodgman 한 평면): P0을 지나고 법선 n인 직선에서 n·(p−P0) ≤ 0 쪽만 남긴다 */
export function clipPoly(poly: readonly Pt[], P0: Pt, n: Pt): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const da = (a[0] - P0[0]) * n[0] + (a[1] - P0[1]) * n[1];
    const db = (b[0] - P0[0]) * n[0] + (b[1] - P0[1]) * n[1];
    if (da <= 0) out.push(a);
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      const q: Pt = [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
      out.push(q);
    }
  }
  return out;
}

/** P0을 지나고 u에 수직인 직선(접힘선)에 대한 반사 — 두 번 적용하면 항등 */
export function mirrorAcross(q: Pt, P0: Pt, u: Pt): Pt {
  const d = (q[0] - P0[0]) * u[0] + (q[1] - P0[1]) * u[1];
  return [q[0] - 2 * d * u[0], q[1] - 2 * d * u[1]];
}

/** 꼭짓점 3개 미만이면 화면 밖 퇴화 폴리곤 — clip-path로 아무것도 안 보이게 */
export function toClipPath(poly: readonly Pt[]): string {
  if (poly.length < 3) return 'polygon(0 0, 0 0, 0 0)';
  return `polygon(${poly.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(', ')})`;
}

/** 벗겨짐 진행용 ease-in-out (quad) */
export const easeInOut = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** 양 끝 기울기 0 — 스크림 승하강·릴리즈 페이드용 (스냅 제거) */
export function smoothstep(a: number, b: number, t: number): number {
  const x = Math.min(Math.max((t - a) / (b - a), 0), 1);
  return x * x * (3 - 2 * x);
}

export type PeelFrameState = {
  /** 아직 벗겨지지 않은 앞장 영역 */
  frontClip: string;
  /** 접혀 뒤집힌 뒷면 영역 (접힘선 기준 반사) */
  foldClip: string;
  foldVisible: boolean;
  /** 밑장 스크림 불투명도 — 차오름 → 유지 → 걷힘 사다리꼴 엔벨로프 */
  shadeOpacity: number;
  /** 릴리즈 구간에서 앞장+접힘이 함께 받는 transform — 프로토타입의 %를 뷰포트 px로 환산 */
  releaseTransform: string;
  releaseOpacity: number;
};

/** 진행도 t(0→1)에서의 한 프레임. prev 방향은 호출부가 t를 1→0으로 뒤집어 쓴다. */
export function peelFrame(w: number, h: number, t: number): PeelFrameState {
  const L = Math.hypot(w, h);
  const C: Pt = [w, h]; // 우하단에서 시작
  const u: Pt = [-w / L, -h / L]; // 좌상단으로 진행
  const rect: Pt[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];

  const peelT = Math.min(t / PEEL_END, 1);
  const s = easeInOut(peelT) * L * PEEL_FRAC;
  const P0: Pt = [C[0] + s * u[0], C[1] + s * u[1]];

  const frontClip = toClipPath(clipPoly(rect, P0, [-u[0], -u[1]]));
  const peeled = clipPoly(rect, P0, u);
  const foldClip = toClipPath(peeled.map((q) => mirrorAcross(q, P0, u)));

  const envelope = smoothstep(0, SHADE_IN_END, t) * (1 - smoothstep(SHADE_OUT_START, 1, t));
  const shadeOpacity = SHADE_MAX * envelope;

  let releaseTransform = 'none';
  let releaseOpacity = 1;
  if (t > PEEL_END) {
    const r = smoothstep(PEEL_END, 1, t);
    // 프로토타입: translate(-4%, 2.4%) rotate(2.6deg) — %는 스테이지(=뷰포트) 크기 기준이라 px로 환산
    releaseTransform = `translate(${(-0.04 * w * r).toFixed(2)}px, ${(0.024 * h * r).toFixed(2)}px) rotate(${(2.6 * r).toFixed(3)}deg)`;
    releaseOpacity = 1 - r;
  }

  return { frontClip, foldClip, foldVisible: s > 1, shadeOpacity, releaseTransform, releaseOpacity };
}
