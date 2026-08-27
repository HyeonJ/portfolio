import { CHAPTERS, type Chapter } from '@/lib/book';
import { TurnLink } from '@/components/turn-link';

function Row({ c, sub }: { c: Chapter; sub?: boolean }) {
  return (
    <TurnLink
      href={c.href}
      className={`toc-row ${sub ? 'sub pl-7 text-[15px]' : 'text-[17px]'}`}
      style={sub ? { color: 'var(--ink-2)' } : undefined}
    >
      <span>{c.label}</span>
      <span className="lead" aria-hidden="true" />
      <span className="num font-mono" aria-hidden="true" style={{ fontSize: sub ? 12 : 13 }}>
        {c.no}
      </span>
    </TurnLink>
  );
}

export function Toc({ expanded = false }: { expanded?: boolean }) {
  return (
    <nav aria-label="차례" className="flex w-full flex-col gap-3">
      {CHAPTERS.map((c) => (
        <div key={c.no} className="flex flex-col gap-3">
          <Row c={c} />
          {expanded && c.children?.map((s) => <Row key={s.no} c={s} sub />)}
        </div>
      ))}
    </nav>
  );
}
