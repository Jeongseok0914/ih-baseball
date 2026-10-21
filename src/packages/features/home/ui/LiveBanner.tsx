'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { News } from '~content/news';
import {
  koreanDate,
  newsDate,
  pickSpotlight,
  type Spotlight,
} from '~features/home/live';
import { seoulToday } from '~lib/today';

// 홈 맨 위 "지금" 띠. 다가오는 대회면 D-day, 막 끝난 경기면 스코어를 보여 준다.
// 날짜는 보는 사람의 오늘로 계산하므로 사이트를 다시 배포하지 않아도 저절로 바뀐다.
export function LiveBanner({ news }: { news: News[] }) {
  const [spot, setSpot] = useState<Spotlight | null>(null);

  useEffect(() => {
    setSpot(pickSpotlight(news, seoulToday().date));
  }, [news]);

  if (!spot) return null;

  const body =
    spot.kind === 'event' ? (
      <>
        <span className="shrink-0 animate-pop rounded-xl bg-sun px-3 py-1 font-display text-2xl text-ink sm:text-3xl">
          {spot.dDay === 0 ? '오늘!' : `D-${spot.dDay}`}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-xl leading-tight sm:text-2xl">
            {spot.news.title}
          </span>
          <span className="block text-sm text-white/80 sm:text-base">
            {newsDate(spot.news)}
            {spot.news.place ? ` · ${spot.news.place}` : ''} · 응원 와 주세요!
          </span>
        </span>
      </>
    ) : (
      <>
        <span
          className={`shrink-0 animate-pop rounded-xl px-3 py-1 font-display text-2xl sm:text-3xl ${spot.news.us > spot.news.them ? 'bg-sun text-ink' : 'bg-white text-ink'}`}
        >
          {spot.news.us} : {spot.news.them}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-xl leading-tight sm:text-2xl">
            인헌 vs {spot.news.opponent}
            {spot.news.note ? ` · ${spot.news.note}` : ''}
          </span>
          <span className="block text-sm text-white/80 sm:text-base">
            {spot.news.title} · {koreanDate(spot.news.date)}
          </span>
        </span>
      </>
    );

  const className =
    'mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:py-4';

  return (
    <section aria-label="지금 인헌 야구부" className="bg-ink text-white">
      {spot.news.href ? (
        <Link href={spot.news.href} className={className}>
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </section>
  );
}
