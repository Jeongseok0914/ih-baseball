import Image, { type StaticImageData } from 'next/image';
import { PageHero } from '~components/page-hero';
import { CharacterFace, type Face } from '~components/team-character';
import { TrainingVideoButton } from '~components/training-video';
import { PLAYERS, ROSTER_SEASON } from '~content/players';
import { COACH, STAFF } from '~content/site';
import { TRAINING_VIDEOS, type TrainingVideo } from '~content/training-videos';
import { Heritage } from '~features/team/ui/Heritage';
import { JerseyNumber } from '~features/team/ui/JerseyNumber';

const GRADES = [6, 5, 4, 3, 2, 1] as const;

type CardProps = {
  number: number;
  name: string;
  badge?: string;
  detail: string;
  comment?: string;
  photo?: StaticImageData;
  // 사진이 없을 때 원 안에 나오는 캐릭터 얼굴.
  face: Face;
  // 지도자 카드는 잔디색으로 구분한다.
  isStaff?: boolean;
  // 훈련 영상이 있으면 카드 맨 아래에 영상 버튼을 붙인다. 여러 개면 개수를 보여 준다.
  videos: TrainingVideo[];
};

function ProfileCard({
  number,
  name,
  badge,
  detail,
  comment,
  photo,
  face,
  isStaff = false,
  videos,
}: CardProps) {
  return (
    <li
      className={`chunky reveal relative flex flex-col p-4 sm:p-5 ${isStaff ? 'bg-grass text-white' : 'bg-white'}`}
    >
      {/* 오른쪽 위 작은 원. 동의받은 사진이 있으면 사진, 없으면 캐릭터. */}
      <span className="absolute top-3 right-3 size-14 overflow-hidden rounded-full border-[3px] border-ink bg-sun/60 sm:size-16">
        {photo ? (
          <Image
            src={photo}
            alt={`${name} 사진`}
            className="skeleton size-full object-cover"
          />
        ) : (
          <CharacterFace
            face={face}
            label={`${name} 캐릭터`}
            className="size-full"
          />
        )}
      </span>
      <JerseyNumber number={number} name={name} />
      <p className="mt-3 flex flex-wrap items-center gap-2 font-display text-xl sm:text-2xl">
        {name}
        {badge ? (
          <span className="rounded-lg border-2 border-ink bg-sun px-2 py-0.5 text-ink text-sm">
            {badge}
          </span>
        ) : null}
      </p>
      <p
        className={`mt-1 text-sm sm:text-base ${isStaff ? 'text-white/85' : 'text-ink/75'}`}
      >
        {detail}
      </p>
      {comment ? (
        <p className="mt-3 border-current/20 border-t pt-3">“{comment}”</p>
      ) : null}
      {videos.length > 0 ? (
        <div className="mt-auto pt-3">
          <TrainingVideoButton
            videos={videos}
            className="inline-flex min-h-10 w-full items-center justify-center gap-1 rounded-xl bg-stitch px-2 pt-0.5 font-display text-white shadow-[0_3px_0_#7d1a15] active:translate-y-0.5"
          >
            <span aria-hidden="true">▶</span> 훈련 영상
            {videos.length > 1 ? ` ${videos.length}` : ''}
          </TrainingVideoButton>
        </div>
      ) : null}
    </li>
  );
}

export function Team() {
  return (
    <main>
      <PageHero title={`${ROSTER_SEASON} 현역 라인업`}>
        {COACH.name} {COACH.title}님과 함께 운동장을 뛰는 친구들입니다. 모두
        투수도 함께 해요.
      </PageHero>

      <div className="mx-auto max-w-5xl px-4">
        {PLAYERS.length === 0 ? (
          <p className="chunky mt-12 bg-white p-6 text-ink/70 shadow-none">
            선수 소개를 준비하고 있습니다.
          </p>
        ) : (
          GRADES.map(grade => {
            const players = PLAYERS.filter(p => p.grade === grade);
            if (players.length === 0) return null;

            return (
              <section
                key={grade}
                aria-labelledby={`grade-${grade}`}
                className="mt-12"
              >
                <h2 id={`grade-${grade}`} className="font-display text-3xl">
                  {grade}학년
                </h2>
                <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {players.map(player => (
                    <ProfileCard
                      key={player.number}
                      number={player.number}
                      name={player.name}
                      badge={player.role}
                      detail={[...player.positions, player.hand]
                        .filter(Boolean)
                        .join(' · ')}
                      comment={player.comment}
                      photo={player.photo}
                      face={{
                        kind: 'kid',
                        grade: player.grade,
                        seed: PLAYERS.indexOf(player),
                      }}
                      videos={TRAINING_VIDEOS.filter(
                        v => v.player === player.number
                      )}
                    />
                  ))}
                </ul>
              </section>
            );
          })
        )}

        {/* 지도자는 선수들 아래에 둔다. */}
        <section aria-labelledby="staff-title" className="mt-14">
          <h2 id="staff-title" className="font-display text-3xl">
            지도자
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {STAFF.map(staff => (
              <ProfileCard
                key={staff.number}
                number={staff.number}
                name={staff.name}
                detail={staff.title}
                isStaff
                videos={[]}
                face={{
                  kind: staff.number === COACH.number ? 'headCoach' : 'coach',
                }}
              />
            ))}
          </ul>
        </section>

        <Heritage />
      </div>
    </main>
  );
}
