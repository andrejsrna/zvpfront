import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import Script from 'next/script';
import Footer from './components/Footer';
import Header from './components/Header';
import CookieConsent from './components/CookieConsent';
import CookieConsentInit from './components/CookieConsentInit';
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sk"
      className={`${inter.variable} ${sora.variable} font-sans antialiased`}
    >
      <head>
        {/* DNS Prefetch and Preconnect for performance */}
        <link rel="dns-prefetch" href="//admin.zdravievpraxi.sk" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://admin.zdravievpraxi.sk"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Critical CSS for font fallbacks */}
        <style>{`
          .font-inter { font-family: var(--font-inter), system-ui, arial, sans-serif; }
          .font-sora { font-family: var(--font-sora), system-ui, arial, sans-serif; }
          
          /* Prevent layout shifts from images */
          img { max-width: 100%; height: auto; }
          
          /* Critical above-the-fold styles */
          .hero-container { min-height: 400px; }
          .hero-skeleton { 
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>

        {/* Minimal Google Consent Mode - must be loaded first */}
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Default consent state - deny all initially
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied', 
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'personalization_storage': 'denied',
              'security_storage': 'granted',
              'wait_for_update': 500
            });
            
            // Delayed loading function for heavy scripts
            window.loadAnalytics = function() {
              if (window.analyticsLoaded) return;
              window.analyticsLoaded = true;
              
              // Load Google Analytics only when needed
              const script = document.createElement('script');
              script.src = 'https://www.googletagmanager.com/gtag/js?id=G-RECTFBNLLS';
              script.async = true;
              document.head.appendChild(script);
              
              script.onload = function() {
                gtag('js', new Date());
                gtag('config', 'G-RECTFBNLLS', {
                  page_path: window.location.pathname,
                });
              };
            };
            
            // Delayed loading for AdSense
            window.loadAds = function() {
              if (window.adsLoaded) return;
              window.adsLoaded = true;
              
              const script = document.createElement('script');
              script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7459831240640476';
              script.async = true;
              script.crossOrigin = 'anonymous';
              document.head.appendChild(script);
            };
            
            // Load scripts after user interaction or time delay
            let userInteracted = false;
            
            function loadScriptsOnInteraction() {
              if (userInteracted) return;
              userInteracted = true;
              
              // Small delay to ensure user intent
              setTimeout(() => {
                window.loadAnalytics();
                
                // Only load ads if we have consent later
                const checkConsent = setInterval(() => {
                  const adConsent = localStorage.getItem('cookieConsent');
                  if (adConsent) {
                    const consent = JSON.parse(adConsent);
                    if (consent.advertising) {
                      window.loadAds();
                    }
                    clearInterval(checkConsent);
                  }
                }, 100);
              }, 100);
            }
            
            // Load on first user interaction
            ['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(event => {
              document.addEventListener(event, loadScriptsOnInteraction, { once: true, passive: true });
            });
            
            // Fallback - load after 3 seconds anyway
            setTimeout(loadScriptsOnInteraction, 3000);
          `}
        </Script>
      </head>
      <body>
        <CacheOptimizer
          criticalResources={[
            '/logos/zvp.png',
            '/_next/static/css/app.css',
            '/_next/static/chunks/main.js',
          ]}
        />
        <Header />
        {children}
        <Footer />
        <CookieConsent />
        <CookieConsentInit />

        {/* Intersection Observer for lazy loading */}
        <Script id="lazy-loading-observer" strategy="afterInteractive">
          {`
            // Enhanced lazy loading for below-the-fold content
            if ('IntersectionObserver' in window) {
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    // Trigger any lazy loading here
                    if (!window.userInteracted) {
                      window.loadAnalytics();
                    }
                  }
                });
              }, {
                rootMargin: '50px'
              });
              
              // Observe footer or other below-the-fold elements
              document.addEventListener('DOMContentLoaded', () => {
                const footer = document.querySelector('footer');
                if (footer) observer.observe(footer);
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
