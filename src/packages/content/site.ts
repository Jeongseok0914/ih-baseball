// DB가 없으므로 사이트 콘텐츠는 이 폴더의 타입 있는 데이터 파일이 원본이다.
export const SITE = {
  name: '인헌초 야구부',
  fullName: '서울 인헌초등학교 야구부',
  description:
    '1980년 창단한 서울 관악구 인헌초등학교 야구부. 야구를 처음 시작하는 친구도 함께합니다.',
};

export const COACH = {
  name: '강제훈',
  title: '감독',
  // 숫자만 적는다. 비어 있으면 화면에 "번호 준비 중"으로 표시된다.
  phone: '',
};

export const NAV = [
  { href: '/', label: '홈' },
  { href: '/story', label: '야구부 이야기' },
  { href: '/join', label: '함께하기' },
];
