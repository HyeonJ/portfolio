export type Project = {
  name: string;
  tagline: string;
  stack: string;
  repo: string;
};

export const PROJECTS: readonly Project[] = [
  {
    name: 'chapter-react',
    tagline: '풀스택 학습 monorepo — 디자인 시스템 18컴포넌트, API 클라이언트, SSR 스토어까지 한 사이클',
    stack: 'Spring Boot · React 18 · Next.js 14 · TypeScript · PostgreSQL',
    repo: 'https://github.com/HyeonJ/chapter-react',
  },
  {
    name: 'steadystate',
    tagline: 'LLM 호출을 일부러 깨뜨리고 얼마나 버티는지 측정 — fault injection + 신뢰성 계측',
    stack: 'LLM reliability tooling',
    repo: 'https://github.com/HyeonJ/steadystate',
  },
  {
    name: 'cadence',
    tagline: 'Claude Agent SDK와 Routines로 만든 1인 학습 코칭 도구',
    stack: 'Claude Agent SDK · Next.js PWA · Supabase',
    repo: 'https://github.com/HyeonJ/cadence',
  },
  {
    name: 'vibe-coding-harness',
    tagline: '한국 SI 웹 프로젝트용 5-에이전트 워크플로 자동화 하네스',
    stack: 'Claude Code multi-agent harness',
    repo: 'https://github.com/HyeonJ/vibe-coding-harness',
  },
];
