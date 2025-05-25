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

      // Find all paragraphs
      const paragraphs = Array.from(doc.querySelectorAll('p'));
      const totalParagraphs = paragraphs.length;

      // Don't insert ads if article is too short
      if (totalParagraphs < 5) {
        setProcessedContent([
          <div key="content" dangerouslySetInnerHTML={{ __html: content }} />,
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
            dangerouslySetInnerHTML={{ __html: remainingContent }}
          />
        );
      }

      setProcessedContent(sections);
    };

    insertAds();
  }, [content]);

  return <div className={className}>{processedContent}</div>;
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
