import { PAGE_ORDER } from '@/lib/book';

export type TurnDirection = 'next' | 'prev';

export function isBookRoute(href: string): boolean {
  return href.startsWith('/') && PAGE_ORDER.includes(href);
}

export function directionFor(from: string, to: string): TurnDirection {
  const a = PAGE_ORDER.indexOf(from);
  const b = PAGE_ORDER.indexOf(to);
  if (a < 0 || b < 0) return 'next';
  return b >= a ? 'next' : 'prev';
}

type TargetLike = { tagName?: string; isContentEditable?: boolean } | null;

export function isTypingTarget(target: EventTarget | TargetLike): boolean {
  const el = target as TargetLike;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true;
}
