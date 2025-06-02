'use client';

import { useEffect } from 'react';

interface CacheOptimizerProps {
  criticalResources?: string[];
}

export default function CacheOptimizer({
  criticalResources = [],
}: CacheOptimizerProps) {
  useEffect(() => {
    // Preload critical resources
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;

      // Determine resource type based on extension
      if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) {
        link.as = 'image';
      } else if (resource.match(/\.(woff|woff2|ttf|otf|eot)$/)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }

      document.head.appendChild(link);
    });

    // Set up cache optimization headers via meta tags
    const cacheMetaTags = [
      { 'http-equiv': 'Cache-Control', content: 'public, max-age=31536000' },
      { name: 'cache-control', content: 'public, max-age=31536000' },
    ];

    cacheMetaTags.forEach(meta => {
      const existingMeta = document.querySelector(
        `meta[http-equiv="${meta['http-equiv']}"], meta[name="${meta.name}"]`
      );

      if (!existingMeta) {
        const metaTag = document.createElement('meta');
        if (meta['http-equiv'])
          metaTag.setAttribute('http-equiv', meta['http-equiv']);
        if (meta.name) metaTag.setAttribute('name', meta.name);
        metaTag.content = meta.content;
        document.head.appendChild(metaTag);
      }
    });

    // Register service worker if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log(
            'SW: Service Worker registered successfully:',
            registration
          );
        })
        .catch(error => {
          console.log('SW: Service Worker registration failed:', error);
        });
    }

    // Implement cache warming for critical assets
    if ('caches' in window) {
      const warmCache = async () => {
        try {
          const cache = await caches.open('critical-assets-v1');
          const requests = criticalResources.map(
            resource => new Request(resource)
          );

          await Promise.allSettled(
            requests.map(async request => {
              try {
                const response = await fetch(request);
                if (response.ok) {
                  await cache.put(request, response);
                }
              } catch (error) {
                console.warn('Cache warming failed for:', request.url, error);
              }
            })
          );
        } catch (error) {
          console.warn('Cache warming initialization failed:', error);
        }
      };

      // Warm cache after a delay to not interfere with initial page load
      setTimeout(warmCache, 2000);
    }
  }, [criticalResources]);

  return null;
}
