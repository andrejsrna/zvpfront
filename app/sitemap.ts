import { MetadataRoute } from 'next';
import { getPosts, getCategories } from '@/app/lib/WordPress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zdravievpraxi.sk';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/clanky`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kategorie`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ochrana-sukromia`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/podmienky-pouzivania`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  try {
    // Get fewer posts to avoid timeout - sitemap will be generated at runtime too
    const posts = await getPosts(50, 'date');
    const postUrls = posts.map(post => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Get categories for dynamic URLs
    const categories = await getCategories();
    const categoryUrls = categories.map(category => ({
      url: `${baseUrl}/kategoria/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...postUrls, ...categoryUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static pages if API fails
    return staticPages;
  }
}
