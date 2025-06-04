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
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          // Only set visible if the container has actual width
          const rect = entry.target.getBoundingClientRect();
          if (rect.width > 250) {
            setIsVisible(true);
            observer.disconnect();
          }
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
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

  // Initialize ad when script is loaded, component is visible, and consent given
  useEffect(() => {
    if (!canShowAds || !isVisible) return;

    // Double-check container width before initializing
    if (adRef.current) {
      const rect = adRef.current.getBoundingClientRect();
      if (rect.width < 250 && format === 'fluid') {
        console.warn(
          'AdSense: Container too narrow for fluid ads:',
          rect.width
        );
        return;
      }
    }

    try {
      // Ensure adsbygoogle queue is initialized
      const adsbygoogle = window.adsbygoogle || [];
      // Push the ad to the queue
      adsbygoogle.push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
    // Effect dependencies: re-run if ad consent, visibility, or format changes.
  }, [canShowAds, isVisible, format]);

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
        minWidth: format === 'fluid' ? '300px' : '250px',
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
            minWidth: format === 'fluid' ? '300px' : '250px',
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
            minWidth: format === 'fluid' ? '300px' : '250px',
          }}
        >
          <div className="text-sm text-gray-500">Loading ad...</div>
        </div>
      )}
    </div>
  );
}
