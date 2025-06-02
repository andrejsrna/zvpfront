import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { Suspense } from 'react';
import Script from 'next/script';
import Footer from './components/Footer';
import Header from './components/Header';
import CacheOptimizer from './components/CacheOptimizer';
import CookieConsentModal from './components/CookieConsentModal';
import CookieConsentInit from './components/CookieConsentInit';
import './globals.css';
import './styles/cookie-modal.css';

// Import WordPress block library styles
import '@wordpress/block-library/build-style/style.css';
import '@wordpress/block-library/build-style/theme.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  weight: ['400', '500', '600', '700'],
  preload: true,
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  weight: ['400', '500', '600', '700', '800'],
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
        {/* DNS prefetch only - no blocking preloads */}
        <link
          rel="preconnect"
          href="https://admin.zdravievpraxi.sk"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//admin.zdravievpraxi.sk" />

        {/* DNS prefetch for Google services - no blocking */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />

        {/* Minimal critical CSS only */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Ultra-minimal critical CSS */
            * { box-sizing: border-box; }
            body { 
              font-family: var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
              margin: 0;
              padding: 0;
              line-height: 1.6;
              color: #171717;
              background: #ffffff;
              font-display: swap;
            }
            
            /* Font optimization */
            @font-face {
              font-family: 'Inter';
              font-display: swap;
            }
            
            @font-face {
              font-family: 'Sora';
              font-display: swap;
            }
            
            /* Heading fonts */
            h1, h2, h3, h4, h5, h6 {
              font-family: var(--font-sora), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
              font-display: swap;
            }
            
            /* Immediate visibility */
            .lcp-container {
              position: relative !important;
              width: 100% !important;
              height: 100vh !important;
              min-height: 100vh !important;
              overflow: hidden !important;
              display: block !important;
              visibility: visible !important;
            }
            
            [data-lcp-candidate="true"] {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100vh !important;
              object-fit: cover !important;
              z-index: 999 !important;
              display: block !important;
              opacity: 1 !important;
            }
            `,
          }}
        />
      </head>
      <body
        className={`${sora.variable} ${inter.variable} font-sans bg-white 
          text-gray-900 antialiased`}
      >
        {/* Cookie Consent Initialization */}
        <CookieConsentInit />

        {/* Cookie Consent Modal */}
        <CookieConsentModal />

        {/* Header - overlay on hero without blocking LCP */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100, // Lower than LCP image (999) and cookie modal (50)
            pointerEvents: 'auto',
            boxShadow:
              '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 16px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Header />
        </div>

        {/* Main content - NO blocking */}
        <main className="min-h-screen">{children}</main>

        {/* Footer loads after */}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        <Suspense fallback={null}>
          <CacheOptimizer />
        </Suspense>

        {/* Delayed scripts - load after 5 seconds */}
        <Script
          id="delayed-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(() => {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}';
                document.head.appendChild(script);
                
                // Load AdSense script without data-nscript attribute
                const adsScript = document.createElement('script');
                adsScript.async = true;
                adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7459831240640476';
                document.head.appendChild(adsScript);
                
                window.adsLoaded = true;
              }, 5000);
            `,
          }}
        />
      </body>
    </html>
  );
}
