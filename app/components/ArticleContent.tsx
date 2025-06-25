'use client';

import { useEffect, useRef } from 'react';
import { sanitizeHTML } from '@/app/lib/sanitizeHTML';

interface ArticleContentProps {
  content: string;
  className?: string;
}

export default function ArticleContent({
  content,
  className = '',
}: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }

    const sanitizedContent = sanitizeHTML(content);
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedContent, 'text/html');

    const images = doc.querySelectorAll('img');
    images.forEach((img, index) => {
      img.loading = index < 2 ? 'eager' : 'lazy';
      img.decoding = 'async';
      if (!img.getAttribute('sizes')) {
        img.setAttribute(
          'sizes',
          '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px'
        );
      }
      if (!img.style.aspectRatio && img.width && img.height) {
        img.style.aspectRatio = `${img.width}/${img.height}`;
      }
      img.onerror = function () {
        (this as HTMLImageElement).style.display = 'none';
      };
    });

    const scripts = Array.from(doc.querySelectorAll('script'));
    const contentBody = doc.body;

    scripts.forEach(script => script.parentNode?.removeChild(script));

    const contentDiv = contentRef.current;
    contentDiv.innerHTML = contentBody.innerHTML;

    const addedScripts: HTMLScriptElement[] = [];

    scripts.forEach(script => {
      const newScript = document.createElement('script');
      for (const attr of Array.from(script.attributes)) {
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.innerHTML = script.innerHTML;
      document.body.appendChild(newScript);
      addedScripts.push(newScript);
    });

    return () => {
      addedScripts.forEach(script => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
    };
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
      <div className="article-content" ref={contentRef} />
    </div>
  );
}
