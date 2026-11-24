'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '~components/invitation-navigation.module.css';

export function InvitationNavigation({
  invitationPath,
  invitationLabel,
  homeLabel,
}: {
  invitationPath: string;
  invitationLabel: string;
  homeLabel: string;
}) {
  const pathname = usePathname();
  const onHome = pathname === '/';
  const onInvitation =
    pathname.replace(/\/$/, '') === invitationPath.replace(/\/$/, '');
  if (!onHome && !onInvitation) return null;

  return (
    <Link
      href={onHome ? invitationPath : '/'}
      className={`${styles.link} ${onHome ? styles.aboveTabs : ''}`}
    >
      {onHome ? invitationLabel : homeLabel}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
