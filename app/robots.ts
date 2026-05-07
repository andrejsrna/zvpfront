import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/search',
          '/search?*',
          '/vyhladavanie',
          '/*?utm_*',
          '/*?ref=*',
          '/*?fbclid=*',
        ],
      },
    ],
    sitemap: 'https://zdravievpraxi.sk/sitemap.xml',
    host: 'https://zdravievpraxi.sk',
  };
}
