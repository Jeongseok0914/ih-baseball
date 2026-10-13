/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-cross-feature-imports',
      comment:
        'Feature modules must not import from other feature modules. ' +
        'Move shared code down to components, lib, or content.',
      severity: 'error',
      from: { path: '^src/packages/features/([^/]+)/' },
      to: {
        path: '^src/packages/features/([^/]+)/',
        pathNot: '^src/packages/features/$1/',
      },
    },
    {
      name: 'no-packages-to-app-imports',
      comment: 'Packages must not import from the app (route) layer.',
      severity: 'error',
      from: { path: '^src/packages/' },
      to: { path: '^src/app/' },
    },
    {
      name: 'no-shared-to-feature-imports',
      comment:
        'components, lib, and content must not depend on feature modules.',
      severity: 'error',
      from: { path: '^src/packages/(components|lib|content)/' },
      to: { path: '^src/packages/features/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
};
