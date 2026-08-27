'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { directionFor, isBookRoute } from '@/lib/nav';
import { useTurn } from '@/components/page-turn';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string; children: ReactNode };

export function TurnLink({ href, children, onClick, ...rest }: Props) {
  const turn = useTurn();
  const pathname = usePathname();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (!isBookRoute(href)) return;
    e.preventDefault();
    turn(href, directionFor(pathname, href));
  };
  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
