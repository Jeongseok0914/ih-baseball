import type { Metadata } from 'next';
import { Join } from '~features/join/Join';

export const metadata: Metadata = { title: '함께하기' };

export default function JoinPage() {
  return <Join />;
}
