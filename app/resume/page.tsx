import type { Metadata } from 'next';
import { Chapter } from '@/components/chapter';
export const metadata: Metadata = { title: '이력서' };
export default function Resume() {
  return <Chapter path="/resume" />;
}
