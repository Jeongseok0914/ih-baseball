# Project Health Workflow

프로젝트가 코드보다 build cache와 불필요한 dependency 때문에 커지는 문제를
사전에 감지하는 공통 하네스입니다. 진단은 읽기 전용이며 cache 삭제나 process
종료를 자동 실행하지 않습니다.

## 검사 항목

`pnpm health:check`는 코드로 해결해야 하는 항목과 로컬 실행 상태를 분리합니다.

다음 항목은 실패합니다.

- Next.js 프로젝트에 `.next`를 명시적으로 제거하는 `clean` script가 없음
- `dependencies`에 참조가 없는 package가 있음
- test/build script에서만 쓰는 package 또는 `@types/*`가 `dependencies`에 있음

다음 항목은 경고만 표시하고 `verify`를 막지 않습니다.

- `.next`, `.turbo`, `node_modules/.cache` 중 하나가 기본 2GB를 초과함
- 같은 프로젝트에서 dev server 또는 asset watcher가 2개 이상 실행 중임

process 검사는 macOS/Linux에서 `ps`와 process cwd를 사용합니다. 정보를 읽을 수
없는 환경에서는 process 검사만 건너뜁니다.

## 사용법

```bash
pnpm health:check
pnpm harness:check
```

cache가 기준을 넘었으면 dev server를 먼저 종료한 뒤 명시적으로 정리합니다.

```bash
pnpm clean
```

실행 중인 dev server의 cache를 자동 삭제하면 build state가 깨질 수 있으므로
`health:check`는 삭제나 process 종료를 수행하지 않습니다.
cache와 process는 로컬 실행 상태이므로 경고로 남기고 TypeScript/build 검증은
계속 실행합니다.

## 프로젝트별 설정

기본값을 바꿔야 할 때만 `package.json`에 추가합니다.

```json
{
  "projectHealth": {
    "cacheLimitMb": 4096,
    "cachePaths": [".next", ".turbo"],
    "dependencyAllowlist": {
      "framework-loaded-package": "Framework가 package 이름으로 동적 로드한다."
    },
    "processCheck": true
  }
}
```

- `dependencyAllowlist`는 정적 검색으로 찾을 수 없는 실제 runtime dependency에만
  사용하고 이유를 남깁니다.
- 여러 환경의 dev server를 의도적으로 동시에 실행하는 프로젝트만
  `processCheck: false`를 검토합니다.
- 임계값을 높이기 전에 cache 증가 원인을 먼저 확인합니다.

## 다른 프로젝트 적용 계약

다른 Node.js 웹 프로젝트에도 다음 파일과 script 계약을 같이 적용합니다.

1. `scripts/harness/check-project-health.js`와 대응 test를 복사합니다.
2. `health:check`, `harness:check`, `harness:test`, `clean` script를 연결합니다.
3. 기본 검증인 `verify`가 `harness:check`를 실행하게 합니다.
4. dependency 변경은 `pnpm audit --audit-level high`와 full verify를 실행합니다.
5. 예외가 필요하면 코드 검색을 생략하지 말고 `dependencyAllowlist`에 이유를
   기록합니다.

이 계약을 프로젝트 bootstrap/template에 포함해야 새 프로젝트에도 자동으로
적용됩니다. 개별 저장소에 이 문서만 복사하는 것으로는 충분하지 않습니다.
