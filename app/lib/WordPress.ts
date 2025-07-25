import { unstable_cache } from 'next/cache';

// Types
interface WordPressTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy?: 'category' | 'post_tag';
}

interface WordPressMedia {
  source_url: string;
  alt_text: string;
  media_details?: {
    sizes?: Record<
      string,
      {
        source_url: string;
        width: number;
        height: number;
      }
    >;
  };
}

interface WordPressReference {
  nazov: string;
  odkaz: string;
}

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  categories: WordPressTerm[];
  meta: {
    post_views: number;
    _zdroje_referencie: WordPressReference[];
  };
  tags: WordPressTerm[];
  featured_media?: number;
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: WordPressTerm[][];
  };
}

export interface WordPressCategory extends WordPressTerm {
  count: number;
  description: string;
  link: string;
  taxonomy: 'category' | 'post_tag';
  parent: number;
  children?: WordPressCategory[];
}

// Constants
const API_CONFIG = {
  BASE_URL: 'https://admin.zdravievpraxi.sk/wp-json',
  TIMEOUT: 3000,
  SEARCH_TIMEOUT: 5000,
  REVALIDATE: {
    POSTS: 3600,
    CATEGORIES: 7200,
    SINGLE_POST: 1800,
    SEARCH: 0,
  },
} as const;

// API Client
class WordPressClient {
  private static getApiUrl(): string {
    return typeof window === 'undefined' ? API_CONFIG.BASE_URL : '/wp-json';
  }

  private static async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = API_CONFIG.TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  static transformUrl(url: string): string {
    if (!url) return url;
    return typeof window !== 'undefined' && url.includes(API_CONFIG.BASE_URL)
      ? url.replace(API_CONFIG.BASE_URL, '')
      : url;
  }

  static async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.getApiUrl()}${endpoint}`;
      const response = await this.fetchWithTimeout(url, options);
      return response.json();
    } catch (error) {
      console.error(`WordPress API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  private static async getPostsUncached(
    perPage: number = 12,
    orderby: string = 'date',
    categoryId?: number,
    page: number = 1
  ): Promise<WordPressPost[]> {
    const categoryParam = categoryId
      ? `&categories=${categoryId}&include_children=true`
      : '';
    const posts = await this.fetch<WordPressPost[]>(
      `/wp/v2/posts?_embed&per_page=${perPage}&orderby=${orderby}&order=desc${categoryParam}&page=${page}`
    );

    // Process embedded terms for categories and tags
    return posts.map(post => {
      if (post._embedded?.['wp:term']) {
        post.categories = post._embedded['wp:term'][0] || post.categories;
        post.tags = post._embedded['wp:term'][1] || post.tags;
      }
      return post;
    });
  }

  private static async getCategoriesUncached(): Promise<WordPressCategory[]> {
    return this.fetch<WordPressCategory[]>(
      '/wp/v2/categories?per_page=100&orderby=count&order=desc'
    );
  }

  // Server-side cached versions
  private static getPostsCached = unstable_cache(
    async (
      perPage: number = 12,
      orderby: string = 'date',
      categoryId?: number,
      page: number = 1
    ) => {
      try {
        return await this.getPostsUncached(perPage, orderby, categoryId, page);
      } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
      }
    },
    ['wordpress-posts'],
    {
      revalidate: API_CONFIG.REVALIDATE.POSTS,
      tags: ['posts'],
    }
  );

  private static getCategoriesCached = unstable_cache(
    async () => {
      try {
        return await this.getCategoriesUncached();
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
    ['wordpress-categories'],
    {
      revalidate: API_CONFIG.REVALIDATE.CATEGORIES,
      tags: ['categories'],
    }
  );

  // Public methods that choose cached or uncached based on environment
  static async getPosts(
    perPage: number = 12,
    orderby: string = 'date',
    categoryId?: number,
    page: number = 1
  ): Promise<WordPressPost[]> {
    // Use cached version only on server-side
    if (typeof window === 'undefined') {
      return this.getPostsCached(perPage, orderby, categoryId, page);
    }
    // Use uncached version on client-side
    try {
      return await this.getPostsUncached(perPage, orderby, categoryId, page);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  static async getCategories(): Promise<WordPressCategory[]> {
    // Use cached version only on server-side
    if (typeof window === 'undefined') {
      return this.getCategoriesCached();
    }
    // Use uncached version on client-side
    try {
      return await this.getCategoriesUncached();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static async getPostBySlug(slug: string): Promise<WordPressPost | null> {
    try {
      // Validate slug format
      if (!slug || typeof slug !== 'string' || slug.trim() === '') {
        console.warn('Invalid slug provided:', slug);
        return null;
      }

      // Sanitize slug to prevent issues
      const cleanSlug = slug.trim().toLowerCase();

      const url = `${this.getApiUrl()}/wp/v2/posts?_embed&slug=${encodeURIComponent(cleanSlug)}`;
      const response = await this.fetchWithTimeout(url, {}, API_CONFIG.TIMEOUT);
      const posts = await response.json();

      if (!Array.isArray(posts) || posts.length === 0) {
        console.info(`No post found for slug: ${cleanSlug}`);
        return null;
      }

      const post = posts[0];

      if (post._embedded?.['wp:term']) {
        post.categories = post._embedded['wp:term'][0] || post.categories;
        post.tags = post._embedded['wp:term'][1] || post.tags;
      }

      return post;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          console.info(`Post not found for slug: ${slug}`);
          return null;
        }
        if (error.message.includes('timeout')) {
          console.warn(`Request timeout for slug: ${slug}`);
          return null;
        }
      }
      console.error('Error fetching post:', error);
      return null;
    }
  }

  static async getRandomPost(): Promise<WordPressPost[]> {
    try {
      const url = `${this.getApiUrl()}/custom/v1/random-posts`;
      const response = await this.fetchWithTimeout(url);
      return response.json();
    } catch (error) {
      console.error('Error fetching random posts:', error);
      return [];
    }
  }

  static async searchPosts(
    query: string,
    perPage: number = 10,
    page: number = 1
  ): Promise<{ posts: WordPressPost[]; total: number; totalPages: number }> {
    try {
      const url = `${this.getApiUrl()}/wp/v2/posts?_embed&search=${encodeURIComponent(
        query
      )}&per_page=${perPage}&page=${page}`;

      const response = await this.fetchWithTimeout(
        url,
        {},
        API_CONFIG.SEARCH_TIMEOUT
      );
      const posts = await response.json();
      const total = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPages = parseInt(
        response.headers.get('X-WP-TotalPages') || '0'
      );

      // Process embedded terms for categories and tags
      const processedPosts = posts.map((post: WordPressPost) => {
        if (post._embedded?.['wp:term']) {
          post.categories = post._embedded['wp:term'][0] || post.categories;
          post.tags = post._embedded['wp:term'][1] || post.tags;
        }
        return post;
      });

      return { posts: processedPosts, total, totalPages };
    } catch (error) {
      console.error('Error searching posts:', error);
      return { posts: [], total: 0, totalPages: 0 };
    }
  }
}

// Export public API with proper context binding
export const transformUrl = WordPressClient.transformUrl.bind(WordPressClient);
export const getPosts = WordPressClient.getPosts.bind(WordPressClient);
export const getPostBySlug =
  WordPressClient.getPostBySlug.bind(WordPressClient);
export const getCategories =
  WordPressClient.getCategories.bind(WordPressClient);
export const getRandomPost =
  WordPressClient.getRandomPost.bind(WordPressClient);
export const searchPosts = WordPressClient.searchPosts.bind(WordPressClient);
