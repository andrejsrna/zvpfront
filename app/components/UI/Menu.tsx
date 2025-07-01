'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Search from './Search';
import {
  XMarkIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function Menu() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle ESC key to close search
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isSearchOpen]);

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      {/* Search overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
          onClick={e => {
            if (e.target === e.currentTarget) {
              setIsSearchOpen(false);
            }
          }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="relative max-w-2xl mx-auto">
              {/* Close button */}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-2 -right-12 z-10 p-2 hidden md:block bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-[#3e802b]/30"
                aria-label="Zatvoriť vyhľadávanie"
              >
                <XMarkIcon className="w-5 h-5 text-gray-600 hover:text-[#3e802b] transition-colors" />
              </button>
              <Search onClose={() => setIsSearchOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced navigation with modern design */}
      <nav className="relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between align-middle h-20">
            {/* Logo with enhanced styling */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-24 h-12 flex-shrink-0">
                <Image
                  src="/logos/logo.png"
                  alt="Zdravie v praxi"
                  width={96}
                  height={96}
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#3e802b] to-[#4a9a35] bg-clip-text text-transparent">
                  Zdravie v praxi
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Odborné články o zdraví
                </p>
              </div>
            </Link>

            {/* Desktop Navigation with enhanced styling */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/"
                className="relative px-4 py-2 text-gray-700 hover:text-[#3e802b] font-medium transition-all duration-200 rounded-lg hover:bg-[#3e802b]/10 group"
              >
                Domov
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#3e802b] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
              </Link>
              <Link
                href="/clanky"
                className="relative px-4 py-2 text-gray-700 hover:text-[#3e802b] font-medium transition-all duration-200 rounded-lg hover:bg-[#3e802b]/10 group"
              >
                Články
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#3e802b] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
              </Link>
              <Link
                href="/kategorie"
                className="relative px-4 py-2 text-gray-700 hover:text-[#3e802b] font-medium transition-all duration-200 rounded-lg hover:bg-[#3e802b]/10 group"
              >
                Kategórie
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#3e802b] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
              </Link>
              <Link
                href="/kontakt"
                className="relative px-4 py-2 text-gray-700 hover:text-[#3e802b] font-medium transition-all duration-200 rounded-lg hover:bg-[#3e802b]/10 group"
              >
                Kontakt
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#3e802b] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
              </Link>

              {/* Search Button with enhanced styling */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="ml-2 p-2.5 text-gray-600 hover:text-[#3e802b] transition-all duration-200 rounded-lg hover:bg-[#3e802b]/10 border border-gray-200 hover:border-[#3e802b]/30"
                aria-label="Vyhľadávanie"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button with enhanced styling */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-gray-600 hover:text-[#3e802b] transition-all duration-200 rounded-lg hover:bg-[#3e802b]/10 border border-gray-200 hover:border-[#3e802b]/30"
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
            <div className="md:hidden animate-in slide-in-from-top-2 duration-200">
              <div className="px-2 pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-xl rounded-xl mt-2 shadow-xl border border-gray-200/50">
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-[#3e802b] hover:bg-[#3e802b]/10 rounded-lg transition-all duration-200 font-medium"
                >
                  <span className="w-2 h-2 bg-[#3e802b] rounded-full mr-3"></span>
                  Domov
                </Link>
                <Link
                  href="/clanky"
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-[#3e802b] hover:bg-[#3e802b]/10 rounded-lg transition-all duration-200 font-medium"
                >
                  <span className="w-2 h-2 bg-[#3e802b] rounded-full mr-3"></span>
                  Články
                </Link>
                <Link
                  href="/kategorie"
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-[#3e802b] hover:bg-[#3e802b]/10 rounded-lg transition-all duration-200 font-medium"
                >
                  <span className="w-2 h-2 bg-[#3e802b] rounded-full mr-3"></span>
                  Kategórie
                </Link>
                <Link
                  href="/kontakt"
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-[#3e802b] hover:bg-[#3e802b]/10 rounded-lg transition-all duration-200 font-medium"
                >
                  <span className="w-2 h-2 bg-[#3e802b] rounded-full mr-3"></span>
                  Kontakt
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-[#3e802b] hover:bg-[#3e802b]/10 rounded-lg transition-all duration-200 font-medium"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 mr-3 text-[#3e802b]" />
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
