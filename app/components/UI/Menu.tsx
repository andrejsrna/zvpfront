'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories, type WordPressCategory } from '@/app/lib/WordPress';
import Search from './Search';
import {
  ChevronDownIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

export default function Menu() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-40">
          <div className="container mx-auto px-4 py-4">
            <Search onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="nav-container bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - replaced with text to avoid LCP issues */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-emerald-600 font-sora">
                Zdravie v praxi
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Domov
              </Link>
              <Link
                href="/clanky"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Články
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                <button className="flex items-center text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                  Kategórie
                  <ChevronDownIcon
                    className={`ml-1 h-4 w-4 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {isLoading ? (
                      <div className="px-4 py-2">
                        <div className="animate-pulse space-y-2">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded" />
                          ))}
                        </div>
                      </div>
                    ) : (
                      categories.slice(0, 8).map(category => (
                        <Link
                          key={category.id}
                          href={`/kategoria/${category.slug}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        >
                          {category.name}
                          <span className="text-sm text-gray-500 ml-2">
                            ({category.count})
                          </span>
                        </Link>
                      ))
                    )}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        href="/kategorie"
                        className="block px-4 py-2 text-emerald-600 hover:bg-emerald-50 transition-colors font-medium"
                      >
                        Zobraziť všetky kategórie →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/kontakt"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Kontakt
              </Link>

              {/* Search Button */}
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-emerald-600 focus:outline-none focus:text-emerald-600"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                >
                  Domov
                </Link>
                <Link
                  href="/clanky"
                  className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                >
                  Články
                </Link>

                {/* Mobile Categories */}
                <div className="px-3 py-2">
                  <span className="block text-gray-900 font-medium mb-2">
                    Kategórie
                  </span>
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {categories.slice(0, 6).map(category => (
                        <Link
                          key={category.id}
                          href={`/kategoria/${category.slug}`}
                          className="block px-2 py-1 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                        >
                          {category.name} ({category.count})
                        </Link>
                      ))}
                      <Link
                        href="/kategorie"
                        className="block px-2 py-1 text-sm text-emerald-600 font-medium"
                      >
                        Zobraziť všetky →
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/kontakt"
                  className="block px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                >
                  Kontakt
                </Link>

                {/* Mobile Search */}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                >
                  Vyhľadávanie
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
