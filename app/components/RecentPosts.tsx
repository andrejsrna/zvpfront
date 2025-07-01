'use client';

import { useEffect, useState } from 'react';
import { getPosts, WordPressPost } from '../lib/WordPress';
import Link from 'next/link';
import PostCard from './PostCard';

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
            className="w-24 h-1 bg-gradient-to-r from-[#3e802b] to-[#4a9a35] 
            mx-auto rounded-full"
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href="/clanky"
            className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-[#3e802b] rounded-full hover:bg-[#4a9a35] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#3e802b] focus:ring-offset-2"
          >
            Všetky články →
          </Link>
        </div>
      </div>
    </section>
  );
}
