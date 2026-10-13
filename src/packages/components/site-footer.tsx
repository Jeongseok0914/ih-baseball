import { COACH, SITE } from '~content/site';

const formatPhone = (digits: string) =>
  digits.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-4xl px-4 pt-16 pb-10">
      <div className="rounded-md bg-board p-6 text-chalk sm:p-8">
        <p className="text-chalk/80">궁금한 점은 감독님께 바로 물어보세요.</p>
        <p className="mt-2 font-display text-3xl">
          {COACH.name} {COACH.title}님
        </p>
        {COACH.phone ? (
          <>
            <p className="mt-1 text-lg tabular-nums">
              {formatPhone(COACH.phone)}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`tel:${COACH.phone}`}
                className="rounded-sm bg-stitch px-5 py-3 font-semibold text-white"
              >
                전화하기
              </a>
              <a
                href={`sms:${COACH.phone}`}
                className="rounded-sm border-2 border-chalk px-5 py-3 font-semibold"
              >
                문자 보내기
              </a>
            </div>
          </>
        ) : (
          <p className="mt-3 text-chalk/80">연락처를 준비하고 있습니다.</p>
        )}
      </div>
      <p className="mt-6 text-ink/60 text-sm">{SITE.fullName}</p>
    </footer>
  );
}
