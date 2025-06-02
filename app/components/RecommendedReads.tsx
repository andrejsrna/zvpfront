'use client';

import { useEffect, useState } from 'react';
import { getRandomPost, WordPressPost } from '../lib/WordPress';
import Image from 'next/image';
import Link from 'next/link';
import AdUnit from './ads/AdUnit';
import { AD_SLOTS } from '../config/adSlots';

interface RecommendedReadsProps {
  currentPostId?: number;
  currentCategoryId?: number;
}

export default function RecommendedReads({
  currentPostId,
  currentCategoryId,
}: RecommendedReadsProps) {
  const [recommendedPost, setRecommendedPost] = useState<WordPressPost | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendedPost() {
      try {
        const posts = await getRandomPost();
        setRecommendedPost(posts[0] || null);
      } catch (error) {
        console.error('Error loading recommended post:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendedPost();
  }, [currentPostId, currentCategoryId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="bg-gray-200 rounded-2xl h-[400px] mb-4"></div>
        </div>
      </div>
    );
  }

  if (!recommendedPost) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
            Mohlo by vás zaujímať
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Čo čítať ďalej
          </h2>
        </div>

        {/* Ad before recommended article */}
        <div className="max-w-4xl mx-auto mb-8">
          <AdUnit
            slot={AD_SLOTS.RELATED_ARTICLES}
            format="horizontal"
            className="text-center"
          />
        </div>

        <Link
          href={`/${recommendedPost.slug}`}
          className="group block max-w-4xl mx-auto relative overflow-hidden rounded-2xl 
            bg-white shadow-sm hover:shadow-xl transition-all duration-500 
            hover:-translate-y-1"
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative aspect-[4/3] md:aspect-auto">
              {recommendedPost._embedded?.['wp:featuredmedia'] ? (
                <Image
                  src={
                    recommendedPost._embedded['wp:featuredmedia'][0].source_url
                  }
                  alt={recommendedPost.title.rendered}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover transition-transform duration-500 
                    group-hover:scale-105"
                  loading="lazy"
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
                    className="w-20 h-20 text-emerald-500 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Category Badge */}
              {recommendedPost.categories && recommendedPost.categories[0] && (
                <span
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm 
                  text-emerald-600 text-sm px-4 py-1.5 rounded-full font-medium 
                  shadow-sm"
                >
                  {recommendedPost.categories[0].name}
                </span>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-4 
                  group-hover:text-emerald-600 transition-colors"
                  dangerouslySetInnerHTML={{
                    __html: recommendedPost.title.rendered,
                  }}
                />

                <div
                  className="text-gray-600 mb-6 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: recommendedPost.excerpt.rendered,
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-emerald-600 font-medium">
                    Čítať článok
                    <svg
                      className="w-5 h-5 ml-1 transform group-hover:translate-x-1 
                      transition-transform"
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
                  </div>
                </div>
                <time className="text-sm text-gray-500">
                  {new Date(recommendedPost.date).toLocaleDateString('sk-SK', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </time>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
