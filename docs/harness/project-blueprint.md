# Project Blueprint

새 페이지, 섹션, 콘텐츠, 외부 참고 구현을 모두 같은 구조로 수렴시키는 기준입니다.

## 핵심 원칙

1. 외부 참고는 요구사항과 동작만 가져오고 구조는 이 문서를 따른다.
2. `src/app`은 route wrapper와 metadata만 담당한다.
3. 화면 구현은 feature 폴더에 둔다.
4. 콘텐츠는 데이터 파일이 원본이고 UI는 렌더링만 한다.
5. 반복되는 UI/유틸만 shared 영역으로 승격한다.
6. 가독성을 성능보다 먼저 본다.

## 레이어 계약

```txt
src/
  app/
    layout.tsx                -> html/body, 공통 metadata, 전역 CSS
    {route}/page.tsx          -> feature View 렌더 + metadata
  packages/
    features/{domain}/
      {Domain}.tsx            -> page-level View
      ui/{Section}.tsx        -> 의미 있는 화면 섹션 (필요할 때)
    content/                  -> 사이트 콘텐츠 데이터 (DB 대체)
    components/               -> 2곳 이상 재사용되는 UI (필요할 때 생성)
    lib/                      -> 2곳 이상 재사용되는 유틸 (필요할 때 생성)
```

의존 방향: app → features → components/lib/content. 역방향과 feature 간
import는 dependency-cruiser가 막습니다.

## Route 예시

```tsx
import type { Metadata } from 'next';
import { Schedule } from '~features/schedule/Schedule';

export const metadata: Metadata = { title: '일정·결과' };

export default function SchedulePage() {
  return <Schedule />;
}
```

동적 route(예: 선수 상세)는 `generateStaticParams`로 모든 경로를 빌드 타임에
만들고 `dynamicParams = false`로 둡니다.

## Content 규칙

- 콘텐츠 타입과 데이터를 같은 파일에 둡니다. 예: `players.ts`에 `Player` 타입과
  `PLAYERS` 배열.
- 날짜는 ISO 문자열(`'2026-10-13'`)로 저장하고 표시할 때만 포맷합니다.
- 이미지는 `src/packages/content/images`에 두고 데이터 파일에서 static import 합니다.
  문자열 경로를 쓰면 GitHub Pages basePath가 붙지 않아 깨집니다.
- 학생 개인정보는 보호자 동의 범위만 넣습니다. 동의가 철회되면 데이터와 이미지를
  함께 지웁니다.
- 마크다운/CMS가 필요해지면 그때 도입합니다. 먼저 TS 데이터로 시작합니다.

## Shared 승격 기준

- 2개 이상의 feature에서 재사용된다.
- 접근성·keyboard interaction이 공통으로 필요하다.

그 외에는 feature 내부에 둡니다.
