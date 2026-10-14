'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { NAV } from '~content/site';

const iconProps = {
  'aria-hidden': true,
  viewBox: '0 0 24 24',
  className: 'size-6',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

// 하단 탭 아이콘: 집, 유니폼, 달력, 손 흔들기.
const ICONS: Record<string, ReactNode> = {
  '/': (
    <svg {...iconProps}>
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </svg>
  ),
  '/team': (
    <svg {...iconProps}>
      <path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z" />
    </svg>
  ),
  '/schedule': (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  '/join': (
    <svg {...iconProps}>
      <path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15" />
    </svg>
  ),
};

const useActiveHref = () => {
  const pathname = usePathname();
  // trailingSlash 때문에 pathname 이 /team/ 로 온다. 끝의 / 를 떼고 메뉴 주소와 비교한다.
  return (href: string) => (pathname.replace(/\/$/, '') || '/') === href;
};

// 태블릿·PC: 상단 메뉴. 현재 페이지는 흰 알약 위에 잔디색 글씨.
export function SiteNav() {
  const isActive = useActiveHref();

  return (
    <nav aria-label="주요 메뉴" className="hidden sm:block">
      <ul className="flex gap-1 font-display text-lg">
        {NAV.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`block rounded-xl px-3 py-1.5 ${
                isActive(item.href)
                  ? 'bg-white text-grass'
                  : 'hover:bg-white/15'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// 휴대폰: 엄지가 닿는 화면 아래 탭 바. 홈 버튼 영역(safe area)만큼 띄운다.
export function BottomTabs() {
  const isActive = useActiveHref();

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-20 border-ink border-t-[3px] bg-white px-2 pt-2 pb-[max(env(safe-area-inset-bottom),8px)] sm:hidden"
    >
      <ul className="grid grid-cols-4 gap-1">
        {NAV.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl font-display text-sm ${
                isActive(item.href) ? 'bg-grass text-white' : 'text-ink/70'
              }`}
            >
              {ICONS[item.href]}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
