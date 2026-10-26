import assert from 'node:assert/strict';
import test from 'node:test';
import { pickReels } from './instagram.ts';

const size = { mediaUrl: 'm.webp', width: 700, height: 1244 };

test('표지가 있는 릴스만 최신순으로 count 개 고른다', () => {
  const reels = pickReels(
    {
      posts: [
        { permalink: 'a', mediaType: 'IMAGE', sizes: { medium: size } },
        {
          permalink: 'b',
          mediaType: 'VIDEO',
          isReel: true,
          sizes: { medium: size },
        },
        {
          permalink: 'c',
          mediaType: 'VIDEO',
          isReel: false,
          sizes: { medium: size },
        },
        { permalink: 'd', mediaType: 'VIDEO', isReel: true },
        {
          permalink: 'e',
          mediaType: 'VIDEO',
          isReel: true,
          sizes: { medium: size },
        },
        {
          permalink: 'f',
          mediaType: 'VIDEO',
          isReel: true,
          sizes: { medium: size },
        },
      ],
    },
    2
  );
  assert.deepEqual(
    reels.map(r => r.href),
    ['b', 'e']
  );
  assert.equal(reels[0].src, 'm.webp');
});

test('posts 가 없으면 빈 목록', () => {
  assert.deepEqual(pickReels({}, 3), []);
});
