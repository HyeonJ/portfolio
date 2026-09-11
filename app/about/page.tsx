import type { Metadata } from 'next';
import { Chapter } from '@/components/chapter';
export const metadata: Metadata = { title: '소개' };

export default function About() {
  return (
    <Chapter path="/about">
      <div className="chapter-body">
        <p>
          Java · Spring 백엔드에서 React 프론트까지, 일곱 해째 웹을 짓고 있는 풀스택 개발자
          정현인입니다. 삼성전자에서 시작해 HP프린팅코리아(프린팅 사업부 매각에 따른 소속 전환)를
          거치며 글로벌 프린팅 서비스의 웹을 만들었고, 지금은 소프트퍼즐에서 금융 보안·커머스·
          헬스케어 도메인의 시스템을 만듭니다.
        </p>
        <p>
          일하는 방식은 한 가지로 요약됩니다 — <strong>규칙을 먼저 읽고, 그 위에 정합성 있게
          쌓는다.</strong> 레거시에 합류하면 코드보다 컨벤션을 먼저 파악하고, 보안 시스템에서는
          &quot;성공처럼 보이는 실패 경로&quot;를 찾아 막고, 혼자 맡은 프로젝트는 인수인계 문서까지가
          산출물이라고 생각합니다.
        </p>
        <h2>지금 다루는 것들</h2>
        <ul>
          <li>백엔드 — Java 25 · Spring Boot 3 · JPA · MyBatis · PostgreSQL · MySQL</li>
          <li>프론트 — React 18 · Next.js · TypeScript · Thymeleaf</li>
          <li>보안·인프라 — AWS CloudHSM(PKCS#11) · S3 · Apache/Tomcat · GitHub Actions</li>
        </ul>
        <p>
          이 사이트 자체도 만든 것 중 하나입니다 — Next.js 15와 View Transitions API로 만든
          &quot;얇은 책&quot;이고, 코드는 GitHub에 공개되어 있습니다.
        </p>
      </div>
    </Chapter>
  );
}
