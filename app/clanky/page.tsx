import { getPosts, getCategories, WordPressPost } from '@/app/lib/WordPress';
import Image from 'next/image';
import Link from 'next/link';

interface ArticlesPageProps {
  searchParams: Promise<{
    page?: string;
    kategoria?: string;
  }>;
}

const POSTS_PER_PAGE = 12;

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const categories = await getCategories();
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const selectedCategory = categories.find(
    cat => cat.slug === params.kategoria
  );

  const posts = await getPosts(
    POSTS_PER_PAGE,
    'date',
    selectedCategory?.id,
    page
  );

  const totalPosts = selectedCategory
    ? selectedCategory.count
    : categories.reduce((acc, cat) => acc + cat.count, 0);
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {selectedCategory ? selectedCategory.name : 'Všetky články'}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              {selectedCategory?.description ||
                'Objavte všetky naše články o zdraví, životnom štýle a wellness'}
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
                  !selectedCategory
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Všetky články
            </Link>
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/clanky?kategoria=${category.slug}`}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm 
                  font-medium transition-colors ${
                    selectedCategory?.id === category.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
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
            {posts.map((post: WordPressPost, index) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm 
                  hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9]">
                  {post._embedded?.['wp:featuredmedia'] ? (
                    <Image
                      src={post._embedded['wp:featuredmedia'][0].source_url}
                      alt={post.title.rendered}
                      fill
                      sizes="(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 30vw"
                      className="object-cover transition-transform duration-300 
                        group-hover:scale-105"
                      loading={index < 6 ? 'eager' : 'lazy'}
                      quality={80}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+JjHmsnLLKKRnHbwKJ3FlAm2O0UfGYJeO5Jp7Dcp3OHGMYd4b6aLgEJP5SjsNQFZAo9O5B+tWRcWlwJ3txdPGFVKdWKdlL8Whe2ZTBqD7+4I2HHDZ8Q/I4U4Q7XSB8ikEKDMBOGAyMPEtwq57Ck2xD/9k="
                    />
                  ) : (
                    <div
                      className="w-full h-full bg-gradient-to-br from-emerald-500 
                      to-teal-600"
                    />
                  )}
                </div>
                <div className="p-6">
                  {post.categories?.[0] && (
                    <Link
                      href={`/clanky?kategoria=${post.categories[0].slug}`}
                      className="text-emerald-600 text-sm font-medium mb-2 
                        hover:text-emerald-700 transition-colors inline-block"
                    >
                      {post.categories[0].name}
                    </Link>
                  )}
                  <h2
                    className="text-xl font-bold text-gray-900 mb-3 
                      group-hover:text-emerald-600 transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div
                    className="text-gray-600 mb-4 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                  <div className="flex items-center justify-between">
                    <time className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString('sk-SK', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <span
                      className="text-emerald-600 font-medium inline-flex 
                      items-center group-hover:translate-x-1 transition-transform"
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
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/clanky?${
                    selectedCategory
                      ? `kategoria=${selectedCategory.slug}&`
                      : ''
                  }page=${page - 1}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                    border border-gray-300 rounded-lg hover:bg-gray-50 
                    transition-colors"
                >
                  Predchádzajúca
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/clanky?${
                    selectedCategory
                      ? `kategoria=${selectedCategory.slug}&`
                      : ''
                  }page=${page + 1}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                    border border-gray-300 rounded-lg hover:bg-gray-50 
                    transition-colors"
                >
                  Ďalšia
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Články | Zdravie v praxi',
  description: 'Prehľad všetkých článkov o zdraví, životnom štýle a wellness',
};
