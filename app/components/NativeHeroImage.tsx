'use client';

import { useState } from 'react';
import Image from 'next/image';

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
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 ${className}`}
        style={{
          minHeight: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }

  return (
    <div className="relative w-full h-full min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600" />
      <Image
        src={src}
        alt={alt}
        fill
        priority
        quality={85}
        className={`object-cover transition-opacity duration-300 ${className}`}
        onError={() => setHasError(true)}
        sizes="100vw"
      />
    </div>
  );
}
