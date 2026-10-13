import { ROSTER_SEASON } from '~content/players';
import { Team } from '~features/team/Team';
import { pageMetadata } from '~lib/seo';

export const metadata = pageMetadata({
  path: '/team',
  title: `선수단 ${ROSTER_SEASON} 라인업`,
  description: `인헌초 야구부 ${ROSTER_SEASON} 현역 선수단. 학년별 선수 등번호와 포지션, 강재훈 감독님과 강동우 코치님을 소개합니다.`,
});

export default function TeamPage() {
  return <Team />;
}
