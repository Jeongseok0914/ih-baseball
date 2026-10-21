import assert from 'node:assert/strict';
import test from 'node:test';
import type { News } from '~content/news';
import { latestNews, newsDate, pickSpotlight } from './live.ts';

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
  {
    kind: 'result',
    date: '2026-10-21',
    title: 'B',
    opponent: 'Y',
    us: 2,
    them: 2,
  },
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
  assert.equal(pickSpotlight(onlyResult, '2026-11-10'), null);
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

test('날짜 미정 대회는 D-day 를 세지 않고, 여러 날 대회는 기간으로 쓴다', () => {
  const tbd: News = {
    kind: 'event',
    date: '2026-10-25',
    tentative: '11월 중',
    title: '미정',
  };
  assert.equal(pickSpotlight([tbd], '2026-10-21'), null);
  assert.equal(newsDate(tbd), '11월 중');
  assert.equal(
    newsDate({
      kind: 'event',
      date: '2026-11-12',
      end: '2026-11-15',
      title: 'A',
    }),
    '11월 12일~15일'
  );
  assert.equal(
    newsDate({
      kind: 'event',
      date: '2026-10-30',
      end: '2026-11-02',
      title: 'B',
    }),
    '10월 30일~11월 2일'
  );
});
