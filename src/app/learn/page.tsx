import { Learn } from '~features/learn/Learn';
import { pageMetadata } from '~lib/seo';

export const metadata = pageMetadata({
  path: '/learn',
  title: '야구 교실',
  description:
    '인헌초 야구부 야구 교실. 초급·중급·고급 야구 규칙을 장면 애니메이션으로 쉽게 알아봐요.',
});

export default function LearnPage() {
  return <Learn />;
}
