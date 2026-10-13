import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  RULES,
  analyzeCaches,
  analyzeCleanScript,
  analyzeDependencies,
  analyzeProcesses,
  collapseProcessTrees,
  findProjectProcesses,
} = require('./check-project-health.js');

const rulesOf = issues => issues.map(issue => issue.rule);

test('Next 프로젝트는 명시적인 clean script를 요구한다', () => {
  const missing = analyzeCleanScript({
    dependencies: { next: '16.2.11' },
    scripts: {},
  });
  assert.deepEqual(rulesOf(missing), [RULES.MISSING_NEXT_CLEAN_SCRIPT]);

  const valid = analyzeCleanScript({
    dependencies: { next: '16.2.11' },
    scripts: { clean: 'node scripts/clean.js .next' },
  });
  assert.equal(valid.length, 0);
});

test('미참조 dependency와 tooling-only dependency를 구분한다', () => {
  const issues = analyzeDependencies({
    packageJson: {
      dependencies: {
        axios: '^1.19.0',
        'fs-extra': '^11.3.3',
        'unused-package': '1.0.0',
      },
    },
    runtimeCorpus: "import axios from 'axios';",
    toolingCorpus: "const fs = require('fs-extra');",
  });

  assert.deepEqual(rulesOf(issues), [
    RULES.TOOLING_RUNTIME_DEPENDENCY,
    RULES.UNREFERENCED_RUNTIME_DEPENDENCY,
  ]);
});

test('dependency allowlist는 명시한 package만 유예한다', () => {
  const issues = analyzeDependencies({
    packageJson: {
      dependencies: { 'framework-loaded': '1.0.0' },
      projectHealth: {
        dependencyAllowlist: {
          'framework-loaded': 'Framework loads this package by name.',
        },
      },
    },
    runtimeCorpus: '',
    toolingCorpus: '',
  });
  assert.equal(issues.length, 0);
});

test('cache limit 초과를 감지한다', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'project-health-'));
  try {
    mkdirSync(join(rootDir, '.next'));
    writeFileSync(join(rootDir, '.next', 'cache.bin'), Buffer.alloc(2048));

    const result = analyzeCaches({
      rootDir,
      config: { cacheLimitMb: 0.001, cachePaths: ['.next'] },
    });
    assert.deepEqual(rulesOf(result.issues), [RULES.CACHE_TOO_LARGE]);
    assert.equal(result.issues[0].severity, 'warning');
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
});

test('하나의 dev process tree는 중복으로 세지 않는다', () => {
  const processes = collapseProcessTrees([
    { pid: 10, ppid: 1, command: 'next dev', kind: 'dev-server' },
    { pid: 11, ppid: 10, command: 'next dev', kind: 'dev-server' },
  ]);
  assert.deepEqual(processes.map(process => process.pid), [10]);
  assert.equal(analyzeProcesses(processes).length, 0);
});

test('현재 프로젝트 cwd의 process만 검사한다', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'project-health-process-'));
  try {
    const processes = findProjectProcesses(
      rootDir,
      [
        { pid: 10, ppid: 1, command: 'next dev', cwd: rootDir },
        { pid: 20, ppid: 1, command: 'next dev', cwd: tmpdir() },
      ],
      () => null
    );
    assert.deepEqual(processes.map(process => process.pid), [10]);
  } finally {
    rmSync(rootDir, { recursive: true, force: true });
  }
});

test('서로 다른 dev server와 watcher 중복을 감지한다', () => {
  const issues = analyzeProcesses([
    { pid: 10, kind: 'dev-server' },
    { pid: 20, kind: 'dev-server' },
    { pid: 30, kind: 'asset-watcher' },
    { pid: 40, kind: 'asset-watcher' },
  ]);
  assert.deepEqual(rulesOf(issues), [
    RULES.DUPLICATE_PROJECT_PROCESS,
    RULES.DUPLICATE_PROJECT_PROCESS,
  ]);
  assert.ok(issues.every(issue => issue.severity === 'warning'));
});
