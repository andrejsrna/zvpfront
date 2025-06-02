'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import { getCategories, WordPressCategory } from '../../lib/WordPress';
import Search from './Search';
import Image from 'next/image';

export default function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  // Zoberieme len top 6 kategórií podľa počtu článkov
  const topCategories = categories
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  // Skeleton placeholder for loading categories
  const CategorySkeleton = () => (
    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
  );

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md w-full top-0 z-50">
      {/* Desktop Top Navigation */}
      <div className="border-b border-gray-100 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Domov
              </Link>
              <Link
                href="/kontakt"
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Kontakt
              </Link>
              <Link
                href="/ochrana-sukromia"
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Ochrana súkromia
              </Link>
              <Link
                href="/podmienky-pouzivania"
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Podmienky používania
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/zvp.png"
                alt="Logo"
                width={60}
                height={60}
                className="md:w-[80px] md:h-[50px]"
                priority
                sizes="(max-width: 768px) 60px, 80px"
              />
            </Link>
          </div>

          {/* Desktop Categories Navigation */}
          <div className="hidden lg:flex items-center space-x-8 min-h-[24px]">
            {isLoadingCategories ? (
              // Show skeleton while loading
              <>
                <CategorySkeleton />
                <CategorySkeleton />
                <CategorySkeleton />
              </>
            ) : (
              topCategories.map(category => (
                <div key={category.id}>
                  <Link
                    href={`/kategoria/${category.slug}`}
                    className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                  >
                    {category.name}
                  </Link>
                </div>
              ))
            )}

            {/* Statický link na všetky kategórie */}
            <Link
              href="/kategorie"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium flex items-center"
            >
              Všetky kategórie
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
            </Link>

            {/* Desktop Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
              aria-label="Vyhľadávanie"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-4 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
              aria-label="Vyhľadávanie"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`border-t border-gray-100 transform transition-all duration-300 overflow-hidden
          ${isSearchOpen ? 'opacity-100 translate-y-0 max-h-20' : 'opacity-0 -translate-y-4 max-h-0'}`}
        >
          <div className="py-4">
            <Search onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transform transition-all duration-300 overflow-hidden
          ${isMenuOpen ? 'opacity-100 translate-y-0 max-h-screen' : 'opacity-0 -translate-y-4 max-h-0'}`}
        >
          <div className="pt-2 pb-4 border-t border-gray-100 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <Link
              href="/kontakt"
              onClick={handleMenuItemClick}
              className="block px-4 py-2 text-gray-700 hover:bg-teal-50 
                hover:text-teal-600 transition-colors"
            >
              Kontakt
            </Link>

            {/* Legal links */}
            <div className="border-t border-gray-100 mt-2 pt-2">
              <Link
                href="/ochrana-sukromia"
                onClick={handleMenuItemClick}
                className="block px-4 py-2 text-gray-700 hover:bg-teal-50 
                  hover:text-teal-600 transition-colors"
              >
                Ochrana súkromia
              </Link>
              <Link
                href="/podmienky-pouzivania"
                onClick={handleMenuItemClick}
                className="block px-4 py-2 text-gray-700 hover:bg-teal-50 
                  hover:text-teal-600 transition-colors"
              >
                Podmienky používania
              </Link>
              <Link
                href="/cookies"
                onClick={handleMenuItemClick}
                className="block px-4 py-2 text-gray-700 hover:bg-teal-50 
                  hover:text-teal-600 transition-colors"
              >
                Cookies
              </Link>
            </div>

            {/* Mobile Categories */}
            <div className="py-2 border-y">
              <div className="px-4 py-2 text-sm font-medium text-gray-500">
                Kategórie
              </div>
              {isLoadingCategories ? (
                // Show skeleton in mobile menu
                <div className="px-4 py-2 space-y-2">
                  <CategorySkeleton />
                  <CategorySkeleton />
                  <CategorySkeleton />
                </div>
              ) : (
                categories.map(category => (
                  <div key={category.id}>
                    <Link
                      href={`/kategoria/${category.slug}`}
                      onClick={handleMenuItemClick}
                      className="block px-4 py-2 text-gray-700 hover:bg-teal-50 
                        hover:text-teal-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/o-nas"
              onClick={handleMenuItemClick}
              className="block px-4 py-3 text-gray-700 hover:bg-teal-50 
                hover:text-teal-600 transition-colors"
            >
              O nás
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
