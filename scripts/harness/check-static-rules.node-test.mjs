import assert from 'node:assert/strict';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const { RULES, checkAgentEntrypoints, checkContent, checkHarnessDocRouting } =
  require('./check-static-rules.js');

const rulesOf = issues => issues.map(issue => issue.rule);

const withFakeRepo = run => {
  const rootDir = mkdtempSync(join(tmpdir(), 'harness-rules-'));
  try {
    mkdirSync(join(rootDir, 'docs/harness'), { recursive: true });
    mkdirSync(join(rootDir, 'docs/spec'), { recursive: true });
    writeFileSync(join(rootDir, 'AGENTS.md'), '# kernel\n');
    writeFileSync(join(rootDir, 'docs/spec/CONTEXT_MAP.md'), '# map\n');
    run(rootDir);
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
};

test('src 코드의 부모 상대 import와 console.log를 막는다', () => {
  const issues = checkContent(
    'src/packages/features/home/Home.tsx',
    "import { SITE } from '../../content/site';\nconsole.log(SITE);\n"
  );
  assert.deepEqual(rulesOf(issues), [
    RULES.NO_RELATIVE_PARENT_IMPORT,
    RULES.NO_CONSOLE_LOG,
  ]);
  assert.deepEqual(
    checkContent('src/app/page.tsx', "import { Home } from '~features/home/Home';\n"),
    []
  );
});

test('.npmrc 토큰 커밋을 막는다', () => {
  const issues = checkContent(
    '.npmrc',
    '//registry.npmjs.org/:_authToken=npm_abc123\n'
  );
  assert.ok(rulesOf(issues).includes(RULES.NO_COMMITTED_NPM_TOKEN));
});

test('workflow는 SHA pin 과 명시적 secret 만 허용한다', () => {
  const issues = checkContent(
    '.github/workflows/ci.yml',
    [
      '      - uses: actions/checkout@v4',
      '    uses: org/repo/.github/workflows/scan.yml@main',
      '    secrets: inherit',
    ].join('\n')
  );
  assert.deepEqual(new Set(rulesOf(issues)), new Set([
    RULES.NO_NODE20_GITHUB_ACTION_RUNTIME,
    RULES.NO_MUTABLE_ACTION_TAG,
    RULES.NO_MUTABLE_REUSABLE_WORKFLOW_REF,
    RULES.NO_WORKFLOW_SECRETS_INHERIT,
  ]));

  assert.deepEqual(
    checkContent(
      '.github/workflows/ci.yml',
      '      - uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6\n'
    ),
    []
  );
});

test('next/image wildcard host 를 막는다', () => {
  const issues = checkContent('next.config.ts', "hostname: '**'");
  assert.deepEqual(rulesOf(issues), [RULES.NO_WILDCARD_NEXT_IMAGE_REMOTE_PATTERN]);
});

test('문서가 없는 경로를 가리키면 실패한다', () => {
  const exists = target => target === 'src/app';
  const issues = checkContent(
    'docs/harness/x.md',
    '`src/app` `src/gone/file.ts` `docs/plans/<topic>.md` [x](src/app/page.tsx)',
    exists
  );
  assert.deepEqual(
    issues.map(issue => issue.message.includes('src/gone/file.ts') || issue.message.includes('src/app/page.tsx')),
    [true, true]
  );
});

test('CLAUDE.md/GEMINI.md 는 AGENTS.md 심링크여야 한다', () => {
  withFakeRepo(rootDir => {
    symlinkSync('AGENTS.md', join(rootDir, 'CLAUDE.md'));
    writeFileSync(join(rootDir, 'GEMINI.md'), '# detached\n');
    const issues = checkAgentEntrypoints(rootDir);
    assert.deepEqual(issues.map(issue => issue.filePath), ['GEMINI.md']);
  });
});

test('router 에 없는 harness 문서를 찾는다', () => {
  withFakeRepo(rootDir => {
    writeFileSync(join(rootDir, 'docs/harness/orphan.md'), '# orphan\n');
    writeFileSync(join(rootDir, 'docs/harness/routed.md'), '# routed\n');
    writeFileSync(join(rootDir, 'AGENTS.md'), 'see routed.md\n');
    const issues = checkHarnessDocRouting(rootDir);
    assert.deepEqual(issues.map(issue => issue.filePath), [
      'docs/harness/orphan.md',
    ]);
  });
});
