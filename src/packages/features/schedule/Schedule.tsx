import { PageHero } from '~components/page-hero';
import { WEEK } from '~content/schedule';
import { TRAINING_VIDEOS } from '~content/training-videos';
import { VideoGallery } from '~features/schedule/ui/VideoGallery';

const KIND_STYLE = {
  training: 'bg-grass text-white',
  game: 'bg-sun text-ink',
  rest: 'bg-[#e8e2d6] text-ink/60 shadow-none',
};

export function Schedule() {
  return (
    <main>
      <PageHero title="훈련">
        우리 선수들이 훈련하는 모습을 영상으로 보고, 한 주 일정도 확인해요.
      </PageHero>

      <div className="mx-auto max-w-5xl px-4">
        {TRAINING_VIDEOS.length > 0 ? (
          <section aria-labelledby="videos-title" className="mt-12">
            <h2 id="videos-title" className="font-display text-3xl">
              훈련 영상
            </h2>
            <p className="mt-2 text-ink/70">
              누르면 영상이 나와요. 우리 선수들이 실제로 훈련하는 모습이에요.
            </p>
            <VideoGallery videos={TRAINING_VIDEOS} />
          </section>
        ) : null}

        <section aria-labelledby="week-title" className="mt-14">
          <h2 id="week-title" className="font-display text-3xl">
            한 주 일정
          </h2>
          {/* 휴대폰은 요일별 줄, 넓은 화면은 7칸 */}
          <ol className="mt-5 flex flex-col gap-2 sm:grid sm:grid-cols-7 sm:gap-3">
            {WEEK.map(d => (
              <li
                key={d.day}
                className={`chunky reveal flex min-h-15 items-center gap-4 px-3 py-2 sm:min-h-36 sm:flex-col sm:justify-start sm:gap-5 sm:py-4 sm:text-center ${KIND_STYLE[d.kind]}`}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/85 font-display text-ink text-xl">
                  {d.day}
                </span>
                <span className="font-display text-xl leading-tight">
                  {d.label}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-ink/70">
            훈련 시간과 연습경기 장소는 주마다 달라질 수 있어요. 감독님께 확인해
            주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
