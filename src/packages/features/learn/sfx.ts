// 장면 효과음. 소리 파일 없이 브라우저(Web Audio)에서 그때그때 만들어 낸다.
import type { Sfx } from '~content/rule-scenes';

let context: AudioContext | null = null;

const audio = () => {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  context ??= new AudioContext();
  if (context.state === 'suspended') context.resume();
  return context;
};

// 짧은 잡음(방망이 "딱", 미트 "팡", 관중 함성의 재료)
function noise(
  ctx: AudioContext,
  at: number,
  length: number,
  filter: BiquadFilterType,
  freq: number,
  volume: number
) {
  const buffer = ctx.createBuffer(
    1,
    Math.ceil(ctx.sampleRate * length),
    ctx.sampleRate
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const f = ctx.createBiquadFilter();
  f.type = filter;
  f.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, at);
  gain.gain.exponentialRampToValueAtTime(0.001, at + length);
  source.connect(f).connect(gain).connect(ctx.destination);
  source.start(at);
}

function tone(
  ctx: AudioContext,
  at: number,
  from: number,
  to: number,
  length: number,
  volume: number,
  type: OscillatorType = 'sine'
) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + length);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, at);
  gain.gain.exponentialRampToValueAtTime(0.001, at + length);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + length);
}

export function playSfx(kind: Sfx) {
  const ctx = audio();
  if (!ctx) return;
  const t = ctx.currentTime;
  if (kind === 'hit') {
    noise(ctx, t, 0.05, 'highpass', 1800, 0.6);
    tone(ctx, t, 1200, 300, 0.12, 0.35, 'triangle');
  } else if (kind === 'catch') {
    noise(ctx, t, 0.08, 'lowpass', 900, 0.7);
    tone(ctx, t, 200, 80, 0.12, 0.5);
  } else if (kind === 'out') {
    // 심판 호루라기 느낌
    tone(ctx, t, 2100, 2000, 0.18, 0.12, 'square');
    tone(ctx, t + 0.22, 2100, 1900, 0.3, 0.12, 'square');
  } else if (kind === 'safe') {
    tone(ctx, t, 660, 660, 0.12, 0.2, 'triangle');
    tone(ctx, t + 0.12, 990, 990, 0.25, 0.2, 'triangle');
  } else {
    // 관중 함성: 부드러운 잡음이 커졌다 줄어든다
    const length = 1.2;
    noise(ctx, t, length, 'bandpass', 1100, 0.35);
    noise(ctx, t + 0.1, length, 'bandpass', 700, 0.3);
  }
}
