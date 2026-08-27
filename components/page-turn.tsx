'use client';

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { nextPage, prevPage } from '@/lib/book';
import { isTypingTarget, type TurnDirection } from '@/lib/nav';

type TurnFn = (href: string, dir: TurnDirection) => void;

const TurnContext = createContext<TurnFn>(() => {});

// pathname이 끝내 바뀌지 않는 push(중단된 내비게이션 등)에 대비한 안전판.
// 없으면 startViewTransition의 update 콜백이 영원히 pending → finished도 settle 안 됨 → 넘김 고착.
const TURN_TIMEOUT_MS = 2000;

export function PageTurnProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
      const startVT = document.startViewTransition?.bind(document);
      // 같은 목적지 연타 방지 표시. pathname이 끝내 안 바뀌는 push도 있으므로 스스로 만료시킨다.
      lastPush.current = href;
      window.clearTimeout(lastPushTimer.current);
      lastPushTimer.current = window.setTimeout(() => {
        if (lastPush.current === href) lastPush.current = null;
      }, TURN_TIMEOUT_MS);
      if (!startVT || reduced) {
        router.push(href);
        return;
      }
      turning.current = true;
      document.documentElement.dataset.turn = dir;
      const cleanup = () => {
        delete document.documentElement.dataset.turn;
        turning.current = false;
      };
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
          timer = window.setTimeout(finish, TURN_TIMEOUT_MS);
          resolveNav.current = finish;
          router.push(href);
        });
      startVT(navigate).finished.then(cleanup, cleanup);
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
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, turn]);

  return (
    <TurnContext.Provider value={turn}>
      {children}
      {prev && (
        <button
          type="button"
          aria-label="이전 장"
          data-testid="edge-prev"
          onClick={() => turn(prev, 'prev')}
          className="fixed inset-y-1/4 left-0 hidden w-12 cursor-w-resize md:block"
        />
      )}
      {next && (
        <button
          type="button"
          aria-label="다음 장"
          data-testid="edge-next"
          onClick={() => turn(next, 'next')}
          className="fixed inset-y-1/4 right-0 hidden w-12 cursor-e-resize md:block"
        />
      )}
    </TurnContext.Provider>
  );
}

export function useTurn(): TurnFn {
  return useContext(TurnContext);
}
