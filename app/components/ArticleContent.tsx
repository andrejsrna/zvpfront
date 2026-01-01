'use client';

import { Suspense } from 'react';
import parse, { HTMLReactParserOptions } from 'html-react-parser';
import Script from 'next/script';
import { sanitizeHTML } from '@/app/lib/sanitizeHTML';

interface ArticleContentProps {
  content: string;
  className?: string;
}

function stableHash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
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
        domNode.name === 'script'
      ) {
        const attribs = (domNode.attribs || {}) as Record<string, string>;
        const src = attribs.src;
        const type = attribs.type;
        const id =
          attribs.id ||
          `content-script-${stableHash(String(src || '') + String(domNode.children?.length || 0))}`;

        const hasAsync = Object.prototype.hasOwnProperty.call(attribs, 'async');
        const hasDefer = Object.prototype.hasOwnProperty.call(attribs, 'defer');

        if (src) {
          return (
            <Script
              id={id}
              src={src}
              type={type}
              async={hasAsync}
              defer={hasDefer}
              strategy="afterInteractive"
            />
          );
        }

        const inline = (domNode.children || [])
          .map(child =>
            typeof child === 'object' && child && 'data' in child
              ? String((child as { data?: unknown }).data ?? '')
              : ''
          )
          .join('')
          .replace(/\\_/g, '_');

        if (!inline.trim()) return null;

        return (
          <Script
            id={id}
            type={type}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: inline }}
          />
        );
      }

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
