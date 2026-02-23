import { advancedSearch } from '@/app/lib/content/server';
import Link from 'next/link';
import Image from 'next/image';
import { safeHeDecode } from '@/app/lib/sanitizeHTML';
import type { Metadata } from 'next';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export const revalidate = 300;

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q ? safeHeDecode(params.q) : '';
  const title = query ? `Vyhľadávanie: ${query}` : 'Vyhľadávanie';

  return {
    title,
    description: 'Vyhľadávanie článkov na Zdravie v praxi',
    alternates: { canonical: '/search' },
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (await searchParams).q || '';
  const page = Number((await searchParams).page) || 1;
  const { posts, total, totalPages } = await advancedSearch(query, 12, page);

  return (
    <div className="bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Výsledky vyhľadávania: {safeHeDecode(query)}
        </h1>

        {total > 0 ? (
          <>
            <p className="text-gray-600 mb-8">Nájdených {total} výsledkov</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <Link href={`/${post.slug}`} key={post.id} className="group">
                  <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={
                        post.featuredImage ??
                        '/placeholder.jpg'
                      }
                      alt={safeHeDecode(post.title.rendered)}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <h2
                    className="text-xl font-semibold text-gray-900 group-hover:text-primary"
                    dangerouslySetInnerHTML={{
                      __html: post.title.rendered,
                    }}
                  />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  pageNum => (
                    <Link
                      key={pageNum}
                      href={`/search?q=${encodeURIComponent(query)}&page=${pageNum}`}
                      className={`px-4 py-2 rounded ${
                        pageNum === page
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Pre vyhľadávanie &quot;{safeHeDecode(query)}&quot; neboli nájdené
              žiadne výsledky
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
