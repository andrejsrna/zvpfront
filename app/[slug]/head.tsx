import { getPostBySlug } from '@/app/lib/WordPress';

interface HeadProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Head({ params: paramsPromise }: HeadProps) {
  const params = await paramsPromise;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return null;
  }

  const featuredImageUrl =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <>
      {/* Ultra-critical preloads - MAXIMUM PRIORITY */}
      {featuredImageUrl && (
        <>
          {/* Multiple preload sizes for different devices */}
          <link
            rel="preload"
            as="image"
            href={`/_next/image?url=${encodeURIComponent(featuredImageUrl)}&w=1920&q=90`}
            fetchPriority="high"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="image"
            href={`/_next/image?url=${encodeURIComponent(featuredImageUrl)}&w=1600&q=85`}
            fetchPriority="high"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="image"
            href={`/_next/image?url=${encodeURIComponent(featuredImageUrl)}&w=1200&q=80`}
            fetchPriority="high"
            crossOrigin="anonymous"
          />
          {/* Original image backup */}
          <link
            rel="preload"
            as="image"
            href={featuredImageUrl}
            fetchPriority="high"
            crossOrigin="anonymous"
          />
        </>
      )}

      {/* Critical CSS for immediate rendering */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* FORCE HERO IMAGE TO BE LCP */
          [data-lcp-candidate="true"] {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            object-fit: cover !important;
            z-index: 999 !important;
            content-visibility: visible !important;
            contain-intrinsic-size: auto !important;
            display: block !important;
            opacity: 1 !important;
          }
          .lcp-hero-container {
            position: relative !important;
            width: 100% !important;
            height: 100vh !important;
            min-height: 100vh !important;
            overflow: hidden !important;
            contain: layout style paint !important;
            will-change: auto !important;
            content-visibility: visible !important;
            contain-intrinsic-size: 0 100vh !important;
          }
          /* Suppress other elements from being LCP */
          img:not([data-lcp-candidate="true"]) {
            content-visibility: auto !important;
            contain-intrinsic-size: 0 20px !important;
          }
        `,
        }}
      />
    </>
  );
}
