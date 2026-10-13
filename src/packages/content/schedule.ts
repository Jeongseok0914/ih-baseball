import type { StaticImageData } from 'next/image';
import noryangjinField from '~content/images/noryangjin-field.jpg';

export type Place = {
  name: string;
  address: string;
  // 지도 검색어. 없으면 주소로 찾는다.
  mapQuery?: string;
  // 요일이 정해지지 않은 장소의 안내 문구.
  note?: string;
  access?: string;
  photo?: { src: StaticImageData; alt: string; credit: string; href: string };
};

export const PLACES = {
  noryangjin: {
    name: '노량진 야구장',
    address: '서울 동작구 노들로 688',
    access: '1·9호선 노량진역 9번 출구 바로 앞',
    // 공공누리 제4유형(출처표시, 상업적 이용금지, 변경금지). 이미지 파일을 편집하지 않는다.
    photo: {
      src: noryangjinField,
      alt: '파란 하늘 아래 노량진 야구장 간판과 초록 인조잔디 그라운드',
      credit: '서울시 미디어허브 ⓒ김재형, 공공누리 제4유형',
      href: 'https://mediahub.seoul.go.kr/archives/2002179',
    },
  },
  yeongnam: {
    name: '영남중학교',
    address: '서울 영등포구 대림로31나길 17',
  },
  inheon: {
    name: '인헌초등학교',
    address: '서울 관악구 봉천동, 낙성대역 근처',
    mapQuery: '서울인헌초등학교',
    note: '우리 학교 운동장',
  },
} satisfies Record<string, Place>;

type Day = {
  day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
  kind: 'training' | 'game' | 'rest';
  label: string;
  place?: keyof typeof PLACES;
};

export const WEEK: Day[] = [
  { day: '월', kind: 'training', label: '노량진 야구장', place: 'noryangjin' },
  { day: '화', kind: 'training', label: '노량진 야구장', place: 'noryangjin' },
  { day: '수', kind: 'training', label: '영남중학교', place: 'yeongnam' },
  { day: '목', kind: 'rest', label: '쉬는 날' },
  { day: '금', kind: 'training', label: '노량진 야구장', place: 'noryangjin' },
  { day: '토', kind: 'game', label: '연습경기' },
  { day: '일', kind: 'game', label: '연습경기' },
];

// 장소별 훈련 요일. 예: daysAt('noryangjin') === '월·화·금'
export const daysAt = (place: keyof typeof PLACES) =>
  WEEK.filter(d => d.place === place)
    .map(d => d.day)
    .join('·');
