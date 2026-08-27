import { describe, it, expect } from 'vitest';
import { CHAPTERS, PAGE_ORDER, nextPage, prevPage, flatToc } from '@/lib/book';

describe('book', () => {
  it('has 5 top-level chapters numbered 01..05', () => {
    expect(CHAPTERS.map((c) => c.no)).toEqual(['01', '02', '03', '04', '05']);
  });

  it('chapter 02 (작업) has 3 sub-chapters 02.1..02.3', () => {
    const work = CHAPTERS.find((c) => c.no === '02')!;
    expect(work.children?.map((c) => c.no)).toEqual(['02.1', '02.2', '02.3']);
  });

  it('page order starts at cover and ends at contact', () => {
    expect(PAGE_ORDER[0]).toBe('/');
    expect(PAGE_ORDER[1]).toBe('/contents');
    expect(PAGE_ORDER[PAGE_ORDER.length - 1]).toBe('/contact');
  });

  it('nextPage / prevPage walk the order and clamp at the ends', () => {
    expect(nextPage('/')).toBe('/contents');
    expect(prevPage('/contents')).toBe('/');
    expect(prevPage('/')).toBeNull();
    expect(nextPage('/contact')).toBeNull();
    expect(nextPage('/nowhere')).toBeNull();
  });

  it('flatToc lists sub-chapters right after their parent', () => {
    const labels = flatToc().map((c) => c.no);
    expect(labels).toEqual(['01', '02', '02.1', '02.2', '02.3', '03', '04', '05']);
  });
});
