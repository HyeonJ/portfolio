import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Chapter } from '@/components/chapter';
import { CHAPTERS } from '@/lib/book';

const WORK = CHAPTERS.find((c) => c.no === '02')!.children!;

export function generateStaticParams() {
  return WORK.map((c) => ({ slug: c.href.replace('/work/', '') }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ch = WORK.find((c) => c.href === `/work/${slug}`);
  return { title: ch?.label ?? '작업' };
}

export default async function Work({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = `/work/${slug}`;
  if (!WORK.some((c) => c.href === path)) notFound();
  return <Chapter path={path} />;
}
