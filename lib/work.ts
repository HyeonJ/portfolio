import type { ComponentType } from 'react';

// 정적 import 맵 — 번들러가 각 MDX를 코드 스플릿한다. 슬러그 추가 시 여기와 content/work/에 함께 추가.
const WORK_CONTENT: Record<string, () => Promise<{ default: ComponentType }>> = {
  'hsm-key-integrity': () => import('@/content/work/hsm-key-integrity.mdx'),
  'gift-payment-reconciliation': () => import('@/content/work/gift-payment-reconciliation.mdx'),
  'closed-network-qr': () => import('@/content/work/closed-network-qr.mdx'),
};

export const WORK_SLUGS: readonly string[] = Object.keys(WORK_CONTENT);

export function hasWorkContent(slug: string): boolean {
  return Object.hasOwn(WORK_CONTENT, slug);
}

export async function loadWorkContent(slug: string): Promise<{ default: ComponentType }> {
  const loader = Object.hasOwn(WORK_CONTENT, slug) ? WORK_CONTENT[slug] : undefined;
  if (!loader) throw new Error(`unknown work slug: ${slug}`);
  return loader();
}
