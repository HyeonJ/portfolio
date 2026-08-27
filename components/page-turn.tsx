'use client';

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { nextPage, prevPage } from '@/lib/book';

export type TurnDirection = 'next' | 'prev';
type TurnFn = (href: string, dir: TurnDirection) => void;

const TurnContext = createContext<TurnFn>(() => {});

type VTDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> };
};

export function PageTurnProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const resolveNav = useRef<(() => void) | null>(null);
  const turning = useRef(false);

  useEffect(() => {
    resolveNav.current?.();
    resolveNav.current = null;
  }, [pathname]);

  const turn = useCallback<TurnFn>(
    (href, dir) => {
      if (href === pathname || turning.current) return;
      const doc = document as VTDocument;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!doc.startViewTransition || reduced) {
        router.push(href);
        return;
      }
      turning.current = true;
      document.documentElement.dataset.turn = dir;
      const navigate = () =>
        new Promise<void>((resolve) => {
          resolveNav.current = resolve;
          router.push(href);
        });
      doc.startViewTransition(navigate).finished.finally(() => {
        delete document.documentElement.dataset.turn;
        turning.current = false;
      });
    },
    [router, pathname],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight') {
        const n = nextPage(pathname);
        if (n) turn(n, 'next');
      } else if (e.key === 'ArrowLeft') {
        const p = prevPage(pathname);
        if (p) turn(p, 'prev');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pathname, turn]);

  const prev = prevPage(pathname);
  const next = nextPage(pathname);

  return (
    <TurnContext.Provider value={turn}>
      {children}
      {prev && (
        <button
          type="button"
          aria-label="이전 장"
          data-testid="edge-prev"
          onClick={() => turn(prev, 'prev')}
          className="fixed inset-y-0 left-0 hidden w-12 cursor-w-resize md:block"
        />
      )}
      {next && (
        <button
          type="button"
          aria-label="다음 장"
          data-testid="edge-next"
          onClick={() => turn(next, 'next')}
          className="fixed inset-y-0 right-0 hidden w-12 cursor-e-resize md:block"
        />
      )}
    </TurnContext.Provider>
  );
}

export function useTurn(): TurnFn {
  return useContext(TurnContext);
}
