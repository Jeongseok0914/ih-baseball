// 장면 설명 읽어 주기. 장면을 열면 자동으로 읽는다. 브라우저에 들어 있는 음성 합성(Web Speech API)을 쓴다.
const VOICE_KEY = 'ih-rule-voice';

export const canSpeak = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

export const stopSpeaking = () => {
  if (canSpeak()) window.speechSynthesis.cancel();
};

// 기기마다 들어 있는 한국어 목소리가 다르다. 자연스러운 목소리부터 고른다.
// Edge "SunHi Online (Natural)", 맥·아이폰 "Yuna (향상됨/프리미엄)", 크롬 "Google 한국의" 순.
const PREFERRED = [
  /SunHi/i,
  /Natural|Online/i,
  /Premium|Enhanced|프리미엄|향상/i,
  /Google/i,
  /Yuna|유나/i,
];

export function pickKoreanVoice(voices: readonly SpeechSynthesisVoice[]) {
  const korean = voices.filter(v => /^ko[-_]?/i.test(v.lang));
  for (const pattern of PREFERRED) {
    const voice = korean.find(v => pattern.test(v.name));
    if (voice) return voice;
  }
  return korean[0];
}

// 화면 글자를 소리 내기 좋게 다듬는다. "6-3 땅볼" → "6 3 땅볼", 말줄임표·따옴표는 뺀다.
export const toSpeech = (text: string) =>
  text
    .replace(/(\d)-(\d)/g, '$1 $2')
    .replace(/[…"“”]/g, '')
    .trim();

// 읽는 속도에 맞춰 글자를 채울 때 쓰는 예상 속도(글자당 ms). 글자 위치 알림이 없는 목소리에서 쓴다.
const MS_PER_CHAR = 140;

// 다 읽으면 끝나는 Promise. onProgress 로 읽은 비율(0~1)을 알려 줘 화면 글자와 맞춘다.
// 글자 위치 알림(boundary)을 주는 목소리는 그 위치를, 아니면 시간으로 짐작한 위치를 쓴다.
// 일부 브라우저가 끝 이벤트를 빠뜨려도 멈추지 않게 글자 수만큼 기다린 뒤 넘어간다.
export function speak(text: string, onProgress?: (ratio: number) => void) {
  if (!canSpeak()) {
    onProgress?.(1);
    return Promise.resolve();
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const spoken = toSpeech(text);
  return new Promise<void>(resolve => {
    let timer = 0;
    let boundaries = false;
    const finish = () => {
      clearInterval(timer);
      onProgress?.(1);
      resolve();
    };
    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    const voice = pickKoreanVoice(synth.getVoices());
    if (voice) utterance.voice = voice;
    utterance.onstart = () => {
      const started = performance.now();
      const guess = spoken.length * MS_PER_CHAR;
      timer = window.setInterval(() => {
        if (boundaries) return;
        onProgress?.(Math.min(0.95, (performance.now() - started) / guess));
      }, 50);
    };
    utterance.onboundary = e => {
      boundaries = true;
      onProgress?.(
        Math.min(1, (e.charIndex + (e.charLength || 1)) / spoken.length)
      );
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    onProgress?.(0);
    synth.speak(utterance);
    setTimeout(finish, 1500 + text.length * 200);
  });
}

// 크롬은 목소리 목록을 늦게 불러온다. 미리 한 번 불러 두면 첫 장면부터 고른 목소리로 읽는다.
if (canSpeak()) window.speechSynthesis.getVoices();

// 장면 소리 켜기/끄기는 이 기기에 기억한다. 기본은 켜짐.
export const readVoiceOn = () => {
  try {
    return localStorage.getItem(VOICE_KEY) !== 'off';
  } catch {
    return true;
  }
};

export const saveVoiceOn = (on: boolean) => {
  try {
    localStorage.setItem(VOICE_KEY, on ? 'on' : 'off');
  } catch {
    // 저장 못 해도 이번 화면에서는 바꾼 대로 동작한다.
  }
};
