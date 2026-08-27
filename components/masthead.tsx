import { SITE } from '@/lib/book';

type Size = 'cover' | 'contents';

const H1: Record<Size, string> = {
  cover: 'mt-7 text-[clamp(56px,22vw,84px)] tracking-[0.06em]',
  contents: 'mt-6 text-[clamp(52px,20vw,76px)] tracking-[0.04em]',
};
const LATIN: Record<Size, string> = {
  cover: 'mt-2 text-[23px] tracking-[0.34em]',
  contents: 'mt-1 text-[22px] tracking-[0.32em]',
};
const TAGLINE: Record<Size, string> = {
  cover: 'mt-6 text-[19px] tracking-[0.1em]',
  contents: 'mt-5 text-[18px] tracking-[0.08em]',
};

export function Masthead({ size }: { size: Size }) {
  return (
    <>
      <div className="ink-1 font-mono text-[11px] tracking-[0.3em]" style={{ color: 'var(--ink-3)' }}>
        PORTFOLIO · {SITE.year}
      </div>
      <h1 className={`ink-1 whitespace-nowrap font-bold leading-[1.05] ${H1[size]}`}>정 현 인</h1>
      <div className={`ink-1 font-latin font-medium ${LATIN[size]}`} style={{ color: 'var(--ink-2)' }}>
        {SITE.nameLatin}
      </div>
      <p className={`ink-2 ${TAGLINE[size]}`}>{SITE.tagline}</p>
    </>
  );
}
