// 인헌초 일정. 대회 일정과 경기 결과를 날짜와 함께 적으면 홈이 알아서 바꿔 보여 준다.
// - event: 다가오는 대회. 30일 안이면 홈 맨 위에 "D-5" 띠가 뜬다.
// - result: 경기 결과. 14일 동안 홈 맨 위에 스코어 띠가 뜬다(다가오는 대회가 있으면 대회가 먼저).
// 날짜는 'YYYY-MM-DD'. 지어낸 결과는 넣지 않는다.
//
// 예)
// { kind: 'event', date: '2026-11-07', title: '서울시장기 초등학교 야구대회', place: '구의야구공원' },
// { kind: 'result', date: '2026-11-08', title: '서울시장기 1회전', opponent: '○○초', us: 7, them: 5, note: '8강 진출!' },
export type News =
  | {
      kind: 'event';
      // 시작일. 여러 날이면 end 에 마지막 날을 적는다.
      date: string;
      end?: string;
      // 날짜가 아직 안 정해졌으면 date 는 그 달 1일로 두고 여기에 "11월 중"처럼 적는다. D-day 는 세지 않는다.
      tentative?: string;
      title: string;
      place?: string;
      href?: string;
    }
  | {
      kind: 'result';
      date: string;
      title: string;
      opponent: string;
      us: number;
      them: number;
      note?: string;
      href?: string;
    };

export const NEWS: News[] = [
  // 홍천무궁화배 결과: 팀 유튜브 중계 점수판 기준, 학년 구분은 팀 확인(2026-11-20).
  {
    kind: 'result',
    date: '2026-11-13',
    title: '홍천무궁화배 6학년',
    opponent: '백운초',
    us: 5,
    them: 7,
  },
  {
    kind: 'result',
    date: '2026-11-13',
    title: '홍천무궁화배 5학년',
    opponent: 'VIP',
    us: 6,
    them: 5,
  },
  {
    kind: 'result',
    date: '2026-11-14',
    title: '홍천무궁화배 6학년',
    opponent: '도곡초',
    us: 5,
    them: 21,
  },
  {
    kind: 'result',
    date: '2026-11-14',
    title: '홍천무궁화배 5학년',
    opponent: '화곡초',
    us: 2,
    them: 12,
  },
  {
    kind: 'result',
    date: '2026-11-15',
    title: '홍천무궁화배 6학년',
    opponent: '갈산초',
    us: 2,
    them: 12,
  },
  {
    kind: 'result',
    date: '2026-11-15',
    title: '홍천무궁화배 5학년',
    opponent: '백운초',
    us: 7,
    them: 5,
  },
  {
    kind: 'event',
    date: '2026-11-12',
    end: '2026-11-15',
    title: '홍천무궁화배 유소년클럽최강자전 야구대회',
    place: '강원 홍천',
    href: '/schedule',
  },
];
