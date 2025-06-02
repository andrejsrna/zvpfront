import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { Suspense } from 'react';
import Script from 'next/script';
import Footer from './components/Footer';
import Header from './components/Header';
import CacheOptimizer from './components/CacheOptimizer';
import './globals.css';

// Import WordPress block library styles
import '@wordpress/block-library/build-style/style.css';
import '@wordpress/block-library/build-style/theme.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

const sora = Sora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sora',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zdravievpraxi.sk'),
  title: {
    default: 'Zdravie v praxi',
    template: '%s | Zdravie v praxi',
  },
  description:
    'Váš sprievodca zdravým životným štýlom - overené informácie, tipy a rady od odborníkov',
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    url: 'https://zdravievpraxi.sk',
    siteName: 'Zdravie v praxi',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk" className="scroll-smooth">
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/Sora-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Sora-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for WordPress API */}
        <link rel="dns-prefetch" href="//admin.zdravievpraxi.sk" />
        <link
          rel="preconnect"
          href="https://admin.zdravievpraxi.sk"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for Google services with delayed loading */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />

        {/* Critical CSS for hero sections */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .hero-critical {
              contain: layout style paint;
              will-change: transform;
            }
            .hero-critical img {
              content-visibility: auto;
              contain-intrinsic-size: 0 400px;
            }
            .image-loading-placeholder {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `,
          }}
        />
      </head>
      <body
        className={`${sora.variable} ${inter.variable} font-sans bg-white 
          text-gray-900 antialiased`}
      >
        {/* Critical above-the-fold content */}
        <Header />

        {/* Main content with optimized loading */}
        <main className="min-h-screen">{children}</main>

        {/* Footer - loaded last */}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        {/* CacheOptimizer - non-critical */}
        <Suspense fallback={null}>
          <CacheOptimizer />
        </Suspense>

        {/* Delayed Google Analytics and Ads */}
        <Script
          id="delayed-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              let analyticsLoaded = false;
              let adsLoaded = false;
              
              function loadAnalytics() {
                if (analyticsLoaded) return;
                analyticsLoaded = true;
                
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_title: document.title,
                  page_location: window.location.href
                });
                
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}';
                document.head.appendChild(script);
              }
              
              function loadAds() {
                if (adsLoaded) return;
                adsLoaded = true;
                
                window.adsbygoogle = window.adsbygoogle || [];
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}';
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);
              }
              
              // Load after 3 seconds or user interaction
              let interactionTimer = setTimeout(() => {
                loadAnalytics();
                loadAds();
              }, 3000);
              
              ['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(event => {
                document.addEventListener(event, () => {
                  clearTimeout(interactionTimer);
                  loadAnalytics();
                  loadAds();
                }, { once: true, passive: true });
              });
            `,
          }}
        />

        {/* Performance monitoring - development only */}
        {process.env.NODE_ENV === 'development' && (
          <Script src="/performance-monitor.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
