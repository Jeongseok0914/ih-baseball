import type { StaticImageData } from 'next/image';
import catcher16 from '~content/images/training/catcher-16.jpg';
import catcher18 from '~content/images/training/catcher-18.jpg';
import catcher22 from '~content/images/training/catcher-22.jpg';
import catcher33 from '~content/images/training/catcher-33.jpg';
import { PLAYERS } from '~content/players';

// 선수 훈련 영상. 보호자가 영상 공개에 동의한 선수만 넣는다.
// 화면에는 높은 학년부터 나오고, 같은 학년 안에서는 이 배열 순서대로 나온다.
// 한 선수에 영상이 여러 개면 선수단 카드에서 시트 안 목록으로 바꿔 본다.
// - 사이트에 직접 올린 영상: public/videos/training 에 720p(H.264)로 줄여 넣고 src 로 가리킨다.
// - 영상이 많아져 저장소가 부담되면 유튜브에 올리고 youtube 에 영상 ID 만 적는다. 화면은 그대로다.
// 포스터(첫 화면 사진)는 누르기 전까지 영상 대신 보여 주는 가벼운 사진이다.
// category: 훈련 종류(포수·타격·투구 등). 훈련 페이지에서 종류별로 골라 볼 때 쓴다.
export type TrainingVideo = {
  player: number;
  category: string;
  title: string;
  poster: StaticImageData;
} & ({ src: string } | { youtube: string });

// public 파일은 basePath 가 자동으로 붙지 않아 직접 붙인다. 서버 컴포넌트에서 읽어 넘겨야 값이 들어간다.
const BASE = process.env.PAGES_BASE_PATH ?? '';
const file = (name: string) => ({ src: `${BASE}/videos/training/${name}` });

// 시트 제목과 목록 글자. 예: "5학년 김현승 #18 포수 훈련"
export const videoLabel = (video: TrainingVideo) => {
  const player = PLAYERS.find(p => p.number === video.player);
  return player
    ? `${player.grade}학년 ${player.name} #${player.number} ${video.title}`
    : video.title;
};

const gradeOf = (video: TrainingVideo) =>
  PLAYERS.find(p => p.number === video.player)?.grade ?? 0;

const VIDEOS: TrainingVideo[] = [
  {
    player: 18,
    category: '포수',
    title: '포수 훈련',
    poster: catcher18,
    ...file('catcher-18.mp4'),
  },
  {
    player: 16,
    category: '포수',
    title: '포수 훈련',
    poster: catcher16,
    ...file('catcher-16.mp4'),
  },
  {
    player: 33,
    category: '포수',
    title: '포수 훈련',
    poster: catcher33,
    ...file('catcher-33.mp4'),
  },
  {
    player: 22,
    category: '포수',
    title: '포수 훈련',
    poster: catcher22,
    ...file('catcher-22.mp4'),
  },
];

export const TRAINING_VIDEOS = [...VIDEOS].sort(
  (a, b) => gradeOf(b) - gradeOf(a)
);
