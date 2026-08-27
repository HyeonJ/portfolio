import type { Metadata } from 'next';
import { Chapter } from '@/components/chapter';
export const metadata: Metadata = { title: '소개' };
export default function About() {
  return <Chapter path="/about" />;
}
