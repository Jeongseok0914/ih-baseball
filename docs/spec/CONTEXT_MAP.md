# ih-baseball Context Map

작업에 필요한 PRD 섹션과 workflow만 읽기 위한 router입니다.

## 기본 규칙

1. 관련 코드와 호출자를 먼저 찾습니다.
2. 아래 표에서 가장 좁은 행 하나를 선택합니다.
3. PRD 섹션 1~2개, workflow 1개만 먼저 읽습니다.
4. 코드를 고치는 요청이면 선택한 행과 무관하게
   `docs/harness/implementation-checklist.md`를 함께 읽습니다.
5. 여러 페이지를 함께 바꾸거나 문서가 충돌할 때만 PRD 전체로 확장합니다.

| 작업 | PRD | Workflow / Rule |
|---|---|---|
| 문서·룰·하네스 | 제품 동작 변경 시에만 | `agent-operating-model.md`, 라우터를 고칠 때만 `context-eval.md` |
| 단순 버그·문구·리팩터링 | 관련 페이지만 | 관련 코드 |
| 새 페이지·섹션 | §3 해당 행, §4 | `project-blueprint.md` |
| 콘텐츠(선수·일정·소식) 추가/수정 | §2, §3 해당 행 | `project-blueprint.md`의 Content 규칙 |
| security/dependency/workflow | 없음 | `security-review-workflow.md` |
| cache/process/dependency hygiene | 없음 | `project-health-workflow.md` |
| 리뷰/커밋 | 변경된 페이지만 | `review-checklist.md` |

Workflow 경로는 `docs/harness/`입니다. 우선순위는 사용자 요청 → `PRD.md` →
현재 코드 → 외부 참고 자료입니다.
