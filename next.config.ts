import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // DB·서버 없이 순수 정적 사이트로 배포한다. `pnpm build` 결과는 out/.
  output: 'export',
  // GitHub Pages 프로젝트 사이트(/ih-baseball) 경로. CI가 configure-pages 값으로 주입하고
  // 커스텀 도메인 연결 후에는 빈 값이 되어 루트에서 서빙된다.
  basePath: process.env.PAGES_BASE_PATH || undefined,
  poweredByHeader: false,
  reactCompiler: true,
  // 정적 export 에는 image optimizer 서버가 없다.
  images: { unoptimized: true },
};

export default nextConfig;
