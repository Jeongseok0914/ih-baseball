// 팀 유튜브 채널.
export const YOUTUBE_CHANNEL = {
  id: 'UCtEZNe_VK-qhczE1Qu4aCgg',
  name: '인헌초 야구부',
  url: 'https://www.youtube.com/@%EC%9D%B8%ED%97%8C%EC%B4%88%EC%95%BC%EA%B5%AC%EB%B6%80-p7k',
};

// 홈 '경기 영상'에 보여 줄 영상. 바꾸려면 이 목록의 id(watch?v= 뒤)와 제목을 고친다.
// group 이 같은 영상끼리 제목 아래 한 줄로 묶어 보여 준다(그룹 순서는 처음 나온 순서). 없으면 묶지 않는다.
// 최신 경기가 앞.
// score: 경기 결과(인헌 점수 us, 상대 점수 them). 있으면 카드에 승·패 띠와 점수가 붙는다.
export const VIDEOS: {
  id: string;
  title: string;
  group?: string;
  score?: { us: number; them: number };
}[] = [
  {
    id: 'BZG8IF6Vkl0',
    title: '11/15 갈산초전',
    score: { us: 2, them: 12 },
    group: '홍천무궁화배 6학년',
  },
  {
    id: 'GXfi_waTdOg',
    title: '11/15 백운초전',
    score: { us: 7, them: 5 },
    group: '홍천무궁화배 5학년',
  },
  {
    id: 'slW0WvZjrAU',
    title: '11/14 화곡초전',
    score: { us: 2, them: 12 },
    group: '홍천무궁화배 5학년',
  },
  {
    id: 'SUg4q_rN9V4',
    title: '11/14 도곡초전',
    score: { us: 5, them: 21 },
    group: '홍천무궁화배 6학년',
  },
  {
    id: 'wAvy1NyUHmI',
    title: '11/13 VIP전',
    score: { us: 6, them: 5 },
    group: '홍천무궁화배 5학년',
  },
  {
    id: 'MJ8hn1Q_2n4',
    title: '11/13 백운초전',
    score: { us: 5, them: 7 },
    group: '홍천무궁화배 6학년',
  },
];
