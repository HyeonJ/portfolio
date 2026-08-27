import type { Metadata } from 'next';
import { Gowun_Batang, Cormorant_Garamond, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { PageTurnProvider } from '@/components/page-turn';

// subsets: ['latin'] — next/font는 Gowun Batang에 'korean' 서브셋을 노출하지 않지만, 빌드 결과 @font-face unicode-range에 한글(U+AC00–D7A3)이 포함됨 (검증 2026-08-27). 좁히지 말 것.
const batang = Gowun_Batang({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-batang', display: 'swap' });
const latin = Cormorant_Garamond({ weight: ['500', '600'], subsets: ['latin'], variable: '--font-latin', display: 'swap' });
const mono = IBM_Plex_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: { default: '정현인 — 풀스택 개발자', template: '%s — 정현인' },
  description: 'Java · Spring 백엔드에서 React 프론트까지 7년. 금융 보안 키 관리, 커머스 결제 정합, 폐쇄망 헬스케어 시스템.',
};

const THEME_INIT = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'night':'day'}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${batang.variable} ${latin.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <PageTurnProvider>{children}</PageTurnProvider>
      </body>
    </html>
  );
}
