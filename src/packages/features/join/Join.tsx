import { FAQ, JOIN_STEPS } from '~content/join';

export function Join() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-4xl text-board sm:text-5xl">함께하기</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed">
        야구부는 언제든 새 친구를 기다립니다. 입단을 정하기 전에 먼저 와서 해
        보세요.
      </p>

      <section aria-labelledby="steps-title" className="mt-14">
        <h2 id="steps-title" className="font-display text-2xl text-board">
          시작하는 방법
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {JOIN_STEPS.map((step, index) => (
            <li key={step.title} className="border-board border-t-4 pt-4">
              <p className="font-display text-3xl text-stitch tabular-nums">
                {index + 1}
              </p>
              <h3 className="mt-2 font-semibold text-lg">{step.title}</h3>
              <p className="mt-1 leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="faq-title" className="mt-14">
        <h2 id="faq-title" className="font-display text-2xl text-board">
          자주 묻는 질문
        </h2>
        <div className="mt-4 divide-y divide-ink/10 border-ink/10 border-y">
          {FAQ.map(item => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {item.q}
                <span
                  aria-hidden="true"
                  className="text-2xl text-stitch transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
