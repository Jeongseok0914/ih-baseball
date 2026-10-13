import type { Metadata } from 'next';
import { Black_Han_Sans, IBM_Plex_Sans_KR } from 'next/font/google';
import type { ReactNode } from 'react';
import { SiteFooter } from '~components/site-footer';
import { SiteHeader } from '~components/site-header';
import { SITE } from '~content/site';
import './globals.css';

const display = Black_Han_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-black-han-sans',
});

const body = IBM_Plex_Sans_KR({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-plex-kr',
});

export const metadata: Metadata = {
  title: { default: SITE.fullName, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: {
    title: SITE.fullName,
    description: SITE.description,
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
