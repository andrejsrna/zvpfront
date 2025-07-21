'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getCookiePreferences } from '@/app/lib/cookieConsent';

export default function GoogleScripts() {
  const [preferences, setPreferences] = useState({
    analytics: false,
    advertising: false,
  });

  useEffect(() => {
    const currentPreferences = getCookiePreferences();
    setPreferences({
      analytics: currentPreferences.analytics,
      advertising: currentPreferences.advertising,
    });
  }, []);

  return (
    <>
      {preferences.analytics && (
        <>
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `,
            }}
          />
        </>
      )}
      {preferences.advertising && (
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7459831240640476"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
