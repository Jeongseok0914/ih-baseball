// 야구부 캐릭터. 모두 같은 IH 팀 모자를 쓴다.
// - CoachCharacter: 강재훈 감독님 전신(수염, 배가 나온 71번). 하단 연락처에 쓴다.
// - CharacterFace: 카드 원에 들어가는 얼굴. 감독님, 젊은 코치, 학년별 아이.
const SKIN = '#f3c9a1';
const SKIN_SHADE = '#e2ae86';
const JERSEY = '#f5f5f2';
const JERSEY_SHADE = '#dcdcd6';
const LINE = '#2b1d14';
const HAIR = '#2a1d16';
const CHEEK = '#f29b8f';

export type Face =
  | { kind: 'headCoach' }
  | { kind: 'coach' }
  | { kind: 'kid'; grade: number; seed: number };

const FACE_VIEW_BOX = '40 16 120 120';

function Cap() {
  return (
    <>
      <path
        d="M58 70 q0 -48 42 -48 q42 0 42 48 z"
        fill="#111"
        stroke="var(--color-gold)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text
        x="100"
        y="60"
        textAnchor="middle"
        fontSize="24"
        fontStyle="italic"
        fontWeight="700"
        fill="var(--color-gold)"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        IH
      </text>
      <path
        d="M54 68 q46 -8 92 0 q-4 13 -46 13 q-42 0 -46 -13 z"
        fill="#000"
        stroke="var(--color-gold)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="22" r="4" fill="var(--color-stitch)" />
    </>
  );
}

const stroke = {
  fill: 'none',
  stroke: LINE,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function SmileEyes({ y = 88 }: { y?: number }) {
  return (
    <path
      d={`M81 ${y} q6 -7 12 0 M107 ${y} q6 -7 12 0`}
      {...stroke}
      strokeWidth="3.2"
    />
  );
}

function DotEyes({ r, wink = false }: { r: number; wink?: boolean }) {
  return (
    <>
      {wink ? (
        <path d="M81 89 q6 -6 12 0" {...stroke} strokeWidth="3" />
      ) : (
        <>
          <circle cx="87" cy="89" r={r} fill={LINE} />
          <circle cx="88.3" cy="87.6" r={r / 3} fill="#fff" />
        </>
      )}
      <circle cx="113" cy="89" r={r} fill={LINE} />
      <circle cx="114.3" cy="87.6" r={r / 3} fill="#fff" />
    </>
  );
}

const EYES = [
  (_r: number) => <SmileEyes key="smile" y={89} />,
  (r: number) => <DotEyes key="dot" r={r} />,
  (r: number) => <DotEyes key="wink" r={r} wink />,
  // 반짝이는 큰 눈
  (r: number) => (
    <g key="big">
      {[87, 113].map(x => (
        <g key={x}>
          <ellipse cx={x} cy="89" rx={r + 1} ry={r + 2} fill={LINE} />
          <circle cx={x + 1.6} cy="86.5" r={r / 2.4} fill="#fff" />
          <circle cx={x - 1.4} cy="91.5" r={r / 5} fill="#fff" />
        </g>
      ))}
    </g>
  ),
];

const MOUTHS = [
  // 활짝 웃는 입
  <path
    key="grin"
    d="M89 103 q11 12 22 0 z"
    fill="#c4553f"
    stroke={LINE}
    strokeWidth="2"
    strokeLinejoin="round"
  />,
  // 살짝 웃는 입
  <path key="smile" d="M91 104 q9 8 18 0" {...stroke} strokeWidth="2.6" />,
  // 신나서 벌린 입
  <ellipse
    key="open"
    cx="100"
    cy="107"
    rx="5"
    ry="6"
    fill="#c4553f"
    stroke={LINE}
    strokeWidth="2"
  />,
  // 이를 드러내고 웃는 입
  <g key="teeth">
    <path
      d="M88 102 q12 13 24 0 z"
      fill="#c4553f"
      stroke={LINE}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M89.5 103 h21 q-1 3 -3 4 h-15 q-2 -1 -3 -4 z" fill="#fff" />
  </g>,
];

// 0: 짧은 옆머리, 1: 귀를 덮는 머리, 2: 빡빡머리(옆머리 없음)
const HAIR_STYLES = [
  'M60 70 q-2 14 4 24 l4 -2 q-2 -10 0 -20 z M140 70 q2 14 -4 24 l-4 -2 q2 -10 0 -20 z',
  'M57 68 q-6 18 2 32 l7 -4 q-4 -14 0 -28 z M143 68 q6 18 -2 32 l-7 -4 q4 -14 0 -28 z',
  '',
];

// seed(명단 순서)로 눈·입이 서로 다른 조합을 고른다. 눈 4 x 입 4 = 16명까지 안 겹친다.
const kidLook = (seed: number) => ({
  eyes: seed % 4,
  mouth: (seed + Math.floor(seed / 4)) % 4,
  extra: seed % 3,
  hair: Math.floor(seed / 2) % 3,
  brows: seed % 5 === 1 || seed % 5 === 3,
});

function Head({ face }: { face: Face }) {
  const isKid = face.kind === 'kid';
  const kid = kidLook(isKid ? face.seed : 0);
  // 저학년일수록 얼굴이 동그랗고 눈이 크다.
  const young = isKid && face.grade <= 4;

  return (
    <>
      <circle cx="58" cy="86" r="8" fill={SKIN_SHADE} />
      <circle cx="142" cy="86" r="8" fill={SKIN_SHADE} />
      {young ? (
        <circle cx="100" cy="84" r="44" fill={SKIN} />
      ) : (
        <ellipse cx="100" cy="83" rx="42" ry="44" fill={SKIN} />
      )}

      {/* 모자 밑으로 나온 옆머리 */}
      {face.kind === 'coach' || (isKid && HAIR_STYLES[kid.hair]) ? (
        <path
          d={face.kind === 'coach' ? HAIR_STYLES[1] : HAIR_STYLES[kid.hair]}
          fill={HAIR}
        />
      ) : null}

      {face.kind === 'headCoach' ? (
        <>
          <path
            d="M64 96 q4 28 36 30 q32 -2 36 -30 q-8 14 -36 16 q-28 -2 -36 -16 z"
            fill={HAIR}
          />
          <SmileEyes />
          <ellipse cx="77" cy="101" rx="7" ry="4" fill={CHEEK} opacity="0.75" />
          <ellipse
            cx="123"
            cy="101"
            rx="7"
            ry="4"
            fill={CHEEK}
            opacity="0.75"
          />
          <path
            d="M90 106 q10 10 20 0 z"
            fill="#c4553f"
            stroke={LINE}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M100 99 q-10 -7 -22 1 q9 7 22 2 q13 5 22 -2 q-12 -8 -22 -1 z"
            fill={HAIR}
          />
        </>
      ) : null}

      {face.kind === 'coach' ? (
        <>
          {/* 짙은 눈썹, 또렷한 눈, 자신 있는 미소 */}
          <path
            d="M80 84 l12 -2.5 M108 81.5 l12 2.5"
            {...stroke}
            stroke={HAIR}
            strokeWidth="4"
          />
          <DotEyes r={3.4} />
          <path
            d="M98 92 q-2 5 2 6"
            {...stroke}
            stroke={SKIN_SHADE}
            strokeWidth="2.4"
          />
          <path d="M88 104 q12 9 24 -1" {...stroke} strokeWidth="2.8" />
          <path
            d="M76 112 q24 14 48 0"
            {...stroke}
            stroke={SKIN_SHADE}
            strokeWidth="1.6"
          />
        </>
      ) : null}

      {isKid ? (
        <>
          {kid.brows ? (
            <path
              d="M81 82 q6 -3 12 -1 M107 81 q6 -2 12 1"
              {...stroke}
              stroke={HAIR}
              strokeWidth="2.6"
            />
          ) : null}
          {EYES[kid.eyes](young ? 5 : 4)}
          <ellipse
            cx="76"
            cy="101"
            rx={young ? 9 : 7}
            ry={young ? 5 : 4}
            fill={CHEEK}
            opacity="0.8"
          />
          <ellipse
            cx="124"
            cy="101"
            rx={young ? 9 : 7}
            ry={young ? 5 : 4}
            fill={CHEEK}
            opacity="0.8"
          />
          {kid.extra === 1
            ? [72, 77, 75, 123, 128, 125].map((x, i) => (
                <circle
                  key={x}
                  cx={x}
                  cy={i % 3 === 2 ? 104 : 99}
                  r="1.1"
                  fill="#b9805a"
                />
              ))
            : null}
          {kid.extra === 2 ? (
            <g transform="rotate(-20 124 98)">
              <rect
                x="116"
                y="94"
                width="16"
                height="7"
                rx="3"
                fill="#f6dcb6"
                stroke="#d9b98c"
              />
              <circle cx="122" cy="97.5" r="0.8" fill="#d9b98c" />
              <circle cx="126" cy="97.5" r="0.8" fill="#d9b98c" />
            </g>
          ) : null}
          {MOUTHS[kid.mouth]}
        </>
      ) : null}

      <Cap />
    </>
  );
}

export function CharacterFace({
  face,
  label,
  className,
}: {
  face: Face;
  label: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={FACE_VIEW_BOX}
      role="img"
      aria-label={label}
      className={className}
    >
      <Head face={face} />
    </svg>
  );
}

export function CoachCharacter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      role="img"
      aria-label="IH 야구부 모자를 쓰고 수염이 난 강재훈 감독님 캐릭터"
      className={className}
    >
      {/* 다리와 신발 */}
      <rect x="70" y="198" width="25" height="42" rx="9" fill={JERSEY_SHADE} />
      <rect x="105" y="198" width="25" height="42" rx="9" fill={JERSEY_SHADE} />
      <ellipse cx="80" cy="242" rx="18" ry="8" fill="#111" />
      <ellipse cx="120" cy="242" rx="18" ry="8" fill="#111" />

      {/* 팔: 왼손은 공, 오른손은 인사 */}
      <ellipse
        cx="38"
        cy="150"
        rx="15"
        ry="30"
        fill={JERSEY}
        stroke={JERSEY_SHADE}
        strokeWidth="2"
        transform="rotate(28 38 150)"
      />
      <ellipse
        cx="164"
        cy="118"
        rx="15"
        ry="30"
        fill={JERSEY}
        stroke={JERSEY_SHADE}
        strokeWidth="2"
        transform="rotate(-38 164 118)"
      />
      <circle cx="178" cy="92" r="12" fill={SKIN} />
      <circle cx="28" cy="176" r="12" fill={SKIN} />
      <circle cx="22" cy="186" r="11" fill="#fff" stroke="#ddd" />
      <path
        d="M15 180 q5 6 2 13 M29 180 q-5 6 -2 13"
        fill="none"
        stroke="var(--color-stitch)"
        strokeWidth="1.8"
        strokeDasharray="2 2"
      />

      {/* 볼록한 배와 유니폼 */}
      <ellipse cx="100" cy="158" rx="72" ry="66" fill={JERSEY} />
      <ellipse cx="108" cy="174" rx="50" ry="42" fill="#fff" />
      <path d="M100 112 v28" stroke={JERSEY_SHADE} strokeWidth="2" />
      {[118, 128, 138].map(y => (
        <circle key={y} cx="100" cy={y} r="2" fill="#111" />
      ))}
      <text
        x="100"
        y="190"
        textAnchor="middle"
        fontSize="42"
        fill="#111"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        71
      </text>
      {/* 벨트가 배 아래로 휘어진다 */}
      <path
        d="M54 208 q46 22 92 0"
        fill="none"
        stroke="#111"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <Head face={{ kind: 'headCoach' }} />
    </svg>
  );
}
