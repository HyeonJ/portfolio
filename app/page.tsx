import { Paper } from '@/components/paper';
import { Toc } from '@/components/toc';
import { Masthead } from '@/components/masthead';
import { SITE } from '@/lib/book';

export default function Cover() {
  return (
    <Paper>
      <div className="mx-auto flex min-h-dvh w-[460px] max-w-[90vw] flex-col items-center justify-center text-center">
        <Masthead size="cover" />
        <div className="ink-3 mt-14 w-full">
          <Toc />
        </div>
        <div className="ink-4 font-mono mt-16 text-[12px] tracking-[0.2em]" style={{ color: 'var(--ink-3)' }}>
          {SITE.edition}
        </div>
      </div>
    </Paper>
  );
}
