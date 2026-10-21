# ih-baseball — Agent Kernel

인헌초등학교 야구부 홈페이지. Codex, Claude Code, Cursor 등 모든 코딩 에이전트가
공유하는 최소 규칙입니다. 상세 절차는 context router가 지정한 문서만 읽습니다.

## 1. Communication

- 한국어로 응답합니다. 코드 식별자와 기술 용어는 원문을 유지합니다.
- 결론, 근거, 검증 결과, 남은 위험 순서로 짧게 보고합니다.

## 2. 작업 계약

1. 요청을 답변/진단/설계/구현/리뷰/커밋으로 분류합니다.
2. 관련 코드, 모든 호출자, 최근 변경을 먼저 확인합니다.
3. [context map](docs/spec/CONTEXT_MAP.md)에서 가장 좁은 행을 선택합니다.
4. 지정된 문서만 읽고, 근거가 부족할 때만 범위를 넓힙니다.
5. 답변·진단·리뷰는 변경 요청이 없으면 파일을 수정하지 않습니다.
6. 구현은 승인된 범위에서 최소 변경 후 검증합니다.
7. 기존 사용자 변경과 요청 밖 파일을 보존합니다.

새 기능은 문맥 탐색 → 질문 1개씩 → 접근안과 추천안 → 승인 → 필요 시
`docs/plans/YYYY-MM-DD-<topic>-design.md` → 구현 순서입니다. 바로 구현 지시,
단순 버그·오타·커밋이면 설계를 짧게 할 수 있습니다.

## 3. Context Router

항상 [docs/spec/CONTEXT_MAP.md](docs/spec/CONTEXT_MAP.md)부터 시작합니다.

| 요청 | 필요할 때 읽을 workflow |
|---|---|
| 구조·새 페이지·콘텐츠 추가 | `project-blueprint.md` |
| security/dependency/workflow | `security-review-workflow.md` |
| cache/process/dependency hygiene | `project-health-workflow.md` |
| 하네스·라우터 자체 수정 | `context-eval.md` |
| 커밋/PR/완료 | `review-checklist.md` |

workflow 위치는 `docs/harness/`입니다. 코드를 고치는 요청이면 무엇을 골랐든
`implementation-checklist.md`를 함께 읽습니다.

## 4. 기술과 구조

- Next.js 16 App Router(정적 export), React 19, TypeScript, Tailwind CSS 4
- TypeScript 6 고정: dependency-cruiser가 TS 7을 아직 지원하지 않아 레이어 검사가 꺼진다. 지원되면 승격
- Biome, pnpm. **DB·API·서버 런타임 없음** — 순수 프론트엔드 정적 사이트
- 판단 우선순위: 가독성 → 정확성 → 성능
- `src/app`: thin route wrapper + metadata
- `src/packages/features/{domain}`: 페이지 단위 View와 섹션 UI
- `src/packages/content`: 사이트 콘텐츠 데이터(선수, 일정, 소식 등)의 원본
- `~components/*`, `~lib/*`: 2곳 이상 재사용될 때만 폴더 생성
- alias: `~components/*`, `~content/*`, `~features/*`, `~lib/*`

## 5. Hard Rules

1. `src/app`에 큰 UI나 로직을 넣지 않습니다.
2. 서버 전용 기능(route handler, Server Action, `cookies()`/`headers()`,
   ISR/revalidate, 미리 알 수 없는 dynamic route)을 쓰지 않습니다.
   `output: 'export'`가 깨집니다.
3. 콘텐츠는 컴포넌트에 하드코딩하지 않고 `~content/*` 데이터에서 읽습니다.
4. 이미지는 `src/packages/content/images`에 두고 static import(`import x from
   '~content/images/x.jpg'`)로 씁니다. basePath가 자동으로 붙습니다. 학생 사진·이름 등
   개인정보는 보호자 동의 범위만 게시합니다.
5. alias import를 사용하며 부모 상대 import는 금지합니다.
6. `console.log`, `var`, `any`, `==`, `!=`, ESLint를 추가하지 않습니다.
7. Node.js import는 `node:` protocol을 사용합니다.
8. 새 dependency는 플랫폼·기존 코드로 안 될 때만 추가합니다.

## 6. Minimal-Code Policy

- 기존 구현 → 표준 라이브러리 → 플랫폼 → 설치 dependency 순서로 재사용합니다.
- 버그는 모든 호출자를 찾아 공통 원인을 한 번 고칩니다.
- 요청되지 않은 추상화·dependency·boilerplate를 추가하지 않습니다.
- 보안, 접근성, 입력 검증 처리는 줄이지 않습니다.
- 비자명한 로직에는 가장 작은 runnable test 또는 self-check를 둡니다.

## 7. Verify / Commit Gate

| 변경 범위 | 검증 |
|---|---|
| 문서/룰만 | `git diff --check` |
| 일반 코드·콘텐츠 | `pnpm verify` |
| dependency/build/layout/config | `pnpm verify:full` |
| dependency/security/workflow | `pnpm security:quick` + 위 검증 |

- `pnpm harness:check`: 정적 룰 + dependency-cruiser + project health
- `pnpm verify`: harness + Biome + TypeScript
- `pnpm test`: `src/**/*.node-test.ts` (Node 내장 테스트, 타입 스트리핑)
- `pnpm verify:full`: verify + harness tests + test + 정적 build(`out/`)
- `pnpm preview`: build 결과(`out/`)를 로컬 정적 서버로 확인
- `pnpm clean`: dev process를 멈춘 뒤 `.next`, `out` 제거
- 배포: `master` push → `deploy-pages.yml` → GitHub Pages. 기본 브랜치는 `master`

커밋 요청 시 status와 diff를 확인하고 요청 파일만 stage합니다. 검증 실패 시
커밋하지 않습니다.

## 8. Canonical References

- context router: `docs/spec/CONTEXT_MAP.md`
- product requirements: `PRD.md`
- operating model: `docs/harness/agent-operating-model.md`
- structure: `docs/harness/project-blueprint.md`
- security: `docs/harness/security-review-workflow.md`
- project health: `docs/harness/project-health-workflow.md`
- implementation checklist: `docs/harness/implementation-checklist.md`
- completion review: `docs/harness/review-checklist.md`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
