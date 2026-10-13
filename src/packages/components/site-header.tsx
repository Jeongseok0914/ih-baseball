import Link from 'next/link';
import { NAV, SITE } from '~content/site';

export function SiteHeader() {
  return (
    <header className="border-ink/10 border-b">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4">
        <Link href="/" className="font-display text-xl text-board">
          {SITE.name}
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="flex gap-5">
            {NAV.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-semibold hover:text-stitch"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
