import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['zdravievpraxi.sk', 'admin.zdravievpraxi.sk'],
  },
  cacheHandler: require.resolve(
    'next/dist/server/lib/incremental-cache/file-system-cache.js',
),
};

export default nextConfig;
