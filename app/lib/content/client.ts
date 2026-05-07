import type {
  ContentCategory,
  ContentPost,
  ContentSearchResult,
  ContentTag,
} from './types';

type StaticContentIndexPost = ContentPost & {
  searchText?: string;
};

type StaticContentIndex = {
  posts: StaticContentIndexPost[];
  categories: ContentCategory[];
  tags: ContentTag[];
};

let contentIndexPromise: Promise<StaticContentIndex> | null = null;

async function getContentIndex(): Promise<StaticContentIndex> {
  if (!contentIndexPromise) {
    contentIndexPromise = fetch('/content-index.json', {
      headers: { Accept: 'application/json' },
    }).then(async response => {
      if (!response.ok) {
        throw new Error(`Failed to load static content index: HTTP ${response.status}`);
      }
      return response.json();
    });
  }

  return contentIndexPromise;
}

function publicPost(post: StaticContentIndexPost): ContentPost {
  const { searchText: _searchText, ...rest } = post;
  return rest;
}

export async function getRecentPosts(limit: number = 6): Promise<ContentPost[]> {
  const { posts } = await getContentIndex();
  return posts.slice(0, limit).map(publicPost);
}

export async function getPopularCategories(
  limit: number = 4
): Promise<ContentCategory[]> {
  const { categories } = await getContentIndex();
  return categories.slice(0, limit);
}

export async function getRandomPost(): Promise<ContentPost | null> {
  const { posts } = await getContentIndex();
  if (!posts.length) return null;
  const index = Math.floor(Math.random() * posts.length);
  return publicPost(posts[index]);
}

export async function getPostsByCategory(
  categoryId: number,
  limit: number = 20,
  excludePostId?: number
): Promise<ContentPost[]> {
  const { posts } = await getContentIndex();
  return posts
    .filter(post => post.categories.some(category => category.id === categoryId))
    .filter(post => !excludePostId || post.id !== excludePostId)
    .slice(0, limit)
    .map(publicPost);
}

export async function advancedSearch(
  query: string,
  perPage: number = 10,
  page: number = 1
): Promise<ContentSearchResult> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { posts: [], total: 0, totalPages: 0 };

  const { posts } = await getContentIndex();
  const words = q.split(/\s+/).filter(word => word.length > 2);
  const scored = posts
    .map(post => {
      const haystack = post.searchText || '';
      let score = 0;
      if (haystack.includes(q)) score += 50;
      for (const word of words) {
        if (haystack.includes(word)) score += 5;
      }
      return { post, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const total = scored.length;
  const totalPages = Math.ceil(total / perPage);
  const start = Math.max(0, (page - 1) * perPage);

  return {
    posts: scored.slice(start, start + perPage).map(item => publicPost(item.post)),
    total,
    totalPages,
  };
}
