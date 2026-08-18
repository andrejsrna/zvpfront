'use client';

import Link from 'next/link';
import CookieSettings from './CookieSettings';

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Links Section */}
        <div className="mb-6 pb-6 border-b border-gray-800">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link
              href="/ochrana-sukromia"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Ochrana súkromia
            </Link>
            <Link
              href="/podmienky-pouzivania"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Podmienky používania
            </Link>
            <Link
              href="/cookies"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Zásady cookies
            </Link>
            <CookieSettings />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-gray-400">
            <span>&copy; {new Date().getFullYear()} Zdravie v praxi. Všetky práva vyhradené.</span>
            <span className="hidden sm:inline">|</span>
            <span>Vývoj a technológia: <a href="https://synthbit.sk" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">SynthBit</a></span>
          </div>
          <p className="text-xs text-gray-400 text-center md:text-right">
            Informácie na tejto stránke nenahradzujú odborné lekárske poradenstvo.
          </p>
        </div>
      </div>
    </footer>
  );
}
