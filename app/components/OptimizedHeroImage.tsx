'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OptimizedHeroImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  className?: string;
}

export default function OptimizedHeroImage({
  src,
  alt,
  priority = true,
  quality = 95,
  className = '',
}: OptimizedHeroImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Preload the image immediately
  useEffect(() => {
    if (src && priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    }
  }, [src, priority]);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
  };

  if (imageError || !src) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 ${className}`}
        style={{
          contain: 'layout style paint',
          willChange: 'auto',
        }}
      />
    );
  }

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{
        contain: 'layout style paint',
        willChange: imageLoaded ? 'auto' : 'transform, opacity',
        contentVisibility: 'auto',
        containIntrinsicSize: '0 400px',
      }}
    >
      {/* Loading placeholder - only shown until image loads */}
      {!imageLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-50"
          style={{
            background: `linear-gradient(90deg, #f0f9ff 25%, #e0f2fe 50%, #f0f9ff 75%)`,
            backgroundSize: '200% 100%',
            animation: 'loading-shimmer 1.5s infinite ease-in-out',
          }}
        />
      )}

      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes="100vw"
        className={`object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          willChange: imageLoaded ? 'auto' : 'opacity',
        }}
        placeholder="empty" // No blur placeholder to avoid delay
        fetchPriority="high"
        decoding="sync" // Synchronous decoding for immediate render
      />

      {/* CSS for loading animation */}
      <style jsx>{`
        @keyframes loading-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
