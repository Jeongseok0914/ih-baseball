import { useId } from 'react';

const JERSEY_PATH =
  'M30 8 L48 4 q12 8 24 0 L90 8 L116 30 L102 48 L92 40 L92 104 q-32 6 -64 0 L28 40 L18 48 L4 30 Z';

// 세로 줄무늬(핀스트라이프) 유니폼 뒷면에 이름과 등번호를 새긴다.
export function JerseyNumber({
  number,
  name,
}: {
  number: number;
  name: string;
}) {
  const stripeId = useId();

  return (
    <svg
      viewBox="0 0 120 110"
      role="img"
      aria-label={`등번호 ${number}`}
      className="w-24 sm:w-28"
    >
      <defs>
        <pattern
          id={stripeId}
          width="7"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect width="7" height="10" fill="#fbfbf8" />
          <rect x="3" width="0.9" height="10" fill="#1a1a1a" opacity="0.45" />
        </pattern>
      </defs>
      <path d={JERSEY_PATH} fill={`url(#${stripeId})`} />
      <path
        d={JERSEY_PATH}
        fill="none"
        stroke="#d6d6d0"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* 목둘레와 소매 끝 배색 */}
      <path
        d="M48 4 q12 8 24 0"
        fill="none"
        stroke="var(--color-stitch)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M6 33 L19 45 M114 33 L101 45"
        stroke="var(--color-stitch)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text
        x="60"
        y="33"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#111"
      >
        {name}
      </text>
      {/* 빨간 그림자 위에 금색 테두리를 두른 검정 숫자 */}
      <text
        x="62"
        y="88"
        textAnchor="middle"
        fontSize="46"
        fill="var(--color-stitch)"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {number}
      </text>
      <text
        x="60"
        y="86"
        textAnchor="middle"
        fontSize="46"
        fill="#111"
        stroke="var(--color-gold)"
        strokeWidth="2.5"
        paintOrder="stroke"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {number}
      </text>
    </svg>
  );
}
