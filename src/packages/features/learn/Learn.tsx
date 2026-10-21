import { PageHero } from '~components/page-hero';
import { SPECIAL_MOVE } from '~content/rule-scenes';
import { RuleLevels } from '~features/learn/ui/RuleLevels';

export function Learn() {
  return (
    <main>
      <PageHero title="야구 교실">야구 규칙을 장면으로 쉽게 알아봐요.</PageHero>

      <div className="mx-auto max-w-5xl px-4">
        <section aria-labelledby="rules-title" className="mt-10">
          <h2 id="rules-title" className="font-display text-3xl">
            야구 규칙 쉽게 알기
          </h2>
          <p className="mt-2 text-ink/75">
            처음이면 초급부터, 경기를 볼 줄 알면 중급, 선수처럼 알고 싶으면
            고급!
          </p>
          <div className="mt-4">
            <RuleLevels />
          </div>
          <p className="mt-6 text-ink/60 text-sm">
            감독님 기술 목소리는{' '}
            <a
              href={SPECIAL_MOVE.credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {SPECIAL_MOVE.credit.label}
            </a>
            로 만들었어요.
          </p>
        </section>
      </div>
    </main>
  );
}
