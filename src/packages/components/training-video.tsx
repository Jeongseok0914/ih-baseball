'use client';

import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { BottomSheet } from '~components/bottom-sheet';
import { type TrainingVideo, videoLabel } from '~content/training-videos';

// 누르면 시트(휴대폰)나 팝업(PC)에서 훈련 영상을 튼다. 영상 파일은 이때 처음 받는다.
// 훈련 페이지의 영상 목록과 선수단 카드가 같이 쓴다. 겉모양은 children 으로 받는다.
// videos 가 여러 개면(한 선수의 영상 여러 개) 시트 아래 목록에서 바꿔 볼 수 있다.
export function TrainingVideoButton({
  videos,
  className,
  children,
}: {
  videos: TrainingVideo[];
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const video = videos[active];
  if (!video) return null;

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setActive(0);
          setOpen(true);
        }}
        className={className}
      >
        {children}
      </button>
      {open ? (
        <BottomSheet
          title={videoLabel(video)}
          wide
          onClose={() => setOpen(false)}
        >
          <div className="mt-3 overflow-hidden rounded-2xl border-[3px] border-ink bg-ink">
            {'youtube' in video ? (
              <iframe
                key={video.youtube}
                src={`https://www.youtube-nocookie.com/embed/${video.youtube}?autoplay=1&rel=0&playsinline=1`}
                title={videoLabel(video)}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="aspect-video w-full"
              />
            ) : (
              // biome-ignore lint/a11y/useMediaCaption: 대사 없는 훈련 장면이라 자막이 없다
              <video
                key={video.src}
                src={video.src}
                poster={video.poster.src}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="aspect-video w-full"
              />
            )}
          </div>
          {videos.length > 1 ? (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {videos.map((v, index) => (
                <li key={videoLabel(v)} className="w-36 shrink-0">
                  <button
                    type="button"
                    aria-current={index === active}
                    onClick={() => setActive(index)}
                    className={`block w-full overflow-hidden rounded-xl border-[3px] text-left ${index === active ? 'border-stitch' : 'border-ink/20'}`}
                  >
                    <Image
                      src={v.poster}
                      alt=""
                      sizes="144px"
                      className="aspect-video w-full object-cover"
                    />
                    <span className="block px-2 py-1 font-display text-sm leading-tight">
                      {v.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </BottomSheet>
      ) : null}
    </>
  );
}
