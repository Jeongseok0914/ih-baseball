'use client';

import { useEffect, useRef } from 'react';
import type { Scene } from '~content/rule-scenes';
import { RuleScene } from '~features/learn/ui/RuleScene';

// 규칙 장면 창. 휴대폰은 아래에서 올라오는 시트, 넓은 화면은 가운데 팝업(globals.css 의 scene-sheet).
// 브라우저 기본 <dialog> 라 Esc·뒤 화면 막기·포커스 가두기가 따라온다.
export function SceneSheet({
  title,
  scene,
  onClose,
}: {
  title: string;
  scene: Scene;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="scene-title"
      onClose={onClose}
      // 시트 바깥(어두운 배경)을 누르면 닫는다.
      onClick={e => {
        if (e.target === e.currentTarget) dialog.current?.close();
      }}
      className="scene-sheet text-ink backdrop:bg-ink/60"
    >
      <div className="bg-white px-4 pt-2 pb-[max(env(safe-area-inset-bottom),16px)] sm:p-5">
        <span
          aria-hidden="true"
          className="mx-auto mb-2 block h-1.5 w-12 rounded-full bg-ink/20 sm:hidden"
        />
        <div className="flex items-center justify-between gap-3">
          <h2 id="scene-title" className="font-display text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="닫기"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-ink/10 font-display text-2xl"
          >
            ×
          </button>
        </div>
        <RuleScene scene={scene} />
      </div>
    </dialog>
  );
}
