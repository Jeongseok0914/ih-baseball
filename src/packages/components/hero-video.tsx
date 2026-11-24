'use client';

import { useEffect, useState } from 'react';

// 휴대폰(좁은 화면)은 세로로 만든 영상을 쓴다. 넓은 영상을 잘라 키우면 흐려지기 때문.
const NARROW = '(max-width: 639px)';

// 첫 화면 배경 영상. 소리 없이 반복한다(휴대폰 자동 재생 조건: muted + playsInline).
// 움직임 줄이기 설정이나 데이터 절약 모드면 영상 없이 첫 장면 사진만 보여 준다.
export function HeroVideo({
  src,
  mobileSrc,
  poster,
  mobilePoster,
}: {
  src: string;
  mobileSrc?: string;
  poster: string;
  mobilePoster?: string;
}) {
  const [video, setVideo] = useState<{ src: string; poster: string } | null>(
    null
  );

  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    if (reduce || saveData) return;
    const narrow = window.matchMedia(NARROW).matches;
    setVideo({
      src: narrow && mobileSrc ? mobileSrc : src,
      poster: narrow && mobilePoster ? mobilePoster : poster,
    });
  }, [src, mobileSrc, poster, mobilePoster]);

  const className = 'absolute inset-0 size-full object-cover';
  if (!video) {
    // 영상 전(또는 영상을 안 틀 때)에는 화면 폭에 맞는 첫 장면 사진.
    return (
      <picture>
        {mobilePoster ? <source media={NARROW} srcSet={mobilePoster} /> : null}
        <img src={poster} alt="" className={className} />
      </picture>
    );
  }
  // 장식 영상이라 화면 읽기 프로그램에서는 건너뛴다.
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <video
        src={video.src}
        poster={video.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={className}
      />
    </div>
  );
}
