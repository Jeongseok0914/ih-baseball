// 홈이 "오늘" 기준으로 무엇을 보여 줄지 고른다. 오늘 날짜는 ~lib/today 의 seoulToday 로 구한다.
import type { News } from '~content/news';

const DAY_MS = 86_400_000;
const EVENT_AHEAD_DAYS = 30;
const RESULT_KEEP_DAYS = 14;

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS);

export type Spotlight =
  | { kind: 'event'; news: Extract<News, { kind: 'event' }>; dDay: number }
  | { kind: 'result'; news: Extract<News, { kind: 'result' }> };

// 30일 안의 가장 가까운 대회가 먼저, 없으면 14일 안의 가장 최근 결과.
export function pickSpotlight(news: News[], today: string): Spotlight | null {
  const event = news
    .filter(
      (n): n is Extract<News, { kind: 'event' }> =>
        n.kind === 'event' && !n.tentative
    )
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

// 소식 날짜 글자: 미정이면 "11월 중", 여러 날이면 "11월 12일~15일"
export const newsDate = (news: News) => {
  if (news.kind !== 'event') return koreanDate(news.date);
  if (news.tentative) return news.tentative;
  if (!news.end) return koreanDate(news.date);
  const [, m1] = news.date.split('-').map(Number);
  const [, m2, d2] = news.end.split('-').map(Number);
  return `${koreanDate(news.date)}~${m1 === m2 ? `${d2}일` : koreanDate(news.end)}`;
};
