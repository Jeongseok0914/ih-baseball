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
export const parseFeed = (xml: string, limit: number): Video[] =>
  xml
    .split('<entry>')
    .slice(1)
    .flatMap(entry => {
      const id = pick(entry, 'yt:videoId');
      const title = pick(entry, 'title');
      const published = pick(entry, 'published');
      return id && title && published
        ? [
            {
              id,
              title: decode(title),
              published: published.slice(0, 10).replaceAll('-', '.'),
            },
          ]
        : [];
    })
    .slice(0, limit);
