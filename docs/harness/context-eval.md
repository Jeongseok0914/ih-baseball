# Harness Context Eval

| 요청 | 처음 읽을 context | 성공 기준 |
|---|---|---|
| 단순 문구·UI 버그 | 관련 코드 | PRD 전체를 읽지 않음 |
| 새 페이지 | PRD §3 해당 행 + blueprint | 정적 export 빌드 통과, app은 thin wrapper |
| 선수·일정 추가 | 해당 content 파일 + blueprint Content 규칙 | 컴포넌트 수정 없이 데이터만 변경 |
| dependency 보안 대응 | security workflow + package diff | quick audit와 full verify 실행 |
| cache 증가 | project health workflow | 실행 중 process를 종료/삭제하지 않음 |

필요한 문서를 반복해서 놓치거나 관련 없는 장문 문서를 매번 읽을 때만 router를
수정합니다.
