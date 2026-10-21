'use client';

import Image from 'next/image';
import { useState } from 'react';
import { TrainingVideoButton } from '~components/training-video';
import { type TrainingVideo, videoLabel } from '~content/training-videos';

// 처음에 보여 주는 개수. 영상이 많아지면 "더 보기"로 이어서 연다.
const PAGE = 8;

// 훈련 영상 목록. 종류(포수·타격 등)가 두 가지 이상이면 위에 고르는 버튼이 생긴다.
export function VideoGallery({ videos }: { videos: TrainingVideo[] }) {
  const categories = [...new Set(videos.map(v => v.category))];
  const [category, setCategory] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  const filtered = category
    ? videos.filter(v => v.category === category)
    : videos;

  const choose = (next: string | null) => {
    setCategory(next);
    setShown(PAGE);
  };

  return (
    <>
      {categories.length > 1 ? (
        <div
          role="group"
          aria-label="훈련 종류"
          className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1"
        >
          {[null, ...categories].map(c => (
            <button
              key={c ?? 'all'}
              type="button"
              aria-pressed={category === c}
              onClick={() => choose(c)}
              className={`min-h-10 shrink-0 rounded-full border-2 border-ink px-4 font-display ${category === c ? 'bg-ink text-white' : 'bg-white'}`}
            >
              {c ?? '전체'}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {filtered.slice(0, shown).map(video => (
          <li key={videoLabel(video)}>
            <TrainingVideoButton
              videos={[video]}
              className="chunky group block w-full overflow-hidden bg-white text-left transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="relative block">
                <Image
                  src={video.poster}
                  alt=""
                  sizes="(min-width: 1024px) 240px, 50vw"
                  className="skeleton aspect-video w-full object-cover"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center bg-ink/15"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-white/90 pl-1 text-2xl text-stitch shadow-[0_3px_0_rgb(0_0_0/0.25)] transition-transform group-hover:scale-110">
                    ▶
                  </span>
                </span>
              </span>
              <span className="block px-3 py-2 font-display leading-snug sm:text-lg">
                {videoLabel(video)}
              </span>
            </TrainingVideoButton>
          </li>
        ))}
      </ul>

      {filtered.length > shown ? (
        <button
          type="button"
          onClick={() => setShown(n => n + PAGE)}
          className="chunky mt-5 flex min-h-12 w-full items-center justify-center bg-white font-display text-lg shadow-none"
        >
          더 보기 ({filtered.length - shown}개 남음)
        </button>
      ) : null}
    </>
  );
}
