import { ContactButtons } from '~components/contact-links';
import { CoachCharacter } from '~components/team-character';
import { KAKAO_CHANNEL } from '~content/recruit';
import { COACH } from '~content/site';

const formatPhone = (digits: string) =>
  digits.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');

function KakaoIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6"
      fill="currentColor"
    >
      <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.5.1 1 .1 1.5.1 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
    </svg>
  );
}

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
        {/* 카카오톡은 휴대폰·PC 모두 쓰므로 항상 보인다. 주소가 없으면 자리만 잡아 둔다. */}
        {KAKAO_CHANNEL ? (
          <a
            href={KAKAO_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#fee500] font-display text-[#191919] text-lg shadow-[0_4px_0_#b8a200] active:translate-y-0.5"
          >
            <KakaoIcon />
            카카오톡으로 상담하기
          </a>
        ) : (
          <p className="mt-2.5 flex min-h-14 items-center justify-center gap-2 rounded-2xl border-[3px] border-white/50 border-dashed font-display text-lg text-white/80">
            <KakaoIcon />
            카카오톡 상담 준비 중
          </p>
        )}
      </div>
    </footer>
  );
}
