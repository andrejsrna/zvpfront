'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface LazyImageLoaderProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  rootMargin?: string;
  threshold?: number;
}

export default function LazyImageLoader({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes = '(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 30vw',
  className = '',
  quality = 80,
  priority = false,
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+JjHmsnLLKKRnHbwKJ3FlAm2O0UfGYJeO5Jp7Dcp3OHGMYd4b6aLgEJP5SjsNQFZAo9O5B+tWRcWlwJ3txdPGFVKdWKdlL8Whe2ZTBqD7+4I2HHDZ8Q/I4U4Q7XSB8ikEKDMBOGAyMPEtwq57Ck2xD/9k=',
  rootMargin = '50px',
  threshold = 0.1,
}: LazyImageLoaderProps) {
  const [isVisible, setIsVisible] = useState(priority);
  const [hasLoaded, setHasLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority, rootMargin, threshold]);

  const handleLoad = () => {
    setHasLoaded(true);
  };

  const containerStyle = fill
    ? 'w-full h-full'
    : `${width ? `w-[${width}px]` : ''} ${height ? `h-[${height}px]` : ''}`;

  return (
    <div ref={imgRef} className={`relative ${containerStyle}`}>
      {/* Loading placeholder */}
      {!hasLoaded && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
          style={{
            width: fill ? '100%' : width,
            height: fill ? '100%' : height,
          }}
        />
      )}

      {/* Actual image - only render when visible */}
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          sizes={sizes}
          className={`${className} ${hasLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}
