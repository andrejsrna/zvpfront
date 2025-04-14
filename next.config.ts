import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  images: {
    domains: ['zdravievpraxi.sk', 'admin.zdravievpraxi.sk'],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },

  // Cache handler
  cacheHandler: require.resolve(
    'next/dist/server/lib/incremental-cache/file-system-cache.js'
  ),

  // Security headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
      ],
    },
  ],

  // Redirects
  redirects: async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
  ],

  // Compression
  compress: true,

  // PWA config
  ...withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/admin\.zdravievpraxi\.sk\/.*$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'wordpress-images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dní
          },
        },
      },
    ],
  }),

  // Optimalizácie
  poweredByHeader: false,
  reactStrictMode: true,

  // Experimentálne features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};

export default nextConfig;
