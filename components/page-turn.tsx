'use client';

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { nextPage, prevPage } from '@/lib/book';
import { isTypingTarget, type TurnDirection } from '@/lib/nav';
import { peelFrame, PEEL_DURATION_MS } from '@/lib/peel';
import { HomeMark } from '@/components/home-mark';
import { DayNight } from '@/components/day-night';

type TurnFn = (href: string, dir: TurnDirection) => void;

const TurnContext = createContext<TurnFn>(() => {});

// pathname이 끝내 바뀌지 않는 push(중단된 내비게이션 등)에 대비한 settle 대기 상한.
const NAV_TIMEOUT_MS = 1500;
// 넘김 전체의 안전판: nav 대기(≤1500) + 애니메이션(1000) + 여유. rAF가 멎어도(백그라운드 탭 등) 고착되지 않는다.
const TURN_TIMEOUT_MS = 2600;

function el(className: string): HTMLDivElement {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

// 현재 화면을 통째로 복제한 '낱장'(하늘 배경 + 잎) — next에선 벗겨지는 앞장, prev에선 깔리는 밑장이 된다.
function cloneSheet(pageEl: HTMLElement): HTMLDivElement {
  const sheet = el('peel-sheet');
  const sky = document.querySelector('[data-sky]');
  if (sky) {
    const skyClone = sky.cloneNode(true) as HTMLElement;
    skyClone.style.position = 'absolute'; // fixed → 낱장 기준
    // 중복 id 제거 — url(#grain)은 원본 Sky의 필터로 해석되므로 지질감은 유지된다
    skyClone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    sheet.appendChild(skyClone);
  }
  const pageClone = pageEl.cloneNode(true) as HTMLElement;
  pageClone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  pageClone.style.transform = `translateY(${-window.scrollY}px)`; // 스크롤된 상태 그대로 보이도록
  sheet.appendChild(pageClone);
  return sheet;
}

export function PageTurnProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pageRef = useRef<HTMLDivElement>(null);
  const resolveNav = useRef<(() => void) | null>(null);
  const turning = useRef(false);
  const lastPush = useRef<string | null>(null);
  const lastPushTimer = useRef(0);

  useEffect(() => {
    resolveNav.current?.();
    resolveNav.current = null;
    window.clearTimeout(lastPushTimer.current);
    lastPush.current = null;
  }, [pathname]);

  const prev = prevPage(pathname);
  const next = nextPage(pathname);

  useEffect(() => {
    if (prev) router.prefetch(prev);
    if (next) router.prefetch(next);
  }, [router, prev, next]);

  const turn = useCallback<TurnFn>(
    (href, dir) => {
      if (href === pathname || turning.current || href === lastPush.current) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // 같은 목적지 연타 방지 표시. pathname이 끝내 안 바뀌는 push도 있으므로 스스로 만료시킨다.
      lastPush.current = href;
      window.clearTimeout(lastPushTimer.current);
      lastPushTimer.current = window.setTimeout(() => {
        if (lastPush.current === href) lastPush.current = null;
      }, TURN_TIMEOUT_MS);
      const pageEl = pageRef.current;
      if (reduced || !pageEl) {
        router.push(href);
        return;
      }
      turning.current = true;
      document.documentElement.dataset.turn = dir;

      // 리사이즈가 넘김 도중 일어나도 시작 시점 크기로 계속 간다 (1초짜리 오버레이 — 재계산 불필요)
      const w = window.innerWidth;
      const h = window.innerHeight;
      const layers: HTMLElement[] = [];
      let scrim: HTMLElement;
      let fold: HTMLElement;
      let apply: (t: number) => void;

      if (dir === 'next') {
        // 오버레이 스택(z20, 크롬 z50 아래): 스크림 → [앞장(옛 페이지 클론) + 접힘] 그룹.
        // 실제 목적지 페이지는 스택 아래(z-auto)에서 미리 렌더되고, 앞장이 벗겨지며 드러난다.
        const stack = el('peel-layer peel-layer--stack');
        stack.setAttribute('aria-hidden', 'true');
        scrim = el('peel-fill peel-scrim');
        const group = el('peel-fill peel-group');
        const front = el('peel-fill peel-front');
        front.appendChild(cloneSheet(pageEl));
        fold = el('peel-fill peel-fold');
        group.append(front, fold);
        stack.append(scrim, group);
        document.body.appendChild(stack);
        layers.push(stack);
        apply = (t) => {
          const f = peelFrame(w, h, t);
          front.style.clipPath = f.frontClip;
          fold.style.display = f.foldVisible ? 'block' : 'none';
          fold.style.clipPath = f.foldClip;
          scrim.style.opacity = String(f.shadeOpacity);
          group.style.transform = f.releaseTransform;
          group.style.opacity = String(f.releaseOpacity);
        };
      } else {
        // prev: 옛 페이지 클론을 밑장(z10)으로 깔고, 실제 목적지 페이지(.vt-page, data-turn CSS로 z30)를
        // '앞장'으로 직접 클리핑해 t 1→0 역재생 — 목적지가 밑장 위로 되감겨 덮인다. 스크림 z20, 접힘 z40.
        const under = el('peel-layer peel-layer--under');
        under.appendChild(cloneSheet(pageEl));
        scrim = el('peel-layer peel-layer--scrim peel-scrim');
        fold = el('peel-layer peel-layer--fold peel-fold');
        for (const layer of [under, scrim, fold]) {
          layer.setAttribute('aria-hidden', 'true');
          document.body.appendChild(layer);
          layers.push(layer);
        }
        // 릴리즈 transform은 프로토타입에서 그룹(=뷰포트) 중심 회전 — 문서 높이가 다른 .vt-page에도 같은 원점을 강제
        const origin = `${w / 2}px ${h / 2}px`;
        apply = (t) => {
          const f = peelFrame(w, h, t);
          pageEl.style.clipPath = f.frontClip;
          pageEl.style.transform = f.releaseTransform;
          pageEl.style.transformOrigin = origin;
          pageEl.style.opacity = String(f.releaseOpacity);
          fold.style.display = f.foldVisible ? 'block' : 'none';
          fold.style.clipPath = f.foldClip;
          fold.style.transform = f.releaseTransform;
          fold.style.transformOrigin = origin;
          fold.style.opacity = String(f.releaseOpacity);
          scrim.style.opacity = String(f.shadeOpacity);
        };
        // push 전에 앞장을 t=1(완전히 벗겨진 상태)로 — 옛 페이지가 동일한 밑장 클론 뒤로 숨어 화면 점프가 없다
        apply(1);
      }

      let rafId = 0;
      let hardTimer = 0;
      let finished = false;
      const cleanup = () => {
        if (finished) return;
        finished = true;
        window.cancelAnimationFrame(rafId);
        window.clearTimeout(hardTimer);
        for (const layer of layers) layer.remove();
        // prev에서 실제 페이지에 직접 입힌 인라인 스타일 원복 (next에선 no-op)
        pageEl.style.clipPath = '';
        pageEl.style.transform = '';
        pageEl.style.transformOrigin = '';
        pageEl.style.opacity = '';
        delete document.documentElement.dataset.turn;
        turning.current = false;
      };
      hardTimer = window.setTimeout(cleanup, TURN_TIMEOUT_MS);

      const navigate = () =>
        new Promise<void>((resolve) => {
          let timer = 0;
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timer);
            if (resolveNav.current === finish) resolveNav.current = null;
            resolve();
          };
          timer = window.setTimeout(finish, NAV_TIMEOUT_MS);
          resolveNav.current = finish;
          router.push(href);
        });

      const run = () => {
        if (finished) return;
        const start = performance.now();
        const forward = dir === 'next';
        const tick = (now: number) => {
          if (finished) return;
          const p = Math.min((now - start) / PEEL_DURATION_MS, 1);
          apply(forward ? p : 1 - p);
          if (p < 1) rafId = window.requestAnimationFrame(tick);
          else cleanup();
        };
        rafId = window.requestAnimationFrame(tick);
      };

      navigate().then(run);
    },
    [router, pathname],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (isTypingTarget(e.target)) return;
      if (e.key === 'ArrowRight') {
        if (next) turn(next, 'next');
      } else if (e.key === 'ArrowLeft') {
        if (prev) turn(prev, 'prev');
      }
    };
    window.addEventListener('keydown', onKey);
    // E2E/초기 입력 경쟁 방지용 준비 신호 — 리스너가 붙은 뒤에만 키 입력이 유효하다
    document.documentElement.dataset.turnReady = '';
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, turn]);

  return (
    <TurnContext.Provider value={turn}>
      {/* 잎(leaf) 래퍼 — 넘김 오버레이의 복제 원본이자 prev에선 직접 클리핑되는 앞장.
          배경(Sky)·홈 마크·엣지 버튼은 이 바깥에 있어 함께 벗겨지지 않는다. */}
      <div className="vt-page" ref={pageRef}>
        {children}
      </div>
      {/* TurnLink가 useTurn 컨텍스트를 쓰므로 Provider 안·잎 바깥인 이 위치에 렌더 */}
      <HomeMark />
      {/* GNB 낮/밤 토글 — 홈 마크(좌상단 16/22)의 우상단 거울상. 잎 바깥 크롬(z50)이라 넘김에 벗겨지지 않고 모든 페이지(표지 포함)에 뜬다.
          버튼(h-11)의 내부 여백 12px을 빼고 아이콘이 시각적으로 ~16px/22px에 놓이도록 박스는 7px/10px에 둔다. */}
      <div className="fixed right-[10px] top-[7px] z-50">
        <DayNight />
      </div>
      {prev && (
        <button
          type="button"
          aria-label="이전 장"
          data-testid="edge-prev"
          onClick={() => turn(prev, 'prev')}
          className="fixed inset-y-1/4 left-0 z-50 hidden w-12 cursor-w-resize md:block"
        />
      )}
      {next && (
        <button
          type="button"
          aria-label="다음 장"
          data-testid="edge-next"
          onClick={() => turn(next, 'next')}
          className="fixed inset-y-1/4 right-0 z-50 hidden w-12 cursor-e-resize md:block"
        />
      )}
    </TurnContext.Provider>
  );
}

export function useTurn(): TurnFn {
  return useContext(TurnContext);
}
