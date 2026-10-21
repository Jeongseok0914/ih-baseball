import Image from 'next/image';
import { ACHIEVEMENTS, ALUMNI, MIDDLE_SCHOOLS } from '~content/history';
import { HERO_PHOTO } from '~content/recruit';

const CHIP_STYLES = [
  'bg-grass text-white -rotate-2',
  'bg-dirt text-white rotate-2',
  'bg-sun text-ink -rotate-1',
];

// 선수단 맨 아래: 입상 기록(단체사진)을 먼저, 이어서 창단부터 이어 온 팀 역사(프로 선수, 진학 중학교).
export function Heritage() {
  return (
    <>
      <section aria-labelledby="awards-title" className="mt-16">
        <h2 id="awards-title" className="font-display text-3xl">
          입상 기록
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map(item => (
            <li
              key={item.year}
              className="chunky reveal flex items-center gap-4 bg-sun px-4 py-3"
            >
              <span className="font-display text-3xl text-dirt tabular-nums">
                {item.year}
              </span>
              <span className="font-display text-lg leading-snug">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
        {HERO_PHOTO ? (
          <Image
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="chunky reveal mt-4 aspect-[16/9] w-full object-cover"
          />
        ) : null}
      </section>

      <section aria-labelledby="heritage-title" className="mt-16">
        <h2 id="heritage-title" className="font-display text-3xl">
          1980년부터 이어 온 인헌 야구
        </h2>
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { big: '1980', small: '창단', tone: 'bg-white' },
            {
              big: `${ALUMNI.length}명`,
              small: '프로 선수 배출',
              tone: 'bg-white',
            },
            {
              big: ACHIEVEMENTS[0].year,
              small: '교육감배 준우승',
              tone: 'bg-sun',
            },
          ].map(stat => (
            <li
              key={stat.small}
              className={`chunky reveal flex flex-col items-center justify-center px-1 py-3 text-center shadow-none sm:py-5 ${stat.tone}`}
            >
              <span className="font-display text-3xl text-dirt tabular-nums sm:text-5xl">
                {stat.big}
              </span>
              <span className="mt-1 font-display text-sm leading-tight sm:text-lg">
                {stat.small}
              </span>
            </li>
          ))}
        </ul>

        <h3 className="mt-8 font-display text-2xl">
          이 운동장에서 시작한 프로 선수
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2.5">
          {ALUMNI.map((name, index) => (
            <li
              key={name}
              className={`reveal rounded-xl px-4 py-2 font-display text-lg ${CHIP_STYLES[index % CHIP_STYLES.length]}`}
            >
              {name}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-ink/75 leading-relaxed">
          졸업 후에는 {MIDDLE_SCHOOLS.join('·')} 야구부로 진학해 야구를 이어
          갔어요.
        </p>
      </section>
    </>
  );
}
