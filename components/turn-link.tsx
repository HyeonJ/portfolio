'use client';

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { PAGE_ORDER } from '@/lib/book';
import { useTurn, type TurnDirection } from '@/components/page-turn';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

function directionFor(from: string, to: string): TurnDirection {
  const a = PAGE_ORDER.indexOf(from);
  const b = PAGE_ORDER.indexOf(to);
  if (a < 0 || b < 0) return 'next';
  return b >= a ? 'next' : 'prev';
}

export function TurnLink({ href, children, onClick, ...rest }: Props) {
  const turn = useTurn();
  const pathname = usePathname();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    turn(href, directionFor(pathname, href));
  };
  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
