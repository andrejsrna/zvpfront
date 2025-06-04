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
  forceLoad?: boolean;
}

export default function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
  minHeight = 90,
  forceLoad = false,
}: AdUnitProps) {
  const [canShowAds, setCanShowAds] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adsScriptLoaded, setAdsScriptLoaded] = useState(false);
  const [adInitialized, setAdInitialized] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(forceLoad);

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

  // Check if ad is visible using Intersection Observer (skip for forced loads)
  useEffect(() => {
    if (forceLoad || !adRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          const rect = entry.target.getBoundingClientRect();
          if (rect.width > 200) {
            // Reduced threshold for better compatibility
            setIsVisible(true);
            observer.disconnect();
          }
        }
      },
      {
        rootMargin: '50px', // Reduced margin for faster loading
        threshold: 0.1,
      }
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [forceLoad]);

  useEffect(() => {
    const preferences = getCookiePreferences();
    setCanShowAds(preferences.advertising);
    setIsLoading(false);
  }, []);

  // Enhanced script loading detection
  useEffect(() => {
    if (!canShowAds || !isVisible || adsScriptLoaded) return;

    let checkCount = 0;
    const maxChecks = 100; // 10 seconds max

    const checkAdsLoaded = setInterval(() => {
      checkCount++;

      const adsLoaded = window.adsLoaded;
      const adsbygoogle = window.adsbygoogle;

      // Check if script is loaded and adsbygoogle is available
      if (adsLoaded && adsbygoogle && Array.isArray(adsbygoogle)) {
        console.log('AdSense script detected as loaded');
        setAdsScriptLoaded(true);
        clearInterval(checkAdsLoaded);
        return;
      }

      // Also check if adsbygoogle exists (fallback)
      if (adsbygoogle && Array.isArray(adsbygoogle)) {
        console.log('AdSense adsbygoogle array found');
        setAdsScriptLoaded(true);
        clearInterval(checkAdsLoaded);
        return;
      }

      // Cleanup after max attempts
      if (checkCount >= maxChecks) {
        console.warn('AdSense script loading timeout');
        clearInterval(checkAdsLoaded);
      }
    }, 100);

    return () => clearInterval(checkAdsLoaded);
  }, [canShowAds, isVisible, adsScriptLoaded]);

  // Initialize ad when script is loaded
  useEffect(() => {
    if (!adsScriptLoaded || !canShowAds || !isVisible || adInitialized) return;

    // Validate container dimensions
    if (adRef.current) {
      const rect = adRef.current.getBoundingClientRect();
      console.log(`AdUnit debug - Container dimensions:`, {
        width: rect.width,
        height: rect.height,
        slot,
        format,
        forceLoad,
      });

      if (rect.width < 200 && format === 'fluid') {
        console.warn(
          'AdSense: Container too narrow for fluid ads:',
          rect.width
        );
        return;
      }
    }

    try {
      console.log(`Initializing AdSense ad for slot: ${slot}`, {
        format,
        responsive,
        forceLoad,
        containerWidth: adRef.current?.getBoundingClientRect().width,
      });

      const adsbygoogle = window.adsbygoogle || [];

      // Push empty object to trigger ad loading
      adsbygoogle.push({});
      setAdInitialized(true);

      console.log('AdSense ad initialization completed for slot:', slot);
    } catch (err) {
      console.error('AdSense initialization error:', err);
    }
  }, [
    adsScriptLoaded,
    canShowAds,
    isVisible,
    format,
    slot,
    adInitialized,
    forceLoad,
  ]);

  // Debug logging for state changes
  useEffect(() => {
    if (forceLoad) {
      console.log(`StickyAd debug state:`, {
        slot,
        canShowAds,
        adsScriptLoaded,
        isVisible,
        adInitialized,
        forceLoad,
      });
    }
  }, [canShowAds, adsScriptLoaded, isVisible, adInitialized, forceLoad, slot]);

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
      style={{
        minHeight: adMinHeight,
        minWidth: format === 'fluid' ? '280px' : '200px', // Reduced min width
        width: '100%',
        maxWidth: '100%',
        ...style,
      }}
    >
      {isVisible ? (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            minHeight: adMinHeight,
            width: '100%',
            minWidth: format === 'fluid' ? '280px' : '200px',
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
          style={{
            minHeight: adMinHeight,
            minWidth: format === 'fluid' ? '280px' : '200px',
          }}
        >
          <div className="text-sm text-gray-500">Loading ad...</div>
        </div>
      )}
    </div>
  );
}
