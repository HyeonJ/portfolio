import { Paper } from '@/components/paper';
import { Toc } from '@/components/toc';
import { DayNight } from '@/components/day-night';
import { SITE } from '@/lib/book';

export default function Cover() {
  return (
    <Paper>
      <div className="mx-auto flex min-h-dvh w-[460px] max-w-[90vw] flex-col items-center justify-center text-center">
        <div className="ink-1 font-mono text-[11px] tracking-[0.3em]" style={{ color: 'var(--ink-3)' }}>
          PORTFOLIO · {SITE.year}
        </div>
        <h1 className="ink-1 mt-7 text-[84px] font-bold leading-[1.05] tracking-[0.06em]">정 현 인</h1>
        <div className="ink-1 font-latin mt-2 text-[23px] font-medium tracking-[0.34em]" style={{ color: 'var(--ink-2)' }}>
          {SITE.nameLatin}
        </div>
        <p className="ink-2 mt-6 text-[19px] tracking-[0.1em]">{SITE.tagline}</p>
        <div className="ink-3 mt-14 w-full">
          <Toc />
        </div>
        <div className="ink-4 font-mono mt-16 text-[12px] tracking-[0.2em]" style={{ color: 'var(--ink-3)' }}>
          {SITE.edition}
        </div>
        <div className="ink-4">
          <DayNight />
        </div>
      </div>
    </Paper>
  );
}
