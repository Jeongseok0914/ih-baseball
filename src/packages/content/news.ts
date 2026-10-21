// 야구부 소식. 대회 일정·결과·공지를 날짜와 함께 적으면 홈이 알아서 바꿔 보여 준다.
// - event: 다가오는 대회. 30일 안이면 홈 맨 위에 "D-5" 띠가 뜬다.
// - result: 경기 결과. 14일 동안 홈 맨 위에 스코어 띠가 뜬다(다가오는 대회가 있으면 대회가 먼저).
// - notice: 공지·새 소식. 홈 "최근 소식"에 최신 3개가 나온다(대회·결과도 함께).
// 날짜는 'YYYY-MM-DD'. 지어낸 결과는 넣지 않는다.
//
// 예)
// { kind: 'event', date: '2026-11-07', title: '서울시장기 초등학교 야구대회', place: '구의야구공원' },
// { kind: 'result', date: '2026-11-08', title: '서울시장기 1회전', opponent: '○○초', us: 7, them: 5, note: '8강 진출!' },
export type News =
  | {
      kind: 'event';
      date: string;
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
    }
  | { kind: 'notice'; date: string; title: string; href?: string };

export const NEWS: News[] = [
  {
    kind: 'notice',
    date: '2026-10-21',
    title: '선수들의 포수 훈련 영상 4개를 올렸어요',
    href: '/schedule',
  },
  {
    kind: 'notice',
    date: '2026-10-15',
    title: '야구 교실이 열렸어요. 규칙을 장면으로 배워요',
    href: '/learn',
  },
];
