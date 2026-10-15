'use client';

import { type KeyboardEvent, useId, useRef, useState } from 'react';
import { RULE_LEVELS } from '~content/learn';
import { RULE_SCENES } from '~content/rule-scenes';
import { SceneSheet } from '~features/learn/ui/SceneSheet';

const LEVEL_COLORS = ['bg-grass', 'bg-dirt', 'bg-stitch'];

// 초급·중급·고급 탭. 휴대폰에서는 탭이 화면 위에 붙어 따라온다.
export function RuleLevels() {
  const [active, setActive] = useState(0);
  // 장면 창에 띄울 규칙 제목. 한 번에 하나만 연다.
  const [open, setOpen] = useState<string | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const level = RULE_LEVELS[active];

  // 목록을 내려 읽다가 탭을 바꾸면 새 단계의 첫 규칙부터 보이게 올린다.
  const change = (index: number) => {
    setActive(index);
    setOpen(null);
    if ((root.current?.getBoundingClientRect().top ?? 0) < 0) {
      root.current?.scrollIntoView({ block: 'start' });
    }
  };

  const select = (index: number) => {
    change(index);
    tabs.current[index]?.focus();
  };

  // 탭 사이는 좌우 화살표로 옮긴다(WAI-ARIA 탭 패턴).
  const onKeyDown = (e: KeyboardEvent) => {
    const last = RULE_LEVELS.length - 1;
    if (e.key === 'ArrowRight') select(active === last ? 0 : active + 1);
    else if (e.key === 'ArrowLeft') select(active === 0 ? last : active - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={root} className="scroll-mt-2">
      <div className="sticky top-0 z-10 -mx-4 bg-chalk/95 px-4 py-2 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-none">
        <div
          role="tablist"
          aria-label="규칙 단계"
          onKeyDown={onKeyDown}
          className="grid grid-cols-3 gap-2"
        >
          {RULE_LEVELS.map((l, index) => (
            <button
              key={l.key}
              ref={el => {
                tabs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${l.key}`}
              aria-selected={index === active}
              aria-controls={`${id}-panel`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => change(index)}
              className={`min-h-12 rounded-2xl border-[3px] border-ink px-2 py-1.5 text-center transition-transform ${
                index === active
                  ? `${LEVEL_COLORS[index]} text-white shadow-[0_4px_0_var(--color-ink)]`
                  : 'bg-white text-ink'
              }`}
            >
              <span className="block font-display text-xl sm:text-2xl">
                {l.label}
              </span>
              {/* 휴대폰은 탭을 얇게 두고 설명은 아래 한 줄로 보여 준다. */}
              <span
                className={`hidden text-sm sm:block ${index === active ? 'text-white/90' : 'text-ink/60'}`}
              >
                {l.who}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${level.key}`}
        className="mt-2 sm:mt-4"
      >
        <p className="mb-3 font-display text-ink/70 text-lg sm:hidden">
          {level.label}: {level.who}
        </p>
        {/* 카드 높이를 줄마다 맞추고 버튼은 늘 카드 맨 아래에 둔다. */}
        <ol
          key={level.key}
          className="grid animate-rise gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        >
          {level.rules.map((rule, index) => {
            const scene = 'scene' in rule ? RULE_SCENES[rule.scene] : null;
            return (
              <li
                key={rule.title}
                className="chunky flex flex-col bg-white p-4 sm:p-5"
              >
                <h3 className="flex items-center gap-3 font-display text-xl leading-snug">
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-full text-lg text-white ${LEVEL_COLORS[active]}`}
                  >
                    {index + 1}
                  </span>
                  {rule.title}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed">{rule.text}</p>
                <div className="mt-4 flex gap-2">
                  {scene ? (
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={() => setOpen(rule.title)}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-sun px-3 font-display text-lg shadow-[0_3px_0_#a07a1e] active:translate-y-0.5"
                    >
                      <span aria-hidden="true">▶</span> 장면 보기
                    </button>
                  ) : null}
                </div>
                {scene && open === rule.title ? (
                  <SceneSheet
                    title={rule.title}
                    scene={scene}
                    onClose={() => setOpen(null)}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
