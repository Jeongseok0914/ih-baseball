// 규칙 장면의 움직임 도구. SVG 요소를 CSS transform 으로 옮긴다(SVG 안에서 px = 그림 좌표).
export type Point = readonly [number, number];

const translate = ([x, y]: Point) => `translate(${x}px, ${y}px)`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

// 바로 그 자리로 옮긴다. 진행 중인 움직임은 멈춘다.
export function place(el: SVGElement | null | undefined, at: Point) {
  if (!el) return;
  for (const a of el.getAnimations()) a.cancel();
  el.style.transform = translate(at);
}

// from 에서 path 의 점들을 차례로 지나 마지막 점에 멈춘다. 움직임 줄이기 설정이면 바로 옮긴다.
export async function moveAlong(
  el: SVGElement | null | undefined,
  from: Point,
  path: readonly Point[],
  duration: number,
  easing = 'ease-in-out'
) {
  const end = path[path.length - 1];
  if (!el || !end) return;
  if (duration <= 0 || prefersReducedMotion()) {
    place(el, end);
    return;
  }
  const animation = el.animate(
    [from, ...path].map(p => ({ transform: translate(p) })),
    { duration, easing, fill: 'forwards' }
  );
  try {
    await animation.finished;
  } catch {
    return; // 다시 보기 등으로 취소됨
  }
  place(el, end);
}
