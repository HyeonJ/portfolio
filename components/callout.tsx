import type { ReactNode } from 'react';

export function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside
      className="my-6 border-l-2 py-1 pl-5 text-[15px] leading-[1.85]"
      style={{ borderColor: 'var(--mark)', color: 'var(--ink-2)' }}
    >
      <span className="font-mono mr-2 text-[12px] tracking-[0.12em]" style={{ color: 'var(--mark)' }}>
        {label}
      </span>
      {children}
    </aside>
  );
}
