import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search', '/vyhladavanie'],
      },
    ],
    sitemap: 'https://zdravievpraxi.sk/sitemap.xml',
    host: 'https://zdravievpraxi.sk',
  };
}

