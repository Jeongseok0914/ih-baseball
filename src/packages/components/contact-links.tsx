import { KAKAO_CHANNEL } from '~content/recruit';
import { COACH } from '~content/site';

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// 전화·문자 버튼 한 쌍. 엄지로 누르기 쉽게 높이 56px 이상, 두 칸을 꽉 채운다.
// tel:/sms: 기본 형식만 써서 아이폰·안드로이드 모두 바로 전화·문자 앱이 열린다.
export function ContactButtons() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <a
        href={`tel:${COACH.phone}`}
        className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white font-display text-grass text-lg shadow-[0_4px_0_#1d4529] active:translate-y-0.5 active:shadow-[0_2px_0_#1d4529]"
      >
        <PhoneIcon />
        전화하기
      </a>
      <a
        href={`sms:${COACH.phone}`}
        className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-sun font-display text-ink text-lg shadow-[0_4px_0_#a07a1e] active:translate-y-0.5 active:shadow-[0_2px_0_#a07a1e]"
      >
        <MessageIcon />
        문자 보내기
      </a>
    </div>
  );
}

export function KakaoIcon() {
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

// 카카오톡 채널 상담. 휴대폰·PC 모두 채팅창이 열린다.
export function KakaoButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={KAKAO_CHANNEL}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#fee500] px-5 font-display text-[#191919] text-lg shadow-[0_4px_0_#b8a200] active:translate-y-0.5 ${className}`}
    >
      <KakaoIcon />
      카카오톡으로 상담하기
    </a>
  );
}
