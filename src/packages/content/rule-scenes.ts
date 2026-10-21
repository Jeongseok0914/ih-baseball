// 규칙 카드를 누르면 보여 주는 장면. 야구장 그림(200×200) 위에서 선수와 공이 움직인다.
// - view 'field': 위에서 내려다본 야구장. 'zone': 타자 앞에서 본 스트라이크 존.
// - 각 단계는 set(순간 이동) → show/hide → moves(경로를 따라 이동) → caption·count 표시 순서로 진행한다.
export type Pos = readonly [number, number];

// star: 장면의 주인공. 감독님 캐릭터로 그린다. 나머지 선수는 아이들 캐릭터.
// tag: 선수 아래에 붙는 짧은 이름표(예: 수비 번호, 타순).
export type Actor = {
  kind: 'player' | 'ball';
  team?: 'red' | 'green';
  star?: boolean;
  tag?: string;
  at: Pos;
  hidden?: boolean;
};

// 효과음: 방망이(hit), 미트(catch), 아웃 호루라기(out), 세이프(safe), 관중 함성(cheer)
export type Sfx = 'hit' | 'catch' | 'out' | 'safe' | 'cheer';

// sfx: 단계 시작 때 소리. arcs: 공을 그 높이만큼 띄워 뜬공처럼(그림자와 함께).
// flash: 움직임이 끝난 자리에 "팡!" 같은 글자를 터뜨린다. zoom: 그 자리를 확대(null 이면 원래대로).
export type SceneStep = {
  caption: string;
  sfx?: Sfx;
  arcs?: Record<string, number>;
  flash?: { at: Pos; text: string; sfx?: Sfx };
  zoom?: { at: Pos; scale: number } | null;
  set?: Record<string, Pos>;
  show?: string[];
  hide?: string[];
  moves?: Record<string, Pos[]>;
  duration?: number;
  hold?: number;
  count?: { b?: number; s?: number; o?: number; score?: number };
};

export type Scene = {
  view: 'field' | 'zone';
  scoreboard?: boolean;
  actors: Record<string, Actor>;
  steps: SceneStep[];
};

// 야구장 위치
const H: Pos = [100, 172];
const B1: Pos = [158, 114];
const B2: Pos = [100, 56];
const B3: Pos = [42, 114];
const MOUND: Pos = [100, 118];
const BAT: Pos = [86, 170];
const SPOT = {
  P: MOUND,
  C: [100, 190],
  '1B': [150, 104],
  '2B': [128, 78],
  SS: [72, 78],
  '3B': [50, 104],
  LF: [40, 36],
  CF: [100, 22],
  RF: [160, 36],
} as const satisfies Record<string, Pos>;

const fielder = (spot: keyof typeof SPOT): Actor => ({
  kind: 'player',
  team: 'green',
  at: SPOT[spot],
});
const ball = (at: Pos = MOUND): Actor => ({ kind: 'ball', at, hidden: true });
const kid = (at: Pos, extra: Partial<Actor> = {}): Actor => ({
  kind: 'player',
  team: 'red',
  at,
  ...extra,
});
const star = (at: Pos, extra: Partial<Actor> = {}): Actor =>
  kid(at, { star: true, ...extra });
// 2루를 지키러 들어온 수비 위치
const COVER_2B: Pos = [106, 62];

// 스트라이크 존 화면 위치
const PITCH_FROM: Pos = [105, 18];
const IN_ZONE: Pos = [105, 106];
const LOW_ZONE: Pos = [100, 128];
const OUTSIDE: Pos = [152, 96];

// 투구 한 번. 공이 들어오면 미트 소리와 함께 심판 콜(스트라이크!/볼!)을 터뜨린다.
const pitch = (
  to: Pos,
  caption: string,
  count: SceneStep['count'],
  call = count?.s !== undefined
    ? '스트라이크!'
    : count?.b !== undefined
      ? '볼!'
      : ''
): SceneStep => ({
  caption,
  set: { ball: PITCH_FROM },
  show: ['ball'],
  moves: { ball: [to] },
  duration: 700,
  count,
  ...(call ? { flash: { at: to, text: call, sfx: 'catch' as const } } : {}),
});

export const RULE_SCENES: Record<string, Scene> = {
  attackDefense: {
    view: 'field',
    scoreboard: true,
    actors: {
      g1: fielder('P'),
      g2: fielder('C'),
      g3: fielder('SS'),
      g4: fielder('CF'),
      r1: { kind: 'player', team: 'red', at: BAT, star: true },
      r2: { kind: 'player', team: 'red', at: [14, 194] },
      r3: { kind: 'player', team: 'red', at: [28, 194] },
      r4: { kind: 'player', team: 'red', at: [42, 194] },
    },
    steps: [
      { caption: '빨강 팀은 공격, 초록 팀은 수비예요.' },
      { caption: '아웃 1개', count: { o: 1 }, hold: 900 },
      { caption: '아웃 2개', count: { o: 2 }, hold: 900 },
      {
        caption: '아웃 3개! 공격과 수비를 바꿔요.',
        sfx: 'out',
        count: { o: 3 },
      },
      {
        caption: '이제 초록 팀이 공격, 빨강 팀이 수비해요.',
        moves: {
          r1: [SPOT.P],
          r2: [SPOT.C],
          r3: [SPOT.SS],
          r4: [SPOT.CF],
          g1: [BAT],
          g2: [[186, 194]],
          g3: [[172, 194]],
          g4: [[158, 194]],
        },
        duration: 1600,
        count: { o: 0 },
      },
    ],
  },

  strikeBall: {
    view: 'zone',
    scoreboard: true,
    actors: {
      batter: { kind: 'player', team: 'red', at: [40, 108], star: true },
      ball: { kind: 'ball', at: PITCH_FROM, hidden: true },
    },
    steps: [
      {
        caption:
          '점선 네모가 스트라이크 존이에요. 가슴 높이부터 무릎 아래까지예요.',
      },
      pitch(IN_ZONE, '존 안으로 들어오면 스트라이크!', { s: 1 }),
      pitch(OUTSIDE, '존 밖으로 지나가면 볼!', { b: 1 }),
      pitch(LOW_ZONE, '휘둘렀는데 못 맞히면 헛스윙! 이것도 스트라이크예요.', {
        s: 2,
      }),
    ],
  },

  strikeoutWalk: {
    view: 'zone',
    scoreboard: true,
    actors: {
      batter: { kind: 'player', team: 'red', at: [40, 108], star: true },
      ball: { kind: 'ball', at: PITCH_FROM, hidden: true },
    },
    steps: [
      { ...pitch(IN_ZONE, '스트라이크 1개', { s: 1 }), hold: 900 },
      { ...pitch(LOW_ZONE, '스트라이크 2개', { s: 2 }), hold: 900 },
      pitch(IN_ZONE, '스트라이크 3개! 삼진 아웃', { s: 3, o: 1 }),
      {
        caption: '다음 타자예요.',
        hide: ['ball'],
        count: { b: 0, s: 0 },
        hold: 1000,
      },
      { ...pitch(OUTSIDE, '볼 1개', { b: 1 }), hold: 700 },
      { ...pitch([150, 140], '볼 2개', { b: 2 }), hold: 700 },
      { ...pitch([168, 118], '볼 3개', { b: 3 }), hold: 700 },
      pitch([156, 70], '볼 4개! 볼넷이에요.', { b: 4 }),
      {
        caption: '타자는 1루로 걸어 나가요.',
        hide: ['ball'],
        moves: { batter: [[210, 108]] },
        duration: 1400,
      },
    ],
  },

  outs: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      ss: fielder('SS'),
      cf: fielder('CF'),
      first: fielder('1B'),
      batter: { kind: 'player', team: 'red', at: BAT, star: true },
      ball: ball(),
    },
    steps: [
      {
        caption: '공을 높이 쳤어요. 중견수가 달려가요.',
        sfx: 'hit',
        arcs: { ball: 60 },
        flash: { at: [100, 44], text: '팡!', sfx: 'catch' },
        show: ['ball'],
        moves: { ball: [H, [100, 44]], cf: [[100, 44]] },
        duration: 1600,
      },
      { caption: '땅에 닿기 전에 잡았어요! 플라이 아웃', count: { o: 1 } },
      {
        caption: '이번엔 땅볼! 유격수가 잡았어요.',
        sfx: 'hit',
        flash: { at: [72, 78], text: '팡!', sfx: 'catch' },
        set: { ball: MOUND, cf: SPOT.CF },
        moves: { ball: [H, SPOT.SS], batter: [[112, 158]] },
        duration: 1100,
      },
      {
        caption: '공이 타자보다 먼저 1루에! 아웃',
        flash: { at: [150, 104], text: '아웃!', sfx: 'out' },
        zoom: { at: [146, 112], scale: 1.8 },
        moves: { ball: [SPOT['1B']], batter: [[136, 136]] },
        duration: 700,
        count: { o: 2 },
      },
    ],
  },

  hits: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      ss: fielder('SS'),
      second: fielder('2B'),
      lf: fielder('LF'),
      cf: fielder('CF'),
      rf: fielder('RF'),
      r1: { kind: 'player', team: 'red', at: BAT, star: true },
      r2: { kind: 'player', team: 'red', at: BAT, hidden: true },
      ball: ball(),
    },
    steps: [
      {
        caption: '수비가 없는 곳으로 쳤어요! 1루까지 가면 안타',
        sfx: 'hit',
        arcs: { ball: 30 },
        flash: { at: [158, 114], text: '안타!', sfx: 'safe' },
        show: ['ball'],
        moves: { ball: [H, [132, 50]], r1: [B1] },
        duration: 1600,
      },
      {
        caption: '다음 타자가 들어왔어요.',
        set: { ball: MOUND },
        show: ['r2'],
        hold: 1000,
      },
      {
        caption: '담장을 넘어갔어요. 홈런!',
        sfx: 'hit',
        arcs: { ball: 80 },
        flash: { at: [100, 30], text: '홈런!', sfx: 'cheer' },
        moves: { ball: [H, [100, -14]] },
        duration: 1400,
      },
      {
        caption: '주자와 타자 모두 홈으로! 2점',
        flash: { at: [100, 172], text: '2점!', sfx: 'cheer' },
        moves: { r1: [B2, B3, H], r2: [B1, B2, B3, H] },
        duration: 2400,
        count: { score: 2 },
      },
    ],
  },

  foul: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      c: fielder('C'),
      first: fielder('1B'),
      third: fielder('3B'),
      batter: { kind: 'player', team: 'red', at: BAT, star: true },
      ball: ball(),
    },
    steps: [
      { caption: '흰 선이 파울 라인이에요. 선 안쪽에 떨어져야 해요.' },
      {
        caption: '선 밖으로 나갔어요. 파울! 스트라이크 1개',
        sfx: 'hit',
        flash: { at: [186, 150], text: '파울!' },
        show: ['ball'],
        moves: { ball: [H, [190, 152]] },
        count: { s: 1 },
      },
      {
        caption: '또 파울! 스트라이크 2개',
        sfx: 'hit',
        flash: { at: [14, 148], text: '파울!' },
        set: { ball: MOUND },
        moves: { ball: [H, [10, 150]] },
        count: { s: 2 },
      },
      {
        caption: '스트라이크 2개일 때 파울은 세지 않아요. 그대로 2개!',
        sfx: 'hit',
        flash: { at: [186, 138], text: '파울!' },
        set: { ball: MOUND },
        moves: { ball: [H, [192, 138]] },
      },
    ],
  },

  score: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      ss: fielder('SS'),
      cf: fielder('CF'),
      runner: { kind: 'player', team: 'red', at: BAT, star: true },
    },
    steps: [
      { caption: '1루', moves: { runner: [B1] }, hold: 600 },
      { caption: '2루', moves: { runner: [B2] }, hold: 600 },
      { caption: '3루', moves: { runner: [B3] }, hold: 600 },
      {
        caption: '홈 플레이트를 밟았어요. 1점!',
        flash: { at: [100, 172], text: '1점!', sfx: 'cheer' },
        zoom: { at: [100, 160], scale: 1.6 },
        moves: { runner: [H] },
        count: { score: 1 },
      },
    ],
  },
  // ---- 중급 ----
  positions: {
    view: 'field',
    actors: {
      p: { ...fielder('P'), tag: '1 투수' },
      c: { ...fielder('C'), tag: '2 포수' },
      first: { ...fielder('1B'), tag: '3' },
      second: { ...fielder('2B'), tag: '4' },
      third: { ...fielder('3B'), tag: '5' },
      ss: { ...fielder('SS'), tag: '6' },
      lf: { ...fielder('LF'), tag: '7' },
      cf: { ...fielder('CF'), tag: '8' },
      rf: { ...fielder('RF'), tag: '9' },
      batter: star(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption:
          '수비 9명에게는 번호가 있어요. 3 1루수, 4 2루수, 5 3루수, 6 유격수.',
        hold: 2600,
      },
      {
        caption: '외야는 7 좌익수, 8 중견수, 9 우익수예요.',
        hold: 2200,
      },
      {
        caption: '유격수(6)가 땅볼을 잡았어요.',
        sfx: 'hit',
        flash: { at: [72, 78], text: '6', sfx: 'catch' },
        show: ['ball'],
        moves: { ball: [H, SPOT.SS], batter: [[114, 156]] },
        duration: 1100,
      },
      {
        caption: '1루수(3)에게 던져 아웃! 그래서 "6-3 땅볼"이라고 적어요.',
        flash: { at: [150, 104], text: '3 아웃!', sfx: 'out' },
        moves: { ball: [SPOT['1B']], batter: [[138, 134]] },
        duration: 700,
        hold: 2600,
      },
    ],
  },

  scoreboardCount: {
    view: 'zone',
    scoreboard: true,
    actors: {
      batter: star([40, 108]),
      ball: { kind: 'ball', at: PITCH_FROM, hidden: true },
    },
    steps: [
      {
        caption: '위 전광판을 보세요. B는 볼, S는 스트라이크, O는 아웃이에요.',
        hold: 2400,
      },
      { ...pitch(OUTSIDE, '볼 하나', { b: 1 }), hold: 800 },
      { ...pitch(IN_ZONE, '스트라이크 하나', { s: 1 }), hold: 800 },
      { ...pitch([150, 140], '볼 둘', { b: 2 }), hold: 800 },
      { ...pitch(LOW_ZONE, '스트라이크 둘', { s: 2 }), hold: 800 },
      pitch([158, 58], '볼 3개, 스트라이크 2개! 이걸 풀카운트라고 해요.', {
        b: 3,
      }),
    ],
  },

  lineupInning: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      ss: fielder('SS'),
      cf: fielder('CF'),
      l1: star([14, 194], { tag: '1번' }),
      l2: kid([30, 194], { tag: '2번' }),
      l3: kid([46, 194], { tag: '3번' }),
    },
    steps: [
      { caption: '타자는 정해진 순서(타순)대로 나와요.', hold: 1600 },
      { caption: '1번 타자 등장!', moves: { l1: [BAT] }, duration: 900 },
      {
        caption: '1번이 안타를 치고 1루로. 다음은 2번 타자예요.',
        sfx: 'hit',
        moves: { l1: [B1], l2: [BAT] },
        duration: 1100,
      },
      {
        caption: '2번은 아웃. 이제 3번 타자 차례예요.',
        sfx: 'out',
        moves: { l2: [[30, 194]], l3: [BAT] },
        duration: 1000,
        count: { o: 1 },
      },
      {
        caption: '9번 다음엔 다시 1번! 두 팀이 한 번씩 공격하면 1이닝이에요.',
        hold: 2600,
      },
    ],
  },

  forceTag: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      ss: fielder('SS'),
      second: fielder('2B'),
      third: fielder('3B'),
      first: fielder('1B'),
      runner: star(B1),
      batter: kid(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption: '타자가 땅볼을 쳤어요. 1루 주자는 꼭 2루로 가야 해요.',
        sfx: 'hit',
        show: ['ball'],
        moves: {
          ball: [H, SPOT.SS],
          runner: [[136, 92]],
          second: [COVER_2B],
          batter: [[110, 160]],
        },
        duration: 1100,
      },
      {
        caption: '공을 받은 수비가 2루만 밟으면 아웃! 포스 아웃이에요.',
        flash: { at: [106, 62], text: '포스 아웃!', sfx: 'out' },
        zoom: { at: [110, 70], scale: 1.8 },
        moves: { ball: [COVER_2B], runner: [[118, 72]], batter: [[124, 146]] },
        duration: 600,
        count: { o: 1 },
        hold: 2200,
      },
      {
        caption:
          '이번엔 2루 주자가 3루로 뛰어요. 꼭 가야 하는 상황이 아니에요.',
        zoom: null,
        set: { runner: B2, ball: SPOT['3B'], second: SPOT['2B'] },
        // 1루가 비어 있어야 2루 주자가 꼭 가야 하는 상황(포스)이 아니다.
        hide: ['batter'],
        moves: { runner: [[60, 96]] },
        duration: 900,
      },
      {
        caption: '이럴 땐 공 든 글러브로 몸을 터치해야 아웃! 태그 아웃이에요.',
        flash: { at: [58, 100], text: '태그 아웃!', sfx: 'out' },
        zoom: { at: [60, 104], scale: 1.8 },
        moves: { third: [[58, 100]], ball: [[58, 100]] },
        duration: 500,
        count: { o: 2 },
        hold: 2400,
      },
    ],
  },

  steal: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      c: fielder('C'),
      second: fielder('2B'),
      runner: star(B1),
      batter: kid(BAT),
      ball: ball(),
    },
    steps: [
      { caption: '1루 주자가 2루를 노려요.', hold: 1200 },
      {
        caption: '투수가 던지는 순간 출발! 도루예요.',
        show: ['ball'],
        moves: { ball: [SPOT.C], runner: [[136, 92]] },
        duration: 800,
      },
      {
        caption: '포수가 2루로 던졌지만…',
        zoom: { at: [104, 64], scale: 1.8 },
        moves: { ball: [COVER_2B], runner: [[110, 64]], second: [[112, 66]] },
        duration: 900,
      },
      {
        caption: '주자가 먼저 도착! 도루 성공',
        flash: { at: [100, 56], text: '세이프!', sfx: 'safe' },
        moves: { runner: [B2] },
        duration: 300,
        hold: 2200,
      },
    ],
  },

  hitByPitch: {
    view: 'zone',
    scoreboard: true,
    actors: {
      batter: star([40, 108]),
      ball: { kind: 'ball', at: PITCH_FROM, hidden: true },
    },
    steps: [
      { ...pitch(OUTSIDE, '볼 하나', { b: 1 }), hold: 900 },
      pitch([40, 100], '앗! 공이 몸에 맞았어요.', {}, '앗!'),
      {
        caption: '몸에 맞는 공은 1루로 걸어 나가요.',
        hide: ['ball'],
        moves: { batter: [[210, 108]] },
        duration: 1400,
      },
    ],
  },

  buntSacFly: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      c: fielder('C'),
      first: fielder('1B'),
      third: fielder('3B'),
      rf: fielder('RF'),
      runner: kid(B1),
      batter: star(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption: '방망이를 살짝 대서 공을 굴려요. 번트!',
        sfx: 'catch',
        show: ['ball'],
        moves: {
          ball: [H, [80, 150]],
          third: [[80, 148]],
          batter: [[118, 154]],
          runner: [[134, 90]],
        },
        duration: 1100,
      },
      {
        caption: '타자는 1루에서 아웃이지만 주자는 2루로! 희생 번트',
        flash: { at: [156, 112], text: '아웃!', sfx: 'out' },
        moves: {
          ball: [[156, 112]],
          batter: [[146, 124]],
          runner: [B2],
          first: [[156, 112]],
        },
        duration: 800,
        count: { o: 1 },
        hold: 2400,
      },
      {
        caption: '이번엔 3루에 주자. 타자가 멀리 뜬공을 쳤어요.',
        sfx: 'hit',
        arcs: { ball: 70 },
        flash: { at: [154, 44], text: '팡!', sfx: 'catch' },
        set: {
          runner: B3,
          batter: BAT,
          ball: MOUND,
          first: SPOT['1B'],
          third: SPOT['3B'],
        },
        moves: { ball: [H, [154, 44]], rf: [[154, 44]] },
        duration: 1500,
      },
      {
        caption: '우익수가 잡아서 아웃. 그 뒤에 3루 주자가 홈으로!',
        flash: { at: [100, 172], text: '득점!', sfx: 'cheer' },
        moves: { runner: [H], ball: [[120, 140]] },
        duration: 1300,
        count: { o: 2, score: 1 },
      },
      { caption: '아웃이 됐지만 1점을 냈어요. 희생 플라이예요.', hold: 2400 },
    ],
  },

  // ---- 고급 ----
  tagUp: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      cf: fielder('CF'),
      second: fielder('2B'),
      runner: star(B2),
      batter: kid(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption: '외야로 높은 뜬공! 2루 주자가 바로 뛰어 버렸어요.',
        sfx: 'hit',
        arcs: { ball: 70 },
        flash: { at: [100, 40], text: '팡!', sfx: 'catch' },
        show: ['ball'],
        moves: { ball: [H, [100, 40]], cf: [[100, 40]], runner: [[66, 90]] },
        duration: 1500,
      },
      {
        caption: '공이 잡혔어요. 주자는 2루로 돌아가야 해요!',
        moves: { ball: [COVER_2B], second: [COVER_2B], runner: [[86, 70]] },
        duration: 800,
      },
      {
        caption: '공이 먼저 2루에 왔어요. 주자 아웃!',
        flash: { at: [106, 62], text: '아웃!', sfx: 'out' },
        count: { o: 1 },
        hold: 2200,
      },
      {
        caption: '이번엔 잡힐 때까지 2루를 밟고 기다려요.',
        sfx: 'hit',
        arcs: { ball: 70 },
        flash: { at: [100, 40], text: '팡!', sfx: 'catch' },
        set: { runner: B2, ball: MOUND, cf: SPOT.CF, second: SPOT['2B'] },
        moves: { ball: [H, [100, 40]], cf: [[100, 40]] },
        duration: 1500,
      },
      {
        caption: '잡힌 걸 보고 출발! 3루까지 살았어요. 이게 태그업이에요.',
        flash: { at: [42, 114], text: '세이프!', sfx: 'safe' },
        moves: { runner: [B3], ball: [[60, 108]] },
        duration: 1300,
        hold: 2400,
      },
    ],
  },

  doublePlay: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      ss: fielder('SS'),
      second: fielder('2B'),
      first: fielder('1B'),
      runner: kid(B1),
      batter: star(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption: '1루에 주자가 있을 때 땅볼!',
        sfx: 'hit',
        show: ['ball'],
        moves: {
          ball: [H, SPOT.SS],
          runner: [[136, 92]],
          second: [COVER_2B],
          batter: [[110, 160]],
        },
        duration: 1000,
      },
      {
        caption: '유격수가 2루로 던져 하나!',
        flash: { at: [106, 62], text: '하나!', sfx: 'out' },
        moves: { ball: [COVER_2B], runner: [[118, 72]], batter: [[124, 146]] },
        duration: 600,
        count: { o: 1 },
      },
      {
        caption: '2루수가 바로 1루로 던져 둘! 병살이에요.',
        flash: { at: [150, 104], text: '둘!', sfx: 'out' },
        moves: { ball: [SPOT['1B']], batter: [[142, 128]] },
        duration: 700,
        count: { o: 2 },
        hold: 2400,
      },
    ],
  },

  droppedThird: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      c: fielder('C'),
      first: fielder('1B'),
      batter: star(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption: '스트라이크 2개. 1루는 비어 있어요.',
        count: { s: 2 },
        hold: 1500,
      },
      {
        caption: '헛스윙 삼진! 그런데 포수가 공을 놓쳤어요.',
        flash: { at: [120, 192], text: '놓쳤다!', sfx: 'catch' },
        zoom: { at: [110, 180], scale: 1.6 },
        show: ['ball'],
        moves: { ball: [H, [126, 198]] },
        duration: 900,
        count: { s: 3 },
      },
      {
        caption: '이럴 땐 타자가 1루로 뛸 수 있어요!',
        zoom: null,
        moves: { batter: [[142, 130]], c: [[124, 196]] },
        duration: 1000,
      },
      {
        caption: '공보다 먼저 1루에 닿으면 살아요. 스트라이크 낫아웃!',
        flash: { at: [158, 114], text: '세이프!', sfx: 'safe' },
        moves: { batter: [B1], ball: [[150, 120]] },
        duration: 800,
        hold: 2400,
      },
    ],
  },

  infieldFly: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      ss: fielder('SS'),
      second: fielder('2B'),
      r1: kid(B1),
      r2: kid(B2),
      batter: star(BAT),
      ball: ball(),
    },
    steps: [
      { caption: '노아웃, 주자 1·2루예요.', hold: 1500 },
      {
        caption: '내야에 높이 뜬 공! 쉽게 잡을 수 있어요.',
        sfx: 'hit',
        arcs: { ball: 70 },
        show: ['ball'],
        moves: { ball: [H, [86, 82]], ss: [[86, 84]] },
        duration: 1500,
      },
      {
        caption: '심판: "인필드 플라이!" 타자는 바로 아웃이에요.',
        flash: { at: [86, 84], text: '아웃!', sfx: 'out' },
        count: { o: 1 },
        hold: 2200,
      },
      {
        caption:
          '일부러 떨어뜨려 병살을 노리는 걸 막는 규칙이라, 주자는 그대로 있어도 돼요.',
        hold: 2800,
      },
    ],
  },

  balk: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: { ...fielder('P'), star: true },
      c: fielder('C'),
      first: fielder('1B'),
      runner: kid(B1),
      batter: kid(BAT),
    },
    steps: [
      { caption: '1루에 주자가 있어요. 투수가 던질 준비를 해요.', hold: 1400 },
      {
        caption: '던지는 척하다가 멈췄어요!',
        zoom: { at: [100, 118], scale: 2 },
        moves: {
          p: [
            [104, 124],
            [98, 116],
            [100, 118],
          ],
        },
        duration: 900,
      },
      {
        caption: '심판: "보크!" 규칙에 어긋난 동작이에요.',
        flash: { at: [100, 118], text: '보크!', sfx: 'out' },
        hold: 1800,
      },
      {
        caption: '주자는 한 베이스씩 나아가요.',
        zoom: null,
        flash: { at: [100, 56], text: '진루!', sfx: 'safe' },
        moves: { runner: [B2] },
        duration: 1200,
        hold: 2200,
      },
    ],
  },

  relay: {
    view: 'field',
    actors: {
      lf: fielder('LF'),
      ss: fielder('SS'),
      c: fielder('C'),
      runner: star(B2),
      ball: ball([24, 30]),
    },
    steps: [
      {
        caption: '공이 왼쪽 담장 앞까지 굴러갔어요.',
        show: ['ball'],
        moves: { lf: [[26, 34]], ss: [[58, 70]], runner: [B3] },
        duration: 1300,
      },
      {
        caption: '좌익수가 중간에 있는 유격수에게!',
        flash: { at: [58, 70], text: '중계!', sfx: 'catch' },
        moves: { ball: [[58, 70]], runner: [[58, 128]] },
        duration: 700,
      },
      {
        caption: '유격수가 받아서 바로 홈으로! 중계 플레이',
        flash: { at: [100, 190], text: '팡!', sfx: 'catch' },
        moves: { ball: [SPOT.C], runner: [[80, 156]] },
        duration: 700,
      },
      {
        caption: '짧게 두 번 던지는 게 길게 한 번보다 빠르고 정확해요.',
        hold: 2400,
      },
    ],
  },

  pitcherCare: {
    view: 'field',
    actors: {
      p: { kind: 'player', team: 'green', at: MOUND },
      c: fielder('C'),
      relief: { kind: 'player', team: 'green', at: [190, 194] },
      coach: { kind: 'player', team: 'green', star: true, at: [176, 194] },
      ball: ball(),
    },
    steps: [
      {
        caption: '투수가 공을 많이 던졌어요.',
        flash: { at: [100, 190], text: '팡!', sfx: 'catch' },
        show: ['ball'],
        moves: { ball: [SPOT.C] },
        duration: 600,
        hold: 600,
      },
      {
        caption: '어린 선수는 하루에 던질 수 있는 공 개수가 정해져 있어요.',
        set: { ball: MOUND },
        moves: { ball: [SPOT.C] },
        duration: 600,
        hold: 1800,
      },
      {
        caption: '감독님이 마운드에 올라와요.',
        hide: ['ball'],
        moves: { coach: [[114, 124]] },
        duration: 1300,
      },
      {
        caption: '수고했어! 다른 투수와 바꾸고, 정해진 날만큼 쉬어요.',
        sfx: 'cheer',
        moves: { p: [[190, 194]], relief: [MOUND], coach: [[176, 194]] },
        duration: 1600,
        hold: 2600,
      },
    ],
  },
  // ---- 추가 규칙 ----
  safeOut: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      ss: fielder('SS'),
      first: fielder('1B'),
      batter: star(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption: '땅볼! 타자는 1루로, 유격수가 공을 잡았어요.',
        sfx: 'hit',
        show: ['ball'],
        moves: {
          ball: [H, SPOT.SS],
          batter: [[122, 148]],
          first: [[156, 110]],
        },
        duration: 1000,
      },
      {
        caption: '타자가 공보다 먼저 1루에 닿았어요. 세이프!',
        moves: { ball: [[154, 112]], batter: [B1] },
        duration: 650,
        zoom: { at: [152, 114], scale: 1.8 },
        flash: { at: B1, text: '세이프!', sfx: 'safe' },
      },
      {
        caption: '공이 먼저 왔다면 아웃이었어요. 똑같이 닿으면 세이프로 봐요.',
        hold: 2600,
      },
    ],
  },

  runToFirst: {
    view: 'field',
    actors: {
      p: fielder('P'),
      lf: fielder('LF'),
      batter: star(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption: '치면 방망이는 내려놓고 1루로 힘껏 달려요!',
        sfx: 'hit',
        show: ['ball'],
        arcs: { ball: 25 },
        moves: { ball: [H, [66, 56]], batter: [B1, [184, 96]] },
        duration: 1600,
      },
      {
        caption: '1루는 지나쳐 달려도 괜찮아요. 바로 돌아오면 돼요.',
        moves: { batter: [B1] },
        duration: 800,
        flash: { at: B1, text: '세이프!', sfx: 'safe' },
      },
    ],
  },

  timeDead: {
    view: 'field',
    actors: {
      p: fielder('P'),
      c: fielder('C'),
      runner: kid(B1),
      batter: star(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption: '친 공이 경기장 밖으로 나갔어요. 볼데드!',
        sfx: 'hit',
        show: ['ball'],
        arcs: { ball: 40 },
        moves: { ball: [H, [196, 150]], runner: [[132, 88]] },
        duration: 1200,
        flash: { at: [180, 150], text: '볼데드', sfx: 'out' },
      },
      {
        caption: '볼데드일 때는 경기가 멈춰요. 주자는 원래 베이스로!',
        hide: ['ball'],
        moves: { runner: [B1] },
        duration: 900,
      },
      {
        caption: '심판이 "플레이"를 외치면 다시 시작해요.',
        flash: { at: [100, 140], text: '플레이!', sfx: 'safe' },
      },
    ],
  },

  manners: {
    view: 'field',
    actors: {
      r1: star([14, 194]),
      r2: kid([28, 194]),
      r3: kid([42, 194]),
      g1: { kind: 'player', team: 'green', at: [186, 194] },
      g2: { kind: 'player', team: 'green', at: [172, 194] },
      g3: { kind: 'player', team: 'green', at: [158, 194] },
    },
    steps: [
      {
        caption: '경기 전, 두 팀이 홈 플레이트 앞에 줄을 서요.',
        moves: {
          r1: [[86, 158]],
          r2: [[74, 146]],
          r3: [[62, 134]],
          g1: [[114, 158]],
          g2: [[126, 146]],
          g3: [[138, 134]],
        },
        duration: 1500,
      },
      {
        caption: '서로 마주 보고 "잘 부탁합니다!" 하고 인사해요.',
        flash: { at: [100, 140], text: '인사!', sfx: 'cheer' },
      },
      {
        caption: '심판 판정은 존중하고, 끝나면 상대 팀에게도 박수를 쳐 줘요.',
        flash: { at: [100, 140], text: '짝짝짝!', sfx: 'cheer' },
        hold: 2400,
      },
    ],
  },

  error: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      ss: fielder('SS'),
      first: fielder('1B'),
      batter: star(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption: '쉬운 땅볼이에요. 유격수가 잡았어요.',
        sfx: 'hit',
        show: ['ball'],
        moves: { ball: [H, SPOT.SS], batter: [[120, 150]] },
        duration: 1000,
      },
      {
        caption: '앗, 1루로 던진 공이 빗나갔어요!',
        moves: { ball: [[176, 140]], batter: [B1] },
        duration: 700,
        flash: { at: [172, 138], text: '실책!', sfx: 'out' },
      },
      {
        caption: '그 틈에 2루까지! 이건 안타가 아니라 실책으로 기록해요.',
        moves: { batter: [B2] },
        duration: 1000,
        flash: { at: B2, text: '세이프!', sfx: 'safe' },
      },
    ],
  },

  pickoff: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      first: { ...fielder('1B'), at: [160, 108] },
      runner: star([144, 100]),
      batter: kid(BAT),
      ball: { kind: 'ball', at: MOUND },
    },
    steps: [
      { caption: '1루 주자가 베이스에서 멀리 떨어져 있어요.', hold: 1500 },
      {
        caption: '투수가 갑자기 1루로 던졌어요. 견제구!',
        moves: { ball: [[158, 110]], runner: [[152, 108]] },
        duration: 500,
        zoom: { at: [154, 110], scale: 1.8 },
      },
      {
        caption: '주자가 돌아오기 전에 태그! 아웃',
        flash: { at: [152, 108], text: '아웃!', sfx: 'out' },
        count: { o: 1 },
      },
    ],
  },

  wildPitch: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      c: fielder('C'),
      runner: star(B3),
      batter: kid(BAT),
      ball: { kind: 'ball', at: MOUND },
    },
    steps: [
      { caption: '3루에 주자가 있어요.', hold: 1200 },
      {
        caption: '투수의 공이 크게 빠졌어요. 폭투!',
        moves: { ball: [H, [70, 198]], c: [[82, 196]] },
        duration: 900,
        flash: { at: [74, 194], text: '폭투!', sfx: 'catch' },
      },
      {
        caption:
          '그 사이 3루 주자가 홈으로! 포수가 잡을 공을 놓친 거면 포일이에요.',
        moves: { runner: [H] },
        duration: 1000,
        count: { score: 1 },
        flash: { at: H, text: '득점!', sfx: 'cheer' },
      },
    ],
  },

  squeeze: {
    view: 'field',
    scoreboard: true,
    actors: {
      p: fielder('P'),
      c: fielder('C'),
      third: fielder('3B'),
      runner: star(B3),
      batter: kid(BAT),
      ball: { kind: 'ball', at: MOUND },
    },
    steps: [
      { caption: '3루에 주자가 있어요. 작전은 스퀴즈!', hold: 1500 },
      {
        caption: '투수가 던지자마자 주자는 홈으로, 타자는 번트!',
        sfx: 'catch',
        moves: { ball: [H, [114, 150]], runner: [[72, 144]] },
        duration: 900,
      },
      {
        caption: '공을 잡는 사이 홈인! 1점을 냈어요.',
        moves: { runner: [H], p: [[112, 148]] },
        duration: 800,
        count: { score: 1 },
        flash: { at: H, text: '득점!', sfx: 'cheer' },
      },
    ],
  },

  appeal: {
    view: 'field',
    scoreboard: true,
    actors: {
      second: fielder('2B'),
      cf: fielder('CF'),
      runner: star(B1),
      ball: { kind: 'ball', at: [100, 30], hidden: true },
    },
    steps: [
      {
        caption: '주자가 2루를 안 밟고 지나갔어요!',
        moves: { runner: [[114, 66], B3] },
        duration: 1600,
        zoom: { at: [104, 62], scale: 1.6 },
      },
      {
        caption: '수비가 공을 들고 2루를 밟으며 심판에게 알려요. 어필!',
        zoom: null,
        show: ['ball'],
        moves: { ball: [COVER_2B], second: [COVER_2B] },
        duration: 900,
      },
      {
        caption: '베이스를 안 밟았으니 주자는 아웃!',
        flash: { at: COVER_2B, text: '아웃!', sfx: 'out' },
        count: { o: 1 },
      },
    ],
  },

  triplePlay: {
    view: 'field',
    scoreboard: true,
    actors: {
      third: fielder('3B'),
      second: fielder('2B'),
      first: fielder('1B'),
      r1: kid(B1),
      r2: kid(B2),
      batter: star(BAT),
      ball: ball(),
    },
    steps: [
      {
        caption: '노아웃, 주자 1·2루. 3루 쪽 땅볼!',
        sfx: 'hit',
        show: ['ball'],
        moves: {
          ball: [H, [52, 108]],
          r2: [[74, 82]],
          r1: [[132, 88]],
          batter: [[112, 160]],
        },
        duration: 1000,
      },
      {
        caption: '3루수가 잡아서 3루를 밟아 하나!',
        moves: { third: [B3], ball: [B3] },
        duration: 400,
        flash: { at: B3, text: '하나!', sfx: 'out' },
        count: { o: 1 },
      },
      {
        caption: '2루로 던져 둘!',
        moves: { ball: [COVER_2B], second: [COVER_2B], r1: [[118, 72]] },
        duration: 600,
        flash: { at: COVER_2B, text: '둘!', sfx: 'out' },
        count: { o: 2 },
      },
      {
        caption: '1루로 던져 셋! 공 하나로 아웃 3개, 삼중살이에요.',
        moves: { ball: [SPOT['1B']], batter: [[140, 130]] },
        duration: 700,
        flash: { at: [150, 104], text: '삼중살!', sfx: 'cheer' },
        count: { o: 3 },
      },
    ],
  },
};
