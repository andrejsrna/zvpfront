import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

import {
  getPostsByTagSlug,
  getTagBySlug,
} from '@/app/lib/content/server';
import { sanitizeExcerpt, safeHeDecode } from '@/app/lib/sanitizeHTML';
import type { ContentPost } from '@/app/lib/content/types';

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const POSTS_PER_PAGE = 12;

export const revalidate = 3600;

export default async function TagPage({
  params: paramsPromise,
  searchParams,
}: TagPageProps) {
  const params = await paramsPromise;
  const searchParamsResolved = await searchParams;
  const page = Number(searchParamsResolved.page) || 1;

  const tag = await getTagBySlug(params.slug);
  if (!tag) notFound();

  const posts = await getPostsByTagSlug(tag.slug, POSTS_PER_PAGE, page);
  const totalPosts = tag.count;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-primary to-primary/80 mt-20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              #{tag.name}
            </h1>
            <div className="mt-4 text-white/80">
              {totalPosts}{' '}
              {totalPosts === 1
                ? 'článok'
                : totalPosts < 5
                  ? 'články'
                  : 'článkov'}
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: ContentPost, index) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm 
                  hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9]">
                  {post.featuredImage ? (
	                    <Image
	                      src={post.featuredImage}
	                      alt={safeHeDecode(post.title.rendered)}
	                      fill
	                      sizes="(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 30vw"
	                      className="object-cover transition-transform duration-300 
	                        group-hover:scale-105"
	                      loading={index < 6 ? 'eager' : 'lazy'}
	                      quality={80}
	                      unoptimized
	                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80" />
                  )}
                </div>
                <div className="p-6">
                  <p className="text-primary text-sm font-medium mb-2">
                    {post.categories?.[0]?.name || 'Nezaradené'}
                  </p>
                  <h2 className="text-xl font-bold mb-3">
                    <span
                      className="text-gray-900 hover:text-gray-700 transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </h2>
                  <div
                    className="text-gray-600 text-sm mb-4"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeExcerpt(post.excerpt.rendered),
                    }}
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-gray-500 text-sm">
                      {new Date(post.date).toLocaleDateString('sk-SK')}
                    </span>
                    <span className="text-primary font-medium inline-flex items-center">
                      Čítať viac
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/tag/${tag.slug}?page=${page - 1}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                    border border-gray-300 rounded-lg hover:bg-gray-50 
                    transition-colors"
                >
                  Predchádzajúca
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/tag/${tag.slug}?page=${page + 1}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                    border border-gray-300 rounded-lg hover:bg-gray-50 
                    transition-colors"
                >
                  Ďalšia
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params: paramsPromise,
  searchParams,
}: TagPageProps): Promise<Metadata> {
  const params = await paramsPromise;
  const searchParamsResolved = await searchParams;
  const page = Number(searchParamsResolved.page) || 1;
  const tag = await getTagBySlug(params.slug);
  if (!tag) {
    return {
      title: 'Tag nenájdený',
      description: 'Požadovaný tag sa nenašiel',
    };
  }

  const title = `#${tag.name}${page > 1 ? ` – strana ${page}` : ''} | Zdravie v praxi`;
  const description = `Články s tagom ${tag.name}`;
  const canonical = `/tag/${tag.slug}${page > 1 ? `?page=${page}` : ''}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      locale: 'sk_SK',
      siteName: 'Zdravie v praxi',
      images: ['/opengraph-image'],
    },
  };
}
