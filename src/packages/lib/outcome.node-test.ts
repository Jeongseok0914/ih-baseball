import assert from 'node:assert/strict';
import test from 'node:test';
import { outcome } from './outcome.ts';

test('점수로 승·패·무를 정한다', () => {
  assert.equal(outcome(7, 5).label, '승');
  assert.equal(outcome(2, 12).label, '패');
  assert.equal(outcome(3, 3).label, '무');
});
