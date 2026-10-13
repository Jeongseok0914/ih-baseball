import type { ReactNode } from 'react';

// 메뉴 페이지 맨 위 흙바닥 띠. 제목과 한두 줄 소개.
export function PageHero({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-dirt text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <h1 className="font-display text-4xl [text-shadow:0_3px_0_rgb(0_0_0/0.18)] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed sm:text-xl">
          {children}
        </p>
      </div>
    </section>
  );
}
