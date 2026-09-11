'use client';

import { usePathname } from 'next/navigation';
import { TurnLink } from '@/components/turn-link';

// 좌상단 고정 '표지' 마크 — 표지(/)를 제외한 모든 페이지에서 표지로 돌아가는 링크.
// 잎(.vt-page) 바깥에서 렌더되어야 낱장 넘김과 함께 회전하지 않는다 (page-turn.tsx 참고).
export function HomeMark() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return (
    <TurnLink href="/" aria-label="표지로" className="home-mark">
      표지
    </TurnLink>
  );
}
