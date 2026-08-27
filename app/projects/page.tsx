import type { Metadata } from 'next';
import { Chapter } from '@/components/chapter';
export const metadata: Metadata = { title: '프로젝트' };
export default function Projects() {
  return <Chapter path="/projects" />;
}
