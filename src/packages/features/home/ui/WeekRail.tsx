'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { News } from '~content/news';
import { WEEK } from '~content/schedule';
import { koreanDate, seoulToday } from '~features/home/live';

const NEWS_KIND = {
  event: { label: '대회', style: 'bg-sun text-ink' },
  result: { label: '결과', style: 'bg-stitch text-white' },
  notice: { label: '소식', style: 'bg-grass text-white' },
} as const;

const CARD =
  'chunky flex h-full flex-col bg-white p-4 shadow-none transition-transform hover:-translate-y-0.5';

// 오늘 요일에 맞는 훈련 안내. 보는 날마다 바뀌어 사이트가 살아 있는 느낌을 준다.
function TodayCard() {
  const [today, setToday] = useState<{
    day: string;
    text: string;
    sub: string;
  }>();

  useEffect(() => {
    const { day } = seoulToday();
    const plan = WEEK.find(d => d.day === day);
    if (!plan) return;
    setToday({
      day,
      text:
        plan.kind === 'training'
          ? `${plan.label}에서 훈련해요`
          : plan.kind === 'game'
            ? '연습경기 하는 날'
            : '오늘은 쉬어요',
      sub:
        plan.kind === 'training'
          ? '와서 같이 해 봐도 돼요'
          : plan.kind === 'game'
            ? '다른 팀과 실전 경기'
            : '내일 다시 만나요',
    });
  }, []);

  return (
    <Link href="/join" className={`${CARD} bg-grass text-white`}>
      <span className="flex items-center gap-2 font-display">
        <span
          aria-hidden="true"
          className="inline-block size-2.5 animate-pulse rounded-full bg-sun"
        />
        오늘{today ? ` (${today.day})` : ''}
      </span>
      <span className="mt-2 font-display text-xl leading-snug">
        {today?.text ?? '이번 주 훈련 일정'}
      </span>
      <span className="mt-auto pt-2 text-sm text-white/80">
        {today?.sub ?? '요일별 훈련 일정'} →
      </span>
    </Link>
  );
}

// "이번 주 인헌": 오늘 훈련, 최근 소식, 새 훈련 영상을 가로로 넘겨 본다(넓은 화면은 한 줄).
export function WeekRail({
  news,
  videos,
}: {
  news: News[];
  videos: { count: number; poster: StaticImageData } | null;
}) {
  return (
    <ul className="-mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      <li className="w-[70%] shrink-0 snap-start sm:w-auto">
        <TodayCard />
      </li>
      {videos ? (
        <li className="w-[70%] shrink-0 snap-start sm:w-auto">
          <Link href="/schedule" className={`${CARD} overflow-hidden p-0`}>
            <span className="relative block">
              <Image
                src={videos.poster}
                alt=""
                sizes="(min-width: 1024px) 240px, 70vw"
                className="aspect-video w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center bg-ink/20 text-3xl text-white"
              >
                ▶
              </span>
            </span>
            <span className="block p-3 font-display text-lg leading-snug">
              훈련 영상 {videos.count}개 보기
            </span>
          </Link>
        </li>
      ) : null}
      {news.map(item => {
        const body = (
          <>
            <span className="flex items-center justify-between gap-2">
              <span
                className={`rounded-lg px-2 py-0.5 font-display text-sm ${NEWS_KIND[item.kind].style}`}
              >
                {NEWS_KIND[item.kind].label}
              </span>
              <span className="text-ink/60 text-sm">
                {koreanDate(item.date)}
              </span>
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
