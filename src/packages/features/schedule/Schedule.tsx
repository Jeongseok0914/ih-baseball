import Image from 'next/image';
import { PageHero } from '~components/page-hero';
import { daysAt, PLACES, type Place, WEEK } from '~content/schedule';

const KIND_STYLE = {
  training: 'bg-grass text-white',
  game: 'bg-sun text-ink',
  rest: 'bg-[#e8e2d6] text-ink/60 shadow-none',
};

const mapHref = (place: Place) =>
  `https://map.naver.com/p/search/${encodeURIComponent(place.mapQuery ?? place.address)}`;

// 사진이 없는 장소는 같은 비율의 백묵 다이아몬드 그림으로 채워 카드 높이를 맞춘다.
function FieldIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-video overflow-hidden border-ink border-b-[3px] bg-grass"
    >
      <svg viewBox="0 0 320 180" className="absolute inset-0 size-full">
        <path d="M160 200 L70 110 L160 20 L250 110 Z" fill="#a65a2a" />
        <path d="M160 170 L100 110 L160 50 L220 110 Z" fill="#367a48" />
        <path
          d="M160 200 L40 80 M160 200 L280 80"
          stroke="#ffffff"
          strokeWidth="3"
          opacity="0.85"
        />
        <circle cx="160" cy="112" r="12" fill="#a65a2a" />
        {[
          [160, 50],
          [100, 110],
          [220, 110],
        ].map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x - 7}
            y={y - 7}
            width="14"
            height="14"
            fill="#ffffff"
            transform={`rotate(45 ${x} ${y})`}
          />
        ))}
      </svg>
    </div>
  );
}

function PlaceCard({ place, days }: { place: Place; days: string }) {
  return (
    <article className="chunky reveal flex h-full flex-col overflow-hidden bg-white">
      {place.photo ? (
        <figure className="relative border-ink border-b-[3px]">
          <Image
            src={place.photo.src}
            alt={place.photo.alt}
            className="skeleton aspect-video w-full object-cover"
          />
          {/* 사진 파일은 손대지 않는다(공공누리 변경금지). 출처만 위에 얹는다. */}
          <figcaption className="absolute right-2 bottom-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] text-white">
            <a
              href={place.photo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              사진: {place.photo.credit}
            </a>
          </figcaption>
        </figure>
      ) : (
        <FieldIllustration />
      )}
      <div className="flex flex-1 flex-col items-start p-5">
        <span
          className={`inline-block rounded-lg px-2.5 py-0.5 font-display text-white ${days ? 'bg-grass' : 'bg-dirt'}`}
        >
          {days ? `${days}요일` : place.note}
        </span>
        <h3 className="mt-2 font-display text-2xl sm:text-3xl">{place.name}</h3>
        <p className="mt-1">{place.address}</p>
        {place.access ? <p className="text-ink/70">{place.access}</p> : null}
        <span aria-hidden="true" className="block h-4 shrink-0" />
        <a
          href={mapHref(place)}
          target="_blank"
          rel="noopener noreferrer"
          className="chunky mt-auto flex min-h-12 w-full items-center justify-center bg-sun px-5 font-display text-lg shadow-none sm:w-auto"
        >
          지도에서 보기
        </a>
      </div>
    </article>
  );
}

export function Schedule() {
  return (
    <main>
      <PageHero title="훈련 일정">
        평일엔 야구장에서 훈련하고, 주말엔 다른 팀과 연습경기를 해요. 목요일은
        쉬어요.
      </PageHero>

      <div className="mx-auto max-w-5xl px-4">
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

        <section aria-labelledby="places-title" className="mt-14">
          <h2 id="places-title" className="font-display text-3xl">
            훈련 장소
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {(Object.keys(PLACES) as (keyof typeof PLACES)[]).map(key => (
              <PlaceCard key={key} place={PLACES[key]} days={daysAt(key)} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
