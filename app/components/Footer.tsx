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
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Zdravie v praxi. Všetky práva
            vyhradené.
          </p>
          <p className="text-xs text-gray-400 mt-4 md:mt-0 text-center md:text-right">
            Informácie na tejto stránke nenahradzujú odborné lekárske
            poradenstvo. Pred začatím akéhokoľvek cvičebného programu alebo
            diéty sa poraďte so svojim lekárom.
          </p>
        </div>
      </div>
    </footer>
  );
}
