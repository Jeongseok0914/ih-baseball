import { Schedule } from '~features/schedule/Schedule';
import { pageMetadata } from '~lib/seo';

export const metadata = pageMetadata({
  path: '/schedule',
  title: '훈련 영상과 일정',
  description:
    '인헌초 야구부 선수들의 포지션별 훈련 영상과 한 주 훈련 일정. 월·화·금 노량진 야구장, 수요일 영남중학교에서 훈련하고 토·일요일에는 연습경기를 합니다.',
});

export default function SchedulePage() {
  return <Schedule />;
}
