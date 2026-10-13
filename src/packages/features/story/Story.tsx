import { ALUMNI, HISTORY, MIDDLE_SCHOOLS, SOURCES } from '~content/history';
import { COACH } from '~content/site';

export function Story() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-4xl text-board sm:text-5xl">
        야구부 이야기
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed">
        인헌초 야구부는 1980년 서울 관악구 낙성대 근처 인헌초등학교에서
        시작했습니다. 지금은 {COACH.name} {COACH.title}님과 함께 운동장을 지키고
        있습니다.
      </p>

      <section aria-labelledby="history-title" className="mt-14">
        <h2 id="history-title" className="font-display text-2xl text-board">
          걸어온 길
        </h2>
        <ol className="mt-6 border-board/25 border-l-2">
          {HISTORY.map(entry => (
            <li key={entry.year} className="relative pb-8 pl-6 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[7px] size-3 rounded-full bg-stitch"
              />
              <p className="font-display text-2xl text-board tabular-nums">
                {entry.year}
              </p>
              <p className="mt-1 max-w-xl leading-relaxed">{entry.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="alumni-title" className="mt-14">
        <h2 id="alumni-title" className="font-display text-2xl text-board">
          인헌초 출신 프로야구 선수
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed">
          이 운동장에서 처음 글러브를 낀 선배들이 프로 무대에서 뛰었습니다.
        </p>
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
      </section>

      <section aria-labelledby="next-title" className="mt-14">
        <h2 id="next-title" className="font-display text-2xl text-board">
          졸업 후에도 야구를 이어 간 학교
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed">
          {MIDDLE_SCHOOLS.join(', ')} 야구부로 진학했습니다.
        </p>
      </section>

      <section aria-labelledby="sources-title" className="mt-14 text-sm">
        <h2 id="sources-title" className="font-semibold text-ink/70">
          참고한 자료
        </h2>
        <ul className="mt-2 space-y-1">
          {SOURCES.map(source => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink/70 underline underline-offset-2"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
