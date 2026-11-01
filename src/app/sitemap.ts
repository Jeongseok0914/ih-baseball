import type { MetadataRoute } from 'next';
import { NAV } from '~content/site';
import { absoluteUrl } from '~lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // 빌드할 때마다 갱신일을 알려 검색엔진이 다시 읽어 가게 한다.
  const lastModified = new Date();
  return NAV.map(item => ({
    url: absoluteUrl(item.href),
    lastModified,
    changeFrequency: item.href === '/' ? 'daily' : 'weekly',
    priority: item.href === '/' ? 1 : 0.8,
  }));
}
