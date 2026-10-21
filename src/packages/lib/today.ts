// 서울 시간 기준 "오늘". 홈 일정과 훈련 일정이 같이 쓴다.
export function seoulToday(now = new Date()) {
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
  }).format(now);
  const day = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
  }).format(now);
  return { date, day };
}
