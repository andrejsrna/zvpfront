import { getPostBySlug } from "@/app/lib/WordPress";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RecommendedReads from "@/app/components/RecommendedReads";
import Newsletter from "@/app/components/Newsletter";   
import { parseHeadings } from "@/app/utils/parseHeadings";
import ShareButtons from "../components/UI/ShareButtons";
import Comments from "@/app/components/UI/Comments";
import WeRecommend from "@/app/components/UI/WeRecommend";
import ReadMore from "@/app/components/UI/ReadMore";
import he from 'he';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Reference {
  nazov: string;
  odkaz: string;
}

export default async function PostPage({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Extract headings from content
  const { headings, content } = parseHeadings(he.decode(post.content.rendered));
    
  // Schema.org Article markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": he.decode(post.title.rendered),
    "description": he.decode(post.excerpt.rendered.replace(/<[^>]*>/g, '')),
    "image": post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    "datePublished": post.date,
    "dateModified": post.modified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Zdravie v praxi",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
      }
    }
  };
    
  // Parse references from meta
  const references: Reference[] = post.meta?._zdroje_referencie || [];

  return (
    <article className="bg-white">
      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        {post._embedded?.['wp:featuredmedia'] ? (
          <>
            <Image
              src={post._embedded['wp:featuredmedia'][0].source_url}
              alt={post.title.rendered}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 
              via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 
            to-teal-600" />
        )}      

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-4xl">
            {post.categories && post.categories[0] && (
              <Link
                href={`/kategoria/${post.categories[0].slug}`}
                className="inline-block px-4 py-1.5 bg-emerald-500 text-white 
                  text-sm font-medium rounded-full mb-4 hover:bg-emerald-600 
                  transition-colors"
              >
                {post.categories[0].name}
              </Link>
            )}
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              dangerouslySetInnerHTML={{ __html: he.decode(post.title.rendered) }}
            />
            <div className="flex items-center text-white/90 space-x-4 text-sm">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('sk-SK', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            </div>

          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          {headings.length > 0 && (
            <div className="mb-12 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-4">
                Obsah článku
              </h2>
              <nav>
                <ul className="space-y-2">
                  {headings.map((heading, index) => (
                    <li 
                      key={index}
                      className={`${
                        heading.level === 2 ? 'ml-0' : 'ml-4'
                      }`}
                    >
                      <a
                        href={`#${heading.id}`}
                        className="text-emerald-600 hover:text-emerald-700 
                          transition-colors text-sm"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}

          {/* Main Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-heading 
              prose-headings:text-gray-900 prose-a:text-emerald-600 
              hover:prose-a:text-emerald-700 prose-img:rounded-xl 
              prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: he.decode(content) }}
          />

          {/* References Section */}
          {references.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Zdroje a referencie
              </h2>
              <div className="space-y-4">
                {references.map((ref, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-sm text-gray-500 mr-2">
                      [{index + 1}]
                    </span>
                    <div>
                      <a
                        href={ref.odkaz}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 
                          transition-colors hover:underline"
                      >
                        {ref.nazov}
                      </a>
                      <span className="text-gray-400 text-sm ml-2">
                        {new URL(ref.odkaz).hostname}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm 
                      rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
<ShareButtons 
  url={`${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`}
  title={post.title.rendered}
  description={post.excerpt.rendered.replace(/<[^>]*>/g, '')}
/>
{post.tags?.some(tag => tag.slug === 'klby') && (
        <WeRecommend />
      )}
<Comments 
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`}
        identifier={post.slug}
        title={post.title.rendered}
      />
      {/* Related Posts */}
      <RecommendedReads 
        currentPostId={post.id}
        currentCategoryId={post.categories?.[0]?.id}
      />
      <Newsletter/>
      {post.categories?.[0] && (
        <ReadMore
          categoryId={post.categories[0].id}
          categoryName={post.categories[0].name}
          categorySlug={post.categories[0].slug}
          currentPostId={post.id}
        />
      )}
    </article>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;
  const post = await Promise.resolve(getPostBySlug(params.slug));

  if (!post) {
    return {
      title: 'Článok nenájdený',
      description: 'Požadovaný článok sa nenašiel'
    };
  }

  const cleanDescription = he.decode(post.excerpt.rendered.replace(/<[^>]*>/g, '')).slice(0, 160);

  return {
    title: he.decode(post.title.rendered),
    description: cleanDescription,
    openGraph: {
      title: he.decode(post.title.rendered),
      description: cleanDescription,
      images: post._embedded?.['wp:featuredmedia'] 
        ? [post._embedded['wp:featuredmedia'][0].source_url] 
        : [],
    },
  };
}
