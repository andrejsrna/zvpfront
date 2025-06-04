'use client';

import { useEffect, useState } from 'react';
import { sanitizeHTML } from '@/app/lib/sanitizeHTML';

interface ArticleContentProps {
  content: string;
  className?: string;
}

export default function ArticleContent({
  content,
  className = '',
}: ArticleContentProps) {
  const [processedContent, setProcessedContent] = useState<string>('');

  useEffect(() => {
    // Sanitize content first
    const sanitizedContent = sanitizeHTML(content);

    // Parse content
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedContent, 'text/html');

    // Optimize images in content
    const images = doc.querySelectorAll('img');
    images.forEach((img, index) => {
      // Add loading optimization
      img.loading = index < 2 ? 'eager' : 'lazy';
      img.decoding = 'async';

      // Add proper sizes attribute
      if (!img.getAttribute('sizes')) {
        img.setAttribute(
          'sizes',
          '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px'
        );
      }

      // Add aspect ratio styles to prevent CLS
      if (!img.style.aspectRatio && img.width && img.height) {
        img.style.aspectRatio = `${img.width}/${img.height}`;
      }

      // Add error handling
      img.onerror = function () {
        this.style.display = 'none';
      };
    });

    setProcessedContent(doc.body.innerHTML);
  }, [content]);

  return (
    <div className={`article-wrapper ${className}`}>
      <style jsx>{`
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .article-content figure {
          margin: 1.5rem 0;
        }

        .article-content figcaption {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.5rem;
          font-style: italic;
        }
      `}</style>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  );
}
