'use client';

import { useState, useEffect } from 'react';
import { WordPressPost, getPosts } from '@/app/lib/WordPress';
import Link from 'next/link';
import he from 'he';

interface ReadMoreProps {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  currentPostId: number;
}

export default function ReadMore({
  categoryId,
  categoryName,
  categorySlug,
  currentPostId,
}: ReadMoreProps) {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts(20, 'date', categoryId);
        // Filter out current post
        const filteredPosts = data.filter(post => post.id !== currentPostId);
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (categoryId) {
      fetchPosts();
    }
  }, [categoryId, currentPostId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg aspect-[4/3] mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span
                className="text-emerald-800 font-semibold text-sm uppercase 
                tracking-wider"
              >
                Ďalšie články z kategórie
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {categoryName}
              </h2>
            </div>
            <Link
              href={`/kategoria/${categorySlug}`}
              className="inline-flex items-center text-emerald-800 hover:text-emerald-900 
                font-medium transition-colors"
            >
              Zobraziť všetky
              <svg
                className="w-5 h-5 ml-1"
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
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {posts.slice(0, 8).map(post => (
              <div key={post.id} className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  <Link
                    href={`/${post.slug}`}
                    className="hover:text-emerald-900 transition-colors"
                  >
                    {he.decode(post.title.rendered)}
                  </Link>
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 0 002-2V7a2 0 00-2-2H5a2 0 00-2 2v12a2 0 002 2z"
                    />
                  </svg>
                  {new Date(post.date).toLocaleDateString('sk-SK', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
