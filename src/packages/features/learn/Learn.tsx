import { PageHero } from '~components/page-hero';
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
        </section>
      </div>
    </main>
  );
}
