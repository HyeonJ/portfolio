import { describe, it, expect } from 'vitest';
import { resolveInitialTheme, toggleTheme, THEME_KEY } from '@/lib/theme';

describe('theme', () => {
  it('uses the stored value when present', () => {
    expect(resolveInitialTheme('night', false)).toBe('night');
    expect(resolveInitialTheme('day', true)).toBe('day');
  });
  it('falls back to system preference', () => {
    expect(resolveInitialTheme(null, true)).toBe('night');
    expect(resolveInitialTheme(null, false)).toBe('day');
  });
  it('ignores garbage stored values', () => {
    expect(resolveInitialTheme('purple', false)).toBe('day');
  });
  it('toggles', () => {
    expect(toggleTheme('day')).toBe('night');
    expect(toggleTheme('night')).toBe('day');
  });
  it('exports the storage key used by the inline init script', () => {
    expect(THEME_KEY).toBe('theme');
  });
});
