import { Suspense } from 'react';
import { getAllPosts, getPostBySlug } from '@/app/lib/content/server';
import type { ContentPost } from '@/app/lib/content/types';
import { parseHeadings } from '@/app/utils/parseHeadings';
import { safeHeDecode } from '@/app/lib/sanitizeHTML';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleContent from '@/app/components/ArticleContent';
import FeaturedImage from '@/app/components/FeaturedImage';
import {
  LazyNewsletter,
  LazyRecommendedReads,
  LazyReadMore,
  LazyWeRecommend,
  LazyShareButtons,
  LazyTableOfContents,
} from '@/app/components/LazyComponents';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const rawLimit = process.env.PREBUILD_POSTS_COUNT;
  const parsedLimit = rawLimit ? Number.parseInt(rawLimit, 10) : NaN;
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 200;

  return posts.slice(0, limit).map(post => ({
    slug: post.slug,
  }));
}

// Fast Post component for immediate rendering
async function PostContent({ slug }: { slug: string }) {
  let post: ContentPost | null;

  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  const seoTitle = safeHeDecode(post.seoTitle || post.title.rendered).slice(
    0,
    160
  );
  const seoDescription = safeHeDecode(
    post.seoDescription || post.excerpt.rendered
  )
    .replace(/<[^>]*>/g, '')
    .slice(0, 160);

  const { headings, content } = parseHeadings(post.content.rendered);

  const featuredImageUrl = post.featuredImage;
  const featuredImageAlt = safeHeDecode(post.title.rendered);

  // Schema.org Article markup
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seoTitle,
    description: seoDescription,
    image: featuredImageUrl,
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

  return (
    <>
      <article className="bg-white">
        {/* Schema.org markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        {/* ABOVE FOLD: Critical content */}
        <div className="container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* H1 Title - CRITICAL for SEO */}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                {post.categories && post.categories[0] && (
                  <Link
                    href={`/kategoria/${post.categories[0].slug}`}
                    className="inline-block px-4 py-2 bg-[#3e802b] text-white
                      text-sm font-medium rounded-full hover:bg-[#4a9a35]
                      transition-colors shadow-lg"
                  >
                    {post.categories[0].name}
                  </Link>
                )}
                <time dateTime={post.date} className="text-gray-500 text-sm">
                  {new Date(post.date).toLocaleDateString('sk-SK', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </header>

            {/* Featured Image - positioned between title and content */}
            {featuredImageUrl && (
              <FeaturedImage src={featuredImageUrl} alt={featuredImageAlt} />
            )}

            {/* DEFERRED: Table of Contents */}
            <Suspense
              fallback={
                <div className="h-16 bg-gray-100 rounded-lg animate-pulse mb-8" />
              }
            >
              <LazyTableOfContents headings={headings} />
            </Suspense>

            {/* CRITICAL: Article Content with immediate fallback */}
            <Suspense
              fallback={
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-5/6 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-4/6 animate-pulse" />
                  <div className="h-40 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              }
            >
              <ArticleContent
                content={content}
                className="prose prose-lg max-w-none prose-headings:font-heading
                  prose-headings:text-gray-900 prose-a:text-[#3e802b]
                  hover:prose-a:text-[#4a9a35] prose-img:rounded-xl
                  prose-strong:text-gray-900"
              />
            </Suspense>

            {/* DEFERRED: Tags */}
            {post.tags && post.tags.length > 0 && (
              <Suspense fallback={null}>
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
              </Suspense>
            )}
          </div>
        </div>

        {/* BELOW FOLD: Non-critical lazy components */}
        <Suspense fallback={null}>
          <LazyShareButtons
            url={`${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`}
            title={seoTitle}
            description={seoDescription}
          />
        </Suspense>

        {/* Conditional content - Very low priority */}
        <Suspense fallback={null}>
          {post.tags?.some((tag: { slug: string }) => tag.slug === 'klby') && (
            <LazyWeRecommend />
          )}
        </Suspense>

        {/* Related content - Low priority */}
        <Suspense fallback={null}>
          <LazyRecommendedReads
            currentPostId={post.id}
            currentCategoryId={post.categories?.[0]?.id}
          />
        </Suspense>

        <Suspense fallback={null}>
          <LazyNewsletter />
        </Suspense>

        <Suspense fallback={null}>
          {post.categories?.[0] && (
            <LazyReadMore
              categoryId={post.categories[0].id}
              categoryName={post.categories[0].name}
              categorySlug={post.categories[0].slug}
              currentPostId={post.id}
            />
          )}
        </Suspense>
      </article>
    </>
  );
}

export default async function PostPage({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;

  return (
    <Suspense
      fallback={
        <div className="bg-white">
          {/* Fast loading placeholder for LCP */}
          <div className="w-full h-screen bg-gradient-to-br from-primary to-primary/80" />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-8 animate-pulse" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-4/6 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PostContent slug={params.slug} />
    </Suspense>
  );
}

// Optimized metadata generation
export async function generateMetadata({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;

  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      return {
        title: 'Článok nenájdený',
        description: 'Požadovaný článok sa nenašiel',
      };
    }

    const metaTitle = safeHeDecode(post.seoTitle || post.title.rendered).slice(
      0,
      160
    );
    const cleanDescription = safeHeDecode(
      post.seoDescription || post.excerpt.rendered
    )
      .replace(/<[^>]*>/g, '')
      .slice(0, 160);
    const featuredImageUrl = post.featuredImage;
    const canonical = `/${post.slug}`;
    const images = featuredImageUrl ? [featuredImageUrl] : ['/opengraph-image'];

    return {
      title: metaTitle,
      description: cleanDescription,
      alternates: {
        canonical,
      },
      openGraph: {
        type: 'article',
        title: metaTitle,
        description: cleanDescription,
        url: canonical,
        siteName: 'Zdravie v praxi',
        locale: 'sk_SK',
        publishedTime: post.date,
        modifiedTime: post.modified,
        images,
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: cleanDescription,
        images,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Chyba načítania článku',
      description: 'Nastala chyba pri načítavaní článku',
    };
  }
}
