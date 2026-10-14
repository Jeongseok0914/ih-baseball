import type { Metadata } from 'next';
import { Gowun_Dodum, Jua } from 'next/font/google';
import type { ReactNode } from 'react';
import { RecruitTicker } from '~components/recruit-ticker';
import { SiteFooter } from '~components/site-footer';
import { SiteHeader } from '~components/site-header';
import { BottomTabs } from '~components/site-nav';
import { SEARCH_VERIFICATION, SITE } from '~content/site';
import { OG_IMAGES } from '~lib/seo';
import './globals.css';

const display = Jua({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-jua',
});

const body = Gowun_Dodum({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-gowun',
});

export const metadata: Metadata = {
  // 공유 썸네일은 절대 URL이어야 한다. CI가 configure-pages 의 origin 을 주입하고 basePath 는 Next가 붙인다.
  metadataBase: new URL(process.env.PAGES_ORIGIN || 'http://localhost:3000'),
  title: { default: SITE.fullName, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.fullName,
  formatDetection: { telephone: false },
  verification: {
    google: SEARCH_VERIFICATION.google || undefined,
    other: SEARCH_VERIFICATION.naver
      ? { 'naver-site-verification': SEARCH_VERIFICATION.naver }
      : undefined,
  },
  openGraph: {
    title: SITE.fullName,
    description: SITE.description,
    siteName: SITE.fullName,
    locale: 'ko_KR',
    type: 'website',
    images: OG_IMAGES,
  },
  twitter: { card: 'summary_large_image', images: OG_IMAGES },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable}`}>
      <body className="pb-[calc(80px+env(safe-area-inset-bottom))] font-sans sm:pb-0">
        <SiteHeader />
        <RecruitTicker />
        {children}
        <SiteFooter />
        <BottomTabs />
      </body>
    </html>
  );
}
