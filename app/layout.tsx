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
  title: "Zdravie v praxi",
  description: "Zdravie v praxi - váš sprievodca zdravým životným štýlom",
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
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
