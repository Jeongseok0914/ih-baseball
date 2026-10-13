import Image from 'next/image';
import Link from 'next/link';
import { SiteNav } from '~components/site-nav';
import emblem from '~content/images/emblem.jpg';
import { SITE } from '~content/site';

export function SiteHeader() {
  return (
    <header className="bg-grass text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={emblem}
            alt=""
            width={44}
            height={44}
            priority
            className="rounded-full border-2 border-white"
          />
          <span className="font-display text-2xl">{SITE.name}</span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
