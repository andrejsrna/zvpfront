import { getAllPosts, getCategories } from '@/app/lib/content/server';
import type { ContentPost } from '@/app/lib/content/types';
import { sanitizeExcerpt } from '@/app/lib/sanitizeHTML';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { decode } from 'he';

export const revalidate = 3600;

export default async function ArticlesPage() {
  const categories = await getCategories();
  const posts = await getAllPosts();

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Všetky články
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Objavte všetky naše články o zdraví, životnom štýle a wellness
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div
            className="flex overflow-x-auto py-4 -mx-4 px-4 gap-2 
            scrollbar-hide"
          >
            <Link
              href="/clanky"
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm 
                  font-medium transition-colors ${
                    'bg-primary text-white'
                  }`}
            >
              Všetky články
            </Link>
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/kategoria/${category.slug}`}
                className="px-4 py-2 rounded-full whitespace-nowrap text-sm
                  font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: ContentPost, index) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm 
                  hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9]">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title.rendered}
                      fill
                      sizes="(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 30vw"
                      className="object-cover transition-transform duration-300 
                        group-hover:scale-105"
                      loading={index < 6 ? 'eager' : 'lazy'}
                      quality={80}
                      unoptimized
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+JjHmsnLLKKRnHbwKJ3FlAm2O0UfGYJeO5Jp7Dcp3OHGMYd4b6aLgEJP5SjsNQFZAo9O5B+tWRcWlwJ3txdPGFVKdWKdlL8Whe2ZTBqD7+4I2HHDZ8Q/I4U4Q7XSB8ikEKDMBOGAyMPEtwq57Ck2xD/9k="
                    />
                  ) : (
                    <div
                      className="w-full h-full bg-gradient-to-br from-primary 
                      to-primary/80"
                    />
                  )}
                </div>
                <div className="p-6">
                  <p
                    className="text-primary text-sm font-medium mb-2
                      "
                  >
                    {post.categories?.[0]?.name || 'Nezaradené'}
                  </p>
                  <h2 className="text-xl font-bold mb-3">
                    <Link
                      href={`/${post.slug}`}
                      className="text-gray-900 hover:text-gray-700 transition-colors"
                    >
                      {decode(post.title.rendered)}
                    </Link>
                  </h2>
                  <div
                    className="text-gray-600 text-sm mb-4"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeExcerpt(post.excerpt.rendered),
                    }}
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-gray-500 text-sm">
                      {new Date(post.date).toLocaleDateString('sk-SK')}
                    </span>
                    <Link
                      href={`/${post.slug}`}
                      className="text-primary font-medium inline-flex
                        items-center hover:text-primary/80 transition-colors"
                    >
                      Čítať viac
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Články';
  const description =
    'Prehľad všetkých článkov o zdraví, životnom štýle a wellness';
  const canonical = '/clanky';

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      locale: 'sk_SK',
      siteName: 'Zdravie v praxi',
      images: ['/opengraph-image'],
    },
  };
}
