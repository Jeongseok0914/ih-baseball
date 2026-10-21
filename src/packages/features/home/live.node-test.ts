import assert from 'node:assert/strict';
import test from 'node:test';
import type { News } from '~content/news';
import { latestNews, pickSpotlight, seoulToday } from './live.ts';

const NEWS: News[] = [
  {
    kind: 'result',
    date: '2026-10-10',
    title: 'A',
    opponent: 'X',
    us: 3,
    them: 1,
  },
  { kind: 'event', date: '2026-11-20', title: '먼 대회' },
  { kind: 'event', date: '2026-10-25', title: '가까운 대회' },
  { kind: 'notice', date: '2026-10-21', title: '공지' },
];

test('30일 안의 가장 가까운 대회를 먼저 고른다', () => {
  const s = pickSpotlight(NEWS, '2026-10-21');
  assert.equal(s?.kind, 'event');
  assert.equal(s?.kind === 'event' && s.dDay, 4);
  assert.equal(s?.kind === 'event' && s.news.title, '가까운 대회');
});

test('대회가 없으면 14일 안의 최근 결과, 그보다 오래되면 없음', () => {
  const onlyResult = NEWS.filter(n => n.kind !== 'event');
  assert.equal(pickSpotlight(onlyResult, '2026-10-21')?.kind, 'result');
  assert.equal(pickSpotlight(onlyResult, '2026-10-30'), null);
});

test('지난 대회는 고르지 않는다', () => {
  assert.equal(pickSpotlight(NEWS, '2026-12-01'), null);
});

test('최근 소식은 최신순', () => {
  assert.deepEqual(
    latestNews(NEWS, 2).map(n => n.date),
    ['2026-11-20', '2026-10-25']
  );
});

test('서울 시간으로 날짜와 요일을 센다', () => {
  // UTC 2026-10-20 16:00 = 서울 2026-10-21(수) 01:00
  assert.deepEqual(seoulToday(new Date('2026-10-20T16:00:00Z')), {
    date: '2026-10-21',
    day: '수',
  });
});
