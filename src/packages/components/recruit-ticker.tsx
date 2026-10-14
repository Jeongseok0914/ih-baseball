import { RECRUIT } from '~content/recruit';

// 신입 부원 모집 띠. 모든 페이지 헤더 바로 아래에 흐른다.
export function RecruitTicker() {
  const items = [
    `${RECRUIT.season} 신입 부원 모집 중`,
    RECRUIT.grades,
    ...RECRUIT.ticker,
  ];
  // 끊김 없이 흐르도록 같은 줄을 두 번 이어 붙인다. 두 번째 줄은 화면 읽기에서 뺀다.
  return (
    <div className="overflow-hidden border-ink border-b-[3px] bg-sun py-2 font-display text-ink text-lg">
      <p className="sr-only">{items.join(', ')}</p>
      <div aria-hidden="true" className="flex w-max animate-marquee">
        {[0, 1].map(copy => (
          <ul key={copy} className="flex shrink-0">
            {items.map(item => (
              <li key={item} className="flex items-center gap-6 pr-6">
                {item}
                <span className="text-dirt">⚾</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
