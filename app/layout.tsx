import type { Metadata } from 'next';
import { Gowun_Batang, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { PageTurnProvider } from '@/components/page-turn';

// subsets: ['latin'] — next/font는 Gowun Batang에 'korean' 서브셋을 노출하지 않지만, 빌드 결과 @font-face unicode-range에 한글(U+AC00–D7A3)이 포함됨 (검증 2026-08-27). 좁히지 말 것.
// preload: false — preload를 켜면 한글 조각 94개(~1.6MB)가 전부 <link rel=preload>로 방출돼 프로덕션 LCP가 10초대로 밀림(2026-09-11 실측). unicode-range 온디맨드(~15요청)가 훨씬 빠르다.
const batang = Gowun_Batang({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-batang', display: 'swap', preload: false });
const latin = Cormorant_Garamond({ weight: ['500'], subsets: ['latin'], variable: '--font-latin', display: 'swap', preload: false });
const mono = IBM_Plex_Mono({ weight: ['400'], subsets: ['latin'], variable: '--font-mono', display: 'swap', preload: false });

export const metadata: Metadata = {
  title: { default: '정현인 — 풀스택 개발자', template: '%s — 정현인' },
  description: 'Java · Spring 백엔드에서 React 프론트까지 7년. 금융 보안 키 관리, 커머스 결제 정합, 폐쇄망 헬스케어 시스템.',
};

// lib/theme.ts의 resolveInitialTheme와 같은 규칙을 페인트 전에 실행하기 위한 인라인 복제본. 한쪽을 바꾸면 다른 쪽도 같이 바꿀 것 (THEME_KEY = 'theme').
const THEME_INIT = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'night':'day'}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${batang.variable} ${latin.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <PageTurnProvider>{children}</PageTurnProvider>
        <Analytics />
      </body>
    </html>
  );
}
