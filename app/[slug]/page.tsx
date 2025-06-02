import Newsletter from '@/app/components/Newsletter';
import RecommendedReads from '@/app/components/RecommendedReads';
import ReadMore from '@/app/components/UI/ReadMore';
import WeRecommend from '@/app/components/UI/WeRecommend';
import { getPostBySlug } from '@/app/lib/WordPress';
import { parseHeadings } from '@/app/utils/parseHeadings';
import he from 'he';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShareButtons from '../components/UI/ShareButtons';
import StickyAd from '@/app/components/ads/StickyAd';
import ArticleContent from '@/app/components/ArticleContent';
import TableOfContents from '@/app/components/TableOfContents';
import { AD_SLOTS } from '@/app/config/adSlots';

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
  const post = await getPostBySlug(params.slug);

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
    <article className="bg-white">
      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Sticky Ad */}
      <StickyAd slot={AD_SLOTS.SIDEBAR_STICKY} position="right" />

      {/* Hero Section */}
      <div className="relative w-full aspect-[16/9] max-h-[60vh] min-h-[400px] overflow-hidden">
        {featuredImageUrl ? (
          <>
            <Image
              src={featuredImageUrl}
              alt={featuredImageAlt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+JjHmsnLLKKRnHbwKJ3FlAm2O0UfGYJeO5Jp7Dcp3OHGMYd4b6aLgEJP5SjsNQFZAo9O5B+tWRcWlwJ3txdPGFVKdWKdlL8Whe2ZTBqD7+4I2HHDZ8Q/I4U4Q7XSB8ikEKDMBOGAyMPEtwq57Ck2xD/9k="
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60
              via-transparent to-transparent"
            />
          </>
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-emerald-500
            to-teal-600"
          />
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container mx-auto max-w-4xl">
            {post.categories && post.categories[0] && (
              <Link
                href={`/kategoria/${post.categories[0].slug}`}
                className="inline-block px-4 py-1.5 bg-emerald-500 text-white
                  text-sm font-medium rounded-full mb-4 hover:bg-emerald-600
                  transition-colors"
              >
                {post.categories[0].name}
              </Link>
            )}
            <h1
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-sora"
              dangerouslySetInnerHTML={{
                __html: he.decode(post.title.rendered),
              }}
            />
            <div className="flex items-center text-white/90 space-x-4 text-sm">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('sk-SK', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          <TableOfContents headings={headings} />

          {/* Main Content */}
          <ArticleContent
            content={he.decode(content)}
            className="prose prose-lg max-w-none prose-headings:font-heading
              prose-headings:text-gray-900 prose-a:text-emerald-600
              hover:prose-a:text-emerald-700 prose-img:rounded-xl
              prose-strong:text-gray-900"
          />

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
                {post.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm
                      rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ShareButtons
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`}
        title={he.decode(post.title.rendered)}
        description={he.decode(post.excerpt.rendered.replace(/<[^>]*>/g, ''))}
      />
      {post.tags?.some(tag => tag.slug === 'klby') && <WeRecommend />}
      {/* Related Posts */}
      <RecommendedReads
        currentPostId={post.id}
        currentCategoryId={post.categories?.[0]?.id}
      />
      <Newsletter />
      {post.categories?.[0] && (
        <ReadMore
          categoryId={post.categories[0].id}
          categoryName={post.categories[0].name}
          categorySlug={post.categories[0].slug}
          currentPostId={post.id}
        />
      )}
    </article>
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
