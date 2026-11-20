// 경기 결과 띠: 인헌 점수(us)와 상대 점수(them)로 승·패·무와 색을 정한다.
export const outcome = (us: number, them: number) =>
  us > them
    ? { label: '승', style: 'bg-[var(--color-grass)] text-white' }
    : us < them
      ? { label: '패', style: 'bg-stitch text-white' }
      : { label: '무', style: 'bg-sun text-ink' };
