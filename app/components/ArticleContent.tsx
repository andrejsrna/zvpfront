'use client';

import { useEffect, useState, ReactElement } from 'react';
import InArticleAd from './ads/InArticleAd';
import { AD_SLOTS } from '@/app/config/adSlots';

interface ArticleContentProps {
  content: string;
  className?: string;
}

export default function ArticleContent({
  content,
  className = '',
}: ArticleContentProps) {
  const [processedContent, setProcessedContent] = useState<ReactElement[]>([]);

  useEffect(() => {
    const insertAds = () => {
      // Parse content
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

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

      // Find all paragraphs
      const paragraphs = Array.from(doc.querySelectorAll('p'));
      const totalParagraphs = paragraphs.length;

      // Don't insert ads if article is too short
      if (totalParagraphs < 5) {
        setProcessedContent([
          <div
            key="content"
            className="article-content"
            dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }}
          />,
        ]);
        return;
      }

      // Calculate ad positions
      const adSlots = [
        AD_SLOTS.IN_ARTICLE_1,
        AD_SLOTS.IN_ARTICLE_2,
        AD_SLOTS.IN_ARTICLE_3,
      ];
      const adPositions = calculateAdPositions(totalParagraphs);

      // Create content sections
      const sections: ReactElement[] = [];
      let lastPosition = 0;

      adPositions.forEach((position, index) => {
        if (position < totalParagraphs && adSlots[index]) {
          // Get content before ad
          const beforeAdContent = getContentBetween(
            doc,
            lastPosition,
            position
          );
          if (beforeAdContent) {
            sections.push(
              <div
                key={`content-${index}`}
                className="article-content"
                dangerouslySetInnerHTML={{ __html: beforeAdContent }}
              />
            );
          }

          // Add ad
          sections.push(
            <InArticleAd key={`ad-${index}`} slot={adSlots[index]} />
          );

          lastPosition = position;
        }
      });

      // Add remaining content
      const remainingContent = getContentBetween(
        doc,
        lastPosition,
        totalParagraphs
      );
      if (remainingContent) {
        sections.push(
          <div
            key="content-final"
            className="article-content"
            dangerouslySetInnerHTML={{ __html: remainingContent }}
          />
        );
      }

      setProcessedContent(sections);
    };

    insertAds();
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
      {processedContent}
    </div>
  );
}

function calculateAdPositions(totalParagraphs: number): number[] {
  const positions: number[] = [];

  if (totalParagraphs >= 8) {
    // For longer articles, distribute ads evenly
    positions.push(Math.floor(totalParagraphs * 0.25)); // After 25%
    positions.push(Math.floor(totalParagraphs * 0.5)); // After 50%
    positions.push(Math.floor(totalParagraphs * 0.75)); // After 75%
  } else if (totalParagraphs >= 6) {
    // For medium articles
    positions.push(Math.floor(totalParagraphs * 0.33)); // After 33%
    positions.push(Math.floor(totalParagraphs * 0.66)); // After 66%
  } else if (totalParagraphs >= 5) {
    // For short articles, just one ad in the middle
    positions.push(Math.floor(totalParagraphs * 0.5));
  }

  return positions;
}

function getContentBetween(
  doc: Document,
  startIndex: number,
  endIndex: number
): string {
  const elements = Array.from(doc.body.children);
  const result: string[] = [];
  let paragraphCount = 0;

  for (const element of elements) {
    if (element.tagName === 'P') {
      if (paragraphCount >= startIndex && paragraphCount < endIndex) {
        result.push(element.outerHTML);
      }
      paragraphCount++;
    } else {
      // Include non-paragraph elements based on surrounding paragraphs
      if (paragraphCount > startIndex && paragraphCount <= endIndex) {
        result.push(element.outerHTML);
      }
    }
  }

  return result.join('');
}
