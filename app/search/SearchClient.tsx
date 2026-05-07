'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { safeHeDecode } from '@/app/lib/sanitizeHTML';
import { advancedSearch } from '@/app/lib/content/client';
import type { ContentPost } from '@/app/lib/content/types';

function SearchResults({
  query,
  posts,
  total,
}: {
  query: string;
  posts: ContentPost[];
  total: number;
}) {
  return (
    <>
      {total > 0 ? (
        <>
          <p className="text-gray-600 mb-8">Nájdených {total} výsledkov</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link href={`/${post.slug}`} key={post.id} className="group">
                <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={post.featuredImage ?? '/placeholder.jpg'}
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
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {query
              ? `Pre vyhľadávanie "${safeHeDecode(query)}" neboli nájdené žiadne výsledky`
              : 'Zadajte hľadaný výraz v hornej navigácii.'}
          </p>
        </div>
      )}
    </>
  );
}

export default function SearchClient() {
  const params = useSearchParams();
  const query = params.get('q') || '';
  const [result, setResult] = useState<{ posts: ContentPost[]; total: number }>({
    posts: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    advancedSearch(query, 60, 1)
      .then(searchResult => {
        if (!cancelled) {
          setResult({ posts: searchResult.posts, total: searchResult.total });
        }
      })
      .catch(() => {
        if (!cancelled) setResult({ posts: [], total: 0 });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {query
            ? `Výsledky vyhľadávania: ${safeHeDecode(query)}`
            : 'Vyhľadávanie'}
        </h1>
        {loading ? (
          <p className="text-gray-600">Vyhľadávam...</p>
        ) : (
          <SearchResults query={query} posts={result.posts} total={result.total} />
        )}
      </div>
    </div>
  );
}
