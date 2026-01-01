'use client';

import Image from 'next/image';

interface FeaturedImageProps {
  src: string;
  alt: string;
}

export default function FeaturedImage({ src, alt }: FeaturedImageProps) {
  const isRemote = /^https?:\/\//i.test(src);
  return (
    <div className="mt-8 mb-8 relative">
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
        <Image
          src={src}
          alt={alt}
          width={896}
          height={504}
          className="w-full h-full object-cover transition-opacity duration-300"
          sizes="(max-width: 928px) calc(100vw - 32px), 896px"
          priority
          quality={80}
          fetchPriority="high"
          unoptimized={isRemote}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>
      {alt && (
        <p className="text-center text-gray-600 text-sm mt-3 italic">{alt}</p>
      )}
    </div>
  );
}
