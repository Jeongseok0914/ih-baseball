import type { Metadata } from 'next';
import ogImage from '~content/images/og-image.jpg';
import { SITE } from '~content/site';

// 검색엔진에 알려 줄 사이트 주소. CI가 GitHub Pages origin 과 basePath 를 주입한다.
// 커스텀 도메인을 연결하면 basePath 는 빈 값이 되어 자동으로 새 주소를 쓴다.
export const SITE_URL = `${process.env.PAGES_ORIGIN || 'http://localhost:3000'}${process.env.PAGES_BASE_PATH ?? ''}`;

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path === '/' ? '' : path}` || '/';

// 공유 썸네일. static import 라 파일 이름에 내용 해시가 붙는다(/_next/static/media/og-image.<해시>.jpg).
// 이미지를 바꾸면 주소 자체가 바뀌어 카카오톡·페이스북 등이 예전 썸네일 캐시를 쓰지 않는다.
export const OG_IMAGES = [
  {
    url: ogImage.src,
    width: ogImage.width,
    height: ogImage.height,
    alt: SITE.fullName,
  },
];

// 페이지별 제목·설명·대표 주소를 한 번에 만든다. 공유 미리보기(OG)도 같은 문구를 쓴다.
export const pageMetadata = ({
  path,
  title,
  description,
}: {
  path: string;
  title?: string;
  description: string;
}): Metadata => ({
  title,
  description,
  alternates: { canonical: absoluteUrl(path) },
  openGraph: {
    title: title ? `${title} | ${SITE.name}` : SITE.fullName,
    description,
    url: absoluteUrl(path),
    siteName: SITE.fullName,
    locale: 'ko_KR',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: { card: 'summary_large_image', images: OG_IMAGES },
});
