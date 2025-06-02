import type { NextConfig } from 'next';
import withPWA from 'next-pwa';
import crypto from 'crypto';

const nextConfig: NextConfig = {
  images: {
    domains: ['zdravievpraxi.sk', 'admin.zdravievpraxi.sk'],
    minimumCacheTTL: 3600,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1600, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: 'default',
  },

  // Cache handler
  cacheHandler: require.resolve(
    'next/dist/server/lib/incremental-cache/file-system-cache.js'
  ),

  // Enhanced security and cache headers
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
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'unsafe-none',
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin-allow-popups',
        },
        {
          key: 'Cross-Origin-Resource-Policy',
          value: 'cross-origin',
        },
      ],
    },
    // Static assets cache policy
    {
      source: '/(.*)\\.(js|css|woff|woff2|ttf|otf|eot)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    // Images cache policy
    {
      source: '/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    // API routes cache policy
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ],

  // External packages for server components
  serverExternalPackages: ['sharp'],

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

  // Enhanced PWA config with better cache strategies
  ...withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
      // WordPress API and images
      {
        urlPattern: /^https:\/\/admin\.zdravievpraxi\.sk\/.*$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'wordpress-api',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      // Static images with long cache
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-images',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      // Google Analytics with extended cache
      {
        urlPattern: /^https:\/\/www\.google-analytics\.com\/.*$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-analytics',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days instead of 2h
          },
        },
      },
      // Google Tag Manager with extended cache
      {
        urlPattern: /^https:\/\/www\.googletagmanager\.com\/.*$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-tagmanager',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      // Google Ads scripts with extended cache
      {
        urlPattern: /^https:\/\/pagead2\.googlesyndication\.com\/.*\.js$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-ads-scripts',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
          },
        },
      },
      // Google Fonts with long cache
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-fonts-stylesheets',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-webfonts',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
          },
        },
      },
      // Next.js static assets
      {
        urlPattern: /^\/_next\/static\/.*$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'next-static',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
          },
        },
      },
      // App pages with network first strategy
      {
        urlPattern: /^\/(?!api\/).*$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 1 day
          },
          networkTimeoutSeconds: 3,
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
    optimizePackageImports: ['@wordpress/block-library'],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
    optimizeServerReact: true,
  },

  // Webpack optimizations for reducing unused JavaScript
  webpack: (config, { dev, isServer }) => {
    // Only optimize for production client builds
    if (!dev && !isServer) {
      // Enhanced code splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // Framework chunk (React, React-DOM)
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // WordPress libraries
          wordpress: {
            test: /[\\/]node_modules[\\/]@wordpress[\\/]/,
            name: 'wordpress',
            priority: 35,
            reuseExistingChunk: true,
          },
          // Large libraries
          lib: {
            test(module: { size: () => number; identifier: () => string }) {
              return (
                module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier())
              );
            },
            name(module: { identifier: () => string }) {
              const hash = crypto.createHash('sha1');
              hash.update(module.identifier());
              return 'lib-' + hash.digest('hex').substring(0, 8);
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // Common modules
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          },
          // Default group
          default: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
        maxInitialRequests: 25,
        maxAsyncRequests: 30,
      };

      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Module concatenation (scope hoisting)
      config.optimization.concatenateModules = true;

      // Remove unused CSS optimization
      if (config.optimization.minimizer) {
        config.optimization.minimizer.forEach(
          (minimizer: {
            constructor: { name: string };
            options?: { minimizerOptions?: unknown };
          }) => {
            if (minimizer.constructor.name === 'CssMinimizerPlugin') {
              minimizer.options = minimizer.options || {};
              minimizer.options.minimizerOptions = {
                ...((minimizer.options.minimizerOptions as object) || {}),
                preset: [
                  'default',
                  {
                    discardComments: { removeAll: true },
                    discardUnused: true,
                    mergeIdents: true,
                    reduceIdents: true,
                    minifySelectors: true,
                  },
                ],
              };
            }
          }
        );
      }
    }

    return config;
  },

  // Output optimization
  output: 'standalone',
};

export default nextConfig;
