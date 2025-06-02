'use client';

import { useState, useEffect } from 'react';
import { WordPressPost } from '@/app/lib/WordPress';
import Image from 'next/image';
import Link from 'next/link';

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp/v2/posts?_embed&per_page=20&categories=${categoryId}&exclude=${currentPostId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        setPosts(data);
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
                className="text-emerald-600 font-semibold text-sm uppercase 
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
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 
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
              <Link key={post.id} href={`/${post.slug}`} className="group">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  {post._embedded?.['wp:featuredmedia'] ? (
                    <Image
                      src={post._embedded['wp:featuredmedia'][0].source_url}
                      alt={post.title.rendered}
                      fill
                      sizes="(max-width: 768px) 45vw, (max-width: 1200px) 22vw, 18vw"
                      className="object-cover transition-transform duration-300 
                        group-hover:scale-105"
                      loading="lazy"
                      quality={80}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+JjHmsnLLKKRnHbwKJ3FlAm2O0UfGYJeO5Jp7Dcp3OHGMYd4b6aLgEJP5SjsNQFZAo9O5B+tWRcWlwJ3txdPGFVKdWKdlL8Whe2ZTBqD7+4I2HHDZ8Q/I4U4Q7XSB8ikEKDMBOGAyMPEtwq57Ck2xD/9k="
                    />
                  ) : (
                    <div
                      className="w-full h-full bg-gradient-to-br from-emerald-500 
                      to-teal-600"
                    />
                  )}
                </div>
                <h3
                  className="text-gray-900 font-medium mb-2 line-clamp-2 
                    group-hover:text-emerald-600 transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('sk-SK', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </time>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
