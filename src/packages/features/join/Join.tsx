import { PageHero } from '~components/page-hero';
import { FAQ, JOIN_STEPS } from '~content/join';

const STEP_COLORS = ['bg-grass', 'bg-dirt', 'bg-ink'];

export function Join() {
  return (
    <main>
      <PageHero title="함께하기">
        입단을 정하기 전에 먼저 와서 해 보세요. 야구부는 언제든 새 친구를
        기다려요.
      </PageHero>

      <div className="mx-auto max-w-5xl px-4">
        <section aria-labelledby="steps-title" className="mt-14">
          <h2 id="steps-title" className="font-display text-3xl">
            시작하는 방법
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {JOIN_STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`chunky flex gap-4 p-4 sm:block sm:p-6 ${
                  index === JOIN_STEPS.length - 1 ? 'bg-sun' : 'bg-white'
                }`}
              >
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-full font-display text-2xl text-white sm:size-14 ${STEP_COLORS[index % STEP_COLORS.length]}`}
                >
                  {index + 1}
                </span>
                <span className="block">
                  <span className="block font-display text-xl sm:mt-4 sm:text-2xl">
                    {step.title}
                  </span>
                  <span className="mt-1 block leading-relaxed">
                    {step.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="faq-title" className="mt-14">
          <h2 id="faq-title" className="font-display text-3xl">
            자주 묻는 질문
          </h2>
          <div className="mt-5 flex flex-col gap-3">
            {FAQ.map(item => (
              <details
                key={item.q}
                className="group chunky bg-white px-5 py-4 shadow-none"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg sm:text-xl">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-sun text-xl transition-transform group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
