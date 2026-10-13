const fs = require('node:fs');
const path = require('node:path');

const SOURCE_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.md',
  '.yml',
  '.yaml',
]);
const DEFAULT_SCAN_DIRS = ['src', '.github', 'docs/harness', 'docs/spec'];
const DEFAULT_SCAN_FILES = [
  '.npmrc',
  '.gitignore',
  'AGENTS.md',
  'PRD.md',
  'next.config.ts',
  'package.json',
  'pnpm-workspace.yaml',
];

const RULES = {
  NO_CONSOLE_LOG: 'no-console-log',
  NO_COMMITTED_NPM_TOKEN: 'no-committed-npm-token',
  NO_MUTABLE_REUSABLE_WORKFLOW_REF: 'no-mutable-reusable-workflow-ref',
  NO_WORKFLOW_SECRETS_INHERIT: 'no-workflow-secrets-inherit',
  NO_WILDCARD_NEXT_IMAGE_REMOTE_PATTERN:
    'no-wildcard-next-image-remote-pattern',
  NO_NODE20_GITHUB_ACTION_RUNTIME: 'no-node20-github-action-runtime',
  NO_RELATIVE_PARENT_IMPORT: 'no-relative-parent-import',
  NO_MUTABLE_ACTION_TAG: 'no-mutable-action-tag',
  NO_MISSING_DOC_PATH: 'no-missing-doc-path',
  NO_UNROUTED_HARNESS_DOC: 'no-unrouted-harness-doc',
  NO_DETACHED_AGENT_ENTRYPOINT: 'no-detached-agent-entrypoint',
};

const normalizePath = filePath => filePath.split(path.sep).join('/');

const getLineColumn = (content, index) => {
  const lines = content.slice(0, index).split('\n');

  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
};

const createIssue = ({ filePath, content, index, rule, message }) => ({
  filePath,
  ...getLineColumn(content, index),
  rule,
  message,
});

const addRegexIssues = ({ issues, filePath, content, regex, rule, message }) => {
  for (const match of content.matchAll(regex)) {
    issues.push(
      createIssue({ filePath, content, index: match.index ?? 0, rule, message })
    );
  }
};

const isSrcCodeFile = filePath =>
  filePath.startsWith('src/') && /\.(?:ts|tsx|js|jsx)$/.test(filePath);

const isGitHubWorkflowFile = filePath =>
  filePath.startsWith('.github/workflows/') && /\.ya?ml$/.test(filePath);

const isMarkdownFile = filePath => path.extname(filePath) === '.md';

// 문서가 가리키는 저장소 경로를 backtick(`src/app`)과 markdown link 양쪽에서 걷는다.
const DOC_PATH_PATTERNS = [
  /`((?:src|docs|scripts)\/[^`\s]+)`/g,
  /\]\(((?:src|docs|scripts)\/[^)\s]+)\)/g,
];

// `{domain}`, `*` 는 자리표시자이므로 잘라내고 상위 디렉터리 존재만 확인한다.
// `<topic>` 처럼 사람이 채우는 템플릿 경로는 검사 대상이 아니다.
const toCheckableDocPath = rawPath => {
  if (rawPath.includes('<')) {
    return null;
  }

  const trimmed = rawPath.replace(/[#{*].*$/, '').replace(/\/+$/, '');

  return trimmed.length > 0 ? trimmed : null;
};

const addMissingDocPathIssues = ({ issues, filePath, content, pathExists }) => {
  for (const pattern of DOC_PATH_PATTERNS) {
    for (const match of content.matchAll(pattern)) {
      const checkablePath = toCheckableDocPath(match[1]);

      if (checkablePath === null || pathExists(checkablePath)) {
        continue;
      }

      issues.push(
        createIssue({
          filePath,
          content,
          index: match.index ?? 0,
          rule: RULES.NO_MISSING_DOC_PATH,
          message: `문서가 가리키는 ${checkablePath} 경로가 저장소에 없습니다. 실제 경로로 고치세요.`,
        })
      );
    }
  }
};

const defaultPathExists = targetPath =>
  fs.existsSync(path.join(process.cwd(), targetPath));

const checkContent = (filePath, content, pathExists = defaultPathExists) => {
  const normalizedPath = normalizePath(filePath);
  const issues = [];
  const add = (regex, rule, message) =>
    addRegexIssues({
      issues,
      filePath: normalizedPath,
      content,
      regex,
      rule,
      message,
    });

  if (isMarkdownFile(normalizedPath)) {
    addMissingDocPathIssues({
      issues,
      filePath: normalizedPath,
      content,
      pathExists,
    });
    return issues;
  }

  if (isSrcCodeFile(normalizedPath)) {
    add(
      /(?:from\s+|import\s*\(\s*)['"]\.\.\/[^'"]*['"]/g,
      RULES.NO_RELATIVE_PARENT_IMPORT,
      "'../' 상대 경로 import 대신 path alias(~features/*, ~components/* 등)를 사용하세요."
    );
    add(
      /console\.log\s*\(/g,
      RULES.NO_CONSOLE_LOG,
      'console.log를 커밋하지 마세요. 필요한 경우 console.warn/error만 사용합니다.'
    );
  }

  if (normalizedPath === '.npmrc') {
    add(
      /(?:_authToken|npm_[A-Za-z0-9]+)/g,
      RULES.NO_COMMITTED_NPM_TOKEN,
      '.npmrc에는 npm auth token을 커밋하지 말고 로컬/CI secret으로 주입하세요.'
    );
  }

  if (isGitHubWorkflowFile(normalizedPath)) {
    add(
      /uses:\s+(?:actions\/(?:checkout|setup-node)|pnpm\/action-setup)@v4\b/g,
      RULES.NO_NODE20_GITHUB_ACTION_RUNTIME,
      'GitHub Actions JavaScript action은 Node 24 runtime 지원 major version으로 업데이트하세요.'
    );
    add(
      /uses:\s+[^#\n]+\.github\/workflows\/[^@\s]+@(?:master|main)\b/g,
      RULES.NO_MUTABLE_REUSABLE_WORKFLOW_REF,
      'Reusable workflow는 @master/@main 대신 검토된 commit SHA로 pin 하세요.'
    );
    add(
      /uses:\s+[^\s#@]+@(?![a-f0-9]{40}(?:\s|$))[^\s#]+/gm,
      RULES.NO_MUTABLE_ACTION_TAG,
      'GitHub Action은 mutable 태그(@vN 등) 대신 40자 commit SHA로 pin 하세요.'
    );
    add(
      /secrets:\s*inherit\b/g,
      RULES.NO_WORKFLOW_SECRETS_INHERIT,
      'secrets: inherit 대신 필요한 secret만 명시적으로 전달하세요.'
    );
  }

  if (normalizedPath === 'next.config.ts') {
    add(
      /hostname:\s*['"]\*\*['"]/g,
      RULES.NO_WILDCARD_NEXT_IMAGE_REMOTE_PATTERN,
      'next/image remotePatterns는 wildcard host 대신 필요한 origin만 허용하세요.'
    );
  }

  return issues;
};

const collectFiles = (
  rootDir,
  scanDirs = DEFAULT_SCAN_DIRS,
  scanFiles = DEFAULT_SCAN_FILES
) => {
  const files = [];

  const visit = currentDir => {
    if (!fs.existsSync(currentDir)) {
      return;
    }

    for (const dirent of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const absolutePath = path.join(currentDir, dirent.name);

      if (dirent.isDirectory()) {
        if (dirent.name !== 'node_modules' && dirent.name !== '.next') {
          visit(absolutePath);
        }
        continue;
      }

      if (SOURCE_EXTENSIONS.has(path.extname(dirent.name))) {
        files.push(absolutePath);
      }
    }
  };

  for (const scanDir of scanDirs) {
    visit(path.join(rootDir, scanDir));
  }

  for (const scanFile of scanFiles) {
    const absolutePath = path.join(rootDir, scanFile);
    if (fs.existsSync(absolutePath)) {
      files.push(absolutePath);
    }
  }

  return files;
};

// 에이전트별 진입 파일은 AGENTS.md 심링크다. 실체 파일로 갈라지는 순간
// Claude/Gemini/Codex 가 서로 다른 룰을 읽게 되므로 링크 자체를 검사한다.
const AGENT_KERNEL_FILE = 'AGENTS.md';
const AGENT_ENTRYPOINT_LINKS = ['CLAUDE.md', 'GEMINI.md'];

const createRepoIssue = (filePath, rule, message) => ({
  filePath,
  line: 1,
  column: 1,
  rule,
  message,
});

const checkAgentEntrypoints = rootDir =>
  AGENT_ENTRYPOINT_LINKS.flatMap(linkName => {
    let target = null;
    try {
      target = fs.readlinkSync(path.join(rootDir, linkName));
    } catch {
      target = null;
    }

    return target === AGENT_KERNEL_FILE
      ? []
      : [
          createRepoIssue(
            linkName,
            RULES.NO_DETACHED_AGENT_ENTRYPOINT,
            `${linkName}은 ${AGENT_KERNEL_FILE} 심링크여야 합니다. ln -sf ${AGENT_KERNEL_FILE} ${linkName} 로 복구하세요.`
          ),
        ];
  });

// router 가 가리키지 않는 harness 문서는 에이전트가 존재조차 알 수 없다.
const ROUTER_FILES = ['AGENTS.md', 'docs/spec/CONTEXT_MAP.md'];
const HARNESS_DOC_DIR = 'docs/harness';

const checkHarnessDocRouting = rootDir => {
  const harnessDir = path.join(rootDir, HARNESS_DOC_DIR);

  if (!fs.existsSync(harnessDir)) {
    return [];
  }

  const routerText = ROUTER_FILES.map(routerFile => {
    const absolutePath = path.join(rootDir, routerFile);
    return fs.existsSync(absolutePath)
      ? fs.readFileSync(absolutePath, 'utf8')
      : '';
  }).join('\n');

  return fs
    .readdirSync(harnessDir)
    .filter(name => name.endsWith('.md') && !routerText.includes(name))
    .map(name =>
      createRepoIssue(
        `${HARNESS_DOC_DIR}/${name}`,
        RULES.NO_UNROUTED_HARNESS_DOC,
        `${ROUTER_FILES.join(' 또는 ')} 중 한 곳에서 이 문서를 가리키세요. 라우터에 없으면 읽히지 않습니다.`
      )
    );
};

const runStaticRules = (rootDir = process.cwd()) => {
  const issues = [];
  const pathExists = targetPath => fs.existsSync(path.join(rootDir, targetPath));

  for (const absolutePath of collectFiles(rootDir)) {
    const relativePath = normalizePath(path.relative(rootDir, absolutePath));
    const content = fs.readFileSync(absolutePath, 'utf8');
    issues.push(...checkContent(relativePath, content, pathExists));
  }

  issues.push(...checkAgentEntrypoints(rootDir));
  issues.push(...checkHarnessDocRouting(rootDir));

  return issues;
};

const main = () => {
  const issues = runStaticRules();

  if (issues.length > 0) {
    console.error(`\nHarness static rules failed: ${issues.length} issue(s).`);
    console.error('See docs/harness/implementation-checklist.md for guidance.');
    for (const issue of issues) {
      console.error(
        `${issue.filePath}:${issue.line}:${issue.column} ${issue.rule} - ${issue.message}`
      );
    }
    process.exit(1);
  }

  console.info('Harness static rules passed.');
};

if (require.main === module) {
  main();
}

module.exports = {
  RULES,
  checkAgentEntrypoints,
  checkContent,
  checkHarnessDocRouting,
  collectFiles,
  runStaticRules,
};
