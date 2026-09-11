import type { Metadata } from 'next';
import { Chapter } from '@/components/chapter';
import { PROJECTS } from '@/content/projects';
import { SITE } from '@/lib/book';

export const metadata: Metadata = { title: '프로젝트' };

export default function Projects() {
  return (
    <Chapter path="/projects">
      <div className="chapter-body">
        <p>
          업무 밖에서 만든 것들입니다. 회사 프로젝트의 코드는 공개할 수 없어서,
          제 코드를 보여주는 통로는 이쪽입니다.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          {PROJECTS.map((p) => (
            <a
              key={p.name}
              href={p.repo}
              target="_blank"
              rel="noopener"
              className="project-card flex flex-col gap-2 border p-5 transition-colors"
              style={{ textDecoration: 'none' }}
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[15px] font-medium" style={{ color: 'var(--ink)' }}>
                  {p.name}
                </span>
                <span className="font-mono text-[11px]" style={{ color: 'var(--ink-3)' }}>
                  {p.stack}
                </span>
              </span>
              <span className="text-[14px] leading-[1.7]" style={{ color: 'var(--ink-2)' }}>
                {p.tagline}
              </span>
            </a>
          ))}
        </div>
        <p className="mt-8">
          더 많은 실험은{' '}
          <a href={SITE.github} rel="me noopener" target="_blank">
            GitHub 프로필
          </a>
          에 있습니다.
        </p>
      </div>
    </Chapter>
  );
}
