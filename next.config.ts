import type { NextConfig } from "next";

// GitHub Pages serves project sites at https://<user>.github.io/<repo>/, so
// every asset URL needs that repo-name prefix. The deploy workflow
// (.github/workflows/deploy-pages.yml) sets NEXT_BASE_PATH to the actual
// repo name at build time via ${{ github.event.repository.name }} — locally
// it's unset, so `npm run dev`/`npm run build` behave normally at "/".
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint is run separately in CI (see .github/workflows/ci.yml) so it
    // never silently blocks a local build; keep this true to fail fast.
    ignoreDuringBuilds: false,
  },
  // Static export: GitHub Pages only serves static files, no Node runtime.
  // This build is compatible because the landing page has no API routes,
  // no dynamic route segments, and no server-only features — every page is
  // pre-rendered at build time from data/stocks.json (or the live API if
  // API_BASE_URL is set at build time, see lib/config.ts).
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    // next/image's optimization API needs a server; static export has
    // none. Not used on the current landing page, but set for safety if
    // images are added later.
    unoptimized: true,
  },
};

export default nextConfig;
