import Link from 'next/link';

export default function SearchRedirectPage() {
  return (
    <main className="bg-white pt-32 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Vyhľadávanie</h1>
        <p className="text-gray-600 mb-6">
          Vyhľadávanie je dostupné na novej adrese.
        </p>
        <Link className="text-primary font-medium" href="/search">
          Prejsť na vyhľadávanie
        </Link>
      </div>
    </main>
  );
}
