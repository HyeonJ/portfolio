import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

// 플러그인 없음(의도) — 본문은 표준 md + JSX만 사용, GFM 표가 필요해지면 remark-gfm 추가
const withMDX = createMDX({});

export default withMDX(nextConfig);
