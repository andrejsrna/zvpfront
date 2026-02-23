import type { MetadataRoute } from 'next';

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
          '/wp-admin/',
          '/wp-includes/',
          '/wp-content/plugins/',
          '/wp-content/themes/',
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
