// Enhanced Service Worker for better external resource caching

const CACHE_NAME = 'zdravie-v-praxi-v1.2';
const GOOGLE_ANALYTICS_CACHE = 'google-analytics-extended';
const GOOGLE_ADS_CACHE = 'google-ads-extended';

// Extended cache times for external resources
const CACHE_STRATEGIES = {
  googleAnalytics: {
    name: GOOGLE_ANALYTICS_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days instead of 2h
  },
  googleAds: {
    name: GOOGLE_ADS_CACHE,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  },
};

// Install event
self.addEventListener('install', () => {
  console.log('SW: Installing service worker');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  console.log('SW: Activating service worker');
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== GOOGLE_ANALYTICS_CACHE &&
              cacheName !== GOOGLE_ADS_CACHE
            ) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event with enhanced caching
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle Google Analytics requests
  if (url.hostname === 'www.google-analytics.com') {
    event.respondWith(handleGoogleAnalytics(request));
    return;
  }

  // Handle Google Ads requests
  if (
    url.hostname === 'pagead2.googlesyndication.com' &&
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(handleGoogleAds(request));
    return;
  }

  // Default handling for other requests
  if (request.method === 'GET') {
    event.respondWith(handleDefault(request));
  }
});

// Enhanced Google Analytics caching
async function handleGoogleAnalytics(request) {
  const cache = await caches.open(GOOGLE_ANALYTICS_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    const dateHeader = cachedResponse.headers.get('date');
    if (dateHeader) {
      const cachedDate = new Date(dateHeader);
      const now = new Date();
      const age = now.getTime() - cachedDate.getTime();

      // Use cached version if it's newer than 7 days
      if (age < CACHE_STRATEGIES.googleAnalytics.maxAge) {
        console.log('SW: Serving cached Google Analytics script');
        return cachedResponse;
      }
    }
  }

  // Fetch new version and cache it
  try {
    console.log('SW: Fetching fresh Google Analytics script');
    const response = await fetch(request);

    if (response.ok) {
      const responseToCache = response.clone();
      await cache.put(request, responseToCache);
    }

    return response;
  } catch (error) {
    console.log('SW: Network failed for Google Analytics:', error);
    return cachedResponse || new Response('Network error', { status: 408 });
  }
}

// Enhanced Google Ads caching
async function handleGoogleAds(request) {
  const cache = await caches.open(GOOGLE_ADS_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    const dateHeader = cachedResponse.headers.get('date');
    if (dateHeader) {
      const cachedDate = new Date(dateHeader);
      const now = new Date();
      const age = now.getTime() - cachedDate.getTime();

      // Use cached version if it's newer than 14 days
      if (age < CACHE_STRATEGIES.googleAds.maxAge) {
        console.log('SW: Serving cached Google Ads script');
        return cachedResponse;
      }
    }
  }

  // Fetch new version and cache it
  try {
    console.log('SW: Fetching fresh Google Ads script');
    const response = await fetch(request);

    if (response.ok) {
      const responseToCache = response.clone();
      await cache.put(request, responseToCache);
    }

    return response;
  } catch (error) {
    console.log('SW: Network failed for Google Ads:', error);
    return cachedResponse || new Response('Network error', { status: 408 });
  }
}

// Default caching strategy
async function handleDefault(request) {
  try {
    // Try network first for HTML pages
    if (request.destination === 'document') {
      const response = await fetch(request);
      return response;
    }

    // Cache first for static assets
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);

    if (response.ok) {
      const responseToCache = response.clone();
      await cache.put(request, responseToCache);
    }

    return response;
  } catch (error) {
    console.log('SW: Fetch failed:', error);
    const cache = await caches.open(CACHE_NAME);
    return (
      (await cache.match(request)) || new Response('Offline', { status: 503 })
    );
  }
}
