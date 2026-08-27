export type Theme = 'day' | 'night';
export const THEME_KEY = 'theme';

export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'day' || stored === 'night') return stored;
  return prefersDark ? 'night' : 'day';
}

export function toggleTheme(t: Theme): Theme {
  return t === 'day' ? 'night' : 'day';
}
