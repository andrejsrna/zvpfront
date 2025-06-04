'use client';

import { useEffect, useState } from 'react';
import AdUnit from './AdUnit';

interface StickyAdProps {
  slot: string;
  position?: 'left' | 'right';
}

export default function StickyAd({ slot, position = 'right' }: StickyAdProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 200; // Reduced threshold for earlier display
      setIsVisible(scrolled);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-20 ${
        position === 'right' ? 'right-4' : 'left-4'
      } z-40 hidden xl:block transition-all duration-300 ease-in-out`}
      style={{
        width: '300px',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <p className="text-xs text-gray-500 text-center mb-2 font-medium">
          Reklama
        </p>
        <AdUnit
          slot={slot}
          format="rectangle"
          responsive={false}
          forceLoad={true}
          className="sticky-ad-unit"
          style={{
            width: '300px',
            height: '250px',
          }}
        />
      </div>
    </div>
  );
}
