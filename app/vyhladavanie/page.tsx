import { searchPosts } from '@/app/lib/WordPress';
import Link from 'next/link';
import Image from 'next/image';
import he from 'he';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (await searchParams).q || '';
  const page = Number((await searchParams).page) || 1;
  const { posts, total, totalPages } = await searchPosts(query, 12, page);

  return (
    <div className="bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Výsledky vyhľadávania: {he.decode(query)}
        </h1>
        
        {total > 0 ? (
          <>
            <p className="text-gray-600 mb-8">
              Nájdených {total} výsledkov
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link href={`/${post.slug}`} key={post.id} className="group">
                  <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={(post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '/placeholder.jpg')}
                      alt={he.decode(post.title.rendered)}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h2 
                    className="text-xl font-semibold text-gray-900 group-hover:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: he.decode(post.title.rendered) }}
                  />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/vyhladavanie?q=${query}&page=${pageNum}`}
                    className={`px-4 py-2 rounded ${
                      pageNum === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Pre vyhľadávanie &quot;{he.decode(query)}&quot; neboli nájdené žiadne výsledky
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 