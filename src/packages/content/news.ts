// 인헌초 일정. 대회 일정과 경기 결과를 날짜와 함께 적으면 홈이 알아서 바꿔 보여 준다.
// - event: 다가오는 대회. 30일 안이면 홈 맨 위에 "D-5" 띠가 뜬다.
// - result: 쓰지 않는다. 경기 결과와 하이라이트는 '경기' 메뉴(~content/training-videos 의 HIGHLIGHTS)에 적는다(2026-11-20 팀 결정).
// 날짜는 'YYYY-MM-DD'. 지어낸 결과는 넣지 않는다.
//
// 예)
// { kind: 'event', date: '2026-11-07', title: '서울시장기 초등학교 야구대회', place: '구의야구공원' },
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
  {
    kind: 'event',
    date: '2026-11-12',
    end: '2026-11-15',
    title: '홍천무궁화배 유소년클럽최강자전 야구대회',
    place: '강원 홍천',
    href: '/games',
  },
];
