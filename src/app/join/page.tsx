import { Join } from '~features/join/Join';
import { pageMetadata } from '~lib/seo';

export const metadata = pageMetadata({
  path: '/join',
  title: '입단·체험 안내',
  description:
    '인헌초 야구부 입단과 체험 안내. 야구를 처음 해도 괜찮아요. 강재훈 감독님께 연락하고 훈련하는 날 와서 직접 해 보세요.',
});

export default function JoinPage() {
  return <Join />;
}
