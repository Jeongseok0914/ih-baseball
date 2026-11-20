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
import hc1113g5 from '~content/images/training/hongcheon-1113-5.jpg';
import hc1113g6 from '~content/images/training/hongcheon-1113-6.jpg';
import hc1114g5 from '~content/images/training/hongcheon-1114-5.jpg';
import hc1114g6 from '~content/images/training/hongcheon-1114-6.jpg';
import hc1115g5 from '~content/images/training/hongcheon-1115-5.jpg';
import hc1115g6 from '~content/images/training/hongcheon-1115-6.jpg';
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

// 경기 하이라이트: 팀 유튜브 중계(공개 영상)에서 경기마다 한 편을 만들었다.
// 인헌초 타자가 쳐서 살아 나간 장면(나이스 배팅)과 수비 아웃 장면을 경기 순서대로 이었다.
// 점수판은 늦게 바뀌고 실책·볼넷 득점도 섞이므로 점수로 고르지 않았다: 주자가 늘어난 출루마다
// 그 앞 플레이 순간을 화면 움직임으로 찾고, 장면을 직접 보고 쳐서 나간 것만 남겼다(볼넷·견제·실책 제외).
// 중계 점수판은 확대한 화면 왼쪽 위에 그대로 붙였고, 자막과 팀 응원가 배경음악을 넣었다.
// '경기' 메뉴에서 group(대회·학년)끼리 묶어 사이트 안에서 재생한다. 훈련 영상 목록에는 넣지 않는다.
// score: 인헌 점수 us, 상대 점수 them. 카드에 승·패 띠로 나온다. 최신 경기가 앞.
// 원본 중계: 채널 '인헌초 야구부'(YOUTUBE_CHANNEL)의 11/13~11/15 라이브.
export type GameHighlight = {
  date: string;
  title: string;
  group: string;
  score: { us: number; them: number };
  videos: TrainingVideo[];
};

const game = (
  date: string,
  grade: 5 | 6,
  opponent: string,
  us: number,
  them: number,
  poster: StaticImageData
): GameHighlight => {
  const key = `hongcheon-${date.slice(5).replace('-', '')}-${grade}`;
  const title = `${Number(date.slice(5, 7))}/${Number(date.slice(8))} ${opponent}전`;
  return {
    date,
    title,
    group: `홍천무궁화배 ${grade}학년`,
    score: { us, them },
    videos: [{ date, title: '경기 하이라이트', poster, ...file(`${key}.mp4`) }],
  };
};

export const HIGHLIGHTS: GameHighlight[] = [
  game('2026-11-15', 6, '갈산초', 2, 12, hc1115g6),
  game('2026-11-14', 6, '도곡초', 5, 21, hc1114g6),
  game('2026-11-13', 6, '백운초', 5, 7, hc1113g6),
  game('2026-11-15', 5, '백운초', 7, 5, hc1115g5),
  game('2026-11-14', 5, '화곡초', 2, 12, hc1114g5),
  game('2026-11-13', 5, 'VIP', 6, 5, hc1113g5),
];
