'use client';

import Image from 'next/image';

interface FeaturedImageProps {
  src: string;
  alt: string;
}

export default function FeaturedImage({ src, alt }: FeaturedImageProps) {
  return (
    <div className="mt-8 mb-8 relative">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={450}
          className="w-full h-full object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          priority
          quality={90}
          onLoad={() => {
            console.log('Featured image loaded successfully');
          }}
          onError={() => {
            console.error('Featured image failed to load');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>
      {alt && (
        <p className="text-center text-gray-600 text-sm mt-3 italic">{alt}</p>
      )}
    </div>
  );
}
