'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '~components/invitation-navigation.module.css';

export function InvitationNavigation({
  invitationPath,
  homeLabel,
}: {
  invitationPath: string;
  homeLabel: string;
}) {
  const pathname = usePathname();
  const onInvitation =
    pathname.replace(/\/$/, '') === invitationPath.replace(/\/$/, '');
  if (!onInvitation) return null;

  return (
    <Link href="/" className={styles.link}>
      {homeLabel}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
