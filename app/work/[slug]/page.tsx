import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Chapter } from '@/components/chapter';
import { WORK_CHAPTERS } from '@/lib/book';

export const dynamicParams = false;

export function generateStaticParams() {
  return WORK_CHAPTERS.map((c) => ({ slug: c.href.replace('/work/', '') }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ch = WORK_CHAPTERS.find((c) => c.href === `/work/${slug}`);
  return { title: ch?.label ?? '작업' };
}

export default async function Work({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = `/work/${slug}`;
  if (!WORK_CHAPTERS.some((c) => c.href === path)) notFound();
  return <Chapter path={path} />;
}
