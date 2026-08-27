'use client';

import { useEffect, useState } from 'react';
import { THEME_KEY, toggleTheme, type Theme } from '@/lib/theme';

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'night' ? 'night' : 'day';
}

export function DayNight() {
  const [theme, setTheme] = useState<Theme>('day');

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const apply = (next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.key.toLowerCase() === 'n') apply(toggleTheme(readTheme()));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const night = theme === 'night';
  return (
    <button
      type="button"
      aria-label={night ? '낮으로 전환' : '밤으로 전환'}
      aria-pressed={night}
      data-testid="day-night"
      onClick={() => apply(toggleTheme(theme))}
      className="mt-3 inline-flex h-11 w-11 items-center justify-center rounded-full"
      style={{ color: 'var(--ink-2)' }}
    >
      {night ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
