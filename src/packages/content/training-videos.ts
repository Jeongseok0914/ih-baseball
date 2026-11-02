import type { StaticImageData } from 'next/image';
import batting1 from '~content/images/training/batting-1.jpg';
import batting7 from '~content/images/training/batting-7.jpg';
import catcher16 from '~content/images/training/catcher-16.jpg';
import catcher16b from '~content/images/training/catcher-16-2.jpg';
import catcher18 from '~content/images/training/catcher-18.jpg';
import catcher18b from '~content/images/training/catcher-18-2.jpg';
import catcher22 from '~content/images/training/catcher-22.jpg';
import catcher33 from '~content/images/training/catcher-33.jpg';
import fielding1b from '~content/images/training/fielding-1-2.jpg';
import fielding10 from '~content/images/training/fielding-10.jpg';
import fielding10b from '~content/images/training/fielding-10-2.jpg';
import fielding36 from '~content/images/training/fielding-36.jpg';
import fielding36b from '~content/images/training/fielding-36-2.jpg';
import teamFitness from '~content/images/training/team-fitness.jpg';
import teamFitness2 from '~content/images/training/team-fitness-2.jpg';
import { PLAYERS } from '~content/players';

// 선수 훈련 영상. 보호자가 영상 공개에 동의한 선수만 넣는다.
// 화면에는 최신 영상부터, 같은 날이면 높은 학년부터, 그다음 이 배열 순서대로 나온다.
// 한 선수에 영상이 여러 개면 선수단 카드에서 시트 안 목록으로 바꿔 본다.
// - 사이트에 직접 올린 영상: public/videos/training 에 720p(H.264)로 줄여 넣고 src 로 가리킨다.
// - 영상이 많아져 저장소가 부담되면 유튜브에 올리고 youtube 에 영상 ID 만 적는다. 화면은 그대로다.
// 포스터(첫 화면 사진)는 누르기 전까지 영상 대신 보여 주는 가벼운 사진이다.
// category·title: 훈련 종류(포수·타격 등). 확인된 것만 적고 모르면 비워 둔다(짐작해서 붙이지 않는다).
//   종류가 두 가지 이상이면 훈련 페이지에 종류 버튼이 생긴다.
// part: 한 선수의 영상이 여러 개일 때 순서(1, 2 …). 제목 뒤에 (2)처럼 붙는다.
// vertical: 휴대폰 세로 영상. 재생 창을 세로로 맞춘다.
// date: 올린 날('YYYY-MM-DD'). 화면에는 최신 영상부터 나온다.
// player: 선수 등번호. 비우면 팀 전체 영상(단체 훈련)이고 선수단 카드에는 붙지 않는다.
export type TrainingVideo = {
  player?: number;
  date: string;
  category?: string;
  title?: string;
  part?: number;
  poster: StaticImageData;
  vertical?: boolean;
} & ({ src: string } | { youtube: string });

// public 파일은 basePath 가 자동으로 붙지 않아 직접 붙인다. 서버 컴포넌트에서 읽어 넘겨야 값이 들어간다.
const BASE = process.env.PAGES_BASE_PATH ?? '';
const file = (name: string) => ({ src: `${BASE}/videos/training/${name}` });

// 시트 제목과 목록 글자. 예: "5학년 김현승 #18 포수 훈련", "5학년 이한이 #10 (2)"
export const videoLabel = (video: TrainingVideo) => {
  const player = PLAYERS.find(p => p.number === video.player);
  return [
    player ? `${player.grade}학년 ${player.name} #${player.number}` : '',
    video.title,
    video.part ? `(${video.part})` : '',
  ]
    .filter(Boolean)
    .join(' ');
};

// 같은 날 올린 영상끼리는 단체 영상이 먼저, 그다음 높은 학년부터.
const gradeOf = (video: TrainingVideo) =>
  video.player === undefined
    ? 7
    : (PLAYERS.find(p => p.number === video.player)?.grade ?? 0);

const VIDEOS: TrainingVideo[] = [
  {
    player: 18,
    date: '2026-10-21',
    category: '포수',
    title: '포수 훈련',
    part: 1,
    poster: catcher18,
    ...file('catcher-18.mp4'),
  },
  {
    player: 16,
    date: '2026-10-21',
    category: '포수',
    title: '포수 훈련',
    part: 1,
    poster: catcher16,
    ...file('catcher-16.mp4'),
  },
  {
    player: 33,
    date: '2026-10-21',
    category: '포수',
    title: '포수 훈련',
    poster: catcher33,
    ...file('catcher-33.mp4'),
  },
  {
    player: 22,
    date: '2026-10-21',
    category: '포수',
    title: '포수 훈련',
    poster: catcher22,
    ...file('catcher-22.mp4'),
  },
  {
    player: 18,
    date: '2026-11-01',
    part: 2,
    poster: catcher18b,
    ...file('catcher-18-2.mp4'),
  },
  {
    player: 16,
    date: '2026-11-01',
    part: 2,
    poster: catcher16b,
    ...file('catcher-16-2.mp4'),
  },
  {
    player: 10,
    date: '2026-11-01',
    part: 1,
    poster: fielding10,
    vertical: true,
    ...file('fielding-10.mp4'),
  },
  {
    player: 10,
    date: '2026-11-01',
    part: 2,
    poster: fielding10b,
    vertical: true,
    ...file('fielding-10-2.mp4'),
  },
  {
    player: 36,
    date: '2026-11-01',
    part: 1,
    poster: fielding36,
    vertical: true,
    ...file('fielding-36.mp4'),
  },
  {
    player: 36,
    date: '2026-11-01',
    part: 2,
    poster: fielding36b,
    vertical: true,
    ...file('fielding-36-2.mp4'),
  },
  {
    player: 1,
    date: '2026-11-01',
    // 타격 훈련(팀 확인)
    category: '타격',
    title: '타격 훈련',
    part: 1,
    poster: batting1,
    vertical: true,
    ...file('batting-1.mp4'),
  },
  {
    player: 1,
    date: '2026-11-01',
    // 경기 중 플라이볼 수비 장면(영상 자막 "나이스 캐치!")
    title: '나이스 캐치!',
    part: 2,
    poster: fielding1b,
    vertical: true,
    ...file('fielding-1-2.mp4'),
  },
  {
    player: 7,
    date: '2026-11-01',
    // 타격 훈련(팀 확인)
    category: '타격',
    title: '타격 훈련',
    poster: batting7,
    vertical: true,
    ...file('batting-7.mp4'),
  },
  {
    date: '2026-11-01',
    category: '단체',
    title: '단체 체력 훈련',
    part: 1,
    poster: teamFitness,
    ...file('team-fitness.mp4'),
  },
  {
    date: '2026-11-01',
    category: '단체',
    title: '단체 체력 훈련',
    part: 2,
    poster: teamFitness2,
    ...file('team-fitness-2.mp4'),
  },
];

export const TRAINING_VIDEOS = [...VIDEOS].sort(
  (a, b) => b.date.localeCompare(a.date) || gradeOf(b) - gradeOf(a)
);
