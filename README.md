# portfolio

정현인 — 풀스택 개발자 포트폴리오. 하늘색 종이 위의 얇은 책: 표지 → 차례 → 본문 장, 모든 이동은 책장 넘김.

## 구성
- 표지 `/` → 차례 `/contents` → 소개·케이스 스터디 3편·프로젝트·이력서·연락 (9장)
- 넘김: 차례 링크, ←/→ 키, 데스크톱 좌우 가장자리 클릭. View Transitions API + CSS 3D (600ms), `prefers-reduced-motion`이면 페이드
- 낮/밤: 우측 해·달 버튼 또는 `N` 키, localStorage에 저장

## 스택
Next.js 15 · React 19 · TypeScript · Tailwind v4 · MDX(@next/mdx, 케이스 스터디 본문) · next/font(고운바탕·Cormorant Garamond·IBM Plex Mono) · next/og(고운바탕 임베드) · Vercel Analytics

## 개발
- `npm run dev` → http://localhost:3000
- `npm run lint` · `npx tsc --noEmit` · `npm test`(Vitest) · `npm run e2e`(Playwright + axe; `npm run dev`를 끄고 실행)
- CI: GitHub Actions에서 lint → tsc → 단위 → E2E

## 알려진 이슈
- Lighthouse(모바일) 성능이 90에 못 미치면 한글 서체를 사용-글리프 서브셋 woff2(`next/font/local`)로 전환 검토. 이력: 고운바탕 preload가 한글 조각 94개(~1.6MB)를 전부 프리로드해 프로덕션 LCP 10초대 → `preload: false`로 해소(2026-09-11).

## 배포
Vercel (`main` 자동 배포). 프로덕션: https://portfolio-lime-nine-91.vercel.app
