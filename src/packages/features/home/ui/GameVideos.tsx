import Image from 'next/image';
import { TrainingVideoButton } from '~components/training-video';
import { HIGHLIGHTS, videoLabel } from '~content/training-videos';
import { VIDEOS } from '~content/youtube';
import { outcome } from '~features/home/live';

const CARD =
  'chunky group block h-full w-full overflow-hidden bg-white text-left transition-transform duration-200 hover:-translate-y-1';
const THUMB =
  'skeleton aspect-video w-full border-ink border-b-[3px] object-cover';

// 홈 '경기 영상': group 이 같은 영상(예: 홍천무궁화배 6학년)끼리 제목 아래 묶는다.
// 묶음마다 그 group 의 하이라이트(사이트 안에서 재생)가 맨 앞, 유튜브 경기 영상이 뒤에 온다.
// group 이 없는 영상은 맨 아래에 제목 없이 나온다.
export function GameVideos() {
  const groups = [
    ...new Set(VIDEOS.flatMap(v => (v.group ? [v.group] : []))),
    undefined,
  ];

  return groups.map(group => {
    const highlights = group ? HIGHLIGHTS.filter(h => h.group === group) : [];
    const videos = VIDEOS.filter(v => v.group === group);
    if (highlights.length + videos.length === 0) return null;
    return (
      <div key={group ?? 'etc'} className="mt-6">
        {group ? (
          <h3 className="font-display text-2xl text-dirt">{group}</h3>
        ) : null}
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {highlights.map(video => (
            <li
              key={videoLabel(video)}
              className="reveal col-span-2 lg:col-span-1"
            >
              <TrainingVideoButton videos={[video]} className={CARD}>
                <span className="relative block">
                  <Image
                    src={video.poster}
                    alt=""
                    sizes="(min-width: 1024px) 240px, 100vw"
                    className={THUMB}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 grid place-items-center bg-ink/15"
                  >
                    <span className="grid size-12 place-items-center rounded-full bg-white/90 pl-1 text-2xl text-stitch shadow-[0_3px_0_rgb(0_0_0/0.25)] transition-transform group-hover:scale-110">
                      ▶
                    </span>
                  </span>
                  <span className="absolute top-2 left-2 rounded-lg bg-sun px-2 py-0.5 font-display text-ink text-sm">
                    하이라이트
                  </span>
                </span>
                <span className="block p-3 font-display leading-snug sm:text-lg">
                  득점 하이라이트
                </span>
              </TrainingVideoButton>
            </li>
          ))}
          {videos.map(video => (
            <li key={video.id} className="reveal">
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={CARD}
              >
                {/* biome-ignore lint/performance/noImgElement: 정적 export 라 외부 썸네일은 그대로 쓴다 */}
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  width={320}
                  height={180}
                  className={THUMB}
                />
                {video.score ? (
                  <ScoreBand us={video.score.us} them={video.score.them} />
                ) : null}
                <span className="block p-2.5 sm:p-3">
                  <span className="line-clamp-2 font-display text-sm leading-snug sm:text-lg">
                    {video.title}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  });
}

// 썸네일 아래 결과 띠. 예: "승  인헌 7 : 5"
function ScoreBand({ us, them }: { us: number; them: number }) {
  const { label, style } = outcome(us, them);
  return (
    <span
      className={`flex items-center justify-between gap-2 border-ink border-b-[3px] px-2.5 py-1 font-display sm:px-3 ${style}`}
    >
      <span className="text-lg sm:text-xl">{label}</span>
      <span className="tabular-nums sm:text-lg">
        인헌 {us} : {them}
      </span>
    </span>
  );
}
