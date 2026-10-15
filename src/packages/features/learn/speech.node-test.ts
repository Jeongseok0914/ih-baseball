import assert from 'node:assert/strict';
import test from 'node:test';
import { pickKoreanVoice, toSpeech } from './speech.ts';

const voice = (name: string, lang = 'ko-KR') =>
  ({ name, lang }) as SpeechSynthesisVoice;

test('자연스러운 한국어 목소리부터 고른다', () => {
  const voices = [
    voice('Samantha', 'en-US'),
    voice('Yuna'),
    voice('Google 한국의'),
    voice('Microsoft SunHi Online (Natural) - Korean (Korea)'),
  ];
  assert.match(pickKoreanVoice(voices)?.name ?? '', /SunHi/);
  assert.equal(pickKoreanVoice(voices.slice(0, 3))?.name, 'Google 한국의');
  assert.equal(pickKoreanVoice([voice('Samantha', 'en-US')]), undefined);
});

test('읽기 좋게 글자를 다듬는다', () => {
  assert.equal(toSpeech('"6-3 땅볼"이에요…'), '6 3 땅볼이에요');
});
