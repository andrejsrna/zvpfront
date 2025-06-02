'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Search from './Search';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function Menu() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md shadow-xl border-b border-white/10">
      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="container mx-auto px-4 py-4">
            <Search onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Enhanced navigation with better visibility */}
      <nav className="relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo with better contrast */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-white drop-shadow-2xl">
                Zdravie v praxi
              </span>
            </Link>

            {/* Desktop Navigation with enhanced styling */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-100 hover:text-white font-medium transition-colors drop-shadow-lg px-3 py-2 rounded-md hover:bg-white/10"
              >
                Domov
              </Link>
              <Link
                href="/clanky"
                className="text-gray-100 hover:text-white font-medium transition-colors drop-shadow-lg px-3 py-2 rounded-md hover:bg-white/10"
              >
                Články
              </Link>
              <Link
                href="/kontakt"
                className="text-gray-100 hover:text-white font-medium transition-colors drop-shadow-lg px-3 py-2 rounded-md hover:bg-white/10"
              >
                Kontakt
              </Link>

              {/* Search Button with enhanced styling */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-3 text-gray-100 hover:text-white transition-colors drop-shadow-lg rounded-md hover:bg-white/10"
                aria-label="Vyhľadávanie"
              >
                <svg
                  className="w-5 h-5"
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

            {/* Mobile menu button with better styling */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-100 hover:text-white focus:outline-none drop-shadow-lg p-2 rounded-md hover:bg-white/10"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation with enhanced styling */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-md rounded-lg mt-2 shadow-2xl border border-white/20">
                <Link
                  href="/"
                  className="block px-4 py-3 text-gray-100 hover:text-white hover:bg-white/20 rounded-md transition-colors"
                >
                  Domov
                </Link>
                <Link
                  href="/clanky"
                  className="block px-4 py-3 text-gray-100 hover:text-white hover:bg-white/20 rounded-md transition-colors"
                >
                  Články
                </Link>
                <Link
                  href="/kontakt"
                  className="block px-4 py-3 text-gray-100 hover:text-white hover:bg-white/20 rounded-md transition-colors"
                >
                  Kontakt
                </Link>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="block w-full text-left px-4 py-3 text-gray-100 hover:text-white hover:bg-white/20 rounded-md transition-colors"
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
