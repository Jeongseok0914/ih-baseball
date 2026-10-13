# Implementation Checklist

## 구현 전

- 요청 타입을 분류했는가?
- 새 페이지·콘텐츠면 `project-blueprint.md`를 읽었는가?
- 기존 feature/components/lib/content에서 재사용할 것이 있는가?
- 보안/의존성/배포/workflow 변경이면 `security-review-workflow.md`를 읽었는가?

## 구조

- `src/app`은 thin wrapper인가?
- 콘텐츠를 컴포넌트에 하드코딩하지 않고 `~content/*`에서 읽는가?
- 서버 전용 기능 없이 정적 export로 빌드되는가?
- 동적 route는 `generateStaticParams`와 `dynamicParams = false`를 쓰는가?
- 새 공통 컴포넌트가 정말 2곳 이상 재사용되는가?

## UI / 접근성

- 모바일 폭에서 넘치거나 가로 스크롤이 생기지 않는가?
- heading 순서가 의미에 맞는가? 페이지당 `h1` 하나인가?
- 모든 이미지에 의미 있는 `alt`(장식이면 `alt=""`)가 있는가?
- icon-only button/link에 `aria-label`이 있는가?
- 색 대비가 충분한가?

## 콘텐츠 / 개인정보

- 학생 사진·실명·학년이 보호자 동의 범위 안인가?
- 연락처는 학교·팀 공식 연락처만 쓰는가?

## 타입과 가독성

- `any`를 쓰지 않았는가?
- 이름이 역할을 설명하는가?
- `useMemo`, `useCallback`, `React.memo`를 이유 없이 쓰지 않았는가?
  (React Compiler가 켜져 있습니다.)

## 검증

검증 강도는 [AGENTS.md §7 Verify / Commit Gate](../../AGENTS.md#7-verify--commit-gate)가
단일 기준입니다.
