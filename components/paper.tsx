import type { ReactNode } from 'react';

// 배경(종이색·지질감·별)은 components/sky.tsx로 분리되어 layout에서 렌더된다.
// Paper는 이제 잎(.vt-page) 안에서 넘어가는 내용면만 담당한다 — 배경을 다시 넣으면 배경이 잎과 함께 회전하므로 금지.
// relative 유지 필수: fixed인 Sky보다 위에 페인트되려면 positioned여야 한다.
export function Paper({ children }: { children: ReactNode }) {
  return <main className="relative min-h-dvh">{children}</main>;
}
