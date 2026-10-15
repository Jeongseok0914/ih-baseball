'use client';

import { useEffect, useRef, useState } from 'react';
import { CharacterFace, CoachCharacter } from '~components/team-character';
import type { Pos, Scene, SceneStep } from '~content/rule-scenes';
import { moveAlong, place, wait } from '~features/learn/motion';
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
    return (
      <circle
        r={view === 'zone' ? 7 : 3.5}
        fill="white"
        stroke="var(--color-stitch)"
        strokeWidth="1.2"
      />
    );
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

// 규칙 장면 재생기. 열리면 처음부터 재생하고, 단계마다 움직인 뒤 설명을 보여 준다.
export function RuleScene({ scene }: { scene: Scene }) {
  const nodes = useRef(new Map<string, SVGGElement>());
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
      await Promise.all(
        Object.entries(s.moves ?? {}).map(([id, path]) => {
          const from = positions.current.get(id) ?? scene.actors[id].at;
          const end = path[path.length - 1];
          if (end) positions.current.set(id, end);
          const isBall = scene.actors[id].kind === 'ball';
          return moveAlong(
            nodes.current.get(id),
            from,
            path,
            s.duration ?? 1200,
            isBall ? 'linear' : 'ease-in-out'
          );
        })
      );
      if (!alive()) return;
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
    setVoice({ supported: canSpeak(), on: voiceOn.current });
    play();
    return () => {
      run.current++;
      stopSpeaking();
    };
  }, []);

  const toggleVoice = () => {
    const on = !voiceOn.current;
    voiceOn.current = on;
    saveVoiceOn(on);
    setVoice(v => ({ ...v, on }));
    if (on) speak(caption, setSpoken);
    else {
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
            <SceneActor actor={actor} view={scene.view} seed={index} />
          </g>
        ))}
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
