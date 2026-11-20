import { PageHero } from '~components/page-hero';
import { YOUTUBE_CHANNEL } from '~content/youtube';
import { GameVideos } from '~features/games/ui/GameVideos';

export function Games() {
  return (
    <main>
      <PageHero title="경기">
        대회 경기 결과와 경기마다 만든 하이라이트예요. 우리가 안타를 치고 점수를
        내고, 아웃을 잡은 장면을 경기 순서대로 모았어요.
      </PageHero>

      <div className="mx-auto max-w-5xl px-4 pb-4">
        <GameVideos />

        <a
          href={YOUTUBE_CHANNEL.url}
          target="_blank"
          rel="noopener noreferrer"
          className="chunky mt-10 inline-flex min-h-12 items-center gap-2 bg-stitch px-4 font-display text-lg text-white shadow-none"
        >
          경기 전체 중계는 유튜브 채널에서 →
        </a>
      </div>
    </main>
  );
}
