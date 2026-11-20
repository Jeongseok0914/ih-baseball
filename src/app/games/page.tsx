import { Games } from '~features/games/Games';
import { pageMetadata } from '~lib/seo';

export const metadata = pageMetadata({
  path: '/games',
  title: '경기 결과와 하이라이트',
  description:
    '인헌초 야구부의 대회 경기 결과와 경기별 득점 하이라이트 영상. 2026 홍천무궁화배 유소년클럽최강자전 6학년·5학년 경기.',
});

export default function GamesPage() {
  return <Games />;
}
