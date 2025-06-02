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
  preload: true,
});

const sora = Sora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sora',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
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
        {/* Ultra-aggressive preloading */}
        <link
          rel="preconnect"
          href="https://admin.zdravievpraxi.sk"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//admin.zdravievpraxi.sk" />

        {/* Preload critical fonts immediately */}
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
        <link
          rel="preload"
          href="/fonts/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for Google services with delayed loading */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />

        {/* Ultra-critical CSS inlined */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical rendering optimizations */
            * { box-sizing: border-box; }
            html { scroll-behavior: smooth; }
            body { 
              font-family: var(--font-inter), system-ui, arial, sans-serif;
              margin: 0;
              padding: 0;
              line-height: 1.6;
              color: #171717;
              background: #ffffff;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            /* Hero critical styles */
            .hero-critical {
              contain: layout style paint !important;
              will-change: auto !important;
              content-visibility: auto !important;
              contain-intrinsic-size: 0 400px !important;
            }
            
            /* Image optimizations */
            img {
              max-width: 100%;
              height: auto;
              contain: layout style paint;
            }
            
            /* LCP element styles */
            .lcp-container {
              position: relative !important;
              width: 100% !important;
              height: 100vh !important; /* Fullscreen */
              min-height: 100vh !important; /* Fullscreen */
              overflow: hidden !important;
              contain: layout style paint !important;
              will-change: auto !important;
              content-visibility: visible !important;
              contain-intrinsic-size: 0 100vh !important;
            }
            
            .lcp-image {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100% !important;
              min-height: 100vh !important; /* Fullscreen */
              object-fit: cover !important;
              object-position: center !important;
              will-change: auto !important;
              contain: layout style paint !important;
              z-index: 1 !important;
              display: block !important;
            }
            
            /* Header optimization - smaller and less prominent */
            header {
              height: 64px !important;
              min-height: 64px !important;
              contain: layout style !important;
            }
            
            /* Logo optimization - even smaller */
            header img {
              max-height: 32px !important;
              width: auto !important;
              contain: layout style !important;
            }
            
            /* Prevent text elements from being LCP candidates */
            h1, h2, h3, p, div {
              content-visibility: auto !important;
              contain-intrinsic-size: 0 50px !important;
            }
            
            /* Force hero image to be LCP */
            [data-lcp-candidate="true"] {
              content-visibility: visible !important;
              contain-intrinsic-size: auto !important;
              z-index: 999 !important;
            }
            
            /* Loading states */
            .loading-placeholder {
              background: linear-gradient(90deg, #f0f9ff 25%, #e0f2fe 50%, #f0f9ff 75%);
              background-size: 200% 100%;
              animation: shimmer 1.5s infinite ease-in-out;
            }
            
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            
            /* Prevent layout shifts */
            .prevent-cls {
              min-height: var(--min-height, auto);
              contain: layout style;
            }
            
            /* Font optimizations */
            .font-sora { 
              font-family: var(--font-sora), system-ui, arial, sans-serif;
              font-display: swap;
            }
            .font-inter { 
              font-family: var(--font-inter), system-ui, arial, sans-serif;
              font-display: swap;
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

        {/* Main content with ultra-optimized loading */}
        <main className="min-h-screen hero-critical">{children}</main>

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
              
              // Load after 4 seconds or user interaction
              let interactionTimer = setTimeout(() => {
                loadAnalytics();
                loadAds();
              }, 4000);
              
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
      </body>
    </html>
  );
}
