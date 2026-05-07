import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Vyhľadávanie',
  description: 'Vyhľadávanie článkov na Zdravie v praxi',
  alternates: { canonical: '/search' },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="h-8 w-72 bg-gray-100 rounded animate-pulse mb-8" />
          </div>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
