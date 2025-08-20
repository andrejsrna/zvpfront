'use client';

import { Suspense } from 'react';
import parse, { HTMLReactParserOptions } from 'html-react-parser';
import Image from 'next/image';
import { sanitizeHTML } from '@/app/lib/sanitizeHTML';

interface ArticleContentProps {
  content: string;
  className?: string;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function ArticleContent({
  content,
  className = '',
}: ArticleContentProps) {
  const sanitizedContent = sanitizeHTML(content);

  const options: HTMLReactParserOptions = {
    replace: domNode => {
      if (
        'type' in domNode &&
        domNode.type === 'tag' &&
        domNode.name === 'img'
      ) {
        const { src, alt, width, height } = domNode.attribs;

        if (!src) {
          return null;
        }

        return (
          <Suspense fallback={<div>Loading image...</div>}>
            <div className="relative my-6 overflow-hidden rounded-lg shadow-lg not-prose">
              <Image
                src={src}
                alt={alt || 'Image from article'}
                width={Number(width) || 800}
                height={Number(height) || 450}
                className="w-full h-auto object-cover m-0"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                loading="lazy"
                placeholder={`data:image/svg+xml;base64,${toBase64(
                  shimmer(Number(width) || 800, Number(height) || 450)
                )}`}
              />
            </div>
          </Suspense>
        );
      }
      // Let other elements be processed normally by the parser
      // Don't return domToReact here as it causes infinite recursion
      return;
    },
  };

  return (
    <div
      className={`article-content prose prose-lg max-w-none prose-img:m-0 prose-figure:m-0 ${className}`}
    >
      {parse(sanitizedContent, options)}
    </div>
  );
}
