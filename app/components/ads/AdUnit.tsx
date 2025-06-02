'use client';

import { useEffect, useState, useRef } from 'react';
import { getCookiePreferences } from '@/app/lib/cookieConsent';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  minHeight?: number;
}

export default function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
  minHeight = 90,
}: AdUnitProps) {
  const [canShowAds, setCanShowAds] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adsScriptLoaded, setAdsScriptLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Calculate appropriate min-height based on format
  const getMinHeight = () => {
    switch (format) {
      case 'rectangle':
        return 250;
      case 'vertical':
        return 600;
      case 'horizontal':
        return 90;
      default:
        return minHeight;
    }
  };

  const adMinHeight = getMinHeight();

  // Check if ad is visible using Intersection Observer
  useEffect(() => {
    if (!adRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Load ads 100px before they come into view
      }
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preferences = getCookiePreferences();
    setCanShowAds(preferences.advertising);
    setIsLoading(false);
  }, []);

  // Load AdSense script when ad becomes visible and consent is given
  useEffect(() => {
    if (!canShowAds || !isVisible || adsScriptLoaded) return;

    // Check if AdSense script is loaded
    const checkAdsLoaded = setInterval(() => {
      const adsbygoogle = window.adsbygoogle;
      if (adsbygoogle) {
        setAdsScriptLoaded(true);
        clearInterval(checkAdsLoaded);
      }
    }, 100);

    // Cleanup after 10 seconds
    setTimeout(() => clearInterval(checkAdsLoaded), 10000);

    return () => clearInterval(checkAdsLoaded);
  }, [canShowAds, isVisible, adsScriptLoaded]);

  // Initialize ad when script is loaded
  useEffect(() => {
    if (!adsScriptLoaded || !canShowAds || !isVisible) return;

    try {
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [adsScriptLoaded, canShowAds, isVisible]);

  if (isLoading) {
    return (
      <div
        ref={adRef}
        className={`ad-container ad-loading ${className}`}
        style={{ minHeight: adMinHeight, ...style }}
      >
        <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!canShowAds) {
    return (
      <div
        ref={adRef}
        className={`ad-container ${className}`}
        style={{ minHeight: adMinHeight, ...style }}
      >
        <div className="bg-gray-100 rounded-lg p-8 text-center h-full flex flex-col justify-center">
          <p className="text-sm text-gray-600 mb-2">Reklamy sú vypnuté</p>
          <p className="text-xs text-gray-500">
            Pre zobrazenie reklám povoľte reklamné cookies v nastaveniach
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={adRef}
      className={`ad-container ${className}`}
      style={{ minHeight: adMinHeight, ...style }}
    >
      {isVisible ? (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            minHeight: adMinHeight,
            width: '100%',
            ...style,
          }}
          data-ad-client="ca-pub-7459831240640476"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      ) : (
        <div
          className="ad-placeholder bg-gray-100 rounded-lg flex items-center justify-center"
          style={{ minHeight: adMinHeight }}
        >
          <div className="text-sm text-gray-500">Loading ad...</div>
        </div>
      )}
    </div>
  );
}
