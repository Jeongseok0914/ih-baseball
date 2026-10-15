import type { StaticImageData } from 'next/image';

export type Player = {
  number: number;
  name: string;
  grade: 1 | 2 | 3 | 4 | 5 | 6;
  positions: string[];
  role?: '주장' | '부주장';
  hand?: `${'우' | '좌'}투${'우' | '좌' | '양'}타`;
  comment?: string;
  // 보호자 동의를 받은 사진만 넣는다. 없으면 카드 오른쪽 위 원에 학년별 캐릭터 얼굴이 나온다.
  photo?: StaticImageData;
};

// 현역(재학생) 라인업 기준 시즌. 졸업생은 추후 별도로 분류한다.
export const ROSTER_SEASON = 2026;

// 보호자 동의를 받은 선수만 넣는다. 동의가 철회되면 바로 지운다.
// 학년 안에서는 이 배열 순서(입단 순서)대로 화면에 나온다.
export const PLAYERS: Player[] = [
  {
    number: 33,
    name: '이승하',
    grade: 6,
    positions: ['포수'],
    role: '주장',
    hand: '우투우타',
  },
  {
    number: 22,
    name: '박보영',
    grade: 6,
    positions: ['포수'],
    role: '부주장',
    hand: '우투우타',
  },
  {
    number: 31,
    name: '강병준',
    grade: 6,
    positions: ['내야수'],
    hand: '우투좌타',
  },
  {
    number: 21,
    name: '이준희',
    grade: 6,
    positions: ['외야수'],
    hand: '우투우타',
  },
  {
    number: 6,
    name: '김민호',
    grade: 6,
    positions: ['내야수'],
    hand: '우투우타',
  },
  {
    number: 17,
    name: '오민준',
    grade: 6,
    positions: ['외야수'],
    hand: '우투좌타',
  },
  {
    number: 10,
    name: '이한이',
    grade: 5,
    positions: ['내야수'],
    hand: '우투우타',
  },
  {
    number: 18,
    name: '김현승',
    grade: 5,
    positions: ['포수'],
    hand: '우투우타',
  },
  {
    number: 13,
    name: '장시원',
    grade: 5,
    positions: ['외야수'],
    hand: '우투우타',
  },
  {
    number: 5,
    name: '김태윤',
    grade: 5,
    positions: ['내야수'],
    hand: '우투우타',
  },
  {
    number: 36,
    name: '조유근',
    grade: 5,
    positions: ['내야수'],
    hand: '우투양타',
  },
  {
    number: 3,
    name: '김승연',
    grade: 5,
    positions: ['외야수'],
    hand: '좌투좌타',
  },
  {
    number: 28,
    name: '윤차윤',
    grade: 5,
    positions: ['내야수'],
    hand: '우투좌타',
  },
  {
    number: 16,
    name: '정재원',
    grade: 5,
    positions: ['포수'],
    hand: '우투우타',
  },
  {
    number: 8,
    name: '안드레스',
    grade: 4,
    positions: ['외야수'],
    hand: '우투우타',
  },
  {
    number: 9,
    name: '연지성',
    grade: 4,
    positions: ['외야수'],
    hand: '우투우타',
  },
  {
    number: 23,
    name: '변주하',
    grade: 4,
    positions: ['내야수'],
    hand: '우투우타',
  },
  {
    number: 1,
    name: '김예승',
    grade: 2,
    positions: ['외야수'],
    hand: '우투양타',
  },
  {
    number: 7,
    name: '김소헌',
    grade: 2,
    positions: ['외야수'],
    hand: '좌투좌타',
  },
];
