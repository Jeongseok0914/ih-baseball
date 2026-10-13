# Security Review Workflow

정적 사이트라 서버 공격 표면은 작지만, 공급망·CI·개인정보는 그대로 위험합니다.

## 언제 적용하는가

- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc` 변경
- `.github/workflows` 변경
- `next.config.ts` 변경
- 외부 URL, 임베드(지도·영상), 외부 script 추가
- 학생 개인정보가 포함된 콘텐츠 추가

## 금지 패턴

- `.npmrc` 또는 config 파일에 `_authToken`, `npm_...` 토큰 커밋
- GitHub Action을 mutable 태그(`@v6`)나 reusable workflow를 `@main`으로 호출
- GitHub Actions에서 `secrets: inherit` 사용
- `next.config.ts`의 `images.remotePatterns`에 `hostname: '**'`
- sanitizer 없이 `dangerouslySetInnerHTML` 사용
- 외부 임베드/script를 출처 확인 없이 추가 (`iframe`에는 `title`, 필요한
  `sandbox`/`allow`만 부여)

## 공급망 정책

- `pnpm-workspace.yaml`의 `minimumReleaseAge`(7일 쿨다운), `blockExoticSubdeps`,
  `trustPolicy: no-downgrade`를 유지합니다. "최신 버전"은 이 쿨다운을 통과한
  최신을 뜻합니다.
- 긴급 보안 패치로 쿨다운 예외가 필요하면 `minimumReleaseAgeExclude`에 정확한
  버전과 사유, 제거 가능 시점을 주석으로 남깁니다.

## 검증

```bash
pnpm harness:check
pnpm security:quick
pnpm verify:full
```

남은 audit advisory가 있으면 severity, package, 영향 여부, 남은 이유를 완료
보고에 적습니다.
