'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { pickReels, type Reel } from '~features/home/instagram';

// 홈 '짧은 영상'의 릴스 카드. Behold 피드가 있으면 보는 순간의 최신 릴스로 바꾸고,
// 피드가 없거나 불러오지 못하면 직접 넣어 둔 릴스(fallback)를 그대로 보여 준다.
export function InstagramReels({
  feed,
  fallback,
}: {
  feed: string;
  fallback: Reel[];
}) {
  const [reels, setReels] = useState(fallback);

  useEffect(() => {
    if (!feed) return;
    const controller = new AbortController();
    fetch(feed, { signal: controller.signal })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        const latest = data ? pickReels(data, fallback.length || 3) : [];
        if (latest.length > 0) setReels(latest);
      })
      .catch(() => {
        // 실패하면 fallback 릴스를 그대로 둔다.
      });
    return () => controller.abort();
  }, [feed, fallback.length]);

  return reels.map((reel, index) => (
    <li
      key={reel.href}
      className="w-[28%] shrink-0 snap-start md:w-[calc((100%-3.75rem)/4)]"
    >
      <a
        href={reel.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`인스타그램 릴스 ${index + 1} 보기`}
        className="chunky group relative block overflow-hidden"
      >
        <Image
          src={reel.src}
          width={reel.width}
          height={reel.height}
          alt=""
          sizes="(min-width: 768px) 240px, 28vw"
          className="skeleton aspect-[9/16] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute inset-0 grid place-items-center bg-black/10">
          <span className="grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow-[0_3px_0_rgb(0_0_0/0.25)] transition-transform group-hover:scale-110 sm:size-14">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="ml-0.5 size-5 sm:size-7"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </a>
    </li>
  ));
}
