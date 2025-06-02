'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load non-critical components with ssr: false
const Newsletter = dynamic(() => import('./Newsletter'), {
  ssr: false,
});

const RecommendedReads = dynamic(() => import('./RecommendedReads'), {
  ssr: false,
});

const ReadMore = dynamic(() => import('./UI/ReadMore'), {
  ssr: false,
});

const WeRecommend = dynamic(() => import('./UI/WeRecommend'), {
  ssr: false,
});

const ShareButtons = dynamic(() => import('./UI/ShareButtons'), {
  ssr: false,
});

const StickyAd = dynamic(() => import('./ads/StickyAd'), {
  ssr: false,
});

const TableOfContents = dynamic(() => import('./TableOfContents'), {
  ssr: false,
});

// Wrappers with Suspense
export function LazyNewsletter() {
  return (
    <Suspense fallback={null}>
      <Newsletter />
    </Suspense>
  );
}

export function LazyRecommendedReads({
  currentPostId,
  currentCategoryId,
}: {
  currentPostId: number;
  currentCategoryId?: number;
}) {
  return (
    <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
      <RecommendedReads
        currentPostId={currentPostId}
        currentCategoryId={currentCategoryId}
      />
    </Suspense>
  );
}

export function LazyReadMore({
  categoryId,
  categoryName,
  categorySlug,
  currentPostId,
}: {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  currentPostId: number;
}) {
  return (
    <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse" />}>
      <ReadMore
        categoryId={categoryId}
        categoryName={categoryName}
        categorySlug={categorySlug}
        currentPostId={currentPostId}
      />
    </Suspense>
  );
}

export function LazyWeRecommend() {
  return (
    <Suspense fallback={null}>
      <WeRecommend />
    </Suspense>
  );
}

export function LazyShareButtons({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description: string;
}) {
  return (
    <Suspense fallback={null}>
      <ShareButtons url={url} title={title} description={description} />
    </Suspense>
  );
}

export function LazyStickyAd({
  slot,
  position,
}: {
  slot: string;
  position: 'left' | 'right';
}) {
  return (
    <Suspense fallback={null}>
      <StickyAd slot={slot} position={position} />
    </Suspense>
  );
}

export function LazyTableOfContents({
  headings,
}: {
  headings: Array<{ id: string; text: string; level: number }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-20 bg-gray-50 rounded-lg animate-pulse mb-8" />
      }
    >
      <TableOfContents headings={headings} />
    </Suspense>
  );
}
