"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchPosts, WordPressPost } from '@/app/lib/WordPress';
import Link from 'next/link';
import Image from 'next/image';

interface SearchProps {
  onClose?: () => void;
}

export default function Search({ onClose }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WordPressPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleSearch = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchPosts(query);
        setResults(data.posts);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/vyhladavanie?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Hľadať články..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2
              text-gray-400 hover:text-emerald-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Výsledky vyhľadávania */}
      {isOpen && (query.length >= 2 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg 
          shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Vyhľadávam...
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map((post) => (
                <Link
                  key={post.id}
                  href={`/${post.slug}`}
                  onClick={handleLinkClick}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {post._embedded?.['wp:featuredmedia'] && (
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={post._embedded['wp:featuredmedia'][0].source_url}
                          alt={post.title.rendered}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      <p className="text-sm text-gray-500 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
              {results.length >= 10 && (
                <div className="p-4 border-t">
                  <button
                    onClick={handleSubmit}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Zobraziť všetky výsledky
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Žiadne výsledky
            </div>
          )}
        </div>
      )}
    </div>
  );
} 