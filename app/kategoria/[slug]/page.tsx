import { getCategories, getPosts, WordPressPost, WordPressCategory } from "@/app/lib/WordPress";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

const POSTS_PER_PAGE = 12;

export default async function CategoryPage({ params: paramsPromise, searchParams }: CategoryPageProps) {
  const params = await paramsPromise;
  const searchParamsResolved = await searchParams;
  const categories = await getCategories();
  
  // Rekurzívne hľadanie kategórie (vrátane podkategórií)
  const findCategory = (cats: WordPressCategory[], slug: string): WordPressCategory | undefined => {
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
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 mt-20 py-20">
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
              {totalPosts} {totalPosts === 1 ? 'článok' : 
                totalPosts < 5 ? 'články' : 'článkov'}
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
                  font-medium transition-colors bg-emerald-600 text-white`}
              >
                Všetky v {category.name}
              </Link>
              {subCategories.map((subCat) => (
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
            {posts.map((post: WordPressPost) => (
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
                      className="object-cover transition-transform duration-300 
                        group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 
                      to-teal-600" />
                  )}
                </div>
                <div className="p-6">
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
                        year: 'numeric'
                      })}
                    </time>
                    <span className="text-emerald-600 font-medium inline-flex 
                      items-center group-hover:translate-x-1 transition-transform">
                      Čítať viac
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" 
                        viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" 
                          strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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

export async function generateMetadata({ params: paramsPromise }: CategoryPageProps) {
  const params = await paramsPromise;
  const categories = await getCategories();
  const category = categories.find(cat => cat.slug === params.slug);

  if (!category) {
    return {
      title: 'Kategória nenájdená',
      description: 'Požadovaná kategória sa nenašla'
    };
  }

  return {
    title: `${category.name} | Zdravie v praxi`,
    description: category.description || `Články z kategórie ${category.name}`,
  };
}
