import { describe, it, expect } from 'vitest';
import { isBookRoute, directionFor, isTypingTarget } from '@/lib/nav';

describe('nav', () => {
  it('isBookRoute accepts only routes in the reading order', () => {
    expect(isBookRoute('/')).toBe(true);
    expect(isBookRoute('/work/hsm-key-integrity')).toBe(true);
    expect(isBookRoute('/nowhere')).toBe(false);
    expect(isBookRoute('#work')).toBe(false);
    expect(isBookRoute('mailto:x@y.z')).toBe(false);
    expect(isBookRoute('https://github.com/HyeonJ')).toBe(false);
  });

  it('directionFor follows the reading order and defaults to next', () => {
    expect(directionFor('/', '/contents')).toBe('next');
    expect(directionFor('/contents', '/')).toBe('prev');
    expect(directionFor('/resume', '/about')).toBe('prev');
    expect(directionFor('/about', '/about')).toBe('next');
    expect(directionFor('/unknown', '/about')).toBe('next');
    expect(directionFor('/about', '#hash')).toBe('next');
  });

  it('isTypingTarget recognises form fields and contenteditable', () => {
    expect(isTypingTarget({ tagName: 'INPUT' })).toBe(true);
    expect(isTypingTarget({ tagName: 'TEXTAREA' })).toBe(true);
    expect(isTypingTarget({ tagName: 'SELECT' })).toBe(true);
    expect(isTypingTarget({ tagName: 'DIV', isContentEditable: true })).toBe(true);
    expect(isTypingTarget({ tagName: 'DIV' })).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
});
