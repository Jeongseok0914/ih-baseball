export type HistoryEntry = { year: string; text: string };

// 출처: 일요시사 2016-07-04(no=105230), 2017-06-12(no=129583),
// 대한야구소프트볼협회 팀 정보(club_idx=290). 확인된 사실만 넣는다.
export const HISTORY: HistoryEntry[] = [
  { year: '1980', text: '서울 인헌초등학교 야구부 창단' },
  {
    year: '2014',
    text: '선수 8명으로 시합에 나서기 어려웠던 시기. 새 감독 부임 후 선수 모집과 훈련에 힘을 모음',
  },
  { year: '2015', text: '선수단 22명으로 늘어남' },
  {
    year: '2017',
    text: 'LG 트윈스기 서울 초등학교 야구대회 3위. 8년 만의 대회 입상',
  },
  {
    year: '2022',
    text: 'U-12 전국유소년야구대회, 회장기 전국초등학교야구대회 출전',
  },
];

// 출처: 위키백과 "분류:서울인헌초등학교 동문", 일요시사 2017-06-12.
export const ALUMNI = [
  '손지환',
  '현재윤',
  '김진성',
  '이충호',
  '정용운',
  '정진호',
  '최동환',
  '최원태',
];

export const MIDDLE_SCHOOLS = [
  '이수중',
  '영남중',
  '강남중',
  '영동중',
  '성남중',
  '선린중',
];

export const SOURCES = [
  {
    label: '일요시사 「명문 초등학교 야구부 탐방」 (2016)',
    href: 'https://m.ilyosisa.co.kr/news/article.html?no=105230',
  },
  {
    label: '일요시사 「명문 야구부 탐방: 서울 인헌초」 (2017)',
    href: 'https://www.ilyosisa.co.kr/news/article.html?no=129583',
  },
  {
    label: '대한야구소프트볼협회 팀 정보',
    href: 'https://www.korea-baseball.com/info/team/team_schedule?club_idx=290&season=2022&kind_cd=11&sports_club=F',
  },
];
