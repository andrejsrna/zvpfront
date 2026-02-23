import { MetadataRoute } from 'next';
import { getAllPosts, getCategories, getTags } from '@/app/lib/content/server';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zdravievpraxi.sk';

  const posts = await getAllPosts();
  const latestPostModifiedMs = posts.reduce((max, post) => {
    const t = new Date(post.modified || post.date).getTime();
    return Number.isFinite(t) ? Math.max(max, t) : max;
  }, 0);
  const lastModifiedSiteWide =
    latestPostModifiedMs > 0 ? new Date(latestPostModifiedMs) : new Date();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: lastModifiedSiteWide,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/clanky`,
      lastModified: lastModifiedSiteWide,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kategorie`,
      lastModified: lastModifiedSiteWide,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: lastModifiedSiteWide,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ochrana-sukromia`,
      lastModified: lastModifiedSiteWide,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/podmienky-pouzivania`,
      lastModified: lastModifiedSiteWide,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: lastModifiedSiteWide,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  const postUrls = posts.map(post => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.modified || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const categories = await getCategories();
  const categoryUrls = categories.map(category => ({
    url: `${baseUrl}/kategoria/${category.slug}`,
    lastModified: lastModifiedSiteWide,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const tags = await getTags();
  const tagIndexUrl = {
    url: `${baseUrl}/tag`,
    lastModified: lastModifiedSiteWide,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  };
  const tagUrls = tags.map(tag => ({
    url: `${baseUrl}/tag/${tag.slug}`,
    lastModified: lastModifiedSiteWide,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // Ensure unique URLs in case of conflicts.
  const entries = [
    ...staticPages,
    ...postUrls,
    ...categoryUrls,
    tagIndexUrl,
    ...tagUrls,
  ];
  const unique = new Map<string, (typeof entries)[number]>();
  for (const entry of entries) unique.set(entry.url, entry);
  return Array.from(unique.values());
}
