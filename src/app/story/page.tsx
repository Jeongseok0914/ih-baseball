import type { Metadata } from 'next';
import { Story } from '~features/story/Story';

export const metadata: Metadata = { title: '야구부 이야기' };

export default function StoryPage() {
  return <Story />;
}
