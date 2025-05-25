import InArticleAd from '@/app/components/ads/InArticleAd';
import { ReactElement } from 'react';

export function insertAdsIntoContent(
  content: string,
  adSlots: string[]
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const paragraphs = doc.querySelectorAll('p');

  if (paragraphs.length < 4) return content;

  // Vložiť reklamy po každých 3-4 odstavcoch
  const adPositions = [
    Math.floor(paragraphs.length * 0.3),
    Math.floor(paragraphs.length * 0.6),
    Math.floor(paragraphs.length * 0.85),
  ];

  adPositions.forEach((position, index) => {
    if (position < paragraphs.length && adSlots[index]) {
      const adDiv = doc.createElement('div');
      adDiv.className = 'in-article-ad-placeholder';
      adDiv.setAttribute('data-ad-slot', adSlots[index]);

      const targetParagraph = paragraphs[position];
      targetParagraph.parentNode?.insertBefore(
        adDiv,
        targetParagraph.nextSibling
      );
    }
  });

  return doc.body.innerHTML;
}

export function renderAdsInContent(content: string): ReactElement[] {
  const parts = content.split(/<div class="in-article-ad-placeholder"[^>]*>/);
  const elements: ReactElement[] = [];

  parts.forEach((part, index) => {
    if (index === 0) {
      elements.push(
        <div
          key={`content-${index}`}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    } else {
      const [adPart, ...restParts] = part.split('</div>');
      const adSlot = adPart.match(/data-ad-slot="([^"]+)"/)?.[1];

      if (adSlot) {
        elements.push(<InArticleAd key={`ad-${index}`} slot={adSlot} />);
      }

      if (restParts.length > 0) {
        elements.push(
          <div
            key={`content-after-${index}`}
            dangerouslySetInnerHTML={{ __html: restParts.join('</div>') }}
          />
        );
      }
    }
  });

  return elements;
}
