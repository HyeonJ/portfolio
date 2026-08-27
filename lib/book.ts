export type Chapter = {
  no: string;
  label: string;
  href: string;
  children?: Chapter[];
};

export const SITE = {
  name: '정현인',
  nameLatin: 'HYEONIN JEONG',
  tagline: '웹을 짓는 풀스택 개발자',
  intro:
    'Java · Spring 백엔드에서 React 프론트까지 일곱 해. 금융 보안의 키 관리, 커머스의 결제 정합, 폐쇄망의 헬스케어 시스템 — 규칙을 먼저 읽고 그 위에 정합성 있게 쌓아 왔습니다.',
  email: 'bpx2710@gmail.com',
  github: 'https://github.com/HyeonJ',
  edition: 'v. I',
  year: 2026,
} as const;

export const CHAPTERS: readonly Chapter[] = [
  { no: '01', label: '소개', href: '/about' },
  {
    no: '02',
    label: '작업',
    href: '/contents',
    children: [
      { no: '02.1', label: 'HSM 키 관리 시스템 — 백업·복원 무결성 설계', href: '/work/hsm-key-integrity' },
      { no: '02.2', label: '선물하기 정산 — 환불·이력이 얽힌 금액 불일치 추적', href: '/work/gift-payment-reconciliation' },
      { no: '02.3', label: '폐쇄망 QR 가입 시스템 — 설계부터 인수인계까지 단독', href: '/work/closed-network-qr' },
    ],
  },
  { no: '03', label: '프로젝트', href: '/projects' },
  { no: '04', label: '이력서', href: '/resume' },
  { no: '05', label: '연락', href: '/contact' },
];

export function flatToc(): readonly Chapter[] {
  return CHAPTERS.flatMap((c) => [c, ...(c.children ?? [])]);
}

export const PAGE_ORDER: readonly string[] = [
  '/',
  '/contents',
  ...flatToc()
    .map((c) => c.href)
    .filter((href) => href !== '/contents'),
];

export function nextPage(path: string): string | null {
  const i = PAGE_ORDER.indexOf(path);
  if (i < 0 || i === PAGE_ORDER.length - 1) return null;
  return PAGE_ORDER[i + 1];
}

export function prevPage(path: string): string | null {
  const i = PAGE_ORDER.indexOf(path);
  if (i <= 0) return null;
  return PAGE_ORDER[i - 1];
}

export function chapterFor(path: string): Chapter | undefined {
  return flatToc().find((c) => c.href === path);
}
