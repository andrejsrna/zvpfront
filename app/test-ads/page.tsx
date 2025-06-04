'use client';

import { useEffect, useState } from 'react';
import AdUnit from '@/app/components/ads/AdUnit';
import StickyAd from '@/app/components/ads/StickyAd';
import { AD_SLOTS } from '@/app/config/adSlots';

export default function TestAdsPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Google Ads Test Page
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <div>Scrolled: {scrolled ? 'Yes' : 'No'}</div>
            <div>
              Window position:{' '}
              {typeof window !== 'undefined' ? window.scrollY : 0}px
            </div>
          </div>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => window.debugAds?.()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Debug Ads
            </button>
            <button
              onClick={() => window.reinitializeAds?.()}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Reinitialize Ads
            </button>
          </div>
        </div>

        {/* Test Rectangle Ad */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Rectangle Ad (300x250)</h3>
          <AdUnit
            slot={AD_SLOTS.SIDEBAR_STICKY}
            format="rectangle"
            responsive={false}
            style={{ width: '300px', height: '250px' }}
          />
        </div>

        {/* Test Horizontal Ad */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Horizontal Ad (Auto)</h3>
          <AdUnit
            slot={AD_SLOTS.IN_ARTICLE_1}
            format="auto"
            responsive={true}
          />
        </div>

        {/* Filler content to test sticky ad */}
        <div className="space-y-8">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                Test Content {i + 1}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Testing Instructions
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Open browser console (F12)</li>
            <li>• Scroll down to trigger sticky ad (after 200px)</li>
            <li>• Click &ldquo;Debug Ads&rdquo; to inspect ad elements</li>
            <li>• Check for any console errors</li>
            <li>• Verify ads load after cookie consent</li>
          </ul>
        </div>
      </div>

      {/* Sticky Ad */}
      <StickyAd slot={AD_SLOTS.SIDEBAR_STICKY} position="right" />
    </div>
  );
}
