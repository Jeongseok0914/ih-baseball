import Link from 'next/link';
import { ScoreboardTiles, Stitches } from '~components/scoreboard';
import { ALUMNI } from '~content/history';
import { SITE } from '~content/site';

export function Home() {
  return (
    <main>
      <section aria-labelledby="hero-title" className="bg-board text-chalk">
        <div className="mx-auto max-w-4xl px-4 pt-12 pb-6 sm:pt-20">
          <h1 id="hero-title" className="flex flex-col gap-1.5 sm:gap-2">
            <ScoreboardTiles text="인헌초" />
            <ScoreboardTiles text="야구부" />
          </h1>
          <p className="mt-8 max-w-xl text-chalk/85 text-lg leading-relaxed">
            {SITE.description}
          </p>
        </div>
        <Stitches />
      </section>

      <section
        aria-labelledby="since-title"
        className="mx-auto grid max-w-4xl gap-10 px-4 py-16 sm:grid-cols-2"
      >
        <div>
          <h2 id="since-title" className="font-display text-3xl text-board">
            1980년부터 같은 운동장에서
          </h2>
          <p className="mt-4 leading-relaxed">
            40년 넘게 선배들이 공을 던지고 받던 곳에서 지금의 아이들이 야구를
            배웁니다. 처음엔 공 잡는 것도 서툴던 친구들이 한 팀이 되어 대회에
            나갑니다.
          </p>
          <Link
            href="/story"
            className="mt-5 inline-block font-semibold text-stitch underline underline-offset-4"
          >
            야구부 이야기 읽기
          </Link>
        </div>
        <div>
          <h2 className="font-display text-3xl text-board">해 보고 싶다면</h2>
          <p className="mt-4 leading-relaxed">
            야구를 몰라도 괜찮습니다. 감독님께 연락하고 훈련하는 날 운동장에
            와서 직접 해 보세요.
          </p>
          <Link
            href="/join"
            className="mt-5 inline-block font-semibold text-stitch underline underline-offset-4"
          >
            함께하는 방법 보기
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="alumni-title"
        className="border-ink/10 border-y bg-dust/30"
      >
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h2 id="alumni-title" className="font-display text-2xl text-board">
            인헌초 운동장에서 시작한 프로야구 선수들
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {ALUMNI.map(name => (
              <li
                key={name}
                className="rounded-sm bg-board px-3 py-1.5 font-semibold text-chalk"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
