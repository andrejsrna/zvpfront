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

      // Preload the optimized image
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimized;
      link.fetchPriority = 'high';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
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
          minHeight: '80vh',
          contain: 'layout style paint',
        }}
      />
    );
  }

  return (
    <>
      {/* Critical inline styles with enhanced LCP priority */}
      <style>{`
        .native-hero-image {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 80vh !important;
          object-fit: cover !important;
          object-position: center !important;
          will-change: auto !important;
          contain: layout style paint !important;
          content-visibility: visible !important;
          contain-intrinsic-size: auto !important;
          z-index: 1 !important;
          display: block !important;
        }
        .native-hero-container {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 80vh !important;
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
          min-height: 80vh !important;
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

        {/* Native img optimized for LCP */}
        <img
          src={optimizedSrc}
          alt={alt}
          className={`native-hero-image ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={() => {
            // Fallback to original image if Next.js optimized fails
            setOptimizedSrc(src);
          }}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          crossOrigin="anonymous"
          style={{
            transition: 'opacity 0.1s ease',
            minHeight: '80vh',
            fontSize: '0',
          }}
          // Additional LCP hints
          data-lcp-candidate="true"
          data-priority="high"
        />
      </div>
    </>
  );
}
