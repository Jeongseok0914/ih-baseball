import assert from 'node:assert/strict';
import test from 'node:test';
import { outcome, record } from './outcome.ts';

test('점수로 승·패·무를 정한다', () => {
  assert.equal(outcome(7, 5).label, '승');
  assert.equal(outcome(2, 12).label, '패');
  assert.equal(outcome(3, 3).label, '무');
});

test('전적은 승·패, 무승부가 있을 때만 무', () => {
  assert.equal(
    record([
      { us: 7, them: 5 },
      { us: 2, them: 12 },
      { us: 6, them: 5 },
    ]),
    '2승 1패'
  );
  assert.equal(
    record([
      { us: 1, them: 1 },
      { us: 0, them: 3 },
    ]),
    '0승 1무 1패'
  );
});
