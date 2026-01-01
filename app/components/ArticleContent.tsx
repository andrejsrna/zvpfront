'use client';

import { Suspense } from 'react';
import parse, { HTMLReactParserOptions } from 'html-react-parser';
import { sanitizeHTML } from '@/app/lib/sanitizeHTML';

interface ArticleContentProps {
  content: string;
  className?: string;
}

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
              <img
                src={src}
                alt={alt || 'Image from article'}
                width={Number(width) || undefined}
                height={Number(height) || undefined}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover m-0"
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
