'use client';

import { useEffect, useState } from 'react';

// 첫 화면 배경 영상. 소리 없이 반복한다(휴대폰 자동 재생 조건: muted + playsInline).
// 움직임 줄이기 설정이나 데이터 절약 모드면 영상 없이 첫 장면 사진만 보여 준다.
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [still, setStill] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    setStill(reduce || saveData);
  }, []);

  const className = 'absolute inset-0 size-full object-cover';
  if (still) {
    // biome-ignore lint/performance/noImgElement: 배경 장식 사진. 이미 줄인 파일이라 최적화가 필요 없다
    return <img src={poster} alt="" className={className} />;
  }
  // 장식 영상이라 화면 읽기 프로그램에서는 건너뛴다.
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <video
        src={src}
        poster={poster}
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
