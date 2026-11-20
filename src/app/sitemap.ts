import type { MetadataRoute } from 'next';
import { NAV } from '~content/site';
import { absoluteUrl } from '~lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // 빌드할 때마다 갱신일을 알려 검색엔진이 다시 읽어 가게 한다.
  const lastModified = new Date();
  return NAV.flatMap(item => [item.href, ...(item.match ?? [])]).map(href => ({
    url: absoluteUrl(href),
    lastModified,
    changeFrequency: href === '/' ? 'daily' : 'weekly',
    priority: href === '/' ? 1 : 0.8,
  }));
}
