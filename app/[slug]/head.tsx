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
      {/* Ultra-critical preloads */}
      {featuredImageUrl && (
        <>
          {/* Preload the optimized Next.js image */}
          <link
            rel="preload"
            as="image"
            href={`/_next/image?url=${encodeURIComponent(featuredImageUrl)}&w=1600&q=95`}
            fetchPriority="high"
          />
          {/* Backup preload for original image */}
          <link
            rel="preload"
            as="image"
            href={featuredImageUrl}
            fetchPriority="high"
          />
        </>
      )}

      {/* Critical CSS for immediate rendering */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .lcp-hero-container {
            position: relative !important;
            width: 100% !important;
            height: 60vh !important;
            min-height: 400px !important;
            max-height: 600px !important;
            overflow: hidden !important;
            contain: layout style paint !important;
            will-change: auto !important;
            content-visibility: auto !important;
            contain-intrinsic-size: 0 400px !important;
          }
          .lcp-hero-image {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center !important;
            will-change: auto !important;
            contain: layout style paint !important;
            content-visibility: auto !important;
            contain-intrinsic-size: 0 400px !important;
          }
        `,
        }}
      />
    </>
  );
}
