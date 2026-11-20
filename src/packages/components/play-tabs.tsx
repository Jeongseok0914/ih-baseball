import Link from 'next/link';

const TABS = [
  { href: '/schedule', label: '훈련' },
  { href: '/games', label: '경기' },
] as const;

// '훈련·경기' 메뉴 안의 탭. 두 페이지(/schedule, /games)가 같이 쓴다.
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
