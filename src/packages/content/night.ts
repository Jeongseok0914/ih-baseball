import emblem from '~content/images/emblem.jpg';
import shareImage from '~content/images/inheon-night-og.jpg';
import coverPoster from '~content/images/inheon-night-video.jpg';

const venue = {
  name: '사당 파티룸 우디',
  address: '서울 서초구 방배천로4안길 20',
  coordinates: '37.479009,126.983379',
};
const kakaoPlace = (name: string, coordinates: string) =>
  `${encodeURIComponent(name)},${coordinates}`;

function mapLinks(name: string, address: string, coordinates: string) {
  const [latitude, longitude] = coordinates.split(',');

  return [
    {
      label: '카카오맵',
      href: `https://map.kakao.com/link/map/${kakaoPlace(name, coordinates)}`,
    },
    {
      label: '티맵',
      href: `tmap://viewmap?name=${encodeURIComponent(name)}&x=${longitude}&y=${latitude}`,
    },
    {
      label: '네이버지도',
      href: `https://map.naver.com/p/search/${encodeURIComponent(address)}`,
    },
  ];
}

export const NIGHT = {
  path: '/night/',
  team: '인헌초등학교 야구부',
  title: '인헌의 밤',
  shareTitle: '인헌의 밤에 초대합니다',
  description: '인헌초 야구부 졸업생과 현역 선수들이 함께하는 송년 모임',
  message: '선배와 현역 선수가 함께하는 송년 모임에 초대합니다.',
  dateTime: '2026-12-19T18:00:00+09:00',
  date: '2026년 12월 19일 토요일',
  time: '저녁 6시',
  venue: {
    ...venue,
    maps: mapLinks(venue.name, venue.address, venue.coordinates),
  },
  station: {
    name: '사당역 11번 출구',
    road: '방배천로',
    sideStreet: '방배천로4안길',
  },
  parking: {
    note: '차량으로 오시는 분은 인근 유료 공영주차장을 이용해 주세요.',
    lots: [
      {
        id: 'A',
        name: '방배복개도로 제1지역 공영주차장',
        mapLabel: '방배복개도로 제1지역',
        address: '서초구 방배동 493-3',
        coordinates: '37.47800851,126.9826064',
        hours: '토요일 10:00–23:00',
        rate: '5분당 250원',
      },
      {
        id: 'B',
        name: '사당노외 공영주차장',
        mapLabel: '사당노외 공영주차장',
        address: '서초구 과천대로 950-18',
        coordinates: '37.475404,126.9815541',
        hours: '24시간',
        rate: '5분당 400원',
      },
    ].map(lot => ({
      ...lot,
      maps: mapLinks(lot.name, lot.address, lot.coordinates),
    })),
  },
  president: { title: '회장', phone: '01071720914' },
  cover: {
    src: `${process.env.PAGES_BASE_PATH ?? ''}/videos/inheon-night.mp4`,
    poster: coverPoster,
    label: '인헌초 야구부 선수들이 함께하는 단체 영상',
  },
  emblem,
  shareImage,
};
