'use client';

import Image from 'next/image';
import { type ReactNode, useState } from 'react';
import { BottomSheet } from '~components/bottom-sheet';
import { type TrainingVideo, videoLabel } from '~content/training-videos';

// 누르면 시트(휴대폰)나 팝업(PC)에서 훈련 영상을 튼다. 영상 파일은 이때 처음 받는다.
// 훈련 페이지의 영상 목록과 선수단 카드가 같이 쓴다. 겉모양은 children 으로 받는다.
// videos 가 여러 개면(한 선수의 영상 여러 개, 한 경기의 타자·투수 하이라이트) 시트 아래 목록에서 바꿔 볼 수 있다.
// title 을 주면 시트 제목 앞에 붙는다. 예: "홍천무궁화배 6학년 11/15 갈산초전 · 타자 하이라이트"
export function TrainingVideoButton({
  videos,
  title,
  className,
  children,
}: {
  videos: TrainingVideo[];
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const video = videos[active];
  if (!video) return null;
  const label = title ? `${title} · ${videoLabel(video)}` : videoLabel(video);

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
        <BottomSheet title={label} wide onClose={() => setOpen(false)}>
          <div className="mt-3 overflow-hidden rounded-2xl border-[3px] border-ink bg-ink">
            {'youtube' in video ? (
              <iframe
                key={video.youtube}
                src={`https://www.youtube-nocookie.com/embed/${video.youtube}?autoplay=1&rel=0&playsinline=1`}
                title={label}
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
                // 다 보면 목록의 다음 영상(예: 타자 → 투수 하이라이트)으로 넘어간다.
                onEnded={() =>
                  setActive(index =>
                    index + 1 < videos.length ? index + 1 : index
                  )
                }
                preload="metadata"
                // 세로 영상은 화면 높이에 맞춰 가운데 둔다.
                className={
                  video.vertical
                    ? 'mx-auto block aspect-[9/16] h-[min(66dvh,560px)] w-auto'
                    : 'aspect-video w-full'
                }
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
                      {v.title ?? `영상 ${v.part ?? index + 1}`}
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
