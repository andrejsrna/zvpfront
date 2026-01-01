import type { ContentCategory, ContentPost, ContentSearchResult } from './types';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? `\n${text}` : ''}`);
  }
  return res.json();
}

export async function getRecentPosts(limit: number = 6): Promise<ContentPost[]> {
  return fetchJson(`/api/posts/recent?limit=${encodeURIComponent(String(limit))}`);
}

export async function getPopularCategories(
  limit: number = 4
): Promise<ContentCategory[]> {
  return fetchJson(
    `/api/categories/popular?limit=${encodeURIComponent(String(limit))}`
  );
}

export async function getRandomPost(): Promise<ContentPost | null> {
  const data = await fetchJson<{ post: ContentPost | null }>(`/api/posts/random`);
  return data.post;
}

export async function getPostsByCategory(
  categoryId: number,
  limit: number = 20,
  excludePostId?: number
): Promise<ContentPost[]> {
  const params = new URLSearchParams({
    categoryId: String(categoryId),
    limit: String(limit),
  });
  if (excludePostId) params.set('excludePostId', String(excludePostId));
  return fetchJson(`/api/posts/by-category?${params.toString()}`);
}

export async function advancedSearch(
  query: string,
  perPage: number = 10,
  page: number = 1
): Promise<ContentSearchResult> {
  const params = new URLSearchParams({
    q: query,
    perPage: String(perPage),
    page: String(page),
  });
  return fetchJson(`/api/search?${params.toString()}`);
}

