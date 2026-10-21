'use client';

import { useEffect, useState } from 'react';
import { seoulToday } from '~lib/today';

// 그 줄에 오늘 요일이 있으면 "● 오늘" 표시. 보는 날에 맞춰 바뀐다.
export function TodayMark({ days }: { days: readonly string[] }) {
  const [today, setToday] = useState(false);
  useEffect(() => setToday(days.includes(seoulToday().day)), [days]);
  if (!today) return null;
  return (
    <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-0.5 font-display text-ink text-sm">
      <span
        aria-hidden="true"
        className="size-2 animate-pulse rounded-full bg-stitch"
      />
      오늘
    </span>
  );
}
