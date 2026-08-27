import type { ReactNode } from 'react';
import { Paper } from '@/components/paper';
import { TurnLink } from '@/components/turn-link';
import { DayNight } from '@/components/day-night';
import { chapterFor, nextPage, prevPage } from '@/lib/book';

export function Chapter({ path, children }: { path: string; children?: ReactNode }) {
  const ch = chapterFor(path);
  const prev = prevPage(path);
  const next = nextPage(path);
  return (
    <Paper>
      <article className="mx-auto flex min-h-dvh w-[640px] max-w-[92vw] flex-col py-20">
        <div className="ink-1 font-mono text-[12px] tracking-[0.2em]" style={{ color: 'var(--ink-3)' }}>
          {ch?.no ?? '—'}
        </div>
        <h1 className="ink-1 mt-3 text-[34px] font-bold leading-[1.3]">{ch?.label ?? path}</h1>
        <div className="ink-2 mt-8 grow text-[16px] leading-[1.9]" style={{ color: 'var(--ink-2)' }}>
          {children ?? <p>이 장은 Plan 02에서 채웁니다.</p>}
        </div>
        <nav aria-label="장 이동" className="ink-3 mt-16 flex items-center justify-between text-[14px] tracking-[0.06em]">
          {prev ? <TurnLink href={prev}>← 이전 장</TurnLink> : <span />}
          <TurnLink href="/" className="font-mono text-[12px]" style={{ color: 'var(--ink-3)' }}>
            표지
          </TurnLink>
          {next ? <TurnLink href={next}>다음 장 →</TurnLink> : <span />}
        </nav>
        <div className="flex justify-center">
          <DayNight />
        </div>
      </article>
    </Paper>
  );
}
