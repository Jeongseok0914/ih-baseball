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

// 학부모님 후기. 실제로 받은 글만 넣는다. 비어 있으면 홈의 후기 구역이 숨겨진다.
export const TESTIMONIALS: { quote: string; who: string }[] = [];
