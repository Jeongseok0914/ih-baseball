import type { Metadata } from 'next';
import { NIGHT } from '~content/night';
import { NightInvitation } from '~features/night/NightInvitation';
import { absoluteUrl } from '~lib/seo';

const image = {
  url: NIGHT.shareImage.src,
  width: NIGHT.shareImage.width,
  height: NIGHT.shareImage.height,
  alt: `청룡언월도를 든 인헌초 야구부 감독님 캐릭터. ${NIGHT.shareTitle}`,
};

export const metadata: Metadata = {
  title: NIGHT.title,
  description: NIGHT.description,
  robots: { index: false },
  alternates: { canonical: absoluteUrl(NIGHT.path) },
  openGraph: {
    title: NIGHT.shareTitle,
    description: `${NIGHT.date} ${NIGHT.time} · ${NIGHT.venue.name}`,
    url: absoluteUrl(NIGHT.path),
    siteName: NIGHT.team,
    locale: 'ko_KR',
    type: 'website',
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title: NIGHT.shareTitle,
    description: NIGHT.description,
    images: [image],
  },
};

export default function NightPage() {
  return <NightInvitation />;
}
