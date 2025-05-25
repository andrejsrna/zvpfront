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
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-24 ${
        position === 'right' ? 'right-4' : 'left-4'
      } z-40 hidden xl:block transition-opacity duration-300`}
      style={{ width: '300px' }}
    >
      <div className="bg-white rounded-lg shadow-lg p-4">
        <p className="text-xs text-gray-500 text-center mb-2">Reklama</p>
        <AdUnit
          slot={slot}
          format="rectangle"
          responsive={false}
          style={{
            width: '300px',
            height: '250px',
          }}
        />
      </div>
    </div>
  );
}
