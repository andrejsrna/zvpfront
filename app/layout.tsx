import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sora',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zdravievpraxi.sk'),
  title: {
    default: 'Zdravie v praxi',
    template: '%s | Zdravie v praxi'
  },
  description: 'Váš sprievodca zdravým životným štýlom - overené informácie, tipy a rady od odborníkov',
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    url: 'https://zdravievpraxi.sk',
    siteName: 'Zdravie v praxi',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
    }]
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className={`${inter.variable} ${sora.variable} font-sans antialiased`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client="ca-pub-7459831240640476"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-RECTFBNLLS`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RECTFBNLLS', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
