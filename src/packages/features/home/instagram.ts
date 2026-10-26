// Behold(behold.so) JSON 피드에서 최신 릴스만 고른다. 필요한 필드만 적는다.
// 형식: https://behold.so/docs/json-feeds
type FeedPost = {
  permalink: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  isReel?: boolean;
  sizes?: { medium?: { mediaUrl: string; width: number; height: number } };
};

export type Reel = { href: string; src: string; width: number; height: number };

// 피드는 최신순이다. 표지 이미지가 있는 릴스만 앞에서부터 count 개.
export const pickReels = (feed: { posts?: FeedPost[] }, count: number) =>
  (feed.posts ?? [])
    .filter(p => p.mediaType === 'VIDEO' && p.isReel && p.sizes?.medium)
    .slice(0, count)
    .map(
      (p): Reel => ({
        href: p.permalink,
        src: p.sizes?.medium?.mediaUrl ?? '',
        width: p.sizes?.medium?.width ?? 0,
        height: p.sizes?.medium?.height ?? 0,
      })
    );
