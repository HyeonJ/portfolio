import { ImageResponse } from 'next/og';
import { WORK_CHAPTERS } from '@/lib/book';
import { batangFonts } from '@/lib/og-fonts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = '케이스 스터디';

export function generateStaticParams() {
  return WORK_CHAPTERS.map((c) => ({ slug: c.href.replace('/work/', '') }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ch = WORK_CHAPTERS.find((c) => c.href === `/work/${slug}`);
  const [title, subtitle] = (ch?.label ?? '작업').split(' — ');
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 90px',
          background: '#bfe0f5',
          color: '#16283a',
          fontFamily: 'GowunBatang',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: '0.2em', color: '#3e576f' }}>{`${ch?.no ?? ''} · 정현인 — 케이스 스터디`}</div>
        <div style={{ marginTop: 28, fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
        {subtitle ? <div style={{ marginTop: 16, fontSize: 34, color: '#3a5068' }}>{subtitle}</div> : null}
      </div>
    ),
    { ...size, fonts: await batangFonts() },
  );
}
