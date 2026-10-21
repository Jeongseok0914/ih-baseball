import { ALUMNI } from '~content/history';
import { SITE } from '~content/site';
import { Home } from '~features/home/Home';
import { pageMetadata } from '~lib/seo';

export const metadata = {
  ...pageMetadata({
    path: '/',
    description: `${SITE.description} 2025 서울특별시 교육감배 U12 준우승, 프로야구 선수 ${ALUMNI.length}명을 배출한 관악구 초등학교 야구부입니다.`,
  }),
  // 홈은 템플릿 없이 "인헌초등학교 야구부 | 관악구 …" 로 검색 결과에 보이게 한다.
  title: { absolute: `${SITE.fullName} | 관악구 초등학교 야구부 입단 안내` },
};

export default function HomePage() {
  return <Home />;
}
