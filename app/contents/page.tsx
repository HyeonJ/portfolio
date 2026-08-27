import type { Metadata } from 'next';
import { Paper } from '@/components/paper';
import { Toc } from '@/components/toc';
import { DayNight } from '@/components/day-night';
import { Masthead } from '@/components/masthead';
import { SITE } from '@/lib/book';

export const metadata: Metadata = { title: '차례' };

export default function Contents() {
  return (
    <Paper>
      <div className="mx-auto flex min-h-dvh w-[560px] max-w-[92vw] flex-col items-center justify-center py-16 text-center">
        <Masthead size="contents" />
        <div className="ink-2 my-6 h-px w-[60px]" style={{ background: 'var(--rule)' }} />
        <p className="ink-2 max-w-[460px] text-[16px] leading-[1.9]" style={{ color: 'var(--ink-2)' }}>
          {SITE.intro}
        </p>
        <div className="ink-3 mt-10 w-full">
          <Toc expanded />
        </div>
        <div className="ink-4 mt-10 flex gap-5 text-[13px] tracking-[0.04em]" style={{ color: 'var(--ink-3)' }}>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <span aria-hidden="true">·</span>
          <a href={SITE.github} rel="me noopener" target="_blank">
            github.com/HyeonJ
          </a>
        </div>
        <div className="ink-4 font-mono mt-6 text-[12px] tracking-[0.2em]" style={{ color: 'var(--ink-3)' }}>
          {SITE.edition}
        </div>
        <div className="ink-4">
          <DayNight />
        </div>
      </div>
    </Paper>
  );
}
