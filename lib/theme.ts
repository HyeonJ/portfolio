export type Theme = 'day' | 'night';
export const THEME_KEY = 'theme';

// app/layout.tsx의 THEME_INIT 인라인 스크립트와 같은 규칙. 둘을 함께 유지한다.
export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'day' || stored === 'night') return stored;
  return prefersDark ? 'night' : 'day';
}

export function toggleTheme(t: Theme): Theme {
  return t === 'day' ? 'night' : 'day';
}
