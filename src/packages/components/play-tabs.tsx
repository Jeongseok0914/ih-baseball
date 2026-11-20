import Link from 'next/link';

const TABS = [
  { href: '/games', label: '경기' },
  { href: '/schedule', label: '훈련' },
] as const;

// '훈련·경기' 메뉴 안의 탭. 경기 탭이 먼저(메뉴를 누르면 /games). 두 페이지가 같이 쓴다.
export function PlayTabs({
  active,
}: {
  active: (typeof TABS)[number]['href'];
}) {
  return (
    <nav aria-label="훈련·경기" className="mt-8 flex gap-2">
      {TABS.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.href === active ? 'page' : undefined}
          className={`chunky flex min-h-12 flex-1 items-center justify-center font-display text-xl shadow-none sm:flex-none sm:px-10 ${
            tab.href === active ? 'bg-ink text-white' : 'bg-white'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
