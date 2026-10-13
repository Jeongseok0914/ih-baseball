import type { ReactNode } from 'react';

// template 은 페이지를 옮길 때마다 새로 그려진다. 본문만 살짝 떠오르며 바뀐다.
export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-rise">{children}</div>;
}
