'use client';

import { useEffect, useState } from 'react';
import { getPosts, WordPressPost, transformUrl } from '../lib/WordPress';
import Link from 'next/link';
import Image from 'next/image';
import { sanitizeExcerpt } from '@/app/lib/sanitizeHTML';

export default function RecentPosts() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const fetchedPosts = await getPosts(6);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl aspect-[16/10] mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sora">
            Najnovšie články
          </h2>
          <div
            className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 
            mx-auto rounded-full"
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link
              href={`/${post.slug}`}
              key={post.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md 
                transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {post._embedded?.['wp:featuredmedia'] ? (
                  <Image
                    src={transformUrl(
                      post._embedded['wp:featuredmedia'][0].source_url
                    )}
                    alt={post.title.rendered}
                    fill
                    sizes="(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 30vw"
                    className="object-cover transition-transform duration-300 
                      group-hover:scale-105"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    priority={index < 3}
                    quality={80}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+JjHmsnLLKKRnHbwKJ3FlAm2O0UfGYJeO5Jp7Dcp3OHGMYd4b6aLgEJP5SjsNQFZAo9O5B+tWRcWlwJ3txdPGFVKdWKdlL8Whe2ZTBqD7+4I2HHDZ8Q/I4U4Q7XSB8ikEKDMBOGAyMPEtwq57Ck2xD/9k="
                  />
                ) : (
                  <div
                    className="w-full h-full bg-gradient-to-br from-emerald-100 
                    to-teal-50 flex items-center justify-center"
                  >
                    <svg
                      className="w-12 h-12 text-emerald-500 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}

                {post.categories && post.categories[0] && (
                  <span
                    className="absolute top-4 right-4 bg-emerald-500 text-white 
                    text-sm px-3 py-1 rounded-full font-medium"
                  >
                    {post.categories[0].name}
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3
                  className="text-xl font-semibold text-gray-900 mb-2 
                  group-hover:text-emerald-600 transition-colors line-clamp-2 font-sora"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />

                <div
                  className="text-gray-600 text-sm leading-relaxed line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeExcerpt(post.excerpt.rendered),
                  }}
                />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-600 font-medium">
                    Čítať viac
                    <span className="ml-2 group-hover:ml-3 transition-all duration-300">
                      →
                    </span>
                  </span>
                  <span className="text-gray-500">
                    {new Date(post.date).toLocaleDateString('sk-SK', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href="/clanky"
            className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Všetky články →
          </Link>
        </div>
      </div>
    </section>
  );
}
