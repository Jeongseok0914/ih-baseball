'use client';

import { useState } from 'react';

// 반 단톡방으로 퍼뜨리기 쉽게 휴대폰 기본 공유 창을 연다. 공유 창이 없는 PC는 주소를 복사한다.
export function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      // 사용자가 공유 창을 닫으면 AbortError 로 끝난다. 할 일이 없다.
      await navigator.share({ title, text, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-14 items-center gap-2 rounded-2xl border-[3px] border-white px-5 font-display text-white text-xl transition-transform hover:-translate-y-0.5 active:translate-y-1"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" />
      </svg>
      <span aria-live="polite">
        {copied ? '주소를 복사했어요' : '친구에게 알리기'}
      </span>
    </button>
  );
}
