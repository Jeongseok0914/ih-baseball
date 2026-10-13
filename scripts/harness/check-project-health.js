#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const MEBIBYTE = 1024 * 1024;
const DEFAULT_CACHE_LIMIT_MB = 2048;
const DEFAULT_CACHE_PATHS = ['.next', '.turbo', 'node_modules/.cache'];
const RUNTIME_DIRS = ['app', 'packages', 'src', 'pages', 'components', 'i18n'];
const TOOLING_DIRS = ['modules', 'scripts', '.storybook'];
const SOURCE_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
  '.css',
  '.scss',
]);
const IGNORED_DIR_NAMES = new Set([
  '.git',
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'generated',
  'node_modules',
]);
const IMPLICIT_RUNTIME_DEPENDENCIES = new Set(['next', 'react', 'react-dom']);

const RULES = {
  CACHE_TOO_LARGE: 'cache-too-large',
  DUPLICATE_PROJECT_PROCESS: 'duplicate-project-process',
  MISSING_NEXT_CLEAN_SCRIPT: 'missing-next-clean-script',
  TOOLING_RUNTIME_DEPENDENCY: 'tooling-runtime-dependency',
  UNREFERENCED_RUNTIME_DEPENDENCY: 'unreferenced-runtime-dependency',
};

const normalizePath = filePath => path.resolve(filePath);

const normalizeExistingPath = filePath => {
  try {
    return fs.realpathSync(filePath);
  } catch {
    return normalizePath(filePath);
  }
};

const formatBytes = bytes => {
  if (bytes < MEBIBYTE) {
    return `${Math.ceil(bytes / 1024)} KiB`;
  }
  if (bytes < 1024 * MEBIBYTE) {
    return `${Math.ceil(bytes / MEBIBYTE)} MiB`;
  }
  return `${(bytes / (1024 * MEBIBYTE)).toFixed(1)} GiB`;
};

const getDirectorySize = directoryPath => {
  if (!fs.existsSync(directoryPath)) {
    return 0;
  }

  let total = 0;
  const pending = [directoryPath];

  while (pending.length > 0) {
    const currentPath = pending.pop();
    if (!currentPath) {
      continue;
    }

    let stat;
    try {
      stat = fs.lstatSync(currentPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        continue;
      }
      throw error;
    }
    if (stat.isSymbolicLink()) {
      continue;
    }
    if (stat.isFile()) {
      total += stat.size;
      continue;
    }
    if (!stat.isDirectory()) {
      continue;
    }

    for (const entry of fs.readdirSync(currentPath)) {
      pending.push(path.join(currentPath, entry));
    }
  }

  return total;
};

const isTestFile = filePath => /\.(?:spec|test)\.[cm]?[jt]sx?$/.test(filePath);

const collectSourceFiles = (rootDir, relativeDirs) => {
  const files = [];
  const visit = currentDir => {
    if (!fs.existsSync(currentDir)) {
      return;
    }

    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.isDirectory() && IGNORED_DIR_NAMES.has(entry.name)) {
        continue;
      }

      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath);
      } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
        files.push(absolutePath);
      }
    }
  };

  for (const relativeDir of relativeDirs) {
    visit(path.join(rootDir, relativeDir));
  }

  return files;
};

const readCorpus = files =>
  files.map(filePath => fs.readFileSync(filePath, 'utf8')).join('\n');

const collectDependencyEvidence = (rootDir, packageJson) => {
  const applicationFiles = collectSourceFiles(rootDir, RUNTIME_DIRS);
  const runtimeFiles = applicationFiles.filter(filePath => !isTestFile(filePath));
  const toolingFiles = [
    ...applicationFiles.filter(isTestFile),
    ...collectSourceFiles(rootDir, TOOLING_DIRS),
  ];

  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    if (!entry.isFile() || !SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      continue;
    }

    const absolutePath = path.join(rootDir, entry.name);
    if (/^(?:middleware|proxy|instrumentation)\.[cm]?[jt]sx?$/.test(entry.name)) {
      runtimeFiles.push(absolutePath);
    } else {
      toolingFiles.push(absolutePath);
    }
  }

  return {
    runtimeCorpus: readCorpus(runtimeFiles),
    toolingCorpus: `${readCorpus(toolingFiles)}\n${JSON.stringify(packageJson.scripts ?? {})}`,
  };
};

const hasDependencyReference = (corpus, dependency) => {
  return ['"', "'", '`'].some(
    quote =>
      corpus.includes(`${quote}${dependency}${quote}`) ||
      corpus.includes(`${quote}${dependency}/`)
  );
};

const getAllowlistedDependencies = config => {
  const allowlist = config.dependencyAllowlist ?? {};
  return new Set(
    Array.isArray(allowlist) ? allowlist : Object.keys(allowlist)
  );
};

const analyzeDependencies = ({ packageJson, runtimeCorpus, toolingCorpus }) => {
  const issues = [];
  const dependencies = Object.keys(packageJson.dependencies ?? {});
  const allowlist = getAllowlistedDependencies(packageJson.projectHealth ?? {});

  for (const dependency of dependencies) {
    if (allowlist.has(dependency) || IMPLICIT_RUNTIME_DEPENDENCIES.has(dependency)) {
      continue;
    }

    const runtimeReference = hasDependencyReference(runtimeCorpus, dependency);
    const toolingReference = hasDependencyReference(toolingCorpus, dependency);

    if (dependency.startsWith('@types/') || (!runtimeReference && toolingReference)) {
      issues.push({
        rule: RULES.TOOLING_RUNTIME_DEPENDENCY,
        message:
          `${dependency} is used only by tests/build tooling. Move it to ` +
          'devDependencies or document the runtime reason in projectHealth.dependencyAllowlist.',
      });
      continue;
    }

    if (!runtimeReference && !toolingReference) {
      issues.push({
        rule: RULES.UNREFERENCED_RUNTIME_DEPENDENCY,
        message:
          `${dependency} has no source, config, or package-script reference. Remove it ` +
          'or document its implicit use in projectHealth.dependencyAllowlist.',
      });
    }
  }

  return issues;
};

const analyzeCleanScript = packageJson => {
  const dependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
  };
  if (!dependencies.next) {
    return [];
  }

  const cleanScript = packageJson.scripts?.clean ?? '';
  if (cleanScript.includes('.next')) {
    return [];
  }

  return [
    {
      rule: RULES.MISSING_NEXT_CLEAN_SCRIPT,
      message:
        'Next.js projects must provide a clean script that explicitly removes .next. ' +
        'The health check never deletes caches automatically.',
    },
  ];
};

const analyzeCaches = ({ rootDir, config }) => {
  const cacheLimitMb = config.cacheLimitMb ?? DEFAULT_CACHE_LIMIT_MB;
  const cacheLimitBytes = cacheLimitMb * MEBIBYTE;
  const cachePaths = config.cachePaths ?? DEFAULT_CACHE_PATHS;
  const issues = [];
  const sizes = [];

  for (const cachePath of cachePaths) {
    const size = getDirectorySize(path.join(rootDir, cachePath));
    sizes.push({ cachePath, size });
    if (size > cacheLimitBytes) {
      issues.push({
        rule: RULES.CACHE_TOO_LARGE,
        severity: 'warning',
        message:
          `${cachePath} is ${formatBytes(size)} (limit ${cacheLimitMb} MiB). ` +
          'Stop the dev server, then run the project clean command.',
      });
    }
  }

  return { issues, sizes };
};

const getProcessKind = command => {
  if (
    /(?:^|\s)(?:\S*\/)?next(?:\.js)?\s+dev(?:\s|$)/.test(command) ||
    /\/next\/dist\/bin\/next\s+dev(?:\s|$)/.test(command) ||
    /(?:^|\s)react-scripts\s+start(?:\s|$)/.test(command) ||
    /(?:^|\s)webpack\s+serve(?:\s|$)/.test(command)
  ) {
    return 'dev-server';
  }

  if (
    /\/vite(?:\/bin\/vite\.js|\.js)?(?:\s|$)/.test(command) &&
    !/\bvite\s+(?:build|preview)(?:\s|$)/.test(command)
  ) {
    return 'dev-server';
  }

  if (/svg-watcher(?:\.js)?(?:\s|$)/.test(command)) {
    return 'asset-watcher';
  }

  return null;
};

const readProcessList = () => {
  const result = spawnSync('ps', ['-axo', 'pid=,ppid=,command='], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    return [];
  }

  return result.stdout
    .split('\n')
    .flatMap(line => {
      const match = line.match(/^\s*(\d+)\s+(\d+)\s+(.+)$/);
      return match
        ? [
            {
              pid: Number(match[1]),
              ppid: Number(match[2]),
              command: match[3],
            },
          ]
        : [];
    });
};

const readProcessCwd = pid => {
  try {
    return fs.realpathSync(`/proc/${pid}/cwd`);
  } catch {
    const result = spawnSync('lsof', ['-a', '-p', String(pid), '-d', 'cwd', '-Fn'], {
      encoding: 'utf8',
    });
    const cwdLine = result.stdout
      .split('\n')
      .find(line => line.startsWith('n'));
    return cwdLine ? cwdLine.slice(1) : null;
  }
};

const collapseProcessTrees = processes => {
  const processByPid = new Map(processes.map(process => [process.pid, process]));
  return processes.filter(process => {
    const parent = processByPid.get(process.ppid);
    return !parent || parent.kind !== process.kind;
  });
};

const findProjectProcesses = (
  rootDir,
  processList = readProcessList(),
  getCwd = readProcessCwd
) => {
  const normalizedRoot = normalizePath(rootDir);
  const realRoot = normalizeExistingPath(rootDir);

  const matching = processList.flatMap(process => {
    const kind = getProcessKind(process.command);
    if (!kind) {
      return [];
    }

    const cwd = process.cwd ?? getCwd(process.pid);
    const normalizedCwd = cwd === null ? null : normalizeExistingPath(cwd);
    const belongsToProject =
      process.command.includes(normalizedRoot) ||
      process.command.includes(realRoot) ||
      normalizedCwd === realRoot;

    return belongsToProject ? [{ ...process, kind }] : [];
  });

  return collapseProcessTrees(matching);
};

const analyzeProcesses = processes => {
  const issues = [];
  for (const kind of ['dev-server', 'asset-watcher']) {
    const matching = processes.filter(process => process.kind === kind);
    if (matching.length > 1) {
      issues.push({
        rule: RULES.DUPLICATE_PROJECT_PROCESS,
        severity: 'warning',
        message:
          `${matching.length} ${kind} processes are running for this project ` +
          `(PIDs: ${matching.map(process => process.pid).join(', ')}). Stop stale processes.`,
      });
    }
  }
  return issues;
};

const runProjectHealth = (rootDir = process.cwd()) => {
  const packagePath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const config = packageJson.projectHealth ?? {};
  const evidence = collectDependencyEvidence(rootDir, packageJson);
  const cacheResult = analyzeCaches({ rootDir, config });
  const processes = config.processCheck === false ? [] : findProjectProcesses(rootDir);
  const issues = [
    ...analyzeCleanScript(packageJson),
    ...analyzeDependencies({ packageJson, ...evidence }),
    ...cacheResult.issues,
    ...analyzeProcesses(processes),
  ];

  return {
    issues,
    cacheSizes: cacheResult.sizes,
    dependencyCount: Object.keys(packageJson.dependencies ?? {}).length,
    processes,
  };
};

const main = () => {
  const result = runProjectHealth();
  const warnings = result.issues.filter(issue => issue.severity === 'warning');
  const errors = result.issues.filter(issue => issue.severity !== 'warning');

  for (const warning of warnings) {
    console.warn(`project-health/${warning.rule} - ${warning.message}`);
  }

  if (errors.length > 0) {
    for (const issue of errors) {
      console.error(`project-health/${issue.rule} - ${issue.message}`);
    }
    console.error(`\nProject health failed: ${errors.length} error(s).`);
    console.error('See docs/harness/project-health-workflow.md for guidance.');
    process.exitCode = 1;
    return;
  }

  const cacheSummary = result.cacheSizes
    .filter(cache => cache.size > 0)
    .map(cache => `${cache.cachePath} ${formatBytes(cache.size)}`)
    .join(', ');
  console.info(
    `Project health passed: ${result.dependencyCount} runtime dependencies` +
      `${cacheSummary ? `; ${cacheSummary}` : ''}` +
      `${warnings.length > 0 ? `; ${warnings.length} warning(s)` : ''}.`
  );
};

if (require.main === module) {
  main();
}

module.exports = {
  DEFAULT_CACHE_LIMIT_MB,
  RULES,
  analyzeCaches,
  analyzeCleanScript,
  analyzeDependencies,
  analyzeProcesses,
  collapseProcessTrees,
  findProjectProcesses,
  formatBytes,
  getDirectorySize,
  getProcessKind,
  runProjectHealth,
};
