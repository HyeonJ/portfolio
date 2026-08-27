import type { Metadata } from 'next';
import { Chapter } from '@/components/chapter';
import { SITE } from '@/lib/book';
export const metadata: Metadata = { title: '연락' };
export default function Contact() {
  return (
    <Chapter path="/contact">
      <p>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <br />
        <a href={SITE.github} rel="me noopener" target="_blank">
          {SITE.github.replace('https://', '')}
        </a>
      </p>
    </Chapter>
  );
}
