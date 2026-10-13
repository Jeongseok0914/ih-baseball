import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE } from '~content/site';
import './globals.css';

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
