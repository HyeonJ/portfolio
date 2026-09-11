import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/book';
import { batangFonts } from '@/lib/og-fonts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = '정현인 — 풀스택 개발자';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#bfe0f5',
          color: '#16283a',
          fontFamily: 'GowunBatang',
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: '0.06em',
        }}
      >
        <div style={{ fontSize: 20, letterSpacing: '0.3em', color: '#3e576f' }}>{`PORTFOLIO · ${SITE.year}`}</div>
        <div style={{ marginTop: 24 }}>정 현 인</div>
        <div style={{ marginTop: 12, fontSize: 30, letterSpacing: '0.08em', color: '#3a5068' }}>{SITE.tagline}</div>
        <div style={{ marginTop: 40, fontSize: 18, letterSpacing: '0.2em', color: '#3e576f' }}>{SITE.edition}</div>
      </div>
    ),
    { ...size, fonts: await batangFonts() },
  );
}
