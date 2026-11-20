import Image from 'next/image';
import { TrainingVideoButton } from '~components/training-video';
import { GROUP_NOTES, HIGHLIGHTS } from '~content/training-videos';

// '경기' 메뉴: 경기 카드를 대회(group)끼리 묶어 최신 경기부터 보여 준다. 학년은 카드 제목에 작게 적는다.
// 누르면 사이트 안에서 그 경기 하이라이트(공격·수비 장면을 경기 순서대로)를 재생한다.
// 이긴 경기에만 "승리!" 띠를 붙이고, 나머지는 점수만 담담하게 보여 준다(전적 줄은 두지 않는다).
export function GameVideos() {
  const groups = [...new Set(HIGHLIGHTS.map(v => v.group))];

  return groups.map(group => {
    const games = HIGHLIGHTS.filter(v => v.group === group);
    return (
      <section key={group} aria-label={group} className="mt-10">
        <h2 className="flex flex-wrap items-baseline gap-x-3 font-display text-3xl">
          {group}
          {GROUP_NOTES[group] ? (
            <span className="font-sans text-base text-ink/60">
              {GROUP_NOTES[group]}
            </span>
          ) : null}
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {games.map(game => (
            <li key={`${game.grade}-${game.title}`} className="reveal">
              <TrainingVideoButton
                videos={game.videos}
                title={`${game.group} ${game.grade}학년 ${game.title}`}
                className="chunky group block h-full w-full overflow-hidden bg-white text-left transition-transform duration-200 hover:-translate-y-1"
              >
                <span className="relative block">
                  <Image
                    src={game.videos[0].poster}
                    alt=""
                    sizes="(min-width: 640px) 320px, 50vw"
                    className="skeleton aspect-video w-full border-ink border-b-[3px] object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 grid place-items-center bg-ink/15"
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-white/90 pl-1 text-stitch text-xl shadow-[0_3px_0_rgb(0_0_0/0.25)] transition-transform group-hover:scale-110 sm:size-12 sm:text-2xl">
                      ▶
                    </span>
                  </span>
                  <span className="absolute top-1.5 left-1.5 rounded-lg bg-sun px-2 py-0.5 font-display text-ink text-xs sm:text-sm">
                    하이라이트
                  </span>
                </span>
                <ScoreBand us={game.score.us} them={game.score.them} />
                <span className="block p-2.5 font-display text-sm leading-snug sm:p-3 sm:text-lg">
                  <span className="text-dirt">{game.grade}학년</span>{' '}
                  {game.title}
                  <span className="mt-0.5 block font-sans text-ink/60 text-xs sm:text-sm">
                    공격 · 수비 하이라이트
                  </span>
                </span>
              </TrainingVideoButton>
            </li>
          ))}
        </ul>
      </section>
    );
  });
}

// 썸네일 아래 결과 띠. 이기면 "승리!  인헌 7 : 5"(초록), 아니면 점수만.
function ScoreBand({ us, them }: { us: number; them: number }) {
  const won = us > them;
  return (
    <span
      className={`flex items-center justify-between gap-2 border-ink border-b-[3px] px-2.5 py-1 font-display sm:px-3 ${
        won ? 'bg-[var(--color-grass)] text-white' : 'bg-chalk text-ink'
      }`}
    >
      <span className="text-lg sm:text-xl">{won ? '승리!' : ''}</span>
      <span className="tabular-nums sm:text-lg">
        인헌 {us} : {them}
      </span>
    </span>
  );
}
