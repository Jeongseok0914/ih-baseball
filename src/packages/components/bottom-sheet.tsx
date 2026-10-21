'use client';

import { type ReactNode, useEffect, useRef } from 'react';

// 휴대폰은 아래에서 올라오는 시트, 넓은 화면은 가운데 팝업(globals.css 의 sheet).
// 브라우저 기본 <dialog> 라 Esc·뒤 화면 막기·포커스 가두기가 따라온다.
// 규칙 장면(야구 교실)과 훈련 영상이 같이 쓴다. wide 는 영상처럼 넓게 볼 때.
export function BottomSheet({
  title,
  onClose,
  wide = false,
  children,
}: {
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  // 휴대폰 시트는 아래로 쓸어내려 닫는다. 맨 위까지 올라가 있을 때만 끌리고,
  // 120px 넘게 내리거나 빠르게 튕기면 닫히고, 아니면 제자리로 돌아간다.
  // 끄는 동안 페이지가 스크롤되지 않게 passive 가 아닌 touchmove 로 막는다.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    let startY: number | null = null;
    let startAt = 0;
    let dy = 0;

    const onStart = (e: TouchEvent) => {
      if (window.matchMedia('(min-width: 640px)').matches) return;
      if (el.scrollTop > 0) return;
      startY = e.touches[0].clientY;
      startAt = performance.now();
      dy = 0;
      el.style.transition = 'none';
    };
    const onMove = (e: TouchEvent) => {
      if (startY === null) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      if (dy > 0) e.preventDefault();
      el.style.transform = dy > 0 ? `translateY(${dy}px)` : '';
    };
    const onEnd = () => {
      if (startY === null) return;
      startY = null;
      const fast = dy > 50 && dy / (performance.now() - startAt) > 0.35;
      el.style.transition = 'transform 0.2s ease-out';
      if (dy > 120 || fast) {
        el.style.transform = 'translateY(100%)';
        window.setTimeout(() => el.close(), 200);
      } else {
        el.style.transform = '';
      }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    el.addEventListener('touchcancel', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="sheet-title"
      onClose={onClose}
      // 시트 바깥(어두운 배경)을 누르면 닫는다.
      onClick={e => {
        if (e.target === e.currentTarget) dialog.current?.close();
      }}
      className={`sheet text-ink backdrop:bg-ink/60 ${wide ? 'sheet-wide' : ''}`}
    >
      <div className="bg-white px-4 pt-2 pb-[max(env(safe-area-inset-bottom),16px)] sm:p-5">
        {/* 손잡이: 아래로 쓸어내리면 닫힌다는 표시 */}
        <span
          aria-hidden="true"
          className="mx-auto mb-3 block h-1.5 w-12 rounded-full bg-ink/25 sm:hidden"
        />
        <div className="flex items-center justify-between gap-3">
          <h2 id="sheet-title" className="font-display text-2xl">
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
        {children}
      </div>
    </dialog>
  );
}
