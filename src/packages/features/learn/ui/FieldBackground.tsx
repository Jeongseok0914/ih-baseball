// 규칙 장면 배경. 좌표는 200×200 기준이고 홈은 아래쪽 가운데다.
// field: 위에서 내려다본 야구장. zone: 타자 앞에서 본 스트라이크 존.
// 장식이라 감싸는 svg 에서 aria-hidden 을 건다.
export function FieldBackground({ view }: { view: 'field' | 'zone' }) {
  if (view === 'zone') {
    return (
      <g>
        <rect width="200" height="200" fill="#dfe9e1" />
        <rect y="150" width="200" height="50" fill="var(--color-dirt)" />
        <rect
          x="80"
          y="82"
          width="50"
          height="62"
          fill="rgb(255 255 255 / 0.5)"
          stroke="var(--color-ink)"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <text x="134" y="88" fontSize="9" fill="var(--color-ink)">
          가슴
        </text>
        <text x="134" y="146" fontSize="9" fill="var(--color-ink)">
          무릎
        </text>
        <path d="M86 160 h38 l-5 8 h-28 z" fill="white" />
      </g>
    );
  }

  return (
    <g>
      {/* 홈런 공이 담장 밖(위쪽)으로 나가도 보이게 위로 넉넉히 칠한다. */}
      <rect y="-40" width="200" height="240" fill="var(--color-grass)" />
      {/* 외야 담장 */}
      <path
        d="M0 30 Q100 -18 200 30"
        fill="none"
        stroke="var(--color-sun)"
        strokeWidth="4"
      />
      {/* 내야 흙과 파울 라인 */}
      <path d="M100 186 L170 116 L100 46 L30 116 Z" fill="var(--color-dirt)" />
      <path
        d="M100 172 L200 72 M100 172 L0 72"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <circle cx="100" cy="118" r="8" fill="#c98a4b" />
      {[
        [158, 114],
        [100, 56],
        [42, 114],
      ].map(([x, y]) => (
        <rect
          key={x * 1000 + y}
          x={x - 5}
          y={y - 5}
          width="10"
          height="10"
          fill="white"
          transform={`rotate(45 ${x} ${y})`}
        />
      ))}
      <path d="M95 169 h10 v4 l-5 4 l-5 -4 z" fill="white" />
    </g>
  );
}
