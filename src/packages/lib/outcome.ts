// 경기 결과 띠: 인헌 점수(us)와 상대 점수(them)로 승·패·무와 색을 정한다.
export const outcome = (us: number, them: number) =>
  us > them
    ? { label: '승', style: 'bg-[var(--color-grass)] text-white' }
    : us < them
      ? { label: '패', style: 'bg-stitch text-white' }
      : { label: '무', style: 'bg-sun text-ink' };

// 여러 경기 전적. 예: "1승 2패"
export const record = (scores: { us: number; them: number }[]) => {
  const count = (label: string) =>
    scores.filter(s => outcome(s.us, s.them).label === label).length;
  return [
    ['승', count('승')],
    ['무', count('무')],
    ['패', count('패')],
  ]
    .filter(([label, n]) => n || label !== '무')
    .map(([label, n]) => `${n}${label}`)
    .join(' ');
};
