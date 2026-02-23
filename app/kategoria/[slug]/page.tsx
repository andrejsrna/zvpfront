import {
  getCategories,
  getPosts,
} from '@/app/lib/content/server';
import type { ContentCategory, ContentPost } from '@/app/lib/content/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { sanitizeExcerpt, safeHeDecode } from '@/app/lib/sanitizeHTML';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

const POSTS_PER_PAGE = 12;

export const revalidate = 3600;

export default async function CategoryPage({
  params: paramsPromise,
  searchParams,
}: CategoryPageProps) {
  const params = await paramsPromise;
  const searchParamsResolved = await searchParams;
  const categories = await getCategories();

  // Rekurzívne hľadanie kategórie (vrátane podkategórií)
  const findCategory = (
    cats: ContentCategory[],
    slug: string
  ): ContentCategory | undefined => {
    for (const cat of cats) {
      if (cat.slug === slug) return cat;
      if (cat.children?.length) {
        const found = findCategory(cat.children, slug);
        if (found) return found;
      }
    }
  };

  const category = findCategory(categories, params.slug);

  if (!category) {
    notFound();
  }

  // Získaj podkategórie aktuálnej kategórie
  const subCategories = categories.filter(cat => cat.parent === category.id);

  const page = Number(searchParamsResolved.page) || 1;
  const posts = await getPosts(POSTS_PER_PAGE, 'date', category.id, page);
  const totalPosts = category.count;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="bg-white">
      {/* Category Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 mt-20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            <div className="mt-4 text-white/80">
              {totalPosts}{' '}
              {totalPosts === 1
                ? 'článok'
                : totalPosts < 5
                  ? 'články'
                  : 'článkov'}
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories Filter - zobrazí sa len ak existujú podkategórie */}
      {subCategories.length > 0 && (
        <div className="border-b">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto py-4 -mx-4 px-4 gap-2 scrollbar-hide">
              <Link
                href={`/kategoria/${category.slug}`}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm 
                  font-medium transition-colors bg-primary text-white`}
              >
                Všetky v {category.name}
              </Link>
              {subCategories.map(subCat => (
                <Link
                  key={subCat.id}
                  href={`/kategoria/${subCat.slug}`}
                  className="px-4 py-2 rounded-full whitespace-nowrap text-sm 
                    font-medium transition-colors bg-gray-100 text-gray-700 
                    hover:bg-gray-200"
                >
                  {subCat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
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
                  <h3
                    className="text-xl font-bold text-gray-900 mb-3
                      hover:text-primary/80 transition-colors"
                  >
                    <Link href={`/${post.slug}`}>
                      {safeHeDecode(post.title.rendered)}
                    </Link>
                  </h3>
                  <div
                    className="text-gray-600 mb-4 line-clamp-2"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/kategoria/${params.slug}?page=${page - 1}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                    border border-gray-300 rounded-lg hover:bg-gray-50 
                    transition-colors"
                >
                  Predchádzajúca
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/kategoria/${params.slug}?page=${page + 1}`}
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

export async function generateMetadata({
  params: paramsPromise,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const params = await paramsPromise;
  const searchParamsResolved = await searchParams;
  const page = Number(searchParamsResolved.page) || 1;
  const categories = await getCategories();
  const category = categories.find(cat => cat.slug === params.slug);

  if (!category) {
    return {
      title: 'Kategória nenájdená',
      description: 'Požadovaná kategória sa nenašla',
    };
  }

  const title = `${category.name}${page > 1 ? ` – strana ${page}` : ''} | Zdravie v praxi`;
  const description = category.description || `Články z kategórie ${category.name}`;
  const canonical = `/kategoria/${category.slug}${page > 1 ? `?page=${page}` : ''}`;

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
