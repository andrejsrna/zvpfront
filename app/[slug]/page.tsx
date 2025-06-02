import { Suspense } from 'react';
import { getPostBySlug, WordPressPost } from '@/app/lib/WordPress';
import { parseHeadings } from '@/app/utils/parseHeadings';
import he from 'he';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NativeHeroImage from '@/app/components/NativeHeroImage';
import ArticleContent from '@/app/components/ArticleContent';
import {
  LazyNewsletter,
  LazyRecommendedReads,
  LazyReadMore,
  LazyWeRecommend,
  LazyShareButtons,
  LazyStickyAd,
  LazyTableOfContents,
} from '@/app/components/LazyComponents';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Reference {
  nazov: string;
  odkaz: string;
}

export default async function PostPage({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;

  let post: WordPressPost | null;
  try {
    // Add timeout for API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    post = await Promise.race([
      getPostBySlug(params.slug),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('API timeout')), 3000)
      ),
    ]);

    clearTimeout(timeoutId);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  // Extract headings from content
  const { headings, content } = parseHeadings(he.decode(post.content.rendered));

  // Schema.org Article markup
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: he.decode(post.title.rendered),
    description: he.decode(post.excerpt.rendered.replace(/<[^>]*>/g, '')),
    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    datePublished: post.date,
    dateModified: post.modified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Zdravie v praxi',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
  };

  // Parse references from meta
  const references: Reference[] = post.meta?._zdroje_referencie || [];

  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const featuredImageUrl = featuredMedia?.source_url;
  const featuredImageAlt =
    featuredMedia?.alt_text || he.decode(post.title.rendered);

  return (
    <>
      {/* Critical above-the-fold preloads */}
      {featuredImageUrl && (
        <>
          {/* Ultra-aggressive preloading - multiple strategies */}
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
            href={featuredImageUrl}
            fetchPriority="high"
            crossOrigin="anonymous"
          />
        </>
      )}

      <article className="bg-white">
        {/* Schema.org markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        {/* Ultra-fast Hero Section for LCP - FULLSCREEN */}
        <div
          className="relative w-full h-screen min-h-[100vh] overflow-hidden bg-gray-100"
          style={{
            contain: 'layout style paint',
            willChange: 'auto',
            contentVisibility: 'visible',
            containIntrinsicSize: '0 100vh',
            minHeight: '100vh', // Fullscreen
            aspectRatio: '16/9',
          }}
          data-lcp-container="true"
        >
          <NativeHeroImage
            src={featuredImageUrl || ''}
            alt={featuredImageAlt}
          />

          {/* Minimal overlay only for category - MOVED DOWN to avoid menu collision */}
          <div
            className="absolute top-20 left-8"
            style={{
              contain: 'layout style',
              willChange: 'auto',
              zIndex: 10,
            }}
          >
            {post.categories && post.categories[0] && (
              <Link
                href={`/kategoria/${post.categories[0].slug}`}
                className="inline-block px-4 py-2 bg-emerald-500/95 backdrop-blur-sm text-white
                  text-sm font-medium rounded-full hover:bg-emerald-600/95
                  transition-colors shadow-xl border border-emerald-400/20"
                style={{
                  contain: 'layout style',
                  zIndex: 20,
                }}
              >
                {post.categories[0].name}
              </Link>
            )}
          </div>
        </div>

        {/* Content Section - H1 MOVED HERE (below fold) */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* H1 Title - NOW BELOW THE FOLD */}
            <header className="mb-8">
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                dangerouslySetInnerHTML={{
                  __html: he.decode(post.title.rendered),
                }}
                style={{
                  contain: 'layout style',
                }}
              />
              <div className="flex items-center text-gray-600 space-x-4 text-sm">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('sk-SK', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
            </header>

            {/* Table of Contents - Deferred */}
            <LazyTableOfContents headings={headings} />

            {/* Article Content - Critical but lazy loaded */}
            <Suspense
              fallback={
                <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />
              }
            >
              <ArticleContent
                content={he.decode(content)}
                className="prose prose-lg max-w-none prose-headings:font-heading
                  prose-headings:text-gray-900 prose-a:text-emerald-600
                  hover:prose-a:text-emerald-700 prose-img:rounded-xl
                  prose-strong:text-gray-900"
              />
            </Suspense>

            {/* References Section */}
            {references.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Zdroje a referencie
                </h2>
                <div className="space-y-4">
                  {references.map((ref, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-sm text-gray-500 mr-2">
                        [{index + 1}]
                      </span>
                      <div>
                        <a
                          href={ref.odkaz}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700
                            transition-colors hover:underline"
                        >
                          {ref.nazov}
                        </a>
                        <span className="text-gray-400 text-sm ml-2">
                          {new URL(ref.odkaz).hostname}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(
                    (tag: { id: number; name: string; slug: string }) => (
                      <Link
                        key={tag.id}
                        href={`/tag/${tag.slug}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm
                        rounded-full hover:bg-gray-200 transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Non-critical components - Lazy loaded */}
        <LazyShareButtons
          url={`${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`}
          title={he.decode(post.title.rendered)}
          description={he.decode(post.excerpt.rendered.replace(/<[^>]*>/g, ''))}
        />

        {/* Conditional content */}
        {post.tags?.some((tag: { slug: string }) => tag.slug === 'klby') && (
          <LazyWeRecommend />
        )}

        {/* Related content - Non-critical */}
        <LazyRecommendedReads
          currentPostId={post.id}
          currentCategoryId={post.categories?.[0]?.id}
        />

        <LazyNewsletter />

        {post.categories?.[0] && (
          <LazyReadMore
            categoryId={post.categories[0].id}
            categoryName={post.categories[0].name}
            categorySlug={post.categories[0].slug}
            currentPostId={post.id}
          />
        )}

        {/* Sticky Ad - Load last */}
        <LazyStickyAd slot="7890123456" position="right" />
      </article>
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Článok nenájdený',
      description: 'Požadovaný článok sa nenašiel',
    };
  }

  const cleanDescription = he
    .decode(post.excerpt.rendered.replace(/<[^>]*>/g, ''))
    .slice(0, 160);
  const decodedTitle = he.decode(post.title.rendered);
  const featuredImageUrl =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return {
    title: decodedTitle,
    description: cleanDescription,
    openGraph: {
      title: decodedTitle,
      description: cleanDescription,
      images: featuredImageUrl ? [featuredImageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: decodedTitle,
      description: cleanDescription,
      images: featuredImageUrl ? [featuredImageUrl] : [],
    },
  };
}
