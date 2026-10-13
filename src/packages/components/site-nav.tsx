'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '~content/site';

// 현재 페이지 메뉴는 흰 알약 위에 잔디색 글씨. 휴대폰에서는 가로로 밀어 본다.
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:px-0"
    >
      <ul className="flex gap-1 whitespace-nowrap py-1 font-display text-lg">
        {NAV.map(item => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`block rounded-xl px-3 py-1.5 ${
                  isActive ? 'bg-white text-grass' : 'hover:bg-white/15'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
