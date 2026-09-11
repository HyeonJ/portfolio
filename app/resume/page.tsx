import type { Metadata } from 'next';
import { Chapter } from '@/components/chapter';

export const metadata: Metadata = { title: '이력서' };

export default function Resume() {
  return (
    <Chapter path="/resume">
      <div className="chapter-body">
        <p>
          7년차 풀스택 — Java·Spring 백엔드 중심, React 프론트까지. 삼성전자 → HP프린팅코리아
          (사업부 매각에 따른 소속 전환) → 소프트퍼즐. 금융 보안(HSM 키 관리), 커머스 결제 정합,
          폐쇄망 헬스케어, 콜센터 시스템(Zendesk·SAP 연동)을 만들었습니다.
        </p>
        <p>
          <a href="/resume-public.pdf" download className="font-mono text-[14px]" style={{ color: 'var(--ink)' }}>
            이력서 PDF 내려받기 ↓
          </a>
        </p>
        <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>
          공개 버전에는 연락처가 없습니다 — 연락은 이메일로 부탁드립니다 (연락 장 참고).
        </p>
      </div>
    </Chapter>
  );
}
