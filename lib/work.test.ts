import { describe, it, expect } from 'vitest';
import { WORK_SLUGS, hasWorkContent } from '@/lib/work';
import { WORK_CHAPTERS } from '@/lib/book';

describe('work content', () => {
  it('every chapter slug has a registered MDX module', () => {
    const chapterSlugs = WORK_CHAPTERS.map((c) => c.href.replace('/work/', ''));
    expect(WORK_SLUGS).toEqual(chapterSlugs);
    for (const s of chapterSlugs) expect(hasWorkContent(s)).toBe(true);
  });
  it('unknown slug has no content', () => {
    expect(hasWorkContent('nope')).toBe(false);
  });
});
