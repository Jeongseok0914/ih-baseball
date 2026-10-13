# Review Checklist

커밋, PR, 작업 완료 전 확인합니다.

## 변경 범위

- 요청과 무관한 파일을 수정하지 않았는가?
- 기존 사용자 변경을 되돌리지 않았는가?
- 새 파일 위치가 `project-blueprint.md` 구조에 맞는가?

## 품질

- `implementation-checklist.md`의 구조·접근성·개인정보 항목을 지켰는가?
- 로딩/빈 상태가 필요한 곳에 있는가? (예: 일정이 없을 때 안내 문구)
- `console.log`, `any`, `var`, `==`, `!=`가 없는가?

## 보안 / Health

- 토큰·시크릿 문자열이 커밋되지 않았는가?
- workflow action은 commit SHA로 pin 되었는가?
- `pnpm health:check`가 통과하는가?

## Commit Gate

[AGENTS.md §7 Verify / Commit Gate](../../AGENTS.md#7-verify--commit-gate)를
따릅니다. 검증 실패 시 커밋하지 않습니다.

## 완료 보고에 포함할 것

- 무엇을, 어떤 파일을 바꿨는지
- 어떤 검증을 실행했는지, 실패가 있다면 원인과 다음 행동
- 사용자가 화면에서 직접 확인할 포인트
