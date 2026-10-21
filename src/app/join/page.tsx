import { Join } from '~features/join/Join';
import { pageMetadata } from '~lib/seo';

export const metadata = pageMetadata({
  path: '/join',
  title: '초등 야구 입단·체험 안내',
  description:
    '서울 관악구 인헌초 야구부 입단과 체험 안내. 야구를 처음 해도 괜찮아요. 리틀야구와 차이, 훈련 요일과 장소, 비용 등 자주 묻는 질문과 강재훈 감독님 연락처를 확인하세요.',
});

export default function JoinPage() {
  return <Join />;
}
