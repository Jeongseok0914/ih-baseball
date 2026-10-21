import assert from 'node:assert/strict';
import test from 'node:test';
import { seoulToday } from './today.ts';

test('서울 시간으로 날짜와 요일을 센다', () => {
  // UTC 2026-10-20 16:00 = 서울 2026-10-21(수) 01:00
  assert.deepEqual(seoulToday(new Date('2026-10-20T16:00:00Z')), {
    date: '2026-10-21',
    day: '수',
  });
});
