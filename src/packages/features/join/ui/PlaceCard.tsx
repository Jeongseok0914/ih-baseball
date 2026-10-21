import Image from 'next/image';
import type { Place } from '~content/schedule';

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

export function PlaceCard({ place, days }: { place: Place; days: string }) {
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
