'use client';

import { useEffect } from 'react';

interface CriticalResourcePreloaderProps {
  images?: string[];
  fonts?: string[];
}

export default function CriticalResourcePreloader({
  images = [],
  fonts = [],
}: CriticalResourcePreloaderProps) {
  useEffect(() => {
    // Preload critical images
    images.forEach(imageUrl => {
      const img = new Image();
      img.src = imageUrl;
    });

    // Preload critical fonts
    fonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      document.head.appendChild(link);
    });
  }, [images, fonts]);

  return null;
}
