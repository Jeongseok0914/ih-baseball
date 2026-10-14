import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseFeed } from './youtube-feed.ts';

const entry = (id: string, title: string, date: string) =>
  `<entry><yt:videoId>${id}</yt:videoId><title>${title}</title><published>${date}T01:00:00+00:00</published></entry>`;

test('최근 영상의 id, 제목, 날짜를 순서대로 뽑고 개수를 자른다', () => {
  const xml = `<feed><title>채널</title>${entry('a1', '인헌초 VS 효제초', '2026-09-03')}${entry('b2', '연습 &amp; 경기', '2026-08-30')}${entry('c3', '세 번째', '2026-08-01')}</feed>`;
  assert.deepEqual(parseFeed(xml, 2), [
    { id: 'a1', title: '인헌초 VS 효제초', published: '2026.09.03' },
    { id: 'b2', title: '연습 & 경기', published: '2026.08.30' },
  ]);
});

test('필드가 빠진 항목과 빈 피드는 건너뛴다', () => {
  assert.deepEqual(parseFeed('<entry><title>x</title></entry>', 6), []);
  assert.deepEqual(parseFeed('', 6), []);
});

test('제목이 같은 영상은 먼저 올린 하나만 처음 자리에 남긴다', () => {
  const xml = `${entry('p3', '인헌초 VS 효제초', '2026-09-03')}${entry('x1', '다른 경기', '2026-09-02')}${entry('p1', '인헌초 VS 효제초', '2026-09-03')}${entry('p1', '인헌초 VS 효제초', '2026-09-03')}`;
  assert.deepEqual(
    parseFeed(xml, 6).map(video => video.id),
    ['p1', 'x1']
  );
});
