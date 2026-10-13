// DB가 없으므로 사이트 콘텐츠는 이 폴더의 타입 있는 데이터 파일이 원본이다.
export const SITE = {
  name: '인헌초 야구부',
  fullName: '서울 인헌초등학교 야구부',
  description:
    '1980년 창단한 서울 관악구 인헌초등학교 야구부. 야구를 처음 시작하는 친구도 함께합니다.',
  // 학부모가 실제로 검색할 만한 말. 제목·설명·본문에 자연스럽게 들어가 있어야 효과가 있다.
  keywords: [
    '인헌초 야구부',
    '인헌초등학교 야구부',
    '서울인헌초 야구부',
    '관악구 초등학교 야구부',
    '관악구 야구부',
    '서울 초등학교 야구부',
    '초등학생 야구',
    '초등 야구부 입단',
    '노량진 야구장',
    '강재훈 감독',
  ],
};

export const COACH = {
  name: '강재훈',
  title: '감독',
  number: 71,
  // 숫자만 적는다. 비어 있으면 화면에 "번호 준비 중"으로 표시된다.
  phone: '01040133722',
};

// 선수단 페이지 지도자 카드. 감독님 연락처는 COACH 하나만 쓴다.
export const STAFF = [
  { number: COACH.number, name: COACH.name, title: COACH.title },
  { number: 74, name: '강동우', title: '코치' },
];

export const NAV = [
  { href: '/', label: '홈' },
  { href: '/team', label: '선수단' },
  { href: '/schedule', label: '훈련 일정' },
  { href: '/join', label: '함께하기' },
];

// 검색 등록 확인 코드. Google Search Console, 네이버 서치어드바이저에서 받은 값을 넣으면
// <meta> 태그로 들어간다. 비어 있으면 넣지 않는다.
export const SEARCH_VERIFICATION = {
  google: '',
  naver: '',
};
