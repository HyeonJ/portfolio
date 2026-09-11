import type { Metadata } from 'next';
import { Chapter } from '@/components/chapter';
import { SITE } from '@/lib/book';
export const metadata: Metadata = { title: '연락' };
export default function Contact() {
  return (
    <Chapter path="/contact">
      <div className="chapter-body">
        <p>
          제안, 질문, 같이 만들고 싶은 것 — 무엇이든 이메일이 가장 빠릅니다.
        </p>
        <p>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <br />
          <a href={SITE.github} rel="me noopener" target="_blank">
            {SITE.github.replace('https://', '')}
          </a>
        </p>
      </div>
    </Chapter>
  );
}
