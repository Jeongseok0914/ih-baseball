// 홈이 "오늘" 기준으로 무엇을 보여 줄지 고른다. 날짜는 서울 시간으로 센다.
import type { News } from '~content/news';

const DAY_MS = 86_400_000;
const EVENT_AHEAD_DAYS = 30;
const RESULT_KEEP_DAYS = 14;

// 서울 기준 오늘 날짜('YYYY-MM-DD')와 요일('월'~'일')
export function seoulToday(now = new Date()) {
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
  }).format(now);
  const day = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
  }).format(now);
  return { date, day };
}

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS);

export type Spotlight =
  | { kind: 'event'; news: Extract<News, { kind: 'event' }>; dDay: number }
  | { kind: 'result'; news: Extract<News, { kind: 'result' }> };

// 30일 안의 가장 가까운 대회가 먼저, 없으면 14일 안의 가장 최근 결과.
export function pickSpotlight(news: News[], today: string): Spotlight | null {
  const event = news
    .filter(n => n.kind === 'event')
    .map(n => ({ news: n, dDay: daysBetween(today, n.date) }))
    .filter(e => e.dDay >= 0 && e.dDay <= EVENT_AHEAD_DAYS)
    .sort((a, b) => a.dDay - b.dDay)[0];
  if (event) return { kind: 'event', ...event };

  const result = news
    .filter(n => n.kind === 'result')
    .filter(n => {
      const ago = daysBetween(n.date, today);
      return ago >= 0 && ago <= RESULT_KEEP_DAYS;
    })
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  return result ? { kind: 'result', news: result } : null;
}

// 최근 소식: 날짜 최신순. 앞으로 열릴 대회가 있으면 맨 앞에 온다.
export const latestNews = (news: News[], count = 3) =>
  [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count);

// 'YYYY-MM-DD' → '10월 21일'
export const koreanDate = (date: string) => {
  const [, m, d] = date.split('-').map(Number);
  return `${m}월 ${d}일`;
};
