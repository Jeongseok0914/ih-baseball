import Link from 'next/link';
import { CharacterFace } from '~components/team-character';
import { ACHIEVEMENTS, ALUMNI, MIDDLE_SCHOOLS } from '~content/history';
import { PLAYERS, ROSTER_SEASON } from '~content/players';
import { daysAt, PLACES } from '~content/schedule';
import { COACH, SITE, STAFF } from '~content/site';
import { YOUTUBE_CHANNEL } from '~content/youtube';
import { parseFeed, type Video } from '~features/home/youtube-feed';
import { absoluteUrl } from '~lib/seo';

const VIDEO_COUNT = 6;

// 검색엔진이 이 사이트를 '초등학교 야구팀'으로 이해하도록 돕는 구조화 데이터(schema.org).
const TEAM_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SportsTeam',
  name: SITE.fullName,
  alternateName: [SITE.name, '서울인헌초 야구부', 'Inhun Baseball Team'],
  sport: 'Baseball',
  url: absoluteUrl('/'),
  description: SITE.description,
  foundingDate: '1980',
  coach: { '@type': 'Person', name: COACH.name, jobTitle: COACH.title },
  memberOf: { '@type': 'Organization', name: '서울인헌초등학교' },
  location: {
    '@type': 'Place',
    name: PLACES.noryangjin.name,
    address: PLACES.noryangjin.address,
  },
  sameAs: [YOUTUBE_CHANNEL.url],
};

// 빌드할 때 한 번 읽는다. 실패하면 영상 목록 없이 채널 링크만 보여 준다.
async function fetchRecentVideos(): Promise<Video[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL.id}`
    );
    return res.ok ? parseFeed(await res.text(), VIDEO_COUNT) : [];
  } catch {
    return [];
  }
}

// 홈에서 각 메뉴로 바로 가는 안내. 숫자와 요일은 데이터에서 읽는다.
const GUIDE = [
  {
    href: '/team',
    title: '선수단',
    text: `${ROSTER_SEASON} 현역 라인업과 ${STAFF.map(s => `${s.name} ${s.title}님`).join(', ')}`,
    badge: '',
    tone: 'bg-white',
  },
  {
    href: '/schedule',
    title: '훈련 일정',
    text: `${daysAt('noryangjin')} ${PLACES.noryangjin.name}, ${daysAt('yeongnam')} ${PLACES.yeongnam.name}, 주말엔 연습경기`,
    badge: '월~일',
    tone: 'bg-white',
  },
  {
    href: '/join',
    title: '함께하기',
    text: `야구를 몰라도 괜찮아요. ${COACH.name} ${COACH.title}님께 연락하고 와서 해 보세요`,
    badge: '1·2·3',
    tone: 'bg-sun',
  },
];

// 선수단 카드 장식에 쓰는 아이들 얼굴 세 개.
const TEAM_FACES = PLAYERS.slice(0, 3);

const CHIP_STYLES = [
  'bg-grass text-white -rotate-2',
  'bg-dirt text-white rotate-2',
  'bg-sun text-ink -rotate-1',
];

function ChalkDiamond() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 320"
      className="absolute -right-24 -bottom-16 w-[22rem] opacity-80 sm:right-0 sm:-bottom-24 sm:w-[34rem]"
    >
      <path
        d="M200 360 L60 220 L200 80 L340 220 Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        pathLength={1}
        className="animate-draw"
      />
      <circle cx="200" cy="220" r="26" fill="#8f4b20" />
      {[
        [200, 80],
        [60, 220],
        [340, 220],
      ].map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x - 12}
          y={y - 12}
          width="24"
          height="24"
          fill="#ffffff"
          transform={`rotate(45 ${x} ${y})`}
        />
      ))}
    </svg>
  );
}

export async function Home() {
  const videos = await fetchRecentVideos();

  return (
    <main>
      <script
        type="application/ld+json"
        // 우리 데이터로 만든 JSON 이라 안전하다. '<' 만 바꿔 </script> 조기 종료를 막는다.
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(TEAM_JSON_LD).replace(/</g, '\\u003c'),
        }}
      />
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden bg-dirt text-white"
      >
        <ChalkDiamond />
        <div className="relative mx-auto max-w-5xl px-4 pt-12 pb-14 sm:pt-20 sm:pb-24">
          <p className="flex flex-wrap gap-2">
            <span className="animate-pop rotate-[-4deg] rounded-xl bg-sun [animation-delay:250ms] px-3 py-1 font-display text-ink shadow-[0_4px_0_rgb(0_0_0/0.2)] sm:text-lg">
              1980 창단
            </span>
            <span className="animate-pop rotate-[3deg] rounded-xl bg-white [animation-delay:400ms] px-3 py-1 font-display text-grass shadow-[0_4px_0_rgb(0_0_0/0.2)] sm:text-lg">
              {ACHIEVEMENTS[0].year} 교육감배 준우승
            </span>
          </p>
          <h1
            id="hero-title"
            className="mt-4 animate-rise font-display text-5xl leading-tight [text-shadow:0_4px_0_rgb(0_0_0/0.18)] sm:text-7xl"
          >
            같이 공 던질
            <br />
            친구 찾아요!
          </h1>
          <p className="mt-5 max-w-xl animate-rise text-lg leading-relaxed [animation-delay:120ms] sm:text-xl">
            {SITE.description}
          </p>
          <Link
            href="/join"
            className="mt-7 inline-flex min-h-14 animate-rise items-center rounded-2xl bg-white px-7 font-display text-dirt text-xl shadow-[0_5px_0_#6e3815] transition-transform [animation-delay:220ms] hover:-translate-y-0.5 active:translate-y-1"
          >
            체험하러 갈래요
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="alumni-title"
        className="mx-auto max-w-5xl px-4 pt-14"
      >
        <h2 id="alumni-title" className="font-display text-3xl">
          1980년부터, 프로 선수 {ALUMNI.length}명이 이 운동장에서 시작했어요
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {ALUMNI.map((name, index) => (
            <li
              key={name}
              className={`reveal rounded-xl px-4 py-2 font-display text-lg ${CHIP_STYLES[index % CHIP_STYLES.length]}`}
            >
              {name}
            </li>
          ))}
        </ul>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
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
        <p className="mt-5 text-ink/75 leading-relaxed">
          졸업 후에는 {MIDDLE_SCHOOLS.join('·')} 야구부로 진학해 야구를 이어
          갔어요.
        </p>
      </section>

      <section aria-label="둘러보기" className="mx-auto max-w-5xl px-4 pt-16">
        <ul className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {GUIDE.map(item => (
            <li key={item.href} className="reveal">
              <Link
                href={item.href}
                className={`chunky flex h-full items-center gap-4 p-4 sm:flex-col sm:items-start sm:p-5 transition-transform duration-200 hover:-translate-y-1 ${item.tone}`}
              >
                <span className="grid h-18 w-18 shrink-0 place-items-center rounded-xl bg-ink/8 font-display text-2xl text-dirt sm:h-24 sm:w-full sm:text-4xl">
                  {item.badge ? (
                    item.badge
                  ) : (
                    <span className="flex -space-x-3">
                      {TEAM_FACES.map((player, index) => (
                        <CharacterFace
                          key={player.number}
                          face={{
                            kind: 'kid',
                            grade: player.grade,
                            seed: index,
                          }}
                          label=""
                          className="size-9 rounded-full border-2 border-ink bg-sun/60 sm:size-14"
                        />
                      ))}
                    </span>
                  )}
                </span>
                <span>
                  <span className="block font-display text-2xl">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-ink/75 leading-relaxed">
                    {item.text}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="video-title"
        className="mx-auto max-w-5xl px-4 pt-16"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="video-title" className="font-display text-3xl">
            경기 영상
          </h2>
          <a
            href={YOUTUBE_CHANNEL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="chunky inline-flex min-h-12 items-center gap-2 bg-stitch px-4 font-display text-lg text-white shadow-none"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-6"
              fill="currentColor"
            >
              <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15V9l5.2 3z" />
            </svg>
            유튜브 채널 가기
          </a>
        </div>
        {videos.length > 0 ? (
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {videos.map(video => (
              <li key={video.id} className="reveal">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chunky block h-full overflow-hidden bg-white transition-transform duration-200 hover:-translate-y-1"
                >
                  {/* biome-ignore lint/performance/noImgElement: 정적 export 라 외부 썸네일은 그대로 쓴다 */}
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    width={320}
                    height={180}
                    className="skeleton aspect-video w-full border-ink border-b-[3px] object-cover"
                  />
                  <span className="block p-3">
                    <span className="line-clamp-2 font-display leading-snug sm:text-lg">
                      {video.title}
                    </span>
                    <span className="mt-1 block text-ink/60 text-sm">
                      {video.published}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="chunky mt-5 bg-white p-5 shadow-none">
            경기 영상은 {YOUTUBE_CHANNEL.name} 유튜브 채널에서 볼 수 있어요.
          </p>
        )}
      </section>
    </main>
  );
}
