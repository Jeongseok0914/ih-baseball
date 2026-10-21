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
  // 구간 길이에 비례해 시간을 나눠 일정한 속도로 움직인다(키프레임 기본값은 시간 균등 분할).
  const points = [from, ...path];
  const lengths = points.map((p, i) =>
    i === 0 ? 0 : Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1])
  );
  const total = lengths.reduce((a, b) => a + b, 0) || 1;
  let walked = 0;
  const animation = el.animate(
    points.map((p, i) => {
      walked += lengths[i];
      return { transform: translate(p), offset: walked / total };
    }),
    { duration, easing, fill: 'forwards' }
  );
  try {
    await animation.finished;
  } catch {
    return; // 다시 보기 등으로 취소됨
  }
  place(el, end);
}

// 뜬공: 바닥 위치는 moveAlong 이 옮기고, 이 안쪽 요소를 위로 띄웠다가 내린다(공이 가까워 보이게 커진다).
export function lift(
  el: SVGElement | null | undefined,
  height: number,
  duration: number
) {
  if (!el || height <= 0 || prefersReducedMotion()) return;
  el.animate(
    [
      { transform: 'translate(0px, 0px) scale(1)' },
      { transform: `translate(0px, ${-height}px) scale(1.8)`, offset: 0.5 },
      { transform: 'translate(0px, 0px) scale(1)' },
    ],
    { duration, easing: 'linear' }
  );
}

// 뛰는 사람: 움직이는 동안 콩콩 뛰듯 위아래로 흔든다.
export function bob(el: SVGElement | null | undefined, duration: number) {
  if (!el || duration <= 0 || prefersReducedMotion()) return;
  el.animate(
    [
      { transform: 'translateY(0px)' },
      { transform: 'translateY(-2.5px)' },
      { transform: 'translateY(0px)' },
    ],
    { duration: 260, iterations: Math.max(1, Math.round(duration / 260)) }
  );
}

// 카메라: 200×200 그림에서 at 을 가운데 두고 scale 배 확대한다. 가장자리 밖이 보이지 않게 막는다.
export const cameraTransform = (at: Point | null, scale = 1) => {
  if (!at || scale <= 1) return 'translate(0px, 0px) scale(1)';
  const clamp = (v: number) => Math.min(0, Math.max(200 - 200 * scale, v));
  return `translate(${clamp(100 - at[0] * scale)}px, ${clamp(100 - at[1] * scale)}px) scale(${scale})`;
};

export function zoomTo(
  el: SVGElement | null | undefined,
  to: string,
  duration = 700
) {
  if (!el) return;
  const from = el.style.transform || cameraTransform(null);
  el.style.transform = to;
  if (prefersReducedMotion()) return;
  el.animate([{ transform: from }, { transform: to }], {
    duration,
    easing: 'ease-in-out',
  });
}
