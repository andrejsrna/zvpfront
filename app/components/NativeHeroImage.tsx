'use client';

import { useEffect, useState } from 'react';

interface NativeHeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function NativeHeroImage({
  src,
  alt,
  className = '',
}: NativeHeroImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState('');

  // Generate optimized Next.js URL immediately
  useEffect(() => {
    if (src) {
      // Create Next.js optimized URL for larger size to ensure LCP priority
      const optimized = `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=90`;
      setOptimizedSrc(optimized);

      // ULTRA-AGGRESSIVE preloading - immediate execution
      const link1 = document.createElement('link');
      link1.rel = 'preload';
      link1.as = 'image';
      link1.href = optimized;
      link1.fetchPriority = 'high';
      link1.crossOrigin = 'anonymous';
      document.head.appendChild(link1);

      // Additional preload for fallback
      const link2 = document.createElement('link');
      link2.rel = 'preload';
      link2.as = 'image';
      link2.href = src;
      link2.fetchPriority = 'high';
      link2.crossOrigin = 'anonymous';
      document.head.appendChild(link2);

      // Force immediate load
      const img = new Image();
      img.fetchPriority = 'high';
      img.decoding = 'sync';
      img.src = optimized;
    }
  }, [src]);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  if (!src || !optimizedSrc) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 ${className}`}
        style={{
          minHeight: '100vh',
          contain: 'layout style paint',
        }}
      />
    );
  }

  return (
    <>
      {/* Critical inline styles with MAXIMUM LCP priority */}
      <style>{`
        .native-hero-image {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 100vh !important;
          object-fit: cover !important;
          object-position: center !important;
          will-change: auto !important;
          contain: layout style paint !important;
          content-visibility: visible !important;
          contain-intrinsic-size: auto !important;
          z-index: 999 !important;
          display: block !important;
          opacity: 1 !important;
        }
        .native-hero-container {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 100vh !important;
          contain: layout style paint !important;
          will-change: auto !important;
          content-visibility: visible !important;
          contain-intrinsic-size: auto !important;
          display: block !important;
          visibility: visible !important;
        }
        .loading-placeholder {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 100vh !important;
          background: linear-gradient(90deg, #f0f9ff 25%, #e0f2fe 50%, #f0f9ff 75%) !important;
          background-size: 200% 100% !important;
          animation: shimmer 1.5s infinite ease-in-out !important;
          z-index: 0 !important;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className={`native-hero-container ${className}`}>
        {/* Loading placeholder */}
        {!imageLoaded && <div className="loading-placeholder" />}

        {/* Native img optimized for INSTANT LCP */}
        <img
          src={optimizedSrc}
          alt={alt}
          className={`native-hero-image`}
          onLoad={handleLoad}
          onError={() => {
            setOptimizedSrc(src);
          }}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          crossOrigin="anonymous"
          style={{
            minHeight: '100vh',
            fontSize: '0',
            opacity: '1 !important',
          }}
          data-lcp-candidate="true"
          data-priority="high"
        />
      </div>
    </>
  );
}
