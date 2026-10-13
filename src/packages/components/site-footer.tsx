import { ContactButtons } from '~components/contact-links';
import { CoachCharacter } from '~components/team-character';
import { COACH } from '~content/site';

const formatPhone = (digits: string) =>
  digits.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-5xl px-4 pt-16 pb-10">
      <div className="chunky bg-grass p-5 text-white sm:px-10 sm:py-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="sm:text-lg">궁금한 건 감독님께 물어보세요</p>
            <p className="mt-1 font-display text-3xl sm:text-4xl">
              {COACH.name} {COACH.title}님
            </p>
            {/* PC에서는 번호만, 휴대폰에서는 아래 버튼만 보인다. */}
            {COACH.phone ? (
              <p className="mt-1 hidden font-display text-3xl tabular-nums pointer-fine:block">
                {formatPhone(COACH.phone)}
              </p>
            ) : (
              <p className="mt-2">연락처를 준비하고 있습니다.</p>
            )}
          </div>
          <CoachCharacter className="h-32 w-auto shrink-0 sm:h-48" />
        </div>
        {COACH.phone ? (
          <div className="mt-4 hidden pointer-coarse:block">
            <ContactButtons />
          </div>
        ) : null}
      </div>
    </footer>
  );
}
