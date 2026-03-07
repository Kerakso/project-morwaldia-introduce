import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/project-morswaldia-introduce',
  assetPrefix: '/project-morswaldia-introduce/',
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  crossOrigin: 'anonymous',
  trailingSlash: true,
};

export default nextConfig;
