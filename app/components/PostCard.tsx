import Link from 'next/link';
import Image from 'next/image';
import { WordPressPost, transformUrl } from '../lib/WordPress';
import { sanitizeExcerpt } from '@/app/lib/sanitizeHTML';

interface PostCardProps {
  post: WordPressPost;
  index?: number;
  showCategory?: boolean;
  showDate?: boolean;
  showReadMore?: boolean;
  className?: string;
}

export default function PostCard({
  post,
  index = 0,
  showCategory = true,
  showDate = true,
  showReadMore = true,
  className = '',
}: PostCardProps) {
  return (
    <Link
      href={`/${post.slug}`}
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl 
        transition-all duration-500 overflow-hidden border border-gray-100 
        hover:border-[#3e802b]/20 hover:-translate-y-1 ${className}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {post._embedded?.['wp:featuredmedia'] ? (
          <Image
            src={transformUrl(post._embedded['wp:featuredmedia'][0].source_url)}
            alt={post.title.rendered}
            fill
            sizes="(max-width: 768px) 95vw, (max-width: 1200px) 45vw, 30vw"
            className="object-cover transition-all duration-700 
              group-hover:scale-110 group-hover:rotate-1"
            loading={index < 3 ? 'eager' : 'lazy'}
            priority={index < 3}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+JjHmsnLLKKRnHbwKJ3FlAm2O0UfGYJeO5Jp7Dcp3OHGMYd4b6aLgEJP5SjsNQFZAo9O5B+tWRcWlwJ3txdPGFVKdWKdlL8Whe2ZTBqD7+4I2HHDZ8Q/I4U4Q7XSB8ikEKDMBOGAyMPEtwq57Ck2xD/9k="
          />
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-[#3e802b]/10 
            to-[#4a9a35]/20 flex items-center justify-center"
          >
            <svg
              className="w-16 h-16 text-[#3e802b] opacity-40 group-hover:opacity-60 transition-opacity duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {showCategory && post.categories && post.categories.length > 0 && (
          <span
            className="absolute top-4 left-4 bg-[#3e802b] text-white 
            text-xs px-3 py-1.5 rounded-full font-medium shadow-lg
            backdrop-blur-sm bg-opacity-90 hover:bg-opacity-100 transition-all duration-300"
          >
            {post.categories[0].name}
          </span>
        )}

        {/* Date badge */}
        {showDate && (
          <span
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 
            text-xs px-2.5 py-1 rounded-full font-medium shadow-sm
            group-hover:bg-white group-hover:shadow-md transition-all duration-300"
          >
            {new Date(post.date).toLocaleDateString('sk-SK', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Title with improved typography */}
        <h3
          className="text-xl font-bold text-gray-900 leading-tight
          group-hover:text-[#3e802b] transition-colors duration-300 line-clamp-2 font-sora"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Excerpt with better spacing */}
        <div
          className="text-gray-600 text-sm leading-relaxed line-clamp-3
          group-hover:text-gray-700 transition-colors duration-300"
          dangerouslySetInnerHTML={{
            __html: sanitizeExcerpt(post.excerpt.rendered),
          }}
        />

        {/* Bottom section with improved layout */}
        {showReadMore && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 group-hover:border-[#3e802b]/20 transition-colors duration-300">
            <span className="text-[#3e802b] font-semibold text-sm flex items-center group-hover:scale-105 transition-transform duration-300">
              Čítať viac
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3e802b]/5 to-[#4a9a35]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Link>
  );
}
