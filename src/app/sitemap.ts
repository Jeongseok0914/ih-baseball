import type { MetadataRoute } from 'next';
import { NAV } from '~content/site';
import { absoluteUrl } from '~lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return NAV.map(item => ({
    url: absoluteUrl(item.href),
    changeFrequency: item.href === '/' ? 'daily' : 'weekly',
    priority: item.href === '/' ? 1 : 0.8,
  }));
}
