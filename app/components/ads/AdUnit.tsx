'use client';

import { useEffect, useState } from 'react';
import { getCookiePreferences } from '@/app/lib/cookieConsent';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
}: AdUnitProps) {
  const [canShowAds, setCanShowAds] = useState(false);

  useEffect(() => {
    const preferences = getCookiePreferences();
    setCanShowAds(preferences.advertising);
  }, []);

  useEffect(() => {
    if (canShowAds) {
      try {
        // @ts-expect-error - AdSense global variable
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [canShowAds]);

  if (!canShowAds) {
    return (
      <div className={`ad-container ${className}`}>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-600 mb-2">Reklamy sú vypnuté</p>
          <p className="text-xs text-gray-500">
            Pre zobrazenie reklám povoľte reklamné cookies v nastaveniach
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client="ca-pub-7459831240640476"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
