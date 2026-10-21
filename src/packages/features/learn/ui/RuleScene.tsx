'use client';

import { useEffect, useRef, useState } from 'react';
import { CharacterFace, CoachCharacter } from '~components/team-character';
import type { Pos, Scene, SceneStep } from '~content/rule-scenes';
import {
  bob,
  cameraTransform,
  lift,
  moveAlong,
  place,
  wait,
  zoomTo,
} from '~features/learn/motion';
import {
  playSfx,
  startPlaybackSession,
  stopPlaybackSession,
} from '~features/learn/sfx';
import {
  canSpeak,
  readVoiceOn,
  saveVoiceOn,
  speak,
  stopSpeaking,
} from '~features/learn/speech';
import { FieldBackground } from '~features/learn/ui/FieldBackground';

type Count = Required<NonNullable<SceneStep['count']>>;
const EMPTY: Count = { b: 0, s: 0, o: 0, score: 0 };
const TEAM_COLOR = { red: 'var(--color-stitch)', green: 'var(--color-grass)' };

// 감독님(주인공)의 방망이는 청룡언월도: 붉은 자루, 금 장식, 초승달 칼날과 술.
// 자루 끝(0,0)을 축으로 위(-y)를 향해 그리고, 휘두를 때 이 축으로 돈다.
function Glaive({ length: L }: { length: number }) {
  return (
    <>
      <rect
        x="-1.1"
        y={-L}
        width="2.2"
        height={L}
        rx="1"
        fill="#8b1d1d"
        stroke="var(--color-ink)"
        strokeWidth="0.5"
      />
      <rect
        x="-1.8"
        y={-L * 0.82}
        width="3.6"
        height="2.2"
        fill="var(--color-gold)"
      />
      <path
        d={`M-1 ${-L + 1} C-11 ${-L - 1} -12 ${-L - 13} 1 ${-L - 18} C-4 ${-L - 11} -3 ${-L - 6} 1.4 ${-L - 3} Z`}
        fill="#e8eef2"
        stroke="#2b5d8a"
        strokeWidth="0.9"
      />
      <path
        d={`M1 ${-L + 1} q4 -3 3 -7 q-2 2 -3 1 Z`}
        fill="var(--color-gold)"
      />
      <path
        d={`M0 ${-L * 0.82 + 2} q-3 4 -1 8 M0 ${-L * 0.82 + 2} q2 4 0 8`}
        stroke="var(--color-stitch)"
        strokeWidth="1.2"
        fill="none"
      />
    </>
  );
}

// 휘두를 때 남는 잔상: 칼날이 지나가는 부채꼴을 금빛으로 잠깐 칠한다.
const TRAIL_FROM = -130;
const TRAIL_TO = 80;
function SwingTrail({ length: L }: { length: number }) {
  const point = (deg: number, radius: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(radius * Math.sin(a)).toFixed(1)} ${(-radius * Math.cos(a)).toFixed(1)}`;
  };
  const inner = L * 0.45;
  const outer = L + 14;
  return (
    <path
      data-bat-trail
      d={`M${point(TRAIL_FROM, outer)} A${outer} ${outer} 0 1 1 ${point(TRAIL_TO, outer)} L${point(TRAIL_TO, inner)} A${inner} ${inner} 0 1 0 ${point(TRAIL_FROM, inner)} Z`}
      fill="var(--color-sun)"
      style={{ opacity: 0 }}
    />
  );
}

// 야구공: 흰 공에 빨간 실밥 두 줄. 반지름 10 기준으로 그리고 r 에 맞춰 줄인다.
function Baseball({ r }: { r: number }) {
  const seams = ['M-5.5 -8 Q-1 0 -5.5 8', 'M5.5 -8 Q1 0 5.5 8'];
  return (
    <g transform={`scale(${r / 10})`}>
      <circle r="10" fill="white" stroke="#c9c4ba" strokeWidth="1" />
      {seams.map(d => (
        <g key={d} fill="none" stroke="var(--color-stitch)">
          <path d={d} strokeWidth="1.1" />
          {/* 실밥 바늘땀: 같은 선 위에 짧은 가로 획을 점선으로 얹는다. */}
          <path d={d} strokeWidth="3.2" strokeDasharray="0.7 1.8" />
        </g>
      ))}
    </g>
  );
}

// 장면 속 사람과 공. 주인공은 감독님, 나머지는 아이들 얼굴이고 팀 색 동그라미 위에 올린다.
function SceneActor({
  actor,
  view,
  seed,
}: {
  actor: Scene['actors'][string];
  view: Scene['view'];
  seed: number;
}) {
  if (actor.kind === 'ball') {
    return <Baseball r={view === 'zone' ? 7 : 4} />;
  }
  if (view === 'zone') {
    // 앞에서 본 타자: 감독님 전신(발이 땅에 닿게)
    return <CoachCharacter x={-38} y={-50} width={76} height={99} />;
  }
  const r = actor.star ? 11 : 8;
  return (
    <>
      <circle
        r={r}
        fill={TEAM_COLOR[actor.team ?? 'green']}
        stroke={actor.star ? 'var(--color-sun)' : 'white'}
        strokeWidth={actor.star ? 2 : 1.2}
      />
      <CharacterFace
        face={
          actor.star
            ? { kind: 'headCoach' }
            : { kind: 'kid', grade: 2 + (seed % 5), seed }
        }
        label=""
        // 팀 색 테두리가 보이게 얼굴은 동그라미보다 조금 작게 넣는다.
        x={-r * 0.82}
        y={-r * 0.86}
        width={r * 1.64}
        height={r * 1.64}
      />
      {/* 팔과 방망이: 평소엔 숨겨 두고, 던지거나 칠 때만 잠깐 보인다(RuleScene 의 act). */}
      <g data-arm style={{ opacity: 0 }}>
        <g data-arm-swing>
          <rect
            x="-1.7"
            y={-r * 1.3}
            width="3.4"
            height={r * 1.3}
            rx="1.7"
            fill="#f3c9a1"
            stroke="var(--color-ink)"
            strokeWidth="0.6"
          />
        </g>
      </g>
      <g
        data-bat
        style={{ opacity: 0 }}
        transform={`translate(${r * 0.55} ${r * 0.15})`}
      >
        {actor.star ? <SwingTrail length={r * 3.4} /> : null}
        <g data-bat-swing>
          {actor.star ? (
            <Glaive length={r * 3.4} />
          ) : (
            <path
              d={`M-1 0 L-1.8 ${-r * 1.9} Q0 ${-r * 2.15} 1.8 ${-r * 1.9} L1 0 Z`}
              fill="#c98a4b"
              stroke="var(--color-ink)"
              strokeWidth="0.6"
            />
          )}
        </g>
      </g>
      {actor.tag ? (
        <text
          y={r + 8}
          textAnchor="middle"
          fontSize="8"
          fill="white"
          stroke="var(--color-ink)"
          strokeWidth="2.5"
          paintOrder="stroke"
          className="font-display"
        >
          {actor.tag}
        </text>
      ) : null}
    </>
  );
}

function Dots({
  label,
  on,
  max,
  color,
}: {
  label: string;
  on: number;
  max: number;
  color: string;
}) {
  return (
    <span className="flex items-center gap-1">
      <span className="w-3 font-display">{label}</span>
      {Array.from({ length: max }, (_, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: 고정 개수 점
          key={i}
          className={`size-3 rounded-full border border-white/60 ${i < on ? color : 'bg-white/15'}`}
        />
      ))}
    </span>
  );
}

const H: Pos = [100, 172];
const MOUND: Pos = [100, 118];
const dist = (a: Pos, b: Pos) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const pathLength = (from: Pos, path: readonly Pos[]) =>
  [from, ...path].reduce(
    (sum, p, i, all) => (i === 0 ? 0 : sum + dist(all[i - 1], p)),
    0
  );
// 공을 던지기 전 팔을 뒤로 젖히는 시간(ms). 공은 이만큼 늦게 출발한다.
const WINDUP = 200;

// 규칙 장면 재생기. 열리면 처음부터 재생하고, 단계마다 움직인 뒤 설명을 보여 준다.
export function RuleScene({ scene }: { scene: Scene }) {
  const nodes = useRef(new Map<string, SVGGElement>());
  // 안쪽 그룹: 뛰는 흔들림·뜬공 높이. 바깥 그룹(nodes)은 바닥 위치만 맡는다.
  const inners = useRef(new Map<string, SVGGElement>());
  const shadows = useRef(new Map<string, SVGEllipseElement>());
  const camera = useRef<SVGGElement>(null);
  const [flash, setFlash] = useState<SceneStep['flash'] & { id: number }>();
  const positions = useRef(new Map<string, Pos>());
  const run = useRef(0);
  const [caption, setCaption] = useState('');
  // 읽은 만큼(0~1) 글자를 진하게 칠해 음성과 맞춘다. 소리가 꺼져 있으면 1.
  const [spoken, setSpoken] = useState(1);
  const [count, setCount] = useState<Count>(EMPTY);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  // 설명 읽어 주기. 켜져 있으면 다 읽을 때까지 다음 단계로 넘어가지 않는다.
  const [voice, setVoice] = useState({ supported: false, on: true });
  const voiceOn = useRef(true);

  const setAt = (id: string, at: Pos) => {
    positions.current.set(id, at);
    place(nodes.current.get(id), at);
  };
  // 던지기: 몸이 공 가는 쪽으로 쏠리고 팔이 뒤에서 앞으로 돈다.
  const throwAt = (id: string, target: Pos) => {
    const from = positions.current.get(id);
    const inner = inners.current.get(id);
    const arm = inner?.querySelector<SVGGElement>('[data-arm]');
    const swing = inner?.querySelector<SVGGElement>('[data-arm-swing]');
    if (!from || !inner || !arm || !swing) return;
    const angle = Math.atan2(target[1] - from[1], target[0] - from[0]);
    const [ux, uy] = [Math.cos(angle), Math.sin(angle)];
    // 팔은 위(-y)를 향해 그려져 있으니 +90도 돌려 목표를 보게 한다.
    arm.setAttribute(
      'transform',
      `translate(${-uy * 6} ${ux * 6}) rotate(${(angle * 180) / Math.PI + 90})`
    );
    arm.animate([{ opacity: 1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], {
      duration: 650,
    });
    swing.animate(
      [
        { transform: 'rotate(170deg)' },
        { transform: 'rotate(150deg)', offset: 0.3 },
        { transform: 'rotate(-20deg)', offset: 0.55 },
        { transform: 'rotate(-30deg)' },
      ],
      { duration: 650, easing: 'ease-in' }
    );
    inner.animate(
      [
        { transform: 'translate(0px, 0px)' },
        { transform: `translate(${-ux * 2}px, ${-uy * 2}px)`, offset: 0.3 },
        { transform: `translate(${ux * 3}px, ${uy * 3}px)`, offset: 0.55 },
        { transform: 'translate(0px, 0px)' },
      ],
      { duration: 650 }
    );
  };

  // 치기: 방망이가 어깨 뒤에서 앞으로 크게 돈다.
  // 감독님(주인공)은 청룡언월도로 더 크게 휘두르고 금빛 잔상이 남는다.
  const swingBat = (id: string) => {
    const inner = inners.current.get(id);
    const bat = inner?.querySelector<SVGGElement>('[data-bat]');
    const swing = inner?.querySelector<SVGGElement>('[data-bat-swing]');
    const trail = inner?.querySelector<SVGPathElement>('[data-bat-trail]');
    if (!bat || !swing) return;
    const duration = trail ? 900 : 700;
    bat.animate(
      [{ opacity: 1 }, { opacity: 1, offset: 0.85 }, { opacity: 0 }],
      { duration }
    );
    swing.animate(
      [
        { transform: `rotate(${TRAIL_FROM}deg)` },
        { transform: `rotate(${TRAIL_FROM - 15}deg)`, offset: 0.2 },
        { transform: `rotate(${TRAIL_TO}deg)`, offset: 0.42 },
        { transform: `rotate(${TRAIL_TO + 15}deg)` },
      ],
      { duration, easing: 'ease-out' }
    );
    trail?.animate(
      [
        { opacity: 0 },
        { opacity: 0, offset: 0.22 },
        { opacity: 0.75, offset: 0.42 },
        { opacity: 0 },
      ],
      { duration }
    );
  };

  // 감독님이 맞히는 순간: 화면이 흔들리고 "쾅!"이 터진다.
  const impact = (index: number) => {
    setFlash({ at: H, text: '쾅!', id: -1 - index });
    camera.current?.animate(
      [
        { transform: 'translate(0px, 0px)' },
        { transform: 'translate(-3px, 2px)' },
        { transform: 'translate(3px, -2px)' },
        { transform: 'translate(-2px, -1px)' },
        { transform: 'translate(0px, 0px)' },
      ],
      { duration: 300, composite: 'add' }
    );
  };

  // 공이 출발하는 자리에 서 있는 선수(투수·수비)를 찾는다.
  const playerAt = (at: Pos, range = 9) =>
    Object.entries(scene.actors).find(([id, actor]) => {
      const pos = positions.current.get(id);
      const visible = nodes.current.get(id)?.style.opacity !== '0';
      return (
        actor.kind === 'player' && visible && pos && dist(pos, at) <= range
      );
    })?.[0];

  const setVisible = (id: string, visible: boolean) => {
    const el = nodes.current.get(id);
    if (el) el.style.opacity = visible ? '1' : '0';
  };

  const play = async () => {
    const token = ++run.current;
    const alive = () => token === run.current;
    stopSpeaking();
    setDone(false);
    setCaption('');
    setCount(EMPTY);
    setFlash(undefined);
    zoomTo(camera.current, cameraTransform(null), 0);
    for (const [id, actor] of Object.entries(scene.actors)) {
      setAt(id, actor.at);
      setVisible(id, !actor.hidden);
    }
    await wait(400);

    for (const [index, s] of scene.steps.entries()) {
      if (!alive()) return;
      setStep(index);
      for (const [id, at] of Object.entries(s.set ?? {})) setAt(id, at);
      for (const id of s.show ?? []) setVisible(id, true);
      for (const id of s.hide ?? []) setVisible(id, false);
      setFlash(undefined);
      if (s.zoom !== undefined) {
        zoomTo(
          camera.current,
          cameraTransform(s.zoom?.at ?? null, s.zoom?.scale)
        );
      }
      const duration = s.duration ?? 1200;
      // 공이 누군가의 손에서 출발하면 그 선수가 던지고, 투구가 홈을 지나며 맞으면 타자가 친다.
      const ballId = Object.keys(s.moves ?? {}).find(
        id => scene.actors[id].kind === 'ball'
      );
      let thrown = false;
      // 타자가 친 순간(ms). 주자·수비는 공이 맞은 뒤에 움직이기 시작한다.
      let contact = 0;
      if (ballId && scene.view === 'field') {
        const from = positions.current.get(ballId) ?? scene.actors[ballId].at;
        const path = s.moves?.[ballId] ?? [];
        const thrower = playerAt(from);
        if (thrower && path[0]) {
          throwAt(thrower, path[0]);
          thrown = true;
        }
        const hitAt = path.findIndex(p => dist(p, H) < 3);
        const batter = playerAt([86, 170], 14);
        if (s.sfx === 'hit' && hitAt === 0 && batter && dist(from, MOUND) < 4) {
          const toPlate = dist(from, H) / pathLength(from, path);
          contact = (thrown ? WINDUP : 0) + duration * toPlate;
          const star = scene.actors[batter].star;
          // 언월도는 더 크게 휘두르니 조금 일찍 시작한다.
          window.setTimeout(
            () => swingBat(batter),
            contact - (star ? 380 : 160)
          );
          if (star) window.setTimeout(() => impact(index), contact);
        }
      }
      if (s.sfx && voiceOn.current && !thrown) playSfx(s.sfx);
      if (s.sfx === 'hit' && thrown && voiceOn.current) {
        // 방망이에 맞는 순간에 "딱" 소리가 나게 늦춘다.
        const path = s.moves?.[ballId ?? ''] ?? [];
        const from = positions.current.get(ballId ?? '') ?? MOUND;
        const toPlate = dist(from, H) / pathLength(from, path);
        window.setTimeout(() => playSfx('hit'), WINDUP + duration * toPlate);
      } else if (s.sfx && thrown && voiceOn.current) {
        playSfx(s.sfx);
      }
      await Promise.all(
        Object.entries(s.moves ?? {}).map(async ([id, path]) => {
          if (id === ballId && thrown) await wait(WINDUP);
          if (id !== ballId && contact) await wait(contact);
          const from = positions.current.get(id) ?? scene.actors[id].at;
          const end = path[path.length - 1];
          if (end) positions.current.set(id, end);
          const isBall = scene.actors[id].kind === 'ball';
          const height = s.arcs?.[id] ?? 0;
          const shadow = shadows.current.get(id);
          if (isBall) {
            // 친 공은 맞은 뒤부터 떠오른다. 투구 구간은 땅 높이로 온다.
            const afterHit = contact ? contact - (thrown ? WINDUP : 0) : 0;
            if (afterHit > 0) {
              window.setTimeout(
                () => lift(inners.current.get(id), height, duration - afterHit),
                afterHit
              );
            } else lift(inners.current.get(id), height, duration);
            if (shadow) shadow.style.opacity = height ? '0.35' : '0';
          } else {
            bob(inners.current.get(id), duration);
          }
          await moveAlong(
            nodes.current.get(id),
            from,
            path,
            duration,
            isBall ? 'linear' : 'ease-in-out'
          );
          if (shadow) shadow.style.opacity = '0';
        })
      );
      if (!alive()) return;
      if (s.flash) {
        setFlash({ ...s.flash, id: index });
        if (s.flash.sfx && voiceOn.current) playSfx(s.flash.sfx);
      }
      setSpoken(voiceOn.current ? 0 : 1);
      setCaption(s.caption);
      const next = s.count;
      if (next) setCount(c => ({ ...c, ...next }));
      await Promise.all([
        wait(s.hold ?? 1800),
        voiceOn.current ? speak(s.caption, setSpoken) : null,
      ]);
    }
    if (alive()) setDone(true);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: 열릴 때 한 번 재생하고 닫히면 멈춘다
  useEffect(() => {
    voiceOn.current = readVoiceOn();
    if (voiceOn.current) startPlaybackSession();
    setVoice({ supported: canSpeak(), on: voiceOn.current });
    play();
    return () => {
      run.current++;
      stopSpeaking();
      stopPlaybackSession();
    };
  }, []);

  const toggleVoice = () => {
    const on = !voiceOn.current;
    voiceOn.current = on;
    saveVoiceOn(on);
    setVoice(v => ({ ...v, on }));
    if (on) {
      startPlaybackSession();
      speak(caption, setSpoken);
    } else {
      stopSpeaking();
      setSpoken(1);
    }
  };

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border-[3px] border-ink bg-ink">
      {scene.scoreboard ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 text-sm text-white">
          <Dots label="B" on={count.b} max={4} color="bg-grass" />
          <Dots label="S" on={count.s} max={3} color="bg-sun" />
          <Dots label="O" on={count.o} max={3} color="bg-stitch" />
          {count.score > 0 ? (
            <span className="ml-auto font-display text-base">
              점수 {count.score}
            </span>
          ) : null}
        </div>
      ) : null}
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="block w-full bg-grass"
      >
        {/* 카메라: 결정적인 순간에 이 그룹을 확대해 그 자리를 크게 보여 준다. */}
        <g ref={camera}>
          <FieldBackground view={scene.view} />
          {Object.entries(scene.actors).map(([id, actor], index) => (
            <g
              key={id}
              ref={el => {
                if (el) nodes.current.set(id, el);
                else nodes.current.delete(id);
              }}
              style={{
                transform: `translate(${actor.at[0]}px, ${actor.at[1]}px)`,
                opacity: actor.hidden ? 0 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {actor.kind === 'ball' ? (
                // 뜬공 그림자: 공이 높이 떠 있는 동안 바닥에 남는다.
                <ellipse
                  ref={el => {
                    if (el) shadows.current.set(id, el);
                    else shadows.current.delete(id);
                  }}
                  rx="3.5"
                  ry="1.6"
                  fill="black"
                  style={{ opacity: 0, transition: 'opacity 0.2s' }}
                />
              ) : null}
              <g
                ref={el => {
                  if (el) inners.current.set(id, el);
                  else inners.current.delete(id);
                }}
              >
                <SceneActor actor={actor} view={scene.view} seed={index} />
              </g>
            </g>
          ))}
          {flash ? (
            <g
              key={flash.id}
              transform={`translate(${flash.at[0]} ${flash.at[1] - 14})`}
            >
              <g
                className="animate-pop"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                <path
                  d="M0 -15 L5 -6 L15 -7 L8 1 L12 11 L2 6 L-6 13 L-6 3 L-15 -2 L-5 -6 Z"
                  transform={`scale(${Math.max(1.6, (flash.text.length * 10 + 14) / 30)} 1.1)`}
                  fill="var(--color-sun)"
                  stroke="var(--color-ink)"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <text
                  y="4"
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--color-ink)"
                  className="font-display"
                >
                  {flash.text}
                </text>
              </g>
            </g>
          ) : null}
        </g>
      </svg>
      <div className="bg-white px-4 py-3">
        {/* 화면 읽기 프로그램에는 문장을 한 번에, 눈에는 읽는 만큼 진하게 보여 준다. */}
        <p aria-live="polite" className="sr-only">
          {caption}
        </p>
        <p
          aria-hidden="true"
          className="min-h-14 font-display text-lg leading-snug sm:text-xl"
        >
          {caption.slice(0, Math.round(spoken * caption.length))}
          <span className="text-ink/25">
            {caption.slice(Math.round(spoken * caption.length))}
          </span>
        </p>
        <div className="mt-3 flex items-center gap-2">
          {/* 진행 막대: 지난 단계는 채운다. */}
          <ol
            aria-label={`${scene.steps.length}단계 중 ${step + 1}단계`}
            className="flex flex-1 gap-1"
          >
            {scene.steps.map((s, i) => (
              <li
                key={s.caption}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-grass' : 'bg-ink/15'}`}
              />
            ))}
          </ol>
          {voice.supported ? (
            <button
              type="button"
              onClick={toggleVoice}
              aria-pressed={voice.on}
              aria-label={voice.on ? '소리 끄기' : '소리 켜기'}
              className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-ink text-xl"
            >
              <span aria-hidden="true">{voice.on ? '🔊' : '🔇'}</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={play}
            className={`min-h-11 shrink-0 rounded-xl px-4 font-display text-lg ${done ? 'bg-sun text-ink shadow-[0_3px_0_#a07a1e]' : 'bg-ink/10 text-ink/70'}`}
          >
            다시 보기
          </button>
        </div>
      </div>
    </div>
  );
}
