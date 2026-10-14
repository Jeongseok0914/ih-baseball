import type { StaticImageData } from 'next/image';
import { ROSTER_SEASON } from '~content/players';

// 신입 부원 모집 안내. 홈 맨 위 띠와 첫 화면에 쓴다.
export const RECRUIT = {
  season: ROSTER_SEASON,
  grades: '1~5학년',
  // 띠에 차례로 흐르는 짧은 문구.
  ticker: [
    '야구 처음이어도 괜찮아요',
    '훈련하는 날 언제든 체험',
    '감독님께 바로 연락',
  ],
};

// 첫 화면 사진. 보호자 동의를 받은 사진을 content/images 에 넣고 static import 한다.
// null 이면 사진 자리 표시가 보인다.
export const HERO_PHOTO: { src: StaticImageData; alt: string } | null = null;

// 인스타그램. reels 에는 릴스 주소(instagram.com/reel/여기/)의 코드를 넣는다.
// 비어 있으면 짧은 영상 자리 표시가 보인다.
export const INSTAGRAM = {
  url: 'https://www.instagram.com/inhunyagu',
  // 최근 릴스 3개(고정 게시물 제외). 최신이 앞.
  reels: ['DdTtGQmuaFb', 'DZiAyWbzpF7', 'DZXqCu9TTfw'],
};

// 카카오톡 채널 상담 주소(예: https://pf.kakao.com/_xxxx/chat). 비어 있으면 '준비 중'으로 보인다.
export const KAKAO_CHANNEL = '';

// 학부모님 후기. 비어 있으면 홈의 후기 구역이 숨겨진다.
// sample: true 는 목업용 예시 글이라 카드에 '예시' 표시가 붙는다. 실제 후기로 바꿀 때 지운다.
export const TESTIMONIALS: { quote: string; who: string; sample?: boolean }[] =
  [
    {
      quote:
        '야구를 한 번도 안 해 본 아이였는데, 이제는 주말만 기다려요. 운동장에서 친구들이 생긴 게 제일 좋아요.',
      who: '3학년 학부모',
      sample: true,
    },
    {
      quote:
        '공부랑 같이 할 수 있을지 걱정했는데, 수업 끝나고 훈련하니 생활 리듬이 오히려 잡혔어요.',
      who: '5학년 학부모',
      sample: true,
    },
    {
      quote:
        '감독님이 아이 하나하나 기본기부터 봐 주셔서 믿고 보내요. 경기 영상은 온 가족이 같이 봐요.',
      who: '6학년 학부모',
      sample: true,
    },
  ];
