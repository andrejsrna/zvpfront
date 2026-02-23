import Image from 'next/image';
import Link from 'next/link';
import { getPosts } from '@/app/lib/content/server';
import { safeHeDecode } from '@/app/lib/sanitizeHTML';

export default async function Hero() {
  const posts = await getPosts(1);

  if (!posts || posts.length === 0) {
    return null;
  }

  // Get a random post from the first page
  const randomIndex = Math.floor(Math.random() * posts.length);
  const featuredPost = posts[randomIndex];

  const imageUrl = featuredPost.featuredImage;
  const imageAlt = featuredPost.title.rendered;
  const isRemoteImage = !!imageUrl && /^https?:\/\//i.test(imageUrl);

  // Strip HTML tags from excerpt and limit to 150 characters
  const excerpt =
    safeHeDecode(featuredPost.excerpt.rendered)
      .replace(/<[^>]*>/g, '')
      .slice(0, 150)
      .trim()
      .replace(/\s+/g, ' ') + '...';

  // Format date
  const publishDate = new Date(featuredPost.date).toLocaleDateString('sk-SK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="relative py-32 h-[100vh] min-h-[600px] w-full overflow-hidden bg-gradient-to-br from-[#3e802b]/5 to-[#4a9a35]/10">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#3e802b]/20 rounded-full blur-3xl" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#4a9a35]/15 rounded-full blur-3xl" />
        <div className="absolute left-1/2 top-1/2 w-96 h-96 bg-[#3e802b]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 h-full">
        <div className="grid lg:grid-cols-2 gap-8 h-full items-center">
          {/* Content */}
          <div className="space-y-8 max-w-xl">
            <div className="flex items-center space-x-4">
              <span
                className="flex items-center px-4 py-2 bg-[#3e802b]/10 text-[#3e802b] 
                rounded-full text-sm font-medium border border-[#3e802b]/30"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Zdravie v praxi
              </span>
              <span className="text-sm text-gray-600">{publishDate}</span>
            </div>

            {/* Title */}
            <h1
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 
              leading-tight tracking-tight font-sora"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: featuredPost.title.rendered,
                }}
              />
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-gray-700 leading-relaxed font-inter">
              {excerpt}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${featuredPost.slug}`}
                className="group inline-flex items-center justify-center px-6 py-3
                  bg-[#3e802b] text-white rounded-lg font-medium
                  transform transition-all duration-200
                  hover:bg-[#4a9a35] hover:scale-105 hover:shadow-lg"
              >
                Prečítať článok
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
              <Link
                href="/clanky"
                className="inline-flex items-center justify-center px-6 py-3
                  border-2 border-[#3e802b] text-[#3e802b] rounded-lg font-medium
                  transform transition-all duration-200
                  hover:bg-[#3e802b]/10 hover:scale-105"
              >
                Všetky články
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="hidden lg:block relative w-full">
            <div
              className="aspect-[4/3] relative bg-gradient-to-br from-[#3e802b]/20 to-[#4a9a35]/30 
              rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover rounded-3xl mix-blend-overlay"
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  quality={80}
                  unoptimized={isRemoteImage}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHR4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+JjHmsnLLKKRnHbwKJ3FlAm2O0UfGYJeO5Jp7Dcp3OHGMYd4b6aLgEJP5SjsNQFZAo9O5B+tWRcWlwJ3txdPGFVKdWKdlL8Whe2ZTBqD7+4I2HHDZ8Q/I4U4Q7XSB8ikEKDMBOGAyMPEtwq57Ck2xD/9k="
                />
              ) : (
                <div
                  className="w-full h-full bg-gradient-to-br from-[#3e802b]/30 to-[#4a9a35]/40 
                  animate-pulse"
                />
              )}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#3e802b]/30 
                to-transparent rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
