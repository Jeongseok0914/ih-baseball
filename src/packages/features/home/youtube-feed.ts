export type Video = { id: string; title: string; published: string };

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

const decode = (text: string) =>
  text.replace(/&(?:amp|lt|gt|quot|#39);/g, entity => ENTITIES[entity]);

const pick = (entry: string, tag: string) =>
  entry.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1];

// YouTube 채널 RSS(Atom) 에서 영상 id, 제목, 올린 날짜(YYYY.MM.DD)만 뽑는다.
// 한 경기를 여러 영상으로 나눠 올리면 제목이 같은 카드가 겹쳐 보이므로 제목당 하나만 남긴다.
// 피드는 최신순이라 뒤에 나오는 것(먼저 올린 1부)으로 바꾸고, 자리는 처음 나온 곳을 지킨다.
export const parseFeed = (xml: string, limit: number): Video[] => {
  const byTitle = new Map<string, Video>();
  for (const entry of xml.split('<entry>').slice(1)) {
    const id = pick(entry, 'yt:videoId');
    const title = pick(entry, 'title');
    const published = pick(entry, 'published');
    if (!id || !title || !published) continue;
    const decoded = decode(title);
    byTitle.set(decoded, {
      id,
      title: decoded,
      published: published.slice(0, 10).replaceAll('-', '.'),
    });
  }
  return [...byTitle.values()].slice(0, limit);
};
