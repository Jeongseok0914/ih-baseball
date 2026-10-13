// 운동장 수동 점수판처럼 한 글자씩 판에 끼운 타일.
export function ScoreboardTiles({ text }: { text: string }) {
  return (
    <span className="flex flex-wrap gap-1.5 sm:gap-2">
      <span className="sr-only">{text}</span>
      {[...text].map((char, index) => (
        <span
          aria-hidden="true"
          // 같은 글자가 반복될 수 있어 위치가 곧 정체성이다.
          // biome-ignore lint/suspicious/noArrayIndexKey: static text
          key={index}
          className="grid size-14 place-items-center rounded-sm bg-board-deep font-display text-4xl text-chalk shadow-[inset_0_-3px_0_rgb(0_0_0/0.35)] sm:size-20 sm:text-6xl"
        >
          {char}
        </span>
      ))}
    </span>
  );
}

// 공 실밥. 점수판 아래 장식용.
export function Stitches() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      className="h-6 w-full text-stitch"
    >
      <path
        d="M0 12 Q100 0 200 12 T400 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M0 12 Q100 0 200 12 T400 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeDasharray="2 14"
      />
    </svg>
  );
}
