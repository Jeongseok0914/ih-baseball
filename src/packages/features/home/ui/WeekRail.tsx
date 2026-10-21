'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { News } from '~content/news';
import { latestNews, newsDate } from '~features/home/live';
import { seoulToday } from '~lib/today';

// 대회 배지: 오늘이면 "오늘!", 아니면 "D-5"
const dDayLabel = (today: string, date: string) => {
  const days = Math.round((Date.parse(date) - Date.parse(today)) / 86_400_000);
  return days === 0 ? '오늘!' : `D-${days}`;
};

const NEWS_KIND = {
  event: { label: '대회', style: 'bg-sun text-ink' },
  result: { label: '결과', style: 'bg-stitch text-white' },
} as const;

const CARD =
  'chunky flex h-full flex-col bg-white p-4 shadow-none transition-transform hover:-translate-y-0.5';

// "인헌초 일정": 다가오는 대회(D-day)와 지난 경기 결과를 가로로 넘겨 본다.
// 다가오는 대회가 가까운 순으로 먼저 나오고, 지난 대회·결과는 최신순으로 이어진다(모두 4개까지).
export function WeekRail({ news }: { news: News[] }) {
  const [today, setToday] = useState<string>();
  useEffect(() => setToday(seoulToday().date), []);
  const upcoming = today
    ? news
        .filter(n => n.kind === 'event' && n.date >= today)
        .sort(
          // 날짜가 정해진 대회가 먼저, 날짜 미정(tentative)은 뒤로.
          (a, b) =>
            Number(a.kind === 'event' && !!a.tentative) -
              Number(b.kind === 'event' && !!b.tentative) ||
            a.date.localeCompare(b.date)
        )
    : [];
  const items = [
    ...upcoming,
    ...latestNews(
      news.filter(n => !upcoming.includes(n)),
      news.length
    ),
  ].slice(0, 4);

  return (
    <ul className="-mx-4 mt-4 flex snap-x scroll-px-4 gap-3 sm:scroll-px-0 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {items.map(item => {
        const body = (
          <>
            <span className="flex items-center justify-between gap-2">
              <span
                className={`rounded-lg px-2 py-0.5 font-display text-sm ${NEWS_KIND[item.kind].style}`}
              >
                {item.kind === 'event' &&
                !item.tentative &&
                today &&
                item.date >= today
                  ? dDayLabel(today, item.date)
                  : NEWS_KIND[item.kind].label}
              </span>
              <span className="text-ink/60 text-sm">{newsDate(item)}</span>
            </span>
            <span className="mt-2 font-display text-lg leading-snug">
              {item.kind === 'result'
                ? `${item.title} · 인헌 ${item.us} : ${item.them} ${item.opponent}`
                : item.title}
            </span>
          </>
        );
        return (
          <li
            key={`${item.date}-${item.title}`}
            className="w-[70%] shrink-0 snap-start sm:w-auto"
          >
            {item.href ? (
              <Link href={item.href} className={CARD}>
                {body}
              </Link>
            ) : (
              <div className={CARD}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
